const definitions = Object.freeze({
  'public-home': Object.freeze({ path: '../pages/public/public-page.js', exportName: 'mountPublicPage' }),
  context: Object.freeze({ path: "../pages/context/context-page.js", exportName: "mountContextPage" }),
  "buyer-home": Object.freeze({ path: "../pages/dashboard/buyer-dashboard-page.js", exportName: "mountBuyerDashboardPage" }),
  "supplier-home": Object.freeze({ path: "../pages/dashboard/supplier-dashboard-page.js", exportName: "mountSupplierDashboardPage" }),
  "admin-home": Object.freeze({ path: "../pages/dashboard/admin-dashboard-page.js", exportName: "mountAdminDashboardPage" }),
  "supplier-profile": Object.freeze({ path: "../pages/supplier/profile-page.js", exportName: "mountSupplierProfilePage" }),
});

let authSurfacePromise;
let authImportRevision = 0;

function importAuthSurface() {
  const moduleUrl = new URL("../pages/auth/auth-page.js", import.meta.url);
  if (authImportRevision > 0) moduleUrl.searchParams.set("retry", String(authImportRevision));
  return import(moduleUrl.href);
}

export function loadAuthSurface() {
  authSurfacePromise ??= importAuthSurface()
    .then((authModule) => {
      if (typeof authModule.mountAuthSurface !== "function") {
        throw new Error("Export da superfície de acesso ausente: mountAuthSurface");
      }
      return authModule.mountAuthSurface;
    })
    .catch((error) => {
      authSurfacePromise = undefined;
      authImportRevision += 1;
      throw error;
    });
  return authSurfacePromise;
}

export async function loadPageMount(routeId) {
  if (/^(buyer|supplier)-(demands|proposals|orders)$/.test(routeId)) {
    const { mountOperationsPage } = await import("../pages/operations/operations-page.js");
    return (options) => mountOperationsPage({ ...options, section: routeId.split("-")[1] });
  }
  const definition = definitions[routeId];
  if (!definition) throw new Error(`Carregador de página ausente: ${routeId}`);

  const pageModule = await import(definition.path);
  const mount = pageModule[definition.exportName];
  if (typeof mount !== "function") {
    throw new Error(`Export de página ausente: ${definition.exportName}`);
  }
  return mount;
}
