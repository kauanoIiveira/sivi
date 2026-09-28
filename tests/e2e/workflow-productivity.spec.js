import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function openWorkspace(page, section = 'orders', role = 'buyer') {
  await page.goto('/tests/fixtures/operations-lab.html');
  await page.evaluate(async ({ section, role }) => {
    const { mountOperationsPage } = await import('/src/pages/operations/operations-page.js');
    const item = { id: 'item-1', description: 'Eixo', category: 'Usinados', material: 'Aço', process: 'Usinagem', quantity: 12, unit: 'un' };
    const version = { id: 'version-1', revision: 1, totalCents: 10000, freightCents: 500, leadTimeDays: 10, validUntil: '2099-12-31', manufacturer: 'Usinagem', payment: '30 dias', warranty: '12 meses', technical: 'Desenho A' };
    const base = { buyerId: 'buyer', buyerName: 'Indústria compradora', supplierId: 'supplier', supplierName: 'Usinagem São Luís', items: [item], version, quantity: 12, requiredBy: '2099-12-31', destination: 'Diadema', region: 'SP', description: 'Manutenção preventiva' };
    const data = {
      demands: [
        { ...base, id: 'D-1', title: 'Eixos de aço', status: 'ordered', updatedAt: 1 },
        { ...base, id: 'D-2', title: 'Buchas de bronze', status: 'published', updatedAt: 2 },
      ],
      proposals: [
        { id: 'p-1', demandId: 'D-1', supplierId: 'supplier', supplierName: 'Usinagem São Luís', versions: [version, { ...version, id: 'newer', revision: 2, totalCents: 99000 }] },
        { id: 'p-2', demandId: 'D-2', supplierId: 'supplier', supplierName: 'Metalúrgica', versions: [version] },
      ],
      orders: [
        { ...base, id: 'P-1', demandId: 'D-1', sourceProposalId: 'p-1', title: 'Eixos de aço', status: 'accepted', updatedAt: 1 },
        { ...base, id: 'P-2', demandId: 'D-2', title: 'Buchas de bronze', status: 'delivered', updatedAt: 2, version: { ...version, totalCents: 2000 } },
      ], suppliers: [{ id: 'supplier', name: 'Usinagem São Luís' }],
    };
    window.productivityData = data;
    window.savedInputs = [];
    window.mountProductivity = () => mountOperationsPage({ container: document.querySelector('main'), section,
      workspace: { id: 'productivity', memberUid: 'ana', organizationRole: role, organizationName: 'Indústria compradora' },
      repository: { getOperations: async () => ({ status: 'ready', data }), workflow: {
        read: () => structuredClone(data),
        createDemand: async (_, input) => {
          window.savedInputs.push(structuredClone(input));
          data.demands.push({ ...input, id: 'NEW-1', items: input.items.map((item, index) => ({ ...item, id: `new-${index}`, quantity: Number(item.quantity), certifications: item.certifications.split(',').filter(Boolean) })), status: 'draft', updatedAt: 3 });
          return 'NEW-1';
        },
      } },
    });
    window.mountProductivity();
  }, { section, role });
  await expect(page.locator(`[data-workflow=${section}]`)).toBeVisible();
}

test('orders filter and sort, remember choices and export only visible frozen records', async ({ page }) => {
  await openWorkspace(page);
  const search = page.getByLabel('Buscar pedidos');
  await search.fill('sao eixos');
  await expect(page.locator('.workflow-order')).toHaveCount(1);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar pedidos em CSV' }).click();
  const file = await download;
  const csv = await readFile(await file.path(), 'utf8');
  expect(csv).toContain('P-1'); expect(csv).not.toContain('P-2'); expect(csv).toContain('"105,00"'); expect(csv).not.toContain('"995,00"');
  await page.evaluate(() => window.mountProductivity());
  await expect(search).toHaveValue('sao eixos');
  await search.fill('inexistente');
  await expect(page.getByRole('button', { name: 'Exportar pedidos em CSV' })).toBeDisabled();
  await expect(page.getByText('Nenhum resultado encontrado')).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(search).toBeFocused();
  await page.getByRole('combobox', { name: 'Ordenar por', exact: true }).selectOption('total');
  await expect(page.locator('.workflow-order > h3').first()).toHaveText('Buchas de bronze');
  await page.getByRole('combobox', { name: 'Situação', exact: true }).selectOption('accepted');
  await expect(page.locator('.workflow-order > h3')).toHaveText('Eixos de aço');
});

