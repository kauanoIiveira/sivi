import { expect, test } from '@playwright/test';

const allPiecesVisible = element => Array.from(element.querySelectorAll('.split-word, .split-char, .scroll-reveal-piece')).every(piece => Number(getComputedStyle(piece).opacity) === 1);

test('split text remains readable with keyboard focus and a live reduced-motion change', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?authEmulator=1#/');
  const intro = page.getByRole('heading', { name: 'Da necessidade de compra ao pedido entregue.', exact: true });
  await expect(intro).toHaveAttribute('data-split-ready', 'true');
  await intro.focus();
  await expect(intro).toBeFocused();
  await expect.poll(() => intro.evaluate(allPiecesVisible)).toBe(true);

  const solutions = page.getByRole('heading', { name: 'Soluções para cada etapa da compra.', exact: true });
  await solutions.scrollIntoViewIfNeeded();
  // Switch while the character entrance is still running.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => solutions.evaluate(allPiecesVisible)).toBe(true);
  await expect(solutions).toHaveText('Soluções para cada etapa da compra.');
  const reading = page.getByRole('heading', { name: 'O que foi aceito acompanha o pedido.', exact: true });
  await reading.scrollIntoViewIfNeeded();
  await expect.poll(() => reading.evaluate(allPiecesVisible)).toBe(true);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?authEmulator=1#/quem-somos?secao=visao-geral');
  const purpose = page.locator('#visao-geral');
  await expect(purpose).toBeFocused();
  await expect.poll(() => purpose.evaluate(allPiecesVisible)).toBe(true);
  await page.goto('/?authEmulator=1#/');
  await expect(intro).toHaveAttribute('data-split-ready', 'true');
  await expect(intro).toHaveCount(1);
  await expect(page.locator('#explorar .split-word .split-word')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('motion controls keep the indicator aligned after selection, resizing and enlarged text', async ({ page }) => {
  await page.goto('/?authEmulator=1#/plataforma');
  const roles = page.getByRole('group', { name: 'Atuação da demonstração' });
  const supplier = roles.getByRole('button', { name: 'Fornecedor', exact: true });
  await supplier.click();
  await expect(supplier).toHaveAttribute('aria-pressed', 'true');
  const indicator = roles.locator('.t-tabs-pill');
  const aligned = async () => {
    const buttonBox = await supplier.boundingBox();
    const pillBox = await indicator.boundingBox();
    return Math.abs(buttonBox.x - pillBox.x) < 1 && Math.abs(buttonBox.width - pillBox.width) < 1;
  };
  await expect.poll(aligned).toBe(true);
  await supplier.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(roles.getByRole('button', { name: 'Comprador', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await supplier.click();
  await page.addStyleTag({ content: 'html { font-size: 200% !important; --text-scale: 2; }' });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(aligned).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(indicator).toHaveCSS('transition-duration', '0s');
  await page.getByRole('button', { name: 'Propostas', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Condições à vista. Decisão informada.', exact: true })).toBeVisible();
  await expect(page.locator('.sv-workflow-copy h3')).toHaveCSS('animation-name', 'none');
});
