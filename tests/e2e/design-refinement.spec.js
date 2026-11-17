import { expect, test } from '@playwright/test';

test('buyer overview retains the industrial map with links to actual records', async ({ page }) => {
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const [{ mountBuyerOverviewPage }, { buildLiveJourney }] = await Promise.all([
      import('/src/pages/dashboard/buyer-overview-page.js'), import('/src/domain/live-marketplace-selectors.js'),
    ]);
    const workspace = { id: 'buyer', organizationRole: 'buyer', organizationName: 'Alpha' };
    const data = { demands: [{ id: 'd1', title: 'Componentes de manutenção', status: 'published', items: [{ id: 'i1', description: 'Eixo', quantity: 10, unit: 'un' }] }], proposals: [], orders: [] };
    mountBuyerOverviewPage({ container: document.querySelector('[data-app-outlet]'), workspace, repository: {
      getOperations: async () => ({ status: 'ready', data }),
      getIndustrialJourney: async () => ({ status: 'ready', data: buildLiveJourney(workspace, data), meta: { asOf: new Date().toISOString() } }),
    } });
  });
  await expect(page.locator('[data-industrial-rail]')).toBeVisible();
  await page.locator('[data-rail-step="demand"]').click();
  await expect(page.locator('[data-rail-evidence] a')).toHaveAttribute('href', '#/app/comprador/demandas?registro=d1');
});

test('buyer map recovers independently and an empty company has no invented journey', async ({ page }) => {
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const [{ mountBuyerJourney }, { buildLiveJourney }] = await Promise.all([
      import('/src/pages/dashboard/buyer-journey.js'), import('/src/domain/live-marketplace-selectors.js'),
    ]);
    const container = document.querySelector('[data-app-outlet]');
    container.replaceChildren();
    const workspace = { id: 'buyer', organizationRole: 'buyer' };
    let calls = 0;
    const data = { demands: [{ id: 'd1', title: 'Compra', status: 'published', items: [] }], proposals: [], orders: [] };
    window.clearBuyerMap = mountBuyerJourney({ container, workspace, repository: { getIndustrialJourney: async () => ++calls === 1 ? { status: 'error' } : { status: 'ready', data: buildLiveJourney(workspace, data) } } });
  });
  await page.getByRole('button', { name: 'Atualizar acompanhamento' }).click();
  await expect(page.locator('[data-industrial-rail]')).toBeVisible();
  await page.evaluate(async () => {
    window.clearBuyerMap();
    const { mountBuyerJourney } = await import('/src/pages/dashboard/buyer-journey.js');
    mountBuyerJourney({ container: document.querySelector('[data-app-outlet]'), workspace: { id: 'empty' }, repository: { getIndustrialJourney: async () => ({ status: 'ready', data: [] }) } });
  });
  await expect(page.locator('.buyer-journey')).toHaveCount(0);
});

test('workspace keeps account, theme and company controls in the sidebar', async ({ page }) => {
  await page.goto('/tests/fixtures/component-lab.html');
  const sidebar = page.locator('[data-app-sidebar]');
  await expect(page.locator('.app-shell__header')).toHaveCount(0);
  await expect(sidebar.locator('[data-open-preferences]')).toBeVisible();
  await expect(sidebar.locator('[data-theme-toggle]')).toHaveCount(0);
  await expect(sidebar.locator('[data-change-context-compact]')).toBeVisible();
  const account = sidebar.locator('[data-account-menu] summary');
  await expect(account.locator('svg')).toBeVisible();
  await account.click();
  await expect(sidebar.locator('[data-open-account]')).toBeVisible();
  await expect(sidebar.locator('[data-logout]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(account).toBeFocused();
});

test('public design keeps every interactive purchase stage and uses the approved favicon', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.sivi-public-ui')).toBeVisible();
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', /favicon-raposa\.svg$/);
  await expect(page.locator('.sv-hero video')).toBeVisible();
  await expect(page.locator('.sv-hero video')).toHaveAttribute('poster', './assets/cnc-lathe-poster.jpg');
  await page.goto('/#/plataforma');
  const steps = page.locator('.sv-workflow ol button');
  await expect(steps).toHaveCount(7);
  for (let index = 0; index < 7; index += 1) {
    await steps.nth(index).click();
    await expect(steps.nth(index)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#sv-workflow-panel')).toBeVisible();
  }
  await expect(page.locator('.public-step-number, .public-brand-mark, .public-image-index')).toHaveCount(0);
});
