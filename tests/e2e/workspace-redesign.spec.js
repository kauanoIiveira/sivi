import { expect, test } from '@playwright/test';

test('closing a demand keeps the reason and removes the supplier proposal action', async ({ page }) => {
  await page.goto('/tests/fixtures/workspace-preview.html#/app/comprador/demandas');
  const demand = page.locator('.workflow-demand').filter({ hasText: 'Flanges de conexão · lote 08' });
  await demand.getByText('Encerrar demanda', { exact: true }).click();
  await demand.getByLabel('Motivo do encerramento').fill('Compra reagendada para o próximo trimestre.');
  await demand.getByRole('button', { name: 'Confirmar encerramento' }).click();
  await expect(demand).toContainText('Compra reagendada para o próximo trimestre.');
  await expect(demand).toContainText('Encerrada');
  await page.getByLabel('Atuação da prévia').selectOption('supplier');
  await page.getByRole('link', { name: 'Oportunidades', exact: true }).click();
  await expect(demand).toContainText('Encerrada');
  await expect(demand.getByRole('link', { name: 'Enviar proposta', exact: true })).toHaveCount(0);
});

test('workspace analytics filters real creations and keeps the current portfolio independent', async ({ page }) => {
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const { mountWorkspaceAnalytics } = await import('/src/generated/public/entry.js');
    const now = Date.parse('2026-10-23T18:00:00Z');
    const records = { demands: [], proposals: [{ createdAt: now - 50 * 86400000 }, { createdAt: now - 4 * 86400000 }], orders: [{ status: 'blocked', createdAt: now - 50 * 86400000, version: { totalCents: 10000, freightCents: 500 } }] };
    const slot = document.createElement('div');
    document.querySelector('[data-app-outlet]').replaceChildren(slot);
    window.clearWorkspaceInsights = mountWorkspaceAnalytics(slot, { records, role: 'buyer', now });
  });
  const panel = page.locator('[data-workspace-insights]');
  await expect(panel.locator('[data-insight-total]')).toHaveAccessibleName('propostas recebidas: 2');
  const intervals = panel.getByRole('group', { name: 'Criações por intervalo' }).getByRole('button');
  await expect(intervals).toHaveCount(6);
  await expect(panel.getByRole('list', { name: 'Pedidos por status' })).toContainText('Reinspeção');
  await intervals.first().click();
  await expect(intervals.first()).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.locator('.workspace-insights__interval')).toContainText('0 no intervalo');
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(intervals.last()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await panel.getByRole('button', { name: '30 dias', exact: true }).click();
  await expect(panel.locator('[data-insight-total]')).toHaveAccessibleName('propostas recebidas: 1');
  await expect(panel.locator('[data-portfolio-total]')).toHaveText('1');
  await panel.getByRole('button', { name: 'Pedidos', exact: true }).click();
  await expect(panel.locator('[data-insight-total]')).toHaveAccessibleName('pedidos criados: 0');
  await expect(intervals).toHaveCount(0);
  await panel.getByText('Consultar dados do período', { exact: true }).click();
  await expect(panel.getByRole('table')).toBeVisible();
  await expect(panel.getByRole('row')).toHaveCount(7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => window.clearWorkspaceInsights());
  await expect(panel).toHaveCount(0);
});

