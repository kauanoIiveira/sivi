import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { buildCommercialRules } from '../../scripts/refresh-commercial-rules.mjs';

const rules = JSON.parse(await readFile(new URL("../../database.rules.json", import.meta.url), "utf8")).rules;
const base = JSON.parse(await readFile(new URL('../../scripts/database-rules.base.json', import.meta.url), 'utf8')).rules;

test('generated rules reproduce the checked-in schema deterministically from their source', () => {
  assert.deepEqual(buildCommercialRules(base), rules);
  assert.deepEqual(buildCommercialRules(base), buildCommercialRules(base));
});

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
