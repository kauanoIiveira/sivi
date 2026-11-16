import { ROUTE_PATHS } from "../../app/routes.js";
import { uiIcon } from "../../components/ui-icon.js";
import { isSupplierIdentifier } from "../../domain/match-engine.js";
import { MESSAGE_MAX_LENGTH, MESSAGE_PAGE_SIZE } from "../../repositories/firebase-conversations.js";

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo",
});
const localFallback = new Map();

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(word => Array.from(word)[0]).join("").toLocaleUpperCase("pt-BR");
}

export function mountConversationsPage({ container, workspace, repository, onReady = () => {} }) {
  const { id: workspaceId, organizationRole } = workspace;
  const isBuyer = organizationRole === "buyer";
  const inboxPath = isBuyer ? ROUTE_PATHS.buyerConversations : ROUTE_PATHS.supplierConversations;
  const api = repository.conversations;
  const params = new URLSearchParams(location.hash.split("?")[1]);
  const [requested, duplicate] = params.getAll("registro");
  const peerId = duplicate === undefined && isSupplierIdentifier(requested) && requested !== workspace.organizationId ? requested : null;
  const references = [...params].filter(([kind]) => ['pedido', 'proposta'].includes(kind));
  const reference = references.length === 1 ? { kind: references[0][0], id: references[0][1] } : undefined;
  const storageKey = (kind, peer) => `sivi.chat.${kind}.v1:${JSON.stringify([workspace.memberUid ?? 'preview', workspaceId, peer])}`;
  const getStored = (storage, key) => {
    if (localFallback.has(key)) return localFallback.get(key);
    try { return window[storage].getItem(key) ?? ''; } catch { return ''; }
  };
  const setStored = (storage, key, value) => {
    try {
      if (value) window[storage].setItem(key, value);
      else window[storage].removeItem(key);
      localFallback.delete(key);
    } catch {
      localFallback.set(key, value);
    }
  };
  let alive = true;
  let stopInbox = () => {};
  let stopThread = () => {};
  let currentPeer;
  let checkingProfile = false;
  let updatePeer;
  let connected = true;
  let onConnectivity = () => {};
  let markVisible = () => {};
  const stopConnection = api.watchConnection?.(value => {
    connected = value;
    onConnectivity();
  });

  const page = element("section", "workspace-page conversations-page");
  page.dataset.threadOpen = String(Boolean(peerId));
  page.innerHTML = `
    <header class="workspace-page__header">
      <div>
        <h1 data-page-title>Conversas</h1>
        <p>Fale com empresas pelo SIVI.</p>
      </div>
    </header>
    <div class="workspace-panel conversations-layout">
      <section class="conversations-inbox" aria-label="Caixa de entrada">
        <header class="conversations-panel-header"><h2>Caixa de entrada</h2></header>
        <div class="conversations-inbox-content"></div>
      </section>
      <section class="conversations-thread" aria-label="Conversa selecionada"></section>
    </div>`;
  container.replaceChildren(page);
  const inbox = page.querySelector(".conversations-inbox-content");
  const thread = page.querySelector(".conversations-thread");

  function link(label, href, className = "marketplace-button") {
    const anchor = element("a", className, label);
    anchor.href = `#${href}`;
    return anchor;
  }

  function notice(target, title, detail, action) {
    const content = element("div", "conversations-notice");
    const symbol = element("span", "conversations-symbol");
    symbol.innerHTML = uiIcon("proposals");
    content.append(symbol, element("p", "conversations-notice-title", title));
    if (detail) content.append(element("p", "", detail));
    if (action) content.append(action);
    target.replaceChildren(content);
  }

  function retry(onClick) {
    const button = element("button", "marketplace-button", "Tentar novamente");
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  }

  function threadNotice(title, detail, action) {
    const back = link("Voltar à caixa de entrada", inboxPath, "conversations-back");
    notice(thread, title, detail, action);
    if (peerId) thread.prepend(back);
  }

  function openConversation(contact) {
    if (currentPeer) {
      if (contact.exists) updatePeer();
      return;
    }
    currentPeer = contact;
    const header = element("header", "conversations-panel-header conversations-thread-header");
    const counterpart = element("div", "conversations-counterpart");
    const avatar = element("span", "conversations-avatar", initials(contact.name));
    avatar.setAttribute("aria-hidden", "true");
    counterpart.append(avatar, element("h2", "", contact.name));
    header.append(link("Voltar à caixa de entrada", inboxPath, "conversations-back"), counterpart);
    if (isBuyer) header.append(link("Ver perfil", `${ROUTE_PATHS.buyerSupplierProfile}?${new URLSearchParams({ registro: peerId })}`));

    const history = element("div", "conversations-history");
    history.tabIndex = 0;
    history.setAttribute("aria-label", "Histórico de mensagens");
    const older = element("button", "marketplace-button conversations-older", "Carregar mensagens anteriores");
    older.type = "button";
    older.hidden = true;
    const empty = element("p", "conversations-history-empty");
    const list = element("ol", "conversations-messages");
    history.append(older, empty, list);

    const form = element("form", "conversations-compose");
    const label = element("label", "", "Mensagem");
    label.htmlFor = "conversation-message";
    const input = element("textarea");
    input.id = label.htmlFor;
    input.maxLength = MESSAGE_MAX_LENGTH;
    input.required = true;
    input.rows = 2;
    const draftKey = storageKey('draft', peerId);
    input.value = getStored('sessionStorage', draftKey).slice(0, MESSAGE_MAX_LENGTH);
    const send = element("button", "marketplace-button marketplace-button--primary", "Enviar");
    send.type = "submit";
    const feedback = element("p", "conversations-feedback");
    feedback.setAttribute("role", "status");
    const offline = element("p", "conversations-feedback");
    offline.setAttribute('role', 'status');
    const connectionRetry = retry(startHistory);
    connectionRetry.hidden = true;
    form.append(label, input, send, feedback, offline, connectionRetry);
    thread.replaceChildren(header, history, form);

    const saved = new Map();
    let latest = [];
    let hasOlder = false;
    let started = false;
    let ready = !contact.exists;
    let sending = false;
    let loadingOlder = false;
    let historyError = false;
    let firstSnapshot = true;
    const rows = new Map();

    function syncForm() {
      send.disabled = sending || !ready || !connected || !input.value.trim();
      input.readOnly = sending;
      older.disabled = loadingOlder || historyError;
      connectionRetry.hidden = !historyError;
      offline.textContent = connected ? '' : sending
        ? 'Sem conexão. O envio aguarda a reconexão.'
        : 'Sem conexão. O rascunho fica disponível até você poder enviar.';
    }
    onConnectivity = syncForm;
    markVisible = () => {
      if (latest.length && !document.hidden) setStored('localStorage', storageKey('seen', peerId), latest.at(-1).id);
    };

    function renderMessages() {
      const messages = [...saved.keys()].sort().map(id => saved.get(id)).concat(latest);
      const ids = new Set(messages.map(message => message.id));
      for (const [id, node] of rows) {
        if (!ids.has(id)) { node.remove(); rows.delete(id); }
      }
      let next = null;
      for (const message of messages.slice().reverse()) {
        let row = rows.get(message.id);
        if (!row) {
          row = element("li", "conversations-message");
          row.dataset.own = String(message.senderRole === organizationRole);
          const heading = element("div", "conversations-message-meta");
          heading.append(element("span", "", message.senderRole === organizationRole ? workspace.organizationName : contact.name), element("time"));
          row.append(heading, element("p", "", message.body));
          rows.set(message.id, row);
        }
        const time = row.querySelector("time");
        const sent = new Date(message.sentAt);
        if (Number.isFinite(sent.getTime())) {
          time.dateTime = sent.toISOString();
          time.textContent = dateTime.format(sent);
        }
        if (row.parentNode !== list || row.nextElementSibling !== next) list.insertBefore(row, next);
        next = row;
      }
      const messageCount = messages.length;
      empty.hidden = messageCount > 0;
      empty.textContent = ready ? "Envie uma mensagem para começar." : "Carregando mensagens…";
      older.hidden = !hasOlder;
    }

    function onMessages(messages) {
      if (!alive) return;
      const atEnd = firstSnapshot || history.scrollHeight - history.scrollTop - history.clientHeight < 48;
      if (firstSnapshot) hasOlder = messages.length === MESSAGE_PAGE_SIZE;
      const earliest = messages[0]?.id;
      for (const message of latest) {
        if (earliest && message.id < earliest) saved.set(message.id, message);
      }
      for (const message of messages) saved.delete(message.id);
      latest = messages;
      markVisible();
      ready = true;
      historyError = false;
      if (!firstSnapshot && messages.at(-1)?.senderRole !== organizationRole
          && messages.length > 0 && !rows.has(messages.at(-1).id)) {
        feedback.textContent = "Nova mensagem recebida.";
      }
      firstSnapshot = false;
      renderMessages();
      if (atEnd) history.scrollTop = history.scrollHeight;
      syncForm();
    }

    function startHistory() {
      started = true;
      ready = false;
      historyError = false;
      feedback.textContent = "";
      syncForm();
      if (!rows.size) renderMessages();
      stopThread();
      stopThread = api.watchMessages(workspaceId, peerId, onMessages, () => {
        if (!alive) return;
        ready = false;
        historyError = true;
        if (!rows.size) empty.textContent = "Histórico indisponível.";
        feedback.textContent = "Não foi possível carregar as mensagens.";
        syncForm();
      });
    }

    updatePeer = () => {
      contact.exists = true;
      if (!started) startHistory();
    };

    older.addEventListener("click", async () => {
      const cursor = [...saved.keys()].sort()[0] ?? latest[0]?.id;
      if (!cursor || loadingOlder) return;
      loadingOlder = true;
      syncForm();
      try {
        const messages = await api.readOlderMessages(workspaceId, peerId, cursor);
        if (!alive) return;
        const anchor = rows.get(cursor);
        const before = anchor?.getBoundingClientRect().top;
        const latestIds = new Set(latest.map(message => message.id));
        for (const message of messages) {
          if (!latestIds.has(message.id)) saved.set(message.id, message);
        }
        hasOlder = messages.length === MESSAGE_PAGE_SIZE;
        renderMessages();
        if (before !== undefined) history.scrollTop += anchor.getBoundingClientRect().top - before;
      } catch {
        if (alive) feedback.textContent = "Não foi possível carregar as mensagens anteriores.";
      } finally {
        loadingOlder = false;
        if (alive) syncForm();
      }
    });

    input.addEventListener("input", syncForm);
    input.addEventListener('input', () => setStored('sessionStorage', draftKey, input.value));
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (send.disabled) return;
      const text = input.value;
      sending = true;
      send.textContent = "Enviando…";
      feedback.textContent = "";
      syncForm();
      try {
        await api.sendMessage(workspaceId, peerId, text, { isNew: !contact.exists, reference });
        if (getStored('sessionStorage', draftKey) === text) setStored('sessionStorage', draftKey, '');
        if (!alive) return;
        if (!started) updatePeer();
        input.value = "";
        feedback.textContent = "Mensagem enviada.";
        history.scrollTop = history.scrollHeight;
      } catch {
        if (alive) feedback.textContent = "Não foi possível enviar. Seu texto continua aqui para tentar novamente.";
      } finally {
        if (alive) {
          sending = false;
          send.textContent = "Enviar";
          syncForm();
          input.focus();
        }
      }
    });
    renderMessages();
    syncForm();
    if (contact.exists) startHistory();
  }

  function renderInbox(contacts) {
    if (!alive) return;
    if (contacts.length) {
      const list = element("ul", "conversations-contacts");
      for (const contact of contacts) {
        const item = element("li");
        const anchor = link("", `${inboxPath}?${new URLSearchParams({ registro: contact.peerId })}`, "conversations-contact");
        if (contact.peerId === peerId) anchor.setAttribute("aria-current", "page");
        anchor.append(element("span", "conversations-avatar", initials(contact.name)), element("span", "", contact.name));
        anchor.firstChild.setAttribute("aria-hidden", "true");
        if (contact.peerId !== peerId && contact.lastMessage && contact.lastMessage.senderRole !== organizationRole
            && contact.lastMessage.id !== getStored('localStorage', storageKey('seen', contact.peerId))) {
          anchor.dataset.unread = 'true';
          const badge = element('span', 'conversations-unread', 'Nova mensagem');
          badge.id = `unread-conversation-${list.children.length}`;
          anchor.setAttribute('aria-label', contact.name);
          anchor.setAttribute('aria-describedby', badge.id);
          anchor.append(badge);
        }
        item.append(anchor);
        list.append(item);
      }
      inbox.replaceChildren(list);
    } else {
      inbox.replaceChildren(element("p", "conversations-inbox-empty", "Nenhuma conversa ainda."));
    }

    const contact = contacts.find(item => item.peerId === peerId);
    if (contact) { openConversation({ ...contact, exists: true }); return; }
    if (!peerId) {
      if (requested) threadNotice("Conversa indisponível");
      else if (contacts.length) threadNotice("Selecione uma conversa", "O histórico e as mensagens aparecem aqui.");
      else if (isBuyer) threadNotice("Converse com um fornecedor", "Abra um perfil no catálogo para enviar a primeira mensagem.", link("Explorar fornecedores", ROUTE_PATHS.buyerSuppliers));
      else threadNotice("Aguardando uma conversa", "Quando um comprador enviar uma mensagem, ela aparecerá aqui.");
      return;
    }
    if (!isBuyer && !reference) {
      threadNotice("Conversa indisponível", "Abra uma conversa da sua caixa de entrada.");
      return;
    }
    if (currentPeer || checkingProfile) return;
    checkingProfile = true;
    threadNotice("Carregando contato…");
    const contactName = isBuyer
      ? repository.getBuyerSupplierProfile(workspaceId, peerId).then(profile => profile?.organizationName)
      : api.getSupplierContact(workspaceId, peerId, reference);
    contactName.then(name => {
      checkingProfile = false;
      if (!alive || currentPeer) return;
      if (name) openConversation({ peerId, name, exists: false });
      else if (isBuyer) threadNotice("Fornecedor indisponível", "", link("Explorar fornecedores", ROUTE_PATHS.buyerSuppliers));
      else threadNotice("Conversa indisponível", "Abra um pedido ou uma proposta da sua empresa para conversar com o comprador.");
    }).catch(() => {
      checkingProfile = false;
      if (alive && !currentPeer) threadNotice("Não foi possível carregar o contato", "", retry(loadInbox));
    });
  }

  function loadInbox() {
    stopInbox();
    inbox.replaceChildren(element("p", "conversations-inbox-empty", "Carregando conversas…"));
    if (!currentPeer) threadNotice("Carregando conversas…");
    stopInbox = api.watchInbox(workspaceId, renderInbox, () => {
      if (!alive) return;
      notice(inbox, "Caixa de entrada indisponível", "", retry(loadInbox));
      if (!currentPeer) threadNotice("Não foi possível carregar as conversas", "", retry(loadInbox));
    });
  }

  loadInbox();
  document.addEventListener('visibilitychange', markActiveConversation);
  function markActiveConversation() { markVisible(); }
  onReady();
  return () => {
    alive = false;
    stopInbox();
    stopThread();
    stopConnection?.();
    document.removeEventListener('visibilitychange', markActiveConversation);
    container.replaceChildren();
  };
}
