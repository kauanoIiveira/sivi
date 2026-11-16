import { uiIcon } from "../../components/ui-icon.js";
import { ROUTE_PATHS } from "../../app/routes.js";
import { quantitiesByUnit } from "../../domain/quantity.js";

const fields = {
  categories: "Categoria",
  materials: "Material",
  processes: "Processo",
  capacity: "Capacidade",
  certifications: "Certificação",
  regions: "Região",
};

export const matchLabels = {
  compatible: "Compatível",
  partial: "A confirmar",
  ineligible: "Fora dos critérios essenciais",
};

const list = (value) => Array.isArray(value) ? value : [];
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("pt-BR");
const number = new Intl.NumberFormat("pt-BR");
const order = new Intl.Collator("pt-BR", { sensitivity: "base" });

export function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

export function button(label, action, primary = false) {
  const node = element("button", `marketplace-button marketplace-button--${primary ? "primary" : "outline"}`, label);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
}

export function icon(name) {
  const node = element("span", "marketplace-icon");
  node.setAttribute("aria-hidden", "true");
  node.innerHTML = uiIcon(name);
  return node;
}

export const capacityText = (profile) => Number(profile.capacity) > 0 ? `${number.format(profile.capacity)} unidades por pedido` : "Não informada";
export const companyName = (profile) => profile.organizationName || "Fornecedor industrial";

export function supplierArtwork(profile) {
  const initials = companyName(profile).trim().split(/\s+/).slice(0, 2).map((word) => Array.from(word)[0]).join("").toLocaleUpperCase("pt-BR");
  const artwork = element("div", "marketplace-card__art");
  artwork.setAttribute("aria-hidden", "true");
  artwork.append(icon("factory"), element("span", "marketplace-card__initials", initials));
  return artwork;
}

function badge(match) {
  const node = element("span", "marketplace-badge", matchLabels[match.status]);
  node.dataset.matchStatus = match.status;
  return node;
}

function supplierCard({ profile, match }, onProfileVisit, onMatch, hasAccess) {
  const card = element("article", "marketplace-card");
  card.dataset.supplierId = profile.organizationId;
  const name = companyName(profile);
  const body = element("div", "marketplace-card__body");
  const caption = element("div", "marketplace-card__caption");
  if (match) {
    const access = element("span", "marketplace-access", "Já tem acesso");
    access.hidden = !hasAccess(profile);
    access.dataset.marketAccess = "";
    caption.append(badge(match), access);
  } else caption.append(element("span", "", list(profile.categories).slice(0, 2).join(" · ") || "Fornecedor industrial"));
  const processes = list(profile.processes);
  const summary = processes.slice(0, 3).join(" · ");
  const facts = element("dl", "marketplace-card__facts");
  for (const [label, value] of [
    ["Regiões atendidas", list(profile.regions).join(" · ") || "Não informadas"],
    ["Processos", summary ? `${summary}${processes.length > 3 ? ` +${processes.length - 3}` : ""}` : "Não informados"],
    ["Capacidade declarada", capacityText(profile)],
  ]) facts.append(element("dt", "", label), element("dd", "", value));
  const actions = element("div", "marketplace-card__actions");
  const details = element("a", "marketplace-button marketplace-button--outline marketplace-card__profile-link", "Ver perfil");
  details.href = `#${ROUTE_PATHS.buyerSupplierProfile}?${new URLSearchParams({ registro: profile.organizationId })}`;
  details.setAttribute("aria-label", `Ver perfil de ${name}`);
  details.addEventListener("click", onProfileVisit);
  actions.append(details);
  if (match) {
    const compare = button("Ver compatibilidade", (event) => onMatch(profile, match, event.currentTarget));
    compare.setAttribute("aria-label", `Ver compatibilidade de ${name}`);
    actions.append(compare);
  }
  body.append(caption, element("h3", "", name), facts, actions);
  card.append(supplierArtwork(profile), body);
  return card;
}

