import assert from "node:assert/strict";
import test from "node:test";
import { createFirebaseMarketplaceRepository } from "../../src/repositories/firebase-marketplace-repository.js";
import { createFirebaseAdminService } from "../../src/services/firebase-admin-service.js";
import { createFirebaseSupplierProfileService } from "../../src/services/firebase-supplier-profile-service.js";
import { createFirebaseWorkspaceService } from "../../src/services/firebase-workspace-service.js";

function memoryClient() {
  let sequence = 0;
  const root = {};
  const parts = (path) => path.split("/").filter(Boolean);
  const clone = (value) => value == null ? value : structuredClone(value);
  const read = (path) => parts(path).reduce((value, key) => value?.[key], root) ?? null;
  const write = (path, value) => {
    const keys = parts(path);
    const leaf = keys.pop();
    const parent = keys.reduce((value, key) => value[key] ??= {}, root);
    if (value === null) delete parent[leaf]; else parent[leaf] = clone(value);
  };
  return {
    dump: () => clone(root),
    read: async (path) => clone(read(path)),
    write: async (path, value) => write(path, value),
    transaction: async (path, updater) => {
      const updated = updater(clone(read(path)));
      if (updated === undefined) return { committed: false };
      write(path, updated);
      return { committed: true, value: clone(updated) };
    },
    patch: async (updates) => Object.entries(updates).forEach(([path, value]) => write(path, value)),
    newKey: () => `key-${++sequence}`,
  };
}

const user = (uid) => ({ uid, email: `${uid}@sivi.test`, displayName: uid });

function draftContext() {
  const client = memoryClient();
  const buyer = { id: 'buyer', organizationId: 'alpha', organizationName: 'Alpha', organizationRole: 'buyer', memberUid: 'owner', canEnter: true };
  const repository = createFirebaseMarketplaceRepository({ client, getUser: () => user('owner'), getWorkspace: id => id === buyer.id ? buyer : null });
  const input = {
    title: 'Componentes', description: 'Objetivo geral', requiredBy: '2027-12-20', destination: 'Campinas', region: 'SP',
    items: [{ description: 'Engrenagem', category: 'usinados', material: 'aço', process: 'usinagem', quantity: 10, unit: 'un' }],
  };
  return { client, repository, input };
}

test('demand dates reject impossible calendar days before persisting', async () => {
  const { client, repository, input } = draftContext();
  for (const requiredBy of ['2027-02-31', '2027-02-29', '2100-02-29', '2027-04-31', '2027-00-20', '2027-12-00', '2027-13-01', '2027-1-01', '0000-01-01']) {
    await assert.rejects(repository.workflow.createDemand('buyer', { ...input, requiredBy }), /data válida/i, requiredBy);
  }
  assert.equal(client.dump().demandsByBuyer, undefined);
  for (const requiredBy of ['2028-02-29', '2000-02-29', '2027-04-30', '2027-12-31']) {
    const id = await repository.workflow.createDemand('buyer', { ...input, requiredBy });
    assert.equal((await client.read(`demandsByBuyer/alpha/${id}`)).requiredBy, requiredBy);
  }
});

async function marketplaceContext({ demandStatus = 'draft', orderDemandId = 'other', orderStatus = 'accepted' } = {}) {
  const client = memoryClient();
  const workspaces = {
    buyer: { id: 'buyer', organizationId: 'alpha', organizationName: 'Alpha', organizationRole: 'buyer', memberUid: 'owner', canEnter: true },
    supplier: { id: 'supplier', organizationId: 'beta', organizationName: 'Beta', organizationRole: 'supplier', memberUid: 'owner', canEnter: true },
  };
  const repository = createFirebaseMarketplaceRepository({ client, getUser: () => user('owner'), getWorkspace: id => workspaces[id] });
  const input = {
    title: 'Engrenagens', description: 'Conforme desenho', requiredBy: '2099-12-20', destination: 'Campinas', region: 'SP',
    items: [{ id: 'item-1', description: 'Engrenagem', category: 'usinados', material: 'aço', process: 'usinagem', quantity: 10, unit: 'un' }],
  };
  const proposalInput = { totalCents: 10000, freightCents: 500, leadTimeDays: 10, manufacturer: 'Beta', payment: '28 dias', warranty: '12 meses', technical: 'Conforme desenho', validUntil: '2099-12-10' };
  const demand = { ...input, id: 'demand-1', buyerId: 'alpha', buyerName: 'Alpha', createdBy: 'owner', quantity: 10, status: demandStatus, createdAt: 1, updatedAt: 2 };
  const version = { ...proposalInput, id: 'version-1', revision: 1, createdAt: 3 };
  const proposal = { id: 'demand-1_beta', demandId: demand.id, buyerId: 'alpha', buyerName: 'Alpha', supplierId: 'beta', supplierName: 'Beta', updatedAt: 3, versions: { [version.id]: version } };
  const order = { id: `order_${orderDemandId}`, demandId: orderDemandId, buyerId: 'alpha', buyerName: 'Alpha', supplierId: 'beta', supplierName: 'Beta', sourceProposalId: proposal.id, title: demand.title, description: demand.description, items: demand.items, quantity: 10, version, status: orderStatus, createdAt: 4, updatedAt: 4, inspections: { previous: { id: 'previous', approved: 0, plan: 'PI-1', evidence: 'Reinspecionar', createdAt: 4 } } };
  await client.patch({
    [`demandsByBuyer/alpha/${demand.id}`]: demand,
    'demandsByBuyer/alpha/other': { ...demand, id: 'other', title: 'Registro anterior' },
    [`opportunitiesBySupplier/beta/${demand.id}`]: { ...demand, status: 'published', match: { supplierId: 'beta', eligible: true, status: 'compatible' } },
    [`publishedDemands/${demand.id}`]: { ...demand, status: demandStatus === 'ordered' ? 'ordered' : 'published' },
    [`proposalsByBuyer/alpha/${proposal.id}`]: proposal,
    [`proposalsBySupplier/beta/${proposal.id}`]: proposal,
    [`ordersByBuyer/alpha/${order.id}`]: order,
    [`ordersBySupplier/beta/${order.id}`]: order,
  });
  return { client, repository, input, proposalInput, demand, proposal, order };
}

