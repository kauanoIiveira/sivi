import { expect, test } from '@playwright/test';

const sdkURL = 'https://vlibras.gov.br/app/vlibras-plugin.js';
const appURL = 'https://vlibras.gov.br/app/vlibras-plugin-app.js';
const sdkStub = `
  window.sdkLoads = (window.sdkLoads || 0) + 1;
  window.VLibras = { Widget: function () {
    if (document.getElementById('vlibras-access-wrapper')) return;
    const wrapper = document.createElement('div'); wrapper.id = 'vlibras-access-wrapper';
    const shadow = wrapper.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<button type="button" id="vlibras-button">Abrir VLibras</button>';
    document.body.append(wrapper);
    const open = () => {
      const root = document.getElementById('vlibras-app-root');
      if (root) { root.dataset.active = 'true'; return; }
      const script = document.createElement('script'); script.src = '${appURL}';
      document.body.append(script);
    };
    shadow.querySelector('button').onclick = open;
    window.VLibrasWidget = { initBtn: shadow.querySelector('button'), open };
  }};
  setTimeout(() => new window.VLibras.Widget(), 50);
`;
const appStub = `
  const root = document.createElement('div'); root.id = 'vlibras-app-root'; root.dataset.active = 'true';
  root.attachShadow({mode: 'open'}).innerHTML = '<button type="button">Traduzir</button>';
  document.body.append(root);
  new MutationObserver(() => window.translationActive = root.dataset.active === 'true').observe(root, { attributes: true });
  window.translationActive = true;
`;

async function setup(page) {
  await page.route(sdkURL, route => route.fulfill({ contentType: 'application/javascript', body: sdkStub }));
  await page.route(appURL, route => route.fulfill({ contentType: 'application/javascript', body: appStub }));
  await page.goto('/tests/fixtures/vlibras-lab.html');
  await page.waitForFunction(() => Boolean(window.vlibrasTest));
}

test('VLibras is lazy and inactive on public/auth surfaces; one widget survives navigation', async ({ page }) => {
  await setup(page);
  await page.evaluate(() => window.vlibrasTest.setEnabled(true));
  await expect(page.locator('#vlibras-access-wrapper')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.vlibrasTest.getState().status)).toBe('off');
  await page.evaluate(() => window.vlibrasTest.setSurface('app'));
  await expect(page.getByRole('button', { name: 'Abrir VLibras' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.vlibrasTest.getState().status)).toBe('ready');
  await page.evaluate(() => window.vlibrasTest.setSurface('auth'));
  await expect(page.getByRole('button', { name: 'Abrir VLibras' })).toBeHidden();
  await page.evaluate(() => window.vlibrasTest.setSurface('app'));
  await expect(page.getByRole('button', { name: 'Abrir VLibras' })).toBeVisible();
  expect(await page.evaluate(() => window.sdkLoads)).toBe(1);
  await expect(page.locator('#vlibras-access-wrapper')).toHaveCount(1);
});

