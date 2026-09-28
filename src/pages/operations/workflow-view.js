import { workflowLink } from '../../domain/next-actions.js';
import { createDemandFilters } from './demand-filters.js';
import { createDemandRecovery } from './demand-recovery.js';
import { createRecordFilters } from './record-filters.js';
import { recordCollection } from './record-collection.js';
import { demandCopyInput } from './demand-copy.js';
import { downloadOrdersCsv } from './orders-csv.js';
import { printOrder } from './order-print.js';
import { isCalendarDate, todayInSaoPaulo } from '../../domain/calendar-date.js';
import { inspectionSummary } from '../../domain/inspection.js';
import { money, metrics, emptyState, comparison, orderProgress, quantitySummary } from './workflow-components.js';
const labels = { draft: "Rascunho", published: "Publicada", ordered: "Pedido gerado", accepted: "Aguardando inspeção", blocked: "Bloqueado — reinspeção necessária", released: "Liberado para expedição", dispatched: "Expedido", delivered: "Entrega confirmada" };
const el = (tag, text) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; return node; };
const box = (title) => { const node = el("article"); node.className = "workflow-record"; node.append(el("h3", title)); return node; };
const row = (container, label, value) => {
  const item = el('p'); item.className = 'workflow-field';
  item.append(el('span', `${label}: `), el('strong', String(value)));
  if (label === 'Estado') { item.classList.add('workflow-state'); item.dataset.state = Object.keys(labels).find(key => labels[key] === value) ?? ''; }
  container.append(item);
};

function form(fields, label, action, report, defaults = {}, canSubmit = () => true, run = command => command()) {
  const node = el("form"); node.className = 'workflow-form';
  for (const [name, title, type = "text", value = ""] of fields) {
    const field = el("label", title);
    const input = el(type === "textarea" ? "textarea" : "input");
    if (type !== "textarea") input.type = type;
    input.name = name; input.required = true; input.value = defaults[name] ?? value;
    if (type === 'textarea') field.className = 'workflow-form__wide';
    input.maxLength = { manufacturer: 160, payment: 300, warranty: 500, plan: 160, comment: 1000 }[name] ?? 2000;
    if (type === "number") { input.min = name === "freight" || name.startsWith("approved") ? "0" : name === 'price' ? '0.01' : "1"; input.step = name === "price" || name === "freight" ? "0.01" : "1"; }
    if (name === 'validUntil') input.min = todayInSaoPaulo();
    if (name === "score") input.max = "5";
    field.append(input); node.append(field);
  }
  const footer = el('div'); footer.className = 'workflow-form__footer';
  if (fields.some(([name]) => name === 'price')) {
    const total = el('output'); total.className = 'workflow-form__total'; total.setAttribute('aria-live', 'polite');
    const update = () => { const values = new FormData(node); const sum = Number(values.get('price')) + Number(values.get('freight')); total.textContent = `Total com frete: ${money(Number.isFinite(sum) ? Math.round(sum * 100) : 0)}`; };
    node.addEventListener('input', update); footer.append(total); update();
  }
  const button = el("button", label); button.type = "submit"; footer.append(button); node.append(footer);
  const error = el("p"); error.setAttribute("role", "alert"); node.append(error);
  node.addEventListener('input', () => { node.dataset.dirty = 'true'; });
  const cancel = el('button', 'Cancelar preenchimento'); cancel.type = 'button'; cancel.className = 'workflow-secondary-action'; footer.prepend(cancel);
  cancel.addEventListener('click', () => {
    node.querySelectorAll('[name]').forEach(input => { input.value = defaults[input.name] ?? fields.find(([name]) => name === input.name)?.[3] ?? ''; });
    delete node.dataset.dirty; error.textContent = ''; node.dispatchEvent(new Event('input')); delete node.dataset.dirty;
    node.querySelector('input, textarea')?.focus();
  });
  node.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (node.dataset.committed || node.getAttribute('aria-busy') === 'true' || !canSubmit(node)) return;
    error.textContent = "";
    const values = Object.fromEntries(new FormData(node));
    for (const input of node.querySelectorAll('input[type=date]')) {
      if (!isCalendarDate(input.value)) { error.textContent = 'Informe uma data válida.'; input.focus(); return; }
    }
    node.setAttribute('aria-busy', 'true');
    node.querySelectorAll('input, textarea, button').forEach(control => { control.disabled = true; });
    const previousLabel = button.textContent;
    button.textContent = "Salvando…";
    try { await run(() => action(values)); delete node.dataset.dirty; node.dataset.committed = 'true'; report(`${label}: concluído e salvo.`, node); }
    catch (cause) { error.textContent = cause?.message ?? "Não foi possível salvar."; }
    finally { node.removeAttribute('aria-busy'); node.querySelectorAll('input, textarea, button').forEach(control => { control.disabled = Boolean(node.dataset.committed); }); button.textContent = node.dataset.committed ? 'Salvo' : previousLabel; }
  });
  return node;
}