test('buyer evaluation stores four criteria and the calculated overall score on both order views', async () => {
  const { client, repository, order } = await marketplaceContext({ orderStatus: 'delivered' });
  const criteria = { quality: 5, punctuality: 4, communication: 3, documentation: 5 };
  await assert.rejects(repository.workflow.evaluateOrder('buyer', order.id, { criteria: { ...criteria, quality: 0 } }));
  assert.equal((await client.read(`ordersByBuyer/alpha/${order.id}`)).evaluation, undefined);
  await repository.workflow.evaluateOrder('buyer', order.id, { criteria, comment: 'Entrega conferida.' });
  const buyer = (await client.read(`ordersByBuyer/alpha/${order.id}`)).evaluation;
  const supplier = (await client.read(`ordersBySupplier/beta/${order.id}`)).evaluation;
  assert.equal(buyer.score, 4.3);
  assert.deepEqual(buyer.criteria, criteria);
  assert.equal(buyer.comment, 'Entrega conferida.');
  assert.ok(Number.isFinite(buyer.evaluatedAt));
  assert.deepEqual(supplier, buyer);
  await assert.rejects(repository.workflow.evaluateOrder('buyer', order.id, { criteria }));
});

function interruptReadsAfterCommit(client, method) {
  const read = client.read;
  const original = client[method];
  client[method] = async (...args) => {
    const result = await original(...args);
    client.read = async () => { throw new Error('Leitura interrompida depois da confirmação.'); };
    return result;
  };
  return () => { client.read = read; client[method] = original; };
}

test('multi-item inspections preserve separate approvals and only release a fully approved order', async () => {
  const { client, repository, order } = await marketplaceContext();
  const mixed = { ...order, quantity: 30, items: [
    { id: 'a', description: 'Eixo', quantity: 10, unit: 'un' },
    { id: 'b', description: 'Tubo', quantity: 20, unit: 'm' },
  ] };
  for (const side of ['ordersByBuyer/alpha', 'ordersBySupplier/beta']) await client.write(`${side}/${order.id}`, mixed);
  const evidence = { plan: 'PI-2', evidence: 'Medição de todos os itens' };
  await assert.rejects(repository.workflow.recordInspection('supplier', order.id, { ...evidence, approved: 30 }), /cada item/i);
  await repository.workflow.recordInspection('supplier', order.id, { ...evidence, itemApprovals: [{ itemId: 'a', approved: 10 }, { itemId: 'b', approved: 19 }] });
  assert.equal((await client.read(`ordersByBuyer/alpha/${order.id}`)).status, 'blocked');
  await assert.rejects(repository.workflow.dispatchOrder('supplier', order.id), /liberado/i);
  await repository.workflow.recordInspection('supplier', order.id, { ...evidence, itemApprovals: [{ itemId: 'a', approved: 10 }, { itemId: 'b', approved: 20 }] });
  const buyerCopy = await client.read(`ordersByBuyer/alpha/${order.id}`);
  const supplierCopy = await client.read(`ordersBySupplier/beta/${order.id}`);
  assert.equal(buyerCopy.status, 'released');
  assert.deepEqual(buyerCopy, supplierCopy);
  assert.equal(Object.values(buyerCopy.inspections).at(-1).itemApprovals[1].approved, 20);
});

test('accepted orders retain the delivery address and requested date', async () => {
  const { repository, demand, proposal } = await marketplaceContext({ demandStatus: 'published' });
  const id = await repository.workflow.acceptProposal('buyer', proposal.id, 'version-1');
  const order = repository.workflow.read('buyer').orders.find(item => item.id === id);
  assert.equal(order.destination, demand.destination);
  assert.equal(order.requiredBy, demand.requiredBy);
});