export function createListings({ profiles, matches = false, onProfileVisit, onMatch, hasAccess }) {
  const root = element("div", "marketplace-listings");
  const controls = element("section", "workspace-panel marketplace-search");
  const title = element("h2", "", matches ? "Filtrar resultados" : "Encontrar fornecedores");
  const search = element("input");
  search.type = "search";
  search.maxLength = 160;
  search.placeholder = "Empresa, descrição ou especialidade";
  search.setAttribute("aria-label", "Buscar fornecedores");
  const searchRow = element("div", "marketplace-search__row");
  const reset = button("Limpar filtros", () => {
    search.value = "";
    for (const select of selects.values()) select.value = "";
    if (status) status.value = "eligible";
    draw();
    search.focus();
  });
  searchRow.append(search, reset);

  const filters = element("details", "marketplace-search__extra");
  filters.open = !window.matchMedia("(max-width: 1200px)").matches;
  const summary = element("summary", "", "Mais filtros");
  const filterGrid = element("div", "marketplace-search__filters");
  const selects = new Map();
  for (const [name, label] of Object.entries(fields)) {
    const select = element("select", "marketplace-filter");
    select.name = name;
    select.setAttribute("aria-label", `Filtrar por ${label.toLocaleLowerCase("pt-BR")}`);
    if (name !== "capacity") {
      const values = [...new Set(profiles.flatMap((profile) => list(profile[name])))].sort(order.compare);
      select.append(new Option(label, ""), ...values.map((value) => new Option(value, value)));
    }
    selects.set(name, select);
    filterGrid.append(select);
  }
  filters.append(summary, filterGrid);
  const active = element("div", "marketplace-search__active");
  const count = element("p", "marketplace-page__count");
  count.setAttribute("role", "status");
  const grid = element("div", "marketplace-grid");
  const status = matches ? element("select", "marketplace-filter marketplace-match-filter") : null;
  if (status) {
    status.append(new Option("Elegíveis", "eligible"), new Option("Todos os resultados", "all"),
      ...Object.entries(matchLabels).map(([value, label]) => new Option(label, value)));
    const label = element("label", "marketplace-filter-label", "Resultado da compatibilidade");
    label.append(status);
    const mainFilters = element("div", "marketplace-search__main");
    mainFilters.append(searchRow, label);
    controls.append(title, mainFilters, filters, active);
  } else controls.append(title, searchRow, filters, active);
  root.append(controls, count, grid);
  let entries = [];

  function draw() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    const selected = [...selects].filter(([, select]) => select.value);
    const visible = entries.filter(({ profile, match }) => {
      if (status && status.value !== "all" &&
          (status.value === "eligible" ? !match.eligible : match.status !== status.value)) return false;
      const searchable = normalize([profile.organizationName, profile.description,
        ...Object.keys(fields).flatMap((name) => list(profile[name]))].join(" "));
      return terms.every((term) => searchable.includes(term)) && selected.every(([name, select]) =>
        name === "capacity" ? Number(profile.capacity) >= Number(select.value) : list(profile[name]).includes(select.value));
    });

    summary.textContent = selected.length ? `Mais filtros (${selected.length})` : "Mais filtros";
    active.replaceChildren(...selected.map(([name, select]) => {
      const label = `${fields[name]}: ${select.selectedOptions[0].textContent}`;
      const chip = button(`${label} ×`, () => {
        select.value = "";
        draw();
        summary.focus();
      });
      chip.className = "marketplace-active-filter";
      chip.setAttribute("aria-label", `Remover filtro ${label}`);
      return chip;
    }));
    active.hidden = !selected.length;
    const total = `${visible.length} ${visible.length === 1 ? "fornecedor encontrado" : "fornecedores encontrados"}`;
    if (count.textContent !== total) count.textContent = total;
    grid.replaceChildren(...visible.map((entry) => supplierCard(entry, onProfileVisit, onMatch, hasAccess)));

    if (!visible.length) {
      const empty = element("div", "marketplace-empty");
      const unfiltered = !terms.length && !selected.length;
      const message = !profiles.length ? "Nenhum fornecedor disponível no diretório."
        : status?.value === "eligible" && unfiltered ? "Nenhum fornecedor elegível para esta demanda."
          : "Nenhum fornecedor corresponde aos filtros.";
      empty.append(element("p", "", message));
      if (status && status.value !== "all" && profiles.length) {
        empty.append(button("Ver todos os resultados", () => { status.value = "all"; draw(); status.focus(); }));
      }
      grid.append(empty);
    }
  }

  search.addEventListener("input", draw);
  filterGrid.addEventListener("change", draw);
  status?.addEventListener("change", draw);

  return {
    root,
    readFilters() {
      return {
        search: search.value,
        filters: Object.fromEntries([...selects].map(([name, select]) => [name, select.value])),
        expanded: filters.open,
        status: status?.value,
      };
    },
    restoreFilters(state) {
      if (!state) return;
      search.value = typeof state.search === "string" ? state.search.slice(0, search.maxLength) : "";
      for (const [name, select] of selects) {
        const value = state.filters?.[name];
        select.value = [...select.options].some((option) => option.value === value) ? value : "";
      }
      if (status) status.value = [...status.options].some((option) => option.value === state.status) ? state.status : "eligible";
      if (typeof state.expanded === "boolean") filters.open = state.expanded;
      draw();
    },
    setEntries(nextEntries, demand) {
      const capacity = selects.get("capacity");
      const previous = capacity.value;
      const limits = new Set([100, 200, 500, 1000]);
      const quantities = demand ? quantitiesByUnit([demand]) : [];
      if (quantities.length === 1 && quantities[0].unit === "un" && quantities[0].quantity > 0) limits.add(quantities[0].quantity);
      capacity.replaceChildren(new Option("Capacidade", ""), ...[...limits].sort((a, b) => a - b).map((value) => new Option(`≥ ${number.format(value)} unidades`, String(value))));
      capacity.value = limits.has(Number(previous)) ? previous : "";
      entries = nextEntries;
      draw();
    },
    updateAccess() {
      const accessBySupplier = new Map(entries.map(({ profile }) => [String(profile.organizationId), hasAccess(profile)]));
      for (const card of grid.querySelectorAll("[data-supplier-id]")) {
        card.querySelector("[data-market-access]").hidden = !accessBySupplier.get(card.dataset.supplierId);
      }
    },
  };
}

