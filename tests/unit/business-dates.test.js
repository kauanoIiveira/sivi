import test from "node:test";
import assert from "node:assert/strict";
import * as calendar from "../../src/domain/calendar-date.js";
import { buildNextActions } from "../../src/domain/next-actions.js";
import { createFirebaseMarketplaceRepository } from "../../src/repositories/firebase-marketplace-repository.js";

function context(validUntil = "2026-09-26") {
  const workspaces = {
    buyer: { id: "buyer", organizationId: "alpha", organizationName: "Alpha", organizationRole: "buyer", memberUid: "owner", canEnter: true },
    supplier: { id: "supplier", organizationId: "beta", organizationName: "Beta", organizationRole: "supplier", memberUid: "owner", canEnter: true },
  };
  const demand = { id: "demand", buyerId: "alpha", buyerName: "Alpha", title: "Engrenagens", description: "Conforme desenho", items: [{ id: "item-1", description: "Engrenagem", category: "usinados", material: "aço", process: "usinagem", quantity: 10, unit: "un" }], quantity: 10, requiredBy: "2026-10-20", destination: "Campinas", region: "SP", status: "published", createdAt: 1, updatedAt: 2 };
  const version = { id: "version", revision: 1, totalCents: 10000, freightCents: 0, leadTimeDays: 10, manufacturer: "Beta", payment: "28 dias", warranty: "12 meses", technical: "Conforme desenho", validUntil, createdAt: 3 };
  const proposal = { id: "demand_beta", demandId: demand.id, buyerId: "alpha", buyerName: "Alpha", supplierId: "beta", supplierName: "Beta", versions: { version }, updatedAt: 3 };
  const root = {
    demandsByBuyer: { alpha: { demand } },
    opportunitiesBySupplier: { beta: { demand: { ...demand, match: { eligible: true } } } },
    proposalsByBuyer: { alpha: { demand_beta: proposal } },
    proposalsBySupplier: { beta: { demand_beta: structuredClone(proposal) } },
  };
  const client = {
    read: async path => structuredClone(path.split("/").reduce((value, key) => value?.[key], root) ?? null),
    newKey: () => "new-version",
    patch: async updates => {
      for (const [path, value] of Object.entries(updates)) {
        const keys = path.split("/");
        const leaf = keys.pop();
        const parent = keys.reduce((value, key) => value[key] ??= {}, root);
        parent[leaf] = structuredClone(value);
      }
    },
  };
  const repository = createFirebaseMarketplaceRepository({ client, getUser: () => ({ uid: "owner" }), getWorkspace: id => workspaces[id] });
  return { repository, root, demand, version, proposal };
}

test("a proposal remains actionable until the end of its validity day in Sao Paulo", t => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-27T02:59:59.999Z") });
  const { demand, version, proposal } = context();
  const data = { demands: [demand], proposals: [{ ...proposal, versions: [version] }], orders: [] };
  assert.deepEqual(buildNextActions("buyer", data).map(action => action.kind), ["compare"]);
  assert.deepEqual(buildNextActions("supplier", data), []);
});

test("accepting a proposal late in the Sao Paulo evening persists the order", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-27T02:59:59.999Z") });
  const { repository, root } = context();
  const id = await repository.workflow.acceptProposal("buyer", "demand_beta", "version");
  assert.equal(root.ordersByBuyer.alpha[id].status, "accepted");
  assert.equal(root.ordersBySupplier.beta[id].version.validUntil, "2026-09-26");
});

test("proposal expiry begins at midnight in Sao Paulo for actions and acceptance", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-27T03:00:00.000Z") });
  const { repository, root, demand, version, proposal } = context();
  const data = { demands: [demand], proposals: [{ ...proposal, versions: [version] }], orders: [] };
  assert.deepEqual(buildNextActions("buyer", data).map(action => action.kind), ['review-expired']);
  assert.deepEqual(buildNextActions("supplier", data).map(action => action.kind), ["revise"]);
  await assert.rejects(repository.workflow.acceptProposal("buyer", "demand_beta", "version"), /venceu/i);
  assert.equal(root.ordersByBuyer, undefined);
});

test("suppliers cannot send a proposal whose validity day has ended", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-27T03:00:00.000Z") });
  const { repository, root, version } = context();
  await assert.rejects(repository.workflow.sendProposal("supplier", "demand", version), /validade.*hoje|data.*hoje/i);
  assert.deepEqual(Object.keys(root.proposalsByBuyer.alpha.demand_beta.versions), ["version"]);
});

test("a proposal can be sent on its last valid day in Sao Paulo", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-27T02:59:59.999Z") });
  const { repository, root, version } = context();
  await repository.workflow.sendProposal("supplier", "demand", version);
  assert.equal(root.proposalsByBuyer.alpha.demand_beta.versions["new-version"].validUntil, "2026-09-26");
});

test("a malformed stored validity cannot be accepted or offered as an actionable proposal", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-26T15:00:00Z") });
  const { repository, root, demand, version, proposal } = context("2099-99-99");
  const data = { demands: [demand], proposals: [{ ...proposal, versions: [version] }], orders: [] };
  assert.deepEqual(buildNextActions("buyer", data), []);
  await assert.rejects(repository.workflow.acceptProposal("buyer", "demand_beta", "version"), /data válida|validade/i);
  assert.equal(root.ordersByBuyer, undefined);
});

test("business dates use Sao Paulo regardless of UTC day and across year boundaries", () => {
  assert.equal(typeof calendar.todayInSaoPaulo, "function");
  assert.equal(calendar.todayInSaoPaulo(new Date("2027-01-01T02:59:59.999Z")), "2026-12-31");
  assert.equal(calendar.todayInSaoPaulo(new Date("2027-01-01T03:00:00.000Z")), "2027-01-01");
});
