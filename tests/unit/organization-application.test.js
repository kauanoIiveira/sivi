import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApplication, canResubmitApplication } from '../../src/domain/organization-application.js';
const valid = { name: ' Indústria Exemplo ', cnpj: '12.345.678/0001-90', city: 'São Paulo', state: 'sp', contact: '(11) 99999-1234', roles: ['buyer', 'supplier'] };
test('application normalizes company identity and requires complete data', () => {
  const result = normalizeApplication(valid);
  assert.equal(result.cnpj, '12345678000190');
  assert.equal(result.state, 'SP');
  assert.equal(result.name, 'Indústria Exemplo');
  for (const key of ['name', 'cnpj', 'city', 'state', 'contact']) assert.throws(() => normalizeApplication({ ...valid, [key]: '' }));
  assert.throws(() => normalizeApplication({ ...valid, roles: [] }));
  assert.throws(() => normalizeApplication({ ...valid, state: 'XX' }));
});
test('only pending applications and requested corrections can be resubmitted', () => {
  assert.equal(canResubmitApplication('pending'), true);
  assert.equal(canResubmitApplication('changes_requested'), true);
  for (const status of ['active', 'blocked', 'rejected', undefined]) assert.equal(canResubmitApplication(status), false);
});
