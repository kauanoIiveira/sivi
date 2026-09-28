import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemandRecovery } from '../../src/pages/operations/demand-recovery.js';

const workspace = { id: 'buyer-a', memberUid: 'ana', organizationRole: 'buyer' };
const storage = () => { const data = new Map(); return { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) }; };

test('unfinished demand is recovered only for its account, workspace and role', () => {
  const store = storage();
  const value = { title: 'Manutenção', description: 'Objetivo', items: [{ description: 'Eixo', quantity: '10', unit: 'un' }] };
  assert.equal(createDemandRecovery(workspace, store).save(value), true);
  assert.deepEqual(createDemandRecovery(workspace, store).read(), value);
  for (const other of [{ memberUid: 'bruno' }, { id: 'buyer-b' }, { organizationRole: 'supplier' }]) {
    assert.equal(createDemandRecovery({ ...workspace, ...other }, store).read(), null);
  }
  const recovery = createDemandRecovery(workspace, store);
  recovery.clear();
  assert.equal(createDemandRecovery(workspace, store).read(), null);
});

test('recovery rejects corrupt content and reports unavailable persistence', () => {
  for (const value of ['{', 'null', '[]', '{"items":"broken"}', '{"items":[null]}']) {
    assert.equal(createDemandRecovery(workspace, { getItem: () => value }).read(), null);
  }
  const recovery = createDemandRecovery(workspace);
  assert.equal(recovery.save({ title: 'Eixo', items: [] }), false);
  assert.equal(recovery.read(), null);
  assert.doesNotThrow(() => recovery.clear());
});