test('disabling closes translation and removes widget controls from interaction', async ({ page }) => {
  await setup(page);
  await page.evaluate(() => { window.vlibrasTest.setSurface('app'); window.vlibrasTest.setEnabled(true); });
  await page.getByRole('button', { name: 'Abrir VLibras' }).click();
  await expect(page.getByRole('button', { name: 'Traduzir' })).toBeVisible();
  await page.evaluate(() => window.vlibrasTest.setEnabled(false));
  await expect(page.locator('#vlibras-app-root')).toHaveAttribute('data-active', 'false');
  await expect(page.locator('#vlibras-app-root')).toHaveAttribute('inert', '');
  await expect(page.getByRole('button', { name: 'Traduzir' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Abrir VLibras' })).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.translationActive)).toBe(false);
});

test('late SDK loading cannot reactivate a disabled option', async ({ page }) => {
  let deliverSDK;
  await page.route(sdkURL, route => new Promise(resolve => { deliverSDK = async () => { await route.fulfill({ contentType: 'application/javascript', body: sdkStub }); resolve(); }; }));
  await page.goto('/tests/fixtures/vlibras-lab.html');
  await page.waitForFunction(() => Boolean(window.vlibrasTest));
  await page.evaluate(() => { window.vlibrasTest.setSurface('app'); window.vlibrasTest.setEnabled(true); });
  await expect.poll(() => Boolean(deliverSDK)).toBe(true);
  await page.evaluate(() => window.vlibrasTest.setEnabled(false));
  await deliverSDK();
  await expect(page.locator('#vlibras-access-wrapper')).toBeHidden();
  await expect.poll(() => page.evaluate(() => Boolean(window.VLibrasWidget))).toBe(true);
  expect(await page.evaluate(() => window.vlibrasTest.getState().status)).toBe('off');
  await page.evaluate(() => window.vlibrasTest.setEnabled(true));
  await expect(page.getByRole('button', { name: 'Abrir VLibras' })).toBeVisible();
  expect(await page.evaluate(() => window.sdkLoads)).toBe(1);
});

test('reenabling while the SDK is in flight reports loading and does not load it twice', async ({ page }) => {
  let deliverSDK;
  let requests = 0;
  await page.route(sdkURL, route => new Promise(resolve => { requests += 1; deliverSDK = async () => { await route.fulfill({ contentType: 'application/javascript', body: sdkStub }); resolve(); }; }));
  await page.goto('/tests/fixtures/vlibras-lab.html');
  await page.waitForFunction(() => Boolean(window.vlibrasTest));
  await page.evaluate(() => { window.vlibrasTest.setSurface('app'); window.vlibrasTest.setEnabled(true); });
  await expect.poll(() => Boolean(deliverSDK)).toBe(true);
  await page.evaluate(() => { window.vlibrasTest.setEnabled(false); window.vlibrasTest.setEnabled(true); });
  expect(await page.evaluate(() => window.vlibrasTest.getState().status)).toBe('loading');
  await deliverSDK();
  await expect(page.getByRole('button', { name: 'Abrir VLibras' })).toBeVisible();
  expect(requests).toBe(1);
  const count = await page.evaluate(() => window.vlibrasStates.length);
  await page.evaluate(() => { window.vlibrasTest.setEnabled(true); window.vlibrasTest.setSurface('app'); });
  expect(await page.evaluate(() => window.vlibrasStates.length)).toBe(count);
});

test('late translator loading is closed after leaving the system', async ({ page }) => {
  await setup(page);
  let deliverApp;
  await page.route(appURL, route => new Promise(resolve => { deliverApp = async () => { await route.fulfill({ contentType: 'application/javascript', body: appStub }); resolve(); }; }));
  await page.evaluate(() => { window.vlibrasTest.setSurface('app'); window.vlibrasTest.setEnabled(true); });
  await page.getByRole('button', { name: 'Abrir VLibras' }).click();
  await expect.poll(() => Boolean(deliverApp)).toBe(true);
  await page.evaluate(() => window.vlibrasTest.setSurface('public'));
  await deliverApp();
  await expect(page.locator('#vlibras-app-root')).toHaveAttribute('data-active', 'false');
  await expect(page.getByRole('button', { name: 'Traduzir' })).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.translationActive)).toBe(false);
});

test('network failure reports a retryable state without blocking the page', async ({ page }) => {
  await setup(page);
  await page.route(sdkURL, route => route.abort('failed'));
  await page.evaluate(() => { window.vlibrasTest.setSurface('app'); window.vlibrasTest.setEnabled(true); });
  await expect.poll(() => page.evaluate(() => window.vlibrasTest.getState().status)).toBe('error');
  await expect(page.getByRole('button', { name: 'Ativar VLibras' })).toBeEnabled();
  await page.route(sdkURL, route => route.fulfill({ contentType: 'application/javascript', body: sdkStub }));
  await page.evaluate(() => window.vlibrasTest.setEnabled(true));
  await expect(page.getByRole('button', { name: 'Abrir VLibras' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.vlibrasTest.getState().status)).toBe('ready');
});

test('a failed translator module retries without duplicating the SDK or controls', async ({ page }) => {
  await setup(page);
  await page.route(appURL, route => route.abort('failed'));
  await page.evaluate(() => { window.vlibrasTest.setSurface('app'); window.vlibrasTest.setEnabled(true); });
  await page.getByRole('button', { name: 'Abrir VLibras' }).click();
  await expect.poll(() => page.evaluate(() => window.vlibrasTest.getState().status)).toBe('error');
  await page.route(appURL, route => route.fulfill({ contentType: 'application/javascript', body: appStub }));
  await page.evaluate(() => { window.vlibrasTest.setEnabled(false); window.vlibrasTest.setEnabled(true); });
  await expect(page.getByRole('button', { name: 'Traduzir' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.vlibrasTest.getState().status)).toBe('ready');
  expect(await page.evaluate(() => window.sdkLoads)).toBe(1);
  await expect(page.locator('#vlibras-access-wrapper')).toHaveCount(1);
});

test('disposing during loading prevents delayed controls or callbacks', async ({ page }) => {
  let deliverSDK;
  await page.route(sdkURL, route => new Promise(resolve => { deliverSDK = async () => { await route.fulfill({ contentType: 'application/javascript', body: sdkStub }); resolve(); }; }));
  await page.goto('/tests/fixtures/vlibras-lab.html');
  await page.waitForFunction(() => Boolean(window.vlibrasTest));
  await page.evaluate(() => { window.vlibrasTest.setSurface('app'); window.vlibrasTest.setEnabled(true); });
  await expect.poll(() => Boolean(deliverSDK)).toBe(true);
  const callbackCount = await page.evaluate(() => { window.vlibrasTest.dispose(); return window.vlibrasStates.length; });
  await deliverSDK();
  await expect.poll(() => page.evaluate(() => Boolean(window.VLibrasWidget))).toBe(true);
  await expect(page.getByRole('button', { name: 'Abrir VLibras' })).toBeHidden();
  expect(await page.evaluate(() => window.vlibrasStates.length)).toBe(callbackCount);
});
