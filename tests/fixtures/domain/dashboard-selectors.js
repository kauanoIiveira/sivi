import { assertScenarioInvariants } from "./scenario-invariants.js";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function indicator(scenario, { id, label, value, display, unit, formula }) {
  return Object.freeze({
    id,
    label,
    value,
    display: display ?? String(value),
    unit,
    formula,
    period: scenario.meta.periodLabel,
    source: scenario.meta.source,
  });
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function supplierName(scenario, supplierId) {
  return scenario.organizations.suppliers.find(({ id }) => id === supplierId)?.name ?? "Fornecedor";
}

function participantProposals(scenario, organizationId) {
  return scenario.proposals.filter(({ visibility }) => visibility.organizationIds.includes(organizationId));
}

function acceptedProposalVersion(scenario) {
  return scenario.proposals
    .flatMap(({ supplierId, versions }) => versions.map((version) => ({ supplierId, ...version })))
    .find(({ decision }) => decision === "accepted");
}

function cloneOwnLot(lot) {
  return Object.freeze({
    id: lot.id,
    source: lot.source,
    quantity: lot.quantity,
    demonstrativeStatus: lot.demonstrativeStatus,
    inspection: Object.freeze({ ...lot.inspection }),
    nonConformity: lot.nonConformity ? Object.freeze({ ...lot.nonConformity }) : null,
    qr: lot.qr ? Object.freeze({ ...lot.qr }) : null,
    dispatchedQuantity: lot.dispatchedQuantity,
  });
}

export function buildBuyerDashboard(scenario, workspace) {
  assertScenarioInvariants(scenario);
  const accepted = acceptedProposalVersion(scenario);
  const activeDemandCount = scenario.delivery.confirmedAt ? 0 : 1;
  const visibleProposals = participantProposals(scenario, workspace.organizationId);
  const proposalSummaries = visibleProposals.map((proposal) => {
    const latest = proposal.versions.at(-1);

    return Object.freeze({
      supplierId: proposal.supplierId,
      supplierName: supplierName(scenario, proposal.supplierId),
      versionCount: proposal.versions.length,
      latestTotalCents: latest.totalCents,
      latestTotalDisplay: currency.format(latest.totalCents / 100),
      leadTimeDays: latest.leadTimeDays,
      historicalQuality: Object.freeze({ ...proposal.historicalQuality }),
      accepted: latest.id === accepted.id,
    });
  });
  const releasedLots = scenario.lots.filter(({ demonstrativeStatus }) => demonstrativeStatus === "released");
  const blockedLots = scenario.lots.filter(({ demonstrativeStatus }) => demonstrativeStatus !== "released");

  return Object.freeze({
    role: "buyer",
    organizationName: workspace.organizationName,
    title: "Decisões industriais em andamento",
    metrics: Object.freeze([
      indicator(scenario, { id: "active-demands", label: "Demandas ativas", value: activeDemandCount, unit: "demanda", formula: "Contagem de demandas demonstrativas sem entrega confirmada" }),
      indicator(scenario, { id: "received-proposals", label: "Propostas recebidas", value: proposalSummaries.length, unit: "propostas", formula: "Contagem de fornecedoras que enviaram proposta para a demanda" }),
      indicator(scenario, { id: "accepted-value", label: "Valor aceito", value: accepted.totalCents, display: currency.format(accepted.totalCents / 100), unit: "BRL", formula: "Valor total da única versão de proposta aceita" }),
      indicator(scenario, { id: "delivery-confirmations", label: "Entregas a confirmar", value: scenario.delivery.confirmedAt ? 0 : 1, unit: "entrega", formula: "Pedidos despachados ou em execução sem confirmação de entrega" }),
    ]),
    proposalSummaries: Object.freeze(proposalSummaries),
    orderSummary: Object.freeze({
      id: scenario.order.id,
      quantity: scenario.order.quantity,
      releasedQuantity: sum(releasedLots.map(({ quantity }) => quantity)),
      blockedQuantity: sum(blockedLots.map(({ inspection }) => inspection.reworkQuantity)),
      requiredBy: scenario.demand.requiredBy,
    }),
  });
}

export function buildSupplierDashboard(scenario, workspace) {
  assertScenarioInvariants(scenario);
  const ownProposal = participantProposals(scenario, workspace.organizationId)
    .find(({ supplierId }) => supplierId === workspace.organizationId);
  if (!ownProposal) throw new Error("Workspace fornecedor não participa de uma proposta demonstrativa");

  const ownsOrder = scenario.order.supplierOrganizationId === workspace.organizationId;
  const ownLots = ownsOrder
    ? scenario.lots
    : [];
  const releasedOpportunityCount = scenario.matchCandidates.filter(
    ({ supplierId, invited }) => supplierId === workspace.organizationId && invited,
  ).length;
  const releasedQuantity = sum(
    ownLots.filter(({ demonstrativeStatus }) => demonstrativeStatus === "released").map(({ quantity }) => quantity),
  );
  const reworkQuantity = sum(ownLots.map(({ inspection }) => inspection.reworkQuantity));

  return Object.freeze({
    role: "supplier",
    organizationName: workspace.organizationName,
    title: "Execução e qualidade do compromisso aceito",
    metrics: Object.freeze([
      indicator(scenario, { id: "released-opportunities", label: "Oportunidades liberadas", value: releasedOpportunityCount, unit: "oportunidade", formula: "Convites de match demonstrativos liberados para este fornecedor" }),
      indicator(scenario, { id: "proposal-revisions", label: "Versões da proposta", value: ownProposal.versions.length, unit: "versões", formula: "Contagem de versões imutáveis da própria proposta" }),
      indicator(scenario, { id: "committed-quantity", label: "Quantidade comprometida", value: ownsOrder ? scenario.order.quantity : 0, unit: "unidades", formula: "Quantidade do pedido criado pela proposta aceita deste fornecedor" }),
      indicator(scenario, { id: "released-quantity", label: "Quantidade liberada", value: releasedQuantity, unit: "unidades", formula: "Soma de lotes próprios com status demonstrativo liberado" }),
      indicator(scenario, { id: "rework-quantity", label: "Em reinspeção", value: reworkQuantity, unit: "unidades", formula: "Soma de quantidades próprias em retrabalho ou reinspeção" }),
    ]),
    ownProposal: Object.freeze({
      id: ownProposal.id,
      supplierId: ownProposal.supplierId,
      versions: Object.freeze(ownProposal.versions.map((version) => Object.freeze({ ...version }))),
      historicalQuality: Object.freeze({ ...ownProposal.historicalQuality }),
    }),
    execution: Object.freeze({
      model: ownsOrder ? scenario.fulfillment.model : null,
      stockQuantity: ownsOrder ? scenario.fulfillment.stockQuantity : 0,
      productionQuantity: ownsOrder ? scenario.fulfillment.productionQuantity : 0,
      lots: Object.freeze(ownLots.map(cloneOwnLot)),
    }),
  });
}

export function buildAdminDashboard(scenario, workspace) {
  assertScenarioInvariants(scenario);
  const organizationCount = 1 + scenario.organizations.suppliers.length;
  const invitedCount = scenario.matchCandidates.filter(({ invited }) => invited).length;
  const responseCount = scenario.proposals.length;
  const candidateCount = scenario.matchCandidates.length;
  const matchCoveragePercent = candidateCount === 0 ? 0 : Math.round((invitedCount / candidateCount) * 100);
  const conversionPercent = invitedCount === 0 ? 0 : Math.round((responseCount / invitedCount) * 100);
  const qualityOccurrences = scenario.lots.filter(({ nonConformity }) => nonConformity).length;

  return Object.freeze({
    role: "administration",
    scope: "demonstrative-platform-readonly",
    organizationName: workspace.organizationName,
    title: "Leitura demonstrativa da plataforma",
    metrics: Object.freeze([
      indicator(scenario, { id: "represented-organizations", label: "Organizações representadas", value: organizationCount, unit: "organizações", formula: "Compradora mais fornecedoras presentes na fixture local" }),
      indicator(scenario, { id: "match-coverage", label: "Cobertura de match", value: matchCoveragePercent, display: `${matchCoveragePercent}%`, unit: "%", formula: "Fornecedoras convidadas ÷ candidatas do match × 100" }),
      indicator(scenario, { id: "proposal-conversion", label: "Conversão em proposta", value: conversionPercent, display: `${conversionPercent}%`, unit: "%", formula: "Fornecedoras que responderam ÷ fornecedoras convidadas × 100" }),
      indicator(scenario, { id: "negotiated-value", label: "Valor negociado", value: scenario.order.totalCents, display: currency.format(scenario.order.totalCents / 100), unit: "BRL", formula: "Soma de pedidos demonstrativos originados de aceite único" }),
      indicator(scenario, { id: "quality-occurrences", label: "Ocorrências de qualidade", value: qualityOccurrences, unit: "ocorrência", formula: "Contagem de lotes demonstrativos com não conformidade" }),
    ]),
    aggregates: Object.freeze({
      demands: 1,
      matchedOrganizations: scenario.matchCandidates.length,
      respondingOrganizations: responseCount,
      orders: 1,
      nonConformities: qualityOccurrences,
    }),
    limitation: "Leitura agregada da fixture local; não representa aprovação, permissão ou auditoria real.",
  });
}

export function buildIndustrialJourney(scenario, workspace) {
  assertScenarioInvariants(scenario);
  const isSupplier = workspace.organizationRole === "supplier";
  const ownProposal = isSupplier
    ? participantProposals(scenario, workspace.organizationId)
      .find(({ supplierId }) => supplierId === workspace.organizationId)
    : null;
  if (isSupplier && !ownProposal) {
    throw new Error("Workspace fornecedor não participa de uma proposta demonstrativa");
  }
  const ownLatestProposal = ownProposal?.versions.at(-1) ?? null;
  const ownsOrder = isSupplier && scenario.order.supplierOrganizationId === workspace.organizationId;
  const ownLots = ownsOrder ? scenario.lots : [];
  const ownReleasedLots = ownLots.filter(({ demonstrativeStatus }) => demonstrativeStatus === "released");
  const ownReworkQuantity = sum(ownLots.map(({ inspection }) => inspection.reworkQuantity));
  const operationalJourney = !isSupplier || ownsOrder;
  const operationalLots = operationalJourney ? scenario.lots : [];
  const releasedOperationalLots = operationalLots.filter(
    ({ demonstrativeStatus }) => demonstrativeStatus === "released",
  );
  const ownMatchEvidence = scenario.matchCandidates
    .filter(({ supplierId }) => !isSupplier || supplierId === workspace.organizationId)
    .map(({ supplierId }) => supplierId);
  const proposalSummary = workspace.organizationRole === "buyer"
    ? "Duas propostas privadas comparadas; uma versão aceita"
    : isSupplier
      ? ownLatestProposal.decision === "accepted"
        ? `${ownProposal.versions.length} versões da sua proposta; revisão ${ownLatestProposal.revision} aceita`
        : `${ownProposal.versions.length} versão da sua proposta; não selecionada`
      : "Duas organizações responderam; decisão feita pela compradora";
  const qualitySummary = isSupplier && ownsOrder
    ? `${sum(ownReleasedLots.map(({ quantity }) => quantity))} liberadas; ${ownReworkQuantity} unidades próprias aguardam reinspeção`
    : "320 liberadas; 30 unidades bloqueadas para reinspeção";
  const fulfillmentSummary = operationalJourney
    ? `${scenario.fulfillment.stockQuantity} em estoque + ${scenario.fulfillment.productionQuantity} em produção`
    : "Disponível somente para a fornecedora do pedido";
  const orderSummary = isSupplier && !ownsOrder
    ? "Nenhum pedido foi originado pela sua proposta"
    : "Aceite único originou um pedido";

  return Object.freeze([
    Object.freeze({ id: "demand", label: "Demanda", status: "completed", summary: "500 engrenagens publicadas", evidenceIds: Object.freeze([scenario.demand.id]) }),
    Object.freeze({ id: "match", label: "Match", status: "completed", summary: "Fornecedores compatíveis e critérios explicados", evidenceIds: Object.freeze(ownMatchEvidence) }),
    Object.freeze({ id: "proposals", label: "Propostas", status: "completed", summary: proposalSummary, evidenceIds: Object.freeze(isSupplier ? [ownLatestProposal.id] : ["comparison-demo"]) }),
    Object.freeze({ id: "order", label: "Pedido", status: isSupplier && !ownsOrder ? "locked" : "completed", summary: orderSummary, evidenceIds: Object.freeze(operationalJourney ? [scenario.order.id] : []) }),
    Object.freeze({ id: "fulfillment", label: "Atendimento", status: operationalJourney ? "active" : "locked", summary: fulfillmentSummary, evidenceIds: Object.freeze(operationalJourney ? scenario.lots.map(({ id }) => id) : []) }),
    Object.freeze({ id: "quality", label: "Qualidade", status: operationalJourney ? "attention" : "locked", summary: operationalJourney ? qualitySummary : "Disponível somente para a fornecedora do pedido", evidenceIds: Object.freeze(operationalJourney ? scenario.lots.map(({ inspection }) => inspection.planVersion) : []) }),
    Object.freeze({ id: "qr", label: "QR", status: operationalJourney ? "partial" : "locked", summary: operationalJourney ? "QR emitido somente para o lote de 320 liberadas" : "Disponível somente para a fornecedora do pedido", evidenceIds: Object.freeze(releasedOperationalLots.map(({ id }) => id)) }),
    Object.freeze({ id: "delivery", label: "Entrega", status: "upcoming", summary: "Expedição ainda não iniciada", evidenceIds: Object.freeze([]) }),
    Object.freeze({ id: "evaluation", label: "Avaliação", status: "locked", summary: "Disponível somente após entrega confirmada", evidenceIds: Object.freeze([]) }),
  ]);
}
