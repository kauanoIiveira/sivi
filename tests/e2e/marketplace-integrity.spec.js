import { expect, test } from "@playwright/test";
import { createMarketplaceRuleFixture } from "../helpers/marketplace-rule-fixture.js";
import { seedDatabaseEmulator } from "../helpers/auth-emulator.js";

let fixture;
test.beforeEach(async () => { fixture = await createMarketplaceRuleFixture(); });

async function read(path, actor) {
  const response = await fixture.request(path, actor);
  expect(response.status).toBe(200);
  return response.json();
}

async function expectOrders(order) {
  expect(await read(fixture.buyerOrderPath, fixture.buyer)).toEqual(order);
  expect(await read(fixture.supplierOrderPath, fixture.supplier)).toEqual(order);
}

async function seedOrders(order) {
  await seedDatabaseEmulator(fixture.buyerOrderPath, order);
  await seedDatabaseEmulator(fixture.supplierOrderPath, order);
}

function operationalPatch(update) {
  return Object.fromEntries([fixture.buyerOrderPath, fixture.supplierOrderPath]
    .flatMap(path => Object.entries(update).map(([field, value]) => [`${path}/${field}`, value])));
}

test("rejects commercial changes during an otherwise allowed supplier transition", async () => {
  const { order, supplier, request } = fixture;
  const changes = {
    id: "other-order", demandId: "other-demand", buyerId: "other-buyer",
    buyerName: "Outro comprador", supplierId: "other-supplier", supplierName: "Outro fornecedor",
    sourceProposalId: "other-proposal", title: "Outra peça", description: "Outra especificação",
    items: [{ ...order.items[0], quantity: 1 }], quantity: 1, createdAt: 2,
  };
  for (const [field, value] of Object.entries(order.version)) {
    changes[`version/${field}`] = typeof value === "number" ? value + 1 : `${value} changed`;
  }
  changes["version/totalCents"] = 1;
  changes["version/extra"] = "injected";
  changes["items/1"] = { id: "extra-item", description: "Extra", quantity: 1, unit: "un" };
  changes["items/0/certifications/0"] = "Certificação inserida";
  for (const [field, value] of Object.entries(changes)) {
    await test.step(field, async () => {
      await seedOrders(order);
      const patch = {};
      for (const path of [fixture.buyerOrderPath, fixture.supplierOrderPath]) {
        patch[`${path}/status`] = "released";
        patch[`${path}/${field}`] = value;
      }
      expect.soft((await request("", supplier, "PATCH", patch)).status, field).toBe(401);
      expect.soft(await read(fixture.buyerOrderPath, fixture.buyer), field).toEqual(order);
      expect.soft(await read(fixture.supplierOrderPath, supplier), field).toEqual(order);
    });
  }
});

test("rejects removal of frozen order fields", async () => {
  const { order, supplier, request } = fixture;
  for (const field of ["version", ...Object.keys(order.version).map(key => `version/${key}`), "quantity", "items", "items/0", "items/0/description", "description", "createdAt"]) {
    await test.step(field, async () => {
      await seedOrders(order);
      const patch = {};
      for (const path of [fixture.buyerOrderPath, fixture.supplierOrderPath]) {
        patch[`${path}/status`] = "released";
        patch[`${path}/${field}`] = null;
      }
      expect.soft((await request("", supplier, "PATCH", patch)).status, field).toBe(401);
      expect.soft(await read(fixture.buyerOrderPath, fixture.buyer), field).toEqual(order);
      expect.soft(await read(fixture.supplierOrderPath, supplier), field).toEqual(order);
    });
  }
});

test("protects each projection through whole records and direct child writes", async () => {
  const { order, supplier, request } = fixture;
  for (const path of [fixture.buyerOrderPath, fixture.supplierOrderPath]) {
    await seedOrders(order);
    expect((await request(path, supplier, "PUT", { ...order, status: "released", quantity: 1 })).status).toBe(401);
    expect((await request(path, supplier, "DELETE")).status).toBe(401);
    // A repeated blocked state is normally writable by the supplier.
    const blocked = { ...order, status: "blocked" };
    await seedOrders(blocked);
    expect((await request(`${path}/version/payment`, supplier, "PUT", "À vista")).status).toBe(401);
    expect((await request(`${path}/items/0`, supplier, "DELETE")).status).toBe(401);
    await expectOrders(blocked);
  }
});

test("permits operational changes while preserving accepted terms", async () => {
  const { order, supplier, buyer, request } = fixture;
  let current = order;
  const steps = [
    [supplier, { status: "blocked", inspections: { first: { id: "first", approved: 8, plan: "Plano 1", evidence: "Duas peças fora da tolerância", createdAt: 2 } } }],
    [supplier, { status: "blocked", updatedAt: 3 }],
    [supplier, { status: "released", inspections: { first: { id: "first", approved: 8, plan: "Plano 1", evidence: "Duas peças fora da tolerância", createdAt: 2 }, second: { id: "second", approved: 10, plan: "Plano 1", evidence: "Peças retrabalhadas e conferidas", createdAt: 4 } } }],
    [supplier, { status: "dispatched", dispatchedAt: 5 }],
    [buyer, { status: "delivered", deliveredAt: 6 }],
    [buyer, { evaluation: { score: 5, comment: "Conforme combinado" } }],
  ];
  for (const [actor, update] of steps) {
    const fields = { ...update, updatedAt: current.updatedAt + 1 };
    current = { ...current, ...fields };
    expect((await request("", actor, "PATCH", operationalPatch(fields))).status).toBe(200);
    await expectOrders(current);
  }
});

