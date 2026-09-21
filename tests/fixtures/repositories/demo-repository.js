import { DEMO_SCENARIO } from "../data/scenario.js";
import { DEMO_WORKSPACES } from "../data/workspaces.js";
import {
  buildAdminDashboard,
  buildBuyerDashboard,
  buildIndustrialJourney,
  buildSupplierDashboard,
} from "../domain/dashboard-selectors.js";
import { createRepositoryResult } from "../../../src/repositories/repository-result.js";
import { createDemoWorkflow } from "../domain/demo-workflow.js";

const MODES = new Set(["normal", "loading", "empty", "error", "forbidden", "conflict"]);

export function createDemoRepository({
  scenario = DEMO_SCENARIO,
  workspaces = DEMO_WORKSPACES,
} = {}) {
  const workspacesById = new Map(workspaces.map((workspace) => [workspace.id, workspace]));
  const dashboardBuilders = new Map([
    ["buyer", buildBuyerDashboard],
    ["supplier", buildSupplierDashboard],
    ["administration", buildAdminDashboard],
  ]);
  let mode = "normal";
  const workflow = createDemoWorkflow(workspaces);
  const meta = Object.freeze({
    source: scenario.meta.source,
    period: scenario.meta.periodLabel,
    asOf: scenario.meta.asOf,
    technicalBasis: scenario.meta.technicalBasis,
    securityNotice: "Fixture entregue ao navegador: filtros visuais não equivalem a autorização real.",
  });

  const knownWorkspace = (workspace) =>
    workspace && dashboardBuilders.has(workspace.organizationRole);

  const simulated = () => {
    if (mode === "normal") return null;
    if (mode === "loading") return createRepositoryResult("loading", { meta });
    if (mode === "empty") return createRepositoryResult("empty", { meta });
    if (mode === "error") {
      return createRepositoryResult("error", {
        error: new Error("Falha demonstrativa de carregamento"),
        meta,
      });
    }
    if (mode === "forbidden") return createRepositoryResult("forbidden", { meta });
    return createRepositoryResult("conflict", {
      data: Object.freeze({
        code: "demo-version-conflict",
        message: "A versão demonstrativa mudou durante a leitura.",
      }),
      meta,
    });
  };

  return Object.freeze({
    workflow,
    async getOperations(workspaceId) {
      const workspace = workspacesById.get(workspaceId);
      if (!workspace || !["buyer", "supplier"].includes(workspace.organizationRole)) return createRepositoryResult("forbidden", { meta });
      const forced = simulated();
      if (forced) return forced;
      return createRepositoryResult("ready", { meta, data: {
        demand: scenario.demand,
        suppliers: scenario.organizations.suppliers,
        proposals: scenario.proposals.filter((proposal) => proposal.visibility.organizationIds.includes(workspace.organizationId)),
        order: scenario.order,
        fulfillment: scenario.fulfillment,
        lots: scenario.lots,
        plans: scenario.inspectionPlans,
      } });
    },
    async getDashboard(workspaceId) {
      const workspace = workspacesById.get(workspaceId);
      if (!knownWorkspace(workspace)) return createRepositoryResult("forbidden", { meta });

      const forced = simulated();
      if (forced) return forced;

      const build = dashboardBuilders.get(workspace.organizationRole);
      return createRepositoryResult("ready", { data: build(scenario, workspace), meta });
    },
    async getIndustrialJourney(workspaceId) {
      const workspace = workspacesById.get(workspaceId);
      if (!knownWorkspace(workspace)) return createRepositoryResult("forbidden", { meta });

      const forced = simulated();
      if (forced) return forced;

      return createRepositoryResult("ready", {
        data: buildIndustrialJourney(scenario, workspace),
        meta,
      });
    },
    async setSimulationMode(nextMode) {
      if (!MODES.has(nextMode)) throw new Error(`Modo demonstrativo inválido: ${nextMode}`);
      mode = nextMode;
    },
    async reset() {
      mode = "normal";
      workflow.reset();
    },
  });
}
