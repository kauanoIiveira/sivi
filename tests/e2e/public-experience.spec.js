import { expect, test } from '@playwright/test';

test('public workflow explains every handoff and remains usable from the keyboard', async ({ page }) => {
  await page.goto('/?authEmulator=1#/');
  const workflow = page.getByRole('region', { name: 'Uma compra. Cada etapa conectada.' });
  await expect(workflow).toBeVisible();
  const steps = workflow.locator('ol button');
  await expect(steps).toHaveCount(7);
  const headings = [
    'Tudo começa com uma necessidade.',
    'Capacidade encontra necessidade.',
    'Condições à vista. Decisão informada.',
    'O combinado vira referência.',
    'Qualidade registrada por item.',
    'Saída registrada. Próximo destino: entrega.',
    'Um acordo concluído. Um histórico disponível.',
  ];
  for (let index = 0; index < headings.length; index += 1) {
    await steps.nth(index).focus();
    await page.keyboard.press('Enter');
    await expect(steps.nth(index)).toHaveAttribute('aria-pressed', 'true');
    await expect(workflow.locator('ol button[aria-pressed="true"]')).toHaveCount(1);
    await expect(workflow.getByRole('heading', { name: headings[index], exact: true })).toBeVisible();
    await expect(steps.nth(index)).toBeFocused();
  }
  await steps.nth(2).click();
  await expect(workflow.getByText('Histórico de versões da proposta')).toBeVisible();
  await page.getByRole('link', { name: 'Entrar', exact: true }).click();
  await expect(page.locator('.auth-shell')).toHaveAttribute('data-mode', 'login');
  await page.getByRole('link', { name: 'SIVI, voltar à página inicial' }).click();
  await expect(steps.first()).toHaveAttribute('aria-pressed', 'true');
  await steps.last().click();
  await expect(workflow.getByRole('heading', { name: headings.at(-1) })).toBeVisible();
});

test('public workflow stays light and reflows with enlarged text without clipped controls', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('sivi.theme.v1', 'dark'));
  await page.goto('/?authEmulator=1#/');
  await expect(page.locator('.sivi-public-ui')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  for (const width of [320, 390, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('.sv-workflow ol li:nth-child(5) button').click();
    await expect(page.getByRole('heading', { name: 'Qualidade registrada por item.' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const control of await page.locator('.sv-workflow ol button').all()) {
      await control.scrollIntoViewIfNeeded();
      const bounds = await control.boundingBox();
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
  }
  await page.addStyleTag({ content: 'html { font-size: 200% !important; --text-scale: 2; }' });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
