import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_SCENARIO } from "../fixtures/data/scenario.js";
import { assertScenarioInvariants } from "../fixtures/domain/scenario-invariants.js";

test("accepts the immutable 500-gear reference story", () => {
  assert.equal(assertScenarioInvariants(DEMO_SCENARIO), true);
  assert.equal(Object.isFrozen(DEMO_SCENARIO.order), true);
});

test("deeply freezes the demonstrative fixture", () => {
  assert.equal(Object.isFrozen(DEMO_SCENARIO.proposals), true);
  assert.equal(Object.isFrozen(DEMO_SCENARIO.proposals[0]), true);
  assert.equal(Object.isFrozen(DEMO_SCENARIO.proposals[0].versions), true);
  assert.equal(Object.isFrozen(DEMO_SCENARIO.proposals[0].versions[1]), true);
  assert.throws(() => DEMO_SCENARIO.lots[0].inspection.approvedQuantity = 0, TypeError);
});

test("rejects inconsistent fulfillment and non-released QR", () => {
  const inconsistent = structuredClone(DEMO_SCENARIO);
  inconsistent.fulfillment.productionQuantity = 179;
  assert.throws(() => assertScenarioInvariants(inconsistent), /atendimento deve totalizar 500/);

  const unsafeQr = structuredClone(DEMO_SCENARIO);
  unsafeQr.lots[1].qr = { token: "must-not-exist" };
  assert.throws(() => assertScenarioInvariants(unsafeQr), /QR exige lote liberado/);
});

test("rejects a second accepted version or premature evaluation", () => {
  const duplicatedAcceptance = structuredClone(DEMO_SCENARIO);
  duplicatedAcceptance.proposals[1].versions[0].decision = "accepted";
  assert.throws(() => assertScenarioInvariants(duplicatedAcceptance), /exatamente uma versão aceita/);

  const prematureEvaluation = structuredClone(DEMO_SCENARIO);
  prematureEvaluation.evaluation = { score: 5 };
  assert.throws(() => assertScenarioInvariants(prematureEvaluation), /avaliação exige entrega confirmada/);
});

test("rejects economic drift, supplier mismatch, and records detached from the order", () => {
  const wrongSupplier = structuredClone(DEMO_SCENARIO);
  wrongSupplier.order.supplierOrganizationId = "org-horizonte";
  assert.throws(() => assertScenarioInvariants(wrongSupplier), /fornecedor do pedido deve possuir a versão aceita/);

  const wrongQuantity = structuredClone(DEMO_SCENARIO);
  wrongQuantity.order.quantity = 499;
  assert.throws(() => assertScenarioInvariants(wrongQuantity), /quantidade do pedido deve coincidir com a demanda/);

  const wrongTotal = structuredClone(DEMO_SCENARIO);
  wrongTotal.order.totalCents = 14_900_001;
  assert.throws(() => assertScenarioInvariants(wrongTotal), /total do pedido deve coincidir com a versão aceita/);

  for (const [path, mutate] of [
    ["fulfillment", (scenario) => { scenario.fulfillment.orderId = "order-unrelated"; }],
    ["lot", (scenario) => { scenario.lots[0].orderId = "order-unrelated"; }],
    ["delivery", (scenario) => { scenario.delivery.orderId = "order-unrelated"; }],
  ]) {
    const detached = structuredClone(DEMO_SCENARIO);
    mutate(detached);
    assert.throws(() => assertScenarioInvariants(detached), new RegExp(`${path} deve referenciar o pedido`));
  }
});

test("rejects invalid cents, non-UTC timestamps, and an acceptance moved back to v1", () => {
  const fractionalCents = structuredClone(DEMO_SCENARIO);
  fractionalCents.proposals[0].versions[1].totalCents = 14_900_000.5;
  assert.throws(() => assertScenarioInvariants(fractionalCents), /centavos deve ser inteiro seguro não negativo/);

  const localTimestamp = structuredClone(DEMO_SCENARIO);
  localTimestamp.order.acceptedAt = "2026-08-08T15:20:00-03:00";
  assert.throws(() => assertScenarioInvariants(localTimestamp), /timestamp deve ser ISO UTC válido/);

  const impossibleTimestamp = structuredClone(DEMO_SCENARIO);
  impossibleTimestamp.order.acceptedAt = "2026-02-30T15:20:00.000Z";
  assert.throws(() => assertScenarioInvariants(impossibleTimestamp), /timestamp deve ser ISO UTC válido/);

  const acceptanceMovedToV1 = structuredClone(DEMO_SCENARIO);
  acceptanceMovedToV1.proposals[0].versions[0].decision = "accepted";
  acceptanceMovedToV1.proposals[0].versions[1].decision = "superseded";
  acceptanceMovedToV1.order.sourceProposalVersionId = "proposal-vetor-v1";
  assert.throws(() => assertScenarioInvariants(acceptanceMovedToV1), /versão aceita deve ser a revisão mais recente/);
});

test("rejects a proposal without private participant visibility", () => {
  const publicProposal = structuredClone(DEMO_SCENARIO);
  publicProposal.proposals[1].visibility = {
    scope: "public",
    organizationIds: ["org-alpha", "org-horizonte"],
  };
  assert.throws(() => assertScenarioInvariants(publicProposal), /proposta deve ser privada para as organizações participantes/);
});

test("rejects non-conformity quantities, blocked state, and missing reinspection activity", () => {
  const wrongAffectedQuantity = structuredClone(DEMO_SCENARIO);
  wrongAffectedQuantity.lots[1].nonConformity.affectedQuantity = 29;
  assert.throws(() => assertScenarioInvariants(wrongAffectedQuantity), /NC deve afetar a quantidade em retrabalho/);

  const unblockedLot = structuredClone(DEMO_SCENARIO);
  unblockedLot.lots[1].demonstrativeStatus = "released";
  assert.throws(() => assertScenarioInvariants(unblockedLot), /NC exige lote bloqueado para reinspeção/);

  const missingActivity = structuredClone(DEMO_SCENARIO);
  missingActivity.activities = missingActivity.activities.filter(({ recordId }) => recordId !== "nc-gear-030");
  assert.throws(() => assertScenarioInvariants(missingActivity), /NC exige atividade de abertura correspondente/);
});

test("rejects renaming the accepted v2 reference journey to v3", () => {
  const renamedAcceptance = structuredClone(DEMO_SCENARIO);
  renamedAcceptance.proposals[0].versions[1].id = "proposal-vetor-v3";
  renamedAcceptance.proposals[0].versions[1].revision = 3;
  renamedAcceptance.order.sourceProposalVersionId = "proposal-vetor-v3";
  assert.throws(
    () => assertScenarioInvariants(renamedAcceptance),
    /versão aceita deve permanecer proposal-vetor-v2/,
  );
});

test("rejects rework without a corresponding non-conformity", () => {
  const reworkWithoutNc = structuredClone(DEMO_SCENARIO);
  reworkWithoutNc.lots[1].nonConformity = null;
  assert.throws(() => assertScenarioInvariants(reworkWithoutNc), /retrabalho exige NC correspondente/);
});
