import test from "node:test";
import assert from "node:assert/strict";
import { createDemoRepository } from "../fixtures/repositories/demo-repository.js";
import { APP_ROUTES } from "../../src/app/routes.js";
import { loadPageMount } from "../../src/app/page-loaders.js";
test("operations filter competing proposals and reject unknown workspaces", async () => {
  const repo = createDemoRepository();
  const buyer = await repo.getOperations("workspace-buyer-alpha");
  const supplier = await repo.getOperations("workspace-supplier-vetor");
  assert.equal(buyer.data.proposals.length, 2);
  assert.equal(supplier.data.proposals.length, 1);
  assert.equal(supplier.data.proposals[0].supplierId, "org-vetor");
  assert.equal((await repo.getOperations("unknown")).status, "forbidden");
  await repo.setSimulationMode("error");
  assert.equal((await repo.getOperations("workspace-buyer-alpha")).status, "error");
});
test("all operational and supplier profile pages have protected routes and working loaders", async () => {
  const routes = APP_ROUTES.filter((route) => route.section);
  assert.equal(routes.length, 7);
  for (const route of routes) {
    assert.equal(route.access, "authenticated");
    assert.equal(typeof await loadPageMount(route.id), "function");
  }
});
