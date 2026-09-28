import { expect, test } from "@playwright/test";
import { captureUi } from "../helpers/ui-review.js";
import {
  createVerifiedUser,
  resetAuthEmulator,
  resetDatabaseEmulator,
  seedDatabaseEmulator,
} from "../helpers/auth-emulator.js";

const password = "SiviReal2026";

async function login(page, email) {
  await page.goto("/?authEmulator=1#/acesso");
  if (!(await page.locator("#login-email").isVisible())) {
    await page.locator(".form-view--register [data-switch-mode='login']").click();
  }
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.locator("#login-form button[type='submit']").click();
  await page.waitForURL(/#\/app\//);
  await page.goto("/?authEmulator=1#/app/contexto");
  await expect(page.getByRole("heading", { name: /Qual empresa você vai usar/ })).toBeVisible();
}

async function registerOrganization(page, name, roles) {
  await page.locator("[data-create-organization] input[name='name']").fill(name);
  await page.locator("[name='cnpj']").fill('12.345.678/0001-90');
  await page.locator("[name='city']").fill('Campinas');
  await page.locator("[name='state']").selectOption('SP');
  await page.locator("[name='contact']").fill('contato@empresa.test');
  for (const role of roles) await page.locator(`[data-create-organization] input[value='${role}']`).check();
  await page.locator("[data-create-organization] button[type='submit']").click();
  await page.getByRole('button', { name: 'Solicitar acesso', exact: true }).click();
  const card = page.locator('.context-company', { hasText: name }).first();
  await expect(card).toContainText('Em análise');
  await expect(card.getByRole('button', { name: /Entrar como/ })).toHaveCount(0);
}

async function selectOrganization(page, name, role) {
  const card = page.locator(".context-company", { hasText: name }).getByRole("button", { name: new RegExp(`Entrar como ${role}`, "i") }).first();
  await expect(card).toBeEnabled();
  await card.click();
}

async function logout(page) {
  await page.locator("[data-account-menu] summary").click();
  await page.locator("[data-logout]").click();
  await expect(page.locator(".auth-shell")).toHaveAttribute("data-ui-ready", "true");
}

async function saveSupplierProfile(page, name) {
  await page.getByRole("link", { name: "Perfil industrial", exact: true }).click();
  const form = page.locator("[data-supplier-profile-form]");
  await captureUi(page, "perfil-industrial");
  await form.locator("[name='categories']").fill("engrenagens, usinados");
  await form.locator("[name='materials']").fill("aço 1045");
  await form.locator("[name='processes']").fill("usinagem");
  await form.locator("[name='regions']").fill("Campinas/SP");
  await form.locator("[name='certifications']").fill("ISO 9001");
  await form.locator("[name='capacity']").fill("1000");
  await form.locator("[name='leadTimeDays']").fill("20");
  await form.locator("[name='description']").fill(`${name} atende componentes industriais sob desenho.`);
  await form.getByRole("button", { name: "Salvar perfil industrial" }).click();
  await expect(form.getByRole("status")).toContainText("Perfil industrial salvo");
}

test("supports companies, negotiation, inspection and delivery in Firebase", async ({ page }) => {
  test.setTimeout(180_000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await resetAuthEmulator();
  await resetDatabaseEmulator();
  const admin = await createVerifiedUser({ email: "admin@sivi.test", password, displayName: "Admin SIVI" });
  await createVerifiedUser({ email: "buyer@sivi.test", password, displayName: "Ana Compradora" });
  await createVerifiedUser({ email: "supplier@sivi.test", password, displayName: "Bruno Fornecedor" });
  await createVerifiedUser({ email: "competitor@sivi.test", password, displayName: "Carla Concorrente" });
  await seedDatabaseEmulator(`platformAdmins/${admin.uid}`, true);

  if (process.env.SIVI_CAPTURE_UI) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?authEmulator=1#/acesso");
    await expect(page.locator(".auth-shell")).toHaveAttribute("data-ui-ready", "true");
    await captureUi(page, "acesso");
  }

  await login(page, "buyer@sivi.test");
  await captureUi(page, "empresas");
  await registerOrganization(page, "Compradora Alpha", ["buyer"]);
  await logout(page);

  await login(page, "supplier@sivi.test");
  await registerOrganization(page, "Fornecedor Vetor", ["supplier"]);
  await logout(page);

  await login(page, "competitor@sivi.test");
  await registerOrganization(page, "Fornecedor Horizonte", ["supplier"]);
  await logout(page);

  await login(page, "admin@sivi.test");
  await page.getByRole("button", { name: /Abrir portal administrativo/ }).click();
  await expect(page.locator(".admin-organization-card")).toHaveCount(3);
  await captureUi(page, "administracao");
  for (const name of ["Compradora Alpha", "Fornecedor Vetor", "Fornecedor Horizonte"]) {
    const card = page.locator(".admin-organization-card", { hasText: name });
    await card.getByRole("button", { name: "Aprovar" }).click();
    await expect(page.getByRole("status")).toContainText("aprovado");
  }
  await logout(page);

  await login(page, "supplier@sivi.test");
  await selectOrganization(page, "Fornecedor Vetor", "Fornecedor");
  await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
  await captureUi(page, "fornecedor");
  await saveSupplierProfile(page, "Fornecedor Vetor");
  await logout(page);

  await login(page, "competitor@sivi.test");
  await selectOrganization(page, "Fornecedor Horizonte", "Fornecedor");
  await saveSupplierProfile(page, "Fornecedor Horizonte");
  await logout(page);

  await login(page, "buyer@sivi.test");
  await selectOrganization(page, "Compradora Alpha", "Comprador");
  await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
  await captureUi(page, "comprador-vazio");
  await page.getByRole("link", { name: "Minhas demandas", exact: true }).click();
  await page.getByText("Nova demanda", { exact: true }).click();
  const demandForm = page.locator("[data-workflow='demands'] form");
  await demandForm.locator("[name='title']").fill("500 engrenagens industriais");
  await demandForm.locator("[name='requiredBy']").fill("2026-12-20");
  await demandForm.locator("[name='destination']").fill("Campinas/SP");
  await demandForm.locator("[name='region']").fill("Campinas/SP");
  await demandForm.locator("[name='description']").first().fill("Produção conforme desenho técnico aprovado.");
  const item = demandForm.locator("[data-demand-item]").first();
  await item.locator("[name='description']").fill("Engrenagem industrial");
  await item.locator("[name='category']").fill("engrenagens");
  await item.locator("[name='material']").fill("aço 1045");
  await item.locator("[name='process']").fill("usinagem");
  await item.locator("[name='certifications']").fill("ISO 9001");
  await item.locator("[name='quantity']").fill("400");
  await demandForm.getByRole("button", { name: "Salvar rascunho" }).click();
  await expect(page.getByText("500 engrenagens industriais", { exact: true }).first()).toBeVisible();
  const draft = page.locator('.workflow-demand');
  await draft.getByText('Editar rascunho', { exact: true }).click();
  const editForm = draft.locator('.workflow-demand-form');
  await expect(editForm.getByLabel('Objetivo e observações')).toHaveValue('Produção conforme desenho técnico aprovado.');
  await expect(editForm.getByLabel('Quantidade', { exact: true })).toHaveValue('400');
  await expect(draft.getByRole('button', { name: 'Publicar demanda', exact: true })).toBeDisabled();
  await editForm.getByLabel('Quantidade', { exact: true }).fill('500');
  await editForm.getByLabel('Objetivo e observações').fill('Produção conforme desenho técnico revisado e aprovado.');
  await captureUi(page, 'editar-rascunho');
  if (process.env.SIVI_CAPTURE_UI) {
    await page.locator('[data-account-menu] summary').click();
    await page.getByRole('button', { name: 'Aparência e acessibilidade', exact: true }).click();
    const preferences = page.getByRole('dialog', { name: 'Aparência e acessibilidade' });
    await preferences.getByLabel('Tamanho do texto').selectOption('large');
    await preferences.getByLabel('Contraste').selectOption('more');
    await preferences.getByLabel('Espaçamento').selectOption('compact');
    await preferences.getByRole('button', { name: 'Fechar preferências' }).click();
    await captureUi(page, 'editar-rascunho-texto-maior');
    await expect(editForm.getByLabel('Quantidade', { exact: true })).toHaveValue('500');
    await page.locator('[data-account-menu] summary').click();
    await page.getByRole('button', { name: 'Aparência e acessibilidade', exact: true }).click();
    await preferences.getByRole('button', { name: 'Restaurar padrão' }).click();
    await preferences.getByRole('button', { name: 'Fechar preferências' }).click();
  }
  await editForm.getByRole('button', { name: 'Salvar alterações', exact: true }).click();
  await expect(page.locator('.workflow-feedback')).toHaveText('Alterações do rascunho salvas.');
  await page.reload();
  await draft.getByText('Editar rascunho', { exact: true }).click();
  await expect(editForm.getByLabel('Quantidade', { exact: true })).toHaveValue('500');
  await expect(editForm.getByLabel('Objetivo e observações')).toHaveValue('Produção conforme desenho técnico revisado e aprovado.');
  await editForm.getByLabel('Título da demanda').fill('Alteração descartada');
  await editForm.getByRole('button', { name: 'Cancelar edição', exact: true }).click();
  await draft.getByText('Editar rascunho', { exact: true }).click();
  await expect(editForm.getByLabel('Título da demanda')).toHaveValue('500 engrenagens industriais');
  await editForm.getByRole('button', { name: 'Cancelar edição', exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Publicar demanda" }).click();
  await expect(page.locator(".workflow-state")).toContainText("Publicada");
  await expect(draft.getByText('Editar rascunho', { exact: true })).toHaveCount(0);
  await captureUi(page, "demandas");
  await logout(page);

  await login(page, "supplier@sivi.test");
  await selectOrganization(page, "Fornecedor Vetor", "Fornecedor");
  await page.getByRole("link", { name: "Oportunidades", exact: true }).click();
  await expect(page.getByText("500 engrenagens industriais", { exact: true }).first()).toBeVisible();
  await page.getByText(/Ver especificação técnica/).first().click();
  await expect(page.getByText('Produção conforme desenho técnico revisado e aprovado.', { exact: true })).toBeVisible();
  await expect(page.getByText("Compatibilidade com o perfil", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Enviar proposta", exact: true }).click();
  await expect(page).toHaveURL(/fornecedor\/propostas\?registro=/);
  await page.reload();
  await expect(page.locator("[data-workflow=proposals] .workflow-negotiation")).toHaveCount(1);
  await page.getByText("Preparar proposta", { exact: true }).click();
  const proposalForm = page.locator("[data-workflow='proposals'] form");
  await proposalForm.locator("[name='price']").fill("12500");
  await proposalForm.locator("[name='freight']").fill("500");
  await proposalForm.locator("[name='leadTimeDays']").fill("20");
  await proposalForm.locator("[name='validUntil']").fill("2026-12-10");
  await proposalForm.locator("[name='manufacturer']").fill("Vetor");
  await proposalForm.locator("[name='payment']").fill("28 dias");
  await proposalForm.locator("[name='warranty']").fill("12 meses");
  await proposalForm.locator("[name='technical']").fill("Atende integralmente à especificação.");
  await proposalForm.getByRole("button", { name: "Enviar versão da proposta" }).click();
  await expect(page.getByText("Versão 1", { exact: true })).toBeVisible();
  await logout(page);

  await login(page, "competitor@sivi.test");
  await selectOrganization(page, "Fornecedor Horizonte", "Fornecedor");
  await page.getByRole("link", { name: "Minhas propostas", exact: true }).click();
  await expect(page.getByText("500 engrenagens industriais", { exact: true })).toBeVisible();
  await expect(page.getByText("Fornecedor Vetor", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Versão 1", { exact: true })).toHaveCount(0);
  await logout(page);

  await login(page, "buyer@sivi.test");
  await selectOrganization(page, "Compradora Alpha", "Comprador");
  await expect(page.getByRole("link", { name: "Comparar propostas", exact: true })).toBeVisible();
  await captureUi(page, "comprador-pendencias");
  await page.getByRole("link", { name: "Comparar propostas", exact: true }).click();
  await expect(page).toHaveURL(/comprador\/propostas\?registro=/);
  await expect(page.getByText("Fornecedor Vetor", { exact: true })).toBeVisible();
  await captureUi(page, "propostas");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Aceitar versão e gerar pedido" }).click();
  await page.getByRole("link", { name: "Acompanhar pedido", exact: true }).click();
  await expect(page).toHaveURL(/comprador\/pedidos\?registro=/);
  await expect(page.locator('.workflow-order .workflow-reference')).toContainText('Referência: order_');
  await expect(page.locator('.workflow-order > h3')).toHaveText('500 engrenagens industriais');
  await page.reload();
  await expect(page.locator('.workflow-order .workflow-reference')).toContainText('Referência: order_');
  await expect(page.locator('.workflow-order > h3')).toHaveText('500 engrenagens industriais');
  await captureUi(page, "pedidos");
  if (process.env.SIVI_CAPTURE_UI) {
    await page.getByRole("link", { name: "Visão do comprador", exact: true }).click();
    await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
    await captureUi(page, "comprador");
  }
  await logout(page);
  await login(page, "supplier@sivi.test");
  await selectOrganization(page, "Fornecedor Vetor", "Fornecedor");
  await page.getByRole("link", { name: "Pedidos recebidos", exact: true }).click();
  const order = page.locator(".workflow-order");
  for (const [approved, state] of [["490", "Bloqueado — reinspeção necessária"], ["500", "Liberado para expedição"]]) {
    await order.getByText("Registrar inspeção / reinspeção", { exact: true }).click();
    await order.getByLabel("Quantidade aprovada", { exact: true }).fill(approved);
    await order.getByLabel("Plano de inspeção e versão").fill("Plano dimensional v1");
    await order.getByLabel("Resultado e evidência da inspeção").fill(approved === "490" ? "Dez peças para retrabalho" : "Retrabalho concluído; medidas conferidas");
    await order.getByRole("button", { name: "Registrar inspeção", exact: true }).click();
    await expect(order.getByText(state, { exact: true })).toBeVisible();
  }
  await expect(order).toContainText("Engrenagem industrial: 490/500 un");
  await expect(order).toContainText("Engrenagem industrial: 500/500 un");
  page.once("dialog", dialog => dialog.accept());
  await order.getByRole("button", { name: "Registrar expedição", exact: true }).click();
  await expect(order.getByText("Expedido", { exact: true })).toBeVisible();
  await logout(page);
  await login(page, "buyer@sivi.test");
  await selectOrganization(page, "Compradora Alpha", "Comprador");
  await page.getByRole("link", { name: "Meus pedidos", exact: true }).click();
  page.once("dialog", dialog => dialog.accept());
  await order.getByRole("button", { name: "Confirmar recebimento", exact: true }).click();
  await expect(order.locator("strong").filter({ hasText: /^Entrega confirmada$/ })).toBeVisible();
  await order.getByLabel("Nota de 1 a 5").fill("5");
  await order.getByLabel("Comentário sobre a entrega").fill("Entrega conferida");
  await order.getByRole("button", { name: "Enviar avaliação", exact: true }).click();
  await expect(order).toContainText("5/5 · Entrega conferida");
  await page.reload();
  await expect(order).toContainText("5/5 · Entrega conferida");
  await expect(order).toContainText("Engrenagem industrial: 500/500 un");
  await expect(order).toContainText("Prazo contratado: 20 dias");
  await expect(order).toContainText("Pagamento: 28 dias");
  await expect(order).toContainText("Garantia: 12 meses");
  await expect(order).toContainText(/13\.000,00/);
  expect(pageErrors).toEqual([]);
});
