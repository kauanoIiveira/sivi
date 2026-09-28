import { expect, test } from '@playwright/test';

test('returning to demands restores filters and a direct record still opens outside the filter', async ({ page }) => {
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.evaluate(async () => {
    const { mountWorkflowView } = await import('/src/pages/operations/workflow-view.js');
    const container = document.querySelector('main');
    const demands = ['Engrenagem', 'Eixo'].map((title, index) => ({
      id: `demand-${index}`, title, status: index ? 'draft' : 'published', quantity: 10,
      requiredBy: '2027-12-20', destination: 'Campinas', items: [],
    }));
    window.openDemandList = (selectedRecordId = null) => {
      container.replaceChildren();
      mountWorkflowView({ container, section: 'demands', suppliers: [], selectedRecordId,
        workspace: { id: 'buyer', memberUid: 'ana', organizationRole: 'buyer' },
        workflow: { read: () => ({ demands, proposals: [], orders: [] }) },
      });
    };
    window.openDemandList();
  });
  await page.getByLabel('Buscar demandas').fill('Engrenagem');
  await page.getByLabel('Situação', { exact: true }).selectOption('published');
  await expect(page.locator('.workflow-demand')).toHaveCount(1);
  await page.evaluate(() => window.openDemandList('demand-1'));
  await expect(page.locator('.workflow-demand > h3')).toHaveText('Eixo');
  await page.evaluate(() => window.openDemandList());
  await expect(page.getByLabel('Buscar demandas')).toHaveValue('Engrenagem');
  await expect(page.getByLabel('Situação', { exact: true })).toHaveValue('published');
  await page.getByLabel('Buscar demandas').fill('Sem resultado');
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await page.evaluate(() => window.openDemandList());
  await expect(page.locator('.workflow-demand')).toHaveCount(2);
  await expect(page.getByLabel('Buscar demandas')).toHaveValue('');
});

test('keeps the demand objective separate from every item description', async ({ page }) => {
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.evaluate(async () => {
    const { mountWorkflowView } = await import('/src/pages/operations/workflow-view.js');
    const container = document.querySelector('main');
    container.replaceChildren();
    mountWorkflowView({
      container, section: 'demands', selectedRecordId: null, suppliers: [],
      workspace: { id: 'buyer', organizationRole: 'buyer' },
      workflow: {
        read: () => ({ demands: [], proposals: [], orders: [] }),
        createDemand: async (_id, input) => { window.savedDemand = input; },
      },
    });
  });
  await page.getByText('Nova demanda', { exact: true }).click();
  const form = page.locator('.workflow-demand-form');
  await form.getByLabel('Título da demanda').fill('Componentes da linha de montagem');
  await form.getByLabel('Prazo solicitado').fill('2027-12-20');
  await form.getByLabel('Destino de entrega').fill('Campinas/SP');
  await form.getByLabel('Região atendida').fill('SP');
  await form.getByLabel('Objetivo e observações').fill('Manutenção preventiva. Preservar desenho e tolerâncias.');
  await form.getByRole('button', { name: 'Adicionar outro item' }).click();
  for (const [index, description] of ['Engrenagem', 'Eixo'].entries()) {
    const item = form.locator('[data-demand-item]').nth(index);
    await item.getByLabel('Descrição do item').fill(description);
    await item.getByLabel('Categoria', { exact: true }).fill('usinados');
    await item.getByLabel('Material', { exact: true }).fill('aço');
    await item.getByLabel('Processo necessário').fill('usinagem');
    await item.getByLabel('Quantidade', { exact: true }).fill('10');
  }
  await form.getByRole('button', { name: 'Salvar rascunho', exact: true }).click();
  const saved = await page.evaluate(() => window.savedDemand);
  expect(saved.description).toBe('Manutenção preventiva. Preservar desenho e tolerâncias.');
  expect(saved.items.map(item => item.description)).toEqual(['Engrenagem', 'Eixo']);
});

test('draft editor preserves changes after an error and cancel restores the saved version', async ({ page }) => {
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.evaluate(async () => {
    const { mountOperationsPage } = await import('/src/pages/operations/operations-page.js');
    const data = { demands: [{
      id: 'draft-a', buyerId: 'alpha', title: 'Componentes revisáveis', description: 'Objetivo da compra',
      requiredBy: '2027-12-20', destination: 'Campinas', region: 'SP', quantity: 15, updatedAt: 10, status: 'draft',
      items: [
        { id: 'item-1', description: 'Engrenagem', category: 'usinados', material: 'aço', process: 'usinagem', quantity: 10, unit: 'un', certifications: ['ISO 9001'] },
        { id: 'item-2', description: 'Eixo', category: 'usinados', material: 'aço', process: 'usinagem', quantity: 5, unit: 'un' },
      ],
    }], proposals: [], orders: [], suppliers: [] };
    window.editCalls = [];
    mountOperationsPage({
      container: document.querySelector('main'), section: 'demands',
      workspace: { id: 'buyer', organizationRole: 'buyer', organizationName: 'Alpha' },
      repository: {
        getOperations: async () => ({ status: 'ready', data }),
        workflow: {
          read: () => structuredClone(data),
          updateDemand: async (...args) => { window.editCalls.push(args); throw new Error('Conexão interrompida. Tente novamente.'); },
        },
      },
    });
  });
  const record = page.locator('.workflow-demand');
  await record.getByText('Editar rascunho', { exact: true }).click();
  const form = record.locator('.workflow-demand-form');
  await expect(form.locator('[data-demand-item]')).toHaveCount(2);
  await expect(form.getByLabel('Certificações, separadas por vírgula').first()).toHaveValue('ISO 9001');
  await form.getByRole('button', { name: 'Remover item 1', exact: true }).click();
  await expect(form.getByLabel('Descrição do item')).toBeFocused();
  await expect(form.getByRole('button', { name: 'Remover item 1', exact: true })).toBeDisabled();
  await form.getByRole('button', { name: 'Adicionar outro item' }).click();
  const added = form.locator('[data-demand-item]').last();
  await expect(added.getByLabel('Descrição do item')).toBeFocused();
  await added.getByLabel('Descrição do item').fill('Bucha');
  await added.getByLabel('Categoria', { exact: true }).fill('usinados');
  await added.getByLabel('Material', { exact: true }).fill('bronze');
  await added.getByLabel('Processo necessário').fill('usinagem');
  await added.getByLabel('Quantidade', { exact: true }).fill('3');
  await form.getByRole('button', { name: 'Salvar alterações', exact: true }).click();
  await expect(form.getByRole('alert')).toHaveText('Conexão interrompida. Tente novamente.');
  await expect(added.getByLabel('Descrição do item')).toHaveValue('Bucha');
  await expect(form.getByRole('button', { name: 'Salvar alterações', exact: true })).toBeEnabled();
  const [workspace, id, input, version] = await page.evaluate(() => window.editCalls[0]);
  expect([workspace, id, version]).toEqual(['buyer', 'draft-a', 10]);
  expect(input.description).toBe('Objetivo da compra');
  expect(input.items[0].id).toBe('item-2');
  expect(input.items[1].id).toBeUndefined();
  await form.getByRole('button', { name: 'Cancelar edição', exact: true }).click();
  await expect(record.locator('.workflow-editor > summary')).toBeFocused();
  await record.getByText('Editar rascunho', { exact: true }).click();
  await expect(form.getByLabel('Descrição do item').first()).toHaveValue('Engrenagem');
  await expect(form.getByLabel('Descrição do item').last()).toHaveValue('Eixo');
});
