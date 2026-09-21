import { normalizeSupplierProfile } from "../domain/match-engine.js";

export function createFirebaseSupplierProfileService({ client, getUser, getWorkspace }) {
  const workspace = (workspaceId) => {
    const current = getWorkspace(workspaceId);
    const user = getUser?.();
    if (!current || !user?.uid || current.memberUid !== user.uid || current.organizationRole !== "supplier" || current.organizationStatus !== "active") {
      throw new Error("Este contexto fornecedor não pode alterar o perfil industrial.");
    }
    return current;
  };

  return Object.freeze({
    async getProfile(workspaceId) {
      const current = workspace(workspaceId);
      return client.read(`supplierProfiles/${current.organizationId}`);
    },
    async saveProfile(workspaceId, input) {
      const current = workspace(workspaceId);
      const now = client.timestamp?.() ?? Date.now();
      const normalized = normalizeSupplierProfile(input, {
        organizationId: current.organizationId,
        organizationName: current.organizationName,
      });
      const previous = await client.read(`supplierProfiles/${current.organizationId}`);
      const profile = {
        ...normalized,
        organizationStatus: "active",
        updatedBy: getUser().uid,
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
      };
      await client.write(`supplierProfiles/${current.organizationId}`, profile);
      return profile;
    },
  });
}
