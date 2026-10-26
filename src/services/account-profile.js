function accountError(code, message) {
  return Object.assign(new Error(message), { code });
}

export function createAccountProfileUpdater({ getUser, saveAuthProfile, client, persistUserProfile = true }) {
  return async function updateAccountProfile({ displayName } = {}) {
    const user = getUser();
    if (!user?.uid || user.isAnonymous) {
      throw accountError("auth/no-current-user", "Entre na sua conta para alterar o nome.");
    }

    const name = typeof displayName === "string" ? displayName.trim() : "";
    if (name.length < 2 || name.length > 120 || /[\u0000-\u001f\u007f]/u.test(name)) {
      throw accountError("auth/invalid-display-name", "Informe um nome entre 2 e 120 caracteres.");
    }

    const uid = user.uid;
    await saveAuthProfile(user, { displayName: name });

    const sessionChanged = () => getUser()?.uid !== uid;
    if (sessionChanged()) {
      return { user, profileSaved: false, sessionChanged: true };
    }

    let profileSaved = true;
    if (persistUserProfile) {
      try {
        await client.patch({
          [`users/${uid}/displayName`]: name,
          [`users/${uid}/updatedAt`]: client.timestamp(),
        });
      } catch {
        // Authentication já confirmou o nome. A interface informa a sincronização pendente.
        profileSaved = false;
      }
    }

    return { user, profileSaved, sessionChanged: sessionChanged() };
  };
}
