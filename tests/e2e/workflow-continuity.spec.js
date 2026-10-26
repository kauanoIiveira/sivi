import { expect, test } from '@playwright/test';

async function lab(page) {
  await page.route('**/src/main.js', route => route.fulfill({ contentType: 'text/javascript', body: '' }));
  await page.goto('/');
  await page.evaluate(() => { document.body.innerHTML = '<main id="lab"></main>'; });
}

test('membership loading and errors never open the registration form', async ({ page }) => {
  await lab(page);
  for (const status of ['loading', 'error']) {
    await page.evaluate(async status => {
      const { mountContextPage } = await import('/src/pages/context/context-page.js');
      mountContextPage({ container: document.querySelector('#lab'), workspaces: [], workspaceState: { status }, onCreate() {}, onboarding: { refresh() {}, retry() {} } });
    }, status);
    await expect(page.locator('[data-create-organization]')).toHaveCount(0);
    await expect(page.locator('[data-new]')).toBeDisabled();
    await expect(page.locator('[data-feedback]')).toContainText(status === 'loading' ? 'Consultando' : 'Não foi possível');
  }
});

test('switching the order preserves the review draft and a confirmed write cannot be sent twice', async ({ page }) => {
  await lab(page);
  await page.evaluate(async () => {
    const { mountBuyerReviewsPage } = await import('/src/pages/buyer/reviews-page.js');
    const orders = ['a', 'b'].map(id => ({ id, title: `Entrega ${id}`, supplierName: `Fornecedor ${id}`, status: 'delivered', deliveredAt: Date.now() }));
    window.reviewWrites = 0;
    let reads = 0;
    mountBuyerReviewsPage({ container: document.querySelector('#lab'), workspace: { id: 'buyer' }, repository: {
      getOperations: async () => ++reads === 1 ? { status: 'ready', data: { orders } } : { status: 'error' },
      workflow: { evaluateOrder: async () => { window.reviewWrites++; } },
    } });
  });
  await page.locator('.reviews-preview textarea').fill('Conferi a documentação.');
  await page.getByRole('button', { name: /Avaliar pedido/ }).nth(1).click();
  await page.getByRole('button', { name: /Avaliar pedido/ }).nth(0).click();
  await expect(page.locator('.reviews-preview textarea')).toHaveValue('Conferi a documentação.');
  for (const key of ['quality', 'punctuality', 'communication', 'documentation']) await page.locator(`input[name="a-${key}"][value="4"]`).check();
  await page.getByRole('button', { name: 'Enviar avaliação' }).click();
  await expect(page.locator('.reviews-form')).toContainText('Avaliação salva');
  await expect(page.locator('.reviews-form [type=submit]')).toBeDisabled();
  expect(await page.evaluate(() => window.reviewWrites)).toBe(1);
});

test('a delayed invitation never marks the newly selected demand as invited', async ({ page }) => {
  await lab(page);
  await page.evaluate(async () => {
    const { mountBuyerSuppliersPage } = await import('/src/pages/buyer/suppliers-page.js');
    const demands = ['a', 'b'].map(id => ({ id, title: `Demanda ${id}`, status: 'published', updatedAt: id === 'a' ? 2 : 1, items: [{ category: 'Peças', process: 'Usinagem', material: 'Aço', quantity: 1, unit: 'un' }], region: 'SP' }));
    const profiles = [{ organizationId: 'supplier', organizationName: 'Vetor', categories: ['Peças'], processes: ['Usinagem'], materials: ['Aço'], regions: ['SP'], certifications: [], capacity: 10, description: 'Peças industriais' }];
    mountBuyerSuppliersPage({ container: document.querySelector('#lab'), workspace: { id: 'buyer' }, repository: {
      getOperations: async () => ({ status: 'ready', data: { demands, orders: [], proposals: [] } }),
      listSupplierProfiles: async () => profiles, getBuyerInvitations: async () => [],
      inviteSupplierToDemand: async () => new Promise(resolve => { window.finishInvite = () => resolve({ alreadyAvailable: false }); }),
    } });
  });
  await page.getByRole('button', { name: 'Convidar para esta demanda' }).click();
  await page.getByRole('combobox', { name: 'Selecione uma demanda publicada' }).selectOption('b');
  await page.evaluate(() => window.finishInvite());
  await page.getByRole('searchbox', { name: 'Buscar fornecedores' }).fill('Vetor');
  await expect(page.getByRole('button', { name: 'Convidar para esta demanda' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Já disponível para esta demanda' })).toHaveCount(0);
});
