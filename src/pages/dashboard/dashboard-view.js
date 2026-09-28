import { renderNextActions } from "./next-actions-view.js";
import { renderPageState } from "../../components/page-state/page-state.js";
import { mountIndustrialRail } from "../../visualizations/industrial-rail/industrial-rail.js";
import { workflowLink } from '../../domain/next-actions.js';
import { quantitySummary } from '../../domain/quantity.js';

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

const aggregateLabels = Object.freeze({
  demands: "Demandas",
  matchedOrganizations: "Organizações no match",
  respondingOrganizations: "Organizações respondentes",
  orders: "Pedidos",
  nonConformities: "Não conformidades",
});

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function renderMetric(metric) {
  const card = element("article", "metric-card");
  card.dataset.metric = metric.id;
  card.append(
    element("span", "metric-card__label", metric.label),
    element("strong", "metric-card__value", metric.display),
    element("small", "metric-card__unit", metric.unit),
  );

  const details = element("details", "metric-card__method");
  details.append(element("summary", "", "Como calculamos"));
  const list = element("dl");
  for (const [label, value] of [
    ["Fórmula", metric.formula],
    ["Período", metric.period],
    ["Origem", metric.source],
  ]) {
    list.append(element("dt", "", label), element("dd", "", value));
  }
  details.append(list);
  card.append(details);
  return card;
}

function renderBuyer(data) {
  const section = element("section", "dashboard-panel dashboard-panel--decision");
  const heading = element("div", "dashboard-panel__heading");
  heading.append(
    element("h2", "", "Propostas por demanda"),
  );
  section.append(heading);

  const table = element("table", "decision-table");
  table.innerHTML = "<thead><tr><th scope='col'>Demanda / fornecedor</th><th scope='col'>Total com frete</th><th scope='col'>Prazo</th><th scope='col'>Situação</th></tr></thead>";
  const body = element("tbody");
  if (!data.proposalSummaries.length) {
    const empty = element("div", "dashboard-empty");
    empty.append(element("h3", "", "Nenhuma proposta recebida"), element("p", "", "Publique uma demanda com os requisitos da compra para receber propostas."));
    const link = element("a", "dashboard-link", "Abrir minhas demandas");
    link.href = "#/app/comprador/demandas";
    empty.append(link);
    section.append(empty);
    return section;
  }
  data.proposalSummaries.forEach((proposal) => {
    const row = element("tr");
    if (proposal.accepted) row.dataset.decision = "accepted";
    const identity = element('td');
    if (proposal.href) {
      const link = element('a', 'dashboard-record-link', proposal.demandTitle);
      link.href = proposal.href; identity.append(link);
    } else identity.append(element('strong', '', proposal.demandTitle ?? 'Proposta recebida'));
    identity.append(element('span', 'dashboard-record-detail', proposal.supplierName));
    row.append(identity);
    const values = [
      proposal.latestTotalDisplay,
      `${proposal.leadTimeDays} dias`,
      proposal.decisionLabel ?? (proposal.accepted ? "Versão aceita" : "Não selecionada"),
    ];
    values.forEach((value) => row.append(element("td", "", value)));
    body.append(row);
  });
  table.append(body);
  const scroll = element("div", "dashboard-table-scroll");
  scroll.tabIndex = 0;
  scroll.setAttribute("role", "region");
  scroll.setAttribute("aria-label", "Propostas recebidas por demanda");
  scroll.append(table);
  section.append(scroll);
  return section;
}

