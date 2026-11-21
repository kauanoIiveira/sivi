import { APP_ROUTES, ROUTE_PATHS } from "./routes.js";
import { evaluateRouteAccess } from "../core/route-guard.js";
import { matchRoute } from "../core/router.js";
import { renderPageState } from "../components/page-state/page-state.js";
import { createAppShell } from "../layouts/app-shell/app-shell.js";
import { mountNotFoundPage } from "../pages/not-found/not-found-page.js";

const RETURN_TO_KEY = "sivi.return-to.v1";
const INTENT_KEY = 'sivi.onboarding-role.v1';
const retiredCaseSteps = new Map([
  ["ficha-de-demanda", 1],
  ["comparacao-de-propostas", 3],
  ["registro-de-inspecao", 5],
  ["recebimento-do-pedido", 7],
]);

function navigationFor(workspace, currentPath) {
  const items = [{ id: "context", label: "Empresas e atuação", path: ROUTE_PATHS.context }];
  if (workspace) {
    items.push(...APP_ROUTES.filter((route) => route.section && route.workspaceRole === workspace.organizationRole).map((route) => ({ id: route.id, label: route.title, path: route.path })));
    const labels = {
      buyer: "Visão geral",
      supplier: "Visão do fornecedor",
      administration: "Visão administrativa",
    };
    items.unshift({
      id: `${workspace.organizationRole}-home`,
      label: labels[workspace.organizationRole],
      path: workspace.homeRoute,
    });
    if (workspace.organizationRole === "buyer") {
      items.splice(1, 0, { id: "buyer-suppliers", label: "Fornecedores", path: ROUTE_PATHS.buyerSuppliers });
      items.splice(items.findIndex((item) => item.id === "buyer-orders") + 1, 0, { id: "buyer-reviews", label: "Avaliações", path: ROUTE_PATHS.buyerReviews });
      items.push(items.splice(items.findIndex((item) => item.id === "context"), 1)[0]);
    }
  }
  return items.map((item) => ({ ...item, current: item.path === currentPath }));
}

