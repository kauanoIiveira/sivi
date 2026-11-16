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
  page.dataset.operationRole = workspace.organizationRole;
  page.dataset.operationSection = section;
  const buyer = workspace.organizationRole === "buyer";
  if (buyer) page.classList.add("workspace-page");
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
    const header = element("header", undefined, "operations-heading");
    const copy = element("div");
    const buyerTitles = { demands: "Minhas demandas", proposals: "Propostas recebidas", orders: "Meus pedidos" };
    const title = element("h1", buyer ? buyerTitles[section] : section === "demands" ? "Oportunidades" : titles[section]);
    title.dataset.pageTitle = "";
    const descriptions = {
      demands: buyer ? "Especificações, quantidades e prazos para sua próxima compra." : "Demandas publicadas para a capacidade da sua empresa.",
      proposals: buyer ? "Compare condições e selecione a proposta para cada demanda." : "Acompanhe suas propostas e envie novas versões.",
      orders: "Acompanhe inspeções, liberação e entrega de cada pedido.",
    };
    copy.append(title, element("p", descriptions[section]));
    header.append(copy);
    const headerActions = buyer ? element("div", undefined, "workspace-page__actions") : null;
    if (buyer) {
      header.classList.add("workspace-page__header");
      header.append(headerActions);
    } else {
      const identity = element("div", undefined, "operations-identity");
      identity.append(element("span", "Empresa fornecedora"), element("strong", workspace.organizationName));
      header.append(identity);
    }
    page.append(header);
    clearWorkflow();
    clearWorkflow = mountWorkflowView({ container: page, workspace, workflow: repository.workflow, section, headerActions, suppliers: result.data.suppliers, onRefresh: () => repository.getOperations(workspace.id), onReassess: repository.reassessDemand ? id => repository.reassessDemand(workspace.id, id) : null });
    onReady();
  }
  void load();
  return () => { disposed = true; clearState(); clearWorkflow(); page.remove(); };
}
