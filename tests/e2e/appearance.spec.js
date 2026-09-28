import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

async function capture(page, name) {
  if (!process.env.SIVI_CAPTURE_APPEARANCE) return;
  const directory = resolve(process.env.SIVI_CAPTURE_APPEARANCE);
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: resolve(directory, `${name}.png`), fullPage: !name.startsWith('preferencias-'), animations: 'disabled' });
}

async function openPreferences(page) {
  await page.locator('[data-account-menu] summary').click();
  await page.getByRole('button', { name: 'Aparência e acessibilidade', exact: true }).click();
  return page.getByRole('dialog', { name: 'Aparência e acessibilidade' });
}

test('preferences apply immediately, survive reload and reset to the system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.goto('/tests/fixtures/component-lab.html');
  const originalSize = await page.locator('[data-page-title]').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  const dialog = await openPreferences(page);
  await dialog.getByLabel('Tema', { exact: true }).selectOption('dark');
  await dialog.getByLabel('Tamanho do texto').selectOption('large');
  await dialog.getByLabel('Movimento').selectOption('reduce');
  await dialog.getByLabel('Contraste').selectOption('more');
  await dialog.getByLabel('Espaçamento').selectOption('compact');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-account-menu] summary')).toBeFocused();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  const largeSize = await page.locator('[data-page-title]').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  expect(largeSize).toBeGreaterThan(originalSize * 1.2);
  await openPreferences(page);
  await dialog.getByRole('button', { name: 'Restaurar padrão' }).click();
  await expect(dialog.getByLabel('Tema', { exact: true })).toHaveValue('system');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
});

test('preferences remain usable with keyboard, large text and a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/tests/fixtures/component-lab.html');
  const dialog = await openPreferences(page);
  await dialog.getByLabel('Tamanho do texto').selectOption('large');
  await dialog.getByLabel('Contraste').selectOption('more');
  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
  await dialog.getByRole('button', { name: 'Fechar preferências' }).click();
  await expect(dialog).not.toBeVisible();
});

test('preferences work in memory when local storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get: () => { throw new Error('Storage blocked'); } });
  });
  await page.goto('/tests/fixtures/component-lab.html');
  const dialog = await openPreferences(page);
  await dialog.getByLabel('Tema', { exact: true }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(dialog.getByRole('status')).toContainText('nesta aba');
});

test('public and access screens expose preferences and reflow with enlarged text', async ({ page }) => {
  await page.goto('/?authEmulator=1#/');
  await page.getByRole('button', { name: 'Aparência e acessibilidade', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Aparência e acessibilidade' });
  await dialog.getByLabel('Tamanho do texto').selectOption('large');
  await dialog.getByLabel('Contraste').selectOption('more');
  await dialog.getByLabel('Movimento').selectOption('reduce');
  for (const theme of ['light', 'dark']) {
    await dialog.getByLabel('Tema', { exact: true }).selectOption(theme);
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      if ([390, 1440].includes(width)) await capture(page, `preferencias-${theme}-${width}`);
    }
  }
  await dialog.getByRole('button', { name: 'Fechar preferências' }).click();
  for (const path of ['/', '/acesso?modo=register']) {
    await page.goto(`/?authEmulator=1#${path}`);
    await expect(page.getByRole('button', { name: 'Aparência e acessibilidade', exact: true })).toBeVisible();
    if (path !== '/') await expect(page.locator('.auth-shell')).toHaveAttribute('data-ui-ready', 'true');
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if ([390, 1440].includes(width)) await capture(page, `${path === '/' ? 'publica' : 'acesso'}-texto-maior-${width}`);
    }
  }
  await page.addStyleTag({ content: 'html { font-size: 200% !important; --text-scale: 2; }' });
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const story = await page.locator('.story-copy.is-active').boundingBox();
    const brand = await page.locator('.story-panel__topbar').boundingBox();
    expect(story.y).toBeGreaterThanOrEqual(brand.y + brand.height);
    for (const field of await page.locator('.form-view.is-active input').all()) {
      await field.scrollIntoViewIfNeeded();
      const bounds = await field.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
    await capture(page, `acesso-texto-200-${width}`);
  }
});
