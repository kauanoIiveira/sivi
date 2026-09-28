import { expect, test } from '@playwright/test';

test('a new demand can be recovered after reload, or discarded explicitly', async ({ page }) => {
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.getByText('Nova demanda', { exact: true }).click();
  const form = page.locator('.workflow-demand-form').first();
  await form.getByLabel('Título da demanda').fill('Compra ainda em preparação');
  await form.getByLabel('Objetivo e observações').fill('Preservar todas as especificações');
  await form.getByLabel('Descrição do item').fill('Engrenagem');
  await form.getByRole('button', { name: 'Adicionar outro item' }).click();
  await form.getByLabel('Descrição do item').last().fill('Eixo especial');
  await form.getByLabel('Quantidade', { exact: true }).last().fill('7');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Retomar preenchimento', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Retomar preenchimento', exact: true }).click();
  await expect(form.getByLabel('Título da demanda')).toHaveValue('Compra ainda em preparação');
  await expect(form.getByLabel('Descrição do item').last()).toHaveValue('Eixo especial');
  await expect(form.getByLabel('Quantidade', { exact: true }).last()).toHaveValue('7');
  await expect(form.getByLabel('Título da demanda')).toBeFocused();
  await page.reload();
  await page.getByRole('button', { name: 'Descartar preenchimento', exact: true }).click();
  await expect(form.getByLabel('Título da demanda')).toHaveValue('');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Retomar preenchimento', exact: true })).toHaveCount(0);
});

async function openDemands(page) {
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.evaluate(async () => {
    const { mountOperationsPage } = await import('/src/pages/operations/operations-page.js');
    const data = { demands: [{ id: 'D-105', title: 'Peças de manutenção', status: 'published', quantity: 30,
      requiredBy: '2027-12-20', destination: 'São Paulo', description: 'Compra industrial',
      items: [{ description: 'Eixo', material: 'Aço', quantity: 10, unit: 'un' }, { description: 'Tubo', material: 'Cobre', quantity: 20, unit: 'm' }],
    }], orders: [], proposals: [], suppliers: [] };
    window.refreshCalls = 0;
    mountOperationsPage({ container: document.querySelector('main'), section: 'demands',
      workspace: { id: 'buyer', memberUid: 'ana', organizationRole: 'buyer', organizationName: 'Empresa' },
      repository: { getOperations: async () => { window.refreshCalls++; return { status: 'ready', data }; }, workflow: { read: () => structuredClone(data) } },
    });
  });
}

test('search finds material without accents and quantities preserve their units', async ({ page }) => {
  await openDemands(page);
  await expect(page.locator('.workflow-demand .workflow-facts')).toContainText('10 un · 20 m');
  await page.getByLabel('Buscar demandas').fill('aco');
  await expect(page.locator('.workflow-demand')).toHaveCount(1);
  await expect(page.locator('[data-result-count]')).toContainText('1 de 1');
  await page.getByLabel('Buscar demandas').fill('d-105');
  await expect(page.locator('.workflow-demand')).toHaveCount(1);
  await page.getByLabel('Buscar demandas').fill('inexistente');
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.getByLabel('Buscar demandas')).toBeFocused();
});

test('refresh updates records but preserves a form with unsaved input', async ({ page }) => {
  await openDemands(page);
  await page.getByRole('button', { name: 'Atualizar registros', exact: true }).click();
  expect(await page.evaluate(() => window.refreshCalls)).toBe(2);
  await page.getByText('Nova demanda', { exact: true }).click();
  await page.locator('.workflow-demand-form').first().getByLabel('Título da demanda').fill('Não apagar');
  await page.getByRole('button', { name: 'Atualizar registros', exact: true }).click();
  await expect(page.locator('.workflow-feedback')).toContainText('Salve ou cancele');
  expect(await page.evaluate(() => window.refreshCalls)).toBe(2);
  await expect(page.locator('.workflow-demand-form').first().getByLabel('Título da demanda')).toHaveValue('Não apagar');
});

test('blocked recovery storage is explained without preventing input', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Blocked'); } }); });
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.getByText('Nova demanda', { exact: true }).click();
  const form = page.locator('.workflow-demand-form').first();
  await form.getByLabel('Título da demanda').fill('Compra local');
  await expect(form.getByRole('status')).toContainText('não guardado pelo navegador');
  await expect(form.getByLabel('Título da demanda')).toHaveValue('Compra local');
});

