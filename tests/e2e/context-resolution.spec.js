import { expect, test } from '@playwright/test';
import { createVerifiedUser, resetAuthEmulator } from '../helpers/auth-emulator.js';

const account = { email: 'contexto@sivi.test', password: 'SiviContext2026', displayName: 'Responsável' };
test.beforeEach(async () => { await resetAuthEmulator(); await createVerifiedUser(account); });

async function controlled(page, service) {
  await page.route('**/src/main.js', route => route.fulfill({ contentType: 'text/javascript', body: `
    import { bootstrapApplication } from '/src/app/bootstrap.js';
    import { auth } from '/src/config/firebase.js';
    const empty = { demands: [], proposals: [], orders: [], suppliers: [] };
    const repository = { workflow: { read: () => empty }, getOperations: async () => ({ status: 'ready', data: empty }), reset() {} };
    const active = () => ({ id: 'empresa', organizationId: 'empresa', organizationName: 'Empresa existente', organizationRole: 'buyer', memberUid: auth.currentUser.uid, canEnter: true, homeRoute: '/app/comprador/inicio' });
    window.reads = 0; window.creations = 0;
    bootstrapApplication({ repository, workspaceService: ${service} });
  ` }));
}

async function login(page, destination = '/acesso?modo=login') {
  await page.goto(`/?authEmulator=1#${destination}`);
  await expect(page.locator('.auth-shell')).toHaveAttribute('data-ui-ready', 'true');
  if (!(await page.locator('#login-email').isVisible())) await page.locator(".auth-shell [data-switch-mode='login']").click();
  await page.locator('#login-email').fill(account.email);
  await page.locator('#login-password').fill(account.password);
  await page.locator('#login-form [type=submit]').click();
}

test('a delayed company query, failure and retry resolve before any company form becomes available', async ({ page }) => {
  await controlled(page, `{ listWorkspaces: () => ++window.reads === 1 ? new Promise((resolve, reject) => { window.finishQuery = resolve; window.failQuery = reject; }) : Promise.resolve([]) }`);
  await login(page);
  await expect(page.locator('[data-feedback]')).toContainText('Consultando');
  await expect(page.locator('[data-create-organization]')).toHaveCount(0);
  await page.evaluate(() => window.failQuery(new Error('Consulta interrompida')));
  await expect(page.locator('[data-feedback]')).toContainText('Não foi possível consultar');
  await expect(page.locator('[data-new]')).toBeDisabled();
  await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await expect(page.locator('[data-create-organization]')).toBeVisible();
  await page.locator('[name=name]').fill('Preenchimento preservado');
  await expect(page.locator('[name=name]')).toHaveValue('Preenchimento preservado');
  expect(await page.evaluate(() => window.reads)).toBe(2);
});

test('a confirmed company remains pending when the subsequent company query fails', async ({ page }) => {
  await controlled(page, `{ listWorkspaces: async () => { if (++window.reads === 2) throw Error('Consulta interrompida'); return window.pendingCompany ? [window.pendingCompany] : []; }, createOrganization: async input => { window.creations++; window.pendingCompany = { ...active(), id: 'nova', organizationId: 'nova', organizationName: input.name, organizationStatus: 'pending', canEnter: false }; return { organizationId: 'nova', workspaces: [window.pendingCompany] }; } }`);
  await login(page, '/acesso?modo=login&atuacao=supplier');
  const form = page.locator('[data-create-organization]');
  await expect(form.locator('[name=roles][value=supplier]')).toBeChecked();
  await form.locator('[name=name]').fill('Empresa confirmada');
  await form.locator('[name=cnpj]').fill('12.345.678/0001-95');
  await form.locator('[name=city]').fill('Diadema');
  await form.locator('[name=state]').selectOption('SP');
  await form.locator('[name=contact]').fill('contato@empresa.test');
  await form.getByRole('button', { name: 'Revisar cadastro' }).click();
  await form.getByRole('button', { name: 'Solicitar acesso', exact: true }).click();
  await expect(page.locator('.context-company')).toContainText('Empresa confirmada');
  await expect(page.locator('.context-company')).toContainText('Em análise');
  await expect(page.locator('[data-feedback]')).toContainText('consulta da lista está temporariamente indisponível');
  await expect(page.locator('[data-create-organization]')).toHaveCount(0);
  expect(await page.evaluate(() => window.creations)).toBe(1);
  await page.getByRole('button', { name: 'Atualizar situação', exact: true }).click();
  await expect(page.locator('.context-company')).toContainText('Empresa confirmada');
  await expect(page.locator('[data-feedback]')).not.toContainText('temporariamente indisponível');
  expect(await page.evaluate(() => window.creations)).toBe(1);
});

test('one activity resolves a protected record and an explicit context change stays at the selector, including reload', async ({ page }) => {
  await controlled(page, `{ listWorkspaces: async () => [active()] }`);
  await login(page, '/app/comprador/demandas?registro=record_12');
  await expect(page).toHaveURL(/#\/app\/comprador\/demandas\?registro=record_12$/);
  await expect(page.locator('[data-workflow]')).toBeVisible();
  await page.getByRole('button', { name: 'Trocar empresa', exact: true }).click();
  await expect(page.locator('.context-company [aria-current=true]')).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/#\/app\/contexto$/);
  await expect(page.locator('.context-company').getByText('Em uso', { exact: true })).toBeVisible();
});

test('an external logout clears the former company before another account finishes loading', async ({ page }) => {
  const second = { email: 'outra-conta@sivi.test', password: account.password, displayName: 'Outra conta' };
  await createVerifiedUser(second);
  await controlled(page, `{ listWorkspaces: async () => { if (++window.reads === 1) return [active()]; return new Promise(resolve => { window.finishNextAccount = resolve; }); } }`);
  await login(page);
  await expect(page.locator('.buyer-overview')).toBeVisible();
  await page.evaluate(async () => { const { logout } = await import('/src/services/auth-service.js'); await logout(); });
  await expect(page.locator('.auth-shell')).toHaveAttribute('data-ui-ready', 'true');
  if (!(await page.locator('#login-email').isVisible())) await page.locator(".auth-shell [data-switch-mode='login']").click();
  await page.locator('#login-email').fill(second.email);
  await page.locator('#login-password').fill(second.password);
  await page.locator('#login-form [type=submit]').click();
  await expect(page.locator('[data-feedback]')).toContainText('Consultando');
  await expect(page.locator('[data-app-root]')).not.toContainText('Empresa existente');
  await page.evaluate(() => window.finishNextAccount([]));
  await expect(page.locator('[data-create-organization]')).toBeVisible();
  await expect(page.locator('[data-app-root]')).not.toContainText('Empresa existente');
});
