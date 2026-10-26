import { expect, test } from '@playwright/test';

test('workspace analytics filters real creations and keeps the current portfolio independent', async ({ page }) => {
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const { mountWorkspaceAnalytics } = await import('/src/generated/public/entry.js');
    const now = Date.parse('2026-10-23T18:00:00Z');
    const records = { demands: [], proposals: [{ createdAt: now - 50 * 86400000 }, { createdAt: now - 4 * 86400000 }], orders: [{ status: 'blocked', createdAt: now - 50 * 86400000, version: { totalCents: 10000, freightCents: 500 } }] };
    const slot = document.createElement('div');
    document.querySelector('[data-app-outlet]').replaceChildren(slot);
    window.clearWorkspaceInsights = mountWorkspaceAnalytics(slot, { records, role: 'buyer', now });
  });
  const panel = page.locator('[data-workspace-insights]');
  await expect(panel.locator('[data-insight-total]')).toHaveAccessibleName('propostas recebidas: 2');
  await panel.getByRole('button', { name: '30 dias', exact: true }).click();
  await expect(panel.locator('[data-insight-total]')).toHaveAccessibleName('propostas recebidas: 1');
  await expect(panel.locator('[data-portfolio-total]')).toHaveText('1');
  await panel.getByRole('button', { name: 'Pedidos', exact: true }).click();
  await expect(panel.locator('[data-insight-total]')).toHaveAccessibleName('pedidos criados: 0');
  await panel.getByText('Consultar dados do período', { exact: true }).click();
  await expect(panel.getByRole('table')).toBeVisible();
  await expect(panel.getByRole('row')).toHaveCount(7);
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => window.clearWorkspaceInsights());
  await expect(panel).toHaveCount(0);
});

test('workspace analytics explains empty activity without invented growth', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const { mountWorkspaceAnalytics } = await import('/src/generated/public/entry.js');
    mountWorkspaceAnalytics(document.querySelector('[data-app-outlet]'), { records: {}, role: 'supplier' });
  });
  await expect(page.locator('[data-insight-total]')).toHaveAccessibleName('propostas enviadas: 0');
  await expect(page.getByText('Nenhuma criação registrada neste período.')).toBeVisible();
  await expect(page.getByText('Seus pedidos aparecerão aqui após o aceite.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ver oportunidades', exact: true })).toHaveAttribute('href', '#/app/fornecedor/oportunidades');
});

test('workspace redesign preserves larger text and inherited color-vision alternatives', async ({ page }) => {
  await page.goto('/tests/fixtures/workspace-preview.html?role=buyer#/app/comprador/inicio');
  await expect(page.locator('[data-workspace-insights]')).toBeVisible();
  const read = () => page.evaluate(() => ({ title: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize), nav: parseFloat(getComputedStyle(document.querySelector('.app-shell__nav a')).fontSize), success: getComputedStyle(document.querySelector('.app-shell')).getPropertyValue('--feedback-success').trim() }));
  const standard = await read();
  await page.evaluate(() => { document.documentElement.dataset.textSize='large'; document.documentElement.dataset.colorVision='redGreen'; });
  const accessible = await read();
  expect(accessible.title).toBeGreaterThan(standard.title * 1.2);
  expect(accessible.nav).toBeGreaterThan(standard.nav * 1.2);
  expect(accessible.success).not.toBe(standard.success);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
