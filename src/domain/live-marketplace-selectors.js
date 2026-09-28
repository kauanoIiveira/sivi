import { buildNextActions, workflowLink } from "./next-actions.js";
import { isCalendarDate, todayInSaoPaulo } from './calendar-date.js';
import { quantitySummary } from './quantity.js';
import { inspectionSummary } from './inspection.js';
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function metric(id, label, value, unit, formula, display = String(value)) {
  return Object.freeze({ id, label, value, display, unit, formula, period: "Dados atuais", source: "Registros da empresa" });
}

export function buildLiveDashboard(workspace, data) {
  const { demands, proposals, orders } = data;
  if (workspace.organizationRole === "buyer") {
    const proposalSummaries = [...proposals].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)).map((proposal) => {
      const currentVersion = proposal.versions.at(-1);
      const acceptedOrder = orders.find(order => (proposal.id && order.sourceProposalId === proposal.id) || (currentVersion?.id && order.version.id === currentVersion.id));
      const latest = acceptedOrder?.version ?? currentVersion;
      const accepted = Boolean(acceptedOrder);
      return Object.freeze({
        demandTitle: demands.find(item => item.id === proposal.demandId)?.title ?? 'Demanda não disponível',
        href: workflowLink('buyer', 'proposals', proposal.demandId),
        supplierId: proposal.supplierId,
        supplierName: proposal.supplierName,
        versionCount: proposal.versions.length,
        latestTotalCents: (latest?.totalCents ?? 0) + (latest?.freightCents ?? 0),
        latestTotalDisplay: currency.format(((latest?.totalCents ?? 0) + (latest?.freightCents ?? 0)) / 100),
        leadTimeDays: latest?.leadTimeDays ?? 0,
        historicalQuality: Object.freeze({ acceptedLotsPercent: null, sampleSize: 0 }),
        decisionLabel: accepted ? "Versão aceita" : orders.some(order => order.demandId === proposal.demandId) ? "Não selecionada" : !isCalendarDate(latest?.validUntil) ? 'Validade não informada' : latest.validUntil < todayInSaoPaulo() ? 'Proposta vencida' : "Aguardando decisão",
        accepted,
      });
    });
    const acceptedValue = orders.reduce((sum, order) => sum + order.version.totalCents + order.version.freightCents, 0);
    return Object.freeze({
      role: "buyer",
      organizationName: workspace.organizationName,
      title: "Visão do comprador",
      isFirstPurchase: demands.length === 0 && orders.length === 0,
      showJourney: demands.length > 0 || orders.length > 0,
      nextActions: buildNextActions("buyer", data),
      metrics: Object.freeze([
        metric("active-demands", "Demandas ativas", demands.filter(({ status }) => status === "published").length, "demandas", "Demandas publicadas ainda sem pedido"),
        metric("received-proposals", "Propostas recebidas", proposals.length, "propostas", "Propostas visíveis para esta empresa"),
        metric("accepted-value", "Valor aceito", acceptedValue, "BRL", "Soma dos pedidos criados por versões aceitas", currency.format(acceptedValue / 100)),
        metric("delivery-confirmations", "Entregas a confirmar", orders.filter(({ status }) => status === "dispatched").length, "entregas", "Pedidos expedidos aguardando confirmação"),
      ]),
      proposalSummaries: Object.freeze(proposalSummaries),
    });
  }
  const activeOrders = orders.filter(({ status }) => status !== 'delivered');
  const blockedOrders = orders.filter(({ status }) => status === 'blocked');
  return Object.freeze({
    role: "supplier",
    organizationName: workspace.organizationName,
    title: "Visão do fornecedor",
    showJourney: demands.length > 0 || orders.length > 0,
    nextActions: buildNextActions("supplier", data),
    metrics: Object.freeze([
      metric("released-opportunities", "Oportunidades liberadas", demands.filter(({ status }) => status === "published").length, "oportunidades", "Demandas publicadas acessíveis a fornecedores ativos"),
      metric("sent-proposals", "Propostas enviadas", proposals.length, "propostas", "Uma proposta por demanda, incluindo suas revisões"),
      metric("active-orders", "Pedidos em execução", activeOrders.length, "pedidos", "Pedidos aceitos ainda sem recebimento confirmado"),
      metric("blocked-orders", "Aguardando reinspeção", blockedOrders.length, "pedidos", "Pedidos bloqueados pela última inspeção"),
    ]),
    execution: Object.freeze({ model: null, orders: Object.freeze([...activeOrders].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))), stockQuantity: null, productionQuantity: null, lots: Object.freeze([]) }),
  });
}

