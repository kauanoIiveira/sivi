const baseUrl = "http://127.0.0.1:9099";
const projectId = "sivi-org";

export async function resetAuthEmulator() {
  const response = await fetch(`${baseUrl}/emulator/v1/projects/${projectId}/accounts`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Auth reset failed: ${response.status}`);
}

export async function resetDatabaseEmulator() {
  const response = await fetch("http://127.0.0.1:9000/.json?ns=sivi-org-default-rtdb", {
    method: "DELETE",
    headers: { Authorization: "Bearer owner" },
  });
  if (!response.ok) throw new Error(`Database reset failed: ${response.status}`);
}

export async function seedDatabaseEmulator(path, value) {
  const response = await fetch(`http://127.0.0.1:9000/${path}.json?ns=sivi-org-default-rtdb`, {
    method: "PUT",
    headers: { Authorization: "Bearer owner", "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!response.ok) throw new Error(`Database seed failed: ${response.status}`);
}

export async function createVerifiedUser({ email, password, displayName }) {
  const signup = await fetch(
    `${baseUrl}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  const account = await signup.json();
  if (!signup.ok) throw new Error(account.error?.message ?? "Auth signup failed");

  const requestVerification = await fetch(
    `${baseUrl}/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=demo-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: account.idToken,
        requestType: "VERIFY_EMAIL",
      }),
    },
  );
  if (!requestVerification.ok) {
    throw new Error(`Auth verification request failed: ${requestVerification.status}`);
  }

  const codesResponse = await fetch(`${baseUrl}/emulator/v1/projects/${projectId}/oobCodes`);
  const codes = await codesResponse.json();
  const code = codes.oobCodes?.find(
    (candidate) => candidate.email === email && candidate.requestType === "VERIFY_EMAIL",
  );
  if (!code?.oobCode) throw new Error("Auth verification code was not emitted");

  const verify = await fetch(
    `${baseUrl}/identitytoolkit.googleapis.com/v1/accounts:update?key=demo-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oobCode: code.oobCode }),
    },
  );
  if (!verify.ok) throw new Error(`Auth verification failed: ${verify.status}`);

  const signIn = await fetch(
    `${baseUrl}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  const verifiedAccount = await signIn.json();
  if (!signIn.ok) throw new Error(verifiedAccount.error?.message ?? "Verified sign-in failed");

  const updateName = await fetch(
    `${baseUrl}/identitytoolkit.googleapis.com/v1/accounts:update?key=demo-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: verifiedAccount.idToken,
        displayName,
        returnSecureToken: true,
      }),
    },
  );
  if (!updateName.ok) throw new Error(`Auth display name update failed: ${updateName.status}`);
  return { uid: verifiedAccount.localId, email, displayName };
}
