import test from "node:test";
import assert from "node:assert/strict";
import { createDemoWorkflow } from "../fixtures/domain/demo-workflow.js";
import { DEMO_WORKSPACES } from "../fixtures/data/workspaces.js";
const buyer = DEMO_WORKSPACES[0].id, supplier = DEMO_WORKSPACES[1].id;
const input = { title: "Eixo", description: "Aço 1045", quantity: 10, requiredBy: "2099-10-01", destination: "São Paulo" };
const quote = { totalCents: 12345, freightCents: 1000, leadTimeDays: 10, manufacturer: "Vetor", payment: "30 dias", warranty: "12 meses, fabricante", technical: "Atende ao desenho", validUntil: "2099-10-01" };
function prepared() { const workflow = createDemoWorkflow(DEMO_WORKSPACES); const demand = workflow.createDemand(buyer, input); workflow.publishDemand(buyer, demand); const version = workflow.sendProposal(supplier, demand, quote); const proposal = workflow.read(buyer).proposals[0].id; return { workflow, demand, version, proposal }; }
test("drafts stay private and published demands become opportunities", () => {
  const w = createDemoWorkflow(DEMO_WORKSPACES); const id = w.createDemand(buyer, input);
  assert.equal(w.read(supplier).demands.length, 0); w.publishDemand(buyer, id); assert.equal(w.read(supplier).demands.length, 1);
  assert.throws(() => w.createDemand(supplier, input)); assert.throws(() => w.publishDemand(supplier, id));
});
test("versioned acceptance preserves terms and creates exactly one order", () => {
  const { workflow: w, demand, version, proposal } = prepared();
  const next = w.sendProposal(supplier, demand, { ...quote, totalCents: 22222 });
  assert.throws(() => w.acceptProposal(buyer, proposal, version), /mudou/);
  const order = w.acceptProposal(buyer, proposal, next);
  assert.equal(w.acceptProposal(buyer, proposal, next), order);
  assert.equal(w.read(buyer).orders.length, 1);
  assert.equal(w.read(buyer).proposals[0].versions[0].totalCents, 12345);
  assert.equal(w.read(buyer).orders[0].version.totalCents, 22222);
  assert.throws(() => w.sendProposal(supplier, demand, quote));
  const copy = w.read(buyer); copy.orders[0].version.totalCents = 0; assert.equal(w.read(buyer).orders[0].version.totalCents, 22222);
});
test("quality gates dispatch, buyer confirms delivery and evaluates only once", () => {
  const { workflow: w, version, proposal } = prepared(); const order = w.acceptProposal(buyer, proposal, version);
  assert.throws(() => w.dispatchOrder(supplier, order)); assert.throws(() => w.confirmDelivery(buyer, order)); assert.throws(() => w.evaluateOrder(buyer, order, { score: 5, comment: "Bom" }));
  w.recordInspection(supplier, order, { approved: 8, plan: "Plano v1", evidence: "2 fora da tolerância" });
  assert.throws(() => w.dispatchOrder(supplier, order));
  w.recordInspection(supplier, order, { approved: 10, plan: "Plano v1", evidence: "Reinspeção aprovada" });
  w.dispatchOrder(supplier, order); w.confirmDelivery(buyer, order); w.evaluateOrder(buyer, order, { score: 5, comment: "Conforme" });
  assert.equal(w.read(buyer).orders[0].inspections.length, 2); assert.throws(() => w.evaluateOrder(buyer, order, { score: 4, comment: "Outra" }));
  w.reset(); assert.equal(w.read(buyer).orders.length, 0);
});
test("rejects invalid quantities, dates, expired proposals and unauthorized actions", () => {
  const w = createDemoWorkflow(DEMO_WORKSPACES);
  assert.throws(() => w.createDemand(buyer, { ...input, quantity: -1 })); assert.throws(() => w.createDemand(buyer, { ...input, requiredBy: "2026-02-30" }));
  const demand = w.createDemand(buyer, input); w.publishDemand(buyer, demand);
  const version = w.sendProposal(supplier, demand, { ...quote, validUntil: "2000-01-01" });
  assert.throws(() => w.acceptProposal(buyer, w.read(buyer).proposals[0].id, version), /venceu/);
});