test('draft item identifiers cannot collide after whitespace normalization', async () => {
  const { repository, input } = draftContext();
  await assert.rejects(repository.workflow.createDemand('buyer', { ...input, items: [
    { ...input.items[0], id: 'item-1' }, { ...input.items[0], id: ' item-1 ' },
  ] }), /identificadores diferentes/i);
});

const confirmedWrites = [
  {
    name: 'draft creation', method: 'write', workspace: 'buyer',
    run: ({ repository, input }) => repository.workflow.createDemand('buyer', { ...input, title: 'Novo rascunho' }),
    check: (data, id) => {
      assert.equal(data.demands.length, 3);
      assert.equal(data.demands.find(item => item.id === id).title, 'Novo rascunho');
    },
  },
  {
    name: 'draft edit', method: 'transaction', workspace: 'buyer',
    run: ({ repository, input, demand }) => repository.workflow.updateDemand('buyer', demand.id, { ...input, title: 'Título atualizado' }, demand.updatedAt),
    check: data => assert.equal(data.demands.find(item => item.id === 'demand-1').title, 'Título atualizado'),
  },
  {
    name: 'publication', method: 'patch', workspace: 'buyer',
    run: ({ repository, demand }) => repository.workflow.publishDemand('buyer', demand.id),
    check: data => assert.equal(data.demands.find(item => item.id === 'demand-1').status, 'published'),
  },
  {
    name: 'proposal version', method: 'patch', workspace: 'supplier', options: { demandStatus: 'published' },
    run: ({ repository, proposalInput, demand }) => repository.workflow.sendProposal('supplier', demand.id, { ...proposalInput, totalCents: 11000 }),
    check: (data, id) => {
      assert.equal(data.proposals.length, 1);
      assert.equal(data.proposals[0].versions.length, 2);
      assert.equal(data.proposals[0].versions[0].id, 'version-1');
      assert.equal(data.proposals[0].versions[1].id, id);
      assert.equal(data.proposals[0].versions[1].totalCents, 11000);
    },
  },
  {
    name: 'proposal acceptance', method: 'patch', workspace: 'buyer', options: { demandStatus: 'published' },
    run: ({ repository, proposal }) => repository.workflow.acceptProposal('buyer', proposal.id, 'version-1'),
    check: (data, id) => {
      assert.equal(id, 'order_demand-1');
      assert.equal(data.orders.length, 2);
      assert.equal(data.orders.find(item => item.id === id).status, 'accepted');
      assert.deepEqual(data.orders.find(item => item.id === id).inspections, []);
      assert.equal(data.demands.find(item => item.id === 'demand-1').status, 'ordered');
    },
  },
  {
    name: 'inspection', method: 'patch', workspace: 'supplier', options: { orderStatus: 'blocked' },
    run: ({ repository, order }) => repository.workflow.recordInspection('supplier', order.id, { approved: 10, plan: 'PI-2', evidence: 'Aprovado' }),
    check: data => {
      assert.equal(data.orders[0].status, 'released');
      assert.equal(data.orders[0].inspections.length, 2);
      assert.equal(data.orders[0].inspections[0].id, 'previous');
      assert.equal(data.orders[0].inspections[1].evidence, 'Aprovado');
    },
  },
  {
    name: 'dispatch', method: 'patch', workspace: 'supplier', options: { orderStatus: 'released' },
    run: ({ repository, order }) => repository.workflow.dispatchOrder('supplier', order.id),
    check: data => { assert.equal(data.orders[0].status, 'dispatched'); assert.ok(data.orders[0].dispatchedAt); },
  },
  {
    name: 'delivery confirmation', method: 'patch', workspace: 'buyer', options: { orderStatus: 'dispatched' },
    run: ({ repository, order }) => repository.workflow.confirmDelivery('buyer', order.id),
    check: data => { assert.equal(data.orders[0].status, 'delivered'); assert.ok(data.orders[0].deliveredAt); },
  },
  {
    name: 'evaluation', method: 'patch', workspace: 'buyer', options: { orderStatus: 'delivered' },
    run: ({ repository, order }) => repository.workflow.evaluateOrder('buyer', order.id, { score: 5, comment: 'Entrega conforme.' }),
    check: data => assert.deepEqual(data.orders[0].evaluation, { score: 5, comment: 'Entrega conforme.' }),
  },
];

for (const scenario of confirmedWrites) {
  test(`confirmed ${scenario.name} stays successful and visible when refresh fails`, async () => {
    const context = await marketplaceContext(scenario.options);
    const { client, repository } = context;
    await repository.getOperations(scenario.workspace);
    const restore = interruptReadsAfterCommit(client, scenario.method);
    const id = await scenario.run(context);
    const data = repository.workflow.read(scenario.workspace);
    scenario.check(data, id);
    assert.equal(data.orders.find(item => item.id === 'order_other').version.totalCents, 10000);
    if (scenario.workspace === 'buyer') assert.equal(data.demands.find(item => item.id === 'other').title, 'Registro anterior');
    assert.match(repository.workflow.getSyncWarning(scenario.workspace), /salv|confirmad/i);
    assert.equal(repository.workflow.getSyncWarning('another-workspace'), null);
    restore();
    assert.equal((await repository.getOperations(scenario.workspace)).status, 'ready');
    assert.equal(repository.workflow.getSyncWarning(scenario.workspace), null);
  });
}

