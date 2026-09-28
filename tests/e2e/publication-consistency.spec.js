import { expect, test } from '@playwright/test';
import { createFirebaseMarketplaceRepository } from '../../src/repositories/firebase-marketplace-repository.js';
import { createMarketplaceRuleFixture } from '../helpers/marketplace-rule-fixture.js';
import { seedDatabaseEmulator } from '../helpers/auth-emulator.js';

let fixture;
let demand;
test.beforeEach(async () => {
  fixture = await createMarketplaceRuleFixture();
  demand = {
    ...fixture.demand, id: 'publication-1', status: 'draft', createdBy: fixture.buyer.uid,
    items: [{ ...fixture.demand.items[0], category: 'usinados', material: 'aço', process: 'usinagem' }],
  };
  await seedDatabaseEmulator(`demandsByBuyer/${fixture.buyer.organizationId}/${demand.id}`, demand);
  for (const actor of [fixture.supplier, fixture.competitor]) {
    await seedDatabaseEmulator(`supplierProfiles/${actor.organizationId}`, {
      organizationId: actor.organizationId, organizationName: actor.organizationId, organizationStatus: 'active',
      categories: ['usinados'], materials: ['aço'], processes: ['usinagem'], regions: ['SP'], capacity: 100,
      description: 'Usinagem de componentes', createdAt: 1, updatedAt: 1,
    });
  }
});

function repositoryFor(actor, role) {
  let sequence = 0;
  const request = async (path, method = 'GET', value) => {
    const response = await fixture.request(path, actor, method, value);
    if (!response.ok) {
      const error = new Error(`PERMISSION_DENIED (${response.status})`);
      error.code = 'PERMISSION_DENIED';
      throw error;
    }
    return response.json();
  };
  const client = {
    read: path => request(path),
    write: (path, value) => request(path, 'PUT', value),
    patch: value => request('', 'PATCH', value),
    newKey: () => `version-${++sequence}`,
    timestamp: () => Date.now(),
  };
  const workspace = {
    id: role, organizationId: actor.organizationId, organizationName: actor.organizationId,
    organizationRole: role, memberUid: actor.uid, canEnter: true,
  };
  const repository = createFirebaseMarketplaceRepository({ client, getUser: () => ({ uid: actor.uid }), getWorkspace: () => workspace });
  return { client, repository, workspace };
}

// Owner reads inspect only the fixed local emulator, including private indexes.
async function stored(path) {
  const response = await fetch(`http://127.0.0.1:9000/${path}.json?ns=sivi-org-default-rtdb`, { headers: { Authorization: 'Bearer owner' } });
  expect(response.status).toBe(200);
  return response.json();
}

test('a stale publication fails atomically, retains the newer draft and can retry after refresh', async () => {
  const { client, repository } = repositoryFor(fixture.buyer, 'buyer');
  const path = `demandsByBuyer/${fixture.buyer.organizationId}/${demand.id}`;
  const edited = { ...demand, title: 'Eixos revisados em outra sessão', updatedAt: 2 };
  const patch = client.patch;
  client.patch = async updates => {
    await client.write(path, edited);
    return patch(updates);
  };
  await expect(repository.workflow.publishDemand('buyer', demand.id)).rejects.toThrow(/alterado em outra sessão/i);
  expect(await stored(path)).toEqual(edited);
  expect(repository.workflow.read('buyer').demands.find(item => item.id === demand.id)).toEqual(edited);
  for (const projection of [
    `publishedDemands/${demand.id}`, `matchesByDemand/${demand.id}`,
    `opportunitiesBySupplier/${fixture.supplier.organizationId}/${demand.id}`,
    `opportunitiesBySupplier/${fixture.competitor.organizationId}/${demand.id}`,
  ]) expect(await stored(projection)).toBeNull();

  let confirmedPatch;
  client.patch = async updates => { confirmedPatch = updates; return patch(updates); };
  await repository.workflow.publishDemand('buyer', demand.id);
  expect((await stored(path)).title).toBe(edited.title);
  expect((await stored(path)).publicationSourceUpdatedAt).toBe(2);
  expect((await stored(`publishedDemands/${demand.id}`)).title).toBe(edited.title);
  // Another publisher carrying the old snapshot cannot replay it after commit.
  expect((await fixture.request('', fixture.buyer, 'PATCH', confirmedPatch)).status).toBe(401);
  expect((await stored(path)).status).toBe('published');
});

