import { expect, test } from '@playwright/test';

test('mixed-unit inspections collect and validate the approval of each item', async ({ page }) => {
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.evaluate(async () => {
    const { mountOperationsPage } = await import('/src/pages/operations/operations-page.js');
    const order = { id: 'o1', title: 'Compra mista', quantity: 30, status: 'accepted', buyerName: 'Indústria Alpha', version: { revision: 1, totalCents: 5000, freightCents: 100, leadTimeDays: 2, payment: 'À vista', warranty: '12 meses' },
      items: [{ id: 'a', description: 'Eixo', quantity: 10, unit: 'un' }, { id: 'b', description: 'Tubo', quantity: 20, unit: 'm' }], inspections: [] };
    const data = { demands: [], proposals: [], orders: [order], suppliers: [] };
    window.inspectionCalls = [];
    mountOperationsPage({ container: document.querySelector('main'), section: 'orders', workspace: { id: 'supplier', organizationRole: 'supplier', organizationName: 'Vetor' },
      repository: { getOperations: async () => ({ status: 'ready', data }), workflow: { read: () => data, recordInspection: async (...args) => window.inspectionCalls.push(args) } },
    });
  });
  await page.getByText('Registrar inspeção / reinspeção', { exact: true }).click();
  const form = page.locator('.workflow-form');
  await expect(page.getByText(/Quantidade contratada: 10 un · 20 m/)).toBeVisible();
  await form.getByLabel('Eixo · quantidade aprovada (un)').fill('11');
  await form.getByLabel('Tubo · quantidade aprovada (m)').fill('19');
  await form.getByLabel('Plano de inspeção e versão').fill('PI-2');
  await form.getByLabel('Resultado e evidência da inspeção').fill('Inspeção dimensional');
  await form.getByRole('button', { name: 'Registrar inspeção', exact: true }).click();
  expect(await page.evaluate(() => window.inspectionCalls)).toEqual([]);
  await form.getByLabel('Eixo · quantidade aprovada (un)').fill('10');
  await form.getByRole('button', { name: 'Registrar inspeção', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.inspectionCalls)).toEqual([['supplier', 'o1', { plan: 'PI-2', evidence: 'Inspeção dimensional', itemApprovals: [{ itemId: 'a', approved: '10' }, { itemId: 'b', approved: '19' }] }]]);
});

test('live dashboard identifies the demand, opens the linked record and prioritizes failed quality', async ({ page }) => {
  await page.goto('/tests/fixtures/dashboard-lab.html?role=buyer');
  await page.evaluate(async () => {
    const [{ mountDashboardPage }, { buildLiveDashboard, buildLiveJourney }] = await Promise.all([import('/src/pages/dashboard/dashboard-view.js'), import('/src/domain/live-marketplace-selectors.js')]);
    const workspace = { id: 'buyer', organizationRole: 'buyer', organizationName: 'Alpha' };
    const version = { id: 'v1', totalCents: 12000, freightCents: 1000, leadTimeDays: 3, validUntil: '2099-12-31' };
    const data = { demands: [{ id: 'd1', title: 'Tubos de manutenção', status: 'ordered', quantity: 20, items: [{ id: 'a', description: 'Tubo', quantity: 20, unit: 'm' }] }], proposals: [{ id: 'p1', demandId: 'd1', supplierId: 's1', supplierName: 'Vetor', versions: [version] }], orders: [{ id: 'o1', demandId: 'd1', title: 'Tubos de manutenção', status: 'blocked', quantity: 20, version, inspections: [] }] };
    const result = value => ({ status: 'ready', data: value, meta: { asOf: new Date().toISOString() } });
    mountDashboardPage({ container: document.querySelector('[data-dashboard-lab]'), workspace, repository: { getDashboard: async () => result(buildLiveDashboard(workspace, data)), getIndustrialJourney: async () => result(buildLiveJourney(workspace, data)) } });
  });
  await expect(page.locator('.decision-table')).toContainText('Tubos de manutenção');
  await expect(page.locator('.decision-table')).toContainText('Vetor');
  await expect(page.locator('.decision-table a')).toHaveAttribute('href', '#/app/comprador/propostas?registro=d1');
  await expect(page.locator('[data-rail-step=quality]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-rail-step=qr]')).toHaveCount(0);
  await expect(page.locator('[data-rail-evidence] a')).toHaveAttribute('href', '#/app/comprador/pedidos?registro=o1');
});

