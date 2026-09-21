import assert from "node:assert/strict";
import test from "node:test";
import { createFirebaseMarketplaceRepository } from "../../src/repositories/firebase-marketplace-repository.js";
import { createFirebaseAdminService } from "../../src/services/firebase-admin-service.js";
import { createFirebaseSupplierProfileService } from "../../src/services/firebase-supplier-profile-service.js";
import { createFirebaseWorkspaceService } from "../../src/services/firebase-workspace-service.js";

function memoryClient() {
  let sequence = 0;
  const root = {};
  const parts = (path) => path.split("/").filter(Boolean);
  const clone = (value) => value == null ? value : structuredClone(value);
  const read = (path) => parts(path).reduce((value, key) => value?.[key], root) ?? null;
  const write = (path, value) => {
    const keys = parts(path);
    const leaf = keys.pop();
    const parent = keys.reduce((value, key) => value[key] ??= {}, root);
    if (value === null) delete parent[leaf]; else parent[leaf] = clone(value);
  };
  return {
    dump: () => clone(root),
    read: async (path) => clone(read(path)),
    write: async (path, value) => write(path, value),
    patch: async (updates) => Object.entries(updates).forEach(([path, value]) => write(path, value)),
    newKey: () => `key-${++sequence}`,
  };
}

const user = (uid) => ({ uid, email: `${uid}@sivi.test`, displayName: uid });

test('resubmission preserves the review, supports a second role and rejects other owners and closed applications', async () => {
  const client = memoryClient();
  let account = user('owner');
  const service = createFirebaseWorkspaceService({ client, getUser: () => account });
  const application = { name: 'Empresa Revisada', cnpj: '12345678000190', city: 'Campinas', state: 'SP', contact: 'contato@sivi.test', roles: ['buyer'], onboardingVersion: 1 };
  const created = await service.createOrganization(application);
  await client.write('platformAdmins/admin', true);
  const administration = createFirebaseAdminService({ client, getUser: () => user('admin') });
  await assert.rejects(administration.setOrganizationStatus(created.organizationId, 'changes_requested', ''));
  await administration.setOrganizationStatus(created.organizationId, 'changes_requested', 'Confirme o contato.');
  account = user('outsider');
  await assert.rejects(service.resubmitOrganization(created.organizationId, application));
  account = user('owner');
  await service.resubmitOrganization(created.organizationId, { ...application, roles: ['buyer', 'supplier'] });
  const organization = await service.getOrganization(created.organizationId);
  assert.equal(organization.status, 'pending');
  assert.equal(organization.reviewReason, 'Confirme o contato.');
  assert.equal((await service.listWorkspaces()).length, 2);
  await administration.setOrganizationStatus(created.organizationId, 'rejected', 'Cadastro duplicado.');
  await assert.rejects(service.resubmitOrganization(created.organizationId, application));
  await administration.setOrganizationStatus(created.organizationId, 'active');
  await assert.rejects(service.resubmitOrganization(created.organizationId, application));
});

test("creates a persisted company membership and restores its workspace", async () => {
  const client = memoryClient();
  let currentUser = user("ana");
  const service = createFirebaseWorkspaceService({ client, getUser: () => currentUser });

  const created = await service.createOrganization({ name: "Metal Alpha", roles: ["buyer", "supplier"] });
  let restored = await service.listWorkspaces();

  assert.equal(created.status, "pending");
  assert.equal(restored.length, 2);
  assert.ok(restored.every((workspace) => workspace.canEnter === false));
  assert.equal(client.dump().membershipsByUser.ana[created.organizationId].status, "pending");

  await client.write("platformAdmins/admin", true);
  currentUser = user("admin");
  const admin = createFirebaseAdminService({ client, getUser: () => currentUser });
  await admin.setOrganizationStatus(created.organizationId, "active");
  currentUser = user("ana");
  restored = await service.listWorkspaces();
  assert.deepEqual(restored.map(({ organizationRole }) => organizationRole), ["buyer", "supplier"]);
  assert.ok(restored.every((workspace) => workspace.canEnter));
});

test("administrator approval migrates a legacy single-role company", async () => {
  const client = memoryClient();
  await client.write("platformAdmins/admin", true);
  await client.write("organizations/legacy-supplier", {
    id: "legacy-supplier",
    name: "Fornecedor Legado",
    role: "supplier",
    status: "pending",
    createdBy: "legacy-owner",
    createdAt: 1,
    updatedAt: 1,
  });
  await client.write("membershipsByUser/legacy-owner/legacy-supplier", {
    organizationName: "Fornecedor Legado",
    organizationRole: "supplier",
    status: "pending",
    userRoles: ["owner"],
    permissions: ["opportunities:read"],
    createdAt: 1,
  });

  const admin = createFirebaseAdminService({ client, getUser: () => user("admin") });
  await admin.setOrganizationStatus("legacy-supplier", "active");

  const snapshot = client.dump();
  assert.deepEqual(snapshot.organizations["legacy-supplier"].roles, { buyer: false, supplier: true });
  assert.deepEqual(snapshot.membershipsByUser["legacy-owner"]["legacy-supplier"].organizationRoles, { buyer: false, supplier: true });
  assert.equal(snapshot.organizationMembers["legacy-supplier"]["legacy-owner"].status, "active");
});