function demandForm(action, report, { draft = null, initialValues = null, onCancel, recovery = null, canSubmit = () => true } = {}) {
  const node = el("form"); node.className = "workflow-form workflow-demand-form";
  const initial = draft ?? initialValues;
  const baseFields = [
    ["title", "Título da demanda", "text"],
    ["description", "Objetivo e observações", "textarea"],
    ["requiredBy", "Prazo solicitado", "date"],
    ["destination", "Destino de entrega", "text"],
    ["region", "Região atendida", "text"],
  ];
  const baseInputs = new Map();
  const overview = el('fieldset'); overview.className = 'workflow-form-group workflow-form__wide'; overview.append(el('legend', 'O que sua empresa precisa'));
  const delivery = el('fieldset'); delivery.className = 'workflow-form-group workflow-form__wide'; delivery.append(el('legend', 'Prazo e entrega'));
  node.append(overview, delivery);
  for (const [name, title, type] of baseFields) {
    const label = el("label", title);
    const input = el(type === "textarea" ? "textarea" : "input");
    if (type !== "textarea") input.type = type;
    input.name = name; input.required = true; input.maxLength = name === 'description' ? 2000 : 160;
    input.value = initial?.[name] ?? '';
    if (name === 'requiredBy' && initialValues) input.min = todayInSaoPaulo();
    if (type === "textarea" || name === 'title') label.className = "workflow-form__wide";
    baseInputs.set(name, input);
    label.append(input); (['title', 'description'].includes(name) ? overview : delivery).append(label);
  }
  const itemSection = el("section"); itemSection.className = "workflow-demand-items workflow-form__wide";
  itemSection.append(el("h3", "Itens da demanda"));
  const itemList = el("div"); itemList.dataset.demandItems = "true"; itemSection.append(itemList);
  const add = el("button", "Adicionar outro item"); add.type = "button"; add.className = "workflow-secondary-action"; itemSection.append(add);
  const renumberItems = () => [...itemList.children].forEach((item, position) => {
    item.querySelector('legend').textContent = `Item ${position + 1}`;
    const remove = item.querySelector('.workflow-remove-item');
    remove.disabled = itemList.children.length === 1;
    remove.setAttribute('aria-label', `Remover item ${position + 1}`);
  });
  const addItem = (values = {}, focus = false) => {
    const index = itemList.children.length + 1;
    const fieldset = el("fieldset"); fieldset.dataset.demandItem = "true";
    if (values.id) fieldset.dataset.itemId = values.id;
    const legend = el("legend", `Item ${index}`); fieldset.append(legend);
    const definitions = [
      ["description", "Descrição do item", "text", true],
      ["category", "Categoria", "text", true],
      ["material", "Material", "text", true],
      ["process", "Processo necessário", "text", true],
      ["certifications", "Certificações, separadas por vírgula", "text", false],
      ["quantity", "Quantidade", "number", true],
      ["unit", "Unidade", "text", true],
    ];
    for (const [name, title, type, required] of definitions) {
      const label = el("label", title); const input = el("input");
      if (name === 'description' || name === 'certifications') label.className = 'workflow-form__wide';
      if (!required) { const optional = el('span', 'Opcional'); optional.className = 'workflow-optional'; optional.setAttribute('aria-hidden', 'true'); label.append(optional); }
      input.name = name; input.type = type; input.required = required; input.maxLength = name === 'unit' ? 20 : ['category', 'material', 'process'].includes(name) ? 120 : 500;
      if (type === "number") { input.min = "1"; input.step = "1"; }
      if (name === "unit") input.value = "un";
      if (values[name] !== undefined) input.value = Array.isArray(values[name]) ? values[name].join(', ') : values[name];
      label.append(input); fieldset.append(label);
    }
    const remove = el("button", "Remover item"); remove.type = "button"; remove.className = "workflow-remove-item";
    remove.addEventListener("click", () => {
      if (itemList.children.length <= 1) return;
      const next = fieldset.nextElementSibling ?? fieldset.previousElementSibling;
      fieldset.remove(); renumberItems(); next.querySelector('input').focus(); node.dispatchEvent(new Event('input'));
    });
    fieldset.append(remove); itemList.append(fieldset); renumberItems();
    if (focus) fieldset.querySelector('input').focus();
  };
  add.addEventListener("click", () => { addItem({}, true); node.dispatchEvent(new Event('input')); });
  const initialItems = initial?.items?.length ? initial.items : [{}];
  initialItems.forEach(item => addItem(item)); node.append(itemSection);
  const footer = el("div"); footer.className = "workflow-form__footer";
  const submitLabel = draft ? 'Salvar alterações' : 'Salvar rascunho';
  if (onCancel) {
    const cancel = el('button', initialValues ? 'Cancelar nova demanda' : 'Cancelar edição'); cancel.type = 'button'; cancel.className = 'workflow-secondary-action';
    cancel.addEventListener('click', onCancel); footer.append(cancel);
  }
  const button = el("button", submitLabel); button.type = "submit"; footer.append(button); node.append(footer);
  const error = el("p"); error.setAttribute("role", "alert"); node.append(error);
  const readInput = () => ({
    ...Object.fromEntries([...baseInputs].map(([name, input]) => [name, input.value])),
    items: [...itemList.children].map(item => ({
      ...(item.dataset.itemId ? { id: item.dataset.itemId } : {}),
      ...Object.fromEntries([...item.querySelectorAll('input')].map(input => [input.name, input.value])),
    })),
  });
  const savedHint = el('p'); savedHint.className = 'workflow-save-hint workflow-form__wide'; savedHint.setAttribute('role', 'status');
  if (recovery) { savedHint.textContent = 'Salve o rascunho para registrar esta demanda para a empresa.'; node.prepend(savedHint); }
  node.addEventListener('input', () => {
    node.dataset.dirty = 'true';
    if (recovery) savedHint.textContent = recovery.save(readInput())
      ? 'Preenchimento guardado nesta aba. Salve o rascunho para registrar na empresa.'
      : 'Preenchimento não guardado pelo navegador. Salve o rascunho antes de sair.';
  });
  if (recovery) {
    const cancel = el('button', 'Cancelar preenchimento'); cancel.type = 'button'; cancel.className = 'workflow-secondary-action'; footer.prepend(cancel);
    cancel.addEventListener('click', () => {
      if (node.dataset.dirty && !window.confirm('Descartar o preenchimento desta nova demanda?')) return;
      recovery.clear(); baseInputs.forEach(input => { input.value = ''; }); itemList.replaceChildren(); addItem();
      delete node.dataset.dirty; savedHint.textContent = 'Preenchimento descartado.'; error.textContent = ''; baseInputs.get('title').focus();
    });
    const pending = recovery.read();
    if (pending) {
      const offer = el('section'); offer.className = 'workflow-recovery workflow-form__wide';
      offer.append(el('strong', 'Você tem um preenchimento para retomar'), el('p', 'Guardado nesta aba, para esta empresa. Ainda não é um rascunho salvo.'));
      const resume = el('button', 'Retomar preenchimento'); resume.type = 'button';
      const discard = el('button', 'Descartar preenchimento'); discard.type = 'button'; discard.className = 'workflow-secondary-action';
      const controls = [...node.querySelectorAll('input, textarea, button')]; controls.forEach(input => { input.disabled = true; });
      const formParts = [...node.children]; formParts.forEach(part => { part.hidden = true; });
      const unlock = () => { controls.forEach(input => { input.disabled = false; }); formParts.forEach(part => { part.hidden = false; }); renumberItems(); offer.remove(); };
      resume.addEventListener('click', () => {
        baseInputs.forEach((input, name) => { input.value = typeof pending[name] === 'string' ? pending[name] : ''; });
        itemList.replaceChildren(); (pending.items.length ? pending.items : [{}]).forEach(item => addItem(item));
        unlock(); node.dispatchEvent(new Event('input')); baseInputs.get('title').focus();
      });
      discard.addEventListener('click', () => { recovery.clear(); unlock(); savedHint.textContent = 'Preenchimento descartado.'; baseInputs.get('title').focus(); });
      offer.append(resume, discard); node.prepend(offer);
    }
  }
  node.addEventListener("submit", async (event) => {
    event.preventDefault(); error.textContent = "";
    if (node.dataset.committed || node.getAttribute('aria-busy') === 'true' || !canSubmit(node)) return;
    if (!isCalendarDate(baseInputs.get('requiredBy').value)) { error.textContent = 'Informe uma data válida.'; baseInputs.get('requiredBy').focus(); return; }
    if (initialValues && baseInputs.get('requiredBy').value < todayInSaoPaulo()) { error.textContent = 'Informe um prazo a partir de hoje para a nova demanda.'; baseInputs.get('requiredBy').focus(); return; }
    try {
      // Read the top-level controls explicitly: items also contain a description.
      const base = Object.fromEntries([...baseInputs].map(([name, input]) => [name, input.value]));
      const items = [...itemList.querySelectorAll("[data-demand-item]")].map((item) => ({
        ...(item.dataset.itemId ? { id: item.dataset.itemId } : {}),
        description: item.elements?.description?.value ?? item.querySelector("[name='description']").value,
        category: item.querySelector("[name='category']").value,
        material: item.querySelector("[name='material']").value,
        process: item.querySelector("[name='process']").value,
        certifications: item.querySelector("[name='certifications']").value,
        quantity: item.querySelector("[name='quantity']").value,
        unit: item.querySelector("[name='unit']").value,
      }));
      node.setAttribute('aria-busy', 'true');
      node.querySelectorAll('input, textarea, button').forEach(control => { control.disabled = true; });
      button.textContent = 'Salvando…';
      await action({ ...base, items });
      recovery?.clear(); delete node.dataset.dirty; node.dataset.committed = 'true';
      savedHint.textContent = 'Rascunho salvo para a empresa.';
      report(draft ? 'Alterações do rascunho salvas.' : 'Rascunho salvo.', node);
    } catch (cause) {
      error.textContent = cause?.message ?? "Não foi possível salvar a demanda.";
    } finally {
      node.removeAttribute('aria-busy');
      renumberItems();
      node.querySelectorAll('input, textarea, button').forEach(control => { control.disabled = Boolean(node.dataset.committed); });
      if (!node.dataset.committed) renumberItems();
      button.textContent = node.dataset.committed ? 'Salvo' : submitLabel;
    }
  });
  return node;
}

