import { expect, test } from "@playwright/test";
import { createMarketplaceRuleFixture } from "../helpers/marketplace-rule-fixture.js";
import { seedDatabaseEmulator } from "../helpers/auth-emulator.js";

let fixture;
test.beforeEach(async () => { fixture = await createMarketplaceRuleFixture(); });

test('a published demand closes once in both views and keeps its history', async () => {
  const { supplier, buyer, demandPath, demand, request } = fixture;
  const publicPath = `publishedDemands/${demand.id}`;
  const published = { ...demand, status: 'published' };
  const projectedPath = `opportunitiesBySupplier/${supplier.organizationId}/${demand.id}`;
  await seedDatabaseEmulator(demandPath, published);
  await seedDatabaseEmulator(publicPath, published);
  await seedDatabaseEmulator(projectedPath, { ...published, match: { eligible: true, supplierId: supplier.organizationId } });
  const timestamp = { '.sv': 'timestamp' };
  const fields = { status: 'closed', closedAt: timestamp, updatedAt: timestamp, closedBy: buyer.uid, closedReason: 'Compra reagendada' };
  const update = paths => Object.fromEntries(paths.flatMap(path => Object.entries(fields).map(([key, value]) => [`${path}/${key}`, value])));
  expect((await request('', buyer, 'PATCH', update([demandPath]))).status).toBe(401);
  expect((await request('', supplier, 'PATCH', update([demandPath, publicPath]))).status).toBe(401);
  expect((await request('', buyer, 'PATCH', update([demandPath, publicPath]))).status).toBe(200);
  expect(await (await request(`${publicPath}/status`, supplier)).json()).toBe('closed');
  expect((await request(publicPath, supplier)).status).toBe(401);
  expect((await (await request(demandPath, buyer)).json()).closedReason).toBe('Compra reagendada');
  expect((await request('', buyer, 'PATCH', update([demandPath, publicPath]))).status).toBe(401);
});

test('rejects release without inspected quantities, one-sided operations and replacing a first review', async () => {
  const { supplier, buyer, request, order } = fixture;
  expect.soft((await request('', supplier, 'PATCH', operationalPatch({ status: 'released' }))).status).toBe(401);
  await seedOrders({ ...order, status: 'delivered' });
  expect.soft((await request(`${fixture.buyerOrderPath}/evaluation`, buyer, 'PUT', { score: 5, comment: 'Só uma cópia' })).status).toBe(401);
  const evaluation = { score: 5, comment: 'Primeira avaliação' };
  expect((await request('', buyer, 'PATCH', operationalPatch({ evaluation }))).status).toBe(200);
  expect.soft((await request('', buyer, 'PATCH', operationalPatch({ evaluation: { score: 1, comment: 'Sobrescrita' } }))).status).toBe(401);
});

