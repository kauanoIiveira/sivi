import { APP_ROUTES, ROUTE_PATHS } from "./routes.js";
import { evaluateRouteAccess } from "../core/route-guard.js";
import { matchRoute } from "../core/router.js";
import { renderPageState } from "../components/page-state/page-state.js";
import { createAppShell } from "../layouts/app-shell/app-shell.js";
import { mountNotFoundPage } from "../pages/not-found/not-found-page.js";

const RETURN_TO_KEY = "sivi.return-to.v1";

function navigationFor(workspace, currentPath) {
  const items = [{ id: "context", label: "Empresas e atuação", path: ROUTE_PATHS.context }];
  if (workspace) {
    items.push(...APP_ROUTES.filter((route) => route.section && route.workspaceRole === workspace.organizationRole).map((route) => ({ id: route.id, label: route.title, path: route.path })));
    const labels = {
      buyer: "Visão do comprador",
      supplier: "Visão do fornecedor",
      administration: "Visão administrativa",
    };
    items.unshift({
      id: `${workspace.organizationRole}-home`,
      label: labels[workspace.organizationRole],
      path: workspace.homeRoute,
    });
  }
  return items.map((item) => ({ ...item, current: item.path === currentPath }));
}

function canonicalProtectedRoute(path) {
  if (typeof path !== "string") return null;
  const route = matchRoute(path, APP_ROUTES);
  return route?.access === "authenticated" && route.path === path ? route : null;
}

