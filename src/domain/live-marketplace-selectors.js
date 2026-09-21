import { buildNextActions } from "./next-actions.js";
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function metric(id, label, value, unit, formula, display = String(value)) {
  return Object.freeze({ id, label, value, display, unit, formula, period: "Dados atuais", source: "Registros da empresa" });
}

export function buildLiveDashboard(workspace, data) {
  const { demands, proposals, orders } = data;
  if (workspace.organizationRole === "buyer") {
    const proposalSummaries = proposals.map((proposal) => {
      const latest = proposal.versions.at(-1);
      const accepted = orders.some((order) => order.version.id === latest?.id);
      return Object.freeze({
        supplierId: proposal.supplierId,
        supplierName: proposal.supplierName,
        versionCount: proposal.versions.length,
        latestTotalCents: (latest?.totalCents ?? 0) + (latest?.freightCents ?? 0),
        latestTotalDisplay: currency.format(((latest?.totalCents ?? 0) + (latest?.freightCents ?? 0)) / 100),
        leadTimeDays: latest?.leadTimeDays ?? 0,
        historicalQuality: Object.freeze({ acceptedLotsPercent: null, sampleSize: 0 }),
        decisionLabel: accepted ? "Versão aceita" : orders.some(order => order.demandId === proposal.demandId) ? "Não selecionada" : "Aguardando decisão",
        accepted,
      });
    });
    const acceptedValue = orders.reduce((sum, order) => sum + order.version.totalCents + order.version.freightCents, 0);
    return Object.freeze({
      role: "buyer",
      organizationName: workspace.organizationName,
      title: "Visão do comprador",
      isFirstPurchase: demands.length === 0 && orders.length === 0,
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
  const committed = orders.reduce((sum, order) => sum + order.quantity, 0);
  const released = orders.filter(({ status }) => ["released", "dispatched", "delivered"].includes(status)).reduce((sum, order) => sum + order.quantity, 0);
  const rework = orders.filter(({ status }) => status === "blocked").reduce((sum, order) => sum + Math.max(0, order.quantity - (order.inspections?.at(-1)?.approved ?? 0)), 0);
  return Object.freeze({
    role: "supplier",
    organizationName: workspace.organizationName,
    title: "Visão do fornecedor",
    nextActions: buildNextActions("supplier", data),
    metrics: Object.freeze([
      metric("released-opportunities", "Oportunidades liberadas", demands.filter(({ status }) => status === "published").length, "oportunidades", "Demandas publicadas acessíveis a fornecedores ativos"),
      metric("proposal-revisions", "Versões da proposta", proposals.reduce((sum, item) => sum + item.versions.length, 0), "versões", "Versões imutáveis enviadas por esta empresa"),
      metric("committed-quantity", "Quantidade comprometida", committed, "unidades", "Quantidade dos pedidos aceitos para esta empresa"),
      metric("released-quantity", "Quantidade liberada", released, "unidades", "Pedidos aprovados em inspeção"),
      metric("rework-quantity", "Em reinspeção", rework, "unidades", "Quantidade ainda não aprovada"),
    ]),
    execution: Object.freeze({ model: null, committedQuantity: committed, releasedQuantity: released, reworkQuantity: rework, stockQuantity: null, productionQuantity: null, lots: Object.freeze([]) }),
  });
}

export function buildLiveJourney(workspace, data) {
  const { demands, proposals, orders } = data;
  const demand = [...demands].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))[0];
  const demandProposals = demand ? proposals.filter((item) => item.demandId === demand.id) : [];
  const order = demand ? orders.find((item) => item.demandId === demand.id) : orders[0];
  const inspection = order?.inspections?.at(-1);
  const completedOrder = Boolean(order);
  const released = order && ["released", "dispatched", "delivered"].includes(order.status);
  const dispatched = order && ["dispatched", "delivered"].includes(order.status);
  const delivered = order?.status === "delivered";
  const step = (id, label, status, summary, evidenceIds = []) => Object.freeze({ id, label, status, summary, evidenceIds: Object.freeze(evidenceIds) });
  return Object.freeze([
    step("demand", "Demanda", demand ? "completed" : "active", demand ? `${demand.quantity.toLocaleString("pt-BR")} unidades · ${demand.title}` : workspace.organizationRole === "supplier" ? "Aguarde uma demanda publicada e mantenha seu perfil industrial atualizado" : "Crie a primeira demanda", demand ? [demand.id] : []),
    step("match", "Oportunidade", demand && demand.status !== "draft" ? "completed" : demand ? "active" : "locked", demand && demand.status !== "draft" ? "Publicada para fornecedores autorizados" : "A publicação libera a oportunidade", demand && demand.status !== "draft" ? [demand.id] : []),
    step("proposals", "Propostas", demandProposals.length ? "completed" : demand?.status === "published" ? "active" : "locked", demandProposals.length ? `${demandProposals.length} proposta(s) recebida(s)` : "Aguardando a primeira proposta", demandProposals.map(({ id }) => id)),
    step("order", "Pedido", completedOrder ? "completed" : demandProposals.length ? "active" : "locked", completedOrder ? "Aceite único gerou o pedido" : "Depende do aceite de uma versão", order ? [order.id] : []),
    step("fulfillment", "Atendimento", completedOrder ? (released ? "completed" : "active") : "locked", completedOrder ? "Compromisso em execução pelo fornecedor" : "Disponível após o pedido", order ? [order.id] : []),
    step("quality", "Qualidade", order?.status === "blocked" ? "attention" : released ? "completed" : completedOrder ? "active" : "locked", inspection ? `${inspection.approved}/${order.quantity} unidades aprovadas` : "Inspeção ainda não registrada", inspection ? [inspection.plan] : []),
    step("qr", "QR", "locked", "Rastreabilidade por lote ainda indisponível"),
    step("delivery", "Entrega", delivered ? "completed" : dispatched ? "active" : released ? "upcoming" : "locked", delivered ? "Recebimento confirmado" : dispatched ? "Expedido; aguardando recebimento" : "Depende da liberação da qualidade", order ? [order.id] : []),
    step("evaluation", "Avaliação", order?.evaluation ? "completed" : delivered ? "active" : "locked", order?.evaluation ? `${order.evaluation.score}/5 · avaliação registrada` : "Disponível após a entrega", order?.evaluation ? [order.id] : []),
  ]);
}
