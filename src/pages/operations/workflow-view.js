import { workflowLink } from '../../domain/next-actions.js';
import { money, metrics, emptyState, comparison, orderProgress } from './workflow-components.js';
const labels = { draft: "Rascunho", published: "Publicada", ordered: "Pedido gerado", accepted: "Aguardando inspeção", blocked: "Bloqueado — reinspeção necessária", released: "Liberado para expedição", dispatched: "Expedido", delivered: "Entrega confirmada" };
const el = (tag, text) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; return node; };
const box = (title) => { const node = el("article"); node.className = "workflow-record"; node.append(el("h3", title)); return node; };
const row = (container, label, value) => {
  const item = el('p'); item.className = 'workflow-field';
  item.append(el('span', `${label}: `), el('strong', String(value)));
  if (label === 'Estado') { item.classList.add('workflow-state'); item.dataset.state = Object.keys(labels).find(key => labels[key] === value) ?? ''; }
  container.append(item);
};

function form(fields, label, action, report, defaults = {}) {
  const node = el("form"); node.className = 'workflow-form';
  for (const [name, title, type = "text", value = ""] of fields) {
    const field = el("label", title);
    const input = el(type === "textarea" ? "textarea" : "input");
    if (type !== "textarea") input.type = type;
    input.name = name; input.required = true; input.value = defaults[name] ?? value;
    if (type === 'textarea') field.className = 'workflow-form__wide';
    input.maxLength = 2000;
    if (type === "number") { input.min = name === "freight" || name === "approved" ? "0" : "1"; input.step = name === "price" || name === "freight" ? "0.01" : "1"; }
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
  node.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    button.disabled = true;
    const previousLabel = button.textContent;
    button.textContent = "Salvando…";
    try { await action(Object.fromEntries(new FormData(node))); report(`${label}: concluído e salvo.`); }
    catch (cause) { error.textContent = cause?.message ?? "Não foi possível salvar."; }
    finally { button.disabled = false; button.textContent = previousLabel; }
  });
  return node;
}

function demandForm(action, report) {
  const node = el("form"); node.className = "workflow-form workflow-demand-form";
  const baseFields = [
    ["title", "Título da demanda", "text"],
    ["requiredBy", "Prazo solicitado", "date"],
    ["destination", "Destino de entrega", "text"],
    ["region", "Região atendida", "text"],
    ["description", "Objetivo e observações", "textarea"],
  ];
  for (const [name, title, type] of baseFields) {
    const label = el("label", title);
    const input = el(type === "textarea" ? "textarea" : "input");
    if (type !== "textarea") input.type = type;
    input.name = name; input.required = true; input.maxLength = 2000;
    if (type === "textarea") label.className = "workflow-form__wide";
    label.append(input); node.append(label);
  }
  const itemSection = el("section"); itemSection.className = "workflow-demand-items workflow-form__wide";
  itemSection.append(el("h3", "Itens da demanda"));
  const itemList = el("div"); itemList.dataset.demandItems = "true"; itemSection.append(itemList);
  const add = el("button", "Adicionar outro item"); add.type = "button"; add.className = "workflow-secondary-action"; itemSection.append(add);
  const addItem = () => {
    const index = itemList.children.length + 1;
    const fieldset = el("fieldset"); fieldset.dataset.demandItem = "true";
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
      input.name = name; input.type = type; input.required = required; input.maxLength = 500;
      if (type === "number") { input.min = "1"; input.step = "1"; }
      if (name === "unit") input.value = "un";
      label.append(input); fieldset.append(label);
    }
    const remove = el("button", "Remover item"); remove.type = "button"; remove.className = "workflow-remove-item";
    remove.addEventListener("click", () => { if (itemList.children.length > 1) { fieldset.remove(); [...itemList.children].forEach((item, position) => { item.querySelector("legend").textContent = `Item ${position + 1}`; }); } });
    fieldset.append(remove); itemList.append(fieldset);
  };
  add.addEventListener("click", addItem); addItem(); node.append(itemSection);
  const footer = el("div"); footer.className = "workflow-form__footer";
  const button = el("button", "Salvar rascunho"); button.type = "submit"; footer.append(button); node.append(footer);
  const error = el("p"); error.setAttribute("role", "alert"); node.append(error);
  node.addEventListener("submit", async (event) => {
    event.preventDefault(); error.textContent = ""; button.disabled = true; button.textContent = "Salvando…";
    try {
      const base = Object.fromEntries(new FormData(node));
      const items = [...itemList.querySelectorAll("[data-demand-item]")].map((item) => ({
        description: item.elements?.description?.value ?? item.querySelector("[name='description']").value,
        category: item.querySelector("[name='category']").value,
        material: item.querySelector("[name='material']").value,
        process: item.querySelector("[name='process']").value,
        certifications: item.querySelector("[name='certifications']").value,
        quantity: item.querySelector("[name='quantity']").value,
        unit: item.querySelector("[name='unit']").value,
      }));
      await action({ ...base, items });
      report("Rascunho salvo.");
    } catch (cause) {
      error.textContent = cause?.message ?? "Não foi possível salvar a demanda.";
    } finally { button.disabled = false; button.textContent = "Salvar rascunho"; }
  });
  return node;
}

