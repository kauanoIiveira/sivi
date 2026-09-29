import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const rules = JSON.parse(await readFile(new URL("../../database.rules.json", import.meta.url), "utf8")).rules;

test("declares tenant-scoped rules for every persisted marketplace collection", () => {
  for (const path of [
    "organizations",
    "platformAdmins",
    "membershipsByUser",
    "organizationMembers",
    "supplierProfiles",
    "demandsByBuyer",
    "publishedDemands",
    "matchesByDemand",
    "invitedSuppliersByBuyer",
    "opportunitiesBySupplier",
    "proposalsByBuyer",
    "proposalsBySupplier",
    "ordersByBuyer",
    "ordersBySupplier",
  ]) assert.ok(rules[path], `missing rules for ${path}`);
  assert.equal(rules[".read"], false);
  assert.equal(rules[".write"], false);
});
