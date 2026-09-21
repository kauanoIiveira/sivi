const SVG_NS = "http://www.w3.org/2000/svg";

let railInstance = 0;

export const RAIL_STATUS_LABELS = Object.freeze({
  completed: Object.freeze({ label: "Concluída", glyph: "✓" }),
  active: Object.freeze({ label: "Em curso", glyph: "→" }),
  attention: Object.freeze({ label: "Requer atenção", glyph: "!" }),
  partial: Object.freeze({ label: "Parcial", glyph: "◐" }),
  upcoming: Object.freeze({ label: "Próxima", glyph: "○" }),
  locked: Object.freeze({ label: "Bloqueada por dependência", glyph: "×" }),
});

const htmlElement = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const svgElement = (tag, attributes = {}) => {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
  return node;
};

function normaliseSteps(steps) {
  if (!Array.isArray(steps)) return [];
  const ids = new Set();

  return steps.flatMap((step) => {
    if (!step || typeof step !== "object" || typeof step.id !== "string" || ids.has(step.id)) return [];
    ids.add(step.id);
    const status = Object.hasOwn(RAIL_STATUS_LABELS, step.status) ? step.status : "locked";
    const evidenceIds = Array.isArray(step.evidenceIds)
      ? [...new Set(step.evidenceIds.filter((id) => typeof id === "string" && id.length > 0))]
      : [];
    return [{
      id: step.id,
      label: typeof step.label === "string" && step.label.length > 0 ? step.label : "Etapa sem nome",
      status,
      summary: typeof step.summary === "string" && step.summary.length > 0
        ? step.summary
        : "Sem resumo disponível.",
      evidenceIds,
    }];
  });
}

function createDetail(detailId) {
  const detail = htmlElement("section", "industrial-rail__detail");
  detail.id = detailId;
  detail.setAttribute("aria-live", "polite");

  const narrative = htmlElement("div", "industrial-rail__detail-copy");
  const status = htmlElement("span", "industrial-rail__detail-status");
  status.dataset.railDetailStatus = "true";
  const title = htmlElement("h3");
  title.dataset.railDetailTitle = "true";
  const summary = htmlElement("p");
  summary.dataset.railDetailSummary = "true";
  narrative.append(status, title, summary);

  const evidencePanel = htmlElement("div", "industrial-rail__evidence-panel");
  evidencePanel.append(htmlElement("strong", "", "Registros vinculados"));
  const evidence = htmlElement("div");
  evidence.dataset.railEvidence = "true";
  const output = htmlElement("output");
  output.dataset.railEvidenceOutput = "true";
  evidencePanel.append(evidence, output);
  detail.append(narrative, evidencePanel);

  return { detail, status, title, summary, evidence, output };
}

function createLegend() {
  const legend = htmlElement("ul", "industrial-rail__legend");
  legend.dataset.railLegend = "true";
  legend.setAttribute("aria-label", "Legenda dos estados da jornada");

  Object.entries(RAIL_STATUS_LABELS).forEach(([status, definition]) => {
    const item = htmlElement("li");
    item.dataset.railLegendStatus = status;
    const glyph = htmlElement("b", "", definition.glyph);
    glyph.setAttribute("aria-hidden", "true");
    item.append(glyph, htmlElement("span", "", definition.label));
    legend.append(item);
  });
  return legend;
}

function createTable(steps) {
  const details = htmlElement("details", "industrial-rail__table-wrap");
  details.append(htmlElement("summary", "", "Ver leitura completa em tabela"));
  const scroll = htmlElement("div", "industrial-rail__table-scroll");
  scroll.tabIndex = 0;
  scroll.setAttribute("role", "region");
  scroll.setAttribute("aria-label", "Leitura tabular da jornada industrial");
  const table = htmlElement("table");
  table.dataset.railTable = "true";
  const head = htmlElement("thead");
  const headerRow = htmlElement("tr");
  ["Etapa", "Estado", "Resumo", "Evidências"].forEach((label) => {
    const cell = htmlElement("th", "", label);
    cell.scope = "col";
    headerRow.append(cell);
  });
  head.append(headerRow);
  const body = htmlElement("tbody");
  steps.forEach((step) => {
    const row = htmlElement("tr");
    [
      step.label,
      `${RAIL_STATUS_LABELS[step.status].glyph} ${RAIL_STATUS_LABELS[step.status].label}`,
      step.summary,
      step.evidenceIds.join(" · ") || "Nenhuma evidência liberada",
    ].forEach((value) => row.append(htmlElement("td", "", value)));
    body.append(row);
  });
  table.append(head, body);
  scroll.append(table);
  details.append(scroll);
  return details;
}

