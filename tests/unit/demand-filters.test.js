import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemandFilters } from '../../src/pages/operations/demand-filters.js';

test('demand filters return for the same account, company and role without leaking to another context', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  const workspace = { memberUid: 'ana', id: 'company-a', organizationRole: 'buyer' };
  createDemandFilters(workspace, storage).save('Engrenagens', 'published');
  assert.deepEqual(createDemandFilters(workspace, storage).read(), { search: 'Engrenagens', status: 'published' });
  for (const other of [{ memberUid: 'bruno' }, { id: 'company-b' }, { organizationRole: 'supplier' }]) {
    assert.deepEqual(createDemandFilters({ ...workspace, ...other }, storage).read(), { search: '', status: '' });
  }
});

test('filters tolerate broken storage and remain editable with persistence unavailable', () => {
  for (const storage of [undefined, { getItem: () => '{' }, { getItem: () => '{"search":{},"status":"unknown"}' }]) {
    const filters = createDemandFilters({ id: 'a' }, storage);
    assert.deepEqual(filters.read(), { search: '', status: '' });
    filters.save('Eixo', 'draft');
    assert.deepEqual(filters.read(), { search: 'Eixo', status: 'draft' });
    filters.save('', '');
    assert.deepEqual(filters.read(), { search: '', status: '' });
  }
});
