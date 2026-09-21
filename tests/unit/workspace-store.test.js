import assert from "node:assert/strict";
import test from "node:test";
import { createWorkspaceStore } from "../../src/core/workspace-store.js";
import { DEMO_WORKSPACES } from "../fixtures/data/workspaces.js";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test("persists only a known explicit workspace tuple", () => {
  const storage = memoryStorage();
  const store = createWorkspaceStore({ storage, workspaces: DEMO_WORKSPACES });
  const selected = store.select("workspace-supplier-vetor");
  assert.equal(selected.organizationId, "org-vetor");
  assert.equal(selected.organizationRole, "supplier");
  assert.equal(store.getCurrent().id, selected.id);
  assert.throws(() => store.select("workspace-unknown"), /Contexto inválido/);
  store.clear();
  assert.equal(store.getCurrent(), null);
});

test("restores only a known stored workspace and keeps list snapshots separate", () => {
  const restored = createWorkspaceStore({
    storage: memoryStorage({ "sivi.workspace.v1": "workspace-admin-sivi" }),
    workspaces: DEMO_WORKSPACES,
  });
  assert.equal(restored.getCurrent().organizationRole, "administration");

  const unknown = createWorkspaceStore({
    storage: memoryStorage({ "sivi.workspace.v1": "workspace-unknown" }),
    workspaces: DEMO_WORKSPACES,
  });
  assert.equal(unknown.getCurrent(), null);

  const first = restored.list();
  const second = restored.list();
  assert.notStrictEqual(first, second);
  assert.strictEqual(first[0], DEMO_WORKSPACES[0]);
});

test("keeps the selected workspace in memory when sessionStorage is blocked", () => {
  const blocked = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
    removeItem() { throw new Error("blocked"); },
  };
  const store = createWorkspaceStore({ storage: blocked, workspaces: DEMO_WORKSPACES });
  assert.doesNotThrow(() => store.select("workspace-buyer-alpha"));
  assert.equal(store.getCurrent().organizationRole, "buyer");
  assert.doesNotThrow(() => store.clear());
  assert.equal(store.getCurrent(), null);
});

test("publishes selection and clearing, and supports unsubscribing", () => {
  const store = createWorkspaceStore({ storage: memoryStorage(), workspaces: DEMO_WORKSPACES });
  const received = [];
  const unsubscribe = store.subscribe((current) => received.push(current?.id ?? null));
  store.select("workspace-buyer-alpha");
  store.clear();
  unsubscribe();
  store.select("workspace-admin-sivi");
  assert.deepEqual(received, [null, "workspace-buyer-alpha", null]);
});

test("defines immutable local demo workspace tuples", () => {
  assert.equal(DEMO_WORKSPACES.length, 3);
  assert.ok(Object.isFrozen(DEMO_WORKSPACES));
  for (const demoWorkspace of DEMO_WORKSPACES) {
    assert.ok(Object.isFrozen(demoWorkspace));
    assert.ok(Object.isFrozen(demoWorkspace.userRoles));
    assert.ok(Object.isFrozen(demoWorkspace.permissions));
  }
  assert.throws(() => DEMO_WORKSPACES[0].permissions.push("users:write"), TypeError);
});

test("replaces Firebase workspaces and keeps only a still-authorized selection", () => {
  const storage = memoryStorage();
  const store = createWorkspaceStore({ storage, workspaces: [] });
  const buyer = { ...DEMO_WORKSPACES[0], id: "workspace-real-buyer" };
  const supplier = { ...DEMO_WORKSPACES[1], id: "workspace-real-supplier" };

  store.replace([buyer, supplier]);
  store.select(buyer.id);
  store.replace([buyer]);
  assert.equal(store.getCurrent().id, buyer.id);

  store.replace([supplier]);
  assert.equal(store.getCurrent(), null);
  assert.deepEqual(store.list().map(({ id }) => id), [supplier.id]);
});

test("rejects duplicate workspace ids received from the backend", () => {
  const store = createWorkspaceStore({ storage: memoryStorage(), workspaces: [] });
  const workspace = { ...DEMO_WORKSPACES[0], id: "duplicated" };
  assert.throws(() => store.replace([workspace, { ...workspace }]), /duplicado/);
  assert.deepEqual(store.list(), []);
});

test("restores a persisted selection after Firebase memberships finish loading", () => {
  const storage = memoryStorage();
  storage.setItem("sivi.workspace.v1", DEMO_WORKSPACES[1].id);
  const store = createWorkspaceStore({ storage, key: "sivi.workspace.v1", workspaces: [] });

  store.replace(DEMO_WORKSPACES);

  assert.equal(store.getCurrent()?.id, DEMO_WORKSPACES[1].id);
});

test("replaces memberships and selects a newly created company atomically", () => {
  const storage = memoryStorage();
  const store = createWorkspaceStore({ storage, key: "sivi.workspace.v1", workspaces: [] });

  store.replace(DEMO_WORKSPACES, DEMO_WORKSPACES[0].id);

  assert.equal(store.getCurrent()?.id, DEMO_WORKSPACES[0].id);
  assert.equal(storage.getItem("sivi.workspace.v1"), DEMO_WORKSPACES[0].id);
});

test("unchanged memberships do not remount a form being filled", () => {
  const store = createWorkspaceStore({ storage: memoryStorage(), workspaces: [] });
  let calls = 0;
  store.subscribe(() => calls++);
  store.replace([]);
  assert.equal(calls, 1);
  store.replace(DEMO_WORKSPACES);
  assert.equal(calls, 2);
  store.replace(structuredClone(DEMO_WORKSPACES));
  assert.equal(calls, 2);
});
