import { expect, test } from "@playwright/test";

test("loads the access UI with the local auth boundary", async ({ page, baseURL }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (new URL(response.url()).origin === new URL(baseURL).origin && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/?authEmulator=1#/acesso");
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-ui-ready", "true");
  await expect(page.locator("[data-provider='google']")).toHaveCount(0);
  await expect(page.locator("[data-provider='github']")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-theme-ready", "true");
  await page.locator("[data-switch-mode='login']").click();
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-mode", "login");
  await expect(page.locator("#login-form input")).toHaveCount(2);
  await expect(page.locator("[data-provider=google]")).toHaveCount(1);
  await expect(page.locator("[data-provider=github]")).toHaveCount(1);
  await page.locator("[data-switch-mode='register']").click();
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-mode", "register");
  await expect(page.locator("#confirm-password")).toBeVisible();
  expect(errors).toEqual([]);
});

test("initializes and updates theme toggles added after startup", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("sivi.theme.v1", "dark");
  });

  await page.goto('/tests/fixtures/component-lab.html');
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.evaluate(() => {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = "dynamic-theme-toggle";
    toggle.dataset.themeToggle = "";
    document.body.append(toggle);
  });

  const dynamicToggle = page.locator("#dynamic-theme-toggle");
  await expect(dynamicToggle).toHaveAttribute("aria-label", "Ativar tema claro");
  await expect(dynamicToggle).toHaveAttribute("title", "Ativar tema claro");
  await expect(dynamicToggle).toHaveAttribute("data-next-theme", "light");

  await page.locator('[data-app-sidebar] [data-open-preferences]').click();
  const preferences = page.getByRole('dialog', { name: 'Aparência e acessibilidade' });
  await preferences.getByLabel('Tema', { exact: true }).selectOption('light');
  await preferences.getByRole('button', { name: 'Fechar preferências' }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(dynamicToggle).toHaveAttribute("aria-label", "Ativar tema escuro");
  await expect(dynamicToggle).toHaveAttribute("title", "Ativar tema escuro");
  await expect(dynamicToggle).toHaveAttribute("data-next-theme", "dark");
});

test('public and access screens use light without replacing the workspace theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => window.localStorage.setItem('sivi.theme.v1', 'dark'));
  for (const path of ['/', '/acesso?modo=login', '/acesso?modo=register']) {
    await page.goto(`/?authEmulator=1#${path}`);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('[data-open-preferences]')).toHaveCount(0);
    expect(await page.evaluate(() => window.localStorage.getItem('sivi.theme.v1'))).toBe('dark');
  }
  await page.goto('/tests/fixtures/component-lab.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  for (const surface of ['auth', 'public', 'app']) {
    await page.evaluate(surface => { document.body.dataset.surface = surface; }, surface);
    await expect(page.locator('html')).toHaveAttribute('data-theme', surface === 'app' ? 'dark' : 'light');
  }
  expect(await page.evaluate(() => window.localStorage.getItem('sivi.theme.v1'))).toBe('dark');
});
