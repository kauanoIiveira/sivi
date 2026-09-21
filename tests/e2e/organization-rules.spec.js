import { expect, test } from "@playwright/test";
import { createVerifiedUser, resetAuthEmulator, resetDatabaseEmulator, seedDatabaseEmulator } from "../helpers/auth-emulator.js";

test("only the administrator can read another membership and approve all records atomically", async () => {
  await resetAuthEmulator();
  await resetDatabaseEmulator();
  const password = "SiviRules2026";
  const admin = await createVerifiedUser({ email: "rules-admin@sivi.test", password, displayName: "Admin" });
  const owner = await createVerifiedUser({ email: "rules-owner@sivi.test", password, displayName: "Owner" });
  const stranger = await createVerifiedUser({ email: "rules-stranger@sivi.test", password, displayName: "Stranger" });
  const token = async email => {
    const result = await fetch("http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    return (await result.json()).idToken;
  };
  const [adminToken, ownerToken, strangerToken] = await Promise.all([admin, owner, stranger].map(user => token(user.email)));
  const organization = { id: "rules-org", name: "Indústria de teste", roles: { buyer: true }, status: "pending", createdBy: owner.uid, createdAt: 1, updatedAt: 1 };
  const membership = { organizationName: organization.name, organizationRoles: { buyer: true }, status: "pending", userRoles: ["owner"], permissions: { buyer: ["demands:write"] }, createdAt: 1 };
  await seedDatabaseEmulator(`platformAdmins/${admin.uid}`, true);
  await seedDatabaseEmulator("organizations/rules-org", organization);
  await seedDatabaseEmulator(`membershipsByUser/${owner.uid}/rules-org`, membership);
  await seedDatabaseEmulator(`organizationMembers/rules-org/${owner.uid}`, { status: "pending", userRoles: ["owner"], joinedAt: 1 });
  const request = (path, auth, options = {}) => fetch(`http://127.0.0.1:9000/${path}.json?ns=sivi-org-default-rtdb&auth=${auth}`, options);
  expect((await request(`membershipsByUser/${owner.uid}/rules-org`, strangerToken)).status).toBe(401);
  expect((await request(`membershipsByUser/${owner.uid}/rules-org`, adminToken)).status).toBe(200);
  const update = {
    "organizations/rules-org/status": "active",
    "organizations/rules-org/reviewedApplicationUpdatedAt": 1,
    [`membershipsByUser/${owner.uid}/rules-org/status`]: "active",
    [`organizationMembers/rules-org/${owner.uid}/status`]: "active",
  };
  const patch = { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(update) };
  const stale = { ...patch, body: JSON.stringify({ ...update, 'organizations/rules-org/reviewedApplicationUpdatedAt': 0 }) };
  expect((await request('', adminToken, stale)).status).toBe(401);
  expect((await request("", ownerToken, patch)).status).toBe(401);
  expect((await request("", adminToken, patch)).status).toBe(200);
  expect((await (await request(`membershipsByUser/${owner.uid}/rules-org`, ownerToken)).json()).status).toBe("active");
});
