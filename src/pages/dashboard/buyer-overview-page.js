import { renderPageState } from "../../components/page-state/page-state.js";
import { buildLiveDashboard } from "../../domain/live-marketplace-selectors.js";
import { workflowLink } from "../../domain/next-actions.js";

const create = (tag, className, value) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = String(value);
  return node;
};
const anchor = (label, href, className = "") => {
  const node = create("a", className, label);
  node.href = href;
  return node;
};
const newDemand = "#/app/comprador/demandas?nova=1";
const recent = (items) => [...items].sort((a, b) => (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0));
const count = (value) => String(value).padStart(2, "0");

function supplierButton() {
  return anchor("⌕  Buscar fornecedores", "#/app/comprador/fornecedores", "buyer-button buyer-button--outline");
}

function metric(label, value, note, icon, orange = false) {
  const card = create("article", "buyer-metric");
  const top = create("div", "buyer-metric__top");
  top.append(create("span", "", label), create("span", "buyer-metric__icon", icon));
  card.append(top, create("strong", "buyer-metric__value", count(value)), create("small", orange ? "buyer-metric__orange" : "", note));
  return card;
}

function recentDemands(records) {
  const panel = create("section", "buyer-panel buyer-demands");
  const heading = create("div", "buyer-panel__heading");
  heading.append(create("h2", "", "Demandas recentes"), anchor("Ver todas as demandas", "#/app/comprador/demandas"));
  panel.append(heading);
  const demands = recent(records.demands);
  if (!demands.length) {
    const empty = create("div", "buyer-empty");
    empty.append(create("p", "", "Nenhuma demanda cadastrada. Descreva o que sua empresa precisa comprar."), anchor("+ Criar primeira demanda", newDemand, "buyer-button buyer-button--primary"));
    panel.append(empty);
    return panel;
  }
  const priority = demands.find((demand) => demand.status === "published") ?? demands[0];
  const featured = anchor("", workflowLink("buyer", "demands", priority.id), "buyer-priority");
  const featuredCopy = create("span");
  featuredCopy.append(create("small", "", "DEMANDA EM DESTAQUE"), create("strong", "", priority.title));
  featured.append(create("span", "buyer-priority__icon", "⚙"), featuredCopy, create("span", "buyer-priority__count", `${records.proposals.filter((item) => item.demandId === priority.id).length} PROPOSTAS`));
  panel.append(featured);
  const table = create("div", "buyer-demand-table");
  const labels = create("div", "buyer-demand-table__labels");
  ["DEMANDA", "STATUS", "PROPOSTAS", "PRÓXIMO PASSO", ""].forEach((label) => labels.append(create("span", "", label)));
  table.append(labels);
  demands.slice(0, 3).forEach((demand) => {
    const row = anchor("", workflowLink("buyer", "demands", demand.id), "buyer-demand-row");
    const identity = create("span", "buyer-demand-row__name");
    identity.append(create("strong", "", demand.title), create("small", "", demand.id));
    const proposals = records.proposals.filter((item) => item.demandId === demand.id).length;
    const ordered = records.orders.some((item) => item.demandId === demand.id);
    const status = ordered ? "PEDIDO CRIADO" : demand.status === "published" ? "PUBLICADA" : "RASCUNHO";
    const tone = ordered ? "blue" : demand.status === "published" ? "green" : "amber";
    row.append(identity, create("span", `buyer-badge buyer-badge--${tone}`, status), create("span", "buyer-demand-row__count", proposals), create("span", "buyer-demand-row__next", ordered ? "Acompanhar pedido" : proposals ? "Comparar propostas" : demand.status === "draft" ? "Revisar e publicar" : "Aguardar propostas"), create("span", "buyer-demand-row__arrow", "›"));
    table.append(row);
  });
  panel.append(table);
  return panel;
}

function sidePanels(records, actions) {
  const side = create("div", "buyer-side");
  const alerts = create("section", "buyer-panel");
  const heading = create("div", "buyer-panel__heading");
  heading.append(create("h2", "", "Alertas e pendências"), anchor("Ver demandas", "#/app/comprador/demandas"));
  alerts.append(heading);
  if (!actions.length) alerts.append(create("p", "buyer-panel__empty", "Nenhuma pendência no momento."));
  actions.slice(0, 2).forEach((action, index) => {
    const item = anchor("", action.href, `buyer-alert buyer-alert--${index ? "blue" : "amber"}`);
    const copy = create("span");
    copy.append(create("strong", "", action.label), create("small", "", action.reason));
    item.append(create("span", "buyer-alert__icon", index ? "◇" : "◷"), copy);
    alerts.append(item);
  });
  const activity = create("section", "buyer-panel");
  const activityHeading = create("div", "buyer-panel__heading");
  activityHeading.append(create("h2", "", "Propostas e pedidos"), anchor("Ver atividade", "#/app/comprador/propostas"));
  activity.append(activityHeading);
  const proposal = recent(records.proposals)[0];
  const order = recent(records.orders)[0];
  if (proposal) activity.append(anchor(`✉  Proposta de ${proposal.supplierName}`, workflowLink("buyer", "proposals", proposal.demandId), "buyer-activity"));
  if (order) activity.append(anchor(`⬡  ${order.title} · ${order.status === "dispatched" ? "aguarda recebimento" : "em acompanhamento"}`, workflowLink("buyer", "orders", order.id), "buyer-activity"));
  if (!proposal && !order) activity.append(create("p", "buyer-panel__empty", "Propostas e pedidos aparecerão aqui quando houver atividade."));
  const footer = create("div", "buyer-side__actions");
  footer.append(anchor("+ Nova demanda", newDemand, "buyer-button buyer-button--primary"), supplierButton());
  activity.append(footer);
  side.append(alerts, activity);
  return side;
}

