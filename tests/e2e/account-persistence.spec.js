import { expect, test } from "@playwright/test";
import {
  createVerifiedUser,
  resetAuthEmulator,
  resetDatabaseEmulator,
  seedDatabaseEmulator,
} from "../helpers/auth-emulator.js";

test("account name persists under the existing RTDB rules without replacing the stored profile", async ({ page }) => {
  const account = { email: "account-persistence@sivi.test", password: "SiviLocal2026", displayName: "Ana Compradora" };
  const productionRequests = [];
  const isProductionFirebase = (hostname) => [
    "identitytoolkit.googleapis.com", "securetoken.googleapis.com", "firebasestorage.googleapis.com",
  ].includes(hostname) || /\.(firebaseio\.com|firebasedatabase\.app|firebaseapp\.com)$/.test(hostname);
  page.on("websocket", (socket) => {
    if (isProductionFirebase(new URL(socket.url()).hostname)) productionRequests.push(socket.url());
  });
  await page.route("**/*", (route) => {
    const request = route.request();
    if (isProductionFirebase(new URL(request.url()).hostname)) {
      productionRequests.push(request.url());
      return route.abort();
    }
    return route.continue();
  });
  // Exercise the service against the real SDK without mounting unrelated application pages.
  await page.route("**/src/main.js", (route) => route.fulfill({
    contentType: "text/javascript", body: 'import "/src/config/firebase.js";',
  }));

  await resetAuthEmulator();
  await resetDatabaseEmulator();
  const owner = await createVerifiedUser(account);
  const before = {
    uid: owner.uid, email: owner.email, displayName: account.displayName,
    firstName: "Ana", lastName: "Compradora", authProvider: "password", emailVerified: true,
    onboardingState: "profile_pending", createdAt: 1, updatedAt: 2, lastLoginAt: 3,
  };
  await seedDatabaseEmulator(`users/${owner.uid}`, before);
  await page.goto("/?authEmulator=1#/acesso");

  const result = await page.evaluate(async ({ email, password }) => {
    const [{ auth, database }, { runtimeConfig }, { createAccountProfileUpdater }, { createFirebaseDataClient }, authSdk, databaseSdk] = await Promise.all([
      import("/src/config/firebase.js"),
      import("/src/config/runtime-config.js"),
      import("/src/services/account-profile.js"),
      import("/src/services/firebase-data-client.js"),
      import("firebase/auth"),
      import("firebase/database"),
    ]);
    if (!runtimeConfig.useAuthEmulator || !runtimeConfig.useDatabaseEmulator) {
      throw new Error("Este teste requer exclusivamente os emuladores locais.");
    }
    await authSdk.signInWithEmailAndPassword(auth, email, password);
    const updater = createAccountProfileUpdater({
      getUser: () => auth.currentUser,
      saveAuthProfile: authSdk.updateProfile,
      client: createFirebaseDataClient(database),
      persistUserProfile: true,
    });
    const saved = await updater({ displayName: "  Ana Luísa d’Ávila  " });
    const snapshot = await databaseSdk.get(databaseSdk.ref(database, `users/${auth.currentUser.uid}`));
    await auth.currentUser.reload();
    return {
      profileSaved: saved.profileSaved,
      sessionChanged: saved.sessionChanged,
      uid: auth.currentUser.uid,
      authName: auth.currentUser.displayName,
      authEmail: auth.currentUser.email,
      stored: snapshot.val(),
    };
  }, account);

  expect(result.profileSaved).toBe(true);
  expect(result.sessionChanged).toBe(false);
  expect(result.uid).toBe(owner.uid);
  expect(result.authName).toBe("Ana Luísa d’Ávila");
  expect(result.authEmail).toBe(owner.email);
  expect(result.stored.displayName).toBe("Ana Luísa d’Ávila");
  expect(typeof result.stored.updatedAt).toBe("number");
  expect(result.stored.updatedAt).toBeGreaterThan(before.updatedAt);
  const { displayName, updatedAt, ...preserved } = result.stored;
  const { displayName: oldName, updatedAt: oldUpdatedAt, ...expectedPreserved } = before;
  expect(preserved).toEqual(expectedPreserved);
  expect(productionRequests).toEqual([]);
});
