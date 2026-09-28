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

export function createHashRouter({ windowObject, routes, onRoute, onNotFound, beforeNavigate = () => true }) {
  let started = false;
  let lastHash = null;

  const dispatch = (event) => {
    const nextHash = windowObject.location.hash;
    if (!event?.force && lastHash !== null && (event || nextHash !== lastHash) && !beforeNavigate()) {
      windowObject.history.replaceState(null, '', `${windowObject.location.pathname}${windowObject.location.search}${lastHash}`);
      return;
    }
    lastHash = nextHash;
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
      lastHash = null;
      windowObject.removeEventListener("hashchange", dispatch);
    },
    navigate(path, { replace = false, force = false } = {}) {
      const query = String(path).includes('?') ? `?${String(path).split('?').slice(1).join('?')}` : '';
      const nextHash = `#${normalizeRoutePath(path)}${query}`;
      if (replace || force) {
        windowObject.history[replace ? 'replaceState' : 'pushState'](
          null,
          "",
          `${windowObject.location.pathname}${windowObject.location.search}${nextHash}`,
        );
        dispatch({ type: 'navigate', force });
        return;
      }
      if (windowObject.location.hash === nextHash) dispatch({ type: 'navigate' });
      else windowObject.location.hash = nextHash;
    },
    refresh: dispatch,
  };
}