test("persists the complete buyer and supplier journey without duplicate orders", async () => {
  const client = memoryClient();
  let currentUser = user("buyer-user");
  const buyerService = createFirebaseWorkspaceService({ client, getUser: () => currentUser });
  const buyerRegistration = await buyerService.createOrganization({ name: "Compradora Alpha", roles: ["buyer"] });
  currentUser = user("supplier-user");
  const supplierService = createFirebaseWorkspaceService({ client, getUser: () => currentUser });
  const supplierRegistration = await supplierService.createOrganization({ name: "Fornecedor Vetor", roles: ["supplier"] });

  await client.write("platformAdmins/admin", true);
  currentUser = user("admin");
  const admin = createFirebaseAdminService({ client, getUser: () => currentUser });
  await admin.setOrganizationStatus(buyerRegistration.organizationId, "active");
  await admin.setOrganizationStatus(supplierRegistration.organizationId, "active");
  currentUser = user("buyer-user");
  const [buyer] = await buyerService.listWorkspaces();
  currentUser = user("supplier-user");
  const [supplier] = await supplierService.listWorkspaces();

  const workspaces = new Map([[buyer.id, buyer], [supplier.id, supplier]]);
  const repository = createFirebaseMarketplaceRepository({
    client,
    getUser: () => currentUser,
    getWorkspace: (id) => workspaces.get(id),
  });

  const supplierProfiles = createFirebaseSupplierProfileService({
    client,
    getUser: () => currentUser,
    getWorkspace: (id) => workspaces.get(id),
  });
  await supplierProfiles.saveProfile(supplier.id, {
    categories: "engrenagens",
    materials: "aço 1045",
    processes: "usinagem",
    regions: "Campinas/SP",
    certifications: "ISO 9001",
    capacity: "1000",
    leadTimeDays: "20",
    description: "Usinagem de engrenagens industriais sob desenho.",
  });

  currentUser = user("buyer-user");
  const demandId = await repository.workflow.createDemand(buyer.id, {
    title: "500 engrenagens",
    requiredBy: "2026-12-20",
    destination: "Campinas/SP",
    region: "Campinas/SP",
    description: "Produção conforme desenho técnico aprovado.",
    items: [{ description: "Engrenagem industrial", category: "engrenagens", material: "aço 1045", process: "usinagem", certifications: "ISO 9001", quantity: "500", unit: "un" }],
  });
  await repository.workflow.publishDemand(buyer.id, demandId);

  currentUser = user("supplier-user");
  const opportunities = await repository.getOperations(supplier.id);
  assert.equal(opportunities.data.demands[0].match.status, "compatible");
  const versionId = await repository.workflow.sendProposal(supplier.id, demandId, {
    totalCents: 1250000,
    freightCents: 50000,
    leadTimeDays: "20",
    validUntil: "2026-12-10",
    manufacturer: "Vetor",
    payment: "28 dias",
    warranty: "12 meses",
    technical: "Atende integralmente.",
  });

  currentUser = user("buyer-user");
  const buyerData = (await repository.getOperations(buyer.id)).data;
  const proposal = buyerData.proposals[0];
  const orderId = await repository.workflow.acceptProposal(buyer.id, proposal.id, versionId);
  assert.equal(await repository.workflow.acceptProposal(buyer.id, proposal.id, versionId), orderId);

  currentUser = user("supplier-user");
  await repository.workflow.recordInspection(supplier.id, orderId, { approved: "500", plan: "PI-01 v1", evidence: "Lote aprovado." });
  await repository.workflow.dispatchOrder(supplier.id, orderId);

  currentUser = user("buyer-user");
  await repository.workflow.confirmDelivery(buyer.id, orderId);
  await repository.workflow.evaluateOrder(buyer.id, orderId, { score: "5", comment: "Entrega conforme." });

  const reloaded = createFirebaseMarketplaceRepository({ client, getUser: () => currentUser, getWorkspace: (id) => workspaces.get(id) });
  const finalData = (await reloaded.getOperations(buyer.id)).data;
  assert.equal(finalData.demands[0].status, "ordered");
  assert.equal(finalData.proposals[0].versions.length, 1);
  assert.equal(finalData.orders.length, 1);
  assert.equal(finalData.orders[0].status, "delivered");
  assert.deepEqual(finalData.orders[0].evaluation, { score: 5, comment: "Entrega conforme." });
});
