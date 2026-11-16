import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApplication, canResubmitApplication } from '../../src/domain/organization-application.js';
const valid = { name: ' Indústria Exemplo ', cnpj: '12.345.678/0001-95', city: 'São Paulo', state: 'sp', contact: '(11) 99999-1234', roles: ['buyer', 'supplier'] };
test('application requires the company name and role and accepts optional details', () => {
  const result = normalizeApplication(valid);
  assert.equal(result.cnpj, '12345678000195');
  assert.equal(result.state, 'SP');
  assert.equal(result.name, 'Indústria Exemplo');
  assert.throws(() => normalizeApplication({ ...valid, name: '' }));
  assert.throws(() => normalizeApplication({ ...valid, roles: [] }));
  assert.throws(() => normalizeApplication({ ...valid, state: 'XX' }));
});
test('only pending applications and requested corrections can be resubmitted', () => {
  assert.equal(canResubmitApplication('pending'), true);
  assert.equal(canResubmitApplication('changes_requested'), true);
  for (const status of ['active', 'blocked', 'rejected', undefined]) assert.equal(canResubmitApplication(status), false);
});
test('an academic application accepts sample details or omits them entirely', () => {
  const base = { name: 'Empresa Acadêmica', roles: ['buyer'] };
  assert.deepEqual(normalizeApplication(base), {
    ...base, cnpj: '', city: '', state: '', contact: '', onboardingVersion: 1,
  });
  const sample = normalizeApplication({ ...base, cnpj: '00.000.000/0000-00', contact: 'Contato fictício' });
  assert.equal(sample.cnpj, '00000000000000');
  assert.equal(sample.contact, 'Contato fictício');
});
