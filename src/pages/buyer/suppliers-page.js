import { renderPageState } from "../../components/page-state/page-state.js";
import { matchSupplierToDemand } from "../../domain/match-engine.js";
import { button, compareSuppliers, createListings, createSupplierDialog, element, icon } from "./supplier-marketplace-view.js";

const matchOrder = { compatible: 0, partial: 1, ineligible: 2 };

function marketplaceTab(id, label, symbol) {
  const tab = element("button", "marketplace-tab");
  tab.type = "button";
  tab.setAttribute("role", "tab");
  tab.id = `marketplace-tab-${id}`;
  tab.append(icon(symbol), element("span", "", label));
  const panel = element("section", "marketplace-tabpanel");
  panel.id = `marketplace-panel-${id}`;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tab.id);
  tab.setAttribute("aria-controls", panel.id);
  return { tab, panel };
}

export function mountBuyerSuppliersPage({ container, workspace, repository, onReady = () => {} }) {
  let disposed = false;
  let clearState = () => {};
  const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
  const returnKey = `sivi.supplier-catalog.v1:${JSON.stringify([workspace.memberUid, workspace.id])}`;
  let previous;
  try { previous = JSON.parse(window.sessionStorage.getItem(returnKey)); } catch { /* Storage is optional. */ }

  function render(profiles) {
    const page = element("section", "marketplace-page workspace-page");
    const header = element("header", "marketplace-page__header workspace-page__header");
    const title = element("h1", "", "Fornecedores");
    title.dataset.pageTitle = "";
    const intro = element("div");
    intro.append(title, element("p", "", "Explore perfis industriais e encontre fornecedores para suas demandas."));
    header.append(intro);

    const tabList = element("div", "marketplace-tabs");
    tabList.setAttribute("role", "tablist");
    tabList.setAttribute("aria-label", "Marketplace de fornecedores");
    const catalog = marketplaceTab("catalogo", "Catálogo", "home");
    const matches = marketplaceTab("matches", "Matches", "match");
    const tabs = [catalog, matches];
    tabList.append(catalog.tab, matches.tab);

    const dialog = element("dialog", "marketplace-dialog");
    const detail = createSupplierDialog(dialog);
    page.append(header, tabList, catalog.panel, matches.panel, dialog);
    container.replaceChildren(page);

    const listing = createListings({ profiles, onProfileVisit: rememberCatalog });
    listing.setEntries(profiles.map((profile) => ({ profile })));
    listing.restoreFilters(previous?.catalog);
    catalog.panel.append(listing.root);

    let activeIndex = 0;
    let selectedDemand;
    let demandState = "idle";
    let verification = "idle";
    let verificationRevision = 0;
    let invited = new Set();
    let openMatch;
    const pendingInvites = new Set();
    const confirmedInvites = new Set();
    const pairKey = (demand, profile) => JSON.stringify([demand.id, profile.organizationId]);
    const hasAccess = (profile) => invited.has(profile.organizationId) || confirmedInvites.has(pairKey(selectedDemand, profile));
    const results = createListings({ profiles, matches: true, onProfileVisit: rememberCatalog, onMatch: openComparison, hasAccess });
    const accessFeedback = element("p", "marketplace-feedback");
    accessFeedback.setAttribute("role", "status");
    const retryAccess = button("Conferir convites novamente", () => checkAccess());
    retryAccess.hidden = true;

    dialog.addEventListener("close", () => { if (!dialog.open) openMatch = null; });

    function rememberCatalog() {
      try {
        window.sessionStorage.setItem(returnKey, JSON.stringify({
          tab: activeIndex,
          catalog: listing.readFilters(),
          matches: selectedDemand ? results.readFilters() : previous?.matches,
          demandId: selectedDemand?.id ?? previous?.demandId,
        }));
      } catch { /* Profile links also work when storage is disabled. */ }
    }

    function updateInvite() {
      if (!openMatch || openMatch.demand.id !== selectedDemand?.id || !dialog.open) return;
      const { profile, demand, match, invite } = openMatch;
      const pending = pendingInvites.has(pairKey(demand, profile));
      const access = hasAccess(profile);
      invite.disabled = !match.eligible || pending || access || verification !== "ready";
      invite.textContent = access ? "Já tem acesso"
        : !match.eligible ? "Fora dos critérios essenciais"
          : pending ? "Enviando convite…"
            : verification === "loading" ? "Conferindo convites…"
              : verification === "error" ? "Convites indisponíveis" : "Convidar para a demanda";
    }

    function openComparison(profile, match, origin) {
      const demand = selectedDemand;
      if (match.demandId !== demand?.id) return;
      const feedback = element("p", "marketplace-feedback");
      feedback.setAttribute("role", "status");
      const invite = button("Convidar para a demanda", () => sendInvite(profile, demand, match), true);
      openMatch = { profile, demand, match, invite, feedback };
      detail.match(profile, demand, match, origin, invite, feedback);
      updateInvite();
    }

    async function sendInvite(profile, demand, match) {
      const key = pairKey(demand, profile);
      if (disposed || !match.eligible || demand.id !== selectedDemand?.id ||
          verification !== "ready" || hasAccess(profile) || pendingInvites.has(key)) return;
      pendingInvites.add(key);
      updateInvite();
      let state;
      let message;
      try {
        const result = await repository.inviteSupplierToDemand(workspace.id, demand.id, profile.organizationId);
        confirmedInvites.add(key);
        state = "success";
        message = result.alreadyAvailable ? "O fornecedor já pode acessar esta demanda." : "Demanda disponibilizada ao fornecedor.";
      } catch (error) {
        state = "error";
        message = error?.message ?? "Não foi possível convidar o fornecedor. Tente novamente.";
      } finally {
        pendingInvites.delete(key);
      }
      if (disposed || selectedDemand?.id !== demand.id) return;
      results.updateAccess();
      updateInvite();
      if (dialog.open && openMatch?.profile.organizationId === profile.organizationId && openMatch.demand.id === demand.id) {
        openMatch.feedback.dataset.state = state;
        openMatch.feedback.textContent = message;
      }
    }

    async function checkAccess() {
      const { id } = selectedDemand;
      const revision = ++verificationRevision;
      verification = "loading";
      retryAccess.hidden = true;
      accessFeedback.textContent = "Conferindo quem já tem acesso à demanda…";
      delete accessFeedback.dataset.state;
      updateInvite();
      try {
        const ids = await repository.getBuyerInvitations(workspace.id, id);
        if (disposed || revision !== verificationRevision) return;
        invited = new Set(ids);
        verification = "ready";
        accessFeedback.textContent = "";
      } catch {
        if (disposed || revision !== verificationRevision) return;
        verification = "error";
        accessFeedback.dataset.state = "error";
        accessFeedback.textContent = "Não foi possível conferir os convites. Tente novamente para liberar o envio.";
        retryAccess.hidden = false;
      }
      results.updateAccess();
      updateInvite();
    }

    function selectDemand(demand) {
      if (dialog.open) dialog.close();
      selectedDemand = demand;
      invited = new Set();
      const entries = profiles.map((profile) => ({ profile, match: matchSupplierToDemand(demand, profile) }));
      entries.sort((a, b) => matchOrder[a.match.status] - matchOrder[b.match.status] || compareSuppliers(a.profile, b.profile));
      results.setEntries(entries, demand);
      void checkAccess();
    }

    function demandNotice(message, action, role = "status") {
      const notice = element("div", "marketplace-empty workspace-panel");
      const text = element("p", "", message);
      text.setAttribute("role", role);
      notice.append(text);
      if (action) notice.append(action);
      matches.panel.replaceChildren(notice);
    }

    async function loadDemands() {
      demandState = "loading";
      demandNotice("Carregando demandas publicadas…");
      let result;
      try { result = await repository.getOperations(workspace.id); }
      catch { result = { status: "error" }; }
      if (disposed) return;
      if (result?.status !== "ready") {
        demandState = "error";
        demandNotice("Não foi possível carregar as demandas publicadas.", button("Tentar novamente", loadDemands), "alert");
        return;
      }
      demandState = "ready";
      const demands = result.data.demands.filter(({ status }) => status === "published")
        .sort((a, b) => (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0));
      if (!demands.length) {
        const demandsLink = element("a", "marketplace-button marketplace-button--primary", "Ir para Minhas demandas");
        demandsLink.href = "#/app/comprador/demandas";
        demandNotice("Publique uma demanda para encontrar fornecedores compatíveis.", demandsLink);
        return;
      }
      const analysis = element("section", "workspace-panel marketplace-analysis");
      const intro = element("div");
      intro.append(element("h2", "", "Compatibilidade com a demanda"),
        element("p", "", "Compare os requisitos da compra com o perfil declarado por cada fornecedor."));
      const field = element("label", "marketplace-filter-label", "Demanda publicada");
      const select = element("select");
      select.append(...demands.map(({ title, id }) => new Option(title, id)));
      select.addEventListener("change", () => selectDemand(demands[select.selectedIndex]));
      field.append(select);
      const feedback = element("div", "marketplace-analysis__feedback");
      feedback.append(accessFeedback, retryAccess);
      analysis.append(intro, field, feedback);
      matches.panel.replaceChildren(analysis, results.root);
      const demand = demands.find(({ id }) => id === previous?.demandId) ?? demands[0];
      select.value = demand.id;
      selectDemand(demand);
      const target = params.get("aba") === "matches"
        ? profiles.find((profile) => profile.organizationId === params.get("registro")) : null;
      results.restoreFilters(target ? { search: target.organizationName, status: "all" } : previous?.matches);
    }

    function activate(index) {
      activeIndex = index;
      tabs.forEach(({ tab, panel }, position) => {
        const active = index === position;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        panel.hidden = !active;
      });
      if (index === 1 && demandState === "idle") void loadDemands();
    }
    tabs.forEach(({ tab }, index) => tab.addEventListener("click", () => activate(index)));
    tabList.addEventListener("keydown", (event) => {
      const index = tabs.findIndex(({ tab }) => tab === event.target);
      if (index < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      activate(next);
      tabs[next].tab.focus();
    });
    activate(params.get("aba") === "matches" || previous?.tab === 1 ? 1 : 0);
  }

  async function load() {
    clearState();
    clearState = renderPageState(container, { status: "loading" });
    let profiles;
    try { profiles = await repository.listSupplierProfiles(workspace.id); }
    catch {
      if (!disposed) {
        clearState = renderPageState(container, { status: "error", onRetry: load });
        onReady();
      }
      return;
    }
    if (disposed) return;
    clearState();
    render([...profiles].sort(compareSuppliers));
    onReady();
  }
  void load();
  return () => { disposed = true; clearState(); container.replaceChildren(); };
}