function suppliersPanel(recommendations, demand) {
  const panel = create("section", "buyer-panel buyer-suppliers");
  panel.id = "fornecedores";
  const heading = create("div", "buyer-panel__heading");
  const copy = create("div");
  copy.append(create("h2", "", "Fornecedores recomendados para sua demanda"), create("p", "", demand ? `Compatibilidade estimada para ${demand.title}. Confirme os critérios com cada fornecedor.` : "Publique uma demanda para ver fornecedores compatíveis."));
  heading.append(copy, anchor("Ver marketplace", "#/app/comprador/fornecedores"));
  panel.append(heading);
  if (recommendations.length && demand) {
    const grid = create("div", "buyer-supplier-grid");
    recommendations.slice(0, 3).forEach(({ profile, match }) => {
      const card = create("article", "buyer-supplier-card");
      const top = create("div", "buyer-supplier-card__top");
      top.append(create("h3", "", profile.organizationName), create("span", "", profile.processes?.[0] ?? "Fornecedor"));
      const approved = create("div", "buyer-supplier-card__approved");
      approved.append(create("strong", "", "✓ Cadastro ativo no SIVI"), create("small", "", "Capacidades declaradas pelo fornecedor"));
      const matched = match.criteria.filter((criterion) => criterion.state === "met").length;
      const explanation = create("div", "buyer-supplier-card__explain");
      explanation.append(create("strong", "", "COMPATIBILIDADE EXPLICADA"), create("span", "", `${matched} de ${match.criteria.length} critérios atendidos`), create("p", "", match.criteria.find((criterion) => criterion.state === "met")?.explanation ?? "Confira os critérios informados."));
      const capacity = create("div", "buyer-supplier-card__capacity");
      capacity.append(create("strong", "", "CAPACIDADE DECLARADA"), create("span", "", `${profile.capacity} unidades`));
      const details = create("details", "buyer-supplier-card__criteria");
      details.append(create("summary", "buyer-button buyer-button--outline", "Ver compatibilidade"));
      const criteria = create("ul");
      match.criteria.forEach((criterion) => criteria.append(create("li", "", `${criterion.label}: ${criterion.explanation}`)));
      details.append(criteria);
      card.append(top, approved, explanation, capacity, details);
      grid.append(card);
    });
    panel.append(grid);
  } else panel.append(create("p", "buyer-panel__empty", demand ? "Nenhum perfil elegível encontrado para esta demanda." : "As recomendações aparecerão após a publicação de uma demanda."));
  panel.append(create("p", "buyer-suppliers__note", "A compatibilidade usa o perfil industrial e os requisitos da demanda. Confirme capacidade e disponibilidade antes de fechar um pedido."));
  return panel;
}

function render(container, workspace, user, records, recommendations) {
  const dashboard = buildLiveDashboard(workspace, records);
  const activeDemands = records.demands.filter((item) => item.status === "published");
  const activeOrders = records.orders.filter((item) => item.status !== "delivered");
  const firstName = (user?.displayName ?? "").trim().split(/\s+/)[0];
  const page = create("section", "buyer-overview");
  page.dataset.pageState = "success";
  const hero = create("header", "buyer-overview__hero");
  const intro = create("div");
  const title = create("h1", "", firstName ? `Olá, ${firstName}. Aqui está sua visão geral.` : "Sua visão geral de compras");
  title.dataset.pageTitle = "";
  intro.append(title, create("p", "", `${workspace.organizationName} · operação de compras industriais`));
  const heroActions = create("div", "buyer-overview__actions");
  heroActions.append(supplierButton(), anchor("+  Criar nova demanda", newDemand, "buyer-button buyer-button--primary"));
  hero.append(intro, heroActions);
  const metrics = create("section", "buyer-overview__metrics");
  metrics.setAttribute("aria-label", "Resumo da empresa");
  metrics.append(metric("Demandas abertas", activeDemands.length, `${records.demands.filter((item) => item.status === "draft").length} aguardando publicação`, "▤", true), metric("Propostas recebidas", records.proposals.length, "Propostas da sua empresa", "✉"), metric("Pedidos em andamento", activeOrders.length, "Acompanhe produção e entrega", "⬡"), metric("Fornecedores compatíveis", recommendations.length, "Para a demanda mais recente", "♧"));
  const middle = create("div", "buyer-overview__middle");
  middle.append(recentDemands(records), sidePanels(records, dashboard.nextActions));
  page.append(hero, metrics, middle, suppliersPanel(recommendations, recent(activeDemands)[0]));
  container.replaceChildren(page);
}

export function mountBuyerOverviewPage({ container, workspace, user, repository, onReady = () => {} }) {
  let disposed = false;
  let clearState = () => {};
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
    let recommendations = [];
    try { recommendations = await repository.getBuyerRecommendations?.(workspace.id) ?? []; }
    catch { /* A visão geral continua disponível sem os perfis. */ }
    if (disposed) return;
    clearState();
    try {
      render(container, workspace, user, result.data, recommendations);
      container.dataset.dashboardStatus = "ready";
    } catch {
      clearState = renderPageState(container, { status: "error", onRetry: load });
      container.dataset.dashboardStatus = "error";
    }
    onReady();
  }
  void load();
  return () => { disposed = true; clearState(); container.replaceChildren(); delete container.dataset.dashboardStatus; };
}
