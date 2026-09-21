import assert from "node:assert/strict";
import test from "node:test";
import { resolveRuntimeConfig } from "../../src/config/runtime-config.js";

test("enables Auth Emulator only on an explicit local URL", () => {
  const local = resolveRuntimeConfig("http://127.0.0.1:4173/?authEmulator=1#/acesso");
  const localHttps = resolveRuntimeConfig("https://127.0.0.1:4173/?authEmulator=1#/acesso");
  const production = resolveRuntimeConfig("https://sivi.example/?authEmulator=1#/acesso");
  assert.equal(local.useAuthEmulator, true);
  assert.equal(local.useDatabaseEmulator, true);
  assert.equal(local.databaseEmulatorHost, "127.0.0.1");
  assert.equal(local.databaseEmulatorPort, 9000);
  assert.equal(local.persistUserProfile, false);
  assert.equal(localHttps.useAuthEmulator, false);
  assert.equal(production.useAuthEmulator, false);
  assert.equal(production.persistUserProfile, true);
});