test('a refresh error leaves the existing records visible and the retry available', async ({ page }) => {
  await openDemands(page);
  await page.evaluate(async () => {
    const { mountOperationsPage } = await import('/src/pages/operations/operations-page.js');
    let calls = 0;
    const data = { demands: [{ id: 'D-1', title: 'Registro preservado', requiredBy: '2027-01-01', destination: 'SP', quantity: 1, status: 'published' }], proposals: [], orders: [], suppliers: [] };
    mountOperationsPage({ container: document.querySelector('main'), section: 'demands', workspace: { id: 'buyer', organizationRole: 'buyer' },
      repository: { getOperations: async () => ++calls === 2 ? { status: 'error' } : { status: 'ready', data }, workflow: { read: () => data } },
    });
  });
  await page.getByRole('button', { name: 'Atualizar registros' }).click();
  await expect(page.locator('.workflow-feedback')).toContainText('Não foi possível atualizar');
  await expect(page.locator('.workflow-demand > h3')).toHaveText('Registro preservado');
  await expect(page.getByRole('button', { name: 'Atualizar registros' })).toBeEnabled();
  await page.getByRole('button', { name: 'Atualizar registros' }).click();
  await expect(page.locator('.workflow-feedback')).toHaveText('Registros atualizados.');
  await expect(page.locator('.workflow-feedback')).toBeFocused();
});

test('a cent-level proposal saves once, locks sibling forms and announces a confirmed write warning', async ({ page }) => {
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.evaluate(async () => {
    const { mountWorkflowView } = await import('/src/pages/operations/workflow-view.js');
    const container = document.querySelector('main'); container.replaceChildren();
    let warning = null;
    window.proposalCalls = [];
    mountWorkflowView({ container, section: 'proposals', selectedRecordId: null, suppliers: [],
      workspace: { id: 'supplier', organizationRole: 'supplier' },
      workflow: {
        read: () => ({ demands: ['A', 'B'].map(id => ({ id, title: id, status: 'published', quantity: 1 })), proposals: [], orders: [] }),
        getSyncWarning: () => warning,
        sendProposal: async (...args) => { window.proposalCalls.push(args); await new Promise(resolve => { window.finishProposal = resolve; }); warning = 'Os dados foram salvos. A atualização da lista está pendente.'; },
      },
    });
  });
  await page.getByText('Preparar proposta', { exact: true }).first().click();
  const form = page.locator('.workflow-form').first();
  for (const [name, value] of Object.entries({ price: '0.01', freight: '0', leadTimeDays: '2', validUntil: '2027-12-20', manufacturer: 'Fábrica', payment: 'À vista', warranty: '12 meses', technical: 'Conforme desenho' })) {
    await form.locator(`[name=${name}]`).fill(value);
  }
  await form.getByRole('button', { name: 'Enviar versão da proposta' }).click();
  await expect(page.locator('.workflow-form').last().locator('[name=price]')).toBeDisabled();
  await expect(form).toHaveAttribute('aria-busy', 'true');
  await page.evaluate(() => window.finishProposal());
  await expect(page.locator('.workflow-feedback')).toContainText('Os dados foram salvos.');
  await expect(page.locator('.workflow-feedback')).toHaveAttribute('data-tone', 'warning');
  await expect(page.locator('.workflow-feedback')).toBeFocused();
  const calls = await page.evaluate(() => window.proposalCalls);
  expect(calls).toHaveLength(1); expect(calls[0][2].totalCents).toBe(1);
});

test('saving one proposal preserves another unfinished form without asking to discard it', async ({ page }) => {
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.evaluate(async () => {
    const { mountWorkflowView } = await import('/src/pages/operations/workflow-view.js');
    const container = document.querySelector('main'); container.replaceChildren();
    window.savedProposals = [];
    mountWorkflowView({ container, section: 'proposals', selectedRecordId: null, suppliers: [],
      workspace: { id: 'supplier', organizationRole: 'supplier' },
      workflow: {
        read: () => ({ demands: ['A', 'B'].map(id => ({ id, title: id, status: 'published', quantity: 1 })), proposals: [], orders: [] }),
        sendProposal: async (_workspace, id) => { window.savedProposals.push(id); },
      },
    });
  });
  const forms = page.locator('.workflow-form');
  for (let i = 0; i < 2; i++) {
    await page.getByText('Preparar proposta', { exact: true }).nth(i).click();
    for (const [name, value] of Object.entries({ price: '10', freight: '0', leadTimeDays: '2', validUntil: '2027-12-20', manufacturer: 'Fábrica', payment: 'À vista', warranty: '12 meses', technical: `Especificação ${i}` })) {
      await forms.nth(i).locator(`[name=${name}]`).fill(value);
    }
  }
  await forms.first().getByRole('button', { name: 'Enviar versão da proposta' }).click();
  await expect.poll(() => page.evaluate(() => window.savedProposals)).toEqual(['A']);
  await expect(forms.last().locator('[name=technical]')).toHaveValue('Especificação 1');
  await expect(forms.first().getByRole('button', { name: 'Salvo', exact: true })).toBeDisabled();
  await forms.last().getByRole('button', { name: 'Enviar versão da proposta' }).click();
  await expect.poll(() => page.evaluate(() => window.savedProposals)).toEqual(['A', 'B']);
});