export function mountWorkflowView({ container, workspace, workflow, section, suppliers, onRefresh, selectedRecordId = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("registro") }) {
  let storage;
  try { storage = window.sessionStorage; } catch {}
  const filters = createDemandFilters(workspace, storage);
  const recovery = createDemandRecovery(workspace, storage);
  const recordsFilter = section === 'demands' ? null : createRecordFilters(section, workspace, storage);
  const root = el("section"); root.dataset.workflow = section; container.append(root);
  const status = el("p"); status.setAttribute("role", "status");
  status.setAttribute('aria-atomic', 'true'); status.tabIndex = -1;
  status.className = 'workflow-feedback';
  let inFlight = false;
  const runCommand = async (command) => {
    if (inFlight) throw new Error('Aguarde a conclusão da ação em andamento.');
    inFlight = true; root.setAttribute('aria-busy', 'true');
    const controls = [...root.querySelectorAll('input, textarea, select, button')].filter(control => !control.disabled);
    controls.forEach(control => { control.disabled = true; });
    try { return await command(); }
    finally { inFlight = false; root.removeAttribute('aria-busy'); controls.forEach(control => { control.disabled = false; }); }
  };
  const canContinue = (currentForm) => {
    if (inFlight) return false;
    if (!currentForm && root.querySelector('form[data-dirty=true], form[aria-busy=true]')) {
      status.dataset.tone = 'warning'; status.textContent = 'Salve ou cancele o preenchimento aberto antes de continuar.'; status.focus(); return false;
    }
    return true;
  };
  const showFeedback = (message) => {
    const warning = workflow.getSyncWarning?.(workspace.id);
    status.dataset.tone = warning ? 'warning' : 'success';
    status.textContent = warning ? `${message} ${warning}` : message;
    status.focus({ preventScroll: false });
  };
  function action(parent, title, callback, confirmation = false) {
    const button = el("button", title); button.type = "button"; parent.append(button);
    button.addEventListener("click", async () => {
      if (!canContinue()) return;
      if (confirmation && !window.confirm(typeof confirmation === 'string' ? confirmation : `${title}?`)) return;
      button.disabled = true;
      const previousLabel = button.textContent; button.textContent = 'Salvando…';
      try { await runCommand(callback); if (!root.isConnected) return; render(); showFeedback(`${title}: concluído e salvo.`); }
      catch (cause) { status.dataset.tone = 'error'; status.textContent = cause?.message ?? "Não foi possível concluir a ação."; status.focus(); }
      finally { button.disabled = false; button.textContent = previousLabel; }
    });
  }
  const report = (message, savedForm) => {
    if (!root.isConnected) return;
    const otherChanges = [...root.querySelectorAll('form[data-dirty=true]')].some(form => form !== savedForm);
    if (otherChanges) showFeedback(`${message} O outro preenchimento foi preservado. Conclua-o ou cancele-o antes de atualizar os registros.`);
    else { render(); showFeedback(message); }
  };
  const name = (id) => suppliers.find((supplier) => supplier.id === id)?.name ?? id;
  const linkTo = (parent, label, targetSection, id) => {
    const link = el("a", label); link.className = "workflow-related-link";
    link.href = workflowLink(workspace.organizationRole, targetSection, id); parent.append(link);
  };
  function render() {
    const original = workflow.read(workspace.id);
    if (original.suppliers) suppliers = original.suppliers;
    const data = { ...original };
    data.demands = [...data.demands].sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0));
    data.orders = [...data.orders].sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0));
    const collection = section === "orders" ? "orders" : "demands";
    if (selectedRecordId) data[collection] = original[collection].filter(record => record.id === selectedRecordId);
    if (selectedRecordId && section === 'proposals') data.proposals = original.proposals.filter(record => record.demandId === selectedRecordId);
    const active = data.demands.filter(item => item.status === 'published').length;
    const stats = section === 'demands'
      ? [['Demandas da empresa', data.demands.length, 'Necessidades registradas'], ['Abertas para propostas', active, 'Negociação em andamento'], ['Pedidos gerados', data.orders.length, 'Propostas aceitas']]
      : section === 'proposals'
        ? [['Propostas', data.proposals.length, 'Negociações da empresa'], ['Versões enviadas', data.proposals.reduce((sum, item) => sum + item.versions.length, 0), 'Histórico preservado'], ['Pedidos gerados', data.orders.length, 'Decisões confirmadas']]
        : [['Pedidos', data.orders.length, 'Compromissos da empresa'], ['Em execução', data.orders.filter(item => item.status !== 'delivered').length, 'Acompanhe os próximos passos'], ['Entregues', data.orders.filter(item => item.status === 'delivered').length, 'Recebimento confirmado']];
    root.replaceChildren(status);
    if (section !== 'demands' || data.demands.length) root.prepend(metrics(stats));
    const sectionHeading = el('div'); sectionHeading.className = 'workflow-section-heading';
    sectionHeading.append(el('h2', section === 'demands' ? workspace.organizationRole === 'buyer' ? 'Minhas demandas' : 'Oportunidades disponíveis' : section === 'proposals' ? 'Negociações da empresa' : 'Acompanhamento de pedidos'));
    if (onRefresh) {
      const refresh = el('button', 'Atualizar registros'); refresh.type = 'button'; refresh.className = 'workflow-secondary-action';
      refresh.addEventListener('click', async () => {
        if (!canContinue()) return;
        refresh.disabled = true; refresh.textContent = 'Atualizando…';
        try {
          const result = await runCommand(onRefresh);
          if (!root.isConnected) return;
          if (result.status !== 'ready') throw new Error('Não foi possível atualizar. Seus dados continuam nesta tela. Tente novamente.');
          suppliers = result.data.suppliers; render(); showFeedback('Registros atualizados.');
        } catch (cause) { status.dataset.tone = 'error'; status.textContent = cause.message; status.focus(); }
        finally { refresh.disabled = false; refresh.textContent = 'Atualizar registros'; }
      });
      sectionHeading.append(refresh);
    }
    root.append(sectionHeading);
    if (selectedRecordId) {
      linkTo(root, "← Ver lista completa", section);
      if (!data[collection].length) {
        root.append(emptyState("Registro indisponível", "Este registro não está disponível para a empresa e atuação selecionadas. Volte à lista para continuar."));
        return;
      }
    }
    if (section === "demands") {
      if (workspace.organizationRole === "buyer" && !selectedRecordId) {
        const panel = el("details"); panel.className = 'workflow-editor'; panel.append(el("summary", "Nova demanda"));
        panel.open = Boolean(recovery.read()) || new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('nova') === '1';
        panel.append(el('p', 'Descreva o que sua empresa precisa. Salve um rascunho e publique quando as informações estiverem prontas.'));
        panel.append(demandForm((values) => runCommand(() => workflow.createDemand(workspace.id, values)), report, { recovery, canSubmit: canContinue }));
        root.append(panel);
      }
      if (!data.demands.length) root.append(emptyState(workspace.organizationRole === 'buyer' ? 'Nenhuma demanda cadastrada' : 'Nenhuma oportunidade disponível', workspace.organizationRole === 'buyer' ? 'Crie sua primeira demanda com especificação, quantidade e prazo. Os fornecedores poderão responder com suas condições.' : 'Mantenha seu perfil industrial atualizado para encontrar demandas compatíveis.'));
      const toolbar = el('div'); toolbar.className = 'workflow-toolbar';
      const searchLabel = el("label", "Buscar demandas"); const search = el("input"); search.type = "search"; search.placeholder = 'Título, referência, material ou destino'; searchLabel.append(search); toolbar.append(searchLabel);
      const filterLabel = el('label', 'Situação'); const filter = el('select'); filter.setAttribute('aria-label', 'Situação');
      [['', 'Todas as situações'], ...(workspace.organizationRole === 'buyer' ? [['draft', 'Rascunho']] : []), ['published', 'Publicada'], ['ordered', 'Pedido gerado']].forEach(([value, label]) => { const option = el('option', label); option.value = value; filter.append(option); }); filterLabel.append(filter); toolbar.append(filterLabel);
      if (!selectedRecordId && data.demands.length) root.append(toolbar);
      const count = el('p'); count.dataset.resultCount = ''; count.className = 'workflow-result-count'; count.setAttribute('role', 'status'); count.setAttribute('aria-atomic', 'true');
      if (!selectedRecordId && data.demands.length) root.append(count);
      search.maxLength = 200;
      if (!selectedRecordId) { const remembered = filters.read(); search.value = remembered.search; filter.value = remembered.status; }
      const list = el("div"); list.className = 'workflow-record-list'; root.append(list);
      const show = () => {
        if (!selectedRecordId) filters.save(search.value, filter.value);
        list.replaceChildren();
        const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
        const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
        const demands = data.demands.filter(item => {
          const haystack = normalize([item.title, item.id, item.destination, ...(item.items ?? []).flatMap(part => [part.description, part.material, part.category, part.process])].join(' '));
          return terms.every(term => haystack.includes(term)) && (!filter.value || item.status === filter.value);
        });
        count.textContent = `${demands.length} de ${data.demands.length} ${data.demands.length === 1 ? 'registro' : 'registros'}`;
        if (data.demands.length && !demands.length) { list.append(el("p", "Nenhum registro corresponde à busca.")); const clear = el('button', 'Limpar filtros'); clear.type = 'button'; clear.addEventListener('click', () => { search.value = ''; filter.value = ''; show(); search.focus(); }); list.append(clear); }
        demands.forEach((demand) => {
          const record = box(demand.title); record.classList.add('workflow-demand');
          const reference = el('span', `Referência: ${demand.id}`); reference.className = 'workflow-reference'; record.prepend(reference);
          row(record, "Estado", labels[demand.status]);
          const info = el('div'); info.className = 'workflow-facts';
          row(info, "Quantidade por unidade", quantitySummary(demand)); row(info, "Prazo", demand.requiredBy.split('-').reverse().join('/')); row(info, "Destino", demand.destination); record.append(info);
          const itemCount = demand.items?.length || 1;
          const specification = el('details'); specification.className = 'workflow-specification'; specification.append(el('summary', `Ver especificação técnica · ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`), el('p', demand.description));
          (demand.items ?? []).forEach((item, index) => {
            const itemDetail = box(`Item ${index + 1} · ${item.description}`);
            row(itemDetail, "Categoria", item.category); row(itemDetail, "Material", item.material); row(itemDetail, "Processo", item.process); row(itemDetail, "Quantidade", `${item.quantity} ${item.unit}`); row(itemDetail, "Certificações", item.certifications?.join(", ") || "Não informadas");
            specification.append(itemDetail);
          });
          if (workspace.organizationRole === "supplier" && demand.match) {
            const match = box(demand.match.status === "compatible" ? "Compatibilidade com o perfil" : "Critérios que precisam de conferência");
            match.classList.add("workflow-match");
            (demand.match.criteria ?? []).forEach((criterion) => row(match, criterion.label, criterion.explanation));
            specification.append(match);
          }
          record.append(specification);
          if (demand.status === "draft" && workspace.organizationRole === 'buyer') {
            const editor = el('details'); editor.className = 'workflow-editor';
            const summary = el('summary', 'Editar rascunho'); editor.append(summary);
            editor.append(el('p', 'Revise o objetivo, os itens e as condições de entrega antes de publicar.'));
            const resetEditor = () => {
              editor.querySelector('form')?.remove();
              editor.append(demandForm(
                values => runCommand(() => workflow.updateDemand(workspace.id, demand.id, values, demand.updatedAt, demand.revision ?? 0)),
                (message, savedForm) => report(message, savedForm),
                { draft: demand, canSubmit: canContinue, onCancel: () => { resetEditor(); editor.open = false; summary.focus(); } },
              ));
            };
            resetEditor(); record.append(editor);
            const controls = el('div'); controls.className = 'workflow-draft-actions';
            action(controls, 'Publicar demanda', () => workflow.publishDemand(workspace.id, demand.id), 'Publicar a última versão salva desta demanda para os fornecedores compatíveis?');
            const note = el('p', 'Salve ou cancele a edição antes de publicar.'); note.hidden = true; controls.append(note);
            editor.addEventListener('toggle', () => {
              controls.querySelector('button').disabled = editor.open;
              note.hidden = !editor.open;
            });
            record.append(controls);
          }
          if (workspace.organizationRole === "supplier" && demand.status === "published") {
            const link = el("a", "Enviar proposta"); link.href = workflowLink("supplier", "proposals", demand.id); record.append(link);
          }
          if (workspace.organizationRole === "buyer" && demand.status === "published") linkTo(record, "Acompanhar propostas", "proposals", demand.id);
          if (workspace.organizationRole === 'buyer') {
            const reuse = el('button', 'Reutilizar como nova demanda'); reuse.type = 'button'; reuse.className = 'workflow-secondary-action workflow-reuse-action';
            reuse.addEventListener('click', () => {
              if (!canContinue()) return;
              const panel = el('section'); panel.className = 'workflow-copy-editor';
              panel.append(el('h4', 'Nova demanda a partir desta especificação'), el('p', 'Revise os itens e o prazo antes de salvar. A nova demanda será um rascunho independente.'));
              const values = demandCopyInput(demand);
              if (!values.requiredBy) panel.append(el('p', 'Informe um novo prazo: o prazo anterior venceu ou não está disponível.'));
              let copiedId;
              const copyForm = demandForm(async input => {
                copiedId = await runCommand(() => workflow.createDemand(workspace.id, input));
                if (!selectedRecordId) filters.save('', 'draft');
              }, (message, savedForm) => {
                report('Nova demanda salva como rascunho. Revise e publique quando estiver pronta.', savedForm);
                if (copiedId) linkTo(status, 'Abrir novo rascunho', 'demands', copiedId);
              }, {
                initialValues: values, canSubmit: canContinue,
                onCancel: () => { panel.remove(); reuse.hidden = false; reuse.focus(); },
              });
              copyForm.dataset.dirty = 'true'; panel.append(copyForm); record.append(panel); reuse.hidden = true;
              copyForm.querySelector('[name=title]').focus();
            });
            record.append(reuse);
          }
          const order = data.orders.find(item => item.demandId === demand.id);
          if (order) linkTo(record, "Acompanhar pedido", "orders", order.id);
          list.append(record);
        });
      };
      let appliedSearch = search.value; let appliedStatus = filter.value;
      const filterRecords = () => {
        if (list.querySelector('form[data-dirty=true], form[aria-busy=true]')) {
          search.value = appliedSearch; filter.value = appliedStatus;
          status.dataset.tone = 'warning'; status.textContent = 'Salve ou cancele a edição do rascunho antes de filtrar a lista.'; status.focus(); return;
        }
        appliedSearch = search.value; appliedStatus = filter.value; show();
      };
      search.addEventListener("input", filterRecords); filter.addEventListener('change', filterRecords); show();
    } else if (section === "proposals") {
      if (!data.demands.some((demand) => demand.status !== "draft")) root.append(emptyState('Nenhuma negociação disponível', workspace.organizationRole === 'buyer' ? 'Publique uma demanda para receber propostas.' : 'As demandas compatíveis aparecerão em Oportunidades. Mantenha seu perfil industrial atualizado.'));
      const entries = [];
      data.demands.filter((demand) => demand.status !== "draft").forEach((demand) => {
        const record = box(demand.title); row(record, "Estado", labels[demand.status]);
        record.classList.add('workflow-negotiation');
        const reference = el('span', `Referência: ${demand.id}`); reference.className = 'workflow-reference'; record.prepend(reference);
        const proposals = data.proposals.filter((proposal) => proposal.demandId === demand.id);
        const acceptedOrder = data.orders.find(order => order.demandId === demand.id);
        linkTo(record, "Ver requisitos da demanda", "demands", demand.id);
        if (acceptedOrder) linkTo(record, "Acompanhar pedido", "orders", acceptedOrder.id);
        const comparisonEntries = proposals.map(proposal => acceptedOrder && (acceptedOrder.sourceProposalId === proposal.id || acceptedOrder.supplierId === proposal.supplierId)
          ? { ...proposal, versions: [acceptedOrder.version] } : proposal);
        if (workspace.organizationRole === 'buyer' && proposals.length) record.append(comparison(comparisonEntries, name, (cell, proposal) => {
          const version = proposal.versions.at(-1);
          if (acceptedOrder) { cell.append(el('strong', acceptedOrder.supplierId === proposal.supplierId ? 'Proposta aceita' : 'Não selecionada')); return; }
          if (!isCalendarDate(version.validUntil) || version.validUntil < todayInSaoPaulo()) { cell.append(el('span', 'Proposta vencida ou sem validade informada')); return; }
          action(cell, 'Aceitar versão e gerar pedido', () => workflow.acceptProposal(workspace.id, proposal.id, version.id), `Confirmar aceite da versão ${version.revision}?\n\n${name(proposal.supplierId)}\n${demand.title}\nQuantidade: ${quantitySummary(demand)}\nTotal com frete: ${money(version.totalCents + version.freightCents)}\nPrazo: ${version.leadTimeDays} dias\nPagamento: ${version.payment}\nGarantia: ${version.warranty}\n\nEsta decisão criará um único pedido para a demanda.`);
        }, acceptedOrder ? 'Condições da negociação, com a versão aceita preservada no pedido' : undefined));
        if (!proposals.length) record.append(el("p", "Nenhuma proposta enviada."));
        proposals.forEach((proposal) => {
          const current = proposal.versions.at(-1);
          const versions = el("details"); versions.className = 'workflow-proposal-history'; versions.append(el("summary", `${name(proposal.supplierId)} · ${proposal.versions.length} ${proposal.versions.length === 1 ? 'versão' : 'versões'}`)); versions.open = workspace.organizationRole === 'supplier';
          [...proposal.versions].reverse().forEach((version) => {
            const part = box(`Versão ${version.revision}`);
            const versionState = el('span', version.id === current.id ? 'Versão atual' : 'Substituída'); versionState.className = 'workflow-version-label'; part.append(versionState);
            row(part, "Itens + frete", `${money(version.totalCents)} + ${money(version.freightCents)} = ${money(version.totalCents + version.freightCents)}`);
            row(part, "Prazo", `${version.leadTimeDays} dias`); row(part, "Validade", version.validUntil.split('-').reverse().join('/')); row(part, "Fabricante", version.manufacturer); row(part, "Pagamento", version.payment); row(part, "Garantia", version.warranty); row(part, "Resposta técnica", version.technical);
            versions.append(part);
          }); record.append(versions);
        });
        if (workspace.organizationRole === "supplier" && demand.status === "published") {
          const editor = el("details"); editor.className = 'workflow-editor'; editor.append(el("summary", proposals.length ? "Enviar nova versão" : "Preparar proposta"));
          const previous = proposals[0]?.versions.at(-1);
          editor.append(form([["price", "Valor total dos itens (R$)", "number"], ["freight", "Frete (R$)", "number", "0"], ["leadTimeDays", "Prazo em dias", "number"], ["validUntil", "Válida até", "date"], ["manufacturer", "Fabricante real"], ["payment", "Condição de pagamento"], ["warranty", "Garantia e responsável"], ["technical", "Resposta à especificação", "textarea"]], "Enviar versão da proposta", (values) => workflow.sendProposal(workspace.id, demand.id, { ...values, totalCents: Math.round(Number(values.price) * 100), freightCents: Math.round(Number(values.freight) * 100) }), report, previous ? { ...previous, price: previous.totalCents / 100, freight: previous.freightCents / 100 } : {}, canContinue, runCommand));
          record.append(editor);
        }
        entries.push({ record: demand, node: record });
      });
      root.append(recordCollection({ section, entries, data, filters: recordsFilter, selectedRecordId, canFilter: canContinue }));
    } else {
      if (!data.orders.length) root.append(emptyState('Nenhum pedido registrado', workspace.organizationRole === 'buyer' ? 'Aceite uma proposta para criar o pedido e acompanhar a entrega.' : 'Os pedidos aparecem aqui quando o comprador aceita uma proposta da sua empresa.'));
      const entries = [];
      data.orders.forEach((order) => {
        const record = box(order.title); const reference = el('span', `Referência: ${order.id}`); reference.className = 'workflow-reference'; record.prepend(reference);
        row(record, "Estado", labels[order.status]); row(record, workspace.organizationRole === 'buyer' ? "Fornecedor" : "Comprador", workspace.organizationRole === 'buyer' ? name(order.supplierId) : order.buyerName ?? order.buyerId); row(record, "Quantidade por unidade", quantitySummary(order)); row(record, "Versão preservada", order.version.revision); row(record, "Total com frete", money(order.version.totalCents + order.version.freightCents));
        record.classList.add('workflow-order'); record.append(orderProgress(order));
        const hints = workspace.organizationRole === "buyer"
          ? { accepted: "O fornecedor deve registrar a inspeção.", blocked: "O fornecedor deve corrigir e reinspecionar o pedido.", released: "Aguardando o fornecedor registrar a expedição.", dispatched: "Confira a entrega e confirme o recebimento abaixo.", delivered: order.evaluation ? "Jornada concluída. A avaliação está registrada." : "Recebimento confirmado. Registre sua avaliação abaixo." }
          : { accepted: "Registre a inspeção para liberar a expedição.", blocked: "Após a correção, registre uma nova inspeção.", released: "Registre a expedição quando o pedido sair para entrega.", dispatched: "Aguardando o comprador confirmar o recebimento.", delivered: "O comprador confirmou o recebimento." };
        const hint = el("p", hints[order.status] ?? "Consulte a situação do pedido."); hint.className = "workflow-next-step"; record.append(hint);
        if (original.demands.some(demand => demand.id === order.demandId)) linkTo(record, "Consultar negociação", "proposals", order.demandId);
        if (order.destination) row(record, 'Destino de entrega', order.destination);
        if (order.requiredBy) row(record, 'Prazo solicitado', order.requiredBy.split('-').reverse().join('/'));
        row(record, "Prazo contratado", `${order.version.leadTimeDays} dias`);
        row(record, "Pagamento", order.version.payment);
        row(record, "Garantia", order.version.warranty);
        (order.inspections ?? []).forEach((inspection, index) => row(record, `Inspeção ${index + 1}`, `${inspectionSummary(order, inspection)} · ${inspection.plan} · ${inspection.evidence}`));
        if (workspace.organizationRole === "supplier") {
          if (["accepted", "blocked"].includes(order.status)) {
            const inspection = el("details"); inspection.append(el("summary", "Registrar inspeção / reinspeção"));
            const multiple = order.items?.length > 1;
            const quantityFields = multiple
              ? order.items.map((item, index) => [`approved-${index}`, `${item.description} · quantidade aprovada (${item.unit})`, 'number'])
              : [['approved', 'Quantidade aprovada', 'number']];
            const inspectionForm = form([...quantityFields, ["plan", "Plano de inspeção e versão"], ["evidence", "Resultado e evidência da inspeção", "textarea"]], "Registrar inspeção", (values) => workflow.recordInspection(workspace.id, order.id, multiple ? {
              plan: values.plan, evidence: values.evidence,
              itemApprovals: order.items.map((item, index) => ({ itemId: item.id ?? `item-${index + 1}`, approved: values[`approved-${index}`] })),
            } : values), report, {}, canContinue, runCommand);
            quantityFields.forEach(([name], index) => { inspectionForm.elements[name].max = multiple ? order.items[index].quantity : order.quantity; });
            inspection.append(el('p', `Quantidade contratada: ${quantitySummary(order)}. Informe o total aprovado após esta inspeção, incluindo o que já estava aprovado.`));
            inspection.append(inspectionForm); record.append(inspection);
          }
          if (order.status === "released") action(record, "Registrar expedição", () => workflow.dispatchOrder(workspace.id, order.id), true);
        } else {
          if (order.status === "dispatched") action(record, "Confirmar recebimento", () => workflow.confirmDelivery(workspace.id, order.id), true);
          if (order.status === "delivered" && !order.evaluation) record.append(form([["score", "Nota de 1 a 5", "number"], ["comment", "Comentário sobre a entrega", "textarea"]], "Enviar avaliação", (values) => workflow.evaluateOrder(workspace.id, order.id, values), report, {}, canContinue, runCommand));
        }
        if (order.evaluation) row(record, "Avaliação da entrega", `${order.evaluation.score}/5 · ${order.evaluation.comment}`);
        const print = el('button', 'Imprimir resumo'); print.type = 'button'; print.className = 'workflow-secondary-action';
        print.addEventListener('click', () => {
          try { printOrder(order); }
          catch { status.dataset.tone = 'error'; status.textContent = 'Não foi possível abrir a impressão. Tente novamente.'; status.focus(); }
        });
        record.append(print);
        entries.push({ record: order, node: record });
      });
      root.append(recordCollection({ section, entries, data, filters: recordsFilter, selectedRecordId, canFilter: canContinue, onExport: orders => {
        try {
          downloadOrdersCsv(orders);
          status.dataset.tone = 'success'; status.textContent = `CSV preparado com ${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'} da lista atual.`;
        } catch { status.dataset.tone = 'error'; status.textContent = 'Não foi possível preparar o CSV. Tente novamente.'; }
      } }));
    }
  }
  status.textContent = workflow.getSyncWarning?.(workspace.id) ?? '';
  if (status.textContent) status.dataset.tone = 'warning';
  render();
  return () => root.remove();
}
