import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://127.0.0.1:4173" });

const profile = {
  categories: ["engrenagens"], materials: ["aço 1045"], processes: ["usinagem"],
  regions: ["Campinas/SP"], certifications: [], capacity: 800, leadTimeDays: 15,
  description: "Fabricação de componentes industriais sob desenho.",
};

async function mount(page, organizationName = "Fornecedor Exemplo") {
  await page.goto("/tests/fixtures/component-lab.html");
  await expect(page.locator("[data-component-lab]")).toHaveAttribute("data-ready", "true");
  await page.evaluate(async (name) => {
    const { mountSupplierProfilePage } = await import("/src/pages/supplier/profile-page.js");
    const container = document.querySelector("[data-component-lab]");
    const state = { reads: [], saves: [], ready: 0 };
    window.profileTest = state;
    state.dispose = mountSupplierProfilePage({
      container,
      workspace: { id: "supplier-example", organizationName: name },
      supplierProfiles: {
        getProfile: () => new Promise((resolve, reject) => state.reads.push({ resolve, reject })),
        saveProfile: (workspaceId, values) => new Promise((resolve, reject) => state.saves.push({ resolve, reject, workspaceId, values })),
      },
      onReady: () => { state.ready += 1; },
    });
  }, organizationName);
  return page.locator("[data-supplier-profile-form]");
}

async function finishLoading(page) {
  await page.evaluate((value) => window.profileTest.reads.at(-1).resolve(value), profile);
}

test("renders the company name as text and prevents editing or saving before the existing profile loads", async ({ page }) => {
  const name = '<img src=x onerror="window.profileNameExecuted=true">';
  const form = await mount(page, name);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(`Perfil industrial de ${name}`);
  await expect(page.locator(".supplier-profile img")).toHaveCount(0);
  await expect(form.locator("[name=categories]")).toBeDisabled();
  await expect(form.getByRole("button", { name: "Salvar perfil industrial" })).toBeDisabled();
  await form.evaluate((element) => element.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  expect(await page.evaluate(() => window.profileTest.saves.length)).toBe(0);
  await finishLoading(page);
  await expect(form.locator("[name=categories]")).toHaveValue("engrenagens");
  await expect(form.locator("[name=categories]")).toBeEnabled();
  expect(await page.evaluate(() => window.profileNameExecuted)).toBeUndefined();
});

test("keeps the form locked after a read failure and retries the read before permitting edits", async ({ page }) => {
  const form = await mount(page);
  await page.evaluate(() => window.profileTest.reads[0].reject(new Error("Falha de conexão.")));
  await expect(form.getByRole("status")).toContainText("Falha de conexão");
  await expect(form.locator("[name=categories]")).toBeDisabled();
  await form.evaluate((element) => element.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  expect(await page.evaluate(() => window.profileTest.saves.length)).toBe(0);
  await form.getByRole("button", { name: "Tentar novamente" }).click();
  expect(await page.evaluate(() => window.profileTest.reads.length)).toBe(2);
  await finishLoading(page);
  await expect(form.locator("[name=capacity]")).toHaveValue("800");
  await expect(form.getByRole("button", { name: "Salvar perfil industrial" })).toBeEnabled();
  await expect(form.getByRole("button", { name: "Tentar novamente" })).toBeHidden();
});

test("marks unsaved changes, locks every field during save and ignores duplicate submissions", async ({ page }) => {
  const form = await mount(page);
  await finishLoading(page);
  await form.locator("[name=categories]").fill("engrenagens, eixos");
  await expect(form).toHaveAttribute("data-dirty", "true");
  await form.getByRole("button", { name: "Salvar perfil industrial" }).click();
  await expect(form).toHaveAttribute("aria-busy", "true");
  await expect(form.locator("[name=description]")).toBeDisabled();
  await form.evaluate((element) => element.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  expect(await page.evaluate(() => window.profileTest.saves.length)).toBe(1);
  const saved = { ...profile, categories: ["engrenagens", "eixos"] };
  await page.evaluate((value) => window.profileTest.saves[0].resolve(value), saved);
  await expect(form.getByRole("status")).toContainText("Perfil industrial salvo");
  await expect(form).not.toHaveAttribute("data-dirty", "true");
  await expect(form).not.toHaveAttribute("aria-busy", "true");
  await expect(form.locator("[name=categories]")).toBeEnabled();
  await expect(form.locator("[name=categories]")).toHaveValue("engrenagens, eixos");
});

test("preserves edited values and the dirty marker after save failure so the user can retry", async ({ page }) => {
  const form = await mount(page);
  await finishLoading(page);
  await form.locator("[name=description]").fill("Nova descrição que precisa continuar no formulário.");
  await form.getByRole("button", { name: "Salvar perfil industrial" }).click();
  await page.evaluate(() => window.profileTest.saves[0].reject(new Error("Sem conexão para salvar.")));
  await expect(form.getByRole("status")).toContainText("Sem conexão para salvar");
  await expect(form.locator("[name=description]")).toHaveValue("Nova descrição que precisa continuar no formulário.");
  await expect(form).toHaveAttribute("data-dirty", "true");
  await expect(form.getByRole("button", { name: "Salvar perfil industrial" })).toBeEnabled();
  await form.getByRole("button", { name: "Salvar perfil industrial" }).click();
  expect(await page.evaluate(() => window.profileTest.saves.length)).toBe(2);
});

test("does not notify readiness or change the following page when a disposed read completes", async ({ page }) => {
  await mount(page);
  await page.evaluate(() => {
    window.profileTest.dispose();
    document.querySelector("[data-component-lab]").textContent = "Outra página";
  });
  await finishLoading(page);
  await expect(page.locator("[data-component-lab]")).toHaveText("Outra página");
  expect(await page.evaluate(() => window.profileTest.ready)).toBe(0);
});

test("cleans up only its own page and ignores completion of a disposed save", async ({ page }) => {
  const form = await mount(page);
  await finishLoading(page);
  await form.locator("[name=capacity]").fill("900");
  await form.getByRole("button", { name: "Salvar perfil industrial" }).click();
  await page.evaluate(() => {
    document.querySelector("[data-component-lab]").textContent = "Outra página";
    window.profileTest.dispose();
  });
  await page.evaluate((value) => window.profileTest.saves[0].resolve(value), profile);
  await expect(page.locator("[data-component-lab]")).toHaveText("Outra página");
});