for (const scenario of confirmedWrites.slice(0, 3)) {
  test(`rejected ${scenario.name} propagates the write error without changing the snapshot`, async () => {
    const context = await marketplaceContext();
    const { client, repository } = context;
    await repository.getOperations(scenario.workspace);
    const before = repository.workflow.read(scenario.workspace);
    const error = new Error('PERMISSION_DENIED');
    client[scenario.method] = async () => { throw error; };
    await assert.rejects(scenario.run(context), failure => failure === error);
    assert.deepEqual(repository.workflow.read(scenario.workspace), before);
    assert.equal(repository.workflow.getSyncWarning(scenario.workspace), null);
  });
}

test('proposal validity rejects an impossible calendar date without adding a version', async () => {
  const { client, repository, demand, proposalInput, proposal } = await marketplaceContext({ demandStatus: 'published' });
  await assert.rejects(repository.workflow.sendProposal('supplier', demand.id, { ...proposalInput, validUntil: '2027-02-31' }), /data válida/i);
  assert.equal(Object.keys(client.dump().proposalsBySupplier.beta[proposal.id].versions).length, 1);
});

test('the first confirmed proposal populates the local snapshot and reset clears pending synchronization', async () => {
  const { client, repository, demand, proposalInput } = await marketplaceContext({ demandStatus: 'published' });
  await client.write('proposalsBySupplier/beta', null);
  await client.write('proposalsByBuyer/alpha', null);
  await client.write('ordersBySupplier/beta', null);
  await repository.getOperations('supplier');
  interruptReadsAfterCommit(client, 'patch');
  const versionId = await repository.workflow.sendProposal('supplier', demand.id, proposalInput);
  const data = repository.workflow.read('supplier');
  assert.equal(data.proposals.length, 1);
  assert.equal(data.proposals[0].versions.length, 1);
  assert.equal(data.proposals[0].versions[0].id, versionId);
  assert.equal(data.proposals[0].versions[0].revision, 1);
  assert.deepEqual(data.suppliers, [{ id: 'beta', name: 'Beta' }]);
  assert.ok(repository.workflow.getSyncWarning('supplier'));
  await repository.reset();
  assert.deepEqual(repository.workflow.read('supplier'), { demands: [], proposals: [], orders: [], suppliers: [] });
  assert.equal(repository.workflow.getSyncWarning('supplier'), null);
});

test('a confirmed draft with an unresolved server timestamp cannot use it as an edit revision', async () => {
  const { client, repository, input } = draftContext();
  client.timestamp = () => ({ '.sv': 'timestamp' });
  const restore = interruptReadsAfterCommit(client, 'write');
  const id = await repository.workflow.createDemand('buyer', input);
  const saved = repository.workflow.read('buyer').demands[0];
  assert.equal(saved.id, id);
  assert.deepEqual(saved.updatedAt, { '.sv': 'timestamp' });
  restore();
  await assert.rejects(repository.workflow.updateDemand('buyer', id, { ...input, title: 'Revisão indevida' }, saved.updatedAt), /reabra.*versão atual/i);
  assert.equal((await client.read(`demandsByBuyer/alpha/${id}`)).title, 'Componentes');
});

test('a contracted supplier sees an ordered opportunity using only authorized projections', async () => {
  const { client, repository, demand } = await marketplaceContext({ demandStatus: 'ordered', orderDemandId: 'demand-1' });
  const read = client.read;
  client.read = async path => {
    if (!['opportunitiesBySupplier/beta', 'proposalsBySupplier/beta', 'ordersBySupplier/beta'].includes(path)) throw new Error('PERMISSION_DENIED');
    return read(path);
  };
  const result = await repository.getOperations('supplier');
  assert.equal(result.status, 'ready');
  assert.equal(result.data.demands.find(item => item.id === demand.id).status, 'ordered');
  assert.equal(result.data.demands[0].match.eligible, true);
  assert.equal(client.dump().opportunitiesBySupplier.beta[demand.id].status, 'published');
});

test('a contracted supplier cannot send another version through a stale published opportunity', async () => {
  const { client, repository, demand, proposalInput } = await marketplaceContext({ demandStatus: 'ordered', orderDemandId: 'demand-1' });
  await assert.rejects(repository.workflow.sendProposal('supplier', demand.id, proposalInput), /não está aberta/i);
  assert.equal(Object.keys(client.dump().proposalsBySupplier.beta['demand-1_beta'].versions).length, 1);
});