function canonicalProtectedRoute(path) {
  if (typeof path !== "string") return null;
  const [base, query = ''] = path.split('?');
  if (path.split('?').length > 2) return null;
  const route = matchRoute(base, APP_ROUTES);
  if (route?.access !== 'authenticated' || route.path !== base || path.length > 512) return null;
  const params = new URLSearchParams(query);
  for (const [key, value] of params) {
    if (key === 'registro' && /^[A-Za-z0-9_-]{1,128}$/.test(value)) continue;
    if (key === 'nova' && value === '1' && route.id === 'buyer-demands') continue;
    return null;
  }
  if ([...params.keys()].some(key => params.getAll(key).length > 1)) return null;
  return { ...route, destination: base + (params.size ? `?${params.toString()}` : '') };
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
  createShell = createAppShell,
}) {
  let currentRoute = null;
  let currentPath = ROUTE_PATHS.access;
  let currentDestination = ROUTE_PATHS.access;
  let pageCleanup = () => {};
  let authCleanup = () => {};
  let authTransition;
  let pageTransition;
  let pageEntrance;
  let mountedPublicScreen;
  let shell = null;
  let renderRevision = 0;
  let unsubscribeSession = () => {};
  let unsubscribeWorkspace = () => {};
  let started = false;
  let retryInFlight = false;
  let workspaceNavigationDepth = 0;
  let enterAfterAuthentication = false;
  let contextNotice = null;
  const contextOnboarding = onboarding && {
    ...onboarding,
    refresh: async () => { contextNotice = null; return onboarding.refresh(); },
    retry: async () => { contextNotice = null; return onboarding.retry(); },
  };

  const isActive = (revision) => started && revision === renderRevision;
  const canAnimatePage = () => !reducedMotion.matches && document.documentElement.dataset.motion !== "reduce";
  const cancelPageMotion = () => {
    pageTransition?.skipTransition();
    pageEntrance?.cancel();
  };

  async function swapPublicView(update, surface, kind) {
    if (typeof document.startViewTransition === "function") {
      const root = document.documentElement;
      root.dataset.pageTransition = kind;
      let transition;
      try {
        transition = document.startViewTransition(update);
      } catch {
        delete root.dataset.pageTransition;
      }
      if (transition) {
        pageTransition = transition;
        void transition.ready.catch(() => {});
        void transition.finished.catch(() => {}).finally(() => {
          if (pageTransition === transition) {
            pageTransition = undefined;
            delete root.dataset.pageTransition;
          }
        });
        await transition.updateCallbackDone;
        return;
      }
    }

    update();
    const content = surface.querySelector("main");
    if (typeof content?.animate !== "function") return;
    const animation = content.animate(
      [{ opacity: .45, translate: "0 18px" }, { opacity: 1, translate: "0 0" }],
      { duration: 360, easing: "cubic-bezier(.22, 1, .36, 1)" },
    );
    pageEntrance = animation;
    void animation.finished.catch(() => {}).finally(() => {
      if (pageEntrance === animation) pageEntrance = undefined;
    });
  }

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
  const readIntent = () => {
    try { const value = storage?.getItem(INTENT_KEY); return ['buyer', 'supplier'].includes(value) ? value : null; }
    catch { return null; }
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
    shell = createShell({
      root: surfaces.app,
      onNavigate: (path) => router.navigate(path),
      onChangeContext: () => router.navigate(ROUTE_PATHS.context),
      onLogout: () => { void logout(); },
      onAccountUpdated: (user) => sessionStore.updateProfile(user),
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
      ? pendingRoute.destination
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

  const createAndSelectOrganization = async (input, options) => {
    const result = await createOrganization(input, options);
    contextNotice = result?.syncWarning ? 'Cadastro enviado para análise. A consulta da lista está temporariamente indisponível; a empresa confirmada aparece abaixo. Use Atualizar situação.' : null;
    try { storage?.removeItem(INTENT_KEY); } catch { /* A seleção permanece editável. */ }
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
    return result;
  };

  const logout = async () => {
    if (!started || !canLeavePage()) return;
    clearReturnTo();
    contextNotice = null;
    enterAfterAuthentication = false;
    try { storage?.removeItem(INTENT_KEY); } catch { /* A próxima conta escolhe sua atuação. */ }
    try {
      await sessionStore.logout();
    } catch (error) {
      console.warn("A sessão não pôde ser encerrada.", error);
    }
    try { workspaceStore.clear(); } catch { /* A limpeza em memória é responsabilidade da store. */ }
    try { await repository.reset?.(); } catch (error) { console.warn("O estado local não pôde ser limpo.", error); }
    clearReturnTo();
    if (started) router.navigate(`${ROUTE_PATHS.access}?modo=login`, { replace: true });
  };

  const renderAllowedAppRoute = async (route, path, revision) => {
    showSurface("app");
    const activeShell = ensureShell();
    const session = sessionStore.getSnapshot();
    const workspace = workspaceStore.getCurrent();
    activeShell.setIdentity({ user: session.user, workspace });
    activeShell.setNavigation(navigationFor(workspace, path));
    activeShell.setRouteMeta({ title: route.title, breadcrumbs: ["buyer-home", "buyer-suppliers", "buyer-reviews"].includes(route.id) ? ["Comprador", route.title] : ["SIVI", route.title], routeId: route.id });
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
        ? mount({ container: activeShell.outlet, workspaces: workspaceStore.list(), workspaceState: workspaceStore.getSnapshot?.(), currentWorkspace: workspace, preferredRole: readIntent(), notice: contextNotice, onSelect: selectWorkspace, onCreate: createAndSelectOrganization, onboarding: contextOnboarding })
        : mount({ container: activeShell.outlet, workspace, user: sessionStore.getSnapshot().user, repository, administration, supplierProfiles, onReady: onPageReady });
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
      if (decision.reason === 'already-authenticated' && !workspace) enterAfterAuthentication = true;
      if (decision.reason === "authentication-required") writeReturnTo(currentDestination);
      if (decision.reason === "workspace-required") writeReturnTo(currentDestination);
      router.navigate(decision.to, { replace: true });
      return;
    }
    if (route.surface === 'public') {
      const params = new URLSearchParams(currentDestination.split("?")[1]);
      const screen = route.id === "public-home" ? `${route.id}:${params.get("pagina") ?? ""}` : route.id;
      const surface = surfaces.public;
      const showPublic = () => {
        clearPage();
        clearAuth();
        if (shell) { shell.destroy(); shell = null; }
        showSurface('public');
        document.title = route.title;
      };
      try {
        const mount = await loadPageMount(route.id);
        if (!isActive(revision)) return;
        const from = document.body.dataset.surface;
        const update = () => {
          if (!isActive(revision)) return;
          showPublic();
          pageCleanup = mount({ container: surface });
          mountedPublicScreen = screen;
        };
        const animated = canAnimatePage() && (
          (from === "public" && mountedPublicScreen && mountedPublicScreen !== screen) ||
          (from === "auth" && surfaces.auth.querySelector(".sa-layout"))
        );
        const transitionKind = from === "auth" ? "access"
          : route.id === "public-about" ? "about"
          : route.id === "public-platform" ? "platform"
          : "public";
        if (animated) await swapPublicView(update, surface, transitionKind);
        else update();
      } catch {
        if (isActive(revision)) {
          showPublic();
          mountedPublicScreen = undefined;
          surface.innerHTML = '<p>Não foi possível abrir a página. <a href="#/acesso">Entrar no SIVI</a></p>';
        }
      }
      return;
    }
    if (route.surface === "auth") {
      const auth = surfaces.auth;
      const oldMode = auth.querySelector(".sa-layout")?.dataset.mode;
      const newMode = new URLSearchParams(currentDestination.split("?")[1]).get("modo") === "login" ? "login" : "register";
      const slide = oldMode && oldMode !== newMode && document.body.dataset.surface === "auth" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fromPublic = document.body.dataset.surface === "public" && mountedPublicScreen && canAnimatePage();
      const showAuth = () => {
        clearPage();
        if (shell) {
          shell.destroy();
          shell = null;
        }
        showSurface("auth");
        document.title = "Acesso — SIVI";
      };
      if (!fromPublic) {
        if (!slide) clearAuth();
        showAuth();
      }
      try {
        const mount = await loadAuthSurface();
        if (!isActive(revision)) return;
        const update = () => {
          if (!isActive(revision)) return;
          if (fromPublic) showAuth();
          clearAuth();
          if (slide || fromPublic) window.scrollTo({ top: 0, behavior: "instant" });
          const cleanup = mount({ root: auth });
          if (!isActive(revision)) {
            try { cleanup?.(); } catch { /* Uma montagem tardia deve ser descartada. */ }
            return;
          }
          authCleanup = typeof cleanup === "function" ? cleanup : () => {};
          auth.querySelector(".form-view.is-active h1")?.focus({ preventScroll: true });
        };
        delete auth.dataset.authSlide;
        if (fromPublic) {
          await swapPublicView(update, auth, "access");
        } else if (slide && typeof document.startViewTransition === "function") {
          auth.dataset.authTransition = newMode;
          const transition = document.startViewTransition(update);
          authTransition = transition;
          void transition.finished.catch(() => {}).finally(() => {
            if (authTransition === transition) {
              authTransition = undefined;
              delete auth.dataset.authTransition;
            }
          });
          await transition.updateCallbackDone;
        } else {
          if (slide) auth.dataset.authSlide = newMode;
          update();
        }
      } catch (error) {
        if (!isActive(revision)) return;
        if (fromPublic) showAuth();
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
    return (_snapshot, { reason } = {}) => {
      if (!started || (skipInitial && initial)) {
        initial = false;
        return;
      }
      initial = false;
      if (reason === "profile") {
        const session = sessionStore.getSnapshot();
        if (shell && session.status === "authenticated") {
          shell.setIdentity({ user: session.user, workspace: workspaceStore.getCurrent() });
          shell.outlet.dispatchEvent(new CustomEvent("sivi:account-updated", { detail: { user: session.user } }));
        }
        return;
      }
      if (['unverified', 'anonymous'].includes(sessionStore.getSnapshot().status) && document.body.dataset.surface === 'auth') return;
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
      if (document.body.dataset.surface === 'auth' && sessionStore.getSnapshot().status !== 'authenticated') return;
      const selected = workspaceStore.getCurrent();
      const pendingRoute = canonicalProtectedRoute(readReturnTo());
      if (selected && pendingRoute?.workspaceRole === selected.organizationRole) {
        enterAfterAuthentication = false;
        clearReturnTo();
        router.navigate(pendingRoute.destination, { replace: true });
        return;
      }
      if (selected && enterAfterAuthentication && currentRoute?.id === 'context') {
        enterAfterAuthentication = false;
        navigateToWorkspace(selected, { replace: true });
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
    handleRoute({ route, path, fullPath = path }) {
      if (!started) return;
      authTransition?.skipTransition();
      cancelPageMotion();
      currentRoute = route;
      currentPath = path;
      currentDestination = fullPath;
      if (route.id !== 'context' && route.id !== 'access') enterAfterAuthentication = false;
      if (route.id === 'access') {
        const intent = new URLSearchParams(fullPath.split('?')[1] ?? '').get('atuacao');
        if (['buyer', 'supplier'].includes(intent)) {
          try { storage?.setItem(INTENT_KEY, intent); } catch { /* O cadastro permite escolher a atuação. */ }
        }
      }
      retryInFlight = false;
      const revision = ++renderRevision;
      void renderRoute(route, path, revision);
    },
    handleNotFound({ path, fullPath = path }) {
      if (!started) return;
      if (path === "/casos") {
        const section = new URLSearchParams(fullPath.split("?")[1]).get("secao");
        const step = retiredCaseSteps.get(section);
        const destination = step
          ? `${ROUTE_PATHS.publicPlatform}?secao=funcionamento&etapa=${step}`
          : ROUTE_PATHS.publicPlatform;
        router.navigate(destination, { replace: true, force: true });
        return;
      }
      cancelPageMotion();
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
      authTransition?.skipTransition();
      cancelPageMotion();
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