export function mountIndustrialRail(container, rawSteps, rawMeta = {}) {
  if (!container || typeof container.replaceChildren !== "function") {
    throw new TypeError("O trilho industrial requer um contêiner DOM válido");
  }

  const steps = normaliseSteps(rawSteps);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};
  const instanceId = `industrial-rail-${++railInstance}`;
  const titleId = `${instanceId}-title`;
  const descriptionId = `${instanceId}-description`;
  const detailId = `${instanceId}-detail`;
  const listeners = new AbortController();
  let removed = false;

  const figure = htmlElement("figure", "industrial-rail");
  figure.dataset.industrialRail = "true";
  const visualScroll = htmlElement("div", "industrial-rail__visual-scroll");
  visualScroll.tabIndex = 0;
  visualScroll.setAttribute("role", "region");
  visualScroll.setAttribute("aria-label", "Visualização horizontal do trilho industrial");

  const svg = svgElement("svg", {
    viewBox: "0 0 1120 170",
    role: "group",
    "aria-labelledby": `${titleId} ${descriptionId}`,
  });
  const title = svgElement("title", { id: titleId });
  title.textContent = "Trilho industrial da jornada";
  const description = svgElement("desc", { id: descriptionId });
  description.textContent = steps.length > 0
    ? `${steps.length} marcos da demanda à avaliação, com estado textual, evidências e dependências.`
    : "Nenhuma etapa disponível para esta leitura.";
  svg.append(title, description);

  const positions = steps.map((_step, index) => ({
    x: 72 + index * (976 / Math.max(steps.length - 1, 1)),
    y: 78,
  }));
  if (positions.length > 1) {
    const path = `M ${positions.map(({ x, y }) => `${x} ${y}`).join(" L ")}`;
    svg.append(
      svgElement("path", { class: "industrial-rail__track industrial-rail__track--bed", d: path }),
      svgElement("path", { class: "industrial-rail__track industrial-rail__track--signal", d: path }),
    );
  }

  const detailParts = createDetail(detailId);
  const groups = [];

  const selectStep = (step, group) => {
    groups.forEach((node) => {
      const selected = node === group;
      node.toggleAttribute("data-selected", selected);
      node.setAttribute("aria-pressed", String(selected));
    });
    const definition = RAIL_STATUS_LABELS[step.status];
    detailParts.status.textContent = `${definition.glyph} ${definition.label}`;
    detailParts.title.textContent = step.label;
    detailParts.summary.textContent = step.summary;
    detailParts.evidence.replaceChildren();
    detailParts.output.textContent = "";

    if (step.evidenceIds.length === 0) {
      detailParts.evidence.append(htmlElement("span", "industrial-rail__empty-evidence", "Nenhuma evidência liberada nesta etapa."));
      return;
    }

    step.evidenceIds.forEach((evidenceId) => {
      const button = htmlElement("button", "", evidenceId);
      button.type = "button";
      button.addEventListener("click", () => {
        detailParts.output.textContent = `Evidência ${evidenceId} vinculada à etapa ${step.label}.`;
        figure.dispatchEvent(new CustomEvent("sivi:evidence-request", {
          bubbles: true,
          detail: { evidenceId, stepId: step.id },
        }));
      }, { signal: listeners.signal });
      detailParts.evidence.append(button);
    });
  };

  steps.forEach((step, index) => {
    const definition = RAIL_STATUS_LABELS[step.status];
    const { x, y } = positions[index];
    const group = svgElement("g", {
      class: `industrial-rail__node industrial-rail__node--${step.status}`,
      transform: `translate(${x} ${y})`,
      tabindex: "0",
      role: "button",
      "aria-controls": detailId,
      "aria-label": `${step.label}. ${definition.label}. ${step.summary}`,
      "aria-pressed": "false",
      "data-rail-step": step.id,
    });
    group.append(
      svgElement("circle", { class: "industrial-rail__halo", r: "31" }),
      svgElement("circle", { class: "industrial-rail__disc", r: "21" }),
    );
    const glyph = svgElement("text", {
      class: "industrial-rail__glyph",
      "text-anchor": "middle",
      y: "6",
      "aria-hidden": "true",
    });
    glyph.textContent = definition.glyph;
    const sequence = svgElement("text", {
      class: "industrial-rail__sequence",
      "text-anchor": "middle",
      y: y < 126 ? "-42" : "54",
      "aria-hidden": "true",
    });
    sequence.textContent = String(index + 1).padStart(2, "0");
    const label = svgElement("text", {
      class: "industrial-rail__label",
      "text-anchor": "middle",
      y: y < 126 ? "52" : "-40",
      "aria-hidden": "true",
    });
    label.textContent = step.label;
    group.append(glyph, sequence, label);
    group.addEventListener("click", () => selectStep(step, group), { signal: listeners.signal });
    group.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectStep(step, group);
    }, { signal: listeners.signal });
    groups.push(group);
    svg.append(group);
  });

  if (steps.length === 0) {
    detailParts.status.textContent = "Sem etapas";
    detailParts.title.textContent = "Jornada indisponível";
    detailParts.summary.textContent = "Nenhuma etapa válida foi recebida.";
    detailParts.evidence.append(htmlElement("span", "industrial-rail__empty-evidence", "Nenhuma evidência liberada."));
  }

  const caption = htmlElement("figcaption");
  caption.append(
    htmlElement("span", "", `Período · ${typeof meta.period === "string" ? meta.period : "não informado"}`),
    htmlElement("span", "", `Origem · ${typeof meta.source === "string" ? meta.source : "não informada"}`),
  );
  visualScroll.append(svg);
  figure.append(visualScroll, createLegend(), detailParts.detail, createTable(steps), caption);
  container.replaceChildren(figure);

  if (steps.length > 0) {
    const initialIndex = Math.max(0, steps.findIndex(({ status }) => status === "active"));
    selectStep(steps[initialIndex], groups[initialIndex]);
  }

  return () => {
    if (removed) return;
    removed = true;
    listeners.abort();
    figure.remove();
  };
}