test('editing a draft keeps its identity and creation time while replacing its items', async () => {
  const { client, repository, input } = draftContext();
  const id = await repository.workflow.createDemand('buyer', input);
  const before = repository.workflow.read('buyer').demands[0];
  await repository.workflow.updateDemand('buyer', id, {
    ...input, title: 'Componentes revisados', description: 'Objetivo revisado',
    items: [{ ...input.items[0], id: before.items[0].id, quantity: 20 }, { ...input.items[0], description: 'Eixo', quantity: 5 }],
  }, before.updatedAt);
  const after = repository.workflow.read('buyer').demands[0];
  assert.equal(after.id, before.id);
  assert.equal(after.createdAt, before.createdAt);
  assert.equal(after.createdBy, before.createdBy);
  assert.equal(after.title, 'Componentes revisados');
  assert.equal(after.description, 'Objetivo revisado');
  assert.equal(after.quantity, 25);
  assert.equal(after.items[0].id, before.items[0].id);
  assert.equal(new Set(after.items.map(item => item.id)).size, 2);
  assert.equal(after.status, 'draft');
  assert.equal(client.dump().publishedDemands, undefined);
  assert.equal(client.dump().opportunitiesBySupplier, undefined);
});

test('draft version advances even when consecutive edits share the same clock tick', async t => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-09-27T15:00:00Z') });
  const { repository, input } = draftContext();
  const id = await repository.workflow.createDemand('buyer', input);
  const original = repository.workflow.read('buyer').demands[0];
  await repository.workflow.updateDemand('buyer', id, { ...input, title: 'Primeira revisão' }, original.updatedAt, original.revision);
  const revision = repository.workflow.read('buyer').demands[0];
  assert.ok(revision.revision > original.revision);
  assert.equal(revision.updatedAt, original.updatedAt);
  await assert.rejects(repository.workflow.updateDemand('buyer', id, { ...input, title: 'Edição antiga' }, original.updatedAt, original.revision), /alterado/);
  await repository.workflow.updateDemand('buyer', id, { ...input, title: 'Segunda revisão' }, revision.updatedAt, revision.revision);
  assert.ok(repository.workflow.read('buyer').demands[0].revision > revision.revision);
});

test('draft editing preserves Firebase server timestamp markers without numeric conversion', async () => {
  const { client, repository, input } = draftContext();
  const id = await repository.workflow.createDemand('buyer', input);
  const original = repository.workflow.read('buyer').demands[0];
  client.timestamp = () => ({ '.sv': 'timestamp' });
  await repository.workflow.updateDemand('buyer', id, input, original.updatedAt, original.revision);
  const edited = await client.read(`demandsByBuyer/alpha/${id}`);
  assert.deepEqual(edited.updatedAt, { '.sv': 'timestamp' });
  assert.equal(edited.revision, original.revision + 1);
});

test('draft editing rejects published, missing and stale records without overwriting them', async () => {
  const { client, repository, input } = draftContext();
  const id = await repository.workflow.createDemand('buyer', input);
  const before = repository.workflow.read('buyer').demands[0];
  const path = `demandsByBuyer/alpha/${id}`;
  await client.write(path, { ...before, title: 'Outra revisão', updatedAt: before.updatedAt + 1 });
  await assert.rejects(repository.workflow.updateDemand('buyer', id, input, before.updatedAt), /alterad|atualiz/i);
  assert.equal((await client.read(path)).title, 'Outra revisão');
  await client.write(path, { ...before, status: 'published' });
  await assert.rejects(repository.workflow.updateDemand('buyer', id, input, before.updatedAt), /rascunho|publicad/i);
  assert.equal((await client.read(path)).status, 'published');
  await assert.rejects(repository.workflow.updateDemand('buyer', 'missing', input, before.updatedAt), /encontrad/i);
  await assert.rejects(repository.workflow.updateDemand('other', id, input, before.updatedAt), /contexto/i);
});

test('draft editing detects a concurrent publication inside the transaction', async () => {
  const { client, repository, input } = draftContext();
  const id = await repository.workflow.createDemand('buyer', input);
  const before = repository.workflow.read('buyer').demands[0];
  const original = client.transaction;
  client.transaction = async (path, updater) => {
    await client.write(path, { ...before, status: 'published' });
    return original(path, updater);
  };
  await assert.rejects(repository.workflow.updateDemand('buyer', id, input, before.updatedAt), /rascunho|publicad/i);
  assert.equal((await client.read(`demandsByBuyer/alpha/${id}`)).status, 'published');
});

const eligibleProfile = organizationId => ({
  organizationId, organizationName: organizationId, organizationStatus: 'active',
  categories: ['usinados'], materials: ['aço'], processes: ['usinagem'], regions: ['SP'], capacity: 100,
});

test('publication preserves a concurrent edit and refreshes the rejected draft', async () => {
  const { client, repository, input } = draftContext();
  const id = await repository.workflow.createDemand('buyer', input);
  const path = `demandsByBuyer/alpha/${id}`;
  const before = await client.read(path);
  const edited = { ...before, title: 'Revisão salva em outra sessão', updatedAt: before.updatedAt + 1 };
  const patch = client.patch;
  client.patch = async updates => {
    // Simulate the server revision check. Emulator tests exercise the real rules.
    await client.write(path, edited);
    const candidate = updates[path];
    if (candidate.publicationSourceUpdatedAt !== undefined && candidate.publicationSourceUpdatedAt !== edited.updatedAt) {
      throw new Error('PERMISSION_DENIED');
    }
    return patch(updates);
  };
  await assert.rejects(repository.workflow.publishDemand('buyer', id), /alterad.*outra sessão/i);
  assert.deepEqual(await client.read(path), edited);
  assert.deepEqual(repository.workflow.read('buyer').demands[0], edited);
  assert.equal(client.dump().publishedDemands, undefined);
  assert.equal(client.dump().opportunitiesBySupplier, undefined);
});

