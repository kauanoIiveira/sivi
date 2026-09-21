import assert from "node:assert/strict";
import test from "node:test";

const expectedMountNames = Object.freeze({
  context: "mountContextPage",
  "buyer-home": "mountBuyerDashboardPage",
  "supplier-home": "mountSupplierDashboardPage",
  "admin-home": "mountAdminDashboardPage",
});

test("lazy-loads only the four registered application page mounts", async () => {
  let loadPageMount;
  try {
    ({ loadPageMount } = await import("../../src/app/page-loaders.js"));
  } catch {
    assert.fail("the application page loader module must exist");
  }
  for (const [routeId, functionName] of Object.entries(expectedMountNames)) {
    const mount = await loadPageMount(routeId);
    assert.equal(mount.name, functionName);
  }
  await assert.rejects(loadPageMount("access"), /Carregador de página ausente: access/);
  await assert.rejects(loadPageMount("unknown"), /Carregador de página ausente: unknown/);
});
