import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAdminDashboard,
  buildBuyerDashboard,
  buildIndustrialJourney,
  buildSupplierDashboard,
} from "../fixtures/domain/dashboard-selectors.js";
import { DEMO_SCENARIO } from "../fixtures/data/scenario.js";
import { DEMO_WORKSPACES } from "../fixtures/data/workspaces.js";

const workspace = (role) => DEMO_WORKSPACES.find(({ organizationRole }) => organizationRole === role);

const hasIndicatorMetadata = ({ label, display, formula, period, source }) =>
  Boolean(label && display && formula && period && source);

test("buyer projection compares received proposals with reproducible indicators", () => {
  const dashboard = buildBuyerDashboard(DEMO_SCENARIO, workspace("buyer"));

  assert.equal(dashboard.proposalSummaries.length, 2);
  assert.equal(dashboard.metrics.every(hasIndicatorMetadata), true);
  assert.match(JSON.stringify(dashboard), /Horizonte Usinagem/);
});

test("supplier projection exposes only its own commercial data", () => {
  const dashboard = buildSupplierDashboard(DEMO_SCENARIO, workspace("supplier"));
  const serialized = JSON.stringify(dashboard);

  assert.equal(dashboard.ownProposal.supplierId, "org-vetor");
  assert.doesNotMatch(serialized, /org-horizonte|Horizonte Usinagem|14450000/);
  assert.equal(dashboard.metrics.every(hasIndicatorMetadata), true);
});

test("administration receives aggregate platform signals, not proposal details", () => {
  const dashboard = buildAdminDashboard(DEMO_SCENARIO, workspace("administration"));
  const serialized = JSON.stringify(dashboard);

  assert.equal(dashboard.scope, "demonstrative-platform-readonly");
  assert.equal(dashboard.metrics.every(hasIndicatorMetadata), true);
  assert.doesNotMatch(serialized, /proposal-vetor|proposal-horizonte|leadTimeDays/);
  assert.equal(dashboard.metrics.find(({ id }) => id === "negotiated-value").label, "Valor negociado");
  assert.doesNotMatch(serialized, /faturamento/i);
});

test("supplier journey filters competitor evidence and commercial information", () => {
  const journey = buildIndustrialJourney(DEMO_SCENARIO, workspace("supplier"));
  const serialized = JSON.stringify(journey);

  assert.doesNotMatch(serialized, /org-horizonte|Horizonte Usinagem|14450000/);
  assert.match(serialized, /proposal-vetor-v2/);
});

test("buyer journey retains the released lot QR evidence", () => {
  const journey = buildIndustrialJourney(DEMO_SCENARIO, workspace("buyer"));

  assert.deepEqual(journey.find(({ id }) => id === "qr").evidenceIds, ["lot-stock-320"]);
});

test("non-winning supplier journey contains only its own proposal evidence", () => {
  const horizonteWorkspace = {
    id: "workspace-supplier-horizonte",
    organizationId: "org-horizonte",
    organizationName: "Horizonte Usinagem",
    organizationRole: "supplier",
  };
  const journey = buildIndustrialJourney(DEMO_SCENARIO, horizonteWorkspace);
  const serialized = JSON.stringify(journey);

  assert.match(serialized, /proposal-horizonte-v1/);
  assert.doesNotMatch(serialized, /proposal-vetor-v2|order-gear-500|lot-stock-320|lot-production-180/);
  assert.equal(journey.find(({ id }) => id === "order").status, "locked");
});

test("indicator values follow replacement scenario states and denominators", () => {
  const replacementScenario = structuredClone(DEMO_SCENARIO);
  replacementScenario.delivery.confirmedAt = "2026-09-16T12:00:00.000Z";
  replacementScenario.matchCandidates[0].invited = false;

  const buyer = buildBuyerDashboard(replacementScenario, workspace("buyer"));
  const supplier = buildSupplierDashboard(replacementScenario, workspace("supplier"));
  const administration = buildAdminDashboard(replacementScenario, workspace("administration"));

  assert.equal(buyer.metrics.find(({ id }) => id === "active-demands").value, 0);
  assert.equal(supplier.metrics.find(({ id }) => id === "released-opportunities").value, 0);
  const coverage = administration.metrics.find(({ id }) => id === "match-coverage");
  assert.equal(coverage.value, 50);
  assert.equal(coverage.display, "50%");
});
