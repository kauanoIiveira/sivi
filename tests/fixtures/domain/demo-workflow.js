// Fluxo editável separado do cenário histórico. Somente memória, sem backend.
export function createDemoWorkflow(workspaces) {
  let state = { demands: [], proposals: [], orders: [] };
  let sequence = 0;
  const id = (prefix) => `${prefix}-${++sequence}`;
  const fail = (message) => { throw new Error(message); };
  const actor = (workspaceId, role) => {
    const workspace = workspaces.find((item) => item.id === workspaceId);
    if (!workspace || workspace.organizationRole !== role) fail("Este contexto não pode executar a ação.");
    return workspace.organizationId;
  };
  const text = (value, label, max = 2000) => {
    if (typeof value !== "string" || !value.trim() || value.trim().length > max) fail(`Informe ${label} válido.`);
    return value.trim();
  };
  const integer = (value, label, min = 1) => {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < min || number > 1000000000) fail(`Informe ${label} válido.`);
    return number;
  };
  const date = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "") || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) fail("Informe uma data válida.");
    return value;
  };
  const listText = (value, label, max = 120) => [...new Set((Array.isArray(value) ? value : String(value ?? "").split(","))
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => text(item, label, max)))];
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
      certifications: listText(item.certifications ?? [], "certificação"),
      quantity: integer(item.quantity, `quantidade do item ${index + 1}`),
      unit: text(item.unit, `unidade do item ${index + 1}`, 20),
    }));
  };
  const getDemand = (demandId) => state.demands.find((item) => item.id === demandId) ?? fail("Demanda não encontrada.");
  const getOrder = (orderId) => state.orders.find((item) => item.id === orderId) ?? fail("Pedido não encontrado.");
  return Object.freeze({
    read(workspaceId) {
      const workspace = workspaces.find((item) => item.id === workspaceId);
      if (!workspace || !["buyer", "supplier"].includes(workspace.organizationRole)) fail("Contexto indisponível.");
      const organizationId = workspace.organizationId;
      return structuredClone({
        demands: state.demands.filter((demand) => workspace.organizationRole === "buyer" ? demand.buyerId === organizationId : demand.status !== "draft"),
        proposals: state.proposals.filter((proposal) => proposal.supplierId === organizationId || getDemand(proposal.demandId).buyerId === organizationId),
        orders: state.orders.filter((order) => [order.buyerId, order.supplierId].includes(organizationId)),
      });
    },
    createDemand(workspaceId, input) {
      const buyerId = actor(workspaceId, "buyer");
      const items = demandItems(input);
      const demand = { id: id("demanda"), buyerId, title: text(input.title, "título", 160), description: text(input.description, "especificação"), items, quantity: items.reduce((sum, item) => sum + item.quantity, 0), requiredBy: date(input.requiredBy), destination: text(input.destination, "destino", 160), region: text(input.region ?? input.destination, "região", 160), status: "draft" };
      state.demands.push(demand); return demand.id;
    },
    publishDemand(workspaceId, demandId) {
      const buyerId = actor(workspaceId, "buyer"); const demand = getDemand(demandId);
      if (demand.buyerId !== buyerId || demand.status !== "draft") fail("Somente um rascunho da sua empresa pode ser publicado.");
      demand.status = "published";
    },
    sendProposal(workspaceId, demandId, input) {
      const supplierId = actor(workspaceId, "supplier"); const demand = getDemand(demandId);
      if (demand.status !== "published" || demand.buyerId === supplierId) fail("Esta demanda não está aberta para propostas.");
      const totalCents = integer(input.totalCents, "valor dos itens em centavos");
      const freightCents = integer(input.freightCents, "frete em centavos", 0);
      const version = { id: id("versao"), totalCents, freightCents, leadTimeDays: integer(input.leadTimeDays, "prazo em dias"), manufacturer: text(input.manufacturer, "fabricante", 160), payment: text(input.payment, "condição de pagamento", 300), warranty: text(input.warranty, "garantia", 500), technical: text(input.technical, "resposta técnica"), validUntil: date(input.validUntil) };
      let proposal = state.proposals.find((item) => item.demandId === demandId && item.supplierId === supplierId);
      if (!proposal) { proposal = { id: id("proposta"), demandId, supplierId, versions: [] }; state.proposals.push(proposal); }
      version.revision = proposal.versions.length + 1;
      proposal.versions.push(version); return version.id;
    },
    acceptProposal(workspaceId, proposalId, versionId) {
      const buyerId = actor(workspaceId, "buyer");
      const proposal = state.proposals.find((item) => item.id === proposalId) ?? fail("Proposta não encontrada.");
      const demand = getDemand(proposal.demandId);
      if (demand.buyerId !== buyerId) fail("Proposta de outra empresa.");
      const previous = state.orders.find((item) => item.demandId === demand.id);
      if (previous) {
        if (previous.version.id === versionId) return previous.id;
        fail("Esta demanda já possui um pedido.");
      }
      const version = proposal.versions.at(-1);
      if (version.id !== versionId) fail("A proposta mudou. Reabra a versão mais recente antes de aceitar.");
      if (version.validUntil < new Date().toISOString().slice(0, 10)) fail("Esta proposta venceu. Solicite uma nova versão.");
      if (demand.status !== "published") fail("Demanda indisponível para aceite.");
      const order = { id: id("pedido"), demandId: demand.id, buyerId, supplierId: proposal.supplierId, title: demand.title, quantity: demand.quantity, version: structuredClone(version), status: "accepted", evaluation: null };
      state.orders.push(order); demand.status = "ordered"; return order.id;
    },
    dispatchOrder(workspaceId, orderId) {
      const supplierId = actor(workspaceId, "supplier"); const order = getOrder(orderId);
      if (order.supplierId !== supplierId || order.status !== "released") fail("A expedição exige um pedido liberado da sua empresa.");
      order.status = "dispatched";
    },
    recordInspection(workspaceId, orderId, input) {
      const supplierId = actor(workspaceId, "supplier"); const order = getOrder(orderId);
      if (order.supplierId !== supplierId || !["accepted", "blocked"].includes(order.status)) fail("Pedido indisponível para inspeção.");
      const approved = integer(input.approved, "quantidade aprovada", 0);
      if (approved > order.quantity) fail("Quantidade aprovada maior que o pedido.");
      const inspection = { approved, plan: text(input.plan, "plano e versão", 160), evidence: text(input.evidence, "resultado da inspeção", 2000) };
      order.inspections ??= []; order.inspections.push(inspection);
      order.status = approved === order.quantity ? "released" : "blocked";
    },
    confirmDelivery(workspaceId, orderId) {
      const buyerId = actor(workspaceId, "buyer"); const order = getOrder(orderId);
      if (order.buyerId !== buyerId || order.status !== "dispatched") fail("Somente pedidos expedidos da sua empresa podem ser recebidos.");
      order.status = "delivered";
    },
    evaluateOrder(workspaceId, orderId, input) {
      const buyerId = actor(workspaceId, "buyer"); const order = getOrder(orderId);
      if (order.buyerId !== buyerId || order.status !== "delivered" || order.evaluation) fail("Avaliação indisponível.");
      const score = integer(input.score, "nota"); if (score > 5) fail("A nota deve ser de 1 a 5.");
      order.evaluation = { score, comment: text(input.comment, "comentário", 1000) };
    },
    reset() { state = { demands: [], proposals: [], orders: [] }; },
  });
}
