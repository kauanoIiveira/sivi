// Dados sintéticos exclusivos desta fixture. Sem Firebase, contas ou gravação persistente.
import { createDemoWorkflow } from './domain/demo-workflow.js';
import { DEMO_WORKSPACES } from './data/workspaces.js';
import { buildLiveDashboard, buildLiveJourney } from '/src/domain/live-marketplace-selectors.js';
import { matchSupplierToDemand } from '/src/domain/match-engine.js';
import { MESSAGE_PAGE_SIZE } from '/src/repositories/firebase-conversations.js';

export function createWorkspacePreview({ expandedCatalog = false } = {}) {
  const workflow = createDemoWorkflow(DEMO_WORKSPACES);
  const buyer = DEMO_WORKSPACES[0]; const supplier = DEMO_WORKSPACES[1];
  const now = Date.now(); const day = 86400000;
  const date = offset => new Date(now + offset * day).toISOString().slice(0, 10);
  const names = ['Eixos de transmissão', 'Flanges de conexão', 'Engrenagens de manutenção', 'Buchas de precisão', 'Suportes usinados', 'Conexões em alumínio'];
  const created = new Map();
  for (let index = 0; index < 22; index++) {
    const id = workflow.createDemand(buyer.id, { title: `${names[index % names.length]} · lote ${String(index + 1).padStart(2, '0')}`, description: 'Componentes para manutenção industrial. Conferir tolerâncias e requisitos por item antes de propor.', items: [{ description: names[index % names.length], category: 'usinados', material: index % 2 ? 'alumínio 6061' : 'aço SAE 1045', process: 'usinagem CNC', quantity: 240, unit: 'un', certifications: [] }], requiredBy: date(30), destination: 'São Paulo/SP', region: 'SP' });
    const age = [78,72,68,64,60,55,50,47,43,39,34,31,26,23,20,17,14,11,8,5,3,1][index];
    created.set(id, now - age * day);
    if (index < 19) workflow.publishDemand(buyer.id, id);
    if (index < 16) {
      workflow.sendProposal(supplier.id, id, { totalCents: 1860000 + index * 24000, freightCents: 15000, leadTimeDays: 18, manufacturer: 'Vetor Componentes Industriais', payment: '30 dias após recebimento', warranty: '90 dias, conforme especificação', technical: 'Usinagem CNC conforme requisitos declarados.', validUntil: date(60) });
      const proposal = workflow.read(buyer.id).proposals.find(item => item.demandId === id);
      created.set(proposal.id, now - Math.max(0, age - 2) * day);
      if (index < 7) {
        const order = workflow.acceptProposal(buyer.id, proposal.id, proposal.versions.at(-1).id);
        created.set(order, now - Math.max(0, age - 5) * day);
        if (index < 5) workflow.recordInspection(supplier.id, order, { approved: index === 4 ? 220 : 240, plan: 'Inspeção dimensional · revisão1', evidence: index === 4 ? '20 peças para reinspeção.' : '240 peças conformes aos requisitos.' });
        if (index < 3) workflow.dispatchOrder(supplier.id, order);
        if (index < 2) workflow.confirmDelivery(buyer.id, order);
      }
    }
  }
  const profiles = [{ id: supplier.organizationId, organizationId: supplier.organizationId, organizationName: supplier.organizationName, categories: ['usinados'], materials: ['aço SAE 1045', 'alumínio 6061'], processes: ['usinagem CNC'], regions: ['SP'], certifications: [], capacity: 2400, leadTimeDays: 18, description: 'Usinagem CNC de componentes industriais em aço e alumínio.' }];
  if (expandedCatalog) {
    profiles.push(...[
      ['atlas', 'Atlas Precisão', 'usinados', 'aço SAE 1045', 'usinagem CNC', 'SP', 800, 'Retífica cilíndrica e manutenção de eixos.'],
      ['boreal', 'Boreal Tornearia', 'usinados', 'aço SAE 1045', 'usinagem CNC', 'SP', 150, 'Tornearia de lotes sob medida.'],
      ['croma', 'Croma Elastômeros', 'borracha', 'borracha nitrílica', 'vulcanização', 'MG', 1500, 'Fabricação de rolos e vedações.'],
      ['delta', 'Delta Ferramentaria', 'usinados', 'alumínio 6061', 'usinagem CNC', 'PR', 350, 'Ferramentas em alumínio para linhas de montagem.'],
      ['eixo', 'Eixo Forte Caldeiraria', 'estruturas', 'aço carbono', 'soldagem', 'SP', 600, 'Caldeiraria e estruturas metálicas industriais.'],
    ].map(([organizationId, organizationName, category, material, process, region, capacity, description]) =>
      ({ organizationId, organizationName, categories: [category], materials: [material], processes: [process],
        regions: [region], certifications: ['ISO 9001'], capacity, leadTimeDays: 15, description })));
  }
  const read = id => {
    const records = workflow.read(id);
    for (const type of ['demands', 'proposals', 'orders']) records[type] = records[type].map(record => ({ ...record, createdAt: created.get(record.id) ?? now, updatedAt: created.get(record.id) ?? now, supplierName: supplier.organizationName, buyerName: buyer.organizationName }));
    records.suppliers = [{ id: supplier.organizationId, name: supplier.organizationName }];
    return records;
  };
  let mode = 'normal';
  let messageSequence = 0;
  const message = (body, senderRole, sentAt = Date.now()) => ({
    id: String(++messageSequence).padStart(10, '0'), body, senderRole, sentAt,
  });
  const chats = new Map([[supplier.organizationId, [
    message('Vocês conseguem produzir 240 flanges em aço SAE 1045?', 'buyer', now - 3600000),
    message('Sim. Podemos confirmar o prazo com o desenho da peça.', 'supplier', now - 1800000),
  ]]]);
  const listeners = new Set();
  const observe = (read, onData, onError) => {
    const publish = () => mode === 'error' ? onError() : onData(read());
    listeners.add(publish);
    queueMicrotask(() => { if (listeners.has(publish)) publish(); });
    return () => listeners.delete(publish);
  };
  const recordsFor = (id, peerId) => mode === 'empty' ? [] : (chats.get(id === buyer.id ? peerId : supplier.organizationId) ?? []);
  const conversations = {
    getSupplierContact: async (id, peer, reference) => {
      const records = read(id);
      const candidate = (reference.kind === 'pedido' ? records.orders : records.proposals).find(record => record.id === reference.id);
      return id === supplier.id && peer === buyer.organizationId && candidate ? buyer.organizationName : null;
    },
    watchInbox: (id, onData, onError) => observe(() => {
      if (mode === 'empty') return [];
      const latest = id => chats.get(id)?.at(-1);
      if (id === supplier.id) return [{ peerId: buyer.organizationId, name: buyer.organizationName, lastMessage: latest(supplier.organizationId) }];
      return [...chats.keys()].sort((a, b) => latest(b).sentAt - latest(a).sentAt).map(peerId => ({
        peerId, name: profiles.find(profile => profile.organizationId === peerId).organizationName, lastMessage: latest(peerId),
      }));
    }, onData, onError),
    watchMessages: (id, peerId, onData, onError) => observe(
      () => recordsFor(id, peerId).slice(-MESSAGE_PAGE_SIZE), onData, onError),
    readOlderMessages: async (id, peerId, cursor) => recordsFor(id, peerId).filter(item => item.id < cursor).slice(-MESSAGE_PAGE_SIZE),
    sendMessage: async (id, peerId, text) => {
      if (mode !== 'normal') throw new Error('Falha de envio na prévia.');
      const isBuyer = id === buyer.id;
      const counterpart = isBuyer ? peerId : supplier.organizationId;
      const records = chats.get(counterpart) ?? [];
      chats.set(counterpart, [...records, message(text.trim(), isBuyer ? 'buyer' : 'supplier')]);
      for (const publish of listeners) publish();
    },
  };
  const invitations = new Map();
  const outcome = data => mode === 'error' ? { status: 'error' } : { status: 'ready', data, meta: { asOf: new Date(now).toISOString(), source: 'Dados sintéticos · prévia isolada' } };
  const currentRecords = id => mode === 'empty' ? { demands: [], proposals: [], orders: [], suppliers: [] } : read(id);
  const repository = {
    conversations,
    workflow: { ...workflow, read: currentRecords },
    getOperations: async id => outcome(currentRecords(id)),
    getDashboard: async id => outcome(buildLiveDashboard(DEMO_WORKSPACES.find(item => item.id === id), currentRecords(id))),
    getIndustrialJourney: async id => outcome(mode === 'empty' ? [] : buildLiveJourney(DEMO_WORKSPACES.find(item => item.id === id), currentRecords(id))),
    getBuyerRecommendations: async id => { const demand = currentRecords(id).demands.filter(item => item.status === 'published').at(-1); return demand ? profiles.map(profile => ({ profile, match: matchSupplierToDemand(demand, profile) })) : []; },
    listSupplierProfiles: async () => {
      if (mode === 'error') throw new Error('Falha de consulta na prévia.');
      return mode === 'empty' ? [] : profiles;
    },
    getBuyerSupplierProfile: async (workspaceId, supplierId) => (await repository.listSupplierProfiles(workspaceId))
      .find(profile => profile.organizationId === supplierId) ?? null,
    getBuyerInvitations: async (_id, demandId) => [...(invitations.get(demandId) ?? [])],
    inviteSupplierToDemand: async (_id, demandId, supplierId) => { const ids = invitations.get(demandId) ?? new Set(); ids.add(supplierId); invitations.set(demandId, ids); return {}; },
    getBuyerSupplierDirectory: async () => ({ profiles: mode === 'empty' ? [] : profiles, demands: currentRecords(buyer.id).demands }),
    setMode: value => { mode = value; },
  };
  const organizations = [
    { id: 'preview-alpha', name: 'Indústrias Alpha', status: 'active', roles: { buyer: true }, city: 'São Paulo', state: 'SP' },
    { id: 'preview-vetor', name: 'Vetor Componentes Industriais', status: 'active', roles: { supplier: true }, city: 'São Paulo', state: 'SP' },
    { id: 'preview-3', name: 'Nova Forma Usinagem', status: 'pending', roles: { supplier: true }, city: 'São Paulo', state: 'SP' },
    { id: 'preview-4', name: 'Metalúrgica Horizonte', status: 'pending', roles: { buyer: true, supplier: true }, city: 'São Paulo', state: 'SP' },
    { id: 'preview-5', name: 'Oficina de Precisão', status: 'changes_requested', roles: { supplier: true }, city: 'São Paulo', state: 'SP' },
  ].map((item, index) => ({ ...item, createdAt: now - (index + 2) * day }));
  return { repository, workspaces: DEMO_WORKSPACES, supplierProfiles: { getProfile: async () => profiles[0], saveProfile: async (_id, input) => { Object.assign(profiles[0], input); return profiles[0]; } }, administration: { listOrganizations: async () => mode === 'empty' ? [] : organizations, setOrganizationStatus: async (id, status, reason) => Object.assign(organizations.find(item => item.id === id), { status, reviewReason: reason }), registerOrganization: async input => { throw new Error('Esta prévia não cadastra empresas. Use sua conta na plataforma.'); } } };
}
