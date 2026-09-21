import { expect, test } from "@playwright/test";

test("record selection retains the requested demand and unavailable records are recoverable", async ({ page }) => {
  await page.goto("/tests/fixtures/operations-lab.html");
  const mount = async selectedRecordId => page.evaluate(async selectedRecordId => {
    const { mountWorkflowView } = await import("/src/pages/operations/workflow-view.js");
    const main = document.querySelector("main"); main.replaceChildren();
    mountWorkflowView({ container: main, selectedRecordId, workspace: { id: "buyer", organizationRole: "buyer" }, suppliers: [], section: "demands", workflow: { read: () => ({ demands: ["A", "B"].map(id => ({ id, title: `Compra ${id}`, status: "published", quantity: 10, requiredBy: "2026-12-20", destination: "SP", description: "Componentes" })), proposals: [], orders: [] }) } });
  }, selectedRecordId);
  await mount("B");
  await expect(page.locator(".workflow-demand")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Compra B" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Acompanhar propostas" })).toHaveAttribute("href", "#/app/comprador/propostas?registro=B");
  await expect(page.getByRole("link", { name: "Ver lista completa" })).toHaveAttribute("href", "#/app/comprador/demandas");
  await mount("unavailable");
  await expect(page.getByText("Registro indisponível", { exact: true })).toBeVisible();
  await expect(page.locator(".workflow-demand")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Publicar demanda" })).toHaveCount(0);
});
