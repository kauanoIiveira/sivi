import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { ref, runTransaction, serverTimestamp, set, update } from "firebase/database";
import { auth, database } from "../config/firebase.js";
import { runtimeConfig } from "../config/runtime-config.js";

async function persistProfile(user, profile, { forceCreate = false } = {}) {
  if (!runtimeConfig.persistUserProfile) return;

  const userRef = ref(database, `users/${user.uid}`);
  const payload = {
    uid: user.uid,
    email: user.email,
    authProvider: profile.authProvider,
    emailVerified: user.emailVerified,
    updatedAt: serverTimestamp(),
  };

  const displayName = user.displayName ?? profile.displayName;
  if (displayName) payload.displayName = displayName;
  if (profile.firstName !== undefined) payload.firstName = profile.firstName;
  if (profile.lastName !== undefined) payload.lastName = profile.lastName;

  if (forceCreate) {
    await set(userRef, {
      ...payload,
      onboardingState: "profile_pending",
      createdAt: serverTimestamp(),
    });
    return;
  }

  const provision = await runTransaction(
    userRef,
    (currentProfile) => {
      if (currentProfile !== null) return undefined;

      return {
        ...payload,
        onboardingState: "profile_pending",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
    },
    { applyLocally: false },
  );

  if (provision.committed) return;

  await update(userRef, {
    ...payload,
    lastLoginAt: serverTimestamp(),
  });
}

export async function registerWithEmail({ firstName, lastName, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const displayName = `${firstName} ${lastName}`.trim();
  let displayNameSaved = true;

  try {
    await updateProfile(credential.user, { displayName });
  } catch (error) {
    displayNameSaved = false;
    console.warn("A conta foi criada, mas o nome de exibição não pôde ser sincronizado no Authentication.", error);
  }

  let profileSaved = true;
  let verificationSent = true;

  try {
    await persistProfile(
      credential.user,
      {
        firstName,
        lastName,
        displayName,
        authProvider: "password",
      },
      { forceCreate: true },
    );
  } catch (error) {
    profileSaved = false;
    console.warn("A conta foi criada, mas o perfil não pôde ser salvo no Realtime Database.", error);
  }

  try {
    await sendEmailVerification(credential.user);
  } catch (error) {
    verificationSent = false;
    console.warn("A conta foi criada, mas o e-mail de verificação não pôde ser enviado.", error);
  }

  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.warn("A sessão inicial não pôde ser encerrada após o cadastro.", error);
  }

  return { user: credential.user, displayNameSaved, profileSaved, verificationSent };
}

export async function loginWithEmail({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  if (!credential.user.emailVerified) {
    let verificationResent = true;

    try {
      await sendEmailVerification(credential.user);
    } catch (verificationError) {
      verificationResent = false;
      console.warn("O e-mail ainda não foi verificado e o reenvio automático falhou.", verificationError);
    }

    try {
      await firebaseSignOut(auth);
    } catch (signOutError) {
      console.warn("A sessão não verificada não pôde ser encerrada.", signOutError);
    }

    const error = new Error("E-mail ainda não verificado.");
    error.code = verificationResent
      ? "auth/email-not-verified-verification-sent"
      : "auth/email-not-verified";
    throw error;
  }

  try {
    await persistProfile(credential.user, {
      authProvider: "password",
    });
  } catch (error) {
    console.warn("Login concluído, mas o último acesso não pôde ser registrado.", error);
  }

  return credential.user;
}

export async function loginWithProvider(providerName) {
  const providerFactories = {
    google: () => new GoogleAuthProvider(),
    github: () => new GithubAuthProvider(),
  };
  const createProvider = providerFactories[providerName];

  if (!createProvider) {
    const error = new Error("Provedor de autenticação não suportado.");
    error.code = "auth/unsupported-provider";
    throw error;
  }

  const provider = createProvider();
  const credential = await signInWithPopup(auth, provider);

  try {
    await persistProfile(credential.user, {
      displayName: credential.user.displayName,
      authProvider: providerName,
    });
  } catch (error) {
    console.warn("A autenticação foi concluída, mas o perfil não pôde ser sincronizado.", error);
  }

  return credential.user;
}

export function requestPasswordReset(email) {
  return sendPasswordResetEmail(auth, email);
}

export function observeAuthState(onUser, onError) {
  return onAuthStateChanged(auth, onUser, onError);
}

export function logout() {
  return firebaseSignOut(auth);
}

export { getAuthErrorMessage } from "./auth-errors.js";
