import { expect, test } from '@playwright/test';

test('public workflow explains every handoff and remains usable from the keyboard', async ({ page }) => {
  await page.goto('/?authEmulator=1#/');
  const workflow = page.getByRole('region', { name: 'Uma compra. Cada etapa registrada.' });
  await expect(workflow).toBeVisible();
  const steps = workflow.locator('[data-public-step]');
  await expect(steps).toHaveCount(7);
  const headings = [
    'Especifique o que sua empresa precisa.',
    'Encontre capacidade para atender aos requisitos.',
    'Compare condições antes de decidir.',
    'Transforme o acordo em pedido.',
    'Registre a qualidade de cada item.',
    'Acompanhe a saída do pedido.',
    'Confirme a entrega e avalie o fornecedor.',
  ];
  for (let index = 0; index < headings.length; index += 1) {
    await steps.nth(index).focus();
    await page.keyboard.press('Enter');
    await expect(steps.nth(index)).toHaveAttribute('aria-pressed', 'true');
    await expect(workflow.locator('[data-public-step][aria-pressed="true"]')).toHaveCount(1);
    await expect(workflow.getByRole('heading', { name: headings[index], exact: true })).toBeVisible();
    await expect(steps.nth(index)).toBeFocused();
  }
  await steps.nth(2).click();
  await expect(workflow.getByText('As versões anteriores continuam no histórico da proposta.')).toBeVisible();
  await page.getByRole('link', { name: 'Entrar', exact: true }).click();
  await expect(page.locator('.auth-shell')).toHaveAttribute('data-mode', 'login');
  await page.getByRole('link', { name: 'SIVI, voltar à página inicial' }).click();
  await expect(steps.first()).toHaveAttribute('aria-pressed', 'true');
  await steps.last().click();
  await expect(workflow.getByRole('heading', { name: headings.at(-1) })).toBeVisible();
});

test('public workflow reflows across themes and enlarged text without clipped controls', async ({ page }) => {
  await page.goto('/?authEmulator=1#/');
  await expect(page.locator('.public-page')).toBeVisible();
  for (const theme of ['light', 'dark']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) {
      await page.locator('[data-theme-toggle]:visible').click();
    }
    for (const width of [320, 390, 768, 1440, 2560]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator('[data-public-step="4"]').click();
      await expect(page.getByRole('heading', { name: 'Registre a qualidade de cada item.' })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const control of await page.locator('[data-public-step]').all()) {
        const bounds = await control.boundingBox();
        expect(bounds.height).toBeGreaterThanOrEqual(44);
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      }
    }
  }
  await page.addStyleTag({ content: 'html { font-size: 200% !important; --text-scale: 2; }' });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
