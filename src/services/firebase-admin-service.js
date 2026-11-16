import { cleanOrganizationName, normalizeOrganizationRoles, organizationRoleMap } from "../domain/organization-model.js";
import { normalizeApplication } from '../domain/organization-application.js';
import { createPendingCommands } from '../core/pending-commands.js';

const allowedStatuses = new Set(["active", "blocked", "changes_requested", "rejected"]);

function requireUser(getUser) {
  const user = getUser?.();
  if (!user?.uid) throw new Error("Sua sessão expirou. Entre novamente.");
  return user;
}

export function createFirebaseAdminService({ client, getUser, storage }) {
  const pending = createPendingCommands({ storage, key: 'sivi.pending-admin-companies.v1' });
  async function requireAdministrator() {
    const user = requireUser(getUser);
    const allowed = await client.read(`platformAdmins/${user.uid}`);
    if (allowed !== true) throw new Error("Somente a administração SIVI pode executar esta ação.");
    return user;
  }

  return Object.freeze({
    async registerOrganization(input) {
      const user = await requireAdministrator();
      const name = cleanOrganizationName(input?.name);
      const roles = normalizeOrganizationRoles(input?.roles);
      const companyDetails = input?.onboardingVersion === 1 ? normalizeApplication(input) : {};
      const email = String(input?.ownerEmail ?? "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error("Informe o e-mail do responsável.");
      const found = Object.values(await client.findUserByEmail(email) ?? {});
      if (found.length !== 1 || !found[0].uid) throw new Error("Responsável não encontrado. Peça que crie uma conta no SIVI, confirme o e-mail e entre uma vez. Depois, tente novamente.");
      const owner = found[0];
      if (owner.emailVerified !== true) throw new Error("O responsável precisa confirmar o e-mail e entrar novamente no SIVI.");
      const intent = JSON.stringify([user.uid, owner.uid, name, roles, companyDetails]);
      const pendingId = pending.get(intent);
      if (pendingId) {
        const created = await client.read(`organizations/${pendingId}`);
        if (created?.registeredBy === user.uid && created.createdBy === owner.uid) {
          pending.delete(intent); return { id: pendingId, name: created.name, ownerEmail: email };
        }
      }
      const id = pendingId ?? client.newKey("organizations");
      if (!id) throw new Error("Não foi possível gerar o identificador da empresa.");
      const createdAt = client.timestamp?.() ?? Date.now();
      const organizationRoles = organizationRoleMap(roles);
      const permissions = Object.fromEntries(roles.map(role => [role, role === "buyer"
        ? ["demands:write", "proposals:compare", "orders:read"]
        : ["opportunities:read", "proposals:write-own", "orders:execute"]]));
      pending.set(intent, id);
      await client.patch({
        [`organizations/${id}`]: { ...companyDetails, id, name, roles: organizationRoles, status: "active", createdBy: owner.uid, registeredBy: user.uid, createdAt, updatedAt: createdAt },
        [`membershipsByUser/${owner.uid}/${id}`]: { organizationName: name, organizationRoles, status: "active", userRoles: ["owner"], permissions, createdAt },
        [`organizationMembers/${id}/${owner.uid}`]: { status: "active", userRoles: ["owner"], joinedAt: createdAt },
      });
      pending.delete(intent);
      return { id, name, ownerEmail: email };
    },
    async isAdministrator() {
      const user = requireUser(getUser);
      return (await client.read(`platformAdmins/${user.uid}`)) === true;
    },
    async listOrganizations() {
      await requireAdministrator();
      const records = await client.read("organizations");
      const priority = { pending: 0, changes_requested: 1, rejected: 2, blocked: 3, active: 4 };
      return Object.values(records ?? {}).sort((left, right) =>
        (priority[left.status] ?? 5) - (priority[right.status] ?? 5) || (left.createdAt ?? 0) - (right.createdAt ?? 0));
    },
    async setOrganizationStatus(organizationId, status, reason = "", expectedUpdatedAt = undefined) {
      const user = await requireAdministrator();
      if (!allowedStatuses.has(status)) throw new Error("Escolha uma decisão válida para o cadastro.");
      const organization = await client.read(`organizations/${organizationId}`);
      if (!organization?.createdBy) throw new Error("Empresa não encontrada.");
      if (expectedUpdatedAt !== undefined && organization.updatedAt !== expectedUpdatedAt) throw new Error('O cadastro mudou desde a última consulta. Atualize as solicitações e revise os dados antes de decidir.');
      if (['changes_requested', 'rejected'].includes(status) && !['pending', 'changes_requested'].includes(organization.status)) throw new Error('Esta solicitação não está em análise. Atualize a lista.');
      const organizationRoles = organization.roles
        ?? organizationRoleMap(organization.role);
      const membershipPath = `membershipsByUser/${organization.createdBy}/${organizationId}`;
      const memberPath = `organizationMembers/${organizationId}/${organization.createdBy}`;
      const [membership, member] = await Promise.all([
        client.read(membershipPath),
        client.read(memberPath),
      ]);
      const reviewReason = String(reason ?? "").trim();
      if (status !== 'active' && reviewReason.length < 3) throw new Error('Informe o motivo da decisão (mínimo de 3 caracteres).');
      if (reviewReason.length > 300) throw new Error("O motivo deve ter no máximo 300 caracteres.");
      const reviewedAt = client.timestamp?.() ?? Date.now();
      const updates = {
        [`organizations/${organizationId}/status`]: status,
        [`organizations/${organizationId}/reviewedBy`]: user.uid,
        [`organizations/${organizationId}/reviewedAt`]: reviewedAt,
        [`organizations/${organizationId}/reviewedApplicationUpdatedAt`]: expectedUpdatedAt ?? organization.updatedAt,
        [`organizations/${organizationId}/reviewReason`]: reviewReason || (status === "active" ? organization.status === 'blocked' ? 'Acesso reativado pela administração.' : "Cadastro aprovado pela administração." : ""),
        [`organizations/${organizationId}/updatedAt`]: reviewedAt,
        [`organizations/${organizationId}/roles`]: organizationRoles,
        [membershipPath]: {
          ...(membership ?? {}),
          organizationName: membership?.organizationName ?? organization.name,
          organizationRoles,
          status,
          userRoles: membership?.userRoles ?? ["owner"],
          permissions: membership?.permissions ?? {},
          createdAt: membership?.createdAt ?? organization.createdAt,
        },
        [memberPath]: {
          ...(member ?? {}),
          status,
          userRoles: member?.userRoles ?? ["owner"],
          joinedAt: member?.joinedAt ?? organization.createdAt,
        },
      };
      const profile = await client.read(`supplierProfiles/${organizationId}`);
      if (profile) updates[`supplierProfiles/${organizationId}/organizationStatus`] = status;
      await client.patch(updates);
      return status;
    },
  });
}
