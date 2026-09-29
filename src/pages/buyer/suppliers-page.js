import { renderPageState } from "../../components/page-state/page-state.js";
import { matchSupplierToDemand } from "../../domain/match-engine.js";

const node = (tag, className, value) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (value !== undefined) element.textContent = String(value);
  return element;
};
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
const list = (value) => Array.isArray(value) ? value : [];
const listNames = Object.freeze({ categories: "Categoria", materials: "Material", processes: "Processo", certifications: "Certificação", regions: "Região" });
const criteriaNames = Object.freeze({ met: "ATENDIDO", unmet: "NÃO ATENDIDO", not_informed: "NÃO INFORMADO" });

function selectField(name, label, profiles) {
  const select = node("select", "marketplace-filter");
  select.name = name;
  select.setAttribute("aria-label", `Filtrar por ${label.toLowerCase()}`);
  select.append(new Option(label, ""));
  const values = [...new Set(profiles.flatMap((profile) => list(profile[name])))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  values.forEach((value) => select.append(new Option(value, value)));
  return select;
}

function chips(values) {
  const wrap = node("div", "marketplace-chips");
  values.forEach((value) => wrap.append(node("span", "", value)));
  return wrap;
}

function profileDialog(profile) {
  const dialog = node("dialog", "marketplace-dialog");
  const header = node("div", "marketplace-dialog__heading");
  header.append(node("h2", "", profile.organizationName));
  const close = node("button", "marketplace-button marketplace-button--outline", "Fechar");
  close.type = "button";
  close.addEventListener("click", () => dialog.close());
  header.append(close);
  dialog.append(header, node("p", "", profile.description || "O fornecedor ainda não informou uma descrição adicional."));
  const details = node("dl");
  for (const [label, value] of [
    ["Categorias", list(profile.categories).join(", ")],
    ["Processos", list(profile.processes).join(", ")],
    ["Materiais", list(profile.materials).join(", ")],
    ["Certificações declaradas", list(profile.certifications).join(", ")],
    ["Regiões atendidas", list(profile.regions).join(", ")],
    ["Capacidade declarada", `${profile.capacity} unidades por pedido`],
    ["Prazo indicativo", profile.leadTimeDays ? `${profile.leadTimeDays} dias` : "Não informado"],
  ]) details.append(node("dt", "", label), node("dd", "", value || "Não informado"));
  dialog.append(details);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  return dialog;
}

function supplierCard(profile, demand, invited, invitationsAvailable, onInvite) {
  const card = node("article", "marketplace-card");
  const heading = node("div", "marketplace-card__heading");
  const identity = node("div");
  identity.append(node("h2", "", profile.organizationName), node("p", "", `Regiões atendidas: ${list(profile.regions).join(", ") || "não informadas"}`));
  heading.append(identity, node("span", "marketplace-card__type", list(profile.processes)[0] ?? "Fornecedor industrial"));
  const active = node("div", "marketplace-card__active");
  active.append(node("strong", "", "✓ Organização ativa no SIVI"), node("small", "", "As capacidades abaixo foram declaradas pelo fornecedor no perfil industrial."));

  const specs = node("section", "marketplace-card__section");
  specs.append(node("h3", "", "ESPECIFICAÇÕES DECLARADAS"), node("small", "", "Categorias e processos"), chips([...list(profile.categories), ...list(profile.processes)]), node("small", "", "Materiais e certificações"), chips([...list(profile.materials), ...list(profile.certifications)]));

  const compatibility = node("section", "marketplace-card__section marketplace-card__compatibility");
  const compatibilityHeading = node("div", "marketplace-card__section-heading");
  compatibilityHeading.append(node("h3", "", "COMPATIBILIDADE EXPLICADA"), node("small", "", demand ? "Demanda selecionada" : "Selecione uma demanda"));
  compatibility.append(compatibilityHeading);
  const match = demand ? matchSupplierToDemand(demand, profile) : null;
  if (match) {
    const rows = node("div", "marketplace-criteria");
    match.criteria.forEach((criterion) => {
      const row = node("div", "marketplace-criterion");
      const tone = criterion.state === "met" ? "met" : criterion.state === "unmet" ? "unmet" : "unknown";
      const stateLabel = criterion.id === "capacity" && criterion.state === "unmet" && match.eligible ? "PARCIAL" : criteriaNames[criterion.state] ?? "CONFERIR";
      row.append(node("strong", "", criterion.label), node("span", `marketplace-criterion__state marketplace-criterion__state--${tone}`, stateLabel), node("span", "", criterion.explanation));
      rows.append(row);
    });
    compatibility.append(rows);
  } else compatibility.append(node("p", "marketplace-muted", "Publique ou selecione uma demanda para comparar os critérios."));

  const history = node("section", "marketplace-card__section marketplace-card__history");
  history.append(node("h3", "", "HISTÓRICO E CONFIANÇA"), node("p", "", "Histórico público de pedidos avaliados ainda não disponível nesta plataforma."));
  const footer = node("div", "marketplace-card__footer");
  if (profile.updatedAt) {
    const date = new Date(profile.updatedAt);
    if (!Number.isNaN(date.getTime())) footer.append(node("small", "", `Perfil atualizado em: ${new Intl.DateTimeFormat("pt-BR").format(date)}`));
  }
  const actions = node("div", "marketplace-card__actions");
  const view = node("button", "marketplace-button marketplace-button--outline", "Ver perfil");
  view.type = "button";
  const dialog = profileDialog(profile);
  view.addEventListener("click", () => dialog.showModal());
  const invite = node("button", "marketplace-button marketplace-button--primary", invited ? "Já disponível para esta demanda" : "Convidar para esta demanda");
  invite.type = "button";
  invite.disabled = !demand || invited || !match?.eligible || !invitationsAvailable;
  if (!demand) invite.textContent = "Selecione uma demanda";
  else if (!match?.eligible) invite.textContent = "Fora dos critérios essenciais";
  else if (!invitationsAvailable) invite.textContent = "Convites indisponíveis";
  invite.addEventListener("click", async () => {
    invite.disabled = true;
    invite.textContent = "Enviando convite…";
    await onInvite(profile, demand, invite);
  });
  actions.append(view, invite);
  footer.append(actions);
  card.append(heading, active, specs, compatibility, history, footer, dialog);
  return card;
}

export function mountBuyerSuppliersPage({ container, workspace, repository, onReady = () => {} }) {
  let disposed = false;
  let clearState = () => {};
  let records = null;
  let profiles = [];
  let selectedDemand = null;
  let invited = new Set();
  let invitationsAvailable = true;
  let invitationRevision = 0;
  let page;

  const renderCards = () => {
    if (!page || disposed) return;
    const search = normalize(page.querySelector("[data-supplier-search]").value.trim());
    const selected = Object.fromEntries([...page.querySelectorAll(".marketplace-filter")].map((field) => [field.name, field.value]));
    const capacity = Number(selected.capacity || 0);
    const visible = profiles.filter((profile) => {
      const searchable = [profile.organizationName, profile.description, ...Object.keys(listNames).flatMap((key) => list(profile[key]))].join(" ");
      if (search && !normalize(searchable).includes(search)) return false;
      if (Object.entries(listNames).some(([key]) => selected[key] && !list(profile[key]).includes(selected[key]))) return false;
      return !capacity || Number(profile.capacity) >= capacity;
    });
    const active = page.querySelector("[data-active-filters]");
    active.replaceChildren();
    Object.entries(selected).filter(([, value]) => value).forEach(([key, value]) => {
      const chip = node("button", "marketplace-active-filter", `${key === "capacity" ? "Capacidade" : listNames[key]}: ${key === "capacity" ? `≥ ${value} unidades` : value} ×`);
      chip.type = "button";
      chip.addEventListener("click", () => { page.querySelector(`[name="${key}"]`).value = ""; renderCards(); });
      active.append(chip);
    });
    active.parentElement.hidden = active.childElementCount === 0;
    const count = page.querySelector("[data-result-count]");
    count.textContent = `${visible.length} ${visible.length === 1 ? "fornecedor encontrado" : "fornecedores encontrados"}`;
    const grid = page.querySelector("[data-supplier-grid]");
    grid.replaceChildren();
    if (!visible.length) {
      grid.append(node("p", "marketplace-empty", "Nenhum fornecedor corresponde à busca. Ajuste os filtros para ver outros perfis."));
      return;
    }
    visible.forEach((profile) => grid.append(supplierCard(profile, selectedDemand, invited.has(profile.organizationId), invitationsAvailable, async (supplier, demand, button) => {
      const feedback = page.querySelector("[data-marketplace-feedback]");
      try {
        const result = await repository.inviteSupplierToDemand(workspace.id, demand.id, supplier.organizationId);
        if (disposed) return;
        invited.add(supplier.organizationId);
        button.textContent = "Já disponível para esta demanda";
        feedback.textContent = result.alreadyAvailable ? `${supplier.organizationName} já tinha acesso a esta demanda.` : `A demanda foi disponibilizada para ${supplier.organizationName}.`;
        feedback.dataset.state = "success";
      } catch (error) {
        if (disposed) return;
        button.disabled = false;
        button.textContent = "Convidar para esta demanda";
        feedback.textContent = error?.message ?? "Não foi possível convidar o fornecedor. Tente novamente.";
        feedback.dataset.state = "error";
      }
    })));
  };

  const syncDemand = async (id) => {
    const revision = ++invitationRevision;
    selectedDemand = records.demands.find((demand) => demand.id === id && demand.status === "published") ?? null;
    invited = new Set();
    invitationsAvailable = true;
    const banner = page.querySelector("[data-selected-demand]");
    banner.textContent = selectedDemand ? `Demanda ativa: ${selectedDemand.title}` : "Selecione uma demanda publicada para analisar a compatibilidade";
    if (selectedDemand) {
      try {
        const ids = await repository.getBuyerInvitations(workspace.id, selectedDemand.id);
        if (disposed || revision !== invitationRevision) return;
        invited = new Set(ids);
      } catch {
        if (disposed || revision !== invitationRevision) return;
        invitationsAvailable = false;
        page.querySelector("[data-marketplace-feedback]").textContent = "Não foi possível conferir convites anteriores. Atualize a página antes de convidar.";
        page.querySelector("[data-marketplace-feedback]").dataset.state = "error";
      }
    }
    renderCards();
  };

  const render = () => {
    page = node("section", "marketplace-page");
    const header = node("header", "marketplace-page__header");
    const title = node("h1", "", "Marketplace de fornecedores");
    title.dataset.pageTitle = "";
    header.append(title, node("p", "", "Encontre empresas com perfis industriais para atender à sua demanda."));
    const analysis = node("section", "marketplace-analysis");
    const analysisHeading = node("div", "marketplace-analysis__heading");
    analysisHeading.append(node("strong", "", "⚙  ANALISAR COMPATIBILIDADE COM MINHA DEMANDA"), node("span", "", "Critérios de correspondência ativos"));
    const demandRow = node("div", "marketplace-analysis__demand");
    const demandSelect = node("select");
    demandSelect.setAttribute("aria-label", "Selecione uma demanda publicada");
    demandSelect.append(new Option("Selecione uma demanda publicada", ""));
    const published = records.demands.filter((demand) => demand.status === "published").sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    published.forEach((demand) => demandSelect.append(new Option(demand.title, demand.id)));
    const selectedTag = node("span", "marketplace-analysis__tag", "");
    selectedTag.dataset.selectedDemand = "";
    demandRow.append(selectedTag, demandSelect, node("p", "", "A comparação usa categoria, processo, material, capacidade, certificações e região informados. Ela orienta a triagem e não seleciona o fornecedor automaticamente."));
    analysis.append(analysisHeading, demandRow);
    const filters = node("section", "marketplace-search");
    const searchRow = node("div", "marketplace-search__row");
    const search = node("input");
    search.type = "search";
    search.placeholder = "Buscar por empresa, produto ou processo industrial específico...";
    search.setAttribute("aria-label", "Buscar fornecedores");
    search.dataset.supplierSearch = "";
    const reset = node("button", "marketplace-button marketplace-button--outline", "Limpar busca");
    reset.type = "button";
    searchRow.append(search, reset);
    const filterRow = node("div", "marketplace-search__filters");
    for (const [key, label] of Object.entries(listNames)) filterRow.append(selectField(key, label, profiles));
    const capacity = node("select", "marketplace-filter");
    capacity.name = "capacity";
    capacity.setAttribute("aria-label", "Filtrar por capacidade");
    capacity.append(new Option("Capacidade", ""));
    [...new Set([100, 200, 500, 1000, Number(selectedDemand?.quantity)].filter((value) => Number.isFinite(value) && value > 0))].sort((a, b) => a - b).forEach((value) => capacity.append(new Option(`≥ ${value} unidades`, String(value))));
    filterRow.insertBefore(capacity, filterRow.children[3]);
    const active = node("div", "marketplace-search__active");
    active.append(node("strong", "", "FILTROS ATIVOS:"));
    const activeItems = node("div"); activeItems.dataset.activeFilters = ""; active.append(activeItems);
    filters.append(searchRow, filterRow, active);
    const count = node("p", "marketplace-page__count"); count.dataset.resultCount = "";
    const feedback = node("p", "marketplace-feedback");
    feedback.setAttribute("role", "status"); feedback.dataset.marketplaceFeedback = "";
    const grid = node("div", "marketplace-grid"); grid.dataset.supplierGrid = "";
    const note = node("p", "marketplace-page__note", "Capacidade e prazo foram declarados pelos fornecedores e devem ser confirmados na proposta. Certificações e histórico não são verificados automaticamente por esta página.");
    page.append(header, analysis, filters, count, feedback, grid, note);
    container.replaceChildren(page);
    search.addEventListener("input", renderCards);
    filterRow.addEventListener("change", renderCards);
    reset.addEventListener("click", () => { search.value = ""; filterRow.querySelectorAll("select").forEach((field) => { field.value = ""; }); renderCards(); search.focus(); });
    demandSelect.addEventListener("change", () => { void syncDemand(demandSelect.value); });
    demandSelect.value = published[0]?.id ?? "";
    void syncDemand(demandSelect.value);
  };

  const load = async () => {
    clearState();
    clearState = renderPageState(container, { status: "loading" });
    let operations;
    try {
      [operations, profiles] = await Promise.all([repository.getOperations(workspace.id), repository.listSupplierProfiles(workspace.id)]);
    } catch { operations = { status: "error" }; }
    if (disposed) return;
    clearState();
    if (operations.status !== "ready") {
      clearState = renderPageState(container, { status: operations.status, onRetry: load });
      onReady();
      return;
    }
    records = operations.data;
    render();
    onReady();
  };
  void load();
  return () => { disposed = true; invitationRevision += 1; clearState(); container.replaceChildren(); };
}
