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

test('matching does not equate declared unit capacity to metres or mixed quantities', () => {
  const profile = { categories: ['engrenagens'], processes: ['usinagem'], materials: ['aço 1045'], regions: ['Campinas/SP'], certifications: ['ISO 9001'], capacity: 800 };
  const result = matchSupplierToDemand({ ...demand, items: [{ ...demand.items[0], quantity: 20, unit: 'm' }] }, profile);
  assert.equal(result.criteria.find(item => item.id === 'capacity').state, 'not_informed');
  assert.equal(result.status, 'partial');
  const unknown = matchSupplierToDemand(demand, { ...profile, capacity: undefined });
  assert.equal(unknown.criteria.find(item => item.id === 'capacity').state, 'not_informed');
});

test('a requested criterion missing from the supplier profile needs confirmation', () => {
  const profile = { categories: ['engrenagens'], processes: ['usinagem'], materials: ['aço 1045'], regions: ['Campinas/SP'], certifications: ['ISO 9001'], capacity: 800 };
  for (const field of ['certifications', 'materials', 'regions']) {
    const match = matchSupplierToDemand(demand, { ...profile, [field]: [] });
    assert.equal(match.status, 'partial', `Missing ${field} must not be presented as compatible`);
    assert.equal(match.eligible, true);
  }
  const noCertification = { ...demand, items: [{ ...demand.items[0], certifications: [] }] };
  assert.equal(matchSupplierToDemand(noCertification, { ...profile, certifications: [] }).status, 'compatible');
});