test('proposal history is append-only, the head advances once and stale versions cannot become orders', async () => {
  const { supplier, buyer, order, demand, request } = fixture;
  const source = { ...demand, status: 'published' };
  await seedDatabaseEmulator(`publishedDemands/${demand.id}`, source);
  const id = `${demand.id}_${supplier.organizationId}`;
  const bases = [`proposalsByBuyer/${buyer.organizationId}/${id}`, `proposalsBySupplier/${supplier.organizationId}/${id}`];
  const proposal = { id, demandId: demand.id, buyerId: buyer.organizationId, buyerName: order.buyerName, supplierId: supplier.organizationId, supplierName: order.supplierName, latestVersionId: order.version.id, revision: 1, updatedAt: 1, versions: { [order.version.id]: order.version } };
  for (const base of bases) await seedDatabaseEmulator(base, proposal);
  await seedDatabaseEmulator(`opportunitiesBySupplier/${supplier.organizationId}/${demand.id}`, { ...source, match: { eligible: true, supplierId: supplier.organizationId } });
  expect.soft((await request('', supplier, 'PATCH', Object.fromEntries(bases.map(base => [`${base}/versions/${order.version.id}/totalCents`, 1])))).status).toBe(401);
  expect.soft((await request(`${bases[1]}/versions/${order.version.id}`, supplier, 'DELETE')).status).toBe(401);
  const v2 = { ...order.version, id: 'version-2', revision: 2 };
  const updates = Object.fromEntries(bases.flatMap(base => [[`${base}/versions/${v2.id}`, v2], [`${base}/latestVersionId`, v2.id], [`${base}/revision`, 2], [`${base}/updatedAt`, 2]]));
  expect((await request('', supplier, 'PATCH', updates)).status).toBe(200);
  const competing = { ...v2, id: 'version-2-competing' };
  expect.soft((await request('', supplier, 'PATCH', Object.fromEntries(bases.flatMap(base => [[`${base}/versions/${competing.id}`, competing], [`${base}/latestVersionId`, competing.id], [`${base}/revision`, 2], [`${base}/updatedAt`, 3]])))).status).toBe(401);
  const staleOrder = { ...order, id: `order_${demand.id}`, sourceProposalId: id };
  expect.soft((await request('', buyer, 'PATCH', { [`ordersByBuyer/${buyer.organizationId}/${staleOrder.id}`]: staleOrder, [`ordersBySupplier/${supplier.organizationId}/${staleOrder.id}`]: staleOrder })).status).toBe(401);
  const v3 = { ...v2, id: 'version-3', revision: 3 };
  const next = Object.fromEntries(bases.flatMap(base => [[`${base}/versions/${v3.id}`, v3], [`${base}/latestVersionId`, v3.id], [`${base}/revision`, 3], [`${base}/updatedAt`, 3]]));
  await seedDatabaseEmulator(`organizations/${buyer.organizationId}/status`, 'blocked');
  expect((await request('', supplier, 'PATCH', next)).status).toBe(401);
  await seedDatabaseEmulator(`organizations/${buyer.organizationId}/status`, 'active');
  expect((await request('', supplier, 'PATCH', next)).status).toBe(200);
});

test('competing versions and first reviews each have one winner on the server', async () => {
  const { supplier, buyer, order, demand, request } = fixture;
  const source = { ...demand, status: 'published' };
  const id = `${demand.id}_${supplier.organizationId}`;
  const bases = [`proposalsByBuyer/${buyer.organizationId}/${id}`, `proposalsBySupplier/${supplier.organizationId}/${id}`];
  await seedDatabaseEmulator(`publishedDemands/${demand.id}`, source);
  await seedDatabaseEmulator(`opportunitiesBySupplier/${supplier.organizationId}/${demand.id}`, { ...source, match: { eligible: true, supplierId: supplier.organizationId } });
  for (const base of bases) await seedDatabaseEmulator(base, { id, demandId: demand.id, buyerId: buyer.organizationId, buyerName: order.buyerName, supplierId: supplier.organizationId, supplierName: order.supplierName, latestVersionId: order.version.id, revision: 1, updatedAt: 1, versions: { [order.version.id]: order.version } });
  const competing = await Promise.all(['v2-a','v2-b'].map(versionId => request('', supplier, 'PATCH', Object.fromEntries(bases.flatMap(base => [[`${base}/versions/${versionId}`, { ...order.version, id: versionId, revision: 2 }], [`${base}/latestVersionId`, versionId], [`${base}/revision`, 2], [`${base}/updatedAt`, 2]])))));
  expect(competing.map(response => response.status).sort()).toEqual([200,401]);
  const buyerProposal = await read(bases[0], buyer);
  const supplierProposal = await read(bases[1], supplier);
  expect(supplierProposal).toEqual(buyerProposal);
  expect(Object.keys(buyerProposal.versions)).toHaveLength(2);
  await seedOrders({ ...order, status: 'delivered', operationRevision: 0 });
  const reviews = await Promise.all([4,5].map(score => request('', buyer, 'PATCH', operationalPatch({ evaluation: { score, comment: 'Conferido' }, operationRevision: 1, updatedAt: 2 }))));
  expect(reviews.map(response => response.status).sort()).toEqual([200,401]);
  expect((await read(fixture.buyerOrderPath, buyer)).evaluation).toEqual((await read(fixture.supplierOrderPath, supplier)).evaluation);
});