function renderSupplier(data) {
  const section = element("section", "dashboard-panel dashboard-panel--fulfillment");
  const heading = element("div", "dashboard-panel__heading");
  heading.append(
    element("h2", "", "Plano de atendimento próprio"),
  );
  section.append(heading);

  if (data.execution.model === null) {
    heading.querySelector("h2").textContent = "Pedidos em execução";
    const summary = element('ul', 'dashboard-order-list');
    const labels = { accepted: 'Aguardando inspeção', blocked: 'Reinspeção necessária', released: 'Pronto para expedição', dispatched: 'Aguardando recebimento' };
    for (const order of data.execution.orders) {
      const item = element('li');
      const copy = element('div');
      const link = element('a', 'dashboard-record-link', order.title);
      link.href = workflowLink('supplier', 'orders', order.id);
      copy.append(link, element('span', 'dashboard-record-detail', `${order.buyerName ?? 'Comprador'} · ${quantitySummary(order)}`));
      item.append(copy, element('span', '', labels[order.status] ?? order.status));
      summary.append(item);
    }
    if (!data.execution.orders.length) section.append(element('p', 'dashboard-panel__note', 'Nenhum pedido em execução. Os próximos aceites dos compradores aparecerão aqui.'));
    const link = element("a", "dashboard-link", "Ver todos os pedidos");
    link.href = "#/app/fornecedor/pedidos";
    section.append(summary, link);
    return section;
  }
  const total = data.execution.stockQuantity + data.execution.productionQuantity;
  const split = element("div", "fulfillment-split");
  split.setAttribute("aria-label", `Atendimento próprio: ${data.execution.stockQuantity} em estoque e ${data.execution.productionQuantity} em produção`);
  const stock = element("div", "fulfillment-split__stock");
  stock.style.flexGrow = String(data.execution.stockQuantity || 1);
  stock.append(element("span", "", "Estoque"), element("strong", "", String(data.execution.stockQuantity)));
  const production = element("div", "fulfillment-split__production");
  production.style.flexGrow = String(data.execution.productionQuantity || 1);
  production.append(element("span", "", "Produção"), element("strong", "", String(data.execution.productionQuantity)));
  split.append(stock, production);
  section.append(
    split,
    element("p", "dashboard-panel__note", `${total} unidades no compromisso. A visão contém somente sua proposta, seus lotes e seus marcos operacionais.`),
  );
  return section;
}

function renderAdministration(data) {
  const section = element("section", "dashboard-panel dashboard-panel--aggregate");
  const heading = element("div", "dashboard-panel__heading");
  heading.append(
    element("h2", "", "Atividade das empresas"),
  );
  section.append(heading);

  const grid = element("div", "aggregate-grid");
  Object.entries(data.aggregates).forEach(([key, value], index) => {
    const card = element("div", "aggregate-card");
    card.dataset.aggregateIndex = String(index + 1).padStart(2, "0");
    card.append(
      element("strong", "", String(value)),
      element("span", "", aggregateLabels[key] ?? key),
    );
    grid.append(card);
  });
  section.append(grid, element("p", "dashboard-panel__notice", data.limitation));
  return section;
}

const roleRenderer = Object.freeze({
  buyer: renderBuyer,
  supplier: renderSupplier,
  administration: renderAdministration,
});

function renderRailPanel() {
  const section = element("section", "dashboard-panel dashboard-panel--rail-slot");
  const heading = element("div", "dashboard-panel__heading");
  heading.append(
    element("h2", "", "Acompanhamento da compra"),
  );
  const slot = element("div", "dashboard-panel__rail");
  slot.dataset.industrialRailSlot = "true";
  section.append(heading, slot);
  return { section, slot };
}

