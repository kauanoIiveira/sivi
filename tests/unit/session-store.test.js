import assert from "node:assert/strict";
import test from "node:test";
import { createSessionStore } from "../../src/core/session-store.js";

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

test("starts once, resolves auth, logs out and unsubscribes", async () => {
  let emitUser;
  let logoutCalls = 0;
  let unsubscribeCalls = 0;
  let loadCalls = 0;
  const attached = deferred();
  const store = createSessionStore({
    loadAuthModule: async () => {
      loadCalls += 1;
      return {
        observeAuthState(onUser) {
          emitUser = onUser;
          attached.resolve();
          return () => { unsubscribeCalls += 1; };
        },
        logout: async () => { logoutCalls += 1; },
      };
    },
  });
  const statuses = [];
  store.subscribe((snapshot) => statuses.push(snapshot.status));
  const firstStart = store.start();
  const secondStart = store.start();
  assert.strictEqual(firstStart, secondStart);
  await attached.promise;
  emitUser({ uid: "user-1", email: "user@sivi.demo", displayName: "User Demo" });
  await firstStart;
  await store.logout();
  store.stop();

  assert.equal(store.getSnapshot().user.uid, "user-1");
  assert.deepEqual(statuses, ["loading", "authenticated"]);
  assert.equal(loadCalls, 1);
  assert.equal(logoutCalls, 1);
  assert.equal(unsubscribeCalls, 1);
});

test("represents anonymous and observer-error states explicitly", async () => {
  let emitUser;
  let emitError;
  const attached = deferred();
  const store = createSessionStore({
    loadAuthModule: async () => ({
      observeAuthState(onUser, onError) {
        emitUser = onUser;
        emitError = onError;
        attached.resolve();
        return () => {};
      },
      logout: async () => {},
    }),
  });
  const anonymousStart = store.start();
  await attached.promise;
  emitUser(null);
  await anonymousStart;
  assert.equal(store.getSnapshot().status, "anonymous");

  store.stop();
  const errorAttached = deferred();
  const errorStore = createSessionStore({
    loadAuthModule: async () => ({
      observeAuthState(_onUser, onError) {
        emitError = onError;
        errorAttached.resolve();
        return () => {};
      },
      logout: async () => {},
    }),
  });
  const errorStart = errorStore.start();
  await errorAttached.promise;
  emitError(new Error("observer unavailable"));
  await errorStart;
  assert.equal(errorStore.getSnapshot().status, "error");
  assert.match(errorStore.getSnapshot().error.message, /observer unavailable/);
});

test("does not attach an observer after stop during module loading", async () => {
  const loader = deferred();
  let observerCalls = 0;
  const store = createSessionStore({ loadAuthModule: () => loader.promise });
  const started = store.start();
  store.stop();
  loader.resolve({
    observeAuthState() {
      observerCalls += 1;
      return () => {};
    },
    logout: async () => {},
  });
  await started;
  assert.equal(observerCalls, 0);
});

test("settles the initial start when stopped after observer attachment", async () => {
  const attached = deferred();
  let unsubscribeCalls = 0;
  const store = createSessionStore({
    loadAuthModule: async () => ({
      observeAuthState() {
        attached.resolve();
        return () => { unsubscribeCalls += 1; };
      },
      logout: async () => {},
    }),
  });
  const started = store.start();
  await attached.promise;
  store.stop();

  const outcome = await Promise.race([
    started.then(() => "settled"),
    new Promise((resolve) => setTimeout(() => resolve("timed out"), 20)),
  ]);
  assert.equal(outcome, "settled");
  assert.equal(unsubscribeCalls, 1);
});

test("isolates listener errors while resolving user and observer-error starts", async () => {
  const userAttached = deferred();
  let emitUser;
  const userStatuses = [];
  const userStore = createSessionStore({
    loadAuthModule: async () => ({
      observeAuthState(onUser) {
        emitUser = onUser;
        userAttached.resolve();
        return () => {};
      },
      logout: async () => {},
    }),
  });
  userStore.subscribe((snapshot) => {
    if (snapshot.status !== "loading") throw new Error("listener failed");
  });
  userStore.subscribe((snapshot) => userStatuses.push(snapshot.status));
  const userStart = userStore.start();
  await userAttached.promise;
  assert.doesNotThrow(() => emitUser({ uid: "user-1" }));
  assert.equal(await Promise.race([
    userStart.then(() => "settled"),
    new Promise((resolve) => setTimeout(() => resolve("timed out"), 20)),
  ]), "settled");
  assert.deepEqual(userStatuses, ["loading", "authenticated"]);

  const errorAttached = deferred();
  let emitError;
  const errorStore = createSessionStore({
    loadAuthModule: async () => ({
      observeAuthState(_onUser, onError) {
        emitError = onError;
        errorAttached.resolve();
        return () => {};
      },
      logout: async () => {},
    }),
  });
  errorStore.subscribe((snapshot) => {
    if (snapshot.status !== "loading") throw new Error("listener failed");
  });
  const errorStart = errorStore.start();
  await errorAttached.promise;
  assert.doesNotThrow(() => emitError(new Error("observer unavailable")));
  assert.equal(await Promise.race([
    errorStart.then(() => "settled"),
    new Promise((resolve) => setTimeout(() => resolve("timed out"), 20)),
  ]), "settled");
  assert.equal(errorStore.getSnapshot().status, "error");
});
