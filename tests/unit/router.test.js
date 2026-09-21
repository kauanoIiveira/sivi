import assert from "node:assert/strict";
import test from "node:test";
import { APP_ROUTES, ROUTE_PATHS } from "../../src/app/routes.js";
import { createHashRouter, matchRoute, normalizeRoutePath } from "../../src/core/router.js";

class FakeWindow extends EventTarget {
  constructor(hash = "") {
    super();
    this.location = { hash, pathname: "/", search: "?authEmulator=1" };
    this.history = {
      replaceState: (_state, _title, url) => {
        this.location.hash = new URL(url, "http://127.0.0.1").hash;
      },
    };
  }
}

test("normalizes and matches only canonical SIVI routes", () => {
  assert.equal(normalizeRoutePath("#/app/comprador/inicio/"), ROUTE_PATHS.buyerHome);
  assert.equal(matchRoute(ROUTE_PATHS.supplierHome, APP_ROUTES).id, "supplier-home");
  assert.equal(matchRoute("/app/inexistente", APP_ROUTES), null);
});

test("canonicalizes an empty hash to the public home", () => {
  const fakeWindow = new FakeWindow("");
  const router = createHashRouter({
    windowObject: fakeWindow,
    routes: APP_ROUTES,
    onRoute: () => {},
    onNotFound: () => {},
  });
  router.start();
  assert.equal(fakeWindow.location.hash, "#/");
});

test("starts, navigates, replaces and stops without losing the query string", () => {
  const fakeWindow = new FakeWindow("#/acesso");
  const visited = [];
  const router = createHashRouter({
    windowObject: fakeWindow,
    routes: APP_ROUTES,
    onRoute: ({ route }) => visited.push(route.id),
    onNotFound: ({ path }) => visited.push(`404:${path}`),
  });

  router.start();
  router.navigate(ROUTE_PATHS.context, { replace: true });
  router.navigate("/app/inexistente");
  fakeWindow.dispatchEvent(new Event("hashchange"));
  router.stop();

  assert.deepEqual(visited, ["access", "context", "404:/app/inexistente"]);
  assert.equal(fakeWindow.location.search, "?authEmulator=1");
});
