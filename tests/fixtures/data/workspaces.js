import { ROUTE_PATHS } from "../../../src/app/routes.js";

const workspace = (value) => Object.freeze({
  ...value,
  userRoles: Object.freeze([...value.userRoles]),
  permissions: Object.freeze([...value.permissions]),
});

export const DEMO_WORKSPACES = Object.freeze([
  workspace({
    id: "workspace-buyer-alpha",
    organizationId: "org-alpha",
    organizationName: "Indústrias Alpha",
    organizationRole: "buyer",
    userRoles: ["buyer", "manager"],
    permissions: ["demands:read", "proposals:compare", "orders:read"],
    homeRoute: ROUTE_PATHS.buyerHome,
  }),
  workspace({
    id: "workspace-supplier-vetor",
    organizationId: "org-vetor",
    organizationName: "Vetor Componentes Industriais",
    organizationRole: "supplier",
    userRoles: ["commercial", "operations", "quality"],
    permissions: ["opportunities:read", "proposals:read-own", "orders:execute", "quality:record"],
    homeRoute: ROUTE_PATHS.supplierHome,
  }),
  workspace({
    id: "workspace-admin-sivi",
    organizationId: "sivi-platform",
    organizationName: "Administração SIVI",
    organizationRole: "administration",
    userRoles: ["platform-admin"],
    permissions: ["organizations:review", "catalogs:curate", "audit:read"],
    homeRoute: ROUTE_PATHS.adminHome,
  }),
]);
