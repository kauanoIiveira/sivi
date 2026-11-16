import { expect, test } from '@playwright/test';

const preview = '/tests/fixtures/workspace-preview.html?role=buyer&catalog=expanded';
const directory = (state = 'normal') => `${preview}&state=${state}#/app/comprador/fornecedores`;

test('supplier catalog uses a desktop-first grid in both themes', async ({ page }) => {
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    await page.goto(directory());
    const cards = page.getByRole('tabpanel', { name: 'Catálogo' }).locator('.marketplace-card');
    await expect(cards).toHaveCount(6);
    await expect(cards.locator('h3')).toHaveText(['Atlas Precisão', 'Boreal Tornearia', 'Croma Elastômeros',
      'Delta Ferramentaria', 'Eixo Forte Caldeiraria', 'Vetor Componentes Industriais']);
    await expect(cards.first().locator('.marketplace-card__initials')).toHaveText('AP');
    for (const [width, columns] of [[1920, 3], [1201, 3], [1200, 2], [720, 2], [719, 1], [320, 1]]) {
      await page.setViewportSize({ width, height: 900 });
      const bounds = await cards.evaluateAll(nodes => nodes.map(node => {
        const { top, left, right } = node.getBoundingClientRect();
        return { top, left, right };
      }));
      expect(bounds.filter(({ top }) => top === bounds[0].top)).toHaveLength(columns);
      expect(bounds[columns].top).toBeGreaterThan(bounds[0].top);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  }
});

test('catalog filters and search are independent from Matches and survive profile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(directory());
  const catalogTab = page.getByRole('tab', { name: 'Catálogo' });
  const matchTab = page.getByRole('tab', { name: 'Matches' });
  const catalog = page.getByRole('tabpanel', { name: 'Catálogo' });
  const matches = page.getByRole('tabpanel', { name: 'Matches' });
  await catalog.getByRole('combobox', { name: 'Filtrar por região' }).selectOption('SP');
  await catalog.getByRole('combobox', { name: 'Filtrar por capacidade' }).selectOption('500');
  await expect(catalog.locator('.marketplace-card')).toHaveCount(3);
  await catalog.getByRole('searchbox').fill('retifica eixos');
  await expect(catalog.locator('.marketplace-card h3')).toHaveText('Atlas Precisão');
  await catalog.getByRole('button', { name: 'Remover filtro Região: SP' }).click();
  await expect(catalog.getByText('Mais filtros (1)')).toBeFocused();
  const profile = catalog.getByRole('link', { name: 'Ver perfil de Atlas Precisão' });
  await profile.click();
  await expect(page.getByRole('heading', { name: 'Atlas Precisão', level: 1 })).toBeFocused();
  await expect(page.getByText('Retífica cilíndrica e manutenção de eixos.')).toBeVisible();
  await page.goBack();
  await expect(profile).toBeVisible();

  await catalogTab.press('End');
  await expect(matchTab).toBeFocused();
  await expect(matchTab).toHaveAttribute('aria-selected', 'true');
  await expect(matches.getByRole('combobox', { name: 'Demanda publicada' }).locator('option:checked')).toHaveText('Eixos de transmissão · lote 19');
  await matches.getByRole('searchbox').fill('Boreal');
  await expect(matches.locator('.marketplace-card h3')).toHaveText('Boreal Tornearia');
  await matchTab.press('Home');
  await expect(catalogTab).toBeFocused();
  await expect(catalog.getByRole('searchbox')).toHaveValue('retifica eixos');
  await expect(catalog.getByRole('combobox', { name: 'Filtrar por capacidade' })).toHaveValue('500');
  await catalog.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(catalog.locator('.marketplace-card')).toHaveCount(6);
  await catalogTab.press('ArrowRight');
  await expect(matches.getByRole('searchbox')).toHaveValue('Boreal');
});

