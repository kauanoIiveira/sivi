import test from "node:test";
import assert from "node:assert/strict";
import { buildNextActions, workflowLink } from "../../src/domain/next-actions.js";

const today = "2026-09-18";
test("buyer actions prioritize receipt, separate expired negotiations and skip ordered ones", () => {
  const data = {
    demands: [{ id: "draft", title: "Rascunho", status: "draft" }, { id: "open", title: "Aberta", status: "published" }, { id: "expired", status: "published" }, { id: "closed", status: "ordered" }],
    proposals: [
      { demandId: "open", versions: [{ validUntil: "2026-10-01" }] },
      { demandId: "expired", versions: [{ validUntil: "2026-10-01" }, { validUntil: "2026-09-01" }] },
      { demandId: "closed", versions: [{ validUntil: "2026-10-01" }] },
    ],
    orders: [{ id: "receipt", demandId: "closed", title: "Entrega", status: "dispatched" }, { id: "done", status: "delivered", evaluation: { score: 5 } }],
  };
  const actions = buildNextActions("buyer", data, today);
  assert.deepEqual(actions.map(a => a.kind), ["receive", "compare", "review-expired", "publish"]);
  assert.equal(actions[0].href, "#/app/comprador/pedidos?registro=receipt");
});
test("supplier sees execution and unanswered opportunities, never buyer actions", () => {
  const actions = buildNextActions("supplier", {
    demands: [{ id: "new", status: "published" }, { id: "answered", status: "published" }, { id: "closed", status: "ordered" }],
    proposals: [{ demandId: "answered", versions: [{ validUntil: "2026-10-01" }] }],
    orders: [{ id: "blocked", status: "blocked" }, { id: "released", status: "released" }, { id: "shipped", status: "dispatched" }],
  }, today);
  assert.deepEqual(actions.map(a => a.kind), ["reinspect", "dispatch", "propose"]);
});
test("empty companies and administration do not receive fictional tasks", () => {
  for (const role of ["buyer", "supplier", "administration"]) assert.deepEqual(buildNextActions(role, { demands: [], proposals: [], orders: [] }, today), []);
});
test("record links encode identifiers instead of interpreting route separators", () => {
  assert.equal(workflowLink("supplier", "proposals", "x&registro=y#"), "#/app/fornecedor/propostas?registro=x%26registro%3Dy%23");
});

test('order reminders surface approaching requested dates without duplicating execution tasks', () => {
  const data = { demands: [], proposals: [], orders: [
    { id: 'soon', title: 'Eixos', status: 'accepted', requiredBy: '2026-09-20' },
    { id: 'far', title: 'Buchas', status: 'accepted', requiredBy: '2026-10-20' },
    { id: 'done', status: 'delivered', requiredBy: '2026-09-10', evaluation: { score: 5 } },
  ] };
  const buyer = buildNextActions('buyer', data, today);
  assert.equal(buyer.length, 1);
  assert.equal(buyer[0].kind, 'follow-delivery');
  assert.match(buyer[0].reason, /Data desejada pelo comprador: 20\/09\/2026 \(em 2 dias\)/);
  assert.equal(buyer[0].href, '#/app/comprador/pedidos?registro=soon');
  const supplier = buildNextActions('supplier', data, today);
  assert.equal(supplier.length, 2);
  assert.equal(supplier[0].title, 'Eixos');
  assert.equal(supplier[0].kind, 'inspect');
});

test('only current valid proposal revisions determine urgency and expired negotiations can be reviewed', () => {
  const actions = buildNextActions('buyer', {
    demands: [{ id: 'soon', title: 'Zinco', status: 'published' }, { id: 'later', title: 'Alumínio', status: 'published' }, { id: 'expired', title: 'Barras', status: 'published' }],
    proposals: [
      { demandId: 'soon', versions: [{ validUntil: '2026-09-18' }] },
      { demandId: 'later', versions: [{ validUntil: '2026-09-18' }, { validUntil: '2026-10-20' }] },
      { demandId: 'expired', versions: [{ validUntil: '2026-09-17' }] },
    ], orders: [],
  }, today);
  assert.equal(actions[0].title, 'Zinco');
  assert.match(actions[0].reason, /vence hoje/);
  assert.equal(actions.find(action => action.title === 'Barras').kind, 'review-expired');
  assert.doesNotMatch(actions.find(action => action.title === 'Alumínio').reason, /vence hoje/);
});
