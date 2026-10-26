import { renderPageState } from "../../components/page-state/page-state.js";
import { buildLiveDashboard } from "../../domain/live-marketplace-selectors.js";
import { workflowLink } from "../../domain/next-actions.js";
import { mountBuyerJourney } from './buyer-journey.js';
import { uiIcon } from '../../components/ui-icon.js';
import { mountWorkspaceAnalytics } from '../../generated/public/entry.js';

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
const count = (value) => String(value);
const iconElement = (name, className = '') => {
  const node = create('span', className);
  node.innerHTML = uiIcon(name);
  return node;
};
const greeting = (user) => {
  const firstName = (user?.displayName ?? "").trim().split(/\s+/)[0];
  return firstName ? `Olá, ${firstName}.` : "Sua visão geral de compras";
};

function supplierButton() {
  const button = anchor("Buscar fornecedores", "#/app/comprador/fornecedores", "buyer-button buyer-button--outline");
  button.prepend(iconElement('inspection'));
  return button;
}

function metric(label, value, note, icon, orange = false) {
  const card = create("article", "buyer-metric");
  const top = create("div", "buyer-metric__top");
  top.append(create("span", "", label), iconElement(icon, 'buyer-metric__icon'));
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
  const priorityOrder = records.orders.find(order => order.demandId === priority.id);
  const priorityReplies = records.proposals.some(proposal => proposal.demandId === priority.id);
  const featured = anchor("", priorityOrder ? workflowLink('buyer', 'orders', priorityOrder.id) : workflowLink('buyer', priorityReplies ? 'proposals' : 'demands', priority.id), "buyer-priority");
  const featuredCopy = create("span");
  featuredCopy.append(create("small", "", "DEMANDA EM DESTAQUE"), create("strong", "", priority.title));
  featured.append(iconElement('document', 'buyer-priority__icon'), featuredCopy, create("span", "buyer-priority__count", `${records.proposals.filter((item) => item.demandId === priority.id).length} PROPOSTAS`));
  panel.append(featured);
  const table = create("div", "buyer-demand-table");
  const labels = create("div", "buyer-demand-table__labels");
  ["DEMANDA", "STATUS", "PROPOSTAS", "PRÓXIMO PASSO", ""].forEach((label) => labels.append(create("span", "", label)));
  table.append(labels);
  demands.slice(0, 3).forEach((demand) => {
    const order = records.orders.find(item => item.demandId === demand.id);
    const hasProposals = records.proposals.some(item => item.demandId === demand.id);
    const row = anchor("", order ? workflowLink('buyer', 'orders', order.id) : workflowLink('buyer', hasProposals ? 'proposals' : 'demands', demand.id), "buyer-demand-row");
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
  if (proposal) { const link = anchor(`Proposta de ${proposal.supplierName}`, workflowLink("buyer", "proposals", proposal.demandId), "buyer-activity"); link.prepend(iconElement('proposals')); activity.append(link); }
  if (order) { const link = anchor(`${order.title}: ${order.status === "dispatched" ? "aguarda recebimento" : "em acompanhamento"}`, workflowLink("buyer", "orders", order.id), "buyer-activity"); link.prepend(iconElement('order')); activity.append(link); }
  if (!proposal && !order) activity.append(create("p", "buyer-panel__empty", "Propostas e pedidos aparecerão aqui quando houver atividade."));
  const footer = create("div", "buyer-side__actions");
  footer.append(anchor("+ Nova demanda", newDemand, "buyer-button buyer-button--primary"), supplierButton());
  activity.append(footer);
  side.append(alerts, activity);
  return side;
}

function suppliersPanel(recommendations, demand, error, onRetry) {
  const panel = create("section", "buyer-panel buyer-suppliers");
  panel.id = "fornecedores";
  const heading = create("div", "buyer-panel__heading");
  const copy = create("div");
  copy.append(create("h2", "", "Fornecedores recomendados para sua demanda"), create("p", "", demand ? `Compatibilidade estimada para ${demand.title}. Confirme os critérios com cada fornecedor.` : "Publique uma demanda para ver fornecedores compatíveis."));
  heading.append(copy, anchor("Ver marketplace", "#/app/comprador/fornecedores"));
  panel.append(heading);
  if (error) {
    panel.append(create('p', 'buyer-panel__empty', 'Não foi possível consultar os fornecedores para esta demanda.'));
    const retry = create('button', 'buyer-button buyer-button--outline', 'Atualizar recomendações'); retry.type = 'button'; retry.addEventListener('click', onRetry); panel.append(retry);
  } else if (recommendations.length && demand) {
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

function render(container, workspace, user, records, recommendations, recommendationsError, onRetry) {
  const dashboard = buildLiveDashboard(workspace, records);
  const activeDemands = records.demands.filter((item) => item.status === "published");
  const activeOrders = records.orders.filter((item) => item.status !== "delivered");
  const page = create("section", "buyer-overview");
  page.dataset.pageState = "success";
  const hero = create("header", "buyer-overview__hero");
  const intro = create("div");
  const title = create("h1", "", greeting(user));
  title.dataset.pageTitle = "";
  intro.append(title, create("p", "", `${workspace.organizationName}, compras industriais`));
  const heroActions = create("div", "buyer-overview__actions");
  heroActions.append(supplierButton(), anchor("+  Criar nova demanda", newDemand, "buyer-button buyer-button--primary"));
  hero.append(intro, heroActions);
  const metrics = create("section", "buyer-overview__metrics");
  metrics.setAttribute("aria-label", "Resumo da empresa");
  metrics.append(metric("Demandas abertas", activeDemands.length, `${records.demands.filter((item) => item.status === "draft").length} aguardando publicação`, "document", true), metric("Propostas recebidas", records.proposals.length, "Propostas da sua empresa", "proposals"), metric("Pedidos em andamento", activeOrders.length, "Acompanhe produção e entrega", "order"), metric("Fornecedores compatíveis", recommendationsError ? '—' : recommendations.length, recommendationsError ? 'Consulta indisponível' : "Para a demanda mais recente", "match"));
  const middle = create("div", "buyer-overview__middle");
  middle.append(recentDemands(records), sidePanels(records, dashboard.nextActions));
  const insights = create('div');
  insights.dataset.workspaceAnalyticsSlot = '';
  page.append(hero, metrics, insights, middle, suppliersPanel(recommendations, recent(activeDemands)[0], recommendationsError, onRetry));
  container.replaceChildren(page);
  return mountWorkspaceAnalytics(insights, { records, role: 'buyer' });
}

export function mountBuyerOverviewPage({ container, workspace, user, repository, onReady = () => {} }) {
  let disposed = false;
  let currentUser = user;
  let clearState = () => {};
  let clearJourney = () => {};
  let clearInsights = () => {};
  const updateGreeting = (event) => {
    const updatedUser = event.detail?.user;
    if (disposed || !updatedUser?.uid || updatedUser.uid !== currentUser?.uid) return;
    currentUser = updatedUser;
    const title = container.querySelector(".buyer-overview [data-page-title]");
    if (title) title.textContent = greeting(currentUser);
  };
  container.addEventListener("sivi:account-updated", updateGreeting);
  async function load() {
    clearInsights();
    clearJourney();
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
    let recommendationsError = false;
    try { recommendations = await repository.getBuyerRecommendations?.(workspace.id) ?? []; }
    catch { recommendationsError = true; }
    if (disposed) return;
    clearState();
    try {
      clearInsights = render(container, workspace, currentUser, result.data, recommendations, recommendationsError, load);
      clearJourney = mountBuyerJourney({ container: container.querySelector('.buyer-overview'), workspace, repository });
      container.dataset.dashboardStatus = "ready";
    } catch {
      clearState = renderPageState(container, { status: "error", onRetry: load });
      container.dataset.dashboardStatus = "error";
    }
    onReady();
  }
  void load();
  return () => { disposed = true; container.removeEventListener("sivi:account-updated", updateGreeting); clearInsights(); clearJourney(); clearState(); container.replaceChildren(); delete container.dataset.dashboardStatus; };
}
