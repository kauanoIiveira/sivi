import test from "node:test";
import assert from "node:assert/strict";
import { createFirebaseAdminService } from "../../src/services/firebase-admin-service.js";

function setup({ admin = true, verified = true, found = true } = {}) {
  let update;
  const client = {
    read: async () => admin,
    findUserByEmail: async () => found ? { owner: { uid: "owner", email: "owner@sivi.test", emailVerified: verified } } : null,
    newKey: () => "new-org",
    timestamp: () => 10,
    patch: async value => { update = value; },
  };
  return { service: createFirebaseAdminService({ client, getUser: () => ({ uid: "admin" }) }), getUpdate: () => update };
}
test("admin registers an active company for the verified owner atomically", async () => {
  const { service, getUpdate } = setup();
  await service.registerOrganization({ name: "Indústria", roles: ["buyer", "supplier"], ownerEmail: "owner@sivi.test" });
  const update = getUpdate();
  assert.equal(update["organizations/new-org"].createdBy, "owner");
  assert.equal(update["organizations/new-org"].registeredBy, "admin");
  assert.equal(update["membershipsByUser/owner/new-org"].status, "active");
  assert.equal(update["organizationMembers/new-org/owner"].status, "active");
  assert.equal(update["membershipsByUser/admin/new-org"], undefined);
});
test("registration rejects non-admin, missing and unverified accounts without writes", async () => {
  for (const options of [{ admin: false }, { found: false }, { verified: false }]) {
    const { service, getUpdate } = setup(options);
    await assert.rejects(service.registerOrganization({ name: "Indústria", roles: ["buyer"], ownerEmail: "owner@sivi.test" }));
    assert.equal(getUpdate(), undefined);
  }
});

test('admin registration recovers an unknown write instead of creating a second company', async () => {
  const records = new Map();
  let sequence = 0, interrupted = false;
  const client = {
    read: async path => path.startsWith('platformAdmins/') ? true : records.get(path) ?? null,
    findUserByEmail: async () => ({ owner: { uid: 'owner', emailVerified: true } }),
    newKey: () => `org-${++sequence}`,
    patch: async updates => { Object.entries(updates).forEach(([key, value]) => records.set(key, value)); if (!interrupted) { interrupted = true; throw new Error('Conexão interrompida'); } },
  };
  const service = createFirebaseAdminService({ client, getUser: () => ({ uid: 'admin' }) });
  const input = { name: 'Indústria', roles: ['buyer'], ownerEmail: 'owner@sivi.test' };
  await assert.rejects(service.registerOrganization(input));
  assert.equal((await service.registerOrganization(input)).id, 'org-1');
  assert.equal(sequence, 1);
});
