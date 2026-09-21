import { ROUTE_PATHS } from "../app/routes.js";

export const ORGANIZATION_STATUSES = Object.freeze(["pending", "changes_requested", "rejected", "active", "blocked"]);
export const ORGANIZATION_ROLES = Object.freeze(["buyer", "supplier"]);

const roleSettings = Object.freeze({
  buyer: Object.freeze({
    homeRoute: ROUTE_PATHS.buyerHome,
    userRoles: Object.freeze(["buyer", "owner"]),
    permissions: Object.freeze(["demands:write", "proposals:compare", "orders:read"]),
  }),
  supplier: Object.freeze({
    homeRoute: ROUTE_PATHS.supplierHome,
    userRoles: Object.freeze(["supplier", "owner"]),
    permissions: Object.freeze(["opportunities:read", "proposals:write-own", "orders:execute"]),
  }),
  administration: Object.freeze({
    homeRoute: ROUTE_PATHS.adminHome,
    userRoles: Object.freeze(["platform-admin"]),
    permissions: Object.freeze(["organizations:review"]),
  }),
});

export function cleanOrganizationName(value) {
  const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 120) {
    throw new Error("Informe o nome da empresa (2 a 120 caracteres).");
  }
  return name;
}
export function normalizeOrganizationRoles(input) {
  const candidates = Array.isArray(input)
    ? input
    : input && typeof input === "object"
      ? Object.entries(input).filter(([, enabled]) => enabled === true).map(([role]) => role)
      : typeof input === "string" ? [input] : [];
  const roles = [...new Set(candidates.filter((role) => ORGANIZATION_ROLES.includes(role)))];
  if (!roles.length) throw new Error("Escolha Comprador, Fornecedor ou ambas as atuações.");
  return roles;
}

export function organizationRoleMap(roles) {
  const normalized = normalizeOrganizationRoles(roles);
  return Object.freeze({
    buyer: normalized.includes("buyer"),
    supplier: normalized.includes("supplier"),
  });
}

function membershipRoles(membership) {
  if (membership?.organizationRoles) return normalizeOrganizationRoles(membership.organizationRoles);
  if (membership?.organizationRole) return normalizeOrganizationRoles(membership.organizationRole);
  return [];
}

export function createOrganizationWorkspaces(uid, organizationId, membership) {
  if (!uid || !organizationId || !membership) return [];
  const status = ORGANIZATION_STATUSES.includes(membership.status) ? membership.status : "pending";
  const roles = membershipRoles(membership);
  const dual = roles.length > 1;
  return roles.map((role) => {
    const settings = roleSettings[role];
    return Object.freeze({
      id: dual ? `${organizationId}:${role}` : organizationId,
      organizationId,
      organizationName: membership.organizationName,
      organizationRole: role,
      organizationRoles: Object.freeze([...roles]),
      organizationStatus: status,
      canEnter: status === "active",
      memberUid: uid,
      userRoles: Object.freeze([...(membership.userRoles ?? settings.userRoles)]),
      permissions: Object.freeze([...(membership.permissions?.[role] ?? (Array.isArray(membership.permissions) ? membership.permissions : settings.permissions))]),
      homeRoute: settings.homeRoute,
    });
  });
}

export function createAdministrationWorkspace(uid) {
  const settings = roleSettings.administration;
  return Object.freeze({
    id: `administration:${uid}`,
    organizationId: "sivi-platform",
    organizationName: "Administração SIVI",
    organizationRole: "administration",
    organizationRoles: Object.freeze(["administration"]),
    organizationStatus: "active",
    canEnter: true,
    memberUid: uid,
    userRoles: settings.userRoles,
    permissions: settings.permissions,
    homeRoute: settings.homeRoute,
  });
}
