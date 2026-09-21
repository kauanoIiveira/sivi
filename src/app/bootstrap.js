import { createAppController } from "./app-controller.js";
import { loadAuthSurface, loadPageMount } from "./page-loaders.js";
import { APP_ROUTES } from "./routes.js";
import { createHashRouter } from "../core/router.js";
import { createSessionStore } from "../core/session-store.js";
import { createWorkspaceStore } from "../core/workspace-store.js";
import { auth, database } from "../config/firebase.js";
import { createFirebaseDataClient } from "../services/firebase-data-client.js";
import { createFirebaseWorkspaceService } from "../services/firebase-workspace-service.js";
import { createFirebaseAdminService } from "../services/firebase-admin-service.js";
import { createFirebaseSupplierProfileService } from "../services/firebase-supplier-profile-service.js";
import { createFirebaseMarketplaceRepository } from "../repositories/firebase-marketplace-repository.js";

export function bootstrapApplication({ workspaceService: suppliedWorkspaceService, repository: suppliedRepository, administration: suppliedAdministration } = {}) {
  const surfaces = {
    public: document.querySelector('[data-public-surface]'),
    boot: document.querySelector("[data-boot-surface]"),
    auth: document.querySelector("[data-auth-surface]"),
    app: document.querySelector("[data-app-root]"),
  };
  if (Object.values(surfaces).some((surface) => !surface)) {
    throw new Error("As superfícies principais do SIVI não foram encontradas.");
  }

  const sessionStore = createSessionStore({
    loadAuthModule: () => import("../services/auth-service.js"),
  });
  const workspaceStore = createWorkspaceStore({
    storage: window.sessionStorage,
    key: "sivi.workspace.v1",
    workspaces: [],
  });
  const client = createFirebaseDataClient(database);
  const getUser = () => auth.currentUser;
  const workspaceService = suppliedWorkspaceService ?? createFirebaseWorkspaceService({ client, getUser });
  const administration = suppliedAdministration ?? createFirebaseAdminService({ client, getUser });
  const supplierProfiles = createFirebaseSupplierProfileService({
    client,
    getUser,
    getWorkspace: (id) => workspaceStore.list().find((workspace) => workspace.id === id),
  });
  const repository = suppliedRepository ?? createFirebaseMarketplaceRepository({
    client,
    getUser,
    getWorkspace: (id) => workspaceStore.list().find((workspace) => workspace.id === id),
  });
  let membershipRevision = 0;
  let activeUid = null;
  let controller;
  const router = createHashRouter({
    windowObject: window,
    routes: APP_ROUTES,
    onRoute: (payload) => controller.handleRoute(payload),
    onNotFound: (payload) => controller.handleNotFound(payload),
  });
  controller = createAppController({
    router,
    sessionStore,
    workspaceStore,
    repository,
    loadAuthSurface,
    loadPageMount,
    surfaces,
    storage: window.sessionStorage,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
    administration,
    supplierProfiles,
    onboarding: {
      getOrganization: id => workspaceService.getOrganization(id),
      resubmitOrganization: (id, input) => workspaceService.resubmitOrganization(id, input),
      refresh: async () => {
        const uid = sessionStore.getSnapshot().user?.uid;
        const workspaces = await workspaceService.listWorkspaces();
        if (sessionStore.getSnapshot().user?.uid !== uid) return;
        workspaceStore.replace(workspaces);
        router.refresh();
      },
    },
    createOrganization: async (input) => {
      membershipRevision += 1;
      const created = await workspaceService.createOrganization(input);
      const workspaces = await workspaceService.listWorkspaces();
      return { ...created, workspaces };
    },
  });

  controller.start();
  router.start();
  const unsubscribeMemberships = sessionStore.subscribe((snapshot) => {
    const revision = ++membershipRevision;
    if (snapshot.status !== "authenticated") {
      activeUid = null;
      return;
    }
    if (activeUid !== null && snapshot.user.uid !== activeUid) {
      activeUid = snapshot.user.uid;
      workspaceStore.replace([]);
    } else if (activeUid === null) {
      activeUid = snapshot.user.uid;
    }
    workspaceService.listWorkspaces().then((workspaces) => {
      if (revision !== membershipRevision || sessionStore.getSnapshot().user?.uid !== snapshot.user.uid) return;
      workspaceStore.replace(workspaces);
      const commercial = workspaces.filter(workspace => workspace.canEnter && workspace.organizationRole !== 'administration');
      if (commercial.length === 1 && !workspaces.some(workspace => workspace.organizationRole === 'administration') && !workspaceStore.getCurrent()) {
        workspaceStore.select(commercial[0].id);
        if (['#/acesso', '#/app/contexto'].includes(window.location.hash.split('?')[0])) router.navigate(commercial[0].homeRoute, { replace: true });
      }
    }).catch((error) => {
      console.warn("Os contextos da conta não puderam ser carregados.", error);
    });
  });
  sessionStore.start().then(
    () => router.refresh(),
    () => router.refresh(),
  );

  return () => {
    controller.stop();
    router.stop();
    sessionStore.stop();
    unsubscribeMemberships();
  };
}