export function createAppController({
  router,
  sessionStore,
  workspaceStore,
  repository,
  loadAuthSurface,
  loadPageMount,
  surfaces,
  storage,
  reducedMotion,
  createOrganization,
  administration = null,
  supplierProfiles = null,
  onboarding = null,
  canLeavePage = () => true,
}) {
  let currentRoute = null;
  let currentPath = ROUTE_PATHS.access;
  let pageCleanup = () => {};
  let authCleanup = () => {};
  let shell = null;
  let renderRevision = 0;
  let unsubscribeSession = () => {};
  let unsubscribeWorkspace = () => {};
  let started = false;
  let retryInFlight = false;
  let workspaceNavigationDepth = 0;

  const isActive = (revision) => started && revision === renderRevision;
  const readReturnTo = () => {
    try { return storage.getItem(RETURN_TO_KEY); } catch { return null; }
  };
  const writeReturnTo = (path) => {
    if (!canonicalProtectedRoute(path)) return;
    try { storage.setItem(RETURN_TO_KEY, path); } catch { /* A navegação continua sem retomada persistida. */ }
  };
  const clearReturnTo = () => {
    try { storage.removeItem(RETURN_TO_KEY); } catch { /* Não há estado persistido a limpar. */ }
  };

  const showSurface = (name) => {
    if (!started) return;
    surfaces.boot.hidden = name !== "boot";
    surfaces.auth.hidden = name !== "auth";
    surfaces.app.hidden = name !== "app";
    if (surfaces.public) surfaces.public.hidden = name !== 'public';
    document.body.dataset.surface = name;
  };

  const clearPage = () => {
    const cleanup = pageCleanup;
    pageCleanup = () => {};
    try { cleanup(); } catch { /* O próximo estado ainda deve poder ser montado. */ }
  };

  const clearAuth = () => {
    const cleanup = authCleanup;
    authCleanup = () => {};
    try { cleanup(); } catch { /* O próximo estado ainda deve poder ser montado. */ }
  };

  const ensureShell = () => {
    if (shell) return shell;
    shell = createAppShell({
      root: surfaces.app,
      onNavigate: (path) => router.navigate(path),
      onChangeContext: () => router.navigate(ROUTE_PATHS.context),
      onLogout: () => { void logout(); },
    });
    return shell;
  };

  const animateRoute = (activeShell) => {
    if (reducedMotion.matches || globalThis.document?.documentElement?.dataset.motion === 'reduce' || typeof activeShell.outlet.animate !== "function") return () => {};
    const animation = activeShell.outlet.animate(
      [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 220, easing: "cubic-bezier(.22, 1, .36, 1)" },
    );
    return () => animation.cancel();
  };

  const requestRetry = () => {
    if (!started || retryInFlight) return;
    retryInFlight = true;
    Promise.resolve()
      .then(() => router.refresh())
      .catch(() => {})
      .finally(() => { retryInFlight = false; });
  };

  const navigateToWorkspace = (selected, options) => {
    const pendingRoute = canonicalProtectedRoute(readReturnTo());
    clearReturnTo();
    const destination = pendingRoute?.workspaceRole === selected.organizationRole
      ? pendingRoute.path
      : selected.homeRoute;
    router.navigate(destination, options);
  };

  const withoutWorkspaceRefresh = (mutation) => {
    workspaceNavigationDepth += 1;
    try {
      return mutation();
    } finally {
      workspaceNavigationDepth -= 1;
    }
  };

  const selectWorkspace = (workspaceId) => {
    if (!started || !canLeavePage()) return;
    let selected;
    try {
      selected = withoutWorkspaceRefresh(() => workspaceStore.select(workspaceId));
    } catch {
      return;
    }
    navigateToWorkspace(selected);
  };

  const createAndSelectOrganization = async (input) => {
    const result = await createOrganization(input);
    const nextWorkspaces = Array.isArray(result?.workspaces)
      ? result.workspaces
      : result?.id
        ? [...workspaceStore.list().filter((workspace) => workspace.id !== result.id), result]
        : null;
    if (!Array.isArray(nextWorkspaces) || nextWorkspaces.length === 0) {
      throw new Error("A empresa foi criada sem contextos válidos.");
    }
    const preferred = nextWorkspaces.find((workspace) =>
      workspace.canEnter !== false
      && (!result?.organizationId || workspace.organizationId === result.organizationId)) ?? null;
    const selected = withoutWorkspaceRefresh(() => {
      if (result?.organizationId && !preferred) workspaceStore.clear();
      workspaceStore.replace(nextWorkspaces, preferred?.id ?? null);
      return workspaceStore.getCurrent();
    });
    if (selected) navigateToWorkspace(selected, { force: true });
    else router.navigate(ROUTE_PATHS.context, { replace: true, force: true });
  };

  const logout = async () => {
    if (!started || !canLeavePage()) return;
    clearReturnTo();
    try {
      await sessionStore.logout();
    } catch (error) {
      console.warn("A sessão não pôde ser encerrada.", error);
    }
    try { workspaceStore.clear(); } catch { /* A limpeza em memória é responsabilidade da store. */ }
    try { await repository.reset?.(); } catch (error) { console.warn("O estado local não pôde ser limpo.", error); }
    clearReturnTo();
    if (started) router.navigate(ROUTE_PATHS.access, { replace: true });
  };

  const renderAllowedAppRoute = async (route, path, revision) => {
    showSurface("app");
    const activeShell = ensureShell();
    const session = sessionStore.getSnapshot();
    const workspace = workspaceStore.getCurrent();
    activeShell.setIdentity({ user: session.user, workspace });
    activeShell.setNavigation(navigationFor(workspace, path));
    activeShell.setRouteMeta({ title: route.title, breadcrumbs: ["SIVI", route.title] });
    activeShell.setBusy(true);
    clearPage();

    try {
      const mount = await loadPageMount(route.id);
      if (!isActive(revision)) return;
      const onPageReady = () => {
        if (!isActive(revision) || shell !== activeShell) return;
        activeShell.focusRouteTitle();
        activeShell.announce(`${route.title} carregada`);
      };
      const cleanup = route.id === "context"
        ? mount({ container: activeShell.outlet, workspaces: workspaceStore.list(), onSelect: selectWorkspace, onCreate: createAndSelectOrganization, onboarding })
        : mount({ container: activeShell.outlet, workspace, repository, administration, supplierProfiles, onReady: onPageReady });
      if (!isActive(revision)) {
        try { cleanup?.(); } catch { /* A montagem tardia não pode sobreviver à revisão atual. */ }
        return;
      }
      const cancelAnimation = animateRoute(activeShell);
      pageCleanup = () => {
        cancelAnimation();
        try { cleanup?.(); } catch { /* Cleanup de página é isolado. */ }
      };
      if (route.id === "context") onPageReady();
    } catch (error) {
      if (!isActive(revision)) return;
      console.warn(`Falha ao carregar ${path}.`, error);
      pageCleanup = renderPageState(activeShell.outlet, { status: "error", onRetry: requestRetry });
      activeShell.announce("A página não pôde ser carregada");
    } finally {
      if (isActive(revision) && shell === activeShell) activeShell.setBusy(false);
    }
  };

  const renderRoute = async (route, path, revision) => {
    const session = sessionStore.getSnapshot();
    const workspace = workspaceStore.getCurrent();
    const decision = evaluateRouteAccess({ route, session, workspace });
    if (!isActive(revision)) return;

    if (decision.kind === "wait") {
      clearAuth();
      showSurface("boot");
      return;
    }
    if (decision.kind === "redirect") {
      if (decision.reason === "authentication-required") writeReturnTo(path);
      if (decision.reason === "workspace-required") writeReturnTo(path);
      router.navigate(decision.to, { replace: true });
      return;
    }
    if (route.surface === 'public') {
      clearPage(); clearAuth();
      if (shell) { shell.destroy(); shell = null; }
      showSurface('public');
      document.title = route.title;
      try {
        const mount = await loadPageMount(route.id);
        if (!isActive(revision)) return;
        pageCleanup = mount({ container: surfaces.public });
      } catch {
        if (isActive(revision)) surfaces.public.innerHTML = '<p>Não foi possível abrir a página. <a href="#/acesso">Entrar no SIVI</a></p>';
      }
      return;
    }
    if (route.surface === "auth") {
      clearPage();
      clearAuth();
      if (shell) {
        shell.destroy();
        shell = null;
      }
      showSurface("auth");
      document.title = "Acesso — SIVI";
      try {
        const mount = await loadAuthSurface();
        if (!isActive(revision)) return;
        const cleanup = mount({ root: surfaces.auth });
        if (!isActive(revision)) {
          try { cleanup?.(); } catch { /* Uma montagem tardia deve ser descartada. */ }
          return;
        }
        authCleanup = typeof cleanup === "function" ? cleanup : () => {};
        surfaces.auth.querySelector(".form-view.is-active h1")?.focus({ preventScroll: true });
      } catch (error) {
        if (!isActive(revision)) return;
        console.warn("A superfície de acesso não pôde ser carregada.", error);
        const retry = document.createElement("button");
        retry.type = "button";
        retry.dataset.authRetry = "true";
        retry.textContent = "Tentar carregar o acesso novamente";
        const retryAuthLoad = () => {
          clearAuth();
          const nextRevision = ++renderRevision;
          void renderRoute(route, path, nextRevision);
        };
        retry.addEventListener("click", retryAuthLoad, { once: true });
        authCleanup = () => {
          retry.removeEventListener("click", retryAuthLoad);
          retry.remove();
        };
        surfaces.auth.append(retry);
      }
      return;
    }
    clearAuth();
    await renderAllowedAppRoute(route, path, revision);
  };

  const refreshForStoreChange = (skipInitial) => {
    let initial = true;
    return () => {
      if (!started || (skipInitial && initial)) {
        initial = false;
        return;
      }
      initial = false;
      router.refresh();
    };
  };

  const refreshForWorkspaceChange = () => {
    let initial = true;
    return () => {
      if (!started || initial) {
        initial = false;
        return;
      }
      if (workspaceNavigationDepth > 0) return;
      const selected = workspaceStore.getCurrent();
      const pendingRoute = canonicalProtectedRoute(readReturnTo());
      if (selected && pendingRoute?.workspaceRole === selected.organizationRole) {
        clearReturnTo();
        router.navigate(pendingRoute.path, { replace: true });
        return;
      }
      router.refresh();
    };
  };

  return {
    start() {
      if (started) return;
      started = true;
      unsubscribeSession = sessionStore.subscribe(refreshForStoreChange(true));
      unsubscribeWorkspace = workspaceStore.subscribe(refreshForWorkspaceChange());
    },
    handleRoute({ route, path }) {
      if (!started) return;
      currentRoute = route;
      currentPath = path;
      retryInFlight = false;
      const revision = ++renderRevision;
      void renderRoute(route, path, revision);
    },
    handleNotFound({ path }) {
      if (!started) return;
      const revision = ++renderRevision;
      retryInFlight = false;
      const session = sessionStore.getSnapshot();
      if (session.status !== "authenticated") {
        router.navigate(ROUTE_PATHS.access, { replace: true });
        return;
      }
      currentRoute = null;
      currentPath = path;
      clearAuth();
      showSurface("app");
      const activeShell = ensureShell();
      activeShell.setIdentity({ user: session.user, workspace: workspaceStore.getCurrent() });
      activeShell.setNavigation(navigationFor(workspaceStore.getCurrent(), path));
      activeShell.setRouteMeta({ title: "Página não encontrada", breadcrumbs: ["SIVI", "Não encontrada"] });
      activeShell.setBusy(false);
      clearPage();
      if (!isActive(revision)) return;
      pageCleanup = mountNotFoundPage({
        container: activeShell.outlet,
        path,
        onReturn: () => router.navigate(ROUTE_PATHS.context),
      });
      if (isActive(revision) && shell === activeShell) activeShell.focusRouteTitle();
    },
    stop() {
      if (!started) return;
      started = false;
      renderRevision += 1;
      unsubscribeSession();
      unsubscribeWorkspace();
      unsubscribeSession = () => {};
      unsubscribeWorkspace = () => {};
      clearPage();
      clearAuth();
      if (shell) {
        shell.destroy();
        shell = null;
      }
    },
  };
}
