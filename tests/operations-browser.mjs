import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ headless: true, ...(process.env.SIVI_BROWSER_CHANNEL ? { channel: process.env.SIVI_BROWSER_CHANNEL } : {}) });
try {
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  for (const role of ['buyer', 'supplier']) for (const section of ['demands', 'proposals', 'orders']) {
    await page.goto(`http://127.0.0.1:4173/tests/fixtures/operations-lab.html?role=${role}&section=${section}`);
    await page.locator('h1').waitFor();
    if (role === 'supplier' && section === 'proposals') assert.equal(await page.getByText('Horizonte Usinagem').count(), 0);
  }
  await page.goto('http://127.0.0.1:4173/tests/fixtures/operations-lab.html');
  await page.getByText('Nova demanda', { exact: true }).click();
  await page.getByLabel('Título da demanda', { exact: true }).fill('Eixo de teste');
  await page.getByLabel('Prazo solicitado', { exact: true }).fill('2026-10-01');
  await page.getByLabel('Destino de entrega').fill('São Paulo');
  await page.getByLabel('Região atendida').fill('SP');
  await page.getByLabel('Objetivo e observações').fill('Produção conforme desenho técnico');
  await page.getByLabel('Descrição do item').fill('Eixo de teste');
  await page.getByLabel('Categoria').fill('eixos');
  await page.getByLabel('Material').fill('Aço SAE 1045');
  await page.getByLabel('Processo necessário').fill('usinagem');
  await page.getByLabel('Quantidade', { exact: true }).fill('12');
  await page.getByRole('button', { name: 'Salvar rascunho' }).click();
  await page.getByRole('heading', { name: 'Eixo de teste', exact: true }).waitFor();

  await page.getByLabel('Buscar demandas').fill('inexistente');
  await page.getByText('Nenhum registro corresponde à busca.').waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Publicar demanda', exact: true }).first().click();
  const switchPage = async (role, section) => { await page.evaluate(([r, s]) => window.operationsLab(r, s), [role, section]); await page.locator('[data-workflow]').waitFor(); };
  await switchPage('supplier', 'proposals');
  await page.getByText('Preparar proposta', { exact: true }).click();
  for (const [label, value] of [['Valor total dos itens (R$)', '1200.50'], ['Frete (R$)', '50'], ['Prazo em dias', '10'], ['Válida até', '2099-10-01'], ['Fabricante real', 'Vetor'], ['Condição de pagamento', '30 dias'], ['Garantia e responsável', '12 meses, Vetor'], ['Resposta à especificação', 'Conforme desenho']]) await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole('button', { name: 'Enviar versão da proposta', exact: true }).click();
  await switchPage('buyer', 'proposals');
  await page.getByRole('button', { name: 'Aceitar versão e gerar pedido', exact: true }).click();
  await switchPage('supplier', 'orders');
  await page.getByText('Registrar inspeção / reinspeção', { exact: true }).click();
  await page.getByLabel('Quantidade aprovada', { exact: true }).fill('10');
  await page.getByLabel('Plano de inspeção e versão').fill('Plano v1');
  await page.getByLabel('Resultado e evidência da inspeção').fill('2 unidades fora da tolerância');
  await page.getByRole('button', { name: 'Registrar inspeção', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Registrar expedição', exact: true }).count(), 0);
  await page.getByText('Registrar inspeção / reinspeção', { exact: true }).click();
  await page.getByLabel('Quantidade aprovada', { exact: true }).fill('12');
  await page.getByLabel('Plano de inspeção e versão').fill('Plano v1');
  await page.getByLabel('Resultado e evidência da inspeção').fill('Reinspeção conforme');
  await page.getByRole('button', { name: 'Registrar inspeção', exact: true }).click();
  await page.getByRole('button', { name: 'Registrar expedição', exact: true }).click();
  await switchPage('buyer', 'orders');
  await page.getByRole('button', { name: 'Confirmar recebimento', exact: true }).click();
  await page.getByLabel('Nota de 1 a 5', { exact: true }).fill('5');
  await page.getByLabel('Comentário sobre a entrega').fill('Peças conforme o pedido');
  await page.getByRole('button', { name: 'Enviar avaliação', exact: true }).click();
  await page.getByText('Avaliação da entrega: 5/5 · Peças conforme o pedido', { exact: true }).waitFor();
  for (const state of ['error', 'empty', 'forbidden', 'conflict']) {
    await page.goto(`http://127.0.0.1:4173/tests/fixtures/operations-lab.html?state=${state}`);
    await page.locator('[data-page-title]').waitFor();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: six pages, supplier filtering, demand → proposal → order → blocked inspection → reinspection → dispatch → delivery → evaluation, mobile width and repository states');
} finally { await browser.close(); }