test('publication records its recipients privately and acceptance closes every eligible opportunity', async () => {
  const { client, repository, demand, proposal } = await marketplaceContext();
  for (const id of ['beta', 'gamma']) await client.write(`supplierProfiles/${id}`, eligibleProfile(id));
  await client.write('supplierProfiles/ineligible', { ...eligibleProfile('ineligible'), processes: ['fundição'] });
  await repository.workflow.publishDemand('buyer', demand.id);
  const published = client.dump();
  assert.equal(published.demandsByBuyer.alpha[demand.id].publicationSourceUpdatedAt, demand.updatedAt);
  assert.deepEqual(published.demandsByBuyer.alpha[demand.id].opportunitySupplierIds, ['beta', 'gamma']);
  assert.equal(published.publishedDemands[demand.id].opportunitySupplierIds, undefined);
  assert.equal(published.opportunitiesBySupplier.beta[demand.id].opportunitySupplierIds, undefined);
  assert.equal(published.opportunitiesBySupplier.ineligible, undefined);
  const gammaMatch = published.opportunitiesBySupplier.gamma[demand.id].match;
  let acceptancePatch;
  const patch = client.patch;
  client.patch = async updates => { acceptancePatch = updates; return patch(updates); };
  await repository.workflow.acceptProposal('buyer', proposal.id, 'version-1');
  assert.ok(acceptancePatch[`ordersByBuyer/alpha/order_${demand.id}`]);
  for (const id of ['beta', 'gamma']) {
    assert.equal(acceptancePatch[`opportunitiesBySupplier/${id}/${demand.id}/status`], 'ordered');
    assert.equal(client.dump().opportunitiesBySupplier[id][demand.id].status, 'ordered');
  }
  assert.deepEqual(client.dump().opportunitiesBySupplier.gamma[demand.id].match, gammaMatch);
  assert.equal(client.dump().publishedDemands[demand.id].opportunitySupplierIds, undefined);
  await assert.rejects(repository.workflow.publishDemand('buyer', demand.id), /rascunho/i);
  const competitor = createFirebaseMarketplaceRepository({ client, getUser: () => user('owner'), getWorkspace: () => ({
    id: 'competitor', organizationId: 'gamma', organizationName: 'Gamma', organizationRole: 'supplier', memberUid: 'owner', canEnter: true,
  }) });
  const operations = await competitor.getOperations('competitor');
  assert.equal(operations.data.demands[0].status, 'ordered');
  await assert.rejects(competitor.workflow.sendProposal('competitor', demand.id, {
    totalCents: 10000, freightCents: 0, leadTimeDays: 10, manufacturer: 'Gamma', payment: '30 dias', warranty: '12 meses', technical: 'Conforme', validUntil: '2099-12-10',
  }), /não está aberta/i);
});

test('buyer can invite an eligible supplier added after publication and acceptance closes that opportunity', async () => {
  const { client, repository, demand, proposal } = await marketplaceContext();
  await client.write('supplierProfiles/beta', eligibleProfile('beta'));
  await repository.workflow.publishDemand('buyer', demand.id);
  await client.write('supplierProfiles/gamma', eligibleProfile('gamma'));
  await client.write('supplierProfiles/delta', { ...eligibleProfile('delta'), processes: ['fundição'] });
  await assert.rejects(repository.inviteSupplierToDemand('buyer', demand.id, 'delta'), /critérios essenciais/i);
  assert.equal(await client.read(`opportunitiesBySupplier/delta/${demand.id}`), null);
  const profiles = await repository.listSupplierProfiles('buyer');
  assert.deepEqual(profiles.map((profile) => profile.organizationId), ['beta', 'delta', 'gamma']);
  assert.deepEqual(await repository.getBuyerInvitations('buyer', demand.id), ['beta']);
  assert.deepEqual(await repository.inviteSupplierToDemand('buyer', demand.id, 'gamma'), { alreadyAvailable: false });
  assert.deepEqual(await repository.inviteSupplierToDemand('buyer', demand.id, 'gamma'), { alreadyAvailable: true });
  assert.deepEqual((await repository.getBuyerInvitations('buyer', demand.id)).sort(), ['beta', 'gamma']);
  assert.equal((await client.read(`opportunitiesBySupplier/gamma/${demand.id}`)).match.eligible, true);
  assert.equal((await client.read(`publishedDemands/${demand.id}`)).opportunitySupplierIds, undefined);
  await repository.workflow.acceptProposal('buyer', proposal.id, 'version-1');
  assert.equal((await client.read(`opportunitiesBySupplier/gamma/${demand.id}`)).status, 'ordered');
});

