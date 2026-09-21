export function normalizeRoutePath(value) {
  const withoutHash = String(value ?? "").replace(/^#/, "");
  const withoutQuery = withoutHash.split("?")[0] || "/";
  const withSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
}

export function matchRoute(path, routes) {
  const normalized = normalizeRoutePath(path);
  return routes.find((route) => route.path === normalized) ?? null;
}

export function createHashRouter({ windowObject, routes, onRoute, onNotFound }) {
  let started = false;

  const dispatch = () => {
    const path = normalizeRoutePath(windowObject.location.hash);
    const route = matchRoute(path, routes);
    if (route) onRoute({ path, route });
    else onNotFound({ path });
  };

  return {
    start() {
      if (started) return;
      started = true;
      windowObject.addEventListener("hashchange", dispatch);
      if (!windowObject.location.hash) {
        windowObject.history.replaceState(
          null,
          "",
          `${windowObject.location.pathname}${windowObject.location.search}#${normalizeRoutePath("")}`,
        );
      }
      dispatch();
    },
    stop() {
      if (!started) return;
      started = false;
      windowObject.removeEventListener("hashchange", dispatch);
    },
    navigate(path, { replace = false } = {}) {
      const nextHash = `#${normalizeRoutePath(path)}`;
      if (replace) {
        windowObject.history.replaceState(
          null,
          "",
          `${windowObject.location.pathname}${windowObject.location.search}${nextHash}`,
        );
        dispatch();
        return;
      }
      if (windowObject.location.hash === nextHash) dispatch();
      else windowObject.location.hash = nextHash;
    },
    refresh: dispatch,
  };
}
