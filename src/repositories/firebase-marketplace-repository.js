import { buildLiveDashboard, buildLiveJourney } from "../domain/live-marketplace-selectors.js";
import { isSupplierIdentifier, matchSupplierToDemand } from "../domain/match-engine.js";
import { isCalendarDate, todayInSaoPaulo } from "../domain/calendar-date.js";
import { createRepositoryResult } from "./repository-result.js";
import { inspectionQuantities } from '../domain/inspection.js';
import { normalizeUnit } from '../domain/quantity.js';
import { proposalExpiry } from '../domain/proposal-expiry.js';
import { createPendingCommands } from '../core/pending-commands.js';
import { createFirebaseConversations } from "./firebase-conversations.js";

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
const draftText = (value, label, max, complete) => !complete && (value == null || String(value).trim() === '') ? '' : text(value, label, max);
const demandItems = (input, complete) => {
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
  let cumulativeQuantity = 0;
  return candidates.map((item, index) => {
    const quantity = !complete && (item.quantity == null || item.quantity === '') ? 0 : integer(item.quantity, `quantidade do item ${index + 1}`, complete ? 1 : 0);
    const certifications = listText(item.certifications ?? item.certification ?? [], 'certificação', 120);
    cumulativeQuantity += quantity;
    return {
    id: item.id ? text(item.id, "identificação do item", 120) : nextId(),
    position: index,
    cumulativeQuantity,
    description: draftText(item.description, `descrição do item ${index + 1}`, 500, complete),
    category: draftText(item.category, `categoria do item ${index + 1}`, 120, complete),
    material: draftText(item.material, `material do item ${index + 1}`, 120, complete),
    process: draftText(item.process, `processo do item ${index + 1}`, 120, complete),
    certifications,
    certificationCount: certifications.length,
    certificationPositions: certifications.map((_, position) => position),
    quantity,
    unit: normalizeUnit(draftText(item.unit ?? 'un', `unidade do item ${index + 1}`, 20, complete)),
  }; });
};
const demandFields = (input, { complete = false } = {}) => {
  const items = demandItems(input, complete);
  return {
    title: text(input.title, "título", 160),
    description: draftText(input.description, "objetivo e observações da demanda", 2000, complete),
    items,
    itemCount: items.length,
    quantity: integer(items.reduce((sum, item) => sum + item.quantity, 0), "quantidade total", complete ? 1 : 0),
    requiredBy: !complete && !input.requiredBy ? '' : date(input.requiredBy),
    destination: draftText(input.destination, "destino", 160, complete),
    region: draftText(input.region ?? input.destination, "região de entrega", 160, complete),
  };
};
const values = (record) => record && typeof record === "object" ? Object.values(record) : [];
const timestamp = (client) => client.timestamp?.() ?? Date.now();
const supplierIdentifier = (value) => {
  if (!isSupplierIdentifier(value)) {
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

export function createFirebaseMarketplaceRepository({ client, getUser, getWorkspace, storage }) {
  const cache = new Map();
  const syncWarnings = new Map();
  const pendingCreations = createPendingCommands({ storage, key: 'sivi.pending-demands.v1' });
  const pendingProposals = createPendingCommands({ storage, key: 'sivi.pending-proposals.v1' });
  const pendingInspections = createPendingCommands({ storage, key: 'sivi.pending-inspections.v1' });
  const workspace = (workspaceId, role) => {
    const current = getWorkspace(workspaceId);
    const user = getUser?.();
    if (!current || !user?.uid || current.memberUid !== user.uid || current.organizationStatus === "blocked" || current.canEnter === false || (role && current.organizationRole !== role)) fail("Este contexto não pode executar a ação.");
    return current;
  };
  const scopedPath = (kind, current) => `${kind}By${current.organizationRole === "buyer" ? "Buyer" : "Supplier"}/${current.organizationId}`;

  async function supplierDemandStates(demands) {
    const open = demands.filter(demand => demand.status === 'published');
    const lookup = async (ids, path) => new Map(await Promise.all([...new Set(ids)].map(async id =>
      [id, await client.read(path(id))])));
    const [states, buyers] = await Promise.all([
      lookup(open.map(demand => demand.id), id => `publishedDemands/${id}/status`),
      lookup(open.map(demand => demand.buyerId), id => `organizations/${id}/status`),
    ]);
    return demands.map(demand => {
      const status = states.get(demand.id);
      if (status === 'closed' || status === 'ordered') return { ...demand, status };
      const buyer = buyers.get(demand.buyerId);
      return buyer && buyer !== 'active' && demand.status === 'published' ? { ...demand, status: 'unavailable' } : demand;
    });
  }

  async function load(workspaceId) {
    const current = workspace(workspaceId);
    if (!["buyer", "supplier"].includes(current.organizationRole)) fail("Contexto indisponível.");
    const [demandRecords, proposalRecords, orderRecords, profile] = await Promise.all([
      client.read(current.organizationRole === "buyer" ? `demandsByBuyer/${current.organizationId}` : `opportunitiesBySupplier/${current.organizationId}`),
      client.read(scopedPath("proposals", current)),
      client.read(scopedPath("orders", current)),
      current.organizationRole === 'supplier' ? client.read(`supplierProfiles/${current.organizationId}`).catch(() => null) : null,
    ]);
    const proposals = values(proposalRecords).map(normalizeProposal);
    const orders = values(orderRecords).map(normalizeOrder);
    // Suppliers can read their own orders, but not publishedDemands. An accepted
    // order closes the corresponding opportunity even if its old copy remains.
    const contractedDemands = new Set(orders.map(order => order.demandId));
    const projectedDemands = values(demandRecords)
      .filter(demand => current.organizationRole === "buyer" || demand.buyerId !== current.organizationId)
      .map(demand => current.organizationRole === "supplier" && contractedDemands.has(demand.id)
        ? { ...demand, status: "ordered" }
        : current.organizationRole === 'supplier' && profile && demand.status === 'published'
          ? { ...demand, match: { ...matchSupplierToDemand(demand, profile), eligible: demand.match?.eligible === true && matchSupplierToDemand(demand, profile).eligible } }
          : demand);
    const demands = current.organizationRole === 'supplier' ? await supplierDemandStates(projectedDemands) : projectedDemands;
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
    fields.operationRevision = (order.operationRevision ?? 0) + 1;
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
      const fields = demandFields(input);
      const intent = JSON.stringify([getUser().uid, current.organizationId, input.operationId ?? fields]);
      const retryId = pendingCreations.get(intent);
      const demandId = retryId ?? client.newKey(`demandsByBuyer/${current.organizationId}`);
      pendingCreations.set(intent, demandId);
      if (retryId) {
        const existing = await client.read(`demandsByBuyer/${current.organizationId}/${demandId}`);
        if (existing?.createdBy === getUser().uid) {
          pendingCreations.delete(intent); await refreshAfterCommit(workspaceId, { demands: [existing] }); return demandId;
        }
      }
      const now = timestamp(client);
      const demand = {
        id: demandId,
        buyerId: current.organizationId,
        buyerName: current.organizationName,
        createdBy: getUser().uid,
        ...fields,
        status: "draft",
        revision: 1,
        createdAt: now,
        updatedAt: now,
      };
      await client.write(`demandsByBuyer/${current.organizationId}/${demandId}`, demand);
      pendingCreations.delete(intent);
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
      const completeSpecification = demandFields(demand, { complete: true });
      if (!Number.isFinite(demand.updatedAt)) fail("Atualize o rascunho para carregar a versão atual antes de publicar.");
      const published = { ...publicDemand(demand), ...completeSpecification, status: "published", updatedAt: timestamp(client), publicationSourceUpdatedAt: demand.updatedAt, publicationSourceRevision: demand.revision ?? 0 };
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
      const proposalId = `${demandId}_${current.organizationId}`;
      const existing = read(workspaceId).proposals.find((item) => item.id === proposalId);
      const intent = JSON.stringify([getUser().uid, current.organizationId, demandId, input]);
      const pending = pendingProposals.get(intent);
      if (pending && existing?.versions.some(version => version.id === pending.id)) {
        pendingProposals.delete(intent); return pending.id;
      }
      if (demand.status !== "published" || demand.buyerId === current.organizationId || demand.match?.eligible !== true) fail("Esta demanda não está aberta para propostas.");
      const revision = Math.max(existing?.revision ?? 0, ...(existing?.versions ?? []).map(version => version.revision), 0) + 1;
      if (pending && pending.revision !== revision) {
        pendingProposals.delete(intent);
        fail('A proposta mudou em outra sessão. Confira a versão atual antes de reenviar.');
      }
      const versionId = pending?.id ?? client.newKey(`proposalsBySupplier/${current.organizationId}/${proposalId}/versions`);
      const now = timestamp(client);
      const version = {
        id: versionId,
        revision,
        totalCents: integer(input.totalCents, "valor dos itens em centavos"),
        freightCents: integer(input.freightCents, "frete em centavos", 0),
        leadTimeDays: integer(input.leadTimeDays, "prazo em dias"),
        manufacturer: text(input.manufacturer, "fabricante", 160),
        payment: text(input.payment, "condição de pagamento", 300),
        warranty: text(input.warranty, "garantia", 500),
        technical: text(input.technical, "resposta técnica"),
        validUntil,
        expiry: proposalExpiry(validUntil),
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
        revision: version.revision,
        latestVersionId: versionId,
      };
      const updates = {};
      for (const base of [`proposalsByBuyer/${demand.buyerId}/${proposalId}`, `proposalsBySupplier/${current.organizationId}/${proposalId}`]) {
        Object.entries(proposal).filter(([key]) => !existing || ['revision', 'latestVersionId', 'updatedAt'].includes(key)).forEach(([key, value]) => { updates[`${base}/${key}`] = value; });
        updates[`${base}/versions/${versionId}`] = version;
      }
      pendingProposals.set(intent, { id: versionId, revision });
      try { await client.patch(updates); }
      catch (error) {
        if (/permission[_ -]?denied/i.test(`${error?.code} ${error?.message}`)) {
          pendingProposals.delete(intent);
          fail('Não foi possível enviar: a proposta, a oportunidade ou o acesso da empresa mudou. Atualize e confira as condições antes de tentar novamente.');
        }
        throw error;
      }
      pendingProposals.delete(intent);
      await refreshAfterCommit(workspaceId, { proposals: [{ ...existing, ...proposal, versions: [...(existing?.versions ?? []), version] }] });
      return versionId;
    },
    async closeDemand(workspaceId, demandId, reason) {
      const current = workspace(workspaceId, "buyer");
      await refresh(workspaceId);
      const demand = getDemand(workspaceId, demandId);
      if (demand.status === 'closed') return;
      if (demand.buyerId !== current.organizationId || demand.status !== 'published') fail('Somente uma demanda publicada e sem pedido pode ser encerrada.');
      const closedReason = text(reason, 'o motivo do encerramento', 300);
      if (closedReason.length < 3) fail('Informe um motivo com pelo menos 3 caracteres.');
      const now = timestamp(client);
      const fields = { status: 'closed', closedReason, closedBy: getUser().uid, closedAt: now, updatedAt: now };
      const paths = [`demandsByBuyer/${current.organizationId}/${demandId}`, `publishedDemands/${demandId}`];
      await client.patch(Object.fromEntries(paths.flatMap(path => Object.entries(fields).map(([key, value]) => [`${path}/${key}`, value]))));
      await refreshAfterCommit(workspaceId, { demands: [{ ...demand, ...fields }] });
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
        buyerName: demand.buyerName,
        supplierId: proposal.supplierId,
        supplierName: proposal.supplierName,
        sourceProposalId: proposal.id,
        title: demand.title,
        description: demand.description,
        items: clone(demand.items ?? []).map((item, position) => ({ ...item, position })),
        itemCount: demand.items?.length ?? 0,
        quantity: demand.quantity,
        destination: demand.destination,
        region: demand.region ?? demand.destination,
        requiredBy: demand.requiredBy,
        version: clone(version),
        status: "accepted",
        operationRevision: 0,
        createdAt: now,
        updatedAt: now,
      };
      const orderedDemand = { ...demand, status: "ordered", updatedAt: now };
      const updates = {
        [`ordersByBuyer/${current.organizationId}/${orderId}`]: order,
        [`ordersBySupplier/${proposal.supplierId}/${orderId}`]: order,
        [`demandsByBuyer/${current.organizationId}/${demand.id}/status`]: 'ordered',
        [`demandsByBuyer/${current.organizationId}/${demand.id}/updatedAt`]: now,
        [`publishedDemands/${demand.id}/status`]: 'ordered',
        [`publishedDemands/${demand.id}/updatedAt`]: now,
      };
      // New publications retain every recipient. For older records, close the
      // opportunities known from proposals without guessing private paths.
      let manuallyInvited = null;
      try {
        manuallyInvited = await client.read(`invitedSuppliersByBuyer/${current.organizationId}/${demand.id}`);
      } catch (error) {
        // Earlier deployed rules do not know this collection. Existing orders
        // still use the recipients recorded when their demand was published.
        if (!/permission[_ -]?denied/i.test(`${error?.code ?? ''} ${error?.message ?? ''}`)) throw error;
      }
      const recipients = new Set([
        ...values(demand.opportunitySupplierIds),
        ...Object.keys(manuallyInvited ?? {}),
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
      const intent = JSON.stringify([getUser().uid, current.organizationId, orderId, input]);
      const pending = pendingInspections.get(intent);
      if (pending && order.inspections.some(inspection => inspection.id === pending.id)) {
        pendingInspections.delete(intent); return;
      }
      if (pending && pending.revision !== (order.operationRevision ?? 0) + 1) {
        pendingInspections.delete(intent);
        fail('O pedido mudou em outra sessão. Consulte a inspeção atual antes de registrar outra.');
      }
      if (order.supplierId !== current.organizationId || !["accepted", "blocked"].includes(order.status)) fail("Pedido indisponível para inspeção.");
      const { approved, itemApprovals, complete } = inspectionQuantities(order, input);
      const inspectionId = pending?.id ?? client.newKey(`ordersBySupplier/${current.organizationId}/${orderId}/inspections`);
      let runningApproved = 0, completeThrough = true;
      const proofs = itemApprovals.map((entry, index) => {
        runningApproved += entry.approved;
        completeThrough &&= entry.approved === Number(order.items?.[index]?.quantity ?? order.quantity);
        return { ...entry, position: index, runningApproved, completeThrough };
      });
      const inspection = { id: inspectionId, approved, itemApprovals: proofs, lastItemIndex: proofs.length - 1, complete, plan: text(input.plan, "plano e versão", 160), evidence: text(input.evidence, "resultado da inspeção"), createdAt: timestamp(client) };
      const fields = { status: complete ? 'released' : 'blocked', operationRevision: (order.operationRevision ?? 0) + 1, latestInspectionId: inspectionId, updatedAt: timestamp(client) };
      const updates = orderOperationUpdates(order, fields);
      for (const base of [`ordersByBuyer/${order.buyerId}/${order.id}`, `ordersBySupplier/${order.supplierId}/${order.id}`]) updates[`${base}/inspections/${inspectionId}`] = inspection;
      pendingInspections.set(intent, { id: inspectionId, revision: fields.operationRevision });
      try { await client.patch(updates); }
      catch (error) {
        if (/permission[_ -]?denied/i.test(`${error?.code} ${error?.message}`)) {
          pendingInspections.delete(intent);
          fail('O pedido ou o acesso da empresa mudou. Atualize e confira a inspeção antes de tentar novamente.');
        }
        throw error;
      }
      pendingInspections.delete(intent);
      await refreshAfterCommit(workspaceId, { orders: [normalizeOrder({ ...order, ...fields, inspections: Object.fromEntries([...(order.inspections ?? []).map(item => [item.id, item]), [inspectionId, inspection]]) })] });
    },
    async dispatchOrder(workspaceId, orderId) {
      const current = workspace(workspaceId, "supplier");
      const order = await getOrder(workspaceId, orderId);
      if (order.supplierId === current.organizationId && ['dispatched', 'delivered'].includes(order.status)) return;
      if (order.supplierId !== current.organizationId || order.status !== "released") fail("A expedição exige um pedido liberado da sua empresa.");
      await updateOrder(workspaceId, order, { status: "dispatched", dispatchedAt: timestamp(client), updatedAt: timestamp(client) });
    },
    async confirmDelivery(workspaceId, orderId) {
      const current = workspace(workspaceId, "buyer");
      const order = await getOrder(workspaceId, orderId);
      if (order.buyerId === current.organizationId && order.status === 'delivered') return;
      if (order.buyerId !== current.organizationId || order.status !== "dispatched") fail("Somente pedidos expedidos da sua empresa podem ser recebidos.");
      await updateOrder(workspaceId, order, { status: "delivered", deliveredAt: timestamp(client), updatedAt: timestamp(client) });
    },
    async evaluateOrder(workspaceId, orderId, input) {
      const current = workspace(workspaceId, "buyer");
      const order = await getOrder(workspaceId, orderId);
      if (order.buyerId !== current.organizationId || order.status !== "delivered") fail("Avaliação indisponível.");
      let evaluation;
      if (input.criteria) {
        const criteria = Object.fromEntries(["quality", "punctuality", "communication", "documentation"].map((key) => {
          const value = integer(input.criteria[key], `nota de ${key}`);
          if (value > 5) fail("Cada critério deve receber uma nota de 1 a 5.");
          return [key, value];
        }));
        const comment = String(input.comment ?? "").trim();
        if (comment.length > 1000) fail("O comentário deve ter no máximo 1.000 caracteres.");
        const score = Math.round(Object.values(criteria).reduce((sum, value) => sum + value, 0) / 4 * 10) / 10;
        evaluation = { score, comment, criteria, evaluatedAt: timestamp(client) };
      } else {
        const score = integer(input.score, "nota");
        if (score > 5) fail("A nota deve ser de 1 a 5.");
        evaluation = { score, comment: text(input.comment, "comentário", 1000) };
      }
      if (order.evaluation) {
        const same = order.evaluation.score === evaluation.score && order.evaluation.comment === evaluation.comment
          && ['quality','punctuality','communication','documentation'].every(key => order.evaluation.criteria?.[key] === evaluation.criteria?.[key]);
        if (same) return;
        fail('Avaliação indisponível. Este pedido já foi avaliado.');
      }
      await updateOrder(workspaceId, order, { evaluation, updatedAt: timestamp(client) });
    },
  });

  return Object.freeze({
    workflow,
    conversations: createFirebaseConversations(client, workspace),
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
    async getBuyerRecommendations(workspaceId) {
      const current = workspace(workspaceId, "buyer");
      const published = read(workspaceId).demands
        .filter((demand) => demand.status === "published")
        .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))[0];
      if (!published) return [];
      const profiles = values(await client.read("supplierProfiles"))
        .filter((profile) => profile.organizationStatus === "active" && profile.organizationId !== current.organizationId);
      return profiles.map((profile) => ({ profile, match: matchSupplierToDemand(published, profile) }))
        .filter(({ match }) => match.eligible)
        .sort((a, b) => Number(b.match.status === "compatible") - Number(a.match.status === "compatible") ||
          b.match.criteria.filter(item => item.state === "met").length - a.match.criteria.filter(item => item.state === "met").length);
    },
    async listSupplierProfiles(workspaceId) {
      const current = workspace(workspaceId, "buyer");
      return values(await client.read("supplierProfiles"))
        .filter((profile) => profile.organizationStatus === "active" && profile.organizationId !== current.organizationId)
        .sort((a, b) => String(a.organizationName).localeCompare(String(b.organizationName), "pt-BR"));
    },
    async getBuyerSupplierProfile(workspaceId, supplierId) {
      const current = workspace(workspaceId, "buyer");
      const id = supplierIdentifier(supplierId);
      if (id === current.organizationId) return null;
      const profile = await client.read(`supplierProfiles/${id}`);
      return profile?.organizationStatus === "active" && profile.organizationId === id ? profile : null;
    },
    async getBuyerInvitations(workspaceId, demandId) {
      const current = workspace(workspaceId, "buyer");
      const demand = getDemand(workspaceId, demandId);
      if (demand.buyerId !== current.organizationId || demand.status !== "published") fail("Demanda indisponível.");
      const invited = await client.read(`invitedSuppliersByBuyer/${current.organizationId}/${demandId}`);
      return [...new Set([...values(demand.opportunitySupplierIds), ...Object.keys(invited ?? {})])];
    },
    async reassessDemand(workspaceId, demandId) {
      const current = workspace(workspaceId, 'buyer');
      await refresh(workspaceId);
      const demand = getDemand(workspaceId, demandId);
      if (demand.status !== 'published' || demand.buyerId !== current.organizationId) fail('Atualize a compatibilidade somente de uma demanda publicada e aberta da sua empresa.');
      const [profiles, invitations] = await Promise.all([client.read('supplierProfiles'), client.read(`invitedSuppliersByBuyer/${current.organizationId}/${demandId}`)]);
      const known = new Set([...values(demand.opportunitySupplierIds), ...Object.keys(invitations ?? {})]);
      const updates = {};
      let eligible = 0;
      for (const profile of values(profiles)) {
        if (profile.organizationId === current.organizationId) continue;
        const id = supplierIdentifier(profile.organizationId);
        const calculated = matchSupplierToDemand(demand, profile);
        const match = { ...clone(calculated), ...(profile.organizationStatus === 'active' ? {} : { eligible: false, status: 'ineligible', explanation: 'O fornecedor não está ativo para novas negociações.' }), buyerId: current.organizationId, createdAt: timestamp(client) };
        if (match.eligible) eligible++;
        if (!match.eligible && !known.has(id)) continue;
        updates[`matchesByDemand/${demandId}/${id}`] = match;
        updates[`opportunitiesBySupplier/${id}/${demandId}`] = { ...publicDemand(demand), match };
        if (match.eligible && !known.has(id)) updates[`invitedSuppliersByBuyer/${current.organizationId}/${demandId}/${id}`] = true;
      }
      if (Object.keys(updates).length) await client.patch(updates);
      return { eligible };
    },
    async inviteSupplierToDemand(workspaceId, demandId, supplierId) {
      const current = workspace(workspaceId, "buyer");
      await refresh(workspaceId);
      const demand = getDemand(workspaceId, demandId);
      if (demand.buyerId !== current.organizationId || demand.status !== "published") fail("Selecione uma demanda publicada da sua empresa.");
      const validSupplierId = supplierIdentifier(supplierId);
      if (validSupplierId === current.organizationId) fail("Selecione outra empresa fornecedora.");
      const profile = await client.read(`supplierProfiles/${validSupplierId}`);
      if (!profile || profile.organizationStatus !== "active" || profile.organizationId !== validSupplierId) fail("Este fornecedor não está disponível.");
      const match = matchSupplierToDemand(demand, profile);
      if (!match.eligible) fail("O perfil não atende aos critérios essenciais desta demanda.");
      const alreadyInvited = await client.read(`invitedSuppliersByBuyer/${current.organizationId}/${demandId}/${validSupplierId}`);
      if (values(demand.opportunitySupplierIds).includes(validSupplierId) || alreadyInvited === true) return { alreadyAvailable: true };
      const storedMatch = { ...clone(match), buyerId: current.organizationId, createdAt: timestamp(client) };
      await client.patch({
        [`invitedSuppliersByBuyer/${current.organizationId}/${demandId}/${validSupplierId}`]: true,
        [`matchesByDemand/${demandId}/${validSupplierId}`]: storedMatch,
        [`opportunitiesBySupplier/${validSupplierId}/${demandId}`]: { ...publicDemand(demand), match: storedMatch },
      });
      return { alreadyAvailable: false };
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
