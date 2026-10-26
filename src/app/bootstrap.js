import { createAppController } from "./app-controller.js";
import { loadAuthSurface, loadPageMount } from "./page-loaders.js";
import { APP_ROUTES } from "./routes.js";
import { createHashRouter } from "../core/router.js";
import { createUnsavedChangesGuard } from '../core/unsaved-changes.js';
import { createSessionStore } from "../core/session-store.js";
import { createWorkspaceStore } from "../core/workspace-store.js";
import { auth, database } from "../config/firebase.js";
import { createFirebaseDataClient } from "../services/firebase-data-client.js";
import { createFirebaseWorkspaceService } from "../services/firebase-workspace-service.js";
import { createFirebaseAdminService } from "../services/firebase-admin-service.js";
import { createFirebaseSupplierProfileService } from "../services/firebase-supplier-profile-service.js";
import { createFirebaseMarketplaceRepository } from "../repositories/firebase-marketplace-repository.js";
import { signupDraftStore } from '../core/signup-draft-store.js';

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
  let sessionStorage;
  try { sessionStorage = window.sessionStorage; } catch { /* Stores keep their state in memory when browser storage is unavailable. */ }
  const workspaceStore = createWorkspaceStore({
    storage: sessionStorage,
    key: "sivi.workspace.v2",
    legacyKey: "sivi.workspace.v1",
    accountScoped: true,
    workspaces: [],
  });
  const client = createFirebaseDataClient(database);
  const getUser = () => auth.currentUser;
  const workspaceService = suppliedWorkspaceService ?? createFirebaseWorkspaceService({ client, getUser, storage: sessionStorage });
  const administration = suppliedAdministration ?? createFirebaseAdminService({ client, getUser, storage: sessionStorage });
  const supplierProfiles = createFirebaseSupplierProfileService({
    client,
    getUser,
    getWorkspace: (id) => workspaceStore.list().find((workspace) => workspace.id === id),
  });
  const repository = suppliedRepository ?? createFirebaseMarketplaceRepository({
    client,
    getUser,
    storage: sessionStorage,
    getWorkspace: (id) => workspaceStore.list().find((workspace) => workspace.id === id),
  });
  let membershipRevision = 0;
  let activeUid = null;
  let controller;
  const unsavedChanges = createUnsavedChangesGuard({ container: surfaces.app, windowObject: window });
  const router = createHashRouter({
    windowObject: window,
    routes: APP_ROUTES,
    onRoute: (payload) => controller.handleRoute(payload),
    onNotFound: (payload) => controller.handleNotFound(payload),
    beforeNavigate: () => sessionStore.getSnapshot().status !== 'authenticated' || unsavedChanges.canLeave(),
  });
  controller = createAppController({
    router,
    sessionStore,
    workspaceStore,
    repository,
    loadAuthSurface,
    loadPageMount,
    surfaces,
    storage: sessionStorage,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
    administration,
    supplierProfiles,
    onboarding: {
      getSignupDraft: () => signupDraftStore().read(getUser()),
      getSignupAttempt: id => signupDraftStore().ensureAttempt(id, getUser()),
      clearSignupDraft: id => signupDraftStore().remove(id, getUser()),
      getOrganization: id => workspaceService.getOrganization(id),
      resubmitOrganization: (id, input) => workspaceService.resubmitOrganization(id, input),
      refresh: async () => {
        const uid = sessionStore.getSnapshot().user?.uid;
        const revision = ++membershipRevision;
        const workspaces = await workspaceService.listWorkspaces();
        if (revision !== membershipRevision || sessionStore.getSnapshot().user?.uid !== uid) return;
        workspaceStore.replace(workspaces);
      },
      retry: async () => {
        const uid = sessionStore.getSnapshot().user?.uid;
        const revision = ++membershipRevision;
        workspaceStore.beginLoad(uid);
        try {
          const workspaces = await workspaceService.listWorkspaces();
          if (revision === membershipRevision && sessionStore.getSnapshot().user?.uid === uid) workspaceStore.replace(workspaces);
        } catch (error) {
          if (revision === membershipRevision && sessionStore.getSnapshot().user?.uid === uid) workspaceStore.failLoad(error);
          throw error;
        }
      },
    },
    canLeavePage: () => unsavedChanges.canLeave(),
    createOrganization: async (input, options) => {
      membershipRevision += 1;
      const uid = sessionStore.getSnapshot().user?.uid;
      const created = await workspaceService.createOrganization(input, options);
      if (sessionStore.getSnapshot().user?.uid !== uid) throw new Error('A conta mudou durante o cadastro. Entre novamente para consultar a empresa criada.');
      try {
        const workspaces = await workspaceService.listWorkspaces();
        if (sessionStore.getSnapshot().user?.uid !== uid) throw new Error('A conta mudou durante a consulta.');
        return { ...created, workspaces };
      } catch (error) {
        if (sessionStore.getSnapshot().user?.uid !== uid) throw error;
        return { ...created, workspaces: [...workspaceStore.list().filter(workspace => workspace.organizationId !== created.organizationId), ...created.workspaces], syncWarning: true };
      }
    },
  });

  const unsubscribeMemberships = sessionStore.subscribe((snapshot, { reason } = {}) => {
    if (reason === "profile") return;
    const revision = ++membershipRevision;
    if (snapshot.status !== "authenticated") {
      activeUid = null;
      workspaceStore.beginLoad(null);
      Promise.resolve().then(() => repository.reset?.()).catch(error => console.warn('O estado local não pôde ser limpo.', error));
      return;
    }
    if (activeUid !== null && snapshot.user.uid !== activeUid) {
      activeUid = snapshot.user.uid;
    } else if (activeUid === null) {
      activeUid = snapshot.user.uid;
    }
    workspaceStore.beginLoad(snapshot.user.uid);
    workspaceService.listWorkspaces().then((workspaces) => {
      if (revision !== membershipRevision || sessionStore.getSnapshot().user?.uid !== snapshot.user.uid) return;
      const commercial = workspaces.filter(workspace => workspace.canEnter && workspace.organizationRole !== 'administration');
      const automatic = commercial.length === 1 && !workspaces.some(workspace => workspace.organizationRole === 'administration') ? commercial[0] : null;
      workspaceStore.replace(workspaces, automatic?.id);
    }).catch((error) => {
      if (revision === membershipRevision && sessionStore.getSnapshot().user?.uid === snapshot.user.uid) workspaceStore.failLoad(error);
    });
  });
  controller.start();
  router.start();
  sessionStore.start().then(
    () => router.refresh(),
    () => router.refresh(),
  );

  return () => {
    controller.stop();
    router.stop();
    sessionStore.stop();
    unsubscribeMemberships();
    unsavedChanges.dispose();
  };
}