export function mountDashboardPage({
  container,
  workspace,
  repository,
  supplierProfiles,
  mountJourney = mountIndustrialRail,
  onReady = () => {},
}) {
  let active = true;
  let loadVersion = 0;
  let retryInFlight = false;
  let clearPageState = () => {};
  let clearJourney = () => {};

  const renderStatus = (status, onRetry) => {
    clearJourney();
    clearJourney = () => {};
    clearPageState();
    clearPageState = renderPageState(container, { status, onRetry });
    container.dataset.dashboardStatus = status;
  };

  const retry = async () => {
    if (!active || retryInFlight) return;

    retryInFlight = true;
    renderStatus("loading");
    try {
      await repository.reset?.();
      if (active) await load();
    } catch {
      if (active) renderStatus("error", retry);
    } finally {
      retryInFlight = false;
    }
  };

  const load = async () => {
    const currentLoad = ++loadVersion;
    renderStatus("loading");

    try {
      let dashboardResult;
      try {
        dashboardResult = await repository.getDashboard(workspace.id);
      } catch {
        dashboardResult = { status: "error" };
      }
      if (!active || currentLoad !== loadVersion) return;

      if (dashboardResult.status !== "ready") {
        renderStatus(dashboardResult.status, retry);
        return;
      }

      let journeyResult;
      try {
        journeyResult = await repository.getIndustrialJourney(workspace.id);
      } catch {
        journeyResult = { status: "error" };
      }
      if (!active || currentLoad !== loadVersion) return;
      if (journeyResult.status !== "ready") {
        renderStatus(journeyResult.status, retry);
        return;
      }

      const data = dashboardResult.data;
      let missingProfile = false;
      if (data.role === 'supplier' && supplierProfiles && workspace.memberUid) {
        try { missingProfile = !(await supplierProfiles.getProfile(workspace.id)); } catch { /* O perfil continua acessível pela navegação. */ }
        if (!active || currentLoad !== loadVersion) return;
      }
      const renderRole = roleRenderer[data.role];
      if (!renderRole) throw new Error(`Dashboard sem renderer para o papel: ${data.role}`);

      clearPageState();
      container.replaceChildren();
      const page = element("section", "dashboard-page");
      page.dataset.pageState = "success";
      page.dataset.dashboardRole = data.role;
      page.innerHTML = `
        <header class="dashboard-hero">
          <div class="dashboard-hero__copy">
            <h1 data-page-title></h1>
            <p></p>
          </div>
          <div class="dashboard-hero__stamp"></div>
        </header>`;
      page.querySelector("h1").textContent = data.title;
      page.querySelector("header p").textContent = data.role === "buyer" ? "Acompanhe suas compras, compare propostas e confira entregas." : data.role === "supplier" ? "Oportunidades, propostas e compromissos da sua empresa." : "Acompanhe a atividade das empresas na plataforma.";
      if (data.role === "buyer" || data.role === "supplier") {
        const firstPurchase = data.isFirstPurchase === true;
        const primary = element("a", "dashboard-primary", data.role === "buyer" ? (firstPurchase ? 'Criar primeira demanda' : "Gerenciar demandas") : "Ver oportunidades");
        primary.href = data.role === "buyer" ? "#/app/comprador/demandas" : "#/app/fornecedor/oportunidades";
        if (firstPurchase) primary.href += '?nova=1';
        page.querySelector(".dashboard-hero__stamp").append(primary);
        if (missingProfile) {
          primary.textContent = 'Completar perfil industrial';
          primary.href = '#/app/fornecedor/perfil';
          page.querySelector('header p').textContent = 'Complete as capacidades da empresa para receber oportunidades compatíveis.';
        }
      }
      const updated = new Date(dashboardResult.meta.asOf);
      const updatedLabel = dateTime.format(updated);
      const updatedElement = element('time', 'dashboard-hero__as-of');
      updatedElement.dateTime = updated.toISOString();
      updatedElement.textContent = `Atualizado em ${updatedLabel}`;

      const metricsHeader = element("div", "metrics-heading");
      metricsHeader.append(
        element("h2", "", "Resumo da empresa"), updatedElement,
      );
      const metrics = element("section", "metrics-grid");
      metrics.setAttribute("aria-label", "Resumo da empresa");
      data.metrics.forEach((metric) => metrics.append(renderMetric(metric)));

      if (data.nextActions?.length) page.append(renderNextActions(data));
      page.append(metricsHeader, metrics, renderRole(data));
      container.append(page);
      if (data.showJourney !== false) {
        const railPanel = renderRailPanel();
        const context = journeyResult.data.find(step => step.id === 'demand');
        if (context?.href) railPanel.section.querySelector('.dashboard-panel__heading').append(element('p', 'dashboard-panel__note', context.summary));
        page.append(railPanel.section);
        clearJourney = mountJourney(railPanel.slot, journeyResult.data, journeyResult.meta) ?? (() => {});
      }
      container.dataset.dashboardStatus = "ready";
      onReady();
    } catch {
      if (!active || currentLoad !== loadVersion) return;
      renderStatus("error", retry);
    }
  };

  load();
  return () => {
    active = false;
    loadVersion += 1;
    clearJourney();
    clearPageState();
    container.replaceChildren();
    delete container.dataset.dashboardStatus;
  };
}
