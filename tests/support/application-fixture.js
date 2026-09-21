// Loaded only by Playwright's explicit interception of /src/main.js.
import "/src/theme/theme-controller.js";
import { bootstrapApplication } from "/src/app/bootstrap.js";
import { DEMO_WORKSPACES } from "/tests/fixtures/data/workspaces.js";
import { createDemoRepository } from "/tests/fixtures/repositories/demo-repository.js";

bootstrapApplication({
  workspaceService: { listWorkspaces: async () => DEMO_WORKSPACES },
  repository: createDemoRepository(),
  administration: { listOrganizations: async () => [] },
});
