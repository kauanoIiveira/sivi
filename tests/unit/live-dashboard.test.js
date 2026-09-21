import assert from "node:assert/strict";
import test from "node:test";
import { buildLiveDashboard, buildLiveJourney } from "../../src/domain/live-marketplace-selectors.js";

const workspace = { organizationRole: "buyer", organizationName: "Empresa nova" };
const empty = { demands: [], proposals: [], orders: [] };

test("a new company has an actionable empty journey without invented publication", () => {
  const journey = buildLiveJourney(workspace, empty);
  assert.equal(journey[0].status, "active");
  assert.equal(journey.find(step => step.id === "match").status, "locked");
  assert.ok(journey.every(step => step.evidenceIds.length === 0));
});

test("an unanswered proposal is awaiting decision and quality has no fabricated score", () => {
  const dashboard = buildLiveDashboard(workspace, {
    ...empty,
    proposals: [{ supplierId: "supplier", demandId: "demand", versions: [{ id: "v1", totalCents: 10000, freightCents: 500, leadTimeDays: 8 }] }],
  });
  assert.equal(dashboard.proposalSummaries[0].decisionLabel, "Aguardando decisão");
  assert.equal(dashboard.proposalSummaries[0].historicalQuality.acceptedLotsPercent, null);
});

test("supplier quantities are commitments, not an invented production plan", () => {
  const dashboard = buildLiveDashboard({ ...workspace, organizationRole: "supplier" }, {
    ...empty, orders: [{ quantity: 20, status: "accepted" }],
  });
  assert.equal(dashboard.execution.committedQuantity, 20);
  assert.equal(dashboard.execution.productionQuantity, null);
});