test('order creation cannot omit required technical fields from the published specification', async () => {
  const { buyer, supplier, order, demand, demandPath, request } = fixture;
  const source = { ...demand, status: 'published' };
  await seedDatabaseEmulator(demandPath, source);
  await seedDatabaseEmulator(`publishedDemands/${demand.id}`, source);
  const proposalId = `${demand.id}_${supplier.organizationId}`;
  await seedDatabaseEmulator(`proposalsByBuyer/${buyer.organizationId}/${proposalId}`, { id: proposalId, demandId: demand.id, buyerId: buyer.organizationId, supplierId: supplier.organizationId, latestVersionId: order.version.id, versions: { [order.version.id]: order.version } });
  const accepted = { ...order, id: `order_${demand.id}`, sourceProposalId: proposalId, destination: demand.destination, region: demand.region, requiredBy: demand.requiredBy, itemCount: 1, operationRevision: 0, items: [{ id: 'item-1', position: 0, description: 'Eixo', quantity: 10, unit: 'un' }] };
  const response = await request('', buyer, 'PATCH', { [`ordersByBuyer/${buyer.organizationId}/${accepted.id}`]: accepted, [`ordersBySupplier/${supplier.organizationId}/${accepted.id}`]: accepted, [`${demandPath}/status`]: 'ordered', [`publishedDemands/${demand.id}/status`]: 'ordered' });
  expect(response.status).toBe(401);
});

test('an incomplete multi-item proof, forged expiry and a blocked company are refused', async () => {
  const { order, supplier, buyer, demand, request } = fixture;
  const multi = { ...order, items: [...order.items, { ...order.items[0], id: 'item-2', position: 1, quantity: 4 }], quantity: 14 };
  await seedOrders(multi);
  const incomplete = inspectionRecord(multi, 'partial', 10, 2);
  incomplete.complete = true; incomplete.itemApprovals[0].completeThrough = true;
  expect((await request('', supplier, 'PATCH', operationalPatch({ status: 'released', latestInspectionId: 'partial', inspections: { partial: incomplete } }))).status).toBe(401);
  await seedDatabaseEmulator(`organizations/${supplier.organizationId}/status`, 'blocked');
  expect((await request(fixture.supplierOrderPath, supplier)).status).toBe(401);
  await seedDatabaseEmulator(`organizations/${supplier.organizationId}/status`, 'active');
  const id = `${demand.id}_${supplier.organizationId}`;
  const source = { ...demand, status: 'published' };
  await seedDatabaseEmulator(`publishedDemands/${demand.id}`, source);
  await seedDatabaseEmulator(`opportunitiesBySupplier/${supplier.organizationId}/${demand.id}`, { ...source, match: { eligible: true, supplierId: supplier.organizationId } });
  const forged = { ...order.version, expiry: { ...order.version.expiry, until: order.version.expiry.until + 86400000 } };
  const proposal = { id, demandId: demand.id, buyerId: buyer.organizationId, buyerName: order.buyerName, supplierId: supplier.organizationId, supplierName: order.supplierName, revision: 1, latestVersionId: forged.id, updatedAt: 2, versions: { [forged.id]: forged } };
  expect((await request('', supplier, 'PATCH', { [`proposalsByBuyer/${buyer.organizationId}/${id}`]: proposal, [`proposalsBySupplier/${supplier.organizationId}/${id}`]: proposal })).status).toBe(401);
});

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
    .flatMap(path => Object.entries(update).flatMap(([field, value]) => field === 'inspections' ? Object.entries(value).map(([id, inspection]) => [`${path}/inspections/${id}`, inspection]) : [[`${path}/${field}`, value]])));
}

