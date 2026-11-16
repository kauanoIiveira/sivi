import { ROUTE_PATHS } from "../../app/routes.js";
import { renderPageState } from "../../components/page-state/page-state.js";
import { isSupplierIdentifier } from "../../domain/match-engine.js";
import { capacityText, companyName, element, icon, supplierArtwork } from "./supplier-marketplace-view.js";

function backLink() {
  const link = element("a", "marketplace-profile__back");
  link.href = `#${ROUTE_PATHS.buyerSuppliers}`;
  link.append(icon("arrowLeft"), element("span", "", "Voltar para fornecedores"));
  return link;
}

function pageTitle(text) {
  const title = element("h1", "", text);
  title.dataset.pageTitle = "";
  return title;
}

function fact(label, value) {
  const item = element("div");
  item.append(element("dt", "", label), element("dd", "", value));
  return item;
}

function specialties(label, values) {
  const section = element("section", "marketplace-profile__specialty");
  section.append(element("h3", "", label));
  if (Array.isArray(values) && values.length) {
    const list = element("ul");
    list.append(...values.map((value) => element("li", "", value)));
    section.append(list);
  } else section.append(element("p", "", "Não informado"));
  return section;
}

function renderProfile(container, profile) {
  const page = element("section", "marketplace-page marketplace-profile workspace-page");
  const hero = element("div", "marketplace-profile__hero");
  const overview = element("header", "marketplace-profile__overview");
  const name = companyName(profile);
  const active = element("span", "marketplace-profile__active");
  active.append(icon("check"), element("span", "", "Cadastro ativo no SIVI"));
  const summary = element("p", "marketplace-profile__description", profile.description?.trim() || "O fornecedor ainda não adicionou uma descrição.");
  const metrics = element("dl", "marketplace-profile__metrics");
  const regions = profile.regions?.length ? profile.regions.join(" · ") : "Não informadas";
  const deadline = Number(profile.leadTimeDays) > 0 ? `${profile.leadTimeDays} ${Number(profile.leadTimeDays) === 1 ? "dia" : "dias"}` : "Não informado";
  metrics.append(fact("Capacidade declarada", capacityText(profile)), fact("Prazo indicativo", deadline));
  const match = element("a", "marketplace-button marketplace-button--primary");
  match.href = `#${ROUTE_PATHS.buyerSuppliers}?${new URLSearchParams({ aba: "matches", registro: profile.organizationId })}`;
  match.append(icon("match"), element("span", "", "Consultar compatibilidade"));
  const contact = element("a", "marketplace-button");
  contact.href = `#${ROUTE_PATHS.buyerConversations}?${new URLSearchParams({ registro: profile.organizationId })}`;
  contact.append(icon("proposals"), element("span", "", "Enviar mensagem"));
  const actions = element("div", "workspace-page__actions");
  actions.append(contact, match);
  overview.append(active, pageTitle(name), summary, metrics, actions);
  hero.append(overview, supplierArtwork(profile));

  const specifications = element("section", "workspace-panel marketplace-profile__details");
  specifications.append(element("h2", "", "Especialidades e capacidades"));
  const technical = element("div", "marketplace-profile__specifications");
  technical.append(specialties("Categorias", profile.categories), specialties("Processos", profile.processes),
    specialties("Materiais", profile.materials), specialties("Certificações declaradas", profile.certifications));
  specifications.append(technical);

  const company = element("section", "workspace-panel marketplace-profile__details");
  company.append(element("h2", "", "Dados da empresa"));
  const facts = element("dl", "marketplace-profile__company");
  facts.append(fact("Nome do fornecedor", name), fact("Regiões atendidas", regions));
  const updated = new Date(profile.updatedAt ?? Number.NaN);
  if (!Number.isNaN(updated.getTime())) {
    facts.append(fact("Perfil atualizado em", new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "long", timeZone: "America/Sao_Paulo",
    }).format(updated)));
  }
  company.append(facts);

  const details = element("div", "marketplace-profile__panels");
  details.append(specifications, company);
  page.append(backLink(), hero, details);
  container.replaceChildren(page);
}

export function mountBuyerSupplierDetailPage({ container, workspace, repository, onReady = () => {} }) {
  let disposed = false;
  let clearState = () => {};
  const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
  const [id, duplicate] = params.getAll("registro");

  function unavailable() {
    const page = element("section", "marketplace-page marketplace-profile workspace-page");
    const message = element("div", "workspace-panel marketplace-profile__details");
    message.append(pageTitle("Fornecedor indisponível"),
      element("p", "", "Este perfil não está disponível no catálogo da sua empresa."));
    page.append(backLink(), message);
    container.replaceChildren(page);
  }

  async function load() {
    clearState();
    if (!isSupplierIdentifier(id) || duplicate !== undefined) {
      unavailable();
      onReady();
      return;
    }
    clearState = renderPageState(container, { status: "loading" });
    let profile;
    try { profile = await repository.getBuyerSupplierProfile(workspace.id, id); }
    catch {
      if (!disposed) {
        clearState = renderPageState(container, { status: "error", onRetry: load });
        container.firstElementChild.append(backLink());
        onReady();
      }
      return;
    }
    if (disposed) return;
    clearState();
    if (profile) renderProfile(container, profile);
    else unavailable();
    window.scrollTo(0, 0);
    onReady();
  }
  void load();
  return () => { disposed = true; clearState(); container.replaceChildren(); };
}
