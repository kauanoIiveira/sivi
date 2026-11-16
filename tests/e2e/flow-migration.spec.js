import { expect, test } from '@playwright/test';
import { prepareFlowMigration } from '../../scripts/prepare-flow-migration.mjs';
import { createFirebaseMarketplaceRepository } from '../../src/repositories/firebase-marketplace-repository.js';
import { createMarketplaceRuleFixture } from '../helpers/marketplace-rule-fixture.js';
import { seedDatabaseEmulator } from '../helpers/auth-emulator.js';

// Local-only: owner is used exclusively to simulate a reviewed legacy migration.
const endpoint = 'http://127.0.0.1:9000/.json?ns=sivi-org-default-rtdb';
async function snapshot() {
  const response = await fetch(endpoint, { headers: { Authorization: 'Bearer owner' } });
  expect(response.status).toBe(200);
  return response.json();
}

test('legacy open specifications and proposal history remain usable after a metadata-only migration', async () => {
  const fixture = await createMarketplaceRuleFixture();
  const { itemCount, ...source } = { ...fixture.demand, status: 'published' };
  source.items = source.items.map(({ position, cumulativeQuantity, ...item }) => ({ ...item, certifications: ['ISO 9001', 'ISO 14001'] }));
  await seedDatabaseEmulator(fixture.demandPath, source);
  await seedDatabaseEmulator(`publishedDemands/${source.id}`, source);
  await seedDatabaseEmulator(`opportunitiesBySupplier/${fixture.supplier.organizationId}/${source.id}`, { ...source, match: { eligible: true, supplierId: fixture.supplier.organizationId } });
  await seedDatabaseEmulator(`supplierProfiles/${fixture.supplier.organizationId}`, {
    organizationId: fixture.supplier.organizationId, organizationName: 'Fornecedor', organizationStatus: 'active',
    categories: ['Peças'], materials: ['Aço'], processes: ['Usinagem'], regions: ['SP'],
    certifications: ['ISO 9001', 'ISO 14001'], capacity: 100, description: 'Usinagem industrial', createdAt: 1, updatedAt: 1,
  });
  const { expiry, ...version } = fixture.order.version;
  const proposalId = `${source.id}_${fixture.supplier.organizationId}`;
  const proposal = { id: proposalId, demandId: source.id, buyerId: source.buyerId, buyerName: source.buyerName, supplierId: fixture.supplier.organizationId, supplierName: 'Fornecedor', updatedAt: 1, versions: { [version.id]: version } };
  for (const path of [`proposalsByBuyer/${source.buyerId}/${proposalId}`, `proposalsBySupplier/${fixture.supplier.organizationId}/${proposalId}`]) await seedDatabaseEmulator(path, proposal);
  const before = await snapshot();
  const migration = prepareFlowMigration(before);
  expect(migration.blocked).toEqual([]);
  expect(Object.keys(migration.updates).some(path => path.startsWith('orders'))).toBe(false);
  const applied = await fetch(endpoint, { method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' }, body: JSON.stringify(migration.updates) });
  expect(applied.status).toBe(200);
  const after = await snapshot();
  expect(after.ordersByBuyer).toEqual(before.ordersByBuyer);
  expect(after.ordersBySupplier).toEqual(before.ordersBySupplier);
  expect(after.publishedDemands[source.id].items[0].certifications).toEqual(['ISO 9001', 'ISO 14001']);

  const request = async (path, method = 'GET', body) => {
    const response = await fixture.request(path, fixture.buyer, method, body);
    if (!response.ok) throw Error(`Local Firebase refused ${method} ${path}: ${response.status}`);
    return response.json();
  };
  let omissionRefused = false;
  const patch = async updates => {
    if (Object.keys(updates).some(path => path.startsWith('ordersByBuyer/'))) {
      const incomplete = structuredClone(updates);
      for (const [path, order] of Object.entries(incomplete)) if (path.startsWith('ordersByBuyer/') || path.startsWith('ordersBySupplier/')) order.items[0].certifications.pop();
      expect((await fixture.request('', fixture.buyer, 'PATCH', incomplete)).status).toBe(401);
      omissionRefused = true;
    }
    return request('', 'PATCH', updates);
  };
  const repository = createFirebaseMarketplaceRepository({
    client: { read: path => request(path), write: (path, value) => request(path, 'PUT', value), patch, timestamp: () => Date.now(), newKey: () => 'local-migration-key' },
    getUser: () => ({ uid: fixture.buyer.uid }),
    getWorkspace: () => ({ id: 'buyer', organizationId: source.buyerId, organizationName: source.buyerName, organizationRole: 'buyer', memberUid: fixture.buyer.uid, canEnter: true }),
  });
  await repository.reassessDemand('buyer', source.id);
  await repository.workflow.acceptProposal('buyer', proposalId, version.id);
  const accepted = (await snapshot()).ordersByBuyer[source.buyerId][`order_${source.id}`];
  expect(accepted.version).toMatchObject(version);
  expect(accepted.items[0]).toMatchObject(source.items[0]);
  expect(accepted.items[0].certifications).toHaveLength(2);
  expect(accepted.version.expiry.until).toBe(expiry.until);
  expect(omissionRefused).toBe(true);
});
