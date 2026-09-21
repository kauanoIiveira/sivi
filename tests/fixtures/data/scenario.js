function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

export const DEMO_SCENARIO = deepFreeze({
  meta: {
    id: "demo-500-gears-v1",
    label: "Jornada demonstrativa de 500 engrenagens",
    source: "Fixture local SIVI",
    asOf: "2026-08-28T15:00:00.000Z",
    periodLabel: "Jornada ativa — agosto de 2026",
    technicalBasis: "demonstrative_unvalidated",
    statusVocabulary: "demonstrative_not_canonical",
  },
  organizations: {
    buyer: { id: "org-alpha", name: "Indústrias Alpha" },
    suppliers: [
      { id: "org-vetor", name: "Vetor Componentes Industriais" },
      { id: "org-horizonte", name: "Horizonte Usinagem" },
    ],
  },
  users: [
    { id: "demo-buyer-user", organizationId: "org-alpha", roles: ["buyer", "manager"] },
    { id: "demo-supplier-user", organizationId: "org-vetor", roles: ["commercial", "operations", "quality"] },
    { id: "demo-platform-user", organizationId: "sivi-platform", roles: ["platform-admin"] },
  ],
  capabilities: [
    { supplierId: "org-vetor", processes: ["gear-hobbing", "heat-treatment"], materials: ["sae-1045"], capacityPerMonth: 1200 },
    { supplierId: "org-horizonte", processes: ["gear-hobbing"], materials: ["sae-1045"], capacityPerMonth: 800 },
  ],
  demand: {
    id: "demand-gear-500",
    buyerOrganizationId: "org-alpha",
    title: "Engrenagem cilíndrica módulo 3",
    quantity: 500,
    unit: "unidades",
    demonstrativeStatus: "decision_completed",
    publishedAt: "2026-08-03T12:00:00.000Z",
    requiredBy: "2026-09-15",
    criteria: [
      { id: "criterion-process", label: "Fresamento de engrenagens", required: true },
      { id: "criterion-material", label: "Aço SAE 1045", required: true },
      { id: "criterion-capacity", label: "Capacidade para 500 unidades", required: true },
    ],
  },
  matchCandidates: [
    { supplierId: "org-vetor", adherencePercent: 96, invited: true },
    { supplierId: "org-horizonte", adherencePercent: 88, invited: true },
  ],
  proposals: [
    {
      id: "proposal-vetor",
      supplierId: "org-vetor",
      visibility: { scope: "private_to_participants", organizationIds: ["org-alpha", "org-vetor"] },
      historicalQuality: { onTimePercent: 94, acceptedLotsPercent: 97, sampleSize: 18 },
      versions: [
        { id: "proposal-vetor-v1", revision: 1, totalCents: 15_200_000, leadTimeDays: 32, decision: "superseded" },
        { id: "proposal-vetor-v2", revision: 2, totalCents: 14_900_000, leadTimeDays: 30, decision: "accepted" },
      ],
    },
    {
      id: "proposal-horizonte",
      supplierId: "org-horizonte",
      visibility: { scope: "private_to_participants", organizationIds: ["org-alpha", "org-horizonte"] },
      historicalQuality: { onTimePercent: 91, acceptedLotsPercent: 95, sampleSize: 11 },
      versions: [
        { id: "proposal-horizonte-v1", revision: 1, totalCents: 14_450_000, leadTimeDays: 38, decision: "not_selected" },
      ],
    },
  ],
  order: {
    id: "order-gear-500",
    buyerOrganizationId: "org-alpha",
    supplierOrganizationId: "org-vetor",
    sourceDemandId: "demand-gear-500",
    sourceProposalVersionId: "proposal-vetor-v2",
    quantity: 500,
    totalCents: 14_900_000,
    demonstrativeStatus: "in_execution",
    acceptedAt: "2026-08-08T18:20:00.000Z",
  },
  fulfillment: {
    orderId: "order-gear-500",
    stockQuantity: 320,
    productionQuantity: 180,
    model: "mixed",
  },
  inspectionPlans: [
    {
      id: "inspection-plan-v1",
      revision: 1,
      authority: "demonstrative_unvalidated",
      characteristics: ["diâmetro primitivo", "batimento radial", "dureza superficial"],
    },
  ],
  lots: [
    {
      id: "lot-stock-320",
      orderId: "order-gear-500",
      source: "stock",
      quantity: 320,
      demonstrativeStatus: "released",
      inspection: { planVersion: "inspection-plan-v1", approvedQuantity: 320, reworkQuantity: 0 },
      nonConformity: null,
      qr: { token: "sivi_demo_stock_320", publicProjection: "released_traceability" },
      dispatchedQuantity: 0,
    },
    {
      id: "lot-production-180",
      orderId: "order-gear-500",
      source: "production",
      quantity: 180,
      demonstrativeStatus: "blocked_for_reinspection",
      inspection: { planVersion: "inspection-plan-v1", approvedQuantity: 150, reworkQuantity: 30 },
      nonConformity: { id: "nc-gear-030", affectedQuantity: 30, status: "reinspection_scheduled" },
      qr: null,
      dispatchedQuantity: 0,
    },
  ],
  activities: [
    { id: "activity-acceptance", kind: "proposal_accepted", recordId: "proposal-vetor-v2", at: "2026-08-08T18:20:00.000Z" },
    { id: "activity-nc", kind: "non_conformity_opened", recordId: "nc-gear-030", at: "2026-08-27T14:00:00.000Z" },
  ],
  notifications: [
    { id: "notification-buyer-quality", audienceRole: "buyer", label: "30 unidades aguardam reinspeção" },
    { id: "notification-supplier-reinspection", audienceRole: "supplier", label: "Reinspeção do lote de produção pendente" },
  ],
  delivery: {
    orderId: "order-gear-500",
    demonstrativeStatus: "not_dispatched",
    confirmedAt: null,
  },
  evaluation: null,
});
