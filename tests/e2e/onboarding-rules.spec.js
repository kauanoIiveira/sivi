import { expect, test } from '@playwright/test';
import { createVerifiedUser, resetAuthEmulator, resetDatabaseEmulator, seedDatabaseEmulator } from '../helpers/auth-emulator.js';

test('application rules deny self-approval, forged review, privilege edits and other-account changes', async () => {
  await resetAuthEmulator(); await resetDatabaseEmulator();
  const password = 'SiviRules2026';
  const owner = await createVerifiedUser({ email: 'rules-owner@sivi.test', password, displayName: 'Responsável' });
  const outsider = await createVerifiedUser({ email: 'rules-other@sivi.test', password, displayName: 'Outra conta' });
  const tokens = await Promise.all([owner, outsider].map(async account => {
    const response = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: account.email, password, returnSecureToken: true }) });
    return (await response.json()).idToken;
  }));
  const organization = { id: 'application', name: 'Indústria Protegida', roles: { buyer: true, supplier: false }, status: 'changes_requested', createdBy: owner.uid, createdAt: 1, updatedAt: 1, reviewedBy: 'admin', reviewedAt: 2, reviewReason: 'Confirme o contato.' };
  const membership = { organizationName: organization.name, organizationRoles: organization.roles, status: organization.status, userRoles: ['owner'], permissions: { buyer: ['demands:write'] }, createdAt: 1 };
  await seedDatabaseEmulator('organizations/application', organization);
  await seedDatabaseEmulator(`membershipsByUser/${owner.uid}/application`, membership);
  await seedDatabaseEmulator(`organizationMembers/application/${owner.uid}`, { status: organization.status, userRoles: ['owner'], joinedAt: 1 });
  const request = (path, method, body, token = tokens[0]) => fetch(`http://127.0.0.1:9000/${path}.json?ns=sivi-org-default-rtdb&auth=${token}`, { method, headers: { 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  expect((await request('organizations/application/status', 'PUT', 'active')).status).toBe(401);
  expect((await request('platformAdmins/' + owner.uid, 'PUT', true)).status).toBe(401);
  expect((await request('organizations/application/reviewReason', 'PUT', 'Aprovado')).status).toBe(401);
  expect((await request('organizations/application', 'DELETE')).status).toBe(401);
  expect((await request('organizations/application', 'GET', undefined, tokens[1])).status).toBe(401);
  expect((await request('organizations/application/name', 'PUT', 'Intrusão', tokens[1])).status).toBe(401);
  expect((await request(`membershipsByUser/${owner.uid}/application/permissions`, 'PUT', { administration: ['all'] })).status).toBe(401);
  expect((await request(`demandsByBuyer/application`, 'GET')).status).toBe(401);
  const updated = { ...organization, name: 'Indústria Revisada', status: 'pending', updatedAt: 3 };
  const patch = { 'organizations/application': updated, [`membershipsByUser/${owner.uid}/application/organizationName`]: updated.name, [`membershipsByUser/${owner.uid}/application/status`]: 'pending', [`organizationMembers/application/${owner.uid}/status`]: 'pending' };
  expect((await request('', 'PATCH', patch)).status).toBe(200);
  expect((await request(`demandsByBuyer/application`, 'GET')).status).toBe(401);
  await seedDatabaseEmulator('organizations/application/status', 'active');
  expect((await request('', 'PATCH', patch)).status).toBe(401);
  await seedDatabaseEmulator('organizations/application/status', 'rejected');
  expect((await request('', 'PATCH', patch)).status).toBe(401);
});
