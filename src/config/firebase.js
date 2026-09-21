import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { runtimeConfig } from "./runtime-config.js";

// A configuração do cliente Firebase é pública por definição. A proteção dos
// dados continua sendo responsabilidade das regras do Realtime Database.
const firebaseConfig = {
  apiKey: "AIzaSyDagyynnes8oQ3UXkNPshFHlHj3HirYBtQ",
  authDomain: "sivi-org.firebaseapp.com",
  projectId: "sivi-org",
  storageBucket: "sivi-org.firebasestorage.app",
  messagingSenderId: "406010546871",
  appId: "1:406010546871:web:92e4ec68b6499e9c3b9b32",
  measurementId: "G-S5T0M7E2EH",
  databaseURL: "https://sivi-org-default-rtdb.firebaseio.com",
};

const requiredKeys = ["apiKey", "authDomain", "projectId", "appId", "databaseURL"];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  throw new Error(`Configuração Firebase ausente: ${missingKeys.join(", ")}`);
}

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

if (runtimeConfig?.useAuthEmulator === true) {
  connectAuthEmulator(auth, runtimeConfig.authEmulatorUrl, { disableWarnings: true });
}

export const database = getDatabase(firebaseApp);
if (runtimeConfig?.useDatabaseEmulator === true) {
  connectDatabaseEmulator(database, runtimeConfig.databaseEmulatorHost, runtimeConfig.databaseEmulatorPort);
}

auth.languageCode = "pt-BR";
