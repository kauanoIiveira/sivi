function invariant(condition, message) {
  if (!condition) throw new Error(`Cenário SIVI inválido: ${message}`);
}

function isSafeNonNegativeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function isUtcIsoTimestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) {
    return false;
  }
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime())
    && parsed.toISOString() === (value.includes(".") ? value : value.replace("Z", ".000Z"));
}

function assertCents(value) {
  invariant(isSafeNonNegativeInteger(value), "centavos deve ser inteiro seguro não negativo");
}

function assertUtcTimestamp(value) {
  invariant(isUtcIsoTimestamp(value), "timestamp deve ser ISO UTC válido");
}

export function assertScenarioInvariants(scenario) {
  const demandQuantity = scenario.demand.quantity;
  const fulfillmentQuantity =
    scenario.fulfillment.stockQuantity + scenario.fulfillment.productionQuantity;
  invariant(fulfillmentQuantity === demandQuantity, "o atendimento deve totalizar 500 unidades");
  assertUtcTimestamp(scenario.meta.asOf);
  assertUtcTimestamp(scenario.demand.publishedAt);
  assertUtcTimestamp(scenario.order.acceptedAt);
  scenario.activities.forEach(({ at }) => assertUtcTimestamp(at));
  if (scenario.delivery.confirmedAt) assertUtcTimestamp(scenario.delivery.confirmedAt);
  assertCents(scenario.order.totalCents);

  const supplierIds = new Set(scenario.proposals.map(({ supplierId }) => supplierId));
  invariant(supplierIds.size >= 2, "a comparação precisa de duas fornecedoras concorrentes");
  invariant(
    scenario.proposals.some(({ versions }) => versions.length > 1),
    "ao menos uma proposta precisa demonstrar revisão imutável",
  );

  const proposalVersions = scenario.proposals.flatMap((proposal) => {
    const revisions = new Set();
    proposal.versions.forEach((version) => {
      invariant(
        Number.isSafeInteger(version.revision) && version.revision > 0,
        "revisão da proposta deve ser um inteiro positivo",
      );
      invariant(!revisions.has(version.revision), "revisões da proposta devem ser únicas");
      revisions.add(version.revision);
      invariant(
        version.id === `${proposal.id}-v${version.revision}`,
        "ID da versão deve corresponder à proposta e revisão",
      );
      assertCents(version.totalCents);
    });
    const latestRevision = Math.max(...proposal.versions.map(({ revision }) => revision));
    return proposal.versions.map((version) => ({ ...version, proposalId: proposal.id, supplierId: proposal.supplierId, latestRevision }));
  });
  const acceptedVersions = proposalVersions.filter(({ decision }) => decision === "accepted");
  invariant(acceptedVersions.length === 1, "deve existir exatamente uma versão aceita");
  const [acceptedVersion] = acceptedVersions;
  invariant(
    acceptedVersion.revision === acceptedVersion.latestRevision,
    "a versão aceita deve ser a revisão mais recente",
  );
  invariant(
    acceptedVersion.id === "proposal-vetor-v2",
    "versão aceita deve permanecer proposal-vetor-v2",
  );
  invariant(
    scenario.order.sourceProposalVersionId === acceptedVersion.id,
    "o pedido deve referenciar a versão aceita",
  );
  invariant(scenario.order.sourceDemandId === scenario.demand.id, "o pedido deve referenciar a demanda");
  invariant(
    scenario.order.supplierOrganizationId === acceptedVersion.supplierId,
    "fornecedor do pedido deve possuir a versão aceita",
  );
  invariant(scenario.order.quantity === demandQuantity, "quantidade do pedido deve coincidir com a demanda");
  invariant(
    scenario.order.totalCents === acceptedVersion.totalCents,
    "total do pedido deve coincidir com a versão aceita",
  );

  scenario.proposals.forEach((proposal) => {
    const organizationIds = proposal.visibility?.organizationIds;
    invariant(
      proposal.visibility?.scope === "private_to_participants"
        && Array.isArray(organizationIds)
        && organizationIds.length === 2
        && new Set(organizationIds).size === 2
        && organizationIds.includes(scenario.demand.buyerOrganizationId)
        && organizationIds.includes(proposal.supplierId),
      "proposta deve ser privada para as organizações participantes",
    );
  });

  invariant(scenario.fulfillment.orderId === scenario.order.id, "fulfillment deve referenciar o pedido");
  invariant(scenario.delivery.orderId === scenario.order.id, "delivery deve referenciar o pedido");

  const lotQuantity = scenario.lots.reduce((sum, lot) => sum + lot.quantity, 0);
  invariant(lotQuantity === demandQuantity, "os lotes devem cobrir a quantidade do pedido");
  const inspectionPlanIds = new Set(scenario.inspectionPlans.map(({ id }) => id));
  scenario.lots.forEach((lot) => {
    invariant(lot.orderId === scenario.order.id, "lot deve referenciar o pedido");
    invariant(inspectionPlanIds.has(lot.inspection.planVersion), `o lote ${lot.id} deve usar um plano versionado existente`);
    invariant(
      lot.inspection.approvedQuantity + lot.inspection.reworkQuantity === lot.quantity,
      `a inspeção do lote ${lot.id} deve fechar sua quantidade`,
    );
    invariant(!lot.qr || lot.demonstrativeStatus === "released", "QR exige lote liberado");
    invariant(
      lot.dispatchedQuantity === 0 || lot.demonstrativeStatus === "released",
      "expedição exige lote liberado",
    );
    if (lot.inspection.reworkQuantity > 0) {
      invariant(lot.nonConformity, "retrabalho exige NC correspondente");
    }
    if (lot.nonConformity) {
      invariant(
        lot.nonConformity.affectedQuantity === lot.inspection.reworkQuantity,
        "NC deve afetar a quantidade em retrabalho",
      );
      invariant(
        lot.demonstrativeStatus === "blocked_for_reinspection"
          && lot.nonConformity.status === "reinspection_scheduled",
        "NC exige lote bloqueado para reinspeção",
      );
      invariant(
        scenario.activities.some(
          ({ kind, recordId }) => kind === "non_conformity_opened" && recordId === lot.nonConformity.id,
        ),
        "NC exige atividade de abertura correspondente",
      );
    }
  });

  invariant(
    !scenario.evaluation || Boolean(scenario.delivery.confirmedAt),
    "avaliação exige entrega confirmada",
  );
  invariant(
    scenario.proposals.every((proposal) => proposal.historicalQuality && !("currentInspection" in proposal)),
    "qualidade do comparador deve ser somente histórica",
  );
  return true;
}