test('Matches explains all states and invites through the selected demand only', async ({ page }) => {
  await page.goto(directory());
  await page.getByRole('tab', { name: 'Matches' }).click();
  const matches = page.getByRole('tabpanel', { name: 'Matches' });
  const states = matches.locator('.marketplace-badge');
  await expect(states).toHaveText(['Compatível', 'Compatível', 'A confirmar', 'A confirmar']);
  await matches.getByRole('combobox', { name: 'Resultado da compatibilidade' }).selectOption('all');
  await expect(states).toHaveText(['Compatível', 'Compatível', 'A confirmar', 'A confirmar',
    'Fora dos critérios essenciais', 'Fora dos critérios essenciais']);
  await matches.getByRole('button', { name: 'Ver compatibilidade de Croma Elastômeros' }).click();
  const incompatible = page.getByRole('dialog', { name: 'Compatibilidade de Croma Elastômeros' });
  await expect(incompatible.getByText('Categoria (obrigatório)')).toBeVisible();
  await expect(incompatible.getByRole('button', { name: 'Fora dos critérios essenciais' })).toBeDisabled();
  await incompatible.getByRole('button', { name: 'Fechar' }).click();

  const open = matches.getByRole('button', { name: 'Ver compatibilidade de Atlas Precisão' });
  await open.click();
  const eligible = page.getByRole('dialog', { name: 'Compatibilidade de Atlas Precisão' });
  await expect(eligible.getByText('Demanda: Eixos de transmissão · lote 19')).toBeVisible();
  await eligible.getByRole('button', { name: 'Convidar para a demanda' }).click();
  await expect(eligible.getByRole('status')).toHaveText('Demanda disponibilizada ao fornecedor.');
  await expect(eligible.getByRole('button', { name: 'Já tem acesso' })).toBeDisabled();
  await eligible.getByRole('button', { name: 'Fechar' }).click();
  await expect(open).toBeFocused();
  await open.click();
  await expect(eligible.getByRole('button', { name: 'Já tem acesso' })).toBeDisabled();
});

test('Matches directs the buyer to demands when none is published', async ({ page }) => {
  await page.goto(directory('empty'));
  await page.getByRole('tab', { name: 'Matches' }).click();
  await expect(page.getByRole('link', { name: 'Ir para Minhas demandas' })).toHaveAttribute('href', '#/app/comprador/demandas');
});

test('a supplier card opens a dedicated page that supports direct links and checking compatibility', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(directory());
  const artwork = page.locator('.marketplace-card').filter({ hasText: 'Boreal Tornearia' }).locator('.marketplace-card__art');
  await artwork.waitFor();
  const bounds = await artwork.boundingBox();
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(page).toHaveURL(/fornecedores\/perfil\?registro=boreal$/);
  const supplier = page.getByRole('heading', { name: 'Boreal Tornearia', level: 1 });
  await expect(supplier).toBeFocused();
  await expect(page.getByRole('link', { name: 'Fornecedores', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: 'Dados da empresa' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Especialidades e capacidades' })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 800 });
  await page.reload();
  await expect(supplier).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole('link', { name: 'Consultar compatibilidade' }).click();
  await expect(page.getByRole('tab', { name: 'Matches' })).toHaveAttribute('aria-selected', 'true');
  const matches = page.getByRole('tabpanel', { name: 'Matches' });
  await expect(matches.locator('.marketplace-card h3')).toHaveText('Boreal Tornearia');
  await expect(matches.locator('.marketplace-badge')).toHaveText('A confirmar');
  await matches.getByRole('link', { name: 'Ver perfil de Boreal Tornearia' }).click();
  await page.getByRole('link', { name: 'Voltar para fornecedores' }).click();
  await expect(page.getByRole('tab', { name: 'Matches' })).toHaveAttribute('aria-selected', 'true');
  await expect(matches.locator('.marketplace-card h3')).toHaveText('Boreal Tornearia');
});

test('unknown or malformed supplier links provide a return to the catalog', async ({ page }) => {
  for (const query of ['registro=missing-supplier', 'registro=%2Fnot-a-key', 'registro=atlas&registro=boreal']) {
    await page.goto(`${directory()}/perfil?${query}`);
    await expect(page.getByRole('heading', { name: 'Fornecedor indisponível', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Voltar para fornecedores' })).toBeVisible();
  }
});
