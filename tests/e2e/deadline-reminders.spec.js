import { test, expect } from '@playwright/test';

test('dashboard reminders explain requested dates and link to the exact order', async ({ page }) => {
  await page.goto('/tests/fixtures/dashboard-lab.html?role=buyer');
  await expect(page.locator('[data-dashboard-status]')).toHaveAttribute('data-dashboard-status', 'ready');
  await page.evaluate(async () => {
    const [{ buildNextActions }, { renderNextActions }] = await Promise.all([
      import('/src/domain/next-actions.js'), import('/src/pages/dashboard/next-actions-view.js'),
    ]);
    const data = { demands: [], proposals: [], orders: [
      { id: 'pedido-especial', title: 'Flanges para manutenção', status: 'accepted', requiredBy: '2026-09-29' },
      { id: 'concluido', title: 'Pedido recebido', status: 'delivered', requiredBy: '2026-09-01', evaluation: { score: 5 } },
    ] };
    const section = renderNextActions({ role: 'buyer', nextActions: buildNextActions('buyer', data, '2026-09-27') });
    document.querySelector('.dashboard-next-actions')?.remove();
    document.querySelector('.dashboard-page').append(section);
  });
  const section = page.getByRole('region', { name: 'Próximas ações' });
  await expect(section).toContainText('Data desejada pelo comprador: 29/09/2026 (em 2 dias).');
  await expect(section).not.toContainText('Pedido recebido');
  const link = section.getByRole('link', { name: 'Acompanhar pedido' });
  await expect(link).toHaveAttribute('href', '#/app/comprador/pedidos?registro=pedido-especial');
  await link.focus();
  await expect(link).toBeFocused();
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
