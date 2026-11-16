import { expect, test } from "@playwright/test";

const preview = "/tests/fixtures/workspace-preview.html?catalog=expanded";

test("a buyer can open the chat from a profile and the supplier can reply", async ({ page }) => {
  await page.goto(`${preview}#/app/comprador/fornecedores/perfil?registro=org-vetor`);
  await page.getByRole("link", { name: "Enviar mensagem" }).click();
  const thread = page.getByRole("region", { name: "Conversa selecionada" });
  await expect(thread.getByRole("heading", { name: "Vetor Componentes Industriais" })).toBeVisible();
  await expect(thread.getByText("Vocês conseguem produzir 240 flanges em aço SAE 1045?")).toBeVisible();

  const message = page.getByRole("textbox", { name: "Mensagem" });
  await message.fill("Podemos confirmar o prazo de entrega?");
  await page.getByRole("button", { name: "Enviar", exact: true }).click();
  await expect(message).toBeEmpty();
  await expect(thread.getByText("Podemos confirmar o prazo de entrega?")).toBeVisible();

  await page.getByLabel("Atuação da prévia").selectOption("supplier");
  await page.getByRole("link", { name: "Conversas", exact: true }).click();
  await page.getByRole("link", { name: "Indústrias Alpha", exact: true }).click();
  await expect(thread.getByText("Podemos confirmar o prazo de entrega?")).toBeVisible();
  await message.fill("Conseguimos entregar em 18 dias.");
  await page.getByRole("button", { name: "Enviar", exact: true }).click();
  await expect(thread.getByText("Conseguimos entregar em 18 dias.")).toBeVisible();

  await page.getByLabel("Atuação da prévia").selectOption("buyer");
  await page.getByRole("link", { name: "Conversas", exact: true }).click();
  await page.getByRole("link", { name: "Vetor Componentes Industriais", exact: true }).click();
  await expect(thread.getByText("Conseguimos entregar em 18 dias.")).toBeVisible();
});

test("the mobile owner can start a conversation and return to the inbox", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(`${preview}#/app/comprador/fornecedores/perfil?registro=boreal`);
  await page.getByRole("link", { name: "Enviar mensagem" }).click();
  await expect(page.getByRole("heading", { name: "Boreal Tornearia" })).toBeVisible();
  await expect(page.getByText("Envie uma mensagem para começar.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviar", exact: true })).toBeDisabled();
  await page.getByRole("textbox", { name: "Mensagem" }).fill("Olá!\nPrecisamos de um orçamento.");
  await page.getByRole("button", { name: "Enviar", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Mensagem enviada.");
  await expect(page.locator(".conversations-message p")).toHaveText("Olá!\nPrecisamos de um orçamento.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole("link", { name: "Voltar à caixa de entrada" }).click();
  await expect(page.getByRole("link", { name: "Boreal Tornearia", exact: true })).toBeVisible();
});

test("empty and unavailable inboxes provide relevant actions", async ({ page }) => {
  await page.goto(`${preview}&state=empty#/app/comprador/conversas`);
  await expect(page.getByRole("link", { name: "Explorar fornecedores" })).toBeVisible();
  await page.getByLabel("Estado da prévia").selectOption("error");
  await expect(page.getByRole("region", { name: "Caixa de entrada" }).getByRole("button", { name: "Tentar novamente" })).toBeVisible();
});

test('chat restores a draft after leaving and clears it after a confirmed send', async ({ page }) => {
  await page.goto(`${preview}#/app/comprador/conversas?registro=org-vetor`);
  const box = page.getByRole('textbox', { name: 'Mensagem' });
  await box.fill('Texto em preparação');
  await page.getByRole('link', { name: 'Fornecedores', exact: true }).click();
  await page.goBack();
  await expect(box).toHaveValue('Texto em preparação');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(box).toBeEmpty();
  await page.getByRole('link', { name: 'Fornecedores', exact: true }).click();
  await page.goBack();
  await expect(box).toBeEmpty();
});

test('an order opens the supplier chat and recent incoming messages are marked', async ({ page }) => {
  await page.goto(`${preview}&role=supplier#/app/fornecedor/pedidos`);
  await page.getByRole('link', { name: 'Conversar com comprador', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Indústrias Alpha', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Mensagem' }).fill('Pedido em produção');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.getByText('Pedido em produção', { exact: true })).toBeVisible();
  await page.getByLabel('Atuação da prévia').selectOption('buyer');
  await page.getByRole('link', { name: 'Conversas', exact: true }).click();
  await expect(page.getByText('Nova mensagem', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Vetor Componentes Industriais', exact: true }).click();
  await expect(page.getByText('Pedido em produção', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Conversas', exact: true }).click();
  await expect(page.getByText('Nova mensagem', { exact: true })).toHaveCount(0);
});
