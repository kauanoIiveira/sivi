import assert from "node:assert/strict";
import test from "node:test";
import { matchSupplierToDemand, normalizeSupplierProfile } from "../../src/domain/match-engine.js";

const demand = {
  id: "demand-1",
  destination: "Campinas/SP",
  region: "Campinas/SP",
  items: [{
    description: "Engrenagem",
    category: "engrenagens",
    material: "aço 1045",
    process: "usinagem",
    certifications: ["ISO 9001"],
    quantity: 500,
  }],
};

test("normalizes a dynamic supplier profile and explains a compatible match", () => {
  const profile = normalizeSupplierProfile({
    categories: "Engrenagens, Usinados",
    materials: "Aço 1045",
    processes: "Usinagem",
    regions: "Campinas/SP",
    certifications: "ISO 9001",
    capacity: "800",
    description: "Fornecedor acadêmico de componentes industriais.",
  }, { organizationId: "supplier-1", organizationName: "Vetor" });
  const result = matchSupplierToDemand(demand, profile);
  assert.equal(result.status, "compatible");
  assert.equal(result.eligible, true);
  assert.ok(result.criteria.every(({ state }) => state === "met"));
});
test("blocks a supplier missing a mandatory category and keeps partial matches eligible", () => {
  const wrongCategory = matchSupplierToDemand(demand, {
    organizationId: "supplier-2",
    categories: ["rolamentos"], materials: ["aço 1045"], processes: ["usinagem"],
    regions: ["Campinas/SP"], certifications: ["ISO 9001"], capacity: 900,
  });
  assert.equal(wrongCategory.status, "ineligible");
  assert.equal(wrongCategory.eligible, false);

  const partial = matchSupplierToDemand(demand, {
    organizationId: "supplier-3",
    categories: ["engrenagens"], materials: ["alumínio"], processes: ["usinagem"],
    regions: ["Campinas/SP"], certifications: ["ISO 9001"], capacity: 900,
  });
  assert.equal(partial.status, "partial");
  assert.equal(partial.eligible, true);
});
