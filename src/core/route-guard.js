import { ROUTE_PATHS } from "../app/routes.js";

const redirect = (to, reason) => ({ kind: "redirect", to, reason });

export function evaluateRouteAccess({ route, session, workspace }) {
  if (route.id === 'public-home') return { kind: 'allow', reason: 'public-home' };
  if (session.status === "loading") return { kind: "wait", reason: "session-loading" };

  if (route.access === "public") {
    if (session.status === "authenticated") {
      return redirect(workspace?.homeRoute ?? ROUTE_PATHS.context, "already-authenticated");
    }
    return { kind: "allow", reason: session.status === "error" ? "session-error" : "public-route" };
  }

  if (session.status !== "authenticated") {
    return redirect(ROUTE_PATHS.access, "authentication-required");
  }

  if (route.path === ROUTE_PATHS.context) return { kind: "allow", reason: "context-selection" };
  if (!workspace) return redirect(ROUTE_PATHS.context, "workspace-required");
  if (route.workspaceRole !== workspace.organizationRole) {
    return redirect(workspace.homeRoute, "workspace-role-mismatch");
  }
  return { kind: "allow", reason: "authorized-workspace" };
}
