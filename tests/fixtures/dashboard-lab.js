import { DEMO_WORKSPACES } from "/tests/fixtures/data/workspaces.js";
import { createDemoRepository } from "/tests/fixtures/repositories/demo-repository.js";
import { mountBuyerDashboardPage } from "/src/pages/dashboard/buyer-dashboard-page.js";
import { mountSupplierDashboardPage } from "/src/pages/dashboard/supplier-dashboard-page.js";
import { mountDashboardPage } from "/src/pages/dashboard/dashboard-view.js";

const params = new URLSearchParams(location.search);
const role = params.get("role") ?? "buyer";
const state = params.get("state") ?? "normal";
const theme = params.get("theme");
if (["light", "dark"].includes(theme)) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

const workspace = DEMO_WORKSPACES.find(({ organizationRole }) => organizationRole === role);
const repository = createDemoRepository();
await repository.setSimulationMode(state);
const mounts = {
  buyer: mountBuyerDashboardPage,
  supplier: mountSupplierDashboardPage,
  administration: mountDashboardPage,
};

const container = document.querySelector("[data-dashboard-lab]");
const mount = mounts[role];
if (!workspace || !mount) throw new Error(`Papel demonstrativo inválido: ${role}`);

window.dashboardLab = {
  cleanup: mount({
    container,
    workspace,
    repository,
    onReady: () => {
      container.dataset.onReady = container.querySelector(".dashboard-page")?.dataset.pageState ?? "too-early";
    },
  }),
};