function inspectionRecord(order, id, approved, createdAt) {
  const complete = approved === order.quantity;
  return { id, approved, plan: 'Plano 1', evidence: 'Quantidades conferidas', createdAt, complete, lastItemIndex: 0, itemApprovals: [{ itemId: order.items?.[0]?.id ?? 'total', position: 0, approved, runningApproved: approved, completeThrough: complete }] };
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
    [supplier, { status: "blocked", latestInspectionId: 'first', inspections: { first: inspectionRecord(order, 'first', 8, 2) } }],
    [supplier, { status: "blocked", updatedAt: 3 }],
    [supplier, { status: "released", latestInspectionId: 'second', inspections: { second: inspectionRecord(order, 'second', 10, 4) } }],
    [supplier, { status: "dispatched", dispatchedAt: 5 }],
    [buyer, { status: "delivered", deliveredAt: 6 }],
    [buyer, { evaluation: { score: 5, comment: "Conforme combinado" } }],
  ];
  for (const [actor, update] of steps) {
    const fields = { ...update, operationRevision: (current.operationRevision ?? 0) + 1, updatedAt: current.updatedAt + 1 };
    current = { ...current, ...fields, ...(fields.inspections ? { inspections: { ...current.inspections, ...fields.inspections } } : {}) };
    expect((await request("", actor, "PATCH", operationalPatch(fields))).status).toBe(200);
    await expectOrders(current);
  }
});

test("keeps legacy orders without optional item detail operational", async () => {
  const legacy = { ...fixture.order };
  delete legacy.items;
  delete legacy.description;
  await seedOrders(legacy);
  const fields = { status: 'released', latestInspectionId: 'legacy-inspection', operationRevision: 1, inspections: { 'legacy-inspection': inspectionRecord(legacy, 'legacy-inspection', 10, 2) } };
  const released = { ...legacy, ...fields };
  expect((await fixture.request("", fixture.supplier, "PATCH", operationalPatch(fields))).status).toBe(200);
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
  current = { ...current, title: 'Eixos revisados', revision: 2, updatedAt: 2 };
  expect((await request(demandPath, buyer, 'PUT', current)).status).toBe(200);
  current = { ...current, status: 'published', publicationSourceUpdatedAt: 2, publicationSourceRevision: 2, updatedAt: 3 };
  expect((await request('', buyer, 'PATCH', { [demandPath]: current, [`publishedDemands/${demand.id}`]: current })).status).toBe(200);
  expect((await request(demandPath, buyer, 'PATCH', { status: 'ordered' })).status).toBe(401);
  const proposalId = `${demand.id}_${fixture.supplier.organizationId}`;
  const proposal = { id: proposalId, demandId: demand.id, buyerId: buyer.organizationId, buyerName: demand.buyerName, supplierId: fixture.supplier.organizationId, supplierName: fixture.order.supplierName, revision: 1, latestVersionId: fixture.order.version.id, updatedAt: 1, versions: { [fixture.order.version.id]: fixture.order.version } };
  await seedDatabaseEmulator(`proposalsByBuyer/${buyer.organizationId}/${proposalId}`, proposal);
  const accepted = { ...fixture.order, id: `order_${demand.id}`, title: current.title, destination: current.destination, requiredBy: current.requiredBy, region: current.region, itemCount: 1, sourceProposalId: proposalId, operationRevision: 0 };
  expect((await request('', buyer, 'PATCH', {
    [`ordersByBuyer/${buyer.organizationId}/${accepted.id}`]: accepted,
    [`ordersBySupplier/${fixture.supplier.organizationId}/${accepted.id}`]: accepted,
    [`${demandPath}/status`]: 'ordered', [`publishedDemands/${demand.id}/status`]: 'ordered',
  })).status).toBe(200);
  current = { ...current, status: 'ordered' };
  expect(await read(demandPath, buyer)).toEqual(current);
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
