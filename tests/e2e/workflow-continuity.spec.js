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

test('switching demands locks invites during lookup and isolates delayed writes', async ({ page }) => {
  await lab(page);
  await page.evaluate(async () => {
    const { mountBuyerSuppliersPage } = await import('/src/pages/buyer/suppliers-page.js');
    const demands = ['a', 'b'].map(id => ({ id, title: `Demanda ${id}`, status: 'published', updatedAt: id === 'a' ? 2 : 1, items: [{ category: 'Peças', process: 'Usinagem', material: 'Aço', quantity: 1, unit: 'un' }], region: 'SP' }));
    const profiles = [{ organizationId: 'supplier', organizationName: 'Vetor', categories: ['Peças'], processes: ['Usinagem'], materials: ['Aço'], regions: ['SP'], certifications: [], capacity: 10, description: 'Peças industriais' }];
    window.inviteWrites = [];
    window.operationReads = 0;
    mountBuyerSuppliersPage({ container: document.querySelector('#lab'), workspace: { id: 'buyer' }, repository: {
      getOperations: async () => { window.operationReads++; return { status: 'ready', data: { demands, orders: [], proposals: [] } }; },
      listSupplierProfiles: async () => profiles,
      getBuyerInvitations: (_workspace, demandId) => demandId === 'a' ? Promise.resolve([]) : new Promise(resolve => { window.finishLookup = () => resolve([]); }),
      inviteSupplierToDemand: async (_workspace, demandId) => new Promise(resolve => {
        window.inviteWrites.push(demandId);
        window.finishInvite = () => resolve({ alreadyAvailable: false });
      }),
    } });
  });
  await expect(page.getByRole('link', { name: 'Ver perfil de Vetor' })).toBeVisible();
  expect(await page.evaluate(() => window.operationReads)).toBe(0);
  await page.getByRole('tab', { name: 'Matches' }).click();
  const compare = page.getByRole('button', { name: 'Ver compatibilidade de Vetor' });
  const dialog = page.getByRole('dialog');
  const select = page.getByRole('combobox', { name: 'Demanda publicada' });
  await compare.click();
  await dialog.getByRole('button', { name: 'Convidar para a demanda' }).click();
  await expect(dialog.getByRole('button', { name: 'Enviando convite…' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await select.selectOption('b');
  await compare.click();
  await expect(page.getByRole('button', { name: 'Conferindo convites…' })).toBeDisabled();
  await page.evaluate(() => window.finishInvite());
  await expect(page.getByRole('button', { name: 'Conferindo convites…' })).toBeDisabled();
  await page.evaluate(() => window.finishLookup());
  await expect(dialog.getByRole('button', { name: 'Convidar para a demanda' })).toBeEnabled();
  await expect(dialog.getByRole('button', { name: 'Já tem acesso' })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await select.selectOption('a');
  await compare.click();
  await expect(dialog.getByRole('button', { name: 'Já tem acesso' })).toBeDisabled();
  expect(await page.evaluate(() => window.inviteWrites)).toEqual(['a']);
});

test('a failed demand lookup leaves the catalog available and retries inside Matches', async ({ page }) => {
  await lab(page);
  await page.evaluate(async () => {
    const { mountBuyerSuppliersPage } = await import('/src/pages/buyer/suppliers-page.js');
    let reads = 0;
    mountBuyerSuppliersPage({ container: document.querySelector('#lab'), workspace: { id: 'buyer' }, repository: {
      listSupplierProfiles: async () => [{ organizationId: 'vetor', organizationName: 'Vetor' }],
      getOperations: async () => ++reads === 1 ? { status: 'error' } : { status: 'ready', data: { demands: [] } },
    } });
  });
  await page.getByRole('tab', { name: 'Matches' }).click();
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar as demandas');
  await page.getByRole('tab', { name: 'Catálogo' }).click();
  await expect(page.getByRole('link', { name: 'Ver perfil de Vetor' })).toBeVisible();
  await page.getByRole('tab', { name: 'Matches' }).click();
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByRole('link', { name: 'Ir para Minhas demandas' })).toBeVisible();
});