test('an empty live dashboard does not display an invented journey or a pending action', async ({ page }) => {
  await page.goto('/tests/fixtures/dashboard-lab.html?role=buyer');
  await page.evaluate(async () => {
    const [{ mountDashboardPage }, { buildLiveDashboard, buildLiveJourney }] = await Promise.all([import('/src/pages/dashboard/dashboard-view.js'), import('/src/domain/live-marketplace-selectors.js')]);
    const workspace = { id: 'buyer', organizationRole: 'buyer', organizationName: 'Nova empresa' };
    const data = { demands: [], proposals: [], orders: [] };
    const result = value => ({ status: 'ready', data: value, meta: { asOf: new Date().toISOString() } });
    mountDashboardPage({ container: document.querySelector('[data-dashboard-lab]'), workspace, repository: { getDashboard: async () => result(buildLiveDashboard(workspace, data)), getIndustrialJourney: async () => result(buildLiveJourney(workspace, data)) } });
  });
  await expect(page.getByRole('link', { name: 'Criar primeira demanda' })).toBeVisible();
  await expect(page.locator('[data-industrial-rail]')).toHaveCount(0);
  await expect(page.locator('.dashboard-next-actions')).toHaveCount(0);
});

test('navigation and reload protection preserve unsaved forms and wait for pending writes', async ({ page }) => {
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const [{ createUnsavedChangesGuard }, { createHashRouter }] = await Promise.all([import('/src/core/unsaved-changes.js'), import('/src/core/router.js')]);
    const host = document.createElement('div'); host.id = 'guard-test';
    host.innerHTML = '<form data-dirty="true"><label>Texto em edição<input value="Preservar meu trabalho"></label></form><a href="#/next?registro=A">Abrir outra página</a>';
    document.body.append(host);
    history.replaceState(null, '', '#/form');
    const guard = createUnsavedChangesGuard({ container: host, windowObject: window });
    const router = createHashRouter({ windowObject: window, routes: [{ path: '/form' }, { path: '/next' }], beforeNavigate: guard.canLeave,
      onRoute: ({ path }) => { host.dataset.route = path; }, onNotFound() {},
    });
    router.start(); window.cleanupGuard = () => { guard.dispose(); router.stop(); host.remove(); };
  });
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('link', { name: 'Abrir outra página' }).click();
  await expect(page).toHaveURL(/#\/form$/);
  await expect(page.getByLabel('Texto em edição')).toHaveValue('Preservar meu trabalho');
  const beforeUnloadPrevented = await page.evaluate(() => {
    const event = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(event); return event.defaultPrevented;
  });
  expect(beforeUnloadPrevented).toBe(true);
  await page.evaluate(() => document.querySelector('#guard-test form').setAttribute('aria-busy', 'true'));
  page.once('dialog', dialog => { expect(dialog.type()).toBe('alert'); return dialog.accept(); });
  await page.getByRole('link', { name: 'Abrir outra página' }).click();
  await expect(page).toHaveURL(/#\/form$/);
  await page.evaluate(() => document.querySelector('#guard-test form').removeAttribute('aria-busy'));
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('link', { name: 'Abrir outra página' }).click();
  await expect(page).toHaveURL(/#\/next\?registro=A$/);
  await expect(page.locator('#guard-test form')).not.toHaveAttribute('data-dirty', 'true');
  await page.evaluate(() => window.cleanupGuard());
});

test('blocked session storage does not prevent the application from opening', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Storage unavailable', 'SecurityError'); } }));
  await page.goto('/?authEmulator=1#/');
  await expect(page.locator('[data-public-surface] h1')).toBeVisible();
  expect(errors).toEqual([]);
});

test('admin registration saves once and refresh preserves review reasons and existing records on failure', async ({ page }) => {
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const { mountAdminDashboardPage } = await import('/src/pages/dashboard/admin-dashboard-page.js');
    const host = document.createElement('div'); host.id = 'admin-test'; document.body.append(host);
    window.adminWrites = 0; window.failAdminRead = false;
    mountAdminDashboardPage({ container: host, administration: {
      listOrganizations: async () => { if (window.failAdminRead) throw new Error('Conexão interrompida.'); return [{ id: 'alpha', name: 'Alpha', status: 'pending', roles: { buyer: true } }]; },
      registerOrganization: async () => { window.adminWrites++; await new Promise(resolve => { window.resolveAdmin = resolve; }); return { name: 'Beta', ownerEmail: 'beta@sivi.test' }; },
    } });
  });
  await page.getByLabel('Motivo para Alpha').fill('Conferir o contato informado');
  await page.getByRole('button', { name: 'Atualizar solicitações' }).click();
  await expect(page.getByLabel('Motivo para Alpha')).toHaveValue('Conferir o contato informado');
  await page.evaluate(() => { window.failAdminRead = true; });
  await page.getByRole('button', { name: 'Atualizar solicitações' }).click();
  await expect(page.locator('[data-admin-feedback]')).toContainText('Os registros anteriores continuam disponíveis');
  await expect(page.getByLabel('Motivo para Alpha')).toHaveValue('Conferir o contato informado');
  await page.locator('[data-admin-register]').locator('..').locator('summary').click();
  const form = page.locator('[data-admin-register]');
  await form.getByLabel('Nome da empresa').fill('Beta');
  await form.getByLabel('E-mail do responsável').fill('beta@sivi.test');
  await form.getByLabel('Compradora', { exact: true }).check();
  await form.getByRole('button', { name: 'Cadastrar e liberar acesso' }).click();
  await form.evaluate(node => node.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })));
  await expect(form.getByLabel('Nome da empresa')).toBeDisabled();
  expect(await page.evaluate(() => window.adminWrites)).toBe(1);
  await page.evaluate(() => { window.failAdminRead = false; window.resolveAdmin(); });
  await expect(page.locator('[data-admin-feedback]')).toContainText('empresa cadastrada');
  await expect(form).not.toHaveAttribute('data-dirty', 'true');
});