test('buyer tabs share the overview typography, panels, metrics and sidebar icons', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/tests/fixtures/workspace-preview.html?role=buyer#/app/comprador/inicio');
  const shell = page.locator('[data-app-shell]');
  const title = shell.locator('[data-page-title]');
  await expect(title).toBeVisible();
  await expect(shell).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(shell.locator('[data-app-outlet]')).toHaveCSS('background-color', 'rgb(27, 27, 27)');
  const overviewMetric = shell.locator('.buyer-metric__value').first();
  await expect(overviewMetric).toHaveCSS('font-family', /^Barlow,/);
  await expect(overviewMetric).toHaveCSS('font-weight', '700');
  await expect(shell.locator('.buyer-panel__heading h2').first()).toHaveCSS('font-weight', '700');
  const metricSize = await overviewMetric.evaluate(node => getComputedStyle(node).fontSize);
  const panelColor = await shell.locator('.workspace-insights__movement').evaluate(node => getComputedStyle(node).backgroundColor);
  expect(await page.evaluate(async () => (await document.fonts.load('700 32px Barlow')).length)).toBe(1);
  for (const route of ['buyer-home', 'buyer-suppliers', 'buyer-demands', 'buyer-proposals', 'buyer-orders', 'buyer-reviews', 'buyer-conversations', 'context']) {
    await expect(shell.locator(`[data-navigation-list] a[data-route-id="${route}"] svg.ui-icon`)).toBeVisible();
  }
  const fontSize = await title.evaluate(node => getComputedStyle(node).fontSize);
  const tabs = {
    fornecedores: ['.marketplace-page', '.marketplace-search'],
    demandas: ['[data-operation-section="demands"]', '.workflow-panel', '.workflow-metric'],
    propostas: ['[data-operation-section="proposals"]', '.workflow-panel', '.workflow-metric'],
    pedidos: ['[data-operation-section="orders"]', '.workflow-panel', '.workflow-metric'],
    avaliacoes: ['.reviews-page', '.reviews-pending', '.reviews-metric'],
    contexto: ['.context-page', '.context-companies'],
  };
  const secondaryText = {
    fornecedores: '.marketplace-search select',
    demandas: '.workflow-toolbar label',
    propostas: '.workflow-section-heading button',
    pedidos: '.workflow-toolbar label',
    avaliacoes: '.reviews-link',
    contexto: '.context-company button',
  };
  for (const [slug, [section, panelSelector, metricSelector]] of Object.entries(tabs)) {
    await shell.locator(`[data-navigation-list] a[href$="/${slug}"]`).click();
    const heading = shell.locator(`${section} [data-page-title]`);
    await expect(heading).toHaveCSS('font-size', fontSize);
    await expect(heading).toHaveCSS('font-family', /^Barlow,/);
    await expect(heading).toHaveCSS('font-weight', '700');
    const panel = shell.locator(`${section} ${panelSelector}`).first();
    await expect(panel).toHaveCSS('background-color', panelColor);
    await expect(panel).toHaveCSS('border-radius', '12px');
    await expect(panel.locator('h2').first()).toHaveCSS('font-weight', '600');
    await expect(shell.locator(secondaryText[slug]).first()).toHaveCSS('font-weight', '400');
    if (metricSelector) {
      const metric = shell.locator(`${section} ${metricSelector}`).first();
      await expect(metric).toHaveCSS('border-right-width', '0px');
      await expect(metric.locator('strong').first()).toHaveCSS('font-size', metricSize);
      await expect(metric.locator('strong').first()).toHaveCSS('font-weight', '700');
    }
    await expect(page).toHaveURL(new RegExp(`/${slug}$`));
  }
  await page.goto('/tests/fixtures/workspace-preview.html?role=buyer#/app/comprador/propostas');
  await expect(shell.getByRole('link', { name: 'Ver requisitos da demanda' }).first()).toHaveCSS('font-weight', '400');
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/tests/fixtures/workspace-preview.html?role=buyer#/app/comprador/fornecedores');
  await expect(shell.locator('.marketplace-page [data-page-title]')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/tests/fixtures/workspace-preview.html?role=buyer#/app/comprador/inicio');
  await expect(shell).toHaveCSS('background-color', 'rgb(234, 236, 240)');
});

const tabPaths = ['comprador/fornecedores', 'comprador/demandas', 'comprador/propostas', 'comprador/pedidos', 'comprador/avaliacoes', 'contexto'];
const preview = (path, state = 'normal') => `/tests/fixtures/workspace-preview.html?role=buyer&state=${state}#/app/${path}`;