test('filtering cannot hide an unfinished evaluation and preserves its text', async ({ page }) => {
  await openWorkspace(page);
  await page.getByLabel('Comentário sobre a entrega').fill('Entrega em conferência');
  await page.getByLabel('Buscar pedidos').fill('aco');
  await expect(page.getByLabel('Buscar pedidos')).toHaveValue('');
  await expect(page.getByLabel('Comentário sobre a entrega')).toHaveValue('Entrega em conferência');
  await expect(page.locator('.workflow-feedback')).toContainText('Salve ou cancele');
});

test('reusing a demand requires review and persists a separate draft without IDs', async ({ page }) => {
  await openWorkspace(page, 'demands');
  const original = await page.evaluate(() => structuredClone(window.productivityData.demands[1]));
  await page.getByRole('button', { name: 'Reutilizar como nova demanda' }).first().click();
  const copy = page.locator('.workflow-copy-editor form');
  await expect(copy.getByLabel('Título da demanda')).toHaveValue('Buchas de bronze');
  await copy.getByLabel('Título da demanda').fill('Reposição revisada');
  await copy.getByRole('button', { name: 'Salvar rascunho' }).click();
  await expect(page.locator('.workflow-feedback')).toContainText('Nova demanda salva como rascunho');
  const result = await page.evaluate(() => ({ saved: window.savedInputs, data: window.productivityData }));
  expect(result.saved).toHaveLength(1); expect(result.saved[0].items[0].id).toBeUndefined();
  expect(result.data.demands.find(demand => demand.id === 'NEW-1')).toMatchObject({ title: 'Reposição revisada', status: 'draft' });
  expect(result.data.demands[1]).toEqual(original);
});

test('accepted comparison uses the frozen version, and printing restores the screen', async ({ page }) => {
  await openWorkspace(page, 'proposals');
  const accepted = page.locator('.workflow-negotiation').filter({ has: page.getByRole('heading', { name: 'Eixos de aço', exact: true }) });
  await expect(accepted.locator('table')).toContainText('Versão 1');
  await expect(accepted.locator('table')).not.toContainText('995,00');
  await page.getByRole('combobox', { name: 'Situação', exact: true }).selectOption('ordered');
  await expect(page.locator('.workflow-negotiation')).toHaveCount(2); // Both fixture negotiations have an order.
  await openWorkspace(page);
  const title = await page.title();
  await page.evaluate(() => { window.print = () => { window.printed = document.querySelector('#sivi-print-document').textContent; }; });
  const print = page.locator('.workflow-order').filter({ has: page.getByRole('heading', { name: 'Eixos de aço', exact: true }) }).getByRole('button', { name: 'Imprimir resumo' });
  await print.click();
  expect(await page.evaluate(() => window.printed)).toContain('Eixos de aço');
  expect(await page.evaluate(() => window.printed)).toContain('105,00');
  await expect(page.locator('#sivi-print-document')).toHaveCount(0);
  expect(await page.title()).toBe(title); await expect(print).toBeFocused();
});

test('collection controls fit mobile and remain usable with storage unavailable', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Blocked'); } }));
  await page.setViewportSize({ width: 360, height: 800 });
  await openWorkspace(page);
  await page.getByLabel('Buscar pedidos').fill('eixos');
  await expect(page.locator('.workflow-order')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
