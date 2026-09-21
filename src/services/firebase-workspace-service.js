import { normalizeApplication, canResubmitApplication } from '../domain/organization-application.js';
import {
  cleanOrganizationName,
  createAdministrationWorkspace,
  createOrganizationWorkspaces,
  normalizeOrganizationRoles,
  organizationRoleMap,
} from "../domain/organization-model.js";

function requireUser(getUser) {
  const user = getUser?.();
  if (!user?.uid) throw new Error("Sua sessão expirou. Entre novamente.");
  return user;
}

export function createFirebaseWorkspaceService({ client, getUser }) {
  return Object.freeze({
    async getOrganization(id) {
      requireUser(getUser);
      return client.read(`organizations/${id}`);
    },
    async resubmitOrganization(id, input) {
      const user = requireUser(getUser);
      const organization = await client.read(`organizations/${id}`);
      if (organization?.createdBy !== user.uid || !canResubmitApplication(organization.status)) throw new Error('Este cadastro não está disponível para correção. Atualize a situação.');
      const values = normalizeApplication(input);
      const roles = organizationRoleMap(values.roles);
      const membershipPath = `membershipsByUser/${user.uid}/${id}`;
      await client.patch({
        [`organizations/${id}`]: { ...organization, ...values, roles, status: 'pending', updatedAt: client.timestamp?.() ?? Date.now() },
        [`${membershipPath}/organizationName`]: values.name,
        [`${membershipPath}/organizationRoles`]: roles,
        [`${membershipPath}/status`]: 'pending',
        [`organizationMembers/${id}/${user.uid}/status`]: 'pending',
      });
    },
    async listWorkspaces() {
      const user = requireUser(getUser);
      const [records, administrator] = await Promise.all([
        client.read(`membershipsByUser/${user.uid}`),
        client.read(`platformAdmins/${user.uid}`),
      ]);
      const workspaces = Object.entries(records ?? {})
        .flatMap(([organizationId, membership]) =>
          createOrganizationWorkspaces(user.uid, organizationId, membership));
      if (administrator === true) workspaces.push(createAdministrationWorkspace(user.uid));
      return workspaces.sort((left, right) => {
        if (left.organizationRole === "administration") return -1;
        if (right.organizationRole === "administration") return 1;
        return left.organizationName.localeCompare(right.organizationName, "pt-BR")
          || left.organizationRole.localeCompare(right.organizationRole);
      });
    },
    async createOrganization(input) {
      const user = requireUser(getUser);
      const roles = normalizeOrganizationRoles(input?.roles ?? input?.role);
      const organizationName = cleanOrganizationName(input?.name);
      const organizationId = client.newKey("organizations");
      if (!organizationId) throw new Error("Não foi possível gerar o identificador da empresa.");
      const createdAt = client.timestamp?.() ?? Date.now();
      const organizationRoles = organizationRoleMap(roles);
      const permissions = Object.fromEntries(roles.map((role) => [role, role === "buyer"
        ? ["demands:write", "proposals:compare", "orders:read"]
        : ["opportunities:read", "proposals:write-own", "orders:execute"]]));
      const membership = {
        organizationName,
        organizationRoles,
        status: "pending",
        userRoles: ["owner"],
        permissions,
        createdAt,
      };
      const organization = {
        ...(input?.onboardingVersion === 1 ? normalizeApplication(input) : {}),
        id: organizationId,
        name: organizationName,
        roles: organizationRoles,
        status: "pending",
        createdBy: user.uid,
        createdAt,
        updatedAt: createdAt,
      };
      await client.patch({
        [`organizations/${organizationId}`]: organization,
        [`membershipsByUser/${user.uid}/${organizationId}`]: membership,
        [`organizationMembers/${organizationId}/${user.uid}`]: {
          status: "pending",
          userRoles: ["owner"],
          joinedAt: createdAt,
        },
      });
      return {
        organizationId,
        status: "pending",
        workspaces: createOrganizationWorkspaces(user.uid, organizationId, membership),
      };
    },
  });
}
