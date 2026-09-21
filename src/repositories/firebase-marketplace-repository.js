import { buildLiveDashboard, buildLiveJourney } from "../domain/live-marketplace-selectors.js";
import { matchSupplierToDemand } from "../domain/match-engine.js";
import { createRepositoryResult } from "./repository-result.js";

const clone = (value) => structuredClone(value);
const fail = (message) => { throw new Error(message); };
const text = (value, label, max = 2000) => {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized || normalized.length > max) fail(`Informe ${label} válido.`);
  return normalized;
};
const integer = (value, label, min = 1) => {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < min || number > 1000000000) fail(`Informe ${label} válido.`);
  return number;
};
const date = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "") || Number.isNaN(Date.parse(value))) fail("Informe uma data válida.");
  return value;
};
const listText = (value, label, max = 120) => {
  const items = (Array.isArray(value) ? value : String(value ?? "").split(","))
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .map((item) => text(item, label, max));
  return [...new Set(items)];
};
const demandItems = (input) => {
  const candidates = Array.isArray(input?.items) && input.items.length
    ? input.items
    : [{
        description: input?.description,
        category: input?.category ?? "componentes industriais",
        material: input?.material ?? "não informado",
        process: input?.process ?? "não informado",
        certifications: input?.certifications ?? [],
        quantity: input?.quantity,
        unit: input?.unit ?? "un",
      }];
  return candidates.map((item, index) => ({
    id: item.id ?? `item-${index + 1}`,
    description: text(item.description, `descrição do item ${index + 1}`, 500),
    category: text(item.category, `categoria do item ${index + 1}`, 120),
    material: text(item.material, `material do item ${index + 1}`, 120),
    process: text(item.process, `processo do item ${index + 1}`, 120),
    certifications: listText(item.certifications ?? item.certification ?? [], "certificação", 120),
    quantity: integer(item.quantity, `quantidade do item ${index + 1}`),
    unit: text(item.unit, `unidade do item ${index + 1}`, 20),
  }));
};
const values = (record) => record && typeof record === "object" ? Object.values(record) : [];
const timestamp = (client) => client.timestamp?.() ?? Date.now();

function normalizeProposal(proposal) {
  return {
    ...proposal,
    versions: values(proposal.versions).sort((left, right) => left.revision - right.revision),
  };
}

function normalizeOrder(order) {
  return {
    ...order,
    inspections: values(order.inspections).sort((left, right) => (left.createdAt ?? 0) - (right.createdAt ?? 0)),
  };
}

function meta() {
  return Object.freeze({
    source: "Registros da empresa",
    period: "Dados atuais",
    asOf: new Date().toISOString(),
    securityNotice: "Dados persistidos e isolados pelo contexto da empresa ativa.",
  });
}

