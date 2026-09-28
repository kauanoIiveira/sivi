// Characterization for planning. Uses only local emulators and synthetic records.
// Does not assert that observed behavior is correct; records evidence for follow-up fixes.
import { mkdir, writeFile } from 'node:fs/promises';
import { createVerifiedUser, seedDatabaseEmulator } from '../tests/helpers/auth-emulator.js';
import { createFirebaseMarketplaceRepository } from '../src/repositories/firebase-marketplace-repository.js';

const suffix = Date.now().toString(36);
const password = 'SiviReview2026';
const facts = [];
let sequence = 0;
const record = (id, observation) => { facts.push({ id, ...observation }); console.log(id, JSON.stringify(observation)); };
const tokenFor = async email => {
  const response = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (!response.ok) throw new Error(`Local sign-in failed: ${response.status}`);
  return (await response.json()).idToken;
};
const account = async role => {
  const user = await createVerifiedUser({ email: `review-${role}-${suffix}@sivi.test`, password, displayName: `Revisão ${role}` });
  const organizationId = `review-${role}-${suffix}`;
  const workspace = { id: `${organizationId}-${role}`, organizationId, organizationName: `Revisão ${role}`, organizationRole: role, memberUid: user.uid, organizationStatus: 'active', canEnter: true };
  await seedDatabaseEmulator(`membershipsByUser/${user.uid}/${organizationId}`, { status: 'active', organizationRoles: { [role]: true }, organizationName: workspace.organizationName });
  const token = await tokenFor(user.email);
  const request = (path, method = 'GET', value) => fetch(`http://127.0.0.1:9000/${path}.json?ns=sivi-org-default-rtdb&auth=${encodeURIComponent(token)}`, {
    method, headers: { 'Content-Type': 'application/json' }, ...(value === undefined ? {} : { body: JSON.stringify(value) }),
  });
  const checked = async (path, method, value) => {
    const response = await request(path, method, value);
    if (!response.ok) throw new Error(`${method ?? 'GET'} ${path}: ${response.status}`);
    return response.json();
  };
  const client = {
    read: path => checked(path), write: (path, value) => checked(path, 'PUT', value),
    patch: value => checked('', 'PATCH', value), newKey: () => `review-${suffix}-${++sequence}`,
    timestamp: () => Date.now(),
  };
  const repository = createFirebaseMarketplaceRepository({ client, getUser: () => user, getWorkspace: id => id === workspace.id ? workspace : null });
  return { user, workspace, client, repository, request };
};

const buyer = await account('buyer');
const supplier = await account('supplier');
await seedDatabaseEmulator(`supplierProfiles/${supplier.workspace.organizationId}`, {
  organizationId: supplier.workspace.organizationId, organizationName: supplier.workspace.organizationName, organizationStatus: 'active',
  categories: ['usinados'], materials: ['aço'], processes: ['usinagem'], regions: ['sp'], certifications: [], capacity: 1000,
});
const input = {
  title: 'Revisão local da negociação', description: 'Registro sintético para análise', requiredBy: '2027-12-20', destination: 'Campinas', region: 'SP',
  items: [{ description: 'Peça', category: 'usinados', material: 'aço', process: 'usinagem', quantity: 10, unit: 'un' }],
};
const b = buyer.workspace.id;
const s = supplier.workspace.id;
const demandPath = id => `demandsByBuyer/${buyer.workspace.organizationId}/${id}`;

let invalidDateRejected = false;
try { await buyer.repository.workflow.createDemand(b, { ...input, requiredBy: '2027-02-31' }); }
catch { invalidDateRejected = true; }
const mixedId = await buyer.repository.workflow.createDemand(b, { ...input, items: [input.items[0], { ...input.items[0], description: 'Barra', quantity: 20, unit: 'm' }] });
const mixed = await buyer.client.read(demandPath(mixedId));
record('mixed-units-and-date', { quantities: mixed.items.map(item => `${item.quantity} ${item.unit}`), legacyAggregate: mixed.quantity, invalidDateRejected });