test('invalid supplier identifiers stop publication before writing any projection', async () => {
  const { client, repository, input } = draftContext();
  const id = await repository.workflow.createDemand('buyer', input);
  await client.write('supplierProfiles/invalid', eligibleProfile('gamma/other'));
  await assert.rejects(repository.workflow.publishDemand('buyer', id), /identifica/i);
  assert.equal((await client.read(`demandsByBuyer/alpha/${id}`)).status, 'draft');
  assert.equal(client.dump().publishedDemands, undefined);
});

test('new draft items do not reuse surviving identifiers and invalid edits leave the draft intact', async () => {
  const { client, repository, input } = draftContext();
  const id = await repository.workflow.createDemand('buyer', { ...input, items: [{ ...input.items[0], id: 'item-2' }] });
  const before = repository.workflow.read('buyer').demands[0];
  await repository.workflow.updateDemand('buyer', id, { ...input, items: [before.items[0], input.items[0]] }, before.updatedAt);
  const saved = await client.read(`demandsByBuyer/alpha/${id}`);
  assert.equal(saved.items[0].id, 'item-2');
  assert.notEqual(saved.items[1].id, 'item-2');
  for (const patch of [
    { title: '' },
    { items: [{ ...input.items[0], quantity: 0 }] },
    { items: [{ ...input.items[0], id: 'repeated' }, { ...input.items[0], id: 'repeated' }] },
  ]) {
    await assert.rejects(repository.workflow.updateDemand('buyer', id, { ...input, ...patch }, saved.updatedAt));
    assert.deepEqual(await client.read(`demandsByBuyer/alpha/${id}`), saved);
  }
});

test('resubmission preserves the review, supports a second role and rejects other owners and closed applications', async () => {
  const client = memoryClient();
  let account = user('owner');
  const service = createFirebaseWorkspaceService({ client, getUser: () => account });
  const application = { name: 'Empresa Revisada', cnpj: '12345678000190', city: 'Campinas', state: 'SP', contact: 'contato@sivi.test', roles: ['buyer'], onboardingVersion: 1 };
  const created = await service.createOrganization(application);
  await client.write('platformAdmins/admin', true);
  const administration = createFirebaseAdminService({ client, getUser: () => user('admin') });
  await assert.rejects(administration.setOrganizationStatus(created.organizationId, 'changes_requested', ''));
  await administration.setOrganizationStatus(created.organizationId, 'changes_requested', 'Confirme o contato.');
  account = user('outsider');
  await assert.rejects(service.resubmitOrganization(created.organizationId, application));
  account = user('owner');
  await service.resubmitOrganization(created.organizationId, { ...application, roles: ['buyer', 'supplier'] });
  const organization = await service.getOrganization(created.organizationId);
  assert.equal(organization.status, 'pending');
  assert.equal(organization.reviewReason, 'Confirme o contato.');
  assert.equal((await service.listWorkspaces()).length, 2);
  await administration.setOrganizationStatus(created.organizationId, 'rejected', 'Cadastro duplicado.');
  await assert.rejects(service.resubmitOrganization(created.organizationId, application));
  await administration.setOrganizationStatus(created.organizationId, 'active');
  await assert.rejects(service.resubmitOrganization(created.organizationId, application));
});

test("creates a persisted company membership and restores its workspace", async () => {
  const client = memoryClient();
  let currentUser = user("ana");
  const service = createFirebaseWorkspaceService({ client, getUser: () => currentUser });

  const created = await service.createOrganization({ name: "Metal Alpha", roles: ["buyer", "supplier"] });
  let restored = await service.listWorkspaces();

  assert.equal(created.status, "pending");
  assert.equal(restored.length, 2);
  assert.ok(restored.every((workspace) => workspace.canEnter === false));
  assert.equal(client.dump().membershipsByUser.ana[created.organizationId].status, "pending");

  await client.write("platformAdmins/admin", true);
  currentUser = user("admin");
  const admin = createFirebaseAdminService({ client, getUser: () => currentUser });
  await admin.setOrganizationStatus(created.organizationId, "active");
  currentUser = user("ana");
  restored = await service.listWorkspaces();
  assert.deepEqual(restored.map(({ organizationRole }) => organizationRole), ["buyer", "supplier"]);
  assert.ok(restored.every((workspace) => workspace.canEnter));
});

