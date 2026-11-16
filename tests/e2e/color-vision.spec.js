import { expect, test } from '@playwright/test';

const modes = ['redGreen', 'blueYellow'];

function luminance(color) {
  const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => {
    const channel = value / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}

function contrast(first, second) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + .05) / (darker + .05);
}

async function mountSemanticFixture(page, theme = 'light') {
  await page.route('**/tests/fixtures/color-vision-lab.html', route => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><html lang="pt-BR" data-theme="light"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Contraste dos estados SIVI</title></head><body data-surface="app"><main data-app-outlet style="max-width:1320px;margin:auto;padding:16px"></main></body></html>',
  }));
  await page.goto('/tests/fixtures/color-vision-lab.html');
  for (const path of [
    '/src/styles/theme-tokens.css', '/src/styles/global.css',
    '/src/pages/dashboard/buyer-overview-page.css', '/src/pages/buyer/suppliers-page.css',
    '/src/pages/buyer/reviews-page.css', '/src/pages/operations/operations-page.css',
    '/src/visualizations/industrial-rail/industrial-rail.css', '/src/styles/dark-components.css',
    '/src/styles/workspace-palette.css', '/src/theme/color-vision.css',
  ]) await page.addStyleTag({ url: path });
  await page.evaluate(async currentTheme => {
    document.documentElement.dataset.theme = currentTheme;
    document.documentElement.dataset.colorVision = 'standard';
    const outlet = document.querySelector('[data-app-outlet]');
    outlet.innerHTML = `<section data-color-fixture style="background:var(--surface);padding:16px">
      <img data-color-brand src="/src/assets/brand/raposa.svg" alt="Raposa SIVI" width="40" height="40">
      <section class="operations-page">
        <p class="workflow-feedback" data-tone="success">✓ Alterações salvas.</p>
        <p class="workflow-feedback" data-tone="warning">! Revisão necessária.</p>
        <p class="workflow-feedback" data-tone="error">Não foi possível salvar. Tente novamente.</p>
        <span class="workflow-state" data-state="delivered">Recebido</span>
        <span class="workflow-state" data-state="blocked">Bloqueado</span>
      </section>
      <section class="buyer-overview">
        <span class="buyer-badge buyer-badge--blue">Publicada</span>
        <span class="buyer-badge buyer-badge--green">Pedido criado</span>
        <span class="buyer-badge buyer-badge--amber">Rascunho</span>
        <a class="buyer-alert buyer-alert--amber"><span class="buyer-alert__icon">!</span><strong>Inspeção pendente</strong><small>Confira o pedido.</small></a>
        <a class="buyer-alert buyer-alert--blue"><span class="buyer-alert__icon">→</span><strong>Nova proposta</strong><small>Comparar condições.</small></a>
        <div class="buyer-supplier-card__approved"><strong>Fornecedor aprovado</strong><small>Atende aos critérios.</small></div>
      </section>
      <section class="marketplace-page">
        <p class="marketplace-feedback" data-state="success">Convite enviado.</p>
        <p class="marketplace-feedback" data-state="error">Não foi possível enviar o convite.</p>
        <span class="marketplace-badge" data-match-status="compatible">Compatível</span>
        <span class="marketplace-criterion__state marketplace-criterion__state--met">Atende</span>
        <span class="marketplace-criterion__state marketplace-criterion__state--unmet">Não atende</span>
        <span class="marketplace-criterion__state marketplace-criterion__state--unknown">Não informado</span>
      </section>
      <section class="reviews-page">
        <p class="reviews-feedback" data-state="success">Avaliação salva.</p>
        <p class="reviews-feedback" data-state="error">Não foi possível salvar a avaliação.</p>
        <div class="reviews-metric reviews-metric--pending"><span class="reviews-metric__icon">!</span><small>Avaliações pendentes</small></div>
        <section class="reviews-panel reviews-table-panel"><div class="reviews-table-wrap"><table class="reviews-table"><tbody><tr><td><small class="reviews-success">Avaliado</small></td></tr></tbody></table></div></section>
      </section>
      <div data-color-rail></div>
    </section>`;
    const { mountIndustrialRail } = await import('/src/visualizations/industrial-rail/industrial-rail.js');
    mountIndustrialRail(outlet.querySelector('[data-color-rail]'), [
      { id: 'demand', label: 'Demanda', status: 'completed', summary: 'Demanda publicada.', evidenceIds: [] },
      { id: 'proposals', label: 'Propostas', status: 'active', summary: 'Em negociação.', evidenceIds: [] },
      { id: 'inspection', label: 'Inspeção', status: 'attention', summary: 'Revisão pendente.', evidenceIds: [] },
      { id: 'dispatch', label: 'Expedição', status: 'locked', summary: 'Aguarda inspeção.', evidenceIds: [] },
    ]);
  }, theme);
}

async function appearanceSnapshot(page) {
  return page.locator('[data-color-fixture]').evaluate(container => {
    const selectors = [
      '.workflow-feedback', '.workflow-state', '.buyer-badge', '.buyer-alert',
      '.buyer-alert small', '.buyer-supplier-card__approved strong', '.marketplace-feedback',
      '.marketplace-badge', '.marketplace-criterion__state', '.reviews-feedback',
      '.reviews-metric--pending small', '.reviews-success', '.industrial-rail__disc',
    ];
    return [...container.querySelectorAll(selectors.join(','))].map(node => {
      const style = getComputedStyle(node);
      return { text: node.textContent, color: style.color, background: style.backgroundColor, fill: style.fill, stroke: style.stroke };
    });
  });
}

