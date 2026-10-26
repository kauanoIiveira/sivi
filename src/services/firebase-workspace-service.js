import { normalizeApplication, canResubmitApplication } from '../domain/organization-application.js';
import { createPendingCommands } from '../core/pending-commands.js';
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

export function createFirebaseWorkspaceService({ client, getUser, storage }) {
  const pendingApplications = createPendingCommands({ storage, key: 'sivi.pending-companies.v1' });
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
      const groups = await Promise.all(Object.entries(records ?? {}).map(async ([organizationId, membership]) => {
        const organization = await client.read(`organizations/${organizationId}`);
        const effective = { ...membership, organizationName: organization?.name ?? membership.organizationName, status: !organization ? 'blocked' : organization.status === 'active' ? membership.status : organization.status };
        return createOrganizationWorkspaces(user.uid, organizationId, effective).filter(workspace => !organization?.roles || organization.roles[workspace.organizationRole] === true);
      }));
      const workspaces = groups.flat();
      if (administrator === true) workspaces.push(createAdministrationWorkspace(user.uid));
      return workspaces.sort((left, right) => {
        if (left.organizationRole === "administration") return -1;
        if (right.organizationRole === "administration") return 1;
        return left.organizationName.localeCompare(right.organizationName, "pt-BR")
          || left.organizationRole.localeCompare(right.organizationRole);
      });
    },
    async createOrganization(input, { organizationId: suppliedId } = {}) {
      const user = requireUser(getUser);
      const roles = normalizeOrganizationRoles(input?.roles ?? input?.role);
      const organizationName = cleanOrganizationName(input?.name);
      if (user.emailVerified === false) throw new Error('Confirme seu e-mail antes de cadastrar a empresa.');
      const intent = JSON.stringify([user.uid, input]);
      const pendingId = pendingApplications.get(intent);
      if (suppliedId && !/^signup-[A-Za-z0-9_-]{1,100}$/.test(suppliedId)) throw new Error('O identificador do cadastro não é válido.');
      const organizationId = suppliedId ?? pendingId ?? client.newKey("organizations");
      pendingApplications.set(intent, organizationId);
      if (pendingId || suppliedId) {
        const existing = await client.read(`membershipsByUser/${user.uid}/${organizationId}`);
        if (existing) {
          if (suppliedId) {
            const previous = await client.read(`organizations/${organizationId}`);
            const expected = normalizeApplication(input);
            const matches = previous?.createdBy === user.uid && ['name','cnpj','city','state','contact'].every(key => previous[key] === expected[key])
              && JSON.stringify(normalizeOrganizationRoles(previous.roles).sort()) === JSON.stringify([...expected.roles].sort());
            if (!matches) throw new Error('Este envio já foi registrado com dados diferentes. Consulte o cadastro existente antes de reenviar.');
            existing.status = previous.status;
          }
          pendingApplications.delete(intent);
          return { organizationId, status: existing.status, workspaces: createOrganizationWorkspaces(user.uid, organizationId, existing) };
        }
      }
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
      pendingApplications.delete(intent);
      return {
        organizationId,
        status: "pending",
        workspaces: createOrganizationWorkspaces(user.uid, organizationId, membership),
      };
    },
  });
}
