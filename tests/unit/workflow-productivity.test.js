import assert from 'node:assert/strict';
import test from 'node:test';
import { createRecordFilters, filterRecords, negotiationStatus } from '../../src/pages/operations/record-filters.js';
import { demandCopyInput } from '../../src/pages/operations/demand-copy.js';
import { csvCell, ordersCsv } from '../../src/pages/operations/orders-csv.js';

const workspace = { id: 'buyer', memberUid: 'ana', organizationRole: 'buyer' };
const defaults = { search: '', status: '', sort: 'recent' };
const records = [
  { id: 'order-2', title: 'Eixos de aço', status: 'accepted', requiredBy: '2027-02-01', updatedAt: 20, supplierName: 'Usinagem São Luís', version: { totalCents: 10000, freightCents: 500 }, items: [{ description: 'Eixo', material: 'Aço', quantity: 12, unit: 'un' }] },
  { id: 'order-1', title: 'Buchas de bronze', status: 'released', requiredBy: '2027-01-10', updatedAt: 30, supplierName: 'Metalúrgica', version: { totalCents: 2000, freightCents: 500 } },
];

test('record filters persist separately for section, member, organization and role', () => {
  const map = new Map(); const storage = { getItem: key => map.get(key), setItem: (key, value) => map.set(key, value) };
  const value = { search: 'Eixo', status: 'accepted', sort: 'total' };
  createRecordFilters('orders', workspace, storage).save(value);
  assert.deepEqual(createRecordFilters('orders', workspace, storage).read(), value);
  assert.deepEqual(createRecordFilters('proposals', workspace, storage).read(), defaults);
  for (const change of [{ id: 'other' }, { memberUid: 'bruno' }, { organizationRole: 'supplier' }]) {
    assert.deepEqual(createRecordFilters('orders', { ...workspace, ...change }, storage).read(), defaults);
  }
  const filters = createRecordFilters('orders', workspace, storage); filters.clear();
  assert.deepEqual(filters.read(), defaults);
});

test('invalid and unavailable filter storage stays editable with validated options', () => {
  for (const storage of [undefined, { getItem: () => '{' }, { getItem: () => '{"status":"made-up","sort":"bad","search":3}' }]) {
    const filters = createRecordFilters('orders', workspace, storage);
    assert.deepEqual(filters.read(), defaults);
    filters.save({ search: 'a'.repeat(300), status: 'released', sort: 'title' });
    assert.equal(filters.read().search.length, 200);
    assert.equal(filters.read().status, 'released');
    filters.save({ status: 'wrong', sort: 'wrong' }); assert.deepEqual(filters.read(), defaults);
  }
});

test('orders search matches accent-insensitive words in companies, references and frozen items', () => {
  assert.deepEqual(filterRecords(records, { ...defaults, search: 'sao aco order-2' }, 'orders').map(record => record.id), ['order-2']);
  assert.equal(filterRecords(records, { ...defaults, search: 'sao aco', status: 'released' }, 'orders').length, 0);
  assert.equal(filterRecords(records, { ...defaults, status: 'released' }, 'orders')[0].id, 'order-1');
  assert.deepEqual(filterRecords(records, { ...defaults, sort: 'total-desc' }, 'orders').map(record => record.id), ['order-2', 'order-1']);
});

test('sorts are stable, do not mutate input and put absent prices or dates last', () => {
  const input = [...records, { id: 'legacy', title: 'Indefinido' }]; const before = structuredClone(input);
  for (const sort of ['total', 'deadline', 'recent', 'title']) assert.deepEqual(filterRecords(input, { ...defaults, sort }, 'orders').map(record => record.id), ['order-1', 'order-2', 'legacy']);
  assert.deepEqual(filterRecords(input, { ...defaults, sort: 'total-desc' }, 'orders').map(record => record.id), ['order-2', 'order-1', 'legacy']);
  assert.deepEqual(input, before);
});

test('negotiations use latest version validity with São Paulo civil dates and give orders precedence', () => {
  const demand = { id: 'd1', status: 'published' };
  const data = { proposals: [{ demandId: 'd1', versions: [{ validUntil: '2027-02-01' }, { validUntil: '2026-09-26' }] }], orders: [] };
  assert.equal(negotiationStatus(demand, data, '2026-09-27'), 'expired');
  data.proposals[0].versions.push({ validUntil: '2026-09-27' });
  assert.equal(negotiationStatus(demand, data, '2026-09-27'), 'active');
  data.orders.push({ demandId: 'd1' }); assert.equal(negotiationStatus(demand, data, '2026-09-27'), 'ordered');
  assert.equal(negotiationStatus(demand, {}, '2026-09-27'), 'awaiting');
});

