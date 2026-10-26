import { expect, test } from '@playwright/test';

const sdkURL = 'https://vlibras.gov.br/app/vlibras-plugin.js';
const sdkStub = `window.VLibras = { Widget: function () {
  if (document.getElementById('vlibras-access-wrapper')) return;
  const wrapper = document.createElement('div'); wrapper.id = 'vlibras-access-wrapper';
  wrapper.innerHTML = '<button type="button">Abrir VLibras de teste</button>';
  document.body.append(wrapper);
} };`;

async function openPreferences(page) {
  await page.getByRole('button', { name: 'Aparência e acessibilidade', exact: true }).click();
  return page.getByRole('dialog', { name: 'Aparência e acessibilidade' });
}

test('workspace preferences drop legacy spacing/motion while retaining the original fox', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.addInitScript(() => localStorage.setItem('sivi.appearance.v1', JSON.stringify({ motion: 'reduce', density: 'compact', textSize: 'large', contrast: 'more' })));
  await page.goto('/tests/fixtures/component-lab.html');
  const logo = page.locator('.app-shell__brand img');
  await expect(logo).toBeVisible();
  expect(await logo.evaluate(image => image.complete && image.naturalWidth > 0 && image.src.endsWith('/src/assets/brand/raposa.svg'))).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await expect(page.locator('html')).not.toHaveAttribute('data-density');
  const dialog = await openPreferences(page);
  await expect(dialog.locator('select')).toHaveCount(5);
  await expect(dialog.getByLabel('Movimento', { exact: true })).toHaveCount(0);
  await expect(dialog.getByLabel('Espaçamento', { exact: true })).toHaveCount(0);
  await dialog.getByLabel('Daltonismo').selectOption('blueYellow');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sivi.appearance.v1')))).toEqual({ textSize: 'large', contrast: 'more', colorVision: 'blueYellow', vlibras: 'off' });
});

test('VLibras preference loads on request, can be disabled, and stays inactive on public surfaces', async ({ page }) => {
  let requests = 0;
  await page.route(sdkURL, route => { requests += 1; return route.fulfill({ contentType: 'application/javascript', body: sdkStub }); });
  await page.goto('/tests/fixtures/component-lab.html');
  const dialog = await openPreferences(page);
  expect(requests).toBe(0);
  await dialog.getByLabel('VLibras').selectOption('on');
  await expect(dialog.locator('[data-vlibras-status]')).toContainText('Ativado.');
  expect(requests).toBe(1);
  await dialog.getByLabel('VLibras').selectOption('off');
  await expect(page.locator('#vlibras-access-wrapper')).toBeHidden();
  await dialog.getByLabel('VLibras').selectOption('on');
  await expect(dialog.locator('[data-vlibras-status]')).toContainText('Ativado.');
  expect(requests).toBe(1);
  await dialog.getByRole('button', { name: 'Fechar preferências' }).click();
  await expect(page.getByRole('button', { name: 'Abrir VLibras de teste' })).toBeVisible();
  await page.evaluate(() => { document.body.dataset.surface = 'auth'; });
  await expect(page.getByRole('button', { name: 'Abrir VLibras de teste' })).toBeHidden();
  await page.goto('/?authEmulator=1#/acesso?modo=login');
  await expect(page.locator('.auth-shell')).toHaveAttribute('data-ui-ready', 'true');
  expect(requests).toBe(1);
  await expect(page.locator('[data-open-preferences]')).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('VLibras network failure offers a working retry without trapping preferences', async ({ page }) => {
  let requests = 0;
  await page.route(sdkURL, route => { requests += 1; return requests === 1 ? route.abort() : route.fulfill({ contentType: 'application/javascript', body: sdkStub }); });
  await page.goto('/tests/fixtures/component-lab.html');
  const dialog = await openPreferences(page);
  await dialog.getByLabel('VLibras').selectOption('on');
  await expect(dialog.locator('[data-vlibras-status]')).toContainText('Não foi possível');
  await dialog.getByRole('button', { name: 'Tentar carregar VLibras novamente' }).click();
  await expect(dialog.locator('[data-vlibras-status]')).toContainText('Ativado.');
  expect(requests).toBe(2);
  await dialog.getByLabel('VLibras').selectOption('off');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('[data-app-sidebar] [data-open-preferences]')).toBeFocused();
});

test('unrelated preferences and disabling do not retry a failed VLibras download', async ({ page }) => {
  let requests = 0;
  await page.route(sdkURL, route => { requests += 1; return requests === 1 ? route.abort() : route.fulfill({ contentType: 'application/javascript', body: sdkStub }); });
  await page.goto('/tests/fixtures/component-lab.html');
  const dialog = await openPreferences(page);
  await dialog.getByLabel('VLibras').selectOption('on');
  await expect(dialog.locator('[data-vlibras-status]')).toContainText('Não foi possível');
  await dialog.getByLabel('Daltonismo').selectOption('blueYellow');
  await expect(dialog.locator('[data-vlibras-status]')).toContainText('Não foi possível');
  expect(requests).toBe(1);
  await dialog.getByLabel('VLibras').selectOption('off');
  await expect(dialog.locator('[data-vlibras-status]')).toHaveText('Desativado.');
  expect(requests).toBe(1);
  await dialog.getByLabel('VLibras').selectOption('on');
  await expect(dialog.locator('[data-vlibras-status]')).toContainText('Ativado.');
  expect(requests).toBe(2);
});