test('buyer layouts stack at narrow widths and place controls inside their panels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(preview('comprador/inicio'));
  const overview = await page.locator('.buyer-overview__hero').boundingBox();
  for (const path of tabPaths) {
    await page.goto(preview(path));
    const header = page.locator('.workspace-page__header');
    await expect(header).toBeVisible();
    const bounds = await header.boundingBox();
    expect(bounds.x).toBeCloseTo(overview.x, 0);
    expect(bounds.y).toBeCloseTo(overview.y, 0);
    expect(bounds.width).toBeCloseTo(overview.width, 0);
    const split = page.locator('.workspace-page__split');
    if (path.endsWith('fornecedores')) {
      await expect(page.getByRole('tab', { name: 'Catálogo' })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByRole('combobox', { name: 'Filtrar por processo' })).toBeVisible();
    } else if (path.endsWith('avaliacoes')) {
      expect(await split.evaluate(node => node.children[1].offsetLeft > node.children[0].offsetLeft)).toBe(true);
      await expect(page.getByLabel('Buscar avaliações')).toBeVisible();
    } else if (path.endsWith('propostas') || path.endsWith('pedidos')) {
      const status = await page.getByRole('combobox', { name: 'Situação' }).boundingBox();
      const sort = await page.getByRole('combobox', { name: 'Ordenar por' }).boundingBox();
      expect(sort.x).toBeGreaterThan(status.x);
      expect(sort.y).toBeCloseTo(status.y, 0);
    }
    await page.setViewportSize({ width: 360, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.evaluate(() => { document.documentElement.dataset.textSize = 'large'; });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    if (await split.count()) {
      expect(await split.evaluate(node => node.children[1].offsetTop > node.children[0].offsetTop)).toBe(true);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
  }
});

test('buyer pages render empty and failed lookups and context can recover', async ({ page }) => {
  const emptyMessages = [
    'Nenhum fornecedor disponível no diretório.', 'Nenhuma demanda cadastrada', 'Nenhuma negociação disponível',
    'Nenhum pedido registrado', 'Nenhum pedido entregue aguarda avaliação.', 'Sua conta ainda não está vinculada a uma empresa.',
  ];
  for (const [index, path] of tabPaths.entries()) {
    await page.goto(preview(path, 'empty'));
    await expect(page.getByText(emptyMessages[index], { exact: false }).first()).toBeVisible();
    await page.goto(preview(path, 'error'));
    await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
    if (path === 'contexto') {
      await page.getByRole('button', { name: 'Tentar novamente' }).click();
      await expect(page.getByRole('heading', { name: 'Empresas vinculadas' })).toBeVisible();
    }
  }
});

test('directory, demand shortcut and company actions are reachable in the redesigned pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(preview('comprador/fornecedores'));
  const directory = page.getByRole('tabpanel', { name: 'Catálogo' });
  const search = directory.getByRole('searchbox', { name: 'Buscar fornecedores' });
  await search.fill('inexistente');
  await expect(directory.getByText('0 fornecedores encontrados')).toBeVisible();
  await directory.getByRole('button', { name: 'Limpar filtros' }).click();
  await directory.getByRole('link', { name: /Ver perfil de/ }).click();
  await expect(page.getByRole('heading', { name: 'Vetor Componentes Industriais', level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar para fornecedores' }).click();
  await expect(directory.getByRole('combobox', { name: 'Filtrar por processo' })).toBeVisible();
  await directory.getByRole('combobox', { name: 'Filtrar por processo' }).selectOption('usinagem CNC');
  await expect(directory.getByText('Mais filtros (1)', { exact: true })).toBeVisible();

  await page.goto(preview('comprador/inicio'));
  await page.getByRole('link', { name: 'Criar nova demanda', exact: false }).click();
  const create = page.getByRole('button', { name: 'Criar nova demanda', exact: true });
  await expect(create).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nova-demanda form')).toBeVisible();
  await create.click();
  await expect(page.locator('#nova-demanda form')).toBeHidden();
  await create.click();
  await expect(page.getByRole('heading', { name: 'Nova demanda', exact: true })).toBeFocused();

  await page.goto(preview('contexto'));
  const inspect = page.getByRole('button', { name: /Consultar cadastro/ }).first();
  await inspect.click();
  await expect(page.locator('.application-detail')).toBeVisible();
  await page.getByRole('button', { name: 'Fechar cadastro' }).click();
  await expect(inspect).toBeFocused();
  await page.getByRole('button', { name: 'Cadastrar empresa' }).click();
  await expect(page.locator('.application-form')).toBeVisible();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await page.getByRole('button', { name: /Entrar como fornecedor/ }).first().click();
  await expect(page).toHaveURL(/\/app\/fornecedor\/inicio$/);

  await page.setViewportSize({ width: 390, height: 820 });
  await page.goto(preview('comprador/fornecedores'));
  await expect(page.getByRole('tab', { name: 'Matches' })).toBeVisible();
  await expect(directory.getByRole('combobox', { name: 'Filtrar por processo' })).toBeHidden();
  await directory.getByText('Mais filtros', { exact: true }).click();
  await expect(directory.getByRole('combobox', { name: 'Filtrar por processo' })).toBeVisible();
});

test('buyer can save a draft, accept a proposal and submit a review from the new layouts', async ({ page }) => {
  await page.goto(preview('comprador/demandas?nova=1'));
  const form = page.locator('#nova-demanda form');
  await form.getByLabel('Título da demanda').fill('Reposição de componentes');
  await form.getByLabel('Objetivo e observações').fill('Reposição programada da linha de usinagem.');
  const deadline = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);
  await form.getByLabel('Prazo solicitado').fill(deadline);
  await form.getByLabel('Destino de entrega').fill('Campinas/SP');
  await form.getByLabel('Região atendida').fill('SP');
  const item = form.locator('[data-demand-item]').first();
  await item.getByLabel('Descrição do item').fill('Engrenagem para reposição');
  await item.getByLabel('Categoria', { exact: true }).fill('usinados');
  await item.getByLabel('Material', { exact: true }).fill('aço');
  await item.getByLabel('Processo necessário').fill('usinagem');
  await item.getByLabel('Quantidade', { exact: true }).fill('10');
  await form.getByRole('button', { name: 'Salvar rascunho', exact: true }).click();
  const draft = page.locator('.workflow-demand').filter({ has: page.getByRole('heading', { name: 'Reposição de componentes' }) });
  await expect(draft).toBeVisible();
  await draft.getByText('Editar rascunho', { exact: true }).click();
  await expect(draft.getByLabel('Título da demanda')).toHaveValue('Reposição de componentes');

  await page.goto(preview('comprador/propostas'));
  const accept = page.getByRole('button', { name: 'Aceitar versão e gerar pedido' }).first();
  const negotiation = accept.locator('xpath=ancestor::article[contains(@class,"workflow-negotiation")]');
  const title = await negotiation.locator('h3').first().innerText();
  page.once('dialog', dialog => dialog.accept());
  await accept.click();
  const orderLink = page.locator('.workflow-negotiation').filter({ has: page.getByRole('heading', { name: title, exact: true }) })
    .getByRole('link', { name: 'Acompanhar pedido' });
  await orderLink.click();
  const order = page.locator('.workflow-order');
  await expect(order.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(order.getByText('Próximo passo')).toBeVisible();
  await order.getByText('Ver detalhes e histórico do pedido').click();
  await expect(order.getByText('Prazo contratado:', { exact: true })).toBeVisible();

  await page.goto(preview('comprador/avaliacoes'));
  const review = page.locator('.reviews-form');
  for (const criterion of await review.locator('fieldset').all()) {
    await criterion.locator('label').last().click();
  }
  await review.getByLabel('Comentário opcional').fill('Entrega conferida no recebimento.');
  await review.getByRole('button', { name: 'Enviar avaliação' }).click();
  await expect(page.getByText('Avaliação enviada e vinculada ao pedido.')).toBeVisible();
  await page.getByRole('button', { name: 'Ver detalhes' }).click();
  await expect(page.getByRole('dialog', { name: 'Avaliação de Vetor Componentes Industriais' })).toContainText('Entrega conferida no recebimento.');
});

test('mobile review links never select a different order and the history can be opened separately', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 820 });
  await page.goto(preview('comprador/avaliacoes?registro=pedido-inexistente'));
  await expect(page.getByRole('status')).toContainText('O pedido deste link não está disponível');
  await expect(page.getByRole('button', { name: 'Enviar avaliação' })).toHaveCount(0);
  await expect(page.getByLabel('Buscar avaliações')).toBeHidden();
  await page.locator('.reviews-history__heading').click();
  await expect(page.getByLabel('Buscar avaliações')).toBeVisible();
  await page.getByRole('button', { name: 'Avaliar pedido', exact: true }).last().click();
  await expect(page.getByRole('heading', { name: 'Avaliar entrega' })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Avaliar pedido', exact: true }).last()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Buscar avaliações')).toBeVisible();
});

