import { buildLiveDashboard, buildLiveJourney } from "../domain/live-marketplace-selectors.js";
import { matchSupplierToDemand } from "../domain/match-engine.js";
import { isCalendarDate, todayInSaoPaulo } from "../domain/calendar-date.js";
import { createRepositoryResult } from "./repository-result.js";
import { inspectionQuantities } from '../domain/inspection.js';

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
  if (!isCalendarDate(value)) fail("Informe uma data válida.");
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
  const explicitIds = candidates.filter(item => item.id).map(item => text(item.id, 'identificação do item', 120));
  const usedIds = new Set(explicitIds);
  if (usedIds.size !== explicitIds.length) fail("Os itens da demanda devem ter identificadores diferentes.");
  let sequence = 0;
  const nextId = () => {
    let id;
    do { id = `item-${++sequence}`; } while (usedIds.has(id));
    usedIds.add(id);
    return id;
  };
  return candidates.map((item, index) => ({
    id: item.id ? text(item.id, "identificação do item", 120) : nextId(),
    description: text(item.description, `descrição do item ${index + 1}`, 500),
    category: text(item.category, `categoria do item ${index + 1}`, 120),
    material: text(item.material, `material do item ${index + 1}`, 120),
    process: text(item.process, `processo do item ${index + 1}`, 120),
    certifications: listText(item.certifications ?? item.certification ?? [], "certificação", 120),
    quantity: integer(item.quantity, `quantidade do item ${index + 1}`),
    unit: text(item.unit, `unidade do item ${index + 1}`, 20),
  }));
};
const demandFields = (input) => {
  const items = demandItems(input);
  return {
    title: text(input.title, "título", 160),
    description: text(input.description, "objetivo e observações da demanda"),
    items,
    quantity: integer(items.reduce((sum, item) => sum + item.quantity, 0), "quantidade total"),
    requiredBy: date(input.requiredBy),
    destination: text(input.destination, "destino", 160),
    region: text(input.region ?? input.destination, "região de entrega", 160),
  };
};
const values = (record) => record && typeof record === "object" ? Object.values(record) : [];
const timestamp = (client) => client.timestamp?.() ?? Date.now();
const supplierIdentifier = (value) => {
  if (typeof value !== 'string' || !value || value.length > 120 || value !== value.trim() || /[.#$\[\]/\u0000-\u001f\u007f]/.test(value)) {
    fail('Identificação de fornecedor inválida. Atualize os perfis antes de publicar.');
  }
  return value;
};
// Delivery recipients belong to the buyer's record, not the supplier snapshot.
const publicDemand = ({ opportunitySupplierIds, ...demand }) => demand;

// Existing orders only permit operational child writes. Keep both projections
// in one atomic update without resending the accepted commercial snapshot.
function orderOperationUpdates(order, fields) {
  return Object.fromEntries([
    `ordersByBuyer/${order.buyerId}/${order.id}`,
    `ordersBySupplier/${order.supplierId}/${order.id}`,
  ].flatMap(path => Object.entries(fields).map(([field, value]) => [`${path}/${field}`, value])));
}

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
  const syncWarnings = new Map();
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
    // Suppliers can read their own orders, but not publishedDemands. An accepted
    // order closes the corresponding opportunity even if its old copy remains.
    const contractedDemands = new Set(orders.map(order => order.demandId));
    const demands = values(demandRecords)
      .filter(demand => current.organizationRole === "buyer" || demand.buyerId !== current.organizationId)
      .map(demand => current.organizationRole === "supplier" && contractedDemands.has(demand.id)
        ? { ...demand, status: "ordered" }
        : demand);
    const suppliers = new Map();
    proposals.forEach((item) => suppliers.set(item.supplierId, { id: item.supplierId, name: item.supplierName }));
    orders.forEach((item) => suppliers.set(item.supplierId, { id: item.supplierId, name: item.supplierName }));
    const data = { demands, proposals, orders, suppliers: [...suppliers.values()] };
    cache.set(workspaceId, data);
    syncWarnings.delete(workspaceId);
    return data;
  }

  const read = (workspaceId) => clone(cache.get(workspaceId) ?? { demands: [], proposals: [], orders: [], suppliers: [] });
  const refresh = async (workspaceId) => { await load(workspaceId); };
  async function refreshAfterCommit(workspaceId, changes) {
    // The server already confirmed the write. Keep that result visible if a
    // subsequent read fails, so the user is not invited to repeat the write.
    const data = read(workspaceId);
    for (const [collection, records] of Object.entries(changes)) {
      const merged = new Map(data[collection].map(record => [record.id, record]));
      records.forEach(record => merged.set(record.id, clone(record)));
      data[collection] = [...merged.values()];
    }
    const suppliers = new Map(data.suppliers.map(supplier => [supplier.id, supplier]));
    [...data.proposals, ...data.orders].forEach(item => suppliers.set(item.supplierId, { id: item.supplierId, name: item.supplierName }));
    data.suppliers = [...suppliers.values()];
    cache.set(workspaceId, data);
    try {
      await refresh(workspaceId);
    } catch {
      syncWarnings.set(workspaceId, "Os dados foram salvos. A atualização da lista está pendente; atualize a página antes de continuar.");
    }
  }
  async function updateOrder(workspaceId, order, fields) {
    await client.patch(orderOperationUpdates(order, fields));
    await refreshAfterCommit(workspaceId, { orders: [normalizeOrder({ ...order, ...fields })] });
  }
  const getDemand = (workspaceId, demandId) => read(workspaceId).demands.find((item) => item.id === demandId) ?? fail("Demanda não encontrada.");
  const getOrder = async (workspaceId, orderId) => {
    await refresh(workspaceId);
    const order = read(workspaceId).orders.find((item) => item.id === orderId);
    return order ?? fail("Pedido não encontrado.");
  };

  const workflow = Object.freeze({
    read,
    getSyncWarning: (workspaceId) => syncWarnings.get(workspaceId) ?? null,
    async createDemand(workspaceId, input) {
      const current = workspace(workspaceId, "buyer");
      const demandId = client.newKey(`demandsByBuyer/${current.organizationId}`);
      const now = timestamp(client);
      const demand = {
        id: demandId,
        buyerId: current.organizationId,
        buyerName: current.organizationName,
        createdBy: getUser().uid,
        ...demandFields(input),
        status: "draft",
        revision: 1,
        createdAt: now,
        updatedAt: now,
      };
      await client.write(`demandsByBuyer/${current.organizationId}/${demandId}`, demand);
      await refreshAfterCommit(workspaceId, { demands: [demand] });
      return demandId;
    },
    async updateDemand(workspaceId, demandId, input, expectedUpdatedAt, expectedRevision) {
      const current = workspace(workspaceId, "buyer");
      await refresh(workspaceId);
      getDemand(workspaceId, demandId);
      const fields = demandFields(input);
      if (!Number.isFinite(expectedUpdatedAt)) fail("Reabra o rascunho para carregar a versão atual.");
      let conflict = "";
      const result = await client.transaction(`demandsByBuyer/${current.organizationId}/${demandId}`, (stored) => {
        conflict = "";
        // An empty local cache must still let Firebase check the server and retry.
        if (stored === null) return null;
        if (stored.buyerId !== current.organizationId || stored.status !== "draft") {
          conflict = "Somente um rascunho da sua empresa pode ser editado. A demanda pode ter sido publicada.";
          return undefined;
        }
        if (stored.updatedAt !== expectedUpdatedAt || (expectedRevision !== undefined && (stored.revision ?? 0) !== expectedRevision)) {
          conflict = "Este rascunho foi alterado em outra sessão. Atualize a página antes de editar novamente.";
          return undefined;
        }
        // Revision advances independently of Firebase's server timestamp marker.
        return { ...stored, ...fields, revision: (stored.revision ?? 0) + 1, updatedAt: timestamp(client) };
      });
      if (!result.committed) fail(conflict || "Não foi possível salvar. Atualize o rascunho e tente novamente.");
      if (!result.value) fail("Demanda não encontrada.");
      await refreshAfterCommit(workspaceId, { demands: [result.value] });
      return demandId;
    },
    async publishDemand(workspaceId, demandId) {
      const current = workspace(workspaceId, "buyer");
      await refresh(workspaceId);
      const demand = getDemand(workspaceId, demandId);
      if (demand.buyerId !== current.organizationId || demand.status !== "draft") fail("Somente um rascunho da sua empresa pode ser publicado.");
      if (!Number.isFinite(demand.updatedAt)) fail("Atualize o rascunho para carregar a versão atual antes de publicar.");
      const published = { ...publicDemand(demand), status: "published", updatedAt: timestamp(client), publicationSourceUpdatedAt: demand.updatedAt, publicationSourceRevision: demand.revision ?? 0 };
      const profiles = values(await client.read("supplierProfiles"))
        .filter((profile) => profile.organizationStatus === "active" && profile.organizationId !== current.organizationId);
      const matches = profiles.map((profile) => {
        supplierIdentifier(profile.organizationId);
        return matchSupplierToDemand(published, profile);
      });
      const buyerDemand = { ...published, opportunitySupplierIds: [...new Set(matches.filter(match => match.eligible).map(match => match.supplierId))] };
      const updates = {
        [`demandsByBuyer/${current.organizationId}/${demandId}`]: buyerDemand,
        [`publishedDemands/${demandId}`]: published,
      };
      for (const match of matches) {
        const storedMatch = { ...clone(match), buyerId: current.organizationId, createdAt: timestamp(client) };
        updates[`matchesByDemand/${demandId}/${match.supplierId}`] = storedMatch;
        if (match.eligible) updates[`opportunitiesBySupplier/${match.supplierId}/${demandId}`] = { ...published, match: storedMatch };
      }
      try {
        // The revision precondition in database.rules.json rejects this entire
        // fan-out if another session edited or published the draft meanwhile.
        await client.patch(updates);
      } catch (error) {
        if (/permission[_ -]?denied/i.test(`${error.code ?? ''} ${error.message ?? ''}`)) {
          try { await refresh(workspaceId); } catch { throw error; }
          const latest = getDemand(workspaceId, demandId);
          if (latest.status !== 'draft') fail('Esta demanda já foi publicada ou contratada. A lista foi atualizada.');
          if (latest.updatedAt !== demand.updatedAt || (latest.revision ?? 0) !== (demand.revision ?? 0)) fail('Este rascunho foi alterado em outra sessão. A lista foi atualizada; confira a versão antes de publicar.');
        }
        throw error;
      }
      await refreshAfterCommit(workspaceId, { demands: [buyerDemand] });
    },
    async sendProposal(workspaceId, demandId, input) {
      const current = workspace(workspaceId, "supplier");
      const validUntil = date(input.validUntil);
      if (validUntil < todayInSaoPaulo()) fail("A validade da proposta deve ser hoje ou uma data futura.");
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
        validUntil,
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
      await refreshAfterCommit(workspaceId, { proposals: [{ ...existing, ...proposal, versions: [...(existing?.versions ?? []), version] }] });
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
      if (date(version.validUntil) < todayInSaoPaulo()) fail("Esta proposta venceu. Solicite uma nova versão.");
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
        destination: demand.destination,
        region: demand.region ?? demand.destination,
        requiredBy: demand.requiredBy,
        version: clone(version),
        status: "accepted",
        createdAt: now,
        updatedAt: now,
      };
      const orderedDemand = { ...demand, status: "ordered", updatedAt: now };
      const updates = {
        [`ordersByBuyer/${current.organizationId}/${orderId}`]: order,
        [`ordersBySupplier/${proposal.supplierId}/${orderId}`]: order,
        [`demandsByBuyer/${current.organizationId}/${demand.id}`]: orderedDemand,
        [`publishedDemands/${demand.id}`]: publicDemand(orderedDemand),
      };
      // New publications retain every recipient. For older records, close the
      // opportunities known from proposals without guessing private paths.
      const recipients = new Set([
        ...values(demand.opportunitySupplierIds),
        ...data.proposals.filter(item => item.demandId === demand.id).map(item => item.supplierId),
        proposal.supplierId,
      ]);
      for (const supplierId of recipients) {
        const path = `opportunitiesBySupplier/${supplierIdentifier(supplierId)}/${demand.id}`;
        updates[`${path}/status`] = 'ordered';
        updates[`${path}/updatedAt`] = now;
      }
      await client.patch(updates);
      await refreshAfterCommit(workspaceId, { demands: [orderedDemand], orders: [normalizeOrder(order)] });
      return orderId;
    },
    async recordInspection(workspaceId, orderId, input) {
      const current = workspace(workspaceId, "supplier");
      const order = await getOrder(workspaceId, orderId);
      if (order.supplierId !== current.organizationId || !["accepted", "blocked"].includes(order.status)) fail("Pedido indisponível para inspeção.");
      const { approved, itemApprovals, complete } = inspectionQuantities(order, input);
      const inspectionId = client.newKey(`ordersBySupplier/${current.organizationId}/${orderId}/inspections`);
      const inspections = Object.fromEntries([
        ...(order.inspections ?? []).map((inspection) => [inspection.id, inspection]),
        [inspectionId, { id: inspectionId, approved, itemApprovals, plan: text(input.plan, "plano e versão", 160), evidence: text(input.evidence, "resultado da inspeção"), createdAt: timestamp(client) }],
      ]);
      await updateOrder(workspaceId, order, { inspections, status: complete ? "released" : "blocked", updatedAt: timestamp(client) });
    },
    async dispatchOrder(workspaceId, orderId) {
      const current = workspace(workspaceId, "supplier");
      const order = await getOrder(workspaceId, orderId);
      if (order.supplierId !== current.organizationId || order.status !== "released") fail("A expedição exige um pedido liberado da sua empresa.");
      await updateOrder(workspaceId, order, { status: "dispatched", dispatchedAt: timestamp(client), updatedAt: timestamp(client) });
    },
    async confirmDelivery(workspaceId, orderId) {
      const current = workspace(workspaceId, "buyer");
      const order = await getOrder(workspaceId, orderId);
      if (order.buyerId !== current.organizationId || order.status !== "dispatched") fail("Somente pedidos expedidos da sua empresa podem ser recebidos.");
      await updateOrder(workspaceId, order, { status: "delivered", deliveredAt: timestamp(client), updatedAt: timestamp(client) });
    },
    async evaluateOrder(workspaceId, orderId, input) {
      const current = workspace(workspaceId, "buyer");
      const order = await getOrder(workspaceId, orderId);
      if (order.buyerId !== current.organizationId || order.status !== "delivered" || order.evaluation) fail("Avaliação indisponível.");
      const score = integer(input.score, "nota");
      if (score > 5) fail("A nota deve ser de 1 a 5.");
      await updateOrder(workspaceId, order, { evaluation: { score, comment: text(input.comment, "comentário", 1000) }, updatedAt: timestamp(client) });
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
    async reset() { cache.clear(); syncWarnings.clear(); },
  });
}
