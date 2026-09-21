import test from "node:test";
import assert from "node:assert/strict";
import { buildNextActions, workflowLink } from "../../src/domain/next-actions.js";

const today = "2026-09-18";
test("buyer actions prioritize receipt and skip expired or already ordered negotiations", () => {
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
  assert.deepEqual(actions.map(a => a.kind), ["receive", "compare", "publish"]);
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
