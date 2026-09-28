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
    proposals: [{ supplierId: "supplier", demandId: "demand", versions: [{ id: "v1", totalCents: 10000, freightCents: 500, leadTimeDays: 8, validUntil: '2099-12-31' }] }],
  });
  assert.equal(dashboard.proposalSummaries[0].decisionLabel, "Aguardando decisão");
  assert.equal(dashboard.proposalSummaries[0].historicalQuality.acceptedLotsPercent, null);
});

test("supplier commitments count orders without adding unlike units", () => {
  const dashboard = buildLiveDashboard({ ...workspace, organizationRole: "supplier" }, {
    ...empty, orders: [{ quantity: 20, status: "accepted" }],
  });
  assert.equal(dashboard.metrics.find(item => item.id === 'active-orders').value, 1);
  assert.equal(dashboard.execution.orders.length, 1);
  assert.equal(dashboard.execution.productionQuantity, null);
});

test('proposal summaries identify the demand and distinguish an expired offer', () => {
  const dashboard = buildLiveDashboard(workspace, { ...empty,
    demands: [{ id: 'd1', title: 'Tubos para manutenção', status: 'published' }],
    proposals: [{ id: 'p1', supplierId: 's1', demandId: 'd1', versions: [{ id: 'v1', totalCents: 100, freightCents: 0, validUntil: '2000-01-01' }] }],
  });
  assert.equal(dashboard.proposalSummaries[0].demandTitle, 'Tubos para manutenção');
  assert.equal(dashboard.proposalSummaries[0].decisionLabel, 'Proposta vencida');
  assert.match(dashboard.proposalSummaries[0].href, /registro=d1$/);
});

test('the live journey follows an active order instead of a newer unfinished draft', () => {
  const journey = buildLiveJourney(workspace, { ...empty,
    demands: [{ id: 'new', title: 'Rascunho mais novo', status: 'draft', updatedAt: 99 }, { id: 'd1', title: 'Tubos', status: 'ordered', quantity: 20, items: [{ quantity: 20, unit: 'm' }], updatedAt: 10 }],
    orders: [{ id: 'o1', demandId: 'd1', title: 'Tubos', quantity: 20, status: 'blocked', updatedAt: 20, inspections: [] }],
  });
  assert.match(journey[0].summary, /20 m.*Tubos/);
  assert.equal(journey.find(step => step.id === 'quality').status, 'attention');
  assert.ok(!journey.some(step => step.id === 'qr'));
});

test('an order can anchor the journey when its source demand is absent', () => {
  const journey = buildLiveJourney(workspace, { ...empty, orders: [{ id: 'o1', demandId: 'archived', title: 'Compra anterior', quantity: 1, status: 'dispatched' }] });
  assert.match(journey[0].summary, /Compra anterior/);
  assert.equal(journey.find(step => step.id === 'order').status, 'completed');
});

test('accepted proposal summaries use the frozen order terms', () => {
  const version = { id: 'accepted', totalCents: 100, freightCents: 20, leadTimeDays: 3 };
  const dashboard = buildLiveDashboard(workspace, { ...empty,
    proposals: [{ id: 'p1', supplierId: 's1', demandId: 'd1', versions: [{ ...version, id: 'newer', totalCents: 999 }] }],
    orders: [{ id: 'o1', sourceProposalId: 'p1', demandId: 'd1', version, status: 'accepted' }],
  });
  assert.equal(dashboard.proposalSummaries[0].accepted, true);
  assert.equal(dashboard.proposalSummaries[0].latestTotalCents, 120);
});