test('narrow collections give each filter full width and keep comparison labels visible', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 820 });
    for (const path of ['comprador/propostas', 'comprador/pedidos']) {
      await page.goto(preview(path));
      const status = await page.getByRole('combobox', { name: 'Situação' }).boundingBox();
      const sort = await page.getByRole('combobox', { name: 'Ordenar por' }).boundingBox();
      expect(sort.x).toBeCloseTo(status.x, 0);
      expect(sort.y).toBeGreaterThan(status.y + status.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (path.endsWith('propostas')) {
        const comparison = page.locator('.workflow-comparison').first();
        const headings = await comparison.evaluate(node => {
          const label = node.querySelector('tbody th');
          const before = label.getBoundingClientRect().left;
          node.scrollLeft = 140;
          return { before, after: label.getBoundingClientRect().left, scroll: node.scrollLeft };
        });
        expect(headings.scroll).toBeGreaterThan(0);
        expect(headings.after).toBeCloseTo(headings.before, 0);
      }
    }
  }
});

test('record links keep the company-wide KPI numbers in the buyer workspace', async ({ page }) => {
  for (const path of ['comprador/demandas', 'comprador/propostas', 'comprador/pedidos']) {
    await page.goto(preview(path));
    const metrics = page.locator('.workflow-metric strong');
    await expect(metrics).toHaveCount(3);
    const original = await metrics.allTextContents();
    const id = (await page.locator('.workflow-record__identity .workflow-reference').first().innerText()).replace(/^Referência: /, '');
    await page.goto(preview(`${path}?registro=${encodeURIComponent(id)}`));
    await expect(page.getByRole('link', { name: /Ver lista completa/ })).toBeVisible();
    await expect(metrics).toHaveText(original);
  }
});