test('proposal search and price sorting use their supplier and latest offered totals', () => {
  const demands = [{ id: 'd1', title: 'Peças', status: 'published' }, { id: 'd2', title: 'Reposição', status: 'published' }];
  const data = { proposals: [
    { id: 'p1', demandId: 'd1', supplierName: 'São Luís', versions: [{ totalCents: 100, freightCents: 0 }, { totalCents: 5000, freightCents: 100, validUntil: '2027-01-01', manufacturer: 'Forja' }] },
    { id: 'p2', demandId: 'd2', versions: [{ totalCents: 1000, freightCents: 0, validUntil: '2027-01-01' }] },
  ] };
  assert.deepEqual(filterRecords(demands, { ...defaults, search: 'sao forja', status: 'active' }, 'proposals', data, '2026-09-27').map(item => item.id), ['d1']);
  assert.deepEqual(filterRecords(demands, { ...defaults, sort: 'total' }, 'proposals', data).map(item => item.id), ['d2', 'd1']);
});

test('copy only retains editable specification and never reuses IDs, ownership or expired deadlines', () => {
  const source = { id: 'old', title: 'Eixos', description: 'Revisão A', status: 'ordered', buyerId: 'other', updatedAt: 4,
    destination: 'Campinas', region: 'SP', requiredBy: '2026-09-26', items: [{ id: 'old-item', description: 'Eixo', material: 'Aço', category: 'Usinados', process: 'Usinagem', quantity: 3, unit: 'un', certifications: ['ISO 9001'] }] };
  const before = structuredClone(source); const copy = demandCopyInput(source, '2026-09-27');
  assert.equal(copy.requiredBy, '');
  for (const key of ['id', 'status', 'buyerId', 'updatedAt']) assert.equal(key in copy, false);
  assert.equal('id' in copy.items[0], false); assert.equal(copy.description, source.description);
  copy.items[0].certifications.push('Extra'); assert.deepEqual(source, before);
  assert.equal(demandCopyInput({ ...source, requiredBy: '2026-09-27' }, '2026-09-27').requiredBy, '2026-09-27');
  assert.equal(demandCopyInput({ ...source, requiredBy: '2027-02-30' }, '2026-09-27').requiredBy, '');
});

test('copy supports old single-item demands without inventing material or process', () => {
  const copy = demandCopyInput({ title: 'Eixo', description: 'Desenho 1', destination: 'SP', quantity: 5 });
  assert.equal(copy.items[0].quantity, 5); assert.equal(copy.items[0].unit, 'un');
  assert.equal(copy.items[0].material, ''); assert.equal(copy.region, 'SP');
});

test('CSV neutralizes formula prefixes and escapes delimiters, quotes and multiline text', () => {
  for (const value of ['=SUM(A1)', '+1', '-1', '@SUM(A1)', ' \t=1+1', '\r\n@SUM(1)', '\u0001=1']) assert.equal(csvCell(value), `"'${value}"`);
  assert.equal(csvCell('Peça; "A"\nB'), '"Peça; ""A""\nB"');
  assert.equal(csvCell('Aço'), '"Aço"'); assert.equal(csvCell(null), '""');
});

test('order CSV exports only frozen order terms and keeps quantities, units and totals unambiguous', () => {
  const csv = ordersCsv([{ ...records[0], requiredBy: '2027-02-01', createdAt: Date.parse('2026-09-27T01:30:00Z'),
    supplierName: '=HYPERLINK("https://example.test")',
    items: [{ description: 'Eixo', material: 'Aço', quantity: 12, unit: 'unidades' }, { description: 'Barra', quantity: 20, unit: 'm' }],
    version: { ...records[0].version, revision: 2, payment: '30 dias', manufacturer: 'Fábrica contratada', technical: 'Desenho aceito' },
  }]);
  assert.ok(csv.startsWith('\uFEFF"Pedido";'));
  const rows = csv.trimEnd().split('\r\n'); assert.equal(rows.length, 3);
  assert.ok(rows[1].includes('"01/02/2027"')); assert.ok(rows[1].includes('"26/09/2026, 22:30"'));
  assert.ok(rows[1].includes('"12";"un";"100,00";"5,00";"105,00"'));
  assert.ok(rows[2].includes('"20";"m";"";"";""'));
  assert.ok(csv.includes('"\'=HYPERLINK(""https://example.test"")"'));
  assert.ok(csv.includes('"Fábrica contratada"')); assert.equal(csv.match(/"105,00"/g).length, 1);
});