export function createSupplierDialog(dialog) {
  let trigger;
  const title = element("h2");
  title.id = "marketplace-dialog-title";
  dialog.setAttribute("aria-labelledby", title.id);
  const header = element("div", "marketplace-dialog__heading");
  const close = button("Fechar", () => dialog.close());
  close.autofocus = true;
  header.append(title, close);
  const body = element("div", "marketplace-dialog__body");
  dialog.append(header, body);
  dialog.addEventListener("close", () => { if (!dialog.open && trigger?.isConnected) trigger.focus({ preventScroll: true }); });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const { left, right, top, bottom } = dialog.getBoundingClientRect();
      if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.close();
    }
  });

  const open = (heading, origin, ...content) => {
    title.textContent = heading;
    trigger = origin;
    body.replaceChildren(...content);
    dialog.showModal();
  };
  return {
    match(profile, demand, match, origin, invite, feedback) {
      const context = element("div", "marketplace-match-context");
      context.append(element("p", "", `Demanda: ${demand.title}`), badge(match), element("p", "", match.explanation));
      const criteria = element("ul", "marketplace-criteria");
      for (const { id, label, state, requiresConfirmation, explanation } of match.criteria) {
        const essential = id === "category" || id === "process";
        const tone = state === "met" ? "met" : essential ? "unmet" : "unknown";
        const result = state === "met" ? "Atendido" : essential ? "Não atendido"
          : state === "unmet" || requiresConfirmation || id === "capacity" ? "A confirmar" : "Não informado";
        const item = element("li", "marketplace-criterion");
        item.append(element("strong", "", essential ? `${label} (obrigatório)` : label),
          element("span", `marketplace-criterion__state marketplace-criterion__state--${tone}`, result),
          element("p", "", explanation));
        criteria.append(item);
      }
      const actions = element("div", "marketplace-dialog__actions");
      actions.append(invite, feedback);
      open(`Compatibilidade de ${companyName(profile)}`, origin, context, criteria, actions);
    },
  };
}

export const compareSuppliers = (first, second) => order.compare(companyName(first), companyName(second));
