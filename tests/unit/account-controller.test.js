import assert from "node:assert/strict";
import test from "node:test";
import { createAppController } from "../../src/app/app-controller.js";
import { createSessionStore } from "../../src/core/session-store.js";
import { APP_ROUTES, ROUTE_PATHS } from "../../src/app/routes.js";

async function editorContext(t) {
  const previousDocument = globalThis.document;
  globalThis.document = { body: { dataset: {} }, documentElement: { dataset: {} } };
  let emitUser;
  const sessionStore = createSessionStore({
    loadAuthModule: async () => ({
      observeAuthState(onUser) {
        emitUser = onUser;
        onUser({ uid: "account-1", email: "ana@sivi.test", displayName: "Ana" });
        return () => {};
      },
    }),
  });
  await sessionStore.start();
  const workspace = {
    id: "company_buyer", organizationRole: "buyer", organizationId: "company",
    organizationName: "Empresa", homeRoute: ROUTE_PATHS.buyerHome,
  };
  const route = APP_ROUTES.find(({ id }) => id === "buyer-demands");
  const outlet = new EventTarget();
  outlet.draftValue = "";
  const events = [];
  outlet.addEventListener("sivi:account-updated", (event) => events.push(event.detail));
  const state = { mounts: 0, cleanups: 0, refreshes: 0, identity: null, shellOptions: null };
  let controller;
  let finishMount;
  const mounted = new Promise((resolve) => { finishMount = resolve; });
  controller = createAppController({
    router: {
      navigate: () => {},
      refresh() {
        state.refreshes += 1;
        controller.handleRoute({ route, path: route.path });
      },
    },
    sessionStore,
    workspaceStore: {
      getCurrent: () => workspace,
      list: () => [workspace],
      subscribe(listener) { listener(); return () => {}; },
    },
    repository: {},
    surfaces: { boot: {}, auth: {}, app: {}, public: {} },
    storage: { getItem: () => null },
    reducedMotion: { matches: true },
    createShell(options) {
      state.shellOptions = options;
      return {
        outlet,
        setIdentity(identity) { state.identity = identity; },
        setNavigation() {}, setRouteMeta() {}, setBusy() {}, focusRouteTitle() {}, announce() {}, destroy() {},
      };
    },
    loadPageMount: async () => ({ container }) => {
      state.mounts += 1;
      container.draftValue = "Especificação ainda não salva";
      finishMount();
      return () => { state.cleanups += 1; container.draftValue = ""; };
    },
  });
  t.after(() => {
    controller.stop();
    sessionStore.stop();
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  });
  controller.start();
  controller.handleRoute({ route, path: route.path });
  await mounted;
  return { state, sessionStore, emitUser: (user) => emitUser(user), outlet, events, workspace };
}

test("saving an account name updates the shell and page event while preserving the open editor", async (t) => {
  const fixture = await editorContext(t);
  fixture.sessionStore.updateProfile({ uid: "account-1", email: "ana@sivi.test", displayName: "Ana Luísa" });
  assert.equal(fixture.state.refreshes, 0);
  assert.equal(fixture.state.mounts, 1);
  assert.equal(fixture.state.cleanups, 0);
  assert.equal(fixture.outlet.draftValue, "Especificação ainda não salva");
  assert.equal(fixture.state.identity.user.displayName, "Ana Luísa");
  assert.strictEqual(fixture.state.identity.workspace, fixture.workspace);
  assert.deepEqual(fixture.events, [{ user: { uid: "account-1", email: "ana@sivi.test", displayName: "Ana Luísa" } }]);
});

test("account save callback rejects another identity and a late save after sign-out", async (t) => {
  const fixture = await editorContext(t);
  assert.equal(typeof fixture.state.shellOptions.onAccountUpdated, "function");
  assert.equal(fixture.state.shellOptions.onAccountUpdated({ uid: "account-2", displayName: "Outra pessoa" }), false);
  assert.equal(fixture.state.refreshes, 0);
  assert.deepEqual(fixture.events, []);
  assert.equal(fixture.state.identity.user.displayName, "Ana");

  assert.equal(fixture.state.shellOptions.onAccountUpdated({ uid: "account-1", email: "ana@sivi.test", displayName: "Nome salvo" }), true);
  assert.equal(fixture.state.identity.user.displayName, "Nome salvo");
  fixture.emitUser(null);
  assert.equal(fixture.state.refreshes, 1, "mudanças reais de sessão continuam reavaliando a página");
  const eventCount = fixture.events.length;
  assert.equal(fixture.state.shellOptions.onAccountUpdated({ uid: "account-1", displayName: "Nome tardio" }), false);
  assert.equal(fixture.sessionStore.getSnapshot().status, "anonymous");
  assert.equal(fixture.events.length, eventCount);
  assert.equal(fixture.state.refreshes, 1);
});
