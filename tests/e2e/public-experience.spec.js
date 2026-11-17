import { expect, test } from '@playwright/test';

test('public workflow explains every handoff and remains usable from the keyboard', async ({ page }) => {
  await page.goto('/?authEmulator=1#/plataforma');
  const workflow = page.getByRole('region', { name: 'Da demanda à entrega.' });
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
  await expect(workflow.locator('.t-digit-group')).toHaveText('03');
  await expect(workflow.locator('.t-digit-group .t-digit').first()).toHaveCSS('animation-name', 't-digit-pop-in');
  await expect(workflow.getByText('Histórico de versões da proposta')).toBeVisible();
  const login = page.getByRole('link', { name: 'Entrar', exact: true });
  await login.focus();
  await expect(login).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('.auth-shell')).toHaveAttribute('data-mode', 'login');
  await page.getByRole('link', { name: 'SIVI, voltar à página inicial' }).click();
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Plataforma' }).click();
  await expect(steps.first()).toHaveAttribute('aria-pressed', 'true');
  await steps.last().click();
  await expect(workflow.getByRole('heading', { name: headings.at(-1) })).toBeVisible();
});

test('landing transitions respect reduced motion and keep the purchase stages readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?authEmulator=1#/');
  const title = page.locator('#public-title');
  const firstLine = title.locator('.t-stagger-line').first();
  const accent = title.locator('.t-shimmer');
  await expect(firstLine).toHaveCSS('animation-name', 't-stagger-in, sv-hero-focus');
  await expect(accent).toHaveCSS('animation-name', 't-shimmer');
  await expect(accent).toHaveCSS('animation-iteration-count', '1');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(firstLine).toHaveCSS('animation-name', 'none');
  await expect(firstLine).toHaveCSS('opacity', '1');
  await expect(accent).toHaveCSS('animation-name', 'none');
  await page.goto('/?authEmulator=1#/plataforma');
  await page.getByRole('button', { name: 'Compatibilidade', exact: true }).click();
  const digits = page.locator('.t-digit-group');
  await expect(digits).toHaveText('02');
  await expect(digits.locator('.t-digit').first()).toHaveCSS('animation-name', 'none');
});

test('landing header follows scroll direction and record examples open their purchase stage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?authEmulator=1#/');
  const landing = page.locator('.sv-landing');
  await expect(landing).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 520, behavior: 'instant' }));
  await expect(landing).toHaveAttribute('data-header-solid', '');
  await expect(landing).toHaveAttribute('data-header-hidden', '');
  await page.evaluate(() => window.scrollTo({ top: 430, behavior: 'instant' }));
  await expect(landing).not.toHaveAttribute('data-header-hidden', '');

  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Casos de uso' }).click();
  await page.getByRole('link', { name: /Explorar etapa de registro de inspeção/i }).click();
  await expect(page).toHaveURL(/#\/plataforma\?secao=funcionamento&etapa=5$/);
  await expect(page.locator('#funcionamento')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Inspeção', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Qualidade registrada por item.' })).toBeVisible();
});

test('public workflow stays light and reflows with enlarged text without clipped controls', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('sivi.theme.v1', 'dark'));
  await page.goto('/?authEmulator=1#/plataforma');
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
