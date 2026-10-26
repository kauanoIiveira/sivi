// Loaded only by Playwright's explicit interception of /src/main.js.
import "/src/theme/theme-controller.js";
import "/src/theme/preferences-dialog.js";
import { bootstrapApplication } from "/src/app/bootstrap.js";
import { DEMO_WORKSPACES } from "/tests/fixtures/data/workspaces.js";
import { createDemoRepository } from "/tests/fixtures/repositories/demo-repository.js";
import { buildLiveJourney } from '/src/domain/live-marketplace-selectors.js';

const scenarioRepository = createDemoRepository();
const buyerWorkspace = id => DEMO_WORKSPACES.find(workspace => workspace.id === id && workspace.organizationRole === 'buyer');
// The buyer overview consumes editable operation records; the historic scenario
// continues to serve the original supplier dashboard and scenario labs.
const repository = {
  ...scenarioRepository,
  async getOperations(id) {
    if (!buyerWorkspace(id)) return scenarioRepository.getOperations(id);
    return { status: 'ready', data: scenarioRepository.workflow.read(id) };
  },
  async getIndustrialJourney(id) {
    const workspace = buyerWorkspace(id);
    if (!workspace) return scenarioRepository.getIndustrialJourney(id);
    return { status: 'ready', data: buildLiveJourney(workspace, scenarioRepository.workflow.read(id)), meta: { asOf: new Date().toISOString() } };
  },
};

bootstrapApplication({
  workspaceService: { listWorkspaces: async () => DEMO_WORKSPACES },
  repository,
  administration: { listOrganizations: async () => [] },
});
