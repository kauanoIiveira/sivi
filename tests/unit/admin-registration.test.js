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
