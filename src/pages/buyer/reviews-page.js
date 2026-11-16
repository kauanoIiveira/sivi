import { renderPageState } from "../../components/page-state/page-state.js";

const criteriaLabels = Object.freeze({
  quality: "Qualidade conforme especificação",
  punctuality: "Pontualidade",
  communication: "Comunicação",
  documentation: "Conformidade documental",
});
const make = (tag, className = "", value) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (value !== undefined) element.textContent = String(value);
  return element;
};
const dateValue = (value) => {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime()) ? date : null;
};
const formatDate = (value) => dateValue(value) ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(dateValue(value)) : "Data não informada";
const norm = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
const score = (value) => Number(value).toFixed(1).replace(".", ",");
const ageDays = (value) => dateValue(value) ? Math.max(0, Math.floor((Date.now() - dateValue(value).getTime()) / 86400000)) : null;

function metric(label, value, caption, icon, pending = false) {
  const card = make("article", `reviews-metric${pending ? " reviews-metric--pending" : ""}`);
  const top = make("div", "reviews-metric__top");
  top.append(make("span", "", label), make("span", "reviews-metric__icon", icon));
  card.append(top, make("strong", "", value), make("small", "", caption));
  return card;
}

function ratingRow(key, group) {
  const row = make("fieldset", "reviews-rating");
  const legend = make("legend", "", criteriaLabels[key]);
  const choices = make("div", "reviews-rating__choices");
  for (let value = 1; value <= 5; value += 1) {
    const label = make("label", "reviews-rating__choice");
    const input = make("input");
    input.type = "radio";
    input.name = `${group}-${key}`;
    input.value = String(value);
    input.required = true;
    label.append(input, make("span", "", value));
    choices.append(label);
  }
  row.append(legend, choices);
  return row;
}

function detailDialog(order) {
  const dialog = make("dialog", "reviews-dialog");
  const head = make("div", "reviews-dialog__head");
  const title = make("h2", "", `Avaliação de ${order.supplierName || "fornecedor"}`);
  title.id = `review-detail-${encodeURIComponent(order.id)}`;
  dialog.setAttribute("aria-labelledby", title.id);
  const close = make("button", "reviews-button reviews-button--outline", "Fechar");
  close.type = "button";
  close.addEventListener("click", () => dialog.close());
  head.append(title, close);
  dialog.append(head, make("p", "", `${order.title || "Pedido"} · ${order.id || ""} · Nota geral ${score(order.evaluation.score)}/5`));
  if (order.evaluation.criteria) {
    const list = make("dl", "reviews-dialog__criteria");
    Object.entries(criteriaLabels).forEach(([key, label]) => {
      list.append(make("dt", "", label), make("dd", "", `${order.evaluation.criteria[key]}/5`));
    });
    dialog.append(list);
  } else dialog.append(make("p", "reviews-muted", "Esta avaliação foi registrada antes dos critérios detalhados."));
  dialog.append(make("h3", "", "Comentário"), make("p", "", order.evaluation.comment || "Nenhum comentário informado."));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  return dialog;
}

