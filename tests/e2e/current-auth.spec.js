import { expect, test } from "@playwright/test";

test("loads the access UI with the local auth boundary", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (new URL(response.url()).origin === "http://127.0.0.1:4173" && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/?authEmulator=1#/acesso");
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-ui-ready", "true");
  await expect(page.locator("[data-provider='google']")).toHaveCount(2);
  await expect(page.locator("[data-provider='github']")).toHaveCount(2);
  await expect(page.locator("html")).toHaveAttribute("data-theme-ready", "true");
  await page.locator("[data-switch-mode='login']").click();
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-mode", "login");
  await expect(page.locator("#login-form input")).toHaveCount(2);
  await page.locator("[data-switch-mode='register']").click();
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-mode", "register");
  await expect(page.locator("#confirm-password")).toBeVisible();
  expect(errors).toEqual([]);
});

test("initializes and updates theme toggles added after startup", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("sivi.theme.v1", "dark");
  });

  await page.goto("/?authEmulator=1#/acesso");
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

  await page.locator("[data-theme-toggle]").first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(dynamicToggle).toHaveAttribute("aria-label", "Ativar tema escuro");
  await expect(dynamicToggle).toHaveAttribute("title", "Ativar tema escuro");
  await expect(dynamicToggle).toHaveAttribute("data-next-theme", "dark");
});