test("keeps legacy orders without optional item detail operational", async () => {
  const legacy = { ...fixture.order };
  delete legacy.items;
  delete legacy.description;
  await seedOrders(legacy);
  const released = { ...legacy, status: "released" };
  expect((await fixture.request("", fixture.supplier, "PATCH", operationalPatch({ status: "released" }))).status).toBe(200);
  await expectOrders(released);
});

test("rejects adding absent legacy details and changing terms after delivery", async () => {
  const { order, supplier, buyer, request } = fixture;
  const legacy = { ...order, status: "blocked" };
  delete legacy.items;
  delete legacy.description;
  await seedOrders(legacy);
  for (const fields of [{ items: order.items }, { description: order.description }]) {
    expect((await request("", supplier, "PATCH", operationalPatch(fields))).status).toBe(401);
    await expectOrders(legacy);
  }
  const delivered = { ...order, status: "delivered" };
  await seedOrders(delivered);
  expect((await request("", buyer, "PATCH", operationalPatch({ evaluation: { score: 5 }, "version/totalCents": 1 }))).status).toBe(401);
  await expectOrders(delivered);
});

test("retains order membership boundaries", async () => {
  const { order, supplier, buyer, competitor, request } = fixture;
  const patch = operationalPatch({ status: "released" });
  for (const actor of [competitor, buyer]) {
    expect((await request("", actor, "PATCH", patch)).status).toBe(401);
  }
  await seedDatabaseEmulator(`membershipsByUser/${supplier.uid}/${supplier.organizationId}/status`, "blocked");
  expect((await request("", supplier, "PATCH", patch)).status).toBe(401);
  expect(await read(fixture.buyerOrderPath, buyer)).toEqual(order);
});

test("rejects demand status reversals and invalid initial states", async () => {
  const { demand, demandPath, buyer, request } = fixture;
  for (const [from, to] of [
    ["ordered", "draft"], ["ordered", "published"], ["published", "draft"],
    ["draft", "ordered"], ["draft", "unknown"], [null, "published"], [null, "ordered"], [null, "unknown"],
  ]) {
    await test.step(`${from ?? "new"} → ${to}`, async () => {
      const before = from ? { ...demand, status: from } : null;
      await seedDatabaseEmulator(demandPath, before);
      const response = from
        ? await request(`${demandPath}/status`, buyer, "PUT", to)
        : await request(demandPath, buyer, "PUT", { ...demand, status: to });
      expect.soft(response.status).toBe(401);
      expect.soft(await read(demandPath, buyer)).toEqual(before);
    });
  }
});

test("retains legitimate buyer transitions and demand identity", async () => {
  const { demand, demandPath, buyer, request } = fixture;
  await seedDatabaseEmulator(demandPath, null);
  let current = { ...demand, status: "draft" };
  expect((await request(demandPath, buyer, "PUT", current)).status).toBe(200);
  for (const status of ["draft", "published", "published", "ordered", "ordered"]) {
    const fields = { status, updatedAt: current.updatedAt + 1 };
    if (status === "draft") fields.title = "Eixos revisados";
    current = { ...current, ...fields };
    expect((await request(demandPath, buyer, "PATCH", fields)).status).toBe(200);
    expect(await read(demandPath, buyer)).toEqual(current);
  }
  for (const fields of [{ id: "other" }, { buyerId: "other" }, { createdAt: 2 }]) {
    expect((await request(demandPath, buyer, "PATCH", fields)).status).toBe(401);
    expect(await read(demandPath, buyer)).toEqual(current);
  }
});

test("retains demand role boundaries and prevents deletion", async () => {
  const { demand, demandPath, buyer, supplier, competitor, request } = fixture;
  // The user belongs to this organization, but only as a supplier.
  await seedDatabaseEmulator(`membershipsByUser/${supplier.uid}/${buyer.organizationId}`, {
    status: "active", organizationRoles: { supplier: true },
  });
  for (const actor of [supplier, competitor]) {
    expect((await request(demandPath, actor, "PATCH", { updatedAt: 2 })).status).toBe(401);
    expect(await read(demandPath, buyer)).toEqual(demand);
  }
  await seedDatabaseEmulator(`membershipsByUser/${buyer.uid}/${buyer.organizationId}/status`, "blocked");
  expect((await request(demandPath, buyer, "PATCH", { updatedAt: 2 })).status).toBe(401);
  await seedDatabaseEmulator(`membershipsByUser/${buyer.uid}/${buyer.organizationId}/status`, "active");
  expect(await read(demandPath, buyer)).toEqual(demand);
  for (const status of ["draft", "published", "ordered"]) {
    const current = { ...demand, status };
    await seedDatabaseEmulator(demandPath, current);
    expect.soft((await request(demandPath, buyer, "DELETE")).status, status).toBe(401);
    expect.soft(await read(demandPath, buyer)).toEqual(current);
    await seedDatabaseEmulator(demandPath, current);
    expect.soft((await request("", buyer, "PATCH", { [demandPath]: null })).status, status).toBe(401);
    expect.soft(await read(demandPath, buyer)).toEqual(current);
  }
});