test('overview shows six legible date ticks on a 320px viewport with enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(preview('comprador/inicio'));
  await page.locator('.workspace-insights__columns button').first().waitFor();
  await page.evaluate(async () => { document.documentElement.dataset.textSize = 'large'; await document.fonts.ready; });
  const ticks = await page.locator('.workspace-insights__columns button > span:last-child').evaluateAll(nodes => nodes.map(node => {
    const range = document.createRange();
    range.selectNodeContents(node);
    const boxes = range.getClientRects();
    return { lines: boxes.length, left: boxes[0].left, right: boxes[0].right };
  }));
  expect(ticks).toHaveLength(6);
  ticks.forEach((tick, index) => {
    expect(tick.lines).toBe(1);
    if (index) expect(tick.left).toBeGreaterThanOrEqual(ticks[index - 1].right);
  });
});

test('workspace analytics explains empty activity without invented growth', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tests/fixtures/component-lab.html');
  await page.evaluate(async () => {
    const { mountWorkspaceAnalytics } = await import('/src/generated/public/entry.js');
    mountWorkspaceAnalytics(document.querySelector('[data-app-outlet]'), { records: {}, role: 'supplier' });
  });
  await expect(page.locator('[data-insight-total]')).toHaveAccessibleName('propostas enviadas: 0');
  await expect(page.getByText('Nenhuma criação registrada neste período.')).toBeVisible();
  await expect(page.getByText('Seus pedidos aparecerão aqui após o aceite.')).toBeVisible();
  await expect(page.getByRole('group', { name: 'Criações por intervalo' })).toHaveCount(0);
  await expect(page.getByRole('list', { name: 'Pedidos por status' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Ver oportunidades', exact: true })).toHaveAttribute('href', '#/app/fornecedor/oportunidades');
});

test('workspace redesign preserves larger text and inherited color-vision alternatives', async ({ page }) => {
  await page.goto('/tests/fixtures/workspace-preview.html?role=buyer#/app/comprador/inicio');
  await expect(page.locator('[data-workspace-insights]')).toBeVisible();
  const read = () => page.evaluate(() => ({ title: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize), nav: parseFloat(getComputedStyle(document.querySelector('.app-shell__nav a')).fontSize), success: getComputedStyle(document.querySelector('.app-shell')).getPropertyValue('--feedback-success').trim() }));
  const standard = await read();
  await page.evaluate(() => { document.documentElement.dataset.textSize='large'; document.documentElement.dataset.colorVision='redGreen'; });
  const accessible = await read();
  expect(accessible.title).toBeGreaterThan(standard.title * 1.2);
  expect(accessible.nav).toBeGreaterThan(standard.nav * 1.2);
  expect(accessible.success).not.toBe(standard.success);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
