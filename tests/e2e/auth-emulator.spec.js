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
  await page.evaluate(() => {
    window.seenAppDuringRegistration = false;
    window.registrationObserver = new MutationObserver(() => { if (document.body.dataset.surface === 'app') window.seenAppDuringRegistration = true; });
    window.registrationObserver.observe(document.body, { attributes: true, attributeFilter: ['data-surface'] });
  });
  await page.locator("#first-name").fill("Cadastro");
  await page.locator("#last-name").fill("Demo");
  await page.locator("#register-email").fill("cadastro@sivi.demo");
  await page.locator("#register-password").fill("SiviDemo2026");
  await page.locator("#confirm-password").fill("SiviDemo2026");
  await page.locator("#register-form button[type='submit']").click();
  await page.getByLabel('Nome da empresa', {exact:true}).fill('Empresa Cadastro');
  await page.getByLabel('CNPJ', {exact:true}).fill('12345678000190');
  await page.getByLabel('Cidade', {exact:true}).fill('São Paulo');
  await page.getByLabel('Telefone ou e-mail de contato').fill('cadastro@example.com');
  await page.getByRole('button', {name:'Revisar e continuar'}).click();
  await page.getByRole('button', {name:'Preencher dados de teste'}).click();
  await page.getByLabel(/Entendi que o pagamento é demonstrativo/).check();
  await page.getByRole('button', {name:'Criar conta sem cobrança'}).click();
  await expect(page).toHaveURL(/#\/acesso$/);
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-ui-ready", "true");
  await expect(page.getByRole('heading',{name:'Sua conta foi criada.'})).toBeVisible();
  expect(await page.evaluate(() => window.seenAppDuringRegistration)).toBe(false);

  const signIn = await page.request.post(
    "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key",
    { data: { email: "cadastro@sivi.demo", password: "SiviDemo2026", returnSecureToken: true } },
  );
  expect(signIn.ok()).toBe(true);
  expect((await signIn.json()).email).toBe("cadastro@sivi.demo");
  await page.getByRole('link', {name:'Ir para entrar'}).click();
  await page.locator('#login-email').fill('cadastro@sivi.demo');
  await page.locator('#login-password').fill('SiviDemo2026');
  await page.locator('#login-form button[type=submit]').click();
  await expect(page.locator('[data-status="login"]')).toContainText(/verific|confirme/i);
  await expect(page.locator('[data-auth-surface]')).toBeVisible();
});
