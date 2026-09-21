import { expect, test } from "@playwright/test";

test("renders explicit demo context and persists theme", async ({ page }) => {
  await page.goto("/tests/fixtures/component-lab.html");
  await expect(page.locator("[data-component-lab]")).toHaveAttribute("data-ready", "true");
  await expect(page.getByText("Ambiente demonstrativo", { exact: true })).toHaveCount(1);
  await expect(page.locator("[data-app-sidebar]")).toBeVisible();
  await expect(page.locator("[data-notifications]")).toHaveCount(0);
  await page.locator("[data-account-menu] summary").click();
  await expect(page.locator("[data-logout]")).toBeVisible();
  await page.locator("[data-theme-toggle]").click();
  const selectedTheme = await page.locator("html").getAttribute("data-theme");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", selectedTheme);
});

test("mobile drawer traps focus, closes with Escape and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/tests/fixtures/component-lab.html");
  const trigger = page.locator("[data-drawer-trigger]");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("[data-app-sidebar]")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBe(360);
  expect((await trigger.boundingBox()).height).toBeGreaterThanOrEqual(44);
});

test("mobile drawer keeps closed navigation out of the tab order", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/tests/fixtures/component-lab.html");
  const sidebar = page.locator("[data-app-sidebar]");
  const trigger = page.locator("[data-drawer-trigger]");

  expect(await sidebar.evaluate((element) => element.inert)).toBe(true);
  await trigger.click();
  expect(await sidebar.evaluate((element) => element.inert)).toBe(false);
  expect(await page.locator("[data-navigation-list] a").evaluate((element) => element === document.activeElement)).toBe(true);
  await page.keyboard.press("Tab");
  expect(await page.locator("[data-change-context-compact]").evaluate((element) => element === document.activeElement)).toBe(true);
  await page.keyboard.press("Tab");
  expect(await page.locator("[data-navigation-list] a").evaluate((element) => element === document.activeElement)).toBe(true);
});

test("selects an explicit workspace without claiming real permission", async ({ page }) => {
  await page.goto("/tests/fixtures/component-lab.html");
  await page.getByRole("button", { name: /Vetor Componentes Industriais/ }).click();
  await expect(page.locator("[data-component-lab]")).toHaveAttribute(
    "data-selected-workspace",
    "workspace-supplier-vetor",
  );
  await expect(page.getByText(/não equivale a autorização real/i)).toBeVisible();
});

test("keyboard and pointer targets meet the minimum target size", async ({ page }) => {
  await page.goto("/tests/fixtures/component-lab.html");
  await page.keyboard.press("Tab");
  const skipLink = page.locator(".app-shell__skip");
  await expect(skipLink).toBeFocused();
  expect((await skipLink.boundingBox()).height).toBeGreaterThanOrEqual(44);

  const targets = page.locator(".app-shell__actions button, .app-shell__account summary, .context-card");
  for (let index = 0; index < await targets.count(); index += 1) {
    expect((await targets.nth(index).boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
});

test("focused skip link leaves the compact menu target reachable", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/tests/fixtures/component-lab.html");
  await page.keyboard.press("Tab");

  const overlapsMenu = await page.evaluate(() => {
    const skip = document.querySelector(".app-shell__skip").getBoundingClientRect();
    const trigger = document.querySelector("[data-drawer-trigger]").getBoundingClientRect();
    return skip.left < trigger.right
      && skip.right > trigger.left
      && skip.top < trigger.bottom
      && skip.bottom > trigger.top;
  });
  expect(overlapsMenu).toBe(false);
  await page.locator("[data-drawer-trigger]").click();
  await expect(page.locator("[data-drawer-trigger]")).toHaveAttribute("aria-expanded", "true");
});

test("mobile drawer isolates the skip link and restores it after closing", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/tests/fixtures/component-lab.html");
  const skipLink = page.locator(".app-shell__skip");

  await page.locator("[data-drawer-trigger]").click();
  expect(await skipLink.evaluate((element) => element.inert)).toBe(true);
  await expect(skipLink).toHaveCSS("pointer-events", "none");
  await page.keyboard.press("Escape");
  expect(await skipLink.evaluate((element) => element.inert)).toBe(false);
  await expect(skipLink).toHaveCSS("pointer-events", "auto");
});

test("mobile navigation closes the drawer without leaving focus inert", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/tests/fixtures/component-lab.html");
  const trigger = page.locator("[data-drawer-trigger]");

  await trigger.click();
  await page.locator("[data-navigation-list] a").click();
  await expect(page.locator("[data-component-lab]")).toHaveAttribute("data-navigated-to", "/app/contexto");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  expect(await page.locator("[data-app-sidebar]").evaluate((element) => element.contains(document.activeElement))).toBe(false);
});

test("compact drawer exposes a distinct context change action", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/tests/fixtures/component-lab.html");
  const trigger = page.locator("[data-drawer-trigger]");

  await trigger.click();
  const contextAction = page.locator("[data-change-context-compact]");
  await expect(contextAction).toBeVisible();
  await expect(page.locator("[data-navigation-list] [data-change-context-compact]")).toHaveCount(0);
  await contextAction.click();
  await expect(page.locator("[data-component-lab]")).toHaveAttribute("data-context-requested", "true");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("component lab labels the injected account as demonstrative", async ({ page }) => {
  await page.goto("/tests/fixtures/component-lab.html");
  await page.locator("[data-account-menu] summary").click();
  const accountMenu = page.locator("[data-account-menu]");

  await expect(accountMenu.getByText("Conta de teste", { exact: true })).toBeVisible();
  await expect(accountMenu.getByText("Conta autenticada", { exact: true })).toHaveCount(0);
});
