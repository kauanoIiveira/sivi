import { expect, test } from "@playwright/test";
import { createVerifiedUser, resetAuthEmulator } from "../helpers/auth-emulator.js";

test("logs in with a verified emulator account", async ({ page }) => {
  const productionDatabaseRequests = [];
  page.on("request", (request) => {
    if (new URL(request.url()).hostname === "sivi-org-default-rtdb.firebaseio.com") {
      productionDatabaseRequests.push(request.url());
    }
  });
  await resetAuthEmulator();
  await createVerifiedUser({
    email: "comprador@sivi.demo",
    password: "SiviDemo2026",
    displayName: "Comprador Demo",
  });

  await page.goto("/?authEmulator=1#/acesso");
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-ui-ready", "true");
  await page.locator("[data-switch-mode='login']").click();
  await expect(page.locator("#login-email")).toBeVisible();
  await page.locator("#login-email").fill("comprador@sivi.demo");
  await page.locator("#login-password").fill("SiviDemo2026");
  await page.locator("#login-form button[type='submit']").click();
  await expect(page.getByRole("heading", { name: /Qual empresa você vai usar/ })).toBeVisible();
  expect(productionDatabaseRequests).toEqual([]);
});

test("registers with password confirmation and signs the initial session out", async ({ page }) => {
  await resetAuthEmulator();
  await page.goto("/?authEmulator=1#/acesso");
  await page.locator("#first-name").fill("Cadastro");
  await page.locator("#last-name").fill("Demo");
  await page.locator("#register-email").fill("cadastro@sivi.demo");
  await page.locator("#register-password").fill("SiviDemo2026");
  await page.locator("#confirm-password").fill("SiviDemo2026");
  await page.locator("#register-form button[type='submit']").click();
  await expect(page).toHaveURL(/#\/acesso$/);
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-ui-ready", "true");
  await expect(page.locator("#register-form button[type='submit']")).toHaveText("Criar conta");

  const signIn = await page.request.post(
    "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key",
    { data: { email: "cadastro@sivi.demo", password: "SiviDemo2026", returnSecureToken: true } },
  );
  expect(signIn.ok()).toBe(true);
  expect((await signIn.json()).email).toBe("cadastro@sivi.demo");
});