for (const theme of ['light', 'dark']) for (const mode of modes) {
  test(`${mode} keeps semantic status text and indicators legible in ${theme}`, async ({ page }) => {
    await mountSemanticFixture(page, theme);
    const markup = await page.locator('[data-color-fixture]').innerHTML();
    await page.evaluate(value => { document.documentElement.dataset.colorVision = value; }, mode);
    const colors = await page.evaluate(() => {
      const pairs = [
        ['success', '.workflow-feedback[data-tone=success]'],
        ['warning', '.workflow-feedback[data-tone=warning]'],
        ['danger', '.workflow-feedback[data-tone=error]'],
        ['info', '.buyer-badge--blue'],
      ].map(([state, selector]) => {
        const style = getComputedStyle(document.querySelector(selector));
        return { state, foreground: style.color, background: style.backgroundColor };
      });
      const surface = getComputedStyle(document.querySelector('[data-color-fixture]')).backgroundColor;
      const rails = [...document.querySelectorAll('.industrial-rail__node:is(.industrial-rail__node--completed, .industrial-rail__node--active, .industrial-rail__node--attention)')].map(node => {
        const disc = getComputedStyle(node.querySelector('.industrial-rail__disc'));
        const glyph = getComputedStyle(node.querySelector('.industrial-rail__glyph'));
        return { fill: disc.fill, stroke: disc.stroke, glyph: glyph.fill };
      });
      const literals = ['.marketplace-feedback[data-state=success]', '.reviews-feedback[data-state=success]', '.buyer-badge--green', '.marketplace-criterion__state--met', '.marketplace-badge', '.buyer-supplier-card__approved'];
      return { pairs, surface, rails, literals: literals.map(selector => {
        const style = getComputedStyle(document.querySelector(selector));
        return { selector, foreground: style.color, background: style.backgroundColor };
      }) };
    });
    expect(new Set(colors.pairs.map(pair => pair.foreground)).size).toBe(4);
    for (const pair of colors.pairs) {
      expect(contrast(pair.foreground, pair.background), `${pair.state} text`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(pair.foreground, colors.surface), `${pair.state} indicator`).toBeGreaterThanOrEqual(3);
    }
    const success = colors.pairs.find(pair => pair.state === 'success');
    for (const pair of colors.literals) {
      expect(pair.background, pair.selector).toBe(success.background);
      expect(pair.foreground, pair.selector).toBe(success.foreground);
    }
    for (const rail of colors.rails) {
      expect(contrast(rail.stroke, rail.fill)).toBeGreaterThanOrEqual(3);
      expect(contrast(rail.glyph, rail.fill)).toBeGreaterThanOrEqual(4.5);
    }
    expect(await page.locator('[data-color-fixture]').innerHTML()).toBe(markup);
    await expect(page.locator('[data-rail-legend-status=completed]')).toContainText('✓Concluída');
    await expect(page.locator('[data-rail-legend-status=attention]')).toContainText('!Requer atenção');
    await expect(page.locator('[data-rail-step=dispatch]')).toHaveAttribute('aria-label', /Bloqueada por dependência/);
    await page.locator('[data-rail-step=inspection]').click();
    await expect(page.locator('[data-rail-detail-status]')).toHaveText('! Requer atenção');
  });
}

test('color preferences preserve the original logo and have no effect outside the system', async ({ page }) => {
  await mountSemanticFixture(page);
  const logo = page.locator('[data-color-brand]');
  const source = await logo.getAttribute('src');
  for (const mode of modes) {
    await page.evaluate(value => { document.documentElement.dataset.colorVision = value; }, mode);
    expect(await logo.getAttribute('src')).toBe(source);
    expect(await logo.evaluate(node => {
      const filters = [];
      for (let current = node; current; current = current.parentElement) filters.push(getComputedStyle(current).filter);
      return filters;
    })).toEqual(expect.arrayContaining(['none']));
    expect(await logo.evaluate(node => {
      for (let current = node; current; current = current.parentElement) if (getComputedStyle(current).filter !== 'none') return false;
      return true;
    })).toBe(true);
  }
  for (const surface of ['public', 'auth']) {
    await page.evaluate(value => {
      document.body.dataset.surface = value;
      document.documentElement.dataset.colorVision = 'standard';
    }, surface);
    const baseline = await appearanceSnapshot(page);
    for (const mode of modes) {
      await page.evaluate(value => { document.documentElement.dataset.colorVision = value; }, mode);
      expect(await appearanceSnapshot(page)).toEqual(baseline);
    }
  }
});

test('changing color assistance keeps mobile layout and stage controls intact', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mountSemanticFixture(page);
  const before = await page.locator('[data-color-fixture]').boundingBox();
  for (const mode of modes) {
    await page.evaluate(value => { document.documentElement.dataset.colorVision = value; }, mode);
    expect(await page.locator('[data-color-fixture]').boundingBox()).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator('[data-rail-step]')).toHaveCount(4);
    await expect(page.locator('[data-rail-legend] li')).toHaveCount(6);
  }
});