test("administrator approval migrates a legacy single-role company", async () => {
  const client = memoryClient();
  await client.write("platformAdmins/admin", true);
  await client.write("organizations/legacy-supplier", {
    id: "legacy-supplier",
    name: "Fornecedor Legado",
    role: "supplier",
    status: "pending",
    createdBy: "legacy-owner",
    createdAt: 1,
    updatedAt: 1,
  });
  await client.write("membershipsByUser/legacy-owner/legacy-supplier", {
    organizationName: "Fornecedor Legado",
    organizationRole: "supplier",
    status: "pending",
    userRoles: ["owner"],
    permissions: ["opportunities:read"],
    createdAt: 1,
  });

  const admin = createFirebaseAdminService({ client, getUser: () => user("admin") });
  await admin.setOrganizationStatus("legacy-supplier", "active");

  const snapshot = client.dump();
  assert.deepEqual(snapshot.organizations["legacy-supplier"].roles, { buyer: false, supplier: true });
  assert.deepEqual(snapshot.membershipsByUser["legacy-owner"]["legacy-supplier"].organizationRoles, { buyer: false, supplier: true });
  assert.equal(snapshot.organizationMembers["legacy-supplier"]["legacy-owner"].status, "active");
});

test("persists the complete buyer and supplier journey without duplicate orders", async () => {
  const client = memoryClient();
  let currentUser = user("buyer-user");
  const buyerService = createFirebaseWorkspaceService({ client, getUser: () => currentUser });
  const buyerRegistration = await buyerService.createOrganization({ name: "Compradora Alpha", roles: ["buyer"] });
  currentUser = user("supplier-user");
  const supplierService = createFirebaseWorkspaceService({ client, getUser: () => currentUser });
  const supplierRegistration = await supplierService.createOrganization({ name: "Fornecedor Vetor", roles: ["supplier"] });

  await client.write("platformAdmins/admin", true);
  currentUser = user("admin");
  const admin = createFirebaseAdminService({ client, getUser: () => currentUser });
  await admin.setOrganizationStatus(buyerRegistration.organizationId, "active");
  await admin.setOrganizationStatus(supplierRegistration.organizationId, "active");
  currentUser = user("buyer-user");
  const [buyer] = await buyerService.listWorkspaces();
  currentUser = user("supplier-user");
  const [supplier] = await supplierService.listWorkspaces();

  const workspaces = new Map([[buyer.id, buyer], [supplier.id, supplier]]);
  const repository = createFirebaseMarketplaceRepository({
    client,
    getUser: () => currentUser,
    getWorkspace: (id) => workspaces.get(id),
  });

  const supplierProfiles = createFirebaseSupplierProfileService({
    client,
    getUser: () => currentUser,
    getWorkspace: (id) => workspaces.get(id),
  });
  await supplierProfiles.saveProfile(supplier.id, {
    categories: "engrenagens",
    materials: "aço 1045",
    processes: "usinagem",
    regions: "Campinas/SP",
    certifications: "ISO 9001",
    capacity: "1000",
    leadTimeDays: "20",
    description: "Usinagem de engrenagens industriais sob desenho.",
  });

  currentUser = user("buyer-user");
  const demandId = await repository.workflow.createDemand(buyer.id, {
    title: "500 engrenagens",
    requiredBy: "2026-12-20",
    destination: "Campinas/SP",
    region: "Campinas/SP",
    description: "Produção conforme desenho técnico aprovado.",
    items: [{ description: "Engrenagem industrial", category: "engrenagens", material: "aço 1045", process: "usinagem", certifications: "ISO 9001", quantity: "500", unit: "un" }],
  });
  await repository.workflow.publishDemand(buyer.id, demandId);

  currentUser = user("supplier-user");
  const opportunities = await repository.getOperations(supplier.id);
  assert.equal(opportunities.data.demands[0].match.status, "compatible");
  const versionId = await repository.workflow.sendProposal(supplier.id, demandId, {
    totalCents: 1250000,
    freightCents: 50000,
    leadTimeDays: "20",
    validUntil: "2026-12-10",
    manufacturer: "Vetor",
    payment: "28 dias",
    warranty: "12 meses",
    technical: "Atende integralmente.",
  });

  currentUser = user("buyer-user");
  const buyerData = (await repository.getOperations(buyer.id)).data;
  const proposal = buyerData.proposals[0];
  const orderId = await repository.workflow.acceptProposal(buyer.id, proposal.id, versionId);
  assert.equal(await repository.workflow.acceptProposal(buyer.id, proposal.id, versionId), orderId);

  currentUser = user("supplier-user");
  await repository.workflow.recordInspection(supplier.id, orderId, { approved: "500", plan: "PI-01 v1", evidence: "Lote aprovado." });
  await repository.workflow.dispatchOrder(supplier.id, orderId);

  currentUser = user("buyer-user");
  await repository.workflow.confirmDelivery(buyer.id, orderId);
  await repository.workflow.evaluateOrder(buyer.id, orderId, { score: "5", comment: "Entrega conforme." });

  const reloaded = createFirebaseMarketplaceRepository({ client, getUser: () => currentUser, getWorkspace: (id) => workspaces.get(id) });
  const finalData = (await reloaded.getOperations(buyer.id)).data;
  assert.equal(finalData.demands[0].status, "ordered");
  assert.equal(finalData.proposals[0].versions.length, 1);
  assert.equal(finalData.orders.length, 1);
  assert.equal(finalData.orders[0].status, "delivered");
  assert.deepEqual(finalData.orders[0].evaluation, { score: 5, comment: "Entrega conforme." });
});