test('company registration survives local navigation attempts and sends only once', async ({ page }) => {
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const { mountContextPage } = await import('/src/pages/context/context-page.js');
    const host = document.createElement('div'); host.id = 'context-test'; document.body.append(host);
    window.companyWrites = 0; window.companyRefreshes = 0;
    mountContextPage({ container: host, workspaces: [], onSelect() {}, onboarding: { refresh: async () => window.companyRefreshes++ },
      onCreate: async () => { window.companyWrites++; await new Promise(resolve => { window.finishCompany = resolve; }); },
    });
  });
  const form = page.locator('[data-create-organization]');
  await form.getByLabel('Nome da empresa').fill('Empresa preservada');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Cadastrar empresa', exact: true }).click();
  await expect(form.getByLabel('Nome da empresa')).toHaveValue('Empresa preservada');
  await page.getByRole('button', { name: 'Atualizar situação', exact: true }).click();
  await expect(page.locator('#context-test [data-feedback]')).toContainText('Envie ou cancele');
  expect(await page.evaluate(() => window.companyRefreshes)).toBe(0);
  await form.getByLabel('CNPJ', { exact: true }).fill('12.345.678/0001-90');
  await form.getByLabel('Cidade', { exact: true }).fill('Campinas');
  await form.getByLabel('UF', { exact: true }).selectOption('SP');
  await form.getByLabel('Telefone ou e-mail de contato').fill('contato@empresa.test');
  await form.getByLabel('Compradora', { exact: true }).check();
  await form.getByRole('button', { name: 'Revisar cadastro' }).click();
  await form.getByRole('button', { name: 'Solicitar acesso', exact: true }).click();
  await form.evaluate(node => node.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })));
  await expect(form).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Cadastrar empresa', exact: true }).click();
  await expect(page.locator('#context-test [data-feedback]')).toContainText('Aguarde o envio');
  expect(await page.evaluate(() => window.companyWrites)).toBe(1);
  await page.evaluate(() => window.finishCompany());
  await expect(page.locator('#context-test [data-feedback]')).toContainText('Cadastro enviado');
});

test('administrative decisions protect the written reason and wait for confirmation before leaving', async ({ page }) => {
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const [{ mountAdminDashboardPage }, { createUnsavedChangesGuard }] = await Promise.all([
      import('/src/pages/dashboard/admin-dashboard-page.js'), import('/src/core/unsaved-changes.js'),
    ]);
    const host = document.createElement('div'); host.id = 'admin-review-test'; document.body.append(host);
    window.reviewWrites = 0; window.rejectReview = true;
    window.reviewGuard = createUnsavedChangesGuard({ container: host, windowObject: window });
    mountAdminDashboardPage({ container: host, administration: {
      listOrganizations: async () => [{ id: 'alpha', name: 'Alpha', status: 'pending', roles: { buyer: true } }],
      setOrganizationStatus: async () => { window.reviewWrites++; await new Promise(resolve => { window.finishReview = resolve; }); if (window.rejectReview) throw new Error('Falha no envio.'); },
    } });
  });
  const reason = page.getByLabel('Motivo para Alpha');
  await reason.fill('Atualizar o contato');
  page.once('dialog', dialog => dialog.dismiss());
  expect(await page.evaluate(() => window.reviewGuard.canLeave())).toBe(false);
  await page.getByRole('button', { name: 'Solicitar correção', exact: true }).click();
  await expect(reason).toBeDisabled();
  page.once('dialog', dialog => { expect(dialog.type()).toBe('alert'); return dialog.accept(); });
  expect(await page.evaluate(() => window.reviewGuard.canLeave())).toBe(false);
  await page.evaluate(() => window.finishReview());
  await expect(page.locator('#admin-review-test [data-admin-feedback]')).toContainText('Falha no envio');
  await expect(reason).toBeEnabled();
  await expect(reason).toHaveValue('Atualizar o contato');
  await page.evaluate(() => { window.rejectReview = false; });
  await page.getByRole('button', { name: 'Solicitar correção', exact: true }).click();
  await page.evaluate(() => window.finishReview());
  await expect(page.locator('#admin-review-test [data-admin-feedback]')).toContainText('Correção solicitada');
  expect(await page.evaluate(() => window.reviewGuard.canLeave())).toBe(true);
  expect(await page.evaluate(() => window.reviewWrites)).toBe(2);
  await page.evaluate(() => window.reviewGuard.dispose());
});