export function buildLiveJourney(workspace, data) {
  const { demands, proposals, orders } = data;
  const recentOrders = [...orders].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  const order = recentOrders.find(item => item.status !== 'delivered') ?? recentOrders.find(item => !item.evaluation) ?? recentOrders[0];
  const recentDemands = [...demands].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  const demand = order
    ? demands.find(item => item.id === order.demandId) ?? { ...order, id: order.demandId, status: 'ordered' }
    : recentDemands.find(item => item.status === 'published') ?? recentDemands[0];
  const demandProposals = demand ? proposals.filter((item) => item.demandId === demand.id) : [];
  const inspection = order?.inspections?.at(-1);
  const completedOrder = Boolean(order);
  const released = order && ["released", "dispatched", "delivered"].includes(order.status);
  const dispatched = order && ["dispatched", "delivered"].includes(order.status);
  const delivered = order?.status === "delivered";
  const step = (id, label, status, summary, evidenceIds = []) => {
    const section = ['demand', 'match'].includes(id) ? 'demands' : id === 'proposals' ? 'proposals' : 'orders';
    const recordId = section === 'orders' ? order?.id : demand?.id;
    return Object.freeze({ id, label, status, summary, evidenceIds: Object.freeze(evidenceIds),
      href: recordId ? workflowLink(workspace.organizationRole, section, recordId) : undefined,
      linkLabel: section === 'demands' ? 'Abrir demanda' : section === 'proposals' ? 'Ver propostas' : 'Abrir pedido',
    });
  };
  return Object.freeze([
    step("demand", "Demanda", demand ? "completed" : "active", demand ? `${quantitySummary(demand)} · ${demand.title}` : workspace.organizationRole === "supplier" ? "Aguarde uma demanda publicada e mantenha seu perfil industrial atualizado" : "Crie a primeira demanda", demand ? [demand.id] : []),
    step("match", "Oportunidade", demand && demand.status !== "draft" ? "completed" : demand ? "active" : "locked", demand && demand.status !== "draft" ? "Publicada para fornecedores autorizados" : "A publicação libera a oportunidade", demand && demand.status !== "draft" ? [demand.id] : []),
    step("proposals", "Propostas", demandProposals.length || order ? "completed" : demand?.status === "published" ? "active" : "locked", order ? 'Condições aceitas e preservadas no pedido' : demandProposals.length ? `${demandProposals.length} ${demandProposals.length === 1 ? 'proposta recebida' : 'propostas recebidas'}` : "Aguardando a primeira proposta", demandProposals.map(({ id }) => id)),
    step("order", "Pedido", completedOrder ? "completed" : demandProposals.length ? "active" : "locked", completedOrder ? order.title : "Depende do aceite de uma versão", order ? [order.id] : []),
    step("fulfillment", "Atendimento", completedOrder ? (released ? "completed" : "active") : "locked", completedOrder ? released ? 'Inspeção concluída pelo fornecedor' : "Pedido em execução pelo fornecedor" : "Disponível após o pedido", order ? [order.id] : []),
    step("quality", "Qualidade", order?.status === "blocked" ? "attention" : released ? "completed" : completedOrder ? "active" : "locked", inspection ? inspectionSummary(order, inspection) : "Inspeção ainda não registrada", inspection ? [order.id] : []),
    step("delivery", "Entrega", delivered ? "completed" : dispatched ? "active" : released ? "upcoming" : "locked", delivered ? "Recebimento confirmado" : dispatched ? "Expedido; aguardando recebimento" : "Depende da liberação da qualidade", order ? [order.id] : []),
    step("evaluation", "Avaliação", order?.evaluation ? "completed" : delivered ? "active" : "locked", order?.evaluation ? `${order.evaluation.score}/5 · avaliação registrada` : "Disponível após a entrega", order?.evaluation ? [order.id] : []),
  ]);
}