const interruptedClient = { ...buyer.client };
let failRead = false;
interruptedClient.write = async (...args) => { await buyer.client.write(...args); failRead = true; };
interruptedClient.read = async path => { if (failRead) { failRead = false; throw new Error('Simulated refresh failure after write'); } return buyer.client.read(path); };
const interrupted = createFirebaseMarketplaceRepository({ client: interruptedClient, getUser: () => buyer.user, getWorkspace: () => buyer.workspace });
const retryInput = { ...input, title: 'Revisão: tentativa após erro de atualização' };
let failures = 0;
for (let i = 0; i < 2; i += 1) {
  try { await interrupted.workflow.createDemand(b, retryInput); break; } catch { failures += 1; }
}
const records = Object.values(await buyer.client.read(`demandsByBuyer/${buyer.workspace.organizationId}`));
record('write-success-refresh-failure', { errorsReported: failures, persistedRecords: records.filter(item => item.title === retryInput.title).length });

const staleId = await buyer.repository.workflow.createDemand(b, input);
const staleClient = { ...buyer.client };
let concurrentEdit = false;
staleClient.read = async path => {
  if (path === 'supplierProfiles' && !concurrentEdit) {
    concurrentEdit = true;
    const current = await buyer.client.read(demandPath(staleId));
    await buyer.client.write(demandPath(staleId), { ...current, title: 'Edição salva por outra sessão', updatedAt: current.updatedAt + 1 });
  }
  return buyer.client.read(path);
};
const stale = createFirebaseMarketplaceRepository({ client: staleClient, getUser: () => buyer.user, getWorkspace: () => buyer.workspace });
await stale.workflow.publishDemand(b, staleId);
record('publish-after-concurrent-edit', { concurrentTitle: 'Edição salva por outra sessão', finalTitle: (await buyer.client.read(demandPath(staleId))).title });

const demandId = await buyer.repository.workflow.createDemand(b, input);
await buyer.repository.workflow.publishDemand(b, demandId);
const offer = { totalCents: 10000, freightCents: 500, leadTimeDays: 10, manufacturer: 'Fornecedor de teste', payment: '28 dias', warranty: '12 meses', technical: 'Conforme desenho', validUntil: '2027-12-10' };
const versionId = await supplier.repository.workflow.sendProposal(s, demandId, offer);
const proposalId = `${demandId}_${supplier.workspace.organizationId}`;
const orderId = await buyer.repository.workflow.acceptProposal(b, proposalId, versionId);
await supplier.repository.getOperations(s);
const opportunity = supplier.repository.workflow.read(s).demands.find(demand => demand.id === demandId);
let proposalRejected = false;
try { await supplier.repository.workflow.sendProposal(s, demandId, offer); } catch { proposalRejected = true; }
record('opportunity-after-acceptance', { opportunityStatus: opportunity.status, anotherProposalRejected: proposalRejected });

const buyerOrderPath = `ordersByBuyer/${buyer.workspace.organizationId}/${orderId}`;
const supplierOrderPath = `ordersBySupplier/${supplier.workspace.organizationId}/${orderId}`;
const order = await supplier.client.read(supplierOrderPath);
const changed = { ...order, status: 'released', quantity: 1, version: { ...order.version, totalCents: 1 } };
const altered = await supplier.request('', 'PATCH', { [buyerOrderPath]: changed, [supplierOrderPath]: changed });
record('accepted-terms-and-release-rules', { response: altered.status, saved: altered.ok, originalTotalCents: order.version.totalCents, requestedTotalCents: changed.version.totalCents, inspectionProvided: false });

const ordered = await buyer.client.read(demandPath(demandId));
const reversed = await buyer.request(demandPath(demandId), 'PUT', { ...ordered, status: 'draft' });
record('ordered-demand-status-reversal', { response: reversed.status, saved: reversed.ok });

// Preserve previous evidence; each characterization describes its own checkout.
const output = new URL(`../exports/marketplace-review-${suffix}.json`, import.meta.url);
await mkdir(new URL('.', output), { recursive: true });
await writeFile(output, `${JSON.stringify({ checkedAt: new Date().toISOString(), environment: 'local Firebase emulators only', purpose: 'Characterization for roadmap; not a passing regression suite', facts }, null, 2)}\n`);
