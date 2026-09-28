import "/src/theme/theme-controller.js";
import "/src/theme/preferences-dialog.js";
import { DEMO_WORKSPACES } from "/tests/fixtures/data/workspaces.js";
import { createAppShell } from "/src/layouts/app-shell/app-shell.js";
import { mountContextPage } from "/src/pages/context/context-page.js";

const root = document.querySelector("[data-component-lab]");
const shell = createAppShell({
  root,
  onNavigate: (path) => { root.dataset.navigatedTo = path; },
  onLogout: () => { root.dataset.loggedOut = "true"; },
  onChangeContext: () => { root.dataset.contextRequested = "true"; },
});
shell.setIdentity({ user: { displayName: "Comprador Demo" }, workspace: null, accountSource: "test" });
shell.setNavigation([{ id: "context", label: "Contextos", path: "/app/contexto" }]);
shell.setRouteMeta({ title: "Escolher contexto", breadcrumbs: ["Aplicação", "Contexto"] });
mountContextPage({
  container: shell.outlet,
  workspaces: DEMO_WORKSPACES,
  onSelect: (id) => { root.dataset.selectedWorkspace = id; },
});
const notice = document.createElement("p");
notice.className = "context-page__notice";
notice.innerHTML = '<strong>Ambiente demonstrativo</strong><br>Esta fixture visual não equivale a autorização real.';
shell.outlet.querySelector(".context-page").prepend(notice);
root.dataset.ready = "true";
