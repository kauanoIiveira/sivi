import { renderPageState } from "../../components/page-state/page-state.js";
import { mountWorkflowView } from "./workflow-view.js";

const titles = { demands: "Demandas", proposals: "Propostas", orders: "Pedidos e execução" };
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};

export function mountOperationsPage({ container, workspace, repository, section, onReady = () => {} }) {
  let disposed = false;
  let clearState = () => {};
  let clearWorkflow = () => {};
  const page = element("section", undefined, "operations-page");
  container.replaceChildren(page);
  async function load() {
    clearState();
    clearState = renderPageState(page, { status: "loading" });
    let result;
    try { result = await repository.getOperations(workspace.id); }
    catch { result = { status: "error" }; }
    if (disposed) return;
    clearState();
    if (result.status !== "ready") {
      clearState = renderPageState(page, { status: result.status, onRetry: load });
      onReady();
      return;
    }
    page.replaceChildren();
    const buyer = workspace.organizationRole === "buyer";
    const header = element("header", undefined, "operations-heading");
    const copy = element("div");
    const title = element("h1", section === "demands" && !buyer ? "Oportunidades" : titles[section]);
    title.dataset.pageTitle = "";
    const descriptions = {
      demands: buyer ? "Especificações, quantidades e prazos para sua próxima compra." : "Demandas publicadas para a capacidade da sua empresa.",
      proposals: buyer ? "Compare condições e selecione a proposta para cada demanda." : "Acompanhe suas propostas e envie novas versões.",
      orders: "Acompanhe inspeções, liberação e entrega de cada pedido.",
    };
    copy.append(title, element("p", descriptions[section]));
    const identity = element("div", undefined, "operations-identity");
    identity.append(element("span", buyer ? 'Empresa compradora' : 'Empresa fornecedora'), element("strong", workspace.organizationName));
    header.append(copy, identity);
    page.append(header);
    clearWorkflow();
    clearWorkflow = mountWorkflowView({ container: page, workspace, workflow: repository.workflow, section, suppliers: result.data.suppliers, onRefresh: () => repository.getOperations(workspace.id) });
    onReady();
  }
  void load();
  return () => { disposed = true; clearState(); clearWorkflow(); page.remove(); };
}