export function mountBuyerReviewsPage({ container, workspace, repository, onReady = () => {} }) {
  let disposed = false;
  let clearState = () => {};
  let records = { orders: [] };
  let selectedId = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('registro');
  let unavailableOrder = "";
  let historyOpen;
  const drafts = new Map();
  const confirmed = new Set();
  let historyPage = 0;
  let filters = { supplier: "", period: "12", search: "" };
  let feedback = "";
  let feedbackState = "";

  const pendingOrders = () => records.orders.filter((order) => order.status === "delivered" && !order.evaluation && !confirmed.has(order.id))
    .sort((a, b) => (dateValue(a.deliveredAt)?.getTime() ?? Infinity) - (dateValue(b.deliveredAt)?.getTime() ?? Infinity));
  const completedOrders = () => records.orders.filter((order) => order.evaluation)
    .sort((a, b) => (dateValue(b.evaluation.evaluatedAt ?? b.updatedAt)?.getTime() ?? 0) - (dateValue(a.evaluation.evaluatedAt ?? a.updatedAt)?.getTime() ?? 0));

  function renderHistory(page) {
    const completed = completedOrders();
    const suppliers = [...new Set(completed.map((order) => order.supplierName).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    const controls = make("details", "reviews-panel reviews-history-controls workspace-panel");
    controls.open = historyOpen ?? !window.matchMedia("(max-width: 1200px)").matches;
    const heading = make("summary", "reviews-history__heading");
    heading.append(make("h2", "", "Histórico"));
    heading.addEventListener("click", () => { historyOpen = !controls.open; });
    controls.append(heading);
    const filterRow = make("div", "reviews-filters workspace-panel__controls");
    const supplier = make("select");
    supplier.setAttribute("aria-label", "Filtrar por fornecedor");
    supplier.append(new Option("Todos os fornecedores", ""));
    suppliers.forEach((name) => supplier.append(new Option(name, name)));
    supplier.value = filters.supplier;
    const period = make("select");
    period.setAttribute("aria-label", "Filtrar por período");
    period.append(new Option("Últimos 12 meses", "12"), new Option("Todo o período", "all"));
    period.value = filters.period;
    const search = make("input");
    search.type = "search";
    search.placeholder = "Buscar por pedido, demanda ou fornecedor";
    search.setAttribute("aria-label", "Buscar avaliações");
    search.value = filters.search;
    const reset = make("button", "reviews-button reviews-button--outline", "Limpar filtros");
    reset.type = "button";
    filterRow.append(supplier, period, search, reset);
    controls.append(filterRow);
    const results = make("div", "reviews-history__results workspace-records");
    const pager = make("div", "reviews-pagination");
    controls.append(results, pager);
    page.append(controls);

    const draw = () => {
      filters = { supplier: supplier.value, period: period.value, search: search.value.trim() };
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      const visible = completed.filter((order) => {
        const evaluated = dateValue(order.evaluation.evaluatedAt ?? order.updatedAt);
        if (filters.supplier && order.supplierName !== filters.supplier) return false;
        if (filters.period === "12" && (!evaluated || evaluated < cutoff)) return false;
        return !filters.search || norm([order.supplierName, order.id, order.demandId, order.title].join(" ")).includes(norm(filters.search));
      });
      const pages = Math.max(1, Math.ceil(visible.length / 5));
      historyPage = Math.min(historyPage, pages - 1);
      results.replaceChildren();
      visible.slice(historyPage * 5, historyPage * 5 + 5).forEach((order) => {
        const row = make("article", "workspace-record");
        const lead = make("div", "workspace-record__heading");
        lead.append(make("h3", "", order.supplierName || "Fornecedor"), make("span", "reviews-score", `${score(order.evaluation.score)} / 5`));
        const reference = make("p", "reviews-muted", `${order.title || "Pedido"} · ${order.id || "Sem referência"}`);
        const date = make("p", "reviews-muted", formatDate(order.evaluation.evaluatedAt ?? order.updatedAt));
        const details = make("button", "reviews-link", "Ver detalhes");
        details.type = "button";
        const dialog = detailDialog(order);
        details.addEventListener("click", () => dialog.showModal());
        row.append(lead, reference, date, details, dialog);
        results.append(row);
      });
      if (!visible.length) {
        results.append(make("p", "reviews-empty", completed.length ? "Nenhuma avaliação corresponde aos filtros." : "Nenhuma avaliação enviada até agora."));
      }
      pager.hidden = pages === 1;
      pager.replaceChildren();
      pager.append(make("span", "", `Exibindo ${visible.length ? historyPage * 5 + 1 : 0}–${Math.min(visible.length, (historyPage + 1) * 5)} de ${visible.length} avaliações`));
      const actions = make("div");
      const previous = make("button", "reviews-button reviews-button--outline", "Anterior");
      previous.type = "button";
      previous.disabled = historyPage === 0;
      previous.addEventListener("click", () => { historyPage -= 1; draw(); });
      const current = make("span", "", `${historyPage + 1} de ${pages}`);
      const next = make("button", "reviews-button reviews-button--outline", "Próxima");
      next.type = "button";
      next.disabled = historyPage >= pages - 1;
      next.addEventListener("click", () => { historyPage += 1; draw(); });
      actions.append(previous, current, next);
      pager.append(actions);
    };
    supplier.addEventListener("change", () => { historyPage = 0; draw(); });
    period.addEventListener("change", () => { historyPage = 0; draw(); });
    search.addEventListener("input", () => { historyPage = 0; draw(); });
    reset.addEventListener("click", () => { supplier.value = ""; period.value = "12"; search.value = ""; historyPage = 0; draw(); });
    draw();
  }

  function render() {
    const page = make("div", "reviews-page workspace-page");
    page.dataset.pageState = "success";
    const intro = make("header", "reviews-page__intro workspace-page__header");
    const title = make("h1", "", "Avaliações");
    title.dataset.pageTitle = "";
    const introCopy = make("div");
    introCopy.append(title, make("p", "", "Avalie entregas concluídas e consulte o histórico de desempenho dos seus fornecedores."));
    intro.append(introCopy);
    const pending = pendingOrders();
    const selected = unavailableOrder ? null : pending.find((order) => order.id === selectedId) ?? pending[0];
    selectedId = selected?.id ?? null;
    const completed = completedOrders();
    const lags = completed.map((order) => {
      const delivered = dateValue(order.deliveredAt);
      const evaluated = dateValue(order.evaluation.evaluatedAt);
      return delivered && evaluated && evaluated >= delivered ? (evaluated - delivered) / 86400000 : null;
    }).filter((value) => value !== null);
    const metrics = make("div", "reviews-metrics workspace-page__metrics");
    metrics.append(
      metric("Avaliações pendentes", String(pending.length).padStart(2, "0"), "Pedidos entregues sem avaliação", "◷", true),
      metric("Avaliações concluídas", String(completed.length).padStart(2, "0"), "Registros desta organização", "☑"),
      metric("Prazo médio para avaliar", lags.length ? `${score(lags.reduce((sum, value) => sum + value, 0) / lags.length)} dias` : "—", lags.length ? "Da entrega até a avaliação" : "Disponível para novas avaliações", "▦"),
    );
    const main = make("section", "reviews-panel reviews-pending workspace-panel");
    const heading = make("div", "reviews-panel__heading");
    const headingText = make("div");
    headingText.append(make("h2", "", "Avaliações pendentes"), make("p", "reviews-muted", "Pedidos entregues que aguardam avaliação."));
    const ordersLink = make("a", "reviews-link", "Ver todos os pedidos");
    ordersLink.href = "#/app/comprador/pedidos";
    heading.append(headingText, ordersLink);
    const columns = make("div", "reviews-pending__columns");
    const list = make("div", "reviews-pending__list");
    const preview = make("div", "reviews-preview");
    preview.id = "avaliar-entrega";
    columns.append(list, preview);
    main.append(heading);
    const notice = make("p", "reviews-feedback", unavailableOrder || feedback);
    notice.setAttribute("role", "status");
    notice.tabIndex = -1;
    notice.dataset.state = feedbackState;
    if (unavailableOrder || feedback) main.append(notice);
    main.append(columns);

    const selectOrder = (order) => {
      if (container.querySelector('form[aria-busy=true]')) return;
      unavailableOrder = "";
      selectedId = order.id;
      render();
      container.querySelector(".reviews-preview h3")?.focus();
    };
    if (!pending.length) list.append(make("p", "reviews-empty", "Nenhum pedido entregue aguarda avaliação."));
    pending.forEach((order) => {
      const item = make("article", `reviews-order${selectedId === order.id ? " reviews-order--selected" : ""}`);
      const info = make("div");
      info.append(make("h3", "", order.supplierName || "Fornecedor"), make("p", "", order.title || "Pedido concluído"), make("small", "", `${order.id || "Pedido"} · ${order.demandId || "Demanda não informada"}`));
      const dates = make("div", "reviews-order__dates");
      dates.append(make("span", "", `Entrega confirmada\n${formatDate(order.deliveredAt)}`), make("span", "", ageDays(order.deliveredAt) === null ? "Aguardando avaliação" : `Recebido há\n${ageDays(order.deliveredAt)} dias`));
      const isSelected = selectedId === order.id;
      const button = make("button", `reviews-button reviews-button--${isSelected ? 'primary' : 'outline'}`, "Avaliar pedido");
      button.type = "button";
      button.setAttribute("aria-controls", preview.id);
      button.setAttribute("aria-pressed", String(isSelected));
      if (isSelected) info.append(make("span", "reviews-order__selection", "Selecionado"));
      button.addEventListener("click", () => selectOrder(order));
      item.append(info, button, dates);
      list.append(item);
    });
    if (selected) {
      const formTitle = make("h3", "", "Avaliar entrega");
      formTitle.tabIndex = -1;
      preview.append(formTitle, make("p", "reviews-muted", `${selected.title || "Pedido"} · ${selected.supplierName || "Fornecedor"} · ${selected.id}`));
      const form = make("form", "reviews-form");
      Object.keys(criteriaLabels).forEach((key) => form.append(ratingRow(key, selected.id)));
      const commentLabel = make("label", "reviews-form__comment", "Comentário opcional");
      const comment = make("textarea");
      comment.name = "comment";
      comment.maxLength = 1000;
      comment.rows = 3;
      comment.placeholder = "Registre evidências sobre a entrega, inspeção ou documentação.";
      const draft = drafts.get(selected.id);
      if (draft) {
        comment.value = draft.comment ?? '';
        for (const [key, value] of Object.entries(draft.criteria)) form.querySelector(`input[name="${selected.id}-${key}"][value="${value}"]`)?.setAttribute('checked', '');
        form.dataset.dirty = 'true';
      }
      commentLabel.append(comment);
      const submit = make("button", "reviews-button reviews-button--primary", "Enviar avaliação");
      submit.type = "submit";
      form.append(commentLabel, make("small", "reviews-muted", "1 = Não atendeu · 3 = Atendeu · 5 = Superou"), submit);
      form.addEventListener('input', () => {
        drafts.set(selected.id, { criteria: Object.fromEntries(Object.keys(criteriaLabels).map(key => [key, Number(new FormData(form).get(`${selected.id}-${key}`))])), comment: comment.value });
        form.dataset.dirty = 'true';
      });
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (confirmed.has(selected.id) || form.getAttribute('aria-busy') === 'true') return;
        const criteria = Object.fromEntries(Object.keys(criteriaLabels).map((key) => [key, Number(new FormData(form).get(`${selected.id}-${key}`))]));
        if (Object.values(criteria).some((value) => !value)) { form.reportValidity(); return; }
        submit.disabled = true;
        form.setAttribute('aria-busy', 'true');
        form.querySelectorAll('input, textarea').forEach(control => { control.disabled = true; });
        submit.textContent = "Salvando…";
        try {
          await repository.workflow.evaluateOrder(workspace.id, selected.id, { criteria, comment: comment.value });
          confirmed.add(selected.id); drafts.delete(selected.id); delete form.dataset.dirty;
          form.dataset.committed = 'true';
          if (disposed) return;
          const result = await repository.getOperations(workspace.id);
          if (result.status !== "ready") throw new Error("Avaliação salva, mas não foi possível atualizar a página. Atualize para conferir.");
          records = result.data;
          selectedId = null;
          feedback = "Avaliação enviada e vinculada ao pedido.";
          feedbackState = "success";
          render();
          container.querySelector(".reviews-pending > [role=status]")?.focus();
        } catch (error) {
          if (disposed) return;
          const committed = confirmed.has(selected.id);
          submit.disabled = committed;
          submit.textContent = committed ? 'Avaliação salva' : "Enviar avaliação";
          form.querySelectorAll('input, textarea').forEach(control => { control.disabled = committed; });
          const message = make("p", "reviews-feedback", error.message || "Não foi possível enviar a avaliação.");
          message.dataset.state = "error";
          message.setAttribute("role", "alert");
          form.querySelector(".reviews-feedback")?.remove();
          form.append(message);
        } finally {
          form.removeAttribute('aria-busy');
        }
      });
      preview.append(form);
    } else preview.hidden = true;

    const panels = make("div", "workspace-page__split");
    panels.append(main);
    renderHistory(panels);
    page.append(intro, metrics, panels);
    if ([...drafts.keys()].some(id => id !== selectedId)) {
      const retained = make('form'); retained.hidden = true; retained.dataset.dirty = 'true'; page.append(retained);
    }
    page.append(make("p", "reviews-page__note", "ⓘ  As avaliações são vinculadas a pedidos com entrega confirmada e registram a experiência da sua organização. O cadastro do fornecedor e a compatibilidade com a demanda seguem critérios próprios."));
    container.replaceChildren(page);
  }

  async function load() {
    clearState();
    clearState = renderPageState(container, { status: "loading" });
    let result;
    try { result = await repository.getOperations(workspace.id); }
    catch { result = { status: "error" }; }
    if (disposed) return;
    if (result.status !== "ready") {
      clearState = renderPageState(container, { status: result.status, onRetry: load });
      onReady();
      return;
    }
    clearState();
    records = result.data;
    if (selectedId && !pendingOrders().some(order => order.id === selectedId)) {
      unavailableOrder = records.orders.some(order => order.id === selectedId && order.evaluation)
        ? "Este pedido já foi avaliado. Consulte o histórico ou escolha outro pedido pendente."
        : "O pedido deste link não está disponível para avaliação. Escolha um pedido na lista de pendências.";
    }
    render();
    onReady();
  }
  void load();
  return () => { disposed = true; clearState(); container.replaceChildren(); };
}
