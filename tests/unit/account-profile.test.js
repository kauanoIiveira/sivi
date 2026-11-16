import assert from "node:assert/strict";
import test from "node:test";
import { createAccountProfileUpdater } from "../../src/services/account-profile.js";

function context({ persistUserProfile = true, authError = null, profileError = null } = {}) {
  const user = {
    uid: "account-1", email: "user@sivi.test", displayName: "Nome anterior",
    emailVerified: true, isAnonymous: false, photoURL: "https://example.test/avatar.png",
    providerData: [{ providerId: "password", uid: "user@sivi.test" }],
  };
  let currentUser = user;
  const profile = {
    uid: "account-1", email: "user@sivi.test", displayName: "Nome anterior",
    firstName: "Nome", lastName: "anterior", authProvider: "password", emailVerified: true,
    onboardingState: "profile_pending", createdAt: 10, updatedAt: 20, lastLoginAt: 20,
  };
  const state = {
    users: { "account-1": profile, "account-2": { displayName: "Outra pessoa" } },
    membershipsByUser: { "account-1": { company: { role: "owner", status: "active" } } },
    organizations: { company: { name: "Empresa", status: "active" } },
  };
  const writes = [];
  const authUpdates = [];
  const adapters = {
    getUser: () => currentUser,
    persistUserProfile,
    async saveAuthProfile(target, input) {
      if (authError) throw authError;
      authUpdates.push({ uid: target.uid, input: { ...input } });
      Object.assign(target, input);
    },
    client: {
      timestamp: () => ({ ".sv": "timestamp" }),
      async patch(updates) {
        if (profileError) throw profileError;
        writes.push(structuredClone(updates));
        for (const [path, value] of Object.entries(updates)) {
          const parts = path.split("/");
          const key = parts.pop();
          const parent = parts.reduce((node, part) => node[part] ??= {}, state);
          parent[key] = structuredClone(value);
        }
      },
    },
  };
  return {
    user, state, writes, authUpdates, adapters,
    setUser: (next) => { currentUser = next; },
    update: (input) => createAccountProfileUpdater(adapters)(input),
  };
}

test("account display name updates preserve identity, timestamps and organization permissions", async () => {
  const fixture = context();
  const before = structuredClone(fixture.state);
  const result = await fixture.update({ displayName: "  Ana Luísa d’Ávila  " });

  assert.equal(fixture.user.displayName, "Ana Luísa d’Ávila");
  assert.equal(fixture.user.photoURL, "https://example.test/avatar.png");
  assert.deepEqual(fixture.authUpdates, [{ uid: "account-1", input: { displayName: "Ana Luísa d’Ávila" } }]);
  assert.deepEqual(fixture.writes, [{
    "users/account-1/displayName": "Ana Luísa d’Ávila",
    "users/account-1/updatedAt": { ".sv": "timestamp" },
  }]);
  const { displayName, updatedAt, ...preserved } = fixture.state.users["account-1"];
  const { displayName: oldName, updatedAt: oldUpdatedAt, ...expectedPreserved } = before.users["account-1"];
  assert.deepEqual(preserved, expectedPreserved);
  assert.deepEqual(fixture.state.membershipsByUser, before.membershipsByUser);
  assert.deepEqual(fixture.state.organizations, before.organizations);
  assert.deepEqual(fixture.state.users["account-2"], before.users["account-2"]);
  assert.equal(displayName, "Ana Luísa d’Ávila");
  assert.deepEqual(updatedAt, { ".sv": "timestamp" });
  assert.deepEqual(result, { user: fixture.user, profileSaved: true, sessionChanged: false });
});

test("invalid account names are rejected before writing either service", async () => {
  const fixture = context();
  for (const displayName of [undefined, null, 42, "", "  ", "A", "a".repeat(121), "Ana\nSilva", "Ana\u0000Silva"]) {
    await assert.rejects(fixture.update({ displayName }), { code: "auth/invalid-display-name" });
  }
  assert.equal(fixture.user.displayName, "Nome anterior");
  assert.deepEqual(fixture.authUpdates, []);
  assert.deepEqual(fixture.writes, []);
});

test("account name accepts the database limits without imposing ASCII-only rules", async () => {
  const fixture = context();
  await fixture.update({ displayName: "李明" });
  assert.equal(fixture.user.displayName, "李明");
  await fixture.update({ displayName: "a".repeat(120) });
  assert.equal(fixture.state.users["account-1"].displayName, "a".repeat(120));
});

test("signed-out and anonymous sessions cannot update an account", async () => {
  const fixture = context();
  fixture.setUser(null);
  await assert.rejects(fixture.update({ displayName: "Nome novo" }), { code: "auth/no-current-user" });
  fixture.setUser({ ...fixture.user, isAnonymous: true });
  await assert.rejects(fixture.update({ displayName: "Nome novo" }), { code: "auth/no-current-user" });
  assert.deepEqual(fixture.authUpdates, []);
  assert.deepEqual(fixture.writes, []);
});

test("Authentication rejection leaves the stored account unchanged", async () => {
  const error = Object.assign(new Error("Offline"), { code: "auth/network-request-failed" });
  const fixture = context({ authError: error });
  const before = structuredClone(fixture.state);
  await assert.rejects(fixture.update({ displayName: "Nome novo" }), error);
  assert.equal(fixture.user.displayName, "Nome anterior");
  assert.deepEqual(fixture.state, before);
  assert.deepEqual(fixture.writes, []);
});

test("database rejection reports a partial save while keeping the Authentication name", async () => {
  const fixture = context({ profileError: new Error("PERMISSION_DENIED") });
  const result = await fixture.update({ displayName: "Nome novo" });
  assert.equal(fixture.user.displayName, "Nome novo");
  assert.equal(fixture.state.users["account-1"].displayName, "Nome anterior");
  assert.deepEqual(result, { user: fixture.user, profileSaved: false, sessionChanged: false });
});

test("emulator mode saves the Authentication name without attempting database persistence", async () => {
  const fixture = context({ persistUserProfile: false });
  fixture.adapters.client = null;
  const result = await fixture.update({ displayName: "Nome novo" });
  assert.equal(fixture.user.displayName, "Nome novo");
  assert.deepEqual(fixture.writes, []);
  assert.deepEqual(result, { user: fixture.user, profileSaved: true, sessionChanged: false });
});

test("a session change during Authentication save prevents a database write for the former account", async () => {
  for (const nextUser of [null, { uid: "account-2", isAnonymous: false }]) {
    const fixture = context();
    fixture.adapters.saveAuthProfile = async (target, input) => {
      Object.assign(target, input);
      fixture.setUser(nextUser);
    };
    const result = await fixture.update({ displayName: "Nome novo" });
    assert.equal(fixture.user.displayName, "Nome novo");
    assert.deepEqual(fixture.writes, []);
    assert.deepEqual(result, { user: fixture.user, profileSaved: false, sessionChanged: true });
  }
});

test("a session change during database persistence remains visible in the save result", async () => {
  const fixture = context();
  const patch = fixture.adapters.client.patch;
  fixture.adapters.client.patch = async (updates) => {
    await patch(updates);
    fixture.setUser({ uid: "account-2", isAnonymous: false });
  };
  const result = await fixture.update({ displayName: "Nome novo" });
  assert.equal(fixture.state.users["account-1"].displayName, "Nome novo");
  assert.equal(fixture.state.users["account-2"].displayName, "Outra pessoa");
  assert.deepEqual(result, { user: fixture.user, profileSaved: true, sessionChanged: true });
});
