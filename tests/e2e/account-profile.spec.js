import { expect, test } from '@playwright/test';
import { createVerifiedUser, resetAuthEmulator } from '../helpers/auth-emulator.js';

const account = { email: 'perfil@sivi.demo', password: 'SiviDemo2026', displayName: 'Comprador Demo' };

async function openAccount(page) {
  const drawer = page.locator('[data-drawer-trigger]');
  if (await drawer.isVisible() && await drawer.getAttribute('aria-expanded') === 'false') await drawer.click();
  await page.locator('[data-account-menu] summary').click();
  await page.locator('[data-open-account]').click();
  return page.getByRole('dialog', { name: 'Minha conta', exact: true });
}

test.describe('authenticated profile', () => {
test.beforeEach(async ({ page }) => {
  await resetAuthEmulator();
  await createVerifiedUser(account);
  await page.route('**/src/main.js', route => route.fulfill({ contentType: 'text/javascript', body: 'import "/tests/support/application-fixture.js";' }));
  await page.goto('/?authEmulator=1#/acesso?modo=login');
  await expect(page.locator('.auth-shell')).toHaveAttribute('data-ui-ready', 'true');
  await page.locator('#login-email').fill(account.email);
  await page.locator('#login-password').fill(account.password);
  await page.locator('#login-form button[type=submit]').click();
  await page.getByRole('button', { name: /Indústrias Alpha/ }).click();
  await expect(page.locator('.buyer-overview')).toBeVisible();
});

test('edits the real authenticated name without remounting the page and persists after reload', async ({ page }) => {
  const productionWrites = [];
  page.on('request', request => { if (new URL(request.url()).hostname.includes('sivi-org-default-rtdb')) productionWrites.push(request.url()); });
  await page.locator('.buyer-overview').evaluate(el => { el.dataset.keepMounted = 'yes'; });
  const dialog = await openAccount(page);
  await expect(dialog.getByLabel('E-mail', { exact: true })).toHaveValue(account.email);
  await expect(dialog.getByLabel('E-mail', { exact: true })).toHaveAttribute('readonly', '');
  await expect(dialog.getByLabel('Nome exibido')).toHaveValue(account.displayName);
  await dialog.getByLabel('Nome exibido').fill('Kauan Oliveira');
  await dialog.getByRole('button', { name: 'Salvar alterações', exact: true }).click();
  await expect(dialog.getByRole('status')).toHaveText('Nome atualizado.');
  await expect(page.locator('[data-account-user]')).toHaveText('Kauan Oliveira');
  await expect(page.locator('.buyer-overview')).toHaveAttribute('data-keep-mounted', 'yes');
  await expect(page.locator('.buyer-overview h1')).toContainText('Kauan');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-account-menu] summary')).toBeFocused();
  await page.reload();
  await expect(page.locator('[data-account-user]')).toHaveText('Kauan Oliveira');
  expect(productionWrites).toEqual([]);
});

test('password recovery belongs to the account and preserves the logged-in session', async ({ page }) => {
  const dialog = await openAccount(page);
  await dialog.getByRole('button', { name: 'Enviar e-mail de redefinição', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('Enviamos');
  await expect(dialog.getByLabel('Nome exibido')).toHaveValue(account.displayName);
  await dialog.getByRole('button', { name: 'Fechar minha conta' }).click();
  await expect(page.locator('.buyer-overview')).toBeVisible();
});

test('account form retains unsaved edits when closing is declined and works on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const dialog = await openAccount(page);
  await dialog.getByLabel('Nome exibido').fill('Nome pendente');
  expect(await page.evaluate(() => { const event = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(event); return event.defaultPrevented; })).toBe(true);
  page.once('dialog', native => native.dismiss());
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Nome exibido')).toHaveValue('Nome pendente');
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await dialog.getByLabel('Nome exibido').fill(account.displayName);
  expect(await page.evaluate(() => { const event = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(event); return event.defaultPrevented; })).toBe(false);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('[data-account-menu] summary')).toBeFocused();
});
});

test('partial synchronization can be retried without losing the open draft', async ({ page }) => {
  await page.goto('/tests/fixtures/account-lab.html?partial=1');
  await page.getByLabel('Rascunho').fill('Dados em preenchimento');
  await page.locator('[data-account-trigger]').click();
  const dialog = page.getByRole('dialog', { name: 'Minha conta', exact: true });
  await dialog.getByLabel('Nome exibido').fill('Nome alterado');
  await dialog.getByRole('button', { name: 'Salvar alterações', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('sincronização está pendente');
  await dialog.getByRole('button', { name: 'Tentar sincronizar', exact: true }).click();
  await expect(dialog.getByRole('status')).toHaveText('Nome atualizado.');
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Rascunho')).toHaveValue('Dados em preenchimento');
});

test('saving prevents duplicate writes and Escape waits for the result', async ({ page }) => {
  await page.goto('/tests/fixtures/account-lab.html?slow=1');
  await page.locator('[data-account-trigger]').click();
  const dialog = page.getByRole('dialog', { name: 'Minha conta', exact: true });
  await dialog.getByLabel('Nome exibido').fill('Outro nome');
  await dialog.getByRole('button', { name: 'Salvar alterações', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('form')).toHaveAttribute('aria-busy', 'true');
  await expect(dialog.getByRole('button', { name: 'Aguarde…', exact: true })).toBeDisabled();
  await expect(page.locator('body')).toHaveAttribute('data-save-calls', '1');
  await page.evaluate(() => window.accountLab.releaseSave());
  await expect(dialog.getByRole('status')).toHaveText('Nome atualizado.');
});

test('a changed session is not reported as a successful update to the current account', async ({ page }) => {
  await page.goto('/tests/fixtures/account-lab.html?switch=1');
  await page.locator('[data-account-trigger]').click();
  const dialog = page.getByRole('dialog', { name: 'Minha conta', exact: true });
  await dialog.getByLabel('Nome exibido').fill('Outro nome');
  await dialog.getByRole('button', { name: 'Salvar alterações', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('A sessão mudou');
  await expect(page.locator('body')).not.toHaveAttribute('data-saved-name');
});

test('social access shows its provider without offering an unavailable password reset', async ({ page }) => {
  await page.goto('/tests/fixtures/account-lab.html?social=1');
  await page.locator('[data-account-trigger]').click();
  const dialog = page.getByRole('dialog', { name: 'Minha conta', exact: true });
  await expect(dialog.getByText('Acesso: Google.', { exact: true })).toBeVisible();
  await expect(dialog.locator('[data-reset-account-password]')).toBeHidden();
});