export function mountWorkflowView({ container, workspace, workflow, section, suppliers, selectedRecordId = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("registro") }) {
  const root = el("section"); root.dataset.workflow = section; container.append(root);
  const status = el("p"); status.setAttribute("role", "status");
  status.className = 'workflow-feedback';
  function action(parent, title, callback, confirmation = false) {
    const button = el("button", title); button.type = "button"; parent.append(button);
    button.addEventListener("click", async () => {
      if (confirmation && !window.confirm(typeof confirmation === 'string' ? confirmation : `${title}?`)) return;
      button.disabled = true;
      try { await callback(); render(); status.textContent = `${title}: concluído e salvo.`; }
      catch (cause) { status.textContent = cause?.message ?? "Não foi possível concluir a ação."; }
      finally { button.disabled = false; }
    });
  }
  const report = (message) => { render(); status.textContent = message; };
  const name = (id) => suppliers.find((supplier) => supplier.id === id)?.name ?? id;
  const linkTo = (parent, label, targetSection, id) => {
    const link = el("a", label); link.className = "workflow-related-link";
    link.href = workflowLink(workspace.organizationRole, targetSection, id); parent.append(link);
  };
  function render() {
    const original = workflow.read(workspace.id);
    const data = { ...original };
    const collection = section === "orders" ? "orders" : "demands";
    if (selectedRecordId) data[collection] = original[collection].filter(record => record.id === selectedRecordId);
    const active = data.demands.filter(item => item.status === 'published').length;
    const stats = section === 'demands'
      ? [['Demandas da empresa', data.demands.length, 'Necessidades registradas'], ['Abertas para propostas', active, 'Negociação em andamento'], ['Pedidos gerados', data.orders.length, 'Propostas aceitas']]
      : section === 'proposals'
        ? [['Propostas', data.proposals.length, 'Negociações da empresa'], ['Versões enviadas', data.proposals.reduce((sum, item) => sum + item.versions.length, 0), 'Histórico preservado'], ['Pedidos gerados', data.orders.length, 'Decisões confirmadas']]
        : [['Pedidos', data.orders.length, 'Compromissos da empresa'], ['Em execução', data.orders.filter(item => item.status !== 'delivered').length, 'Acompanhe os próximos passos'], ['Entregues', data.orders.filter(item => item.status === 'delivered').length, 'Recebimento confirmado']];
    root.replaceChildren(metrics(stats), status);
    const sectionHeading = el('div'); sectionHeading.className = 'workflow-section-heading';
    sectionHeading.append(el('h2', section === 'demands' ? workspace.organizationRole === 'buyer' ? 'Minhas demandas' : 'Oportunidades disponíveis' : section === 'proposals' ? 'Negociações da empresa' : 'Acompanhamento de pedidos'), el('span', 'REGISTROS DA EMPRESA'));
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
        panel.open = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('nova') === '1';
        panel.append(el('p', 'Descreva o que sua empresa precisa. Salve um rascunho e publique quando as informações estiverem prontas.'));
        panel.append(demandForm((values) => workflow.createDemand(workspace.id, values), report));
        root.append(panel);
      }
      if (!data.demands.length) root.append(emptyState(workspace.organizationRole === 'buyer' ? 'Nenhuma demanda cadastrada' : 'Nenhuma oportunidade disponível', workspace.organizationRole === 'buyer' ? 'Crie sua primeira demanda com especificação, quantidade e prazo. Os fornecedores poderão responder com suas condições.' : 'Mantenha seu perfil industrial atualizado para encontrar demandas compatíveis.'));
      const toolbar = el('div'); toolbar.className = 'workflow-toolbar';
      const searchLabel = el("label", "Buscar demandas"); const search = el("input"); search.type = "search"; search.placeholder = 'Buscar por título da demanda…'; searchLabel.append(search); toolbar.append(searchLabel);
      const filterLabel = el('label', 'Situação'); const filter = el('select'); filter.setAttribute('aria-label', 'Situação');
      [['', 'Todas as situações'], ['draft', 'Rascunho'], ['published', 'Publicada'], ['ordered', 'Pedido gerado']].forEach(([value, label]) => { const option = el('option', label); option.value = value; filter.append(option); }); filterLabel.append(filter); toolbar.append(filterLabel); root.append(toolbar);
      const list = el("div"); list.className = 'workflow-record-list'; root.append(list);
      const show = () => {
        list.replaceChildren();
        const demands = data.demands.filter((item) => item.title.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()) && (!filter.value || item.status === filter.value));
        if (data.demands.length && !demands.length) { list.append(el("p", "Nenhum registro corresponde à busca.")); const clear = el('button', 'Limpar filtros'); clear.type = 'button'; clear.addEventListener('click', () => { search.value = ''; filter.value = ''; show(); }); list.append(clear); }
        demands.forEach((demand) => {
          const record = box(demand.title); record.classList.add('workflow-demand');
          const reference = el('span', demand.id.toUpperCase()); reference.className = 'workflow-reference'; record.prepend(reference);
          row(record, "Estado", labels[demand.status]);
          const info = el('div'); info.className = 'workflow-facts';
          row(info, "Quantidade total", `${demand.quantity.toLocaleString('pt-BR')} unidades`); row(info, "Prazo", demand.requiredBy.split('-').reverse().join('/')); row(info, "Destino", demand.destination); record.append(info);
          const specification = el('details'); specification.className = 'workflow-specification'; specification.append(el('summary', `Ver especificação técnica · ${(demand.items ?? []).length || 1} item(ns)`), el('p', demand.description));
          (demand.items ?? []).forEach((item, index) => {
            const itemDetail = box(`Item ${index + 1} · ${item.description}`);
            row(itemDetail, "Categoria", item.category); row(itemDetail, "Material", item.material); row(itemDetail, "Processo", item.process); row(itemDetail, "Quantidade", `${item.quantity} ${item.unit}`); row(itemDetail, "Certificações", item.certifications?.join(", ") || "Não informadas");
            specification.append(itemDetail);
          });
          if (workspace.organizationRole === "supplier" && demand.match) {
            const match = box(`Match: ${demand.match.status === "compatible" ? "Compatível" : "Compatível com ressalvas"}`);
            match.classList.add("workflow-match");
            (demand.match.criteria ?? []).forEach((criterion) => row(match, criterion.label, criterion.explanation));
            specification.append(match);
          }
          record.append(specification);
          if (demand.status === "draft") action(record, "Publicar demanda", () => workflow.publishDemand(workspace.id, demand.id), true);
          if (workspace.organizationRole === "supplier" && demand.status === "published") {
            const link = el("a", "Enviar proposta"); link.href = workflowLink("supplier", "proposals", demand.id); record.append(link);
          }
          if (workspace.organizationRole === "buyer" && demand.status === "published") linkTo(record, "Acompanhar propostas →", "proposals", demand.id);
          const order = data.orders.find(item => item.demandId === demand.id);
          if (order) linkTo(record, "Acompanhar pedido →", "orders", order.id);
          list.append(record);
        });
      };
      search.addEventListener("input", show); filter.addEventListener('change', show); show();
    } else if (section === "proposals") {
      if (!data.demands.some((demand) => demand.status !== "draft")) root.append(emptyState('Nenhuma negociação disponível', workspace.organizationRole === 'buyer' ? 'Publique uma demanda para receber propostas.' : 'As demandas compatíveis aparecerão em Oportunidades. Mantenha seu perfil industrial atualizado.'));
      data.demands.filter((demand) => demand.status !== "draft").forEach((demand) => {
        const record = box(demand.title); row(record, "Estado", labels[demand.status]);
        const proposals = data.proposals.filter((proposal) => proposal.demandId === demand.id);
        const acceptedOrder = data.orders.find(order => order.demandId === demand.id);
        linkTo(record, "Ver requisitos da demanda →", "demands", demand.id);
        if (acceptedOrder) linkTo(record, "Acompanhar pedido →", "orders", acceptedOrder.id);
        if (workspace.organizationRole === 'buyer' && proposals.length) record.append(comparison(proposals, name, (cell, proposal) => {
          const version = proposal.versions.at(-1);
          if (acceptedOrder) { cell.append(el('strong', acceptedOrder.supplierId === proposal.supplierId ? 'Proposta aceita' : 'Não selecionada')); return; }
          if (version.validUntil < new Date().toISOString().slice(0, 10)) { cell.append(el('span', 'Proposta vencida')); return; }
          action(cell, 'Aceitar versão e gerar pedido', () => workflow.acceptProposal(workspace.id, proposal.id, version.id), `Confirmar aceite da versão ${version.revision}?\n\n${name(proposal.supplierId)}\n${demand.title}\nQuantidade: ${demand.quantity}\nTotal com frete: ${money(version.totalCents + version.freightCents)}\nPrazo: ${version.leadTimeDays} dias\nPagamento: ${version.payment}\nGarantia: ${version.warranty}\n\nEsta decisão criará um único pedido para a demanda.`);
        }));
        if (!proposals.length) record.append(el("p", "Nenhuma proposta enviada."));
        proposals.forEach((proposal) => {
          const current = proposal.versions.at(-1);
          const versions = el("details"); versions.className = 'workflow-proposal-history'; versions.append(el("summary", `${name(proposal.supplierId)} — ${proposal.versions.length} versão(ões)`)); versions.open = workspace.organizationRole === 'supplier';
          [...proposal.versions].reverse().forEach((version) => {
            const part = box(`Versão ${version.revision}`);
            const versionState = el('span', version.id === current.id ? 'Versão atual' : 'Substituída'); versionState.className = 'workflow-version-label'; part.append(versionState);
            row(part, "Itens + frete", `${money(version.totalCents)} + ${money(version.freightCents)} = ${money(version.totalCents + version.freightCents)}`);
            row(part, "Prazo", `${version.leadTimeDays} dias`); row(part, "Validade", version.validUntil); row(part, "Fabricante", version.manufacturer); row(part, "Pagamento", version.payment); row(part, "Garantia", version.warranty); row(part, "Resposta técnica", version.technical);
            versions.append(part);
          }); record.append(versions);
        });
        if (workspace.organizationRole === "supplier" && demand.status === "published") {
          const editor = el("details"); editor.className = 'workflow-editor'; editor.append(el("summary", proposals.length ? "Enviar nova versão" : "Preparar proposta"));
          const previous = proposals[0]?.versions.at(-1);
          editor.append(form([["price", "Valor total dos itens (R$)", "number"], ["freight", "Frete (R$)", "number", "0"], ["leadTimeDays", "Prazo em dias", "number"], ["validUntil", "Válida até", "date"], ["manufacturer", "Fabricante real"], ["payment", "Condição de pagamento"], ["warranty", "Garantia e responsável"], ["technical", "Resposta à especificação", "textarea"]], "Enviar versão da proposta", (values) => workflow.sendProposal(workspace.id, demand.id, { ...values, totalCents: Math.round(Number(values.price) * 100), freightCents: Math.round(Number(values.freight) * 100) }), report, previous ? { ...previous, price: previous.totalCents / 100, freight: previous.freightCents / 100 } : {}));
          record.append(editor);
        }
        root.append(record);
      });
    } else {
      if (!data.orders.length) root.append(emptyState('Da proposta aceita à entrega.', 'Ao aceitar uma proposta, o pedido aparece aqui com as condições preservadas e as próximas etapas da execução.'));
      data.orders.forEach((order) => {
        const record = box(`${order.id} · ${order.title}`); row(record, "Estado", labels[order.status]); row(record, "Fornecedor", name(order.supplierId)); row(record, "Quantidade", order.quantity); row(record, "Versão preservada", order.version.revision); row(record, "Total com frete", money(order.version.totalCents + order.version.freightCents));
        record.classList.add('workflow-order'); record.append(orderProgress(order));
        const hints = workspace.organizationRole === "buyer"
          ? { accepted: "O fornecedor deve registrar a inspeção.", blocked: "O fornecedor deve corrigir e reinspecionar o pedido.", released: "Aguardando o fornecedor registrar a expedição.", dispatched: "Confira a entrega e confirme o recebimento abaixo.", delivered: order.evaluation ? "Jornada concluída. A avaliação está registrada." : "Recebimento confirmado. Registre sua avaliação abaixo." }
          : { accepted: "Registre a inspeção para liberar a expedição.", blocked: "Após a correção, registre uma nova inspeção.", released: "Registre a expedição quando o pedido sair para entrega.", dispatched: "Aguardando o comprador confirmar o recebimento.", delivered: "O comprador confirmou o recebimento." };
        const hint = el("p", hints[order.status] ?? "Consulte a situação do pedido."); hint.className = "workflow-next-step"; record.append(hint);
        if (original.demands.some(demand => demand.id === order.demandId)) linkTo(record, "Consultar negociação →", "proposals", order.demandId);
        row(record, "Condições preservadas", `${order.version.leadTimeDays} dias · ${order.version.payment} · ${order.version.warranty}`);
        (order.inspections ?? []).forEach((inspection, index) => row(record, `Inspeção ${index + 1}`, `${inspection.approved}/${order.quantity} aprovadas · ${inspection.plan} · ${inspection.evidence}`));
        if (workspace.organizationRole === "supplier") {
          if (["accepted", "blocked"].includes(order.status)) {
            const inspection = el("details"); inspection.append(el("summary", "Registrar inspeção / reinspeção"));
            inspection.append(form([["approved", "Quantidade aprovada", "number"], ["plan", "Plano de inspeção e versão"], ["evidence", "Resultado e evidência da inspeção", "textarea"]], "Registrar inspeção", (values) => workflow.recordInspection(workspace.id, order.id, values), report)); record.append(inspection);
          }
          if (order.status === "released") action(record, "Registrar expedição", () => workflow.dispatchOrder(workspace.id, order.id), true);
        } else {
          if (order.status === "dispatched") action(record, "Confirmar recebimento", () => workflow.confirmDelivery(workspace.id, order.id), true);
          if (order.status === "delivered" && !order.evaluation) record.append(form([["score", "Nota de 1 a 5", "number"], ["comment", "Comentário sobre a entrega", "textarea"]], "Enviar avaliação", (values) => workflow.evaluateOrder(workspace.id, order.id, values), report));
        }
        if (order.evaluation) row(record, "Avaliação da entrega", `${order.evaluation.score}/5 · ${order.evaluation.comment}`);
        root.append(record);
      });
    }
  }
  render();
  return () => root.remove();
}
