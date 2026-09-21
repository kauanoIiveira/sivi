import assert from "node:assert/strict";
import test from "node:test";
import { APP_ROUTES, getRouteById, ROUTE_PATHS } from "../../src/app/routes.js";
import { evaluateRouteAccess } from "../../src/core/route-guard.js";
import { DEMO_WORKSPACES } from "../fixtures/data/workspaces.js";

const anonymous = { status: "anonymous", user: null, error: null };
const authenticated = { status: "authenticated", user: { uid: "user-1" }, error: null };
const sessionError = { status: "error", user: null, error: new Error("observer unavailable") };
const buyerWorkspace = DEMO_WORKSPACES.find(({ organizationRole }) => organizationRole === "buyer");

test("waits for auth and redirects anonymous protected access", () => {
  const route = getRouteById("buyer-home");
  assert.deepEqual(evaluateRouteAccess({ route, session: { status: "loading" }, workspace: null }), {
    kind: "wait",
    reason: "session-loading",
  });
  assert.deepEqual(evaluateRouteAccess({ route, session: anonymous, workspace: null }), {
    kind: "redirect",
    to: ROUTE_PATHS.access,
    reason: "authentication-required",
  });
  assert.deepEqual(evaluateRouteAccess({ route, session: sessionError, workspace: null }), {
    kind: "redirect",
    to: ROUTE_PATHS.access,
    reason: "authentication-required",
  });
});

test("requires a workspace and prevents cross-role navigation", () => {
  assert.equal(
    evaluateRouteAccess({ route: getRouteById("buyer-home"), session: authenticated, workspace: null }).to,
    ROUTE_PATHS.context,
  );
  assert.equal(
    evaluateRouteAccess({ route: getRouteById("supplier-home"), session: authenticated, workspace: buyerWorkspace }).to,
    ROUTE_PATHS.buyerHome,
  );
  assert.equal(
    evaluateRouteAccess({ route: getRouteById("buyer-home"), session: authenticated, workspace: buyerWorkspace }).kind,
    "allow",
  );
});

test("allows the authenticated context selection before a workspace exists", () => {
  assert.deepEqual(evaluateRouteAccess({
    route: getRouteById("context"),
    session: authenticated,
    workspace: null,
  }), {
    kind: "allow",
    reason: "context-selection",
  });
});

test("moves an authenticated access visit to context or the active home", () => {
  const access = APP_ROUTES.find(({ id }) => id === "access");
  assert.equal(evaluateRouteAccess({ route: access, session: authenticated, workspace: null }).to, ROUTE_PATHS.context);
  assert.equal(evaluateRouteAccess({ route: access, session: authenticated, workspace: buyerWorkspace }).to, ROUTE_PATHS.buyerHome);
});

test("allows public access for anonymous and session-error snapshots", () => {
  const access = getRouteById("access");
  assert.deepEqual(evaluateRouteAccess({ route: access, session: anonymous, workspace: null }), {
    kind: "allow",
    reason: "public-route",
  });
  assert.deepEqual(evaluateRouteAccess({ route: access, session: sessionError, workspace: null }), {
    kind: "allow",
    reason: "session-error",
  });
});