export function createFirebaseMarketplaceRepository({ client, getUser, getWorkspace }) {
  const cache = new Map();
  const workspace = (workspaceId, role) => {
    const current = getWorkspace(workspaceId);
    const user = getUser?.();
    if (!current || !user?.uid || current.memberUid !== user.uid || current.organizationStatus === "blocked" || current.canEnter === false || (role && current.organizationRole !== role)) fail("Este contexto não pode executar a ação.");
    return current;
  };
  const scopedPath = (kind, current) => `${kind}By${current.organizationRole === "buyer" ? "Buyer" : "Supplier"}/${current.organizationId}`;

  async function load(workspaceId) {
    const current = workspace(workspaceId);
    if (!["buyer", "supplier"].includes(current.organizationRole)) fail("Contexto indisponível.");
    const [demandRecords, proposalRecords, orderRecords] = await Promise.all([
      client.read(current.organizationRole === "buyer" ? `demandsByBuyer/${current.organizationId}` : `opportunitiesBySupplier/${current.organizationId}`),
      client.read(scopedPath("proposals", current)),
      client.read(scopedPath("orders", current)),
    ]);
    const proposals = values(proposalRecords).map(normalizeProposal);
    const orders = values(orderRecords).map(normalizeOrder);
    const demands = values(demandRecords).filter((demand) => current.organizationRole === "buyer" || demand.buyerId !== current.organizationId);
    const suppliers = new Map();
    proposals.forEach((item) => suppliers.set(item.supplierId, { id: item.supplierId, name: item.supplierName }));
    orders.forEach((item) => suppliers.set(item.supplierId, { id: item.supplierId, name: item.supplierName }));
    const data = { demands, proposals, orders, suppliers: [...suppliers.values()] };
    cache.set(workspaceId, data);
    return data;
  }

  const read = (workspaceId) => clone(cache.get(workspaceId) ?? { demands: [], proposals: [], orders: [], suppliers: [] });
  const refresh = async (workspaceId) => { await load(workspaceId); };
  const getDemand = (workspaceId, demandId) => read(workspaceId).demands.find((item) => item.id === demandId) ?? fail("Demanda não encontrada.");
  const getOrder = async (workspaceId, orderId) => {
    await refresh(workspaceId);
    const order = read(workspaceId).orders.find((item) => item.id === orderId);
    return order ?? fail("Pedido não encontrado.");
  };

  const workflow = Object.freeze({
    read,
    async createDemand(workspaceId, input) {
      const current = workspace(workspaceId, "buyer");
      const demandId = client.newKey(`demandsByBuyer/${current.organizationId}`);
      const now = timestamp(client);
      const items = demandItems(input);
      const demand = {
        id: demandId,
        buyerId: current.organizationId,
        buyerName: current.organizationName,
        createdBy: getUser().uid,
        title: text(input.title, "título", 160),
        description: text(input.description, "objetivo e observações da demanda"),
        items,
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        requiredBy: date(input.requiredBy),
        destination: text(input.destination, "destino", 160),
        region: text(input.region ?? input.destination, "região de entrega", 160),
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };
      await client.write(`demandsByBuyer/${current.organizationId}/${demandId}`, demand);
      await refresh(workspaceId);
      return demandId;
    },
    async publishDemand(workspaceId, demandId) {
      const current = workspace(workspaceId, "buyer");
      await refresh(workspaceId);
      const demand = getDemand(workspaceId, demandId);
      if (demand.buyerId !== current.organizationId || demand.status !== "draft") fail("Somente um rascunho da sua empresa pode ser publicado.");
      const published = { ...demand, status: "published", updatedAt: timestamp(client) };
      const profiles = values(await client.read("supplierProfiles"))
        .filter((profile) => profile.organizationStatus === "active" && profile.organizationId !== current.organizationId);
      const matches = profiles.map((profile) => matchSupplierToDemand(published, profile));
      const updates = {
        [`demandsByBuyer/${current.organizationId}/${demandId}`]: published,
        [`publishedDemands/${demandId}`]: published,
      };
      for (const match of matches) {
        const storedMatch = { ...clone(match), buyerId: current.organizationId, createdAt: timestamp(client) };
        updates[`matchesByDemand/${demandId}/${match.supplierId}`] = storedMatch;
        if (match.eligible) updates[`opportunitiesBySupplier/${match.supplierId}/${demandId}`] = { ...published, match: storedMatch };
      }
      await client.patch(updates);
      await refresh(workspaceId);
    },
    async sendProposal(workspaceId, demandId, input) {
      const current = workspace(workspaceId, "supplier");
      await refresh(workspaceId);
      const demand = getDemand(workspaceId, demandId);
      if (demand.status !== "published" || demand.buyerId === current.organizationId || demand.match?.eligible !== true) fail("Esta demanda não está aberta para propostas.");
      const proposalId = `${demandId}_${current.organizationId}`;
      const existing = read(workspaceId).proposals.find((item) => item.id === proposalId);
      const versionId = client.newKey(`proposalsBySupplier/${current.organizationId}/${proposalId}/versions`);
      const now = timestamp(client);
      const version = {
        id: versionId,
        revision: (existing?.versions.length ?? 0) + 1,
        totalCents: integer(input.totalCents, "valor dos itens em centavos"),
        freightCents: integer(input.freightCents, "frete em centavos", 0),
        leadTimeDays: integer(input.leadTimeDays, "prazo em dias"),
        manufacturer: text(input.manufacturer, "fabricante", 160),
        payment: text(input.payment, "condição de pagamento", 300),
        warranty: text(input.warranty, "garantia", 500),
        technical: text(input.technical, "resposta técnica"),
        validUntil: date(input.validUntil),
        createdAt: now,
      };
      const proposal = {
        id: proposalId,
        demandId,
        buyerId: demand.buyerId,
        buyerName: demand.buyerName,
        supplierId: current.organizationId,
        supplierName: current.organizationName,
        updatedAt: now,
      };
      const updates = {};
      for (const base of [`proposalsByBuyer/${demand.buyerId}/${proposalId}`, `proposalsBySupplier/${current.organizationId}/${proposalId}`]) {
        Object.entries(proposal).forEach(([key, value]) => { updates[`${base}/${key}`] = value; });
        updates[`${base}/versions/${versionId}`] = version;
      }
      await client.patch(updates);
      await refresh(workspaceId);
      return versionId;
    },
    async acceptProposal(workspaceId, proposalId, versionId) {
      const current = workspace(workspaceId, "buyer");
      await refresh(workspaceId);
      const data = read(workspaceId);
      const proposal = data.proposals.find((item) => item.id === proposalId) ?? fail("Proposta não encontrada.");
      const demand = data.demands.find((item) => item.id === proposal.demandId) ?? fail("Demanda não encontrada.");
      if (demand.buyerId !== current.organizationId) fail("Proposta de outra empresa.");
      const orderId = `order_${demand.id}`;
      const existing = data.orders.find((item) => item.id === orderId);
      if (existing) {
        if (existing.version.id === versionId) return orderId;
        fail("Esta demanda já possui um pedido.");
      }
      const version = proposal.versions.at(-1);
      if (version?.id !== versionId) fail("A proposta mudou. Reabra a versão mais recente antes de aceitar.");
      if (version.validUntil < new Date().toISOString().slice(0, 10)) fail("Esta proposta venceu. Solicite uma nova versão.");
      if (demand.status !== "published") fail("Demanda indisponível para aceite.");
      const now = timestamp(client);
      const order = {
        id: orderId,
        demandId: demand.id,
        buyerId: current.organizationId,
        buyerName: current.organizationName,
        supplierId: proposal.supplierId,
        supplierName: proposal.supplierName,
        sourceProposalId: proposal.id,
        title: demand.title,
        description: demand.description,
        items: clone(demand.items ?? []),
        quantity: demand.quantity,
        version: clone(version),
        status: "accepted",
        createdAt: now,
        updatedAt: now,
      };
      const orderedDemand = { ...demand, status: "ordered", updatedAt: now };
      await client.patch({
        [`ordersByBuyer/${current.organizationId}/${orderId}`]: order,
        [`ordersBySupplier/${proposal.supplierId}/${orderId}`]: order,
        [`demandsByBuyer/${current.organizationId}/${demand.id}`]: orderedDemand,
        [`publishedDemands/${demand.id}`]: orderedDemand,
      });
      await refresh(workspaceId);
      return orderId;
    },
    async recordInspection(workspaceId, orderId, input) {
      const current = workspace(workspaceId, "supplier");
      const order = await getOrder(workspaceId, orderId);
      if (order.supplierId !== current.organizationId || !["accepted", "blocked"].includes(order.status)) fail("Pedido indisponível para inspeção.");
      const approved = integer(input.approved, "quantidade aprovada", 0);
      if (approved > order.quantity) fail("Quantidade aprovada maior que o pedido.");
      const inspectionId = client.newKey(`ordersBySupplier/${current.organizationId}/${orderId}/inspections`);
      const inspections = Object.fromEntries([
        ...(order.inspections ?? []).map((inspection) => [inspection.id, inspection]),
        [inspectionId, { id: inspectionId, approved, plan: text(input.plan, "plano e versão", 160), evidence: text(input.evidence, "resultado da inspeção"), createdAt: timestamp(client) }],
      ]);
      const updated = { ...order, inspections, status: approved === order.quantity ? "released" : "blocked", updatedAt: timestamp(client) };
      await client.patch({ [`ordersByBuyer/${order.buyerId}/${orderId}`]: updated, [`ordersBySupplier/${current.organizationId}/${orderId}`]: updated });
      await refresh(workspaceId);
    },
    async dispatchOrder(workspaceId, orderId) {
      const current = workspace(workspaceId, "supplier");
      const order = await getOrder(workspaceId, orderId);
      if (order.supplierId !== current.organizationId || order.status !== "released") fail("A expedição exige um pedido liberado da sua empresa.");
      const updated = { ...order, status: "dispatched", dispatchedAt: timestamp(client), updatedAt: timestamp(client) };
      await client.patch({ [`ordersByBuyer/${order.buyerId}/${orderId}`]: updated, [`ordersBySupplier/${current.organizationId}/${orderId}`]: updated });
      await refresh(workspaceId);
    },
    async confirmDelivery(workspaceId, orderId) {
      const current = workspace(workspaceId, "buyer");
      const order = await getOrder(workspaceId, orderId);
      if (order.buyerId !== current.organizationId || order.status !== "dispatched") fail("Somente pedidos expedidos da sua empresa podem ser recebidos.");
      const updated = { ...order, status: "delivered", deliveredAt: timestamp(client), updatedAt: timestamp(client) };
      await client.patch({ [`ordersByBuyer/${current.organizationId}/${orderId}`]: updated, [`ordersBySupplier/${order.supplierId}/${orderId}`]: updated });
      await refresh(workspaceId);
    },
    async evaluateOrder(workspaceId, orderId, input) {
      const current = workspace(workspaceId, "buyer");
      const order = await getOrder(workspaceId, orderId);
      if (order.buyerId !== current.organizationId || order.status !== "delivered" || order.evaluation) fail("Avaliação indisponível.");
      const score = integer(input.score, "nota");
      if (score > 5) fail("A nota deve ser de 1 a 5.");
      const updated = { ...order, evaluation: { score, comment: text(input.comment, "comentário", 1000) }, updatedAt: timestamp(client) };
      await client.patch({ [`ordersByBuyer/${current.organizationId}/${orderId}`]: updated, [`ordersBySupplier/${order.supplierId}/${orderId}`]: updated });
      await refresh(workspaceId);
    },
  });

  return Object.freeze({
    workflow,
    async getOperations(workspaceId) {
      try {
        const data = await load(workspaceId);
        return createRepositoryResult("ready", { data, meta: meta() });
      } catch (error) {
        if (/contexto|sessão/i.test(error.message)) return createRepositoryResult("forbidden", { error, meta: meta() });
        return createRepositoryResult("error", { error, meta: meta() });
      }
    },
    async getDashboard(workspaceId) {
      try {
        const current = workspace(workspaceId);
        const data = await load(workspaceId);
        return createRepositoryResult("ready", { data: buildLiveDashboard(current, data), meta: meta() });
      } catch (error) {
        return createRepositoryResult("error", { error, meta: meta() });
      }
    },
    async getIndustrialJourney(workspaceId) {
      try {
        const current = workspace(workspaceId);
        const data = cache.get(workspaceId) ?? await load(workspaceId);
        return createRepositoryResult("ready", { data: buildLiveJourney(current, data), meta: meta() });
      } catch (error) {
        return createRepositoryResult("error", { error, meta: meta() });
      }
    },
    async reset() { cache.clear(); },
  });
}
