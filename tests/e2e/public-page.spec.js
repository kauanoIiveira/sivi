import { expect, test } from '@playwright/test';
import { captureUi } from '../helpers/ui-review.js';

test('public footer fills the viewport on phones and wide monitors', async ({ page }) => {
  await page.goto('/?authEmulator=1#/');
  const footer = page.locator('.public-footer');
  await expect(footer).toBeVisible();
  for (const theme of ['light', 'dark']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) {
      await page.locator('[data-theme-toggle]:visible').click();
    }
    for (const width of [360, 768, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 1080 });
      const bounds = await footer.evaluate(element => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth };
      });
      expect(Math.abs(bounds.left), `${theme} ${width}px: footer reaches the left edge`).toBeLessThanOrEqual(1);
      expect(Math.abs(bounds.right - bounds.viewport), `${theme} ${width}px: footer reaches the right edge`).toBeLessThanOrEqual(1);
      expect(bounds.page, `${theme} ${width}px: no horizontal scroll`).toBeLessThanOrEqual(bounds.viewport);
    }
  }
});

test('public footer navigates to useful sections, FAQ and account access', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?authEmulator=1#/');
  await expect(page.getByRole('heading', { name: 'Sua próxima compra industrial começa aqui.' })).toBeVisible();
  await captureUi(page, 'pagina-publica-refinada', { widths: [360, 390, 768, 1440, 1920, 2560] });
  const footer = page.locator('.public-footer');
  await footer.getByRole('link', { name: 'Para fornecedores' }).click();
  await expect(page).toHaveURL(/secao=fornecimento$/);
  await expect(page.locator('#fornecimento')).toBeFocused();
  await footer.getByRole('link', { name: 'Dúvidas sobre o cadastro' }).click();
  await expect(page.locator('#duvidas')).toBeFocused();
  const question = page.locator('summary', { hasText: 'Onde acompanho a aprovação?' });
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details[open]')).toContainText('Atualizar situação');
  await footer.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page.locator('#public-title')).toBeFocused();
  await footer.getByRole('link', { name: 'Entrar na minha conta' }).click();
  await expect(page.locator('.auth-shell')).toHaveAttribute('data-mode', 'login');
  await page.getByRole('link', { name: 'SIVI, voltar à página inicial' }).click();
  await page.locator('.public-footer').getByRole('link', { name: 'Cadastrar empresa', exact: true }).click();
  await expect(page.locator('.auth-shell')).toHaveAttribute('data-mode', 'register');
  expect(errors).toEqual([]);
});
