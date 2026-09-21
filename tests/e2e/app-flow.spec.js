import { expect, test } from "@playwright/test";

import { createVerifiedUser, resetAuthEmulator } from "../helpers/auth-emulator.js";

const account = Object.freeze({
  email: "comprador@sivi.demo",
  password: "SiviDemo2026",
  displayName: "Comprador Demo",
});

const roleCases = Object.freeze([
  {
    buttonName: /Indústrias Alpha/,
    path: "/app/comprador/inicio",
    role: "buyer",
  },
  {
    buttonName: /Vetor Componentes Industriais/,
    path: "/app/fornecedor/inicio",
    role: "supplier",
  },
  {
    buttonName: /Administração SIVI/,
    path: "/app/administracao/inicio",
    role: "administration",
  },
]);

async function login(page) {
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-ui-ready", "true");
  if (await page.locator(".auth-shell").getAttribute("data-mode") !== "login") {
    await page.locator("[data-switch-mode='login']").click();
  }
  await page.locator("#login-email").fill(account.email);
  await page.locator("#login-password").fill(account.password);
  await page.locator("#login-form button[type='submit']").click();
  await expect(page.getByRole("heading", { name: /Qual empresa você vai usar/ })).toBeVisible();
}

test.describe("integrated authenticated application", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/src/main.js", route => route.fulfill({
      contentType: "text/javascript",
      body: 'import "/tests/support/application-fixture.js";',
    }));
  });
  test.beforeEach(async () => {
    await resetAuthEmulator();
    await createVerifiedUser(account);
  });

  test("keeps a canonical compatible destination through verified login and clears it once", async ({ page }) => {
    const productionDatabaseRequests = [];
    page.on("request", (request) => {
      if (new URL(request.url()).hostname === "sivi-org-default-rtdb.firebaseio.com") {
        productionDatabaseRequests.push(request.url());
      }
    });

    await page.goto("/?authEmulator=1#/app/comprador/inicio");
    await expect(page).toHaveURL(/#\/acesso$/);
    expect(await page.evaluate(() => sessionStorage.getItem("sivi.return-to.v1")))
      .toBe("/app/comprador/inicio");

    await login(page);
    await page.getByRole("button", { name: /Indústrias Alpha/ }).click();

    await expect(page).toHaveURL(/#\/app\/comprador\/inicio$/);
    await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
    expect(await page.evaluate(() => sessionStorage.getItem("sivi.return-to.v1"))).toBeNull();
    expect(productionDatabaseRequests).toEqual([]);
  });

  test("discards an incompatible protected destination and uses the selected home", async ({ page }) => {
    await page.goto("/?authEmulator=1#/app/fornecedor/inicio");
    await login(page);
    await page.getByRole("button", { name: /Indústrias Alpha/ }).click();

    await expect(page).toHaveURL(/#\/app\/comprador\/inicio$/);
    expect(await page.evaluate(() => sessionStorage.getItem("sivi.return-to.v1"))).toBeNull();
  });

  for (const unsafeReturnTo of [
    "%E0%A4%A",
    "/app/nao-registrada",
    "/acesso",
    "/app/fornecedor/inicio/",
  ]) {
    test(`clears unsafe stored return-to ${unsafeReturnTo}`, async ({ page }) => {
      await page.addInitScript((value) => {
        window.sessionStorage.setItem("sivi.return-to.v1", value);
      }, unsafeReturnTo);
      await page.goto("/?authEmulator=1#/acesso");
      await login(page);
      await page.getByRole("button", { name: /Indústrias Alpha/ }).click();

      await expect(page).toHaveURL(/#\/app\/comprador\/inicio$/);
      expect(await page.evaluate(() => sessionStorage.getItem("sivi.return-to.v1"))).toBeNull();
    });
  }

  for (const roleCase of roleCases) {
    test(`opens the ${roleCase.role} dashboard from explicit context selection`, async ({ page }) => {
      await page.goto("/?authEmulator=1#/acesso");
      await login(page);
      await page.getByRole("button", { name: roleCase.buttonName }).click();

      await expect(page).toHaveURL(new RegExp(`#${roleCase.path}$`));
      if (roleCase.role === "administration") await expect(page.locator(".admin-organizations")).toBeVisible(); else await expect(page.locator(".dashboard-page")).toHaveAttribute("data-dashboard-role", roleCase.role);
      await expect(page.locator("[data-account-user]")).toHaveText(account.displayName);
    });
  }

  test("changes demo context without changing the Firebase identity", async ({ page }) => {
    await page.goto("/?authEmulator=1#/acesso");
    await login(page);
    await page.getByRole("button", { name: /Indústrias Alpha/ }).click();
    await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");

    await page.locator("[data-change-context]").click();
    await page.getByRole("button", { name: /Vetor Componentes Industriais/ }).click();

    await expect(page).toHaveURL(/#\/app\/fornecedor\/inicio$/);
    await expect(page.locator("[data-organization-name]")).toHaveText("Vetor Componentes Industriais");
    await expect(page.locator("[data-account-user]")).toHaveText(account.displayName);
    await expect(page.locator("[data-navigation-list]")).not.toContainText("Visão do comprador");
  });

  test("shows an authenticated unknown route inside the persistent shell with safe path text", async ({ page }) => {
    await page.goto("/?authEmulator=1#/acesso");
    await login(page);
    await page.getByRole("button", { name: /Indústrias Alpha/ }).click();
    await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");

    await page.evaluate(() => {
      window.location.hash = "#/app/rota-inexistente";
    });

    await expect(page.locator("[data-app-shell]")).toBeVisible();
    await expect(page.locator("[data-page-state='not-found']")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Esta rota não faz parte da jornada" })).toBeFocused();
    await expect(page.locator("[data-page-state='not-found'] p"))
      .toContainText("/app/rota-inexistente");
  });

  test("focuses and announces the route while reduced motion prevents an outlet animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?authEmulator=1#/acesso");
    await login(page);
    await page.getByRole("button", { name: /Vetor Componentes Industriais/ }).click();

    await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
    await expect(page.locator("[data-page-title]")).toBeFocused();
    await expect(page.locator("[data-app-announcer]")).toContainText("Visão do fornecedor carregada");
    expect(await page.locator("[data-app-outlet]").evaluate((outlet) => outlet.getAnimations().length)).toBe(0);
  });

  test("logout clears the workspace and demo route before returning to the preserved auth surface", async ({ page }) => {
    await page.goto("/?authEmulator=1#/acesso");
    await login(page);
    await page.getByRole("button", { name: /Administração SIVI/ }).click();
    await expect(page.locator(".admin-organizations")).toBeVisible();

    await page.locator("[data-account-menu] summary").click();
    await page.locator("[data-logout]").click();

    await expect(page).toHaveURL(/#\/acesso$/);
    await expect(page.locator(".auth-shell")).toBeVisible();
    expect(await page.evaluate(() => ({
      workspace: sessionStorage.getItem("sivi.workspace.v1"),
      returnTo: sessionStorage.getItem("sivi.return-to.v1"),
    }))).toEqual({ workspace: null, returnTo: null });
  });
});

test("retries a lazy page failure without duplicate activation or an unhandled rejection", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/tests/fixtures/component-lab.html");

  const result = await page.evaluate(async () => {
    const [{ createAppController }, { getRouteById }] = await Promise.all([
      import("/src/app/app-controller.js"),
      import("/src/app/routes.js"),
    ]);
    const host = document.createElement("div");
    const boot = document.createElement("div");
    const auth = document.createElement("main");
    const app = document.createElement("div");
    host.append(boot, auth, app);
    document.body.append(host);
    const workspace = {
      id: "workspace-buyer-alpha",
      organizationRole: "buyer",
      organizationName: "Indústrias Alpha",
      homeRoute: "/app/comprador/inicio",
    };
    let loaderCalls = 0;
    let mounted = 0;
    let controller;
    const router = {
      navigate() {},
      refresh() {
        controller.handleRoute({ route: getRouteById("buyer-home"), path: "/app/comprador/inicio" });
      },
    };
    const sessionStore = {
      getSnapshot: () => ({ status: "authenticated", user: { displayName: "Teste" } }),
      subscribe(listener) { listener(this.getSnapshot()); return () => {}; },
      logout: async () => {},
    };
    const workspaceStore = {
      getCurrent: () => workspace,
      list: () => [workspace],
      subscribe(listener) { listener(workspace); return () => {}; },
      select: () => workspace,
      clear() {},
    };
    controller = createAppController({
      router,
      sessionStore,
      workspaceStore,
      repository: { reset: async () => {} },
      loadAuthSurface: async () => {},
      async loadPageMount() {
        loaderCalls += 1;
        if (loaderCalls === 1) throw new Error("lazy indisponível");
        return ({ container, onReady }) => {
          mounted += 1;
          const title = document.createElement("h1");
          title.dataset.pageTitle = "";
          title.textContent = "Página recuperada";
          container.replaceChildren(title);
          onReady();
          return () => container.replaceChildren();
        };
      },
      surfaces: { boot, auth, app },
      storage: sessionStorage,
      reducedMotion: { matches: true },
    });
    controller.start();
    router.refresh();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const retry = app.querySelector("[data-page-state='error'] button");
    retry.click();
    retry.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const snapshot = {
      loaderCalls,
      mounted,
      title: app.querySelector("[data-page-title]")?.textContent,
      busy: app.querySelector("[data-app-shell]")?.getAttribute("aria-busy"),
    };
    controller.stop();
    host.remove();
    return snapshot;
  });

  expect(result).toEqual({
    loaderCalls: 2,
    mounted: 1,
    title: "Página recuperada",
    busy: "false",
  });
  expect(pageErrors).toEqual([]);
});

test("retries a failed auth import once and mounts the recovered surface", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/tests/fixtures/component-lab.html");

  const result = await page.evaluate(async () => {
    const [{ createAppController }, { getRouteById }] = await Promise.all([
      import("/src/app/app-controller.js"),
      import("/src/app/routes.js"),
    ]);
    const host = document.createElement("div");
    const boot = document.createElement("div");
    const auth = document.createElement("main");
    const app = document.createElement("div");
    host.append(boot, auth, app);
    document.body.append(host);
    let loaderCalls = 0;
    let mountCalls = 0;
    const sessionStore = {
      getSnapshot: () => ({ status: "anonymous", user: null }),
      subscribe(listener) { listener(this.getSnapshot()); return () => {}; },
      logout: async () => {},
    };
    const workspaceStore = {
      getCurrent: () => null,
      list: () => [],
      subscribe(listener) { listener(null); return () => {}; },
      select() {},
      clear() {},
    };
    const controller = createAppController({
      router: { navigate() {}, refresh() {} },
      sessionStore,
      workspaceStore,
      repository: { reset: async () => {} },
      async loadAuthSurface() {
        loaderCalls += 1;
        if (loaderCalls === 1) throw new Error("auth indisponível");
        return ({ root }) => {
          mountCalls += 1;
          root.dataset.authMounted = "true";
          return () => { delete root.dataset.authMounted; };
        };
      },
      loadPageMount: async () => {},
      surfaces: { boot, auth, app },
      storage: sessionStorage,
      reducedMotion: { matches: true },
    });
    controller.start();
    controller.handleRoute({ route: getRouteById("access"), path: "/acesso" });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const retry = auth.querySelector("[data-auth-retry]");
    retry.click();
    retry.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const snapshot = {
      loaderCalls,
      mountCalls,
      mounted: auth.dataset.authMounted,
      retryCount: auth.querySelectorAll("[data-auth-retry]").length,
    };
    controller.stop();
    host.remove();
    return snapshot;
  });

  expect(result).toEqual({ loaderCalls: 2, mountCalls: 1, mounted: "true", retryCount: 0 });
  expect(pageErrors).toEqual([]);
});

test("clears a rejected auth loader promise before retrying the real module import", async ({ page }) => {
  let moduleRequests = 0;
  await page.route(/\/src\/pages\/auth\/auth-page\.js(?:\?.*)?$/, async (route) => {
    moduleRequests += 1;
    if (moduleRequests === 1) await route.abort("failed");
    else await route.continue();
  });
  await page.goto("/tests/fixtures/component-lab.html");

  const result = await page.evaluate(async () => {
    const { loadAuthSurface } = await import("/src/app/page-loaders.js");
    let firstRejected = false;
    try {
      await loadAuthSurface();
    } catch {
      firstRejected = true;
    }
    const mount = await loadAuthSurface();
    return { firstRejected, mountName: mount.name };
  });

  expect(result).toEqual({ firstRejected: true, mountName: "mountAuthSurface" });
  expect(moduleRequests).toBe(2);
});

test("cleans the mounted auth surface and ignores a later import after stop", async ({ page }) => {
  await page.goto("/tests/fixtures/component-lab.html");

  const result = await page.evaluate(async () => {
    const [{ createAppController }, { getRouteById }] = await Promise.all([
      import("/src/app/app-controller.js"),
      import("/src/app/routes.js"),
    ]);
    const host = document.createElement("div");
    const boot = document.createElement("div");
    const auth = document.createElement("main");
    const app = document.createElement("div");
    host.append(boot, auth, app);
    document.body.append(host);
    let resolveImport;
    let loaderCalls = 0;
    let mountCalls = 0;
    let cleanupCalls = 0;
    const mount = ({ root }) => {
      mountCalls += 1;
      root.dataset.authMounted = String(mountCalls);
      return () => {
        cleanupCalls += 1;
        delete root.dataset.authMounted;
      };
    };
    const sessionStore = {
      getSnapshot: () => ({ status: "anonymous", user: null }),
      subscribe(listener) { listener(this.getSnapshot()); return () => {}; },
      logout: async () => {},
    };
    const workspaceStore = {
      getCurrent: () => null,
      list: () => [],
      subscribe(listener) { listener(null); return () => {}; },
      select() {},
      clear() {},
    };
    const controller = createAppController({
      router: { navigate() {}, refresh() {} },
      sessionStore,
      workspaceStore,
      repository: { reset: async () => {} },
      loadAuthSurface() {
        loaderCalls += 1;
        if (loaderCalls === 1) return Promise.resolve(mount);
        return new Promise((resolve) => { resolveImport = resolve; });
      },
      loadPageMount: async () => {},
      surfaces: { boot, auth, app },
      storage: sessionStorage,
      reducedMotion: { matches: true },
    });
    controller.start();
    controller.handleRoute({ route: getRouteById("access"), path: "/acesso" });
    await new Promise((resolve) => setTimeout(resolve, 0));
    controller.handleRoute({ route: getRouteById("access"), path: "/acesso" });
    controller.stop();
    controller.stop();
    resolveImport(mount);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const snapshot = {
      loaderCalls,
      mountCalls,
      cleanupCalls,
      mounted: auth.dataset.authMounted ?? null,
    };
    host.remove();
    return snapshot;
  });

  expect(result).toEqual({ loaderCalls: 2, mountCalls: 1, cleanupCalls: 1, mounted: null });
});

test("auth surface remount keeps one listener and cleanup removes it", async ({ page }) => {
  await page.goto("/tests/fixtures/component-lab.html");

  const result = await page.evaluate(async () => {
    const html = await fetch("/index.html").then((response) => response.text());
    const source = new DOMParser().parseFromString(html, "text/html").querySelector("[data-auth-surface]");
    const root = document.importNode(source, true);
    root.hidden = false;
    document.body.append(root);
    const { mountAuthSurface } = await import("/src/pages/auth/auth-page.js");
    const firstCleanup = mountAuthSurface({ root });
    firstCleanup();
    const secondCleanup = mountAuthSurface({ root });
    const toggle = root.querySelector("[aria-controls='login-password']");
    const input = root.querySelector("#login-password");
    toggle.click();
    const afterRemountClick = input.type;
    secondCleanup();
    toggle.click();
    const afterCleanupClick = input.type;
    const thirdCleanup = mountAuthSurface({ root });
    root.querySelector("[data-switch-mode='login']").click();
    thirdCleanup();
    const fourthCleanup = mountAuthSurface({ root });
    const modeAfterCleanup = root.querySelector(".auth-shell").dataset.mode;
    await new Promise((resolve) => setTimeout(resolve, 800));
    const lateMutation = root.querySelector(".auth-shell").dataset.mode !== modeAfterCleanup;
    fourthCleanup();
    root.remove();
    return { afterRemountClick, afterCleanupClick, lateMutation };
  });

  expect(result).toEqual({ afterRemountClick: "text", afterCleanupClick: "text", lateMutation: false });
});

test("creates, selects and opens a new organization without an intermediate context refresh", async ({ page }) => {
  await page.goto("/tests/fixtures/component-lab.html");

  const result = await page.evaluate(async () => {
    const [{ createAppController }, { getRouteById }] = await Promise.all([
      import("/src/app/app-controller.js"),
      import("/src/app/routes.js"),
    ]);
    const host = document.createElement("div");
    const boot = document.createElement("div");
    const auth = document.createElement("main");
    const app = document.createElement("div");
    host.append(boot, auth, app);
    document.body.append(host);

    const calls = [];
    const created = {
      id: "workspace-created",
      organizationRole: "buyer",
      organizationName: "Compradora criada",
      homeRoute: "/app/comprador/inicio",
    };
    let current = null;
    let workspaces = [];
    let workspaceListener = () => {};
    let onCreate;
    const workspaceStore = {
      getCurrent: () => current,
      list: () => [...workspaces],
      subscribe(listener) {
        workspaceListener = listener;
        listener(current);
        return () => {};
      },
      replace(nextWorkspaces, preferredId) {
        workspaces = [...nextWorkspaces];
        current = workspaces.find((workspace) => workspace.id === preferredId) ?? null;
        calls.push(`replace:${preferredId}`);
        workspaceListener(current);
      },
      select(id) {
        calls.push(`select:${String(id)}`);
        const selected = workspaces.find((workspace) => workspace.id === id);
        if (!selected) throw new Error("Contexto não encontrado");
        current = selected;
        workspaceListener(current);
        return selected;
      },
      clear() {},
    };
    const controller = createAppController({
      router: {
        navigate(path) { calls.push(`navigate:${path}`); },
        refresh() { calls.push("refresh"); },
      },
      sessionStore: {
        getSnapshot: () => ({ status: "authenticated", user: { displayName: "Teste" } }),
        subscribe(listener) {
          listener(this.getSnapshot());
          return () => {};
        },
        logout: async () => {},
      },
      workspaceStore,
      repository: { reset: async () => {} },
      loadAuthSurface: async () => {},
      loadPageMount: async () => ({ onCreate: create }) => {
        onCreate = create;
        return () => {};
      },
      surfaces: { boot, auth, app },
      storage: sessionStorage,
      reducedMotion: { matches: true },
      createOrganization: async () => {
        calls.push("persist");
        return created;
      },
    });

    controller.start();
    controller.handleRoute({ route: getRouteById("context"), path: "/app/contexto" });
    await new Promise((resolve) => setTimeout(resolve, 0));
    calls.length = 0;
    await onCreate({ name: created.organizationName, role: created.organizationRole });
    const snapshot = { calls, currentId: current?.id, workspaceIds: workspaces.map(({ id }) => id) };
    controller.stop();
    host.remove();
    return snapshot;
  });

  expect(result).toEqual({
    calls: ["persist", "replace:workspace-created", "navigate:/app/comprador/inicio"],
    currentId: "workspace-created",
    workspaceIds: ["workspace-created"],
  });
});

test("invalidates stale route imports and every late callback after idempotent stop", async ({ page }) => {
  await page.goto("/tests/fixtures/component-lab.html");

  const result = await page.evaluate(async () => {
    const [{ createAppController }, { getRouteById }] = await Promise.all([
      import("/src/app/app-controller.js"),
      import("/src/app/routes.js"),
    ]);
    const host = document.createElement("div");
    const boot = document.createElement("div");
    const auth = document.createElement("main");
    const app = document.createElement("div");
    host.append(boot, auth, app);
    document.body.append(host);
    const pending = [];
    const deferred = () => {
      let resolve;
      const promise = new Promise((done) => { resolve = done; });
      pending.push({ promise, resolve });
      return promise;
    };
    const workspace = {
      id: "workspace-buyer-alpha",
      organizationRole: "buyer",
      organizationName: "Indústrias Alpha",
      homeRoute: "/app/comprador/inicio",
    };
    let sessionListener;
    let workspaceListener;
    let sessionUnsubscribes = 0;
    let workspaceUnsubscribes = 0;
    let mountCalls = 0;
    const sessionStore = {
      getSnapshot: () => ({ status: "authenticated", user: { displayName: "Teste" } }),
      subscribe(listener) {
        sessionListener = listener;
        listener(this.getSnapshot());
        return () => { sessionUnsubscribes += 1; };
      },
      logout: async () => {},
    };
    const workspaceStore = {
      getCurrent: () => workspace,
      list: () => [workspace],
      subscribe(listener) {
        workspaceListener = listener;
        listener(workspace);
        return () => { workspaceUnsubscribes += 1; };
      },
      select: () => workspace,
      clear() {},
    };
    const controller = createAppController({
      router: { navigate() {}, refresh() {} },
      sessionStore,
      workspaceStore,
      repository: { reset: async () => {} },
      loadAuthSurface: async () => {},
      loadPageMount: () => deferred(),
      surfaces: { boot, auth, app },
      storage: sessionStorage,
      reducedMotion: { matches: true },
    });
    controller.start();
    controller.start();
    controller.handleRoute({ route: getRouteById("buyer-home"), path: "/app/comprador/inicio" });
    controller.handleRoute({ route: getRouteById("context"), path: "/app/contexto" });
    const mount = ({ container }) => {
      mountCalls += 1;
      container.textContent = "montagem tardia";
      return () => container.replaceChildren();
    };
    pending[0].resolve(mount);
    await new Promise((resolve) => setTimeout(resolve, 0));
    controller.stop();
    controller.stop();
    pending[1].resolve(mount);
    sessionListener(sessionStore.getSnapshot());
    workspaceListener(workspace);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const snapshot = {
      mountCalls,
      appChildren: app.childElementCount,
      sessionUnsubscribes,
      workspaceUnsubscribes,
    };
    host.remove();
    return snapshot;
  });

  expect(result).toEqual({
    mountCalls: 0,
    appChildren: 0,
    sessionUnsubscribes: 1,
    workspaceUnsubscribes: 1,
  });
});

test("renders an unsafe not-found path as text rather than markup", async ({ page }) => {
  await page.goto("/tests/fixtures/component-lab.html");
  const result = await page.evaluate(async () => {
    const { mountNotFoundPage } = await import("/src/pages/not-found/not-found-page.js");
    const container = document.createElement("div");
    document.body.append(container);
    const cleanup = mountNotFoundPage({
      container,
      path: "</p><img data-injected onerror='window.__unsafe = true'>",
      onReturn() {},
    });
    const snapshot = {
      imageCount: container.querySelectorAll("[data-injected]").length,
      text: container.querySelector("p").textContent,
      unsafe: window.__unsafe ?? false,
    };
    cleanup();
    container.remove();
    return snapshot;
  });

  expect(result).toEqual({
    imageCount: 0,
    text: "Nenhuma página foi registrada para </p><img data-injected onerror='window.__unsafe = true'>.",
    unsafe: false,
  });
});
