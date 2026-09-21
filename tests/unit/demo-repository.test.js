import assert from "node:assert/strict";
import test from "node:test";
import { createDemoRepository } from "../fixtures/repositories/demo-repository.js";

test("returns projections and every explicit page state", async () => {
  const repository = createDemoRepository();

  assert.equal((await repository.getDashboard("workspace-buyer-alpha")).status, "ready");
  assert.equal((await repository.getIndustrialJourney("workspace-supplier-vetor")).status, "ready");
  assert.equal((await repository.getDashboard("workspace-unknown")).status, "forbidden");

  for (const mode of ["loading", "empty", "error", "forbidden", "conflict"]) {
    repository.setSimulationMode(mode);
    assert.equal((await repository.getDashboard("workspace-buyer-alpha")).status, mode);
    assert.equal((await repository.getIndustrialJourney("workspace-buyer-alpha")).status, mode);
  }

  repository.reset();
  assert.equal((await repository.getDashboard("workspace-buyer-alpha")).status, "ready");
});

test("supplier journey does not serialize competitor details", async () => {
  const repository = createDemoRepository();
  const result = await repository.getIndustrialJourney("workspace-supplier-vetor");

  assert.doesNotMatch(JSON.stringify(result.data), /org-horizonte|Horizonte Usinagem|14450000/);
});

test("rejects an invalid simulation mode without changing the ready state", async () => {
  const repository = createDemoRepository();

  await assert.rejects(repository.setSimulationMode("pending"), /Modo demonstrativo inválido: pending/);
  assert.equal((await repository.getDashboard("workspace-buyer-alpha")).status, "ready");
});

test("forbids a known workspace whose role has no role-safe projection", async () => {
  const repository = createDemoRepository({
    workspaces: [
      {
        id: "workspace-invalid-role",
        organizationId: "org-alpha",
        organizationName: "Indústrias Alpha",
        organizationRole: "auditor",
      },
    ],
  });

  assert.equal((await repository.getDashboard("workspace-invalid-role")).status, "forbidden");
  assert.equal((await repository.getIndustrialJourney("workspace-invalid-role")).status, "forbidden");
});