test('publication remains compatible with a legacy client that has no revision metadata', async () => {
  const published = { ...demand, status: 'published', updatedAt: 2 };
  const response = await fixture.request('', fixture.buyer, 'PATCH', {
    [`demandsByBuyer/${fixture.buyer.organizationId}/${demand.id}`]: published,
    [`publishedDemands/${demand.id}`]: published,
  });
  expect(response.status).toBe(200);
  expect((await stored(`publishedDemands/${demand.id}`)).status).toBe('published');
});

test('publication detects a newer revision even when both edits have the same timestamp', async () => {
  const { client, repository } = repositoryFor(fixture.buyer, 'buyer');
  const path = `demandsByBuyer/${fixture.buyer.organizationId}/${demand.id}`;
  await client.write(path, { ...demand, revision: 1 });
  const patch = client.patch;
  client.patch = async updates => {
    await client.write(path, { ...demand, title: 'Revisão no mesmo instante', revision: 2 });
    return patch(updates);
  };
  await expect(repository.workflow.publishDemand('buyer', demand.id)).rejects.toThrow(/alterado em outra sessão/);
  expect((await stored(path)).revision).toBe(2);
  expect(await stored(`publishedDemands/${demand.id}`)).toBeNull();
});

test('acceptance closes all publication recipients and competitors cannot submit or reopen it', async ({ page }) => {
  const buyer = repositoryFor(fixture.buyer, 'buyer');
  const supplier = repositoryFor(fixture.supplier, 'supplier');
  const competitor = repositoryFor(fixture.competitor, 'supplier');
  await buyer.repository.workflow.publishDemand('buyer', demand.id);
  const buyerPath = `demandsByBuyer/${fixture.buyer.organizationId}/${demand.id}`;
  const recipients = [fixture.supplier.organizationId, fixture.competitor.organizationId];
  expect((await stored(buyerPath)).opportunitySupplierIds.sort()).toEqual([...recipients].sort());
  const before = await stored(`opportunitiesBySupplier/${fixture.competitor.organizationId}/${demand.id}`);
  expect(before.opportunitySupplierIds).toBeUndefined();
  const input = {
    totalCents: 10000, freightCents: 500, leadTimeDays: 10, validUntil: '2099-12-20',
    manufacturer: 'Fornecedor', payment: '30 dias', warranty: '12 meses', technical: 'Conforme desenho',
  };
  const versionId = await supplier.repository.workflow.sendProposal('supplier', demand.id, input);
  const proposalId = `${demand.id}_${fixture.supplier.organizationId}`;
  await buyer.repository.workflow.acceptProposal('buyer', proposalId, versionId);
  for (const id of recipients) expect((await stored(`opportunitiesBySupplier/${id}/${demand.id}`)).status).toBe('ordered');
  const after = await stored(`opportunitiesBySupplier/${fixture.competitor.organizationId}/${demand.id}`);
  expect(after.match).toEqual(before.match);
  expect((await stored(`publishedDemands/${demand.id}`)).opportunitySupplierIds).toBeUndefined();
  await expect(competitor.repository.workflow.sendProposal('supplier', demand.id, input)).rejects.toThrow(/não está aberta/i);
  await expect(buyer.repository.workflow.publishDemand('buyer', demand.id)).rejects.toThrow(/rascunho/i);

  // The supplier view also treats the persisted competing opportunity as closed.
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.evaluate(async ({ data, workspace }) => {
    const { mountWorkflowView } = await import('/src/pages/operations/workflow-view.js');
    const container = document.querySelector('main');
    container.replaceChildren();
    mountWorkflowView({ container, section: 'demands', selectedRecordId: null, suppliers: [], workspace,
      workflow: { read: () => data },
    });
  }, { data: (await competitor.repository.getOperations('supplier')).data, workspace: competitor.workspace });
  await expect(page.locator('.workflow-demand')).toContainText('Pedido gerado');
  await expect(page.getByRole('link', { name: 'Enviar proposta' })).toHaveCount(0);
});
