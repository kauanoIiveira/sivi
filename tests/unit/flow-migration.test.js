import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, readFileSync, writeFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { prepareFlowMigration } from '../../scripts/prepare-flow-migration.mjs';

function legacy() {
  const demand = { id: 'd1', buyerId: 'buyer', buyerName: 'Comprador', title: 'Eixos', description: 'Conforme desenho', quantity: 10, status: 'published', requiredBy: '2027-12-20', destination: 'Campinas', region: 'SP', createdAt: 1, items: [{ id: 'item-1', description: 'Eixo', category: 'Peças', material: 'Aço', process: 'Usinagem', quantity: 10, unit: 'un', certifications: ['ISO 9001', 'ISO 14001'] }] };
  const version = { id: 'v1', revision: 1, totalCents: 100, freightCents: 0, leadTimeDays: 5, manufacturer: 'Fornecedor', payment: '30 dias', warranty: '12 meses', technical: 'Conforme desenho', validUntil: '2028-02-29', createdAt: 1 };
  const proposal = { id: 'd1_supplier', demandId: 'd1', buyerId: 'buyer', buyerName: 'Comprador', supplierId: 'supplier', supplierName: 'Fornecedor', updatedAt: 1, versions: { v1: version } };
  return { publishedDemands: { d1: demand }, demandsByBuyer: { buyer: { d1: structuredClone(demand) } }, opportunitiesBySupplier: { supplier: { d1: { ...structuredClone(demand), match: { eligible: true } } } }, proposalsByBuyer: { buyer: { [proposal.id]: proposal } }, proposalsBySupplier: { supplier: { [proposal.id]: structuredClone(proposal) } }, ordersByBuyer: { buyer: { existing: { status: 'delivered', version } } } };
}

test('prepares only structural metadata for matching legacy open records, preserving the input and accepted orders', () => {
  const root = legacy(), before = structuredClone(root);
  const result = prepareFlowMigration(root);
  assert.deepEqual(result.blocked, []);
  assert.equal(result.updates['publishedDemands/d1/itemCount'], 1);
  assert.equal(result.updates['demandsByBuyer/buyer/d1/items/0/certificationCount'], 2);
  assert.deepEqual(result.updates['opportunitiesBySupplier/supplier/d1/items/0/certificationPositions'], [0,1]);
  assert.equal(result.updates['proposalsByBuyer/buyer/d1_supplier/latestVersionId'], 'v1');
  assert.equal(result.updates['proposalsBySupplier/supplier/d1_supplier/versions/v1/expiry'].until, Date.parse('2028-02-29T23:59:59.999-03:00'));
  assert.ok(Object.keys(result.updates).every(path => !path.startsWith('orders')));
  assert.deepEqual(root, before);
});

test('refuses to guess a current version or overwrite divergent commercial projections', () => {
  const root = legacy();
  root.proposalsByBuyer.buyer.d1_supplier.versions.v2 = { ...root.proposalsByBuyer.buyer.d1_supplier.versions.v1, id: 'v2' };
  root.proposalsBySupplier.supplier.d1_supplier = structuredClone(root.proposalsByBuyer.buyer.d1_supplier);
  root.opportunitiesBySupplier.supplier.d1.items[0].material = 'Outro material';
  const result = prepareFlowMigration(root);
  assert.equal(result.blocked.length, 2);
  assert.ok(!Object.keys(result.updates).some(path => path.startsWith('proposals')));
  assert.ok(!Object.keys(result.updates).some(path => path.startsWith('opportunities')));
});

test('blocks sparse item collections instead of creating metadata at a different item path', () => {
  const root = legacy();
  for (const record of [root.publishedDemands.d1, root.demandsByBuyer.buyer.d1, root.opportunitiesBySupplier.supplier.d1]) record.items = { 2: record.items[0] };
  const result = prepareFlowMigration(root);
  assert.ok(result.blocked.some(record => record.path === 'publishedDemands/d1'));
  assert.ok(!Object.keys(result.updates).some(path => path.startsWith('publishedDemands') || path.startsWith('demandsByBuyer')));
});

test('the offline command preserves its input and an existing report, and returns failure for ambiguous data', () => {
  const directory = mkdtempSync(join(tmpdir(), 'sivi-flow-migration-'));
  const input = join(directory, 'input.json'), output = join(directory, 'report.json'), blocked = join(directory, 'blocked.json');
  const execute = path => spawnSync(process.execPath, [fileURLToPath(new URL('../../scripts/prepare-flow-migration.mjs', import.meta.url)), '--input', input, '--output', path], { encoding: 'utf8' });
  const original = JSON.stringify(legacy());
  try {
    writeFileSync(input, original);
    assert.equal(execute(output).status, 0);
    const report = readFileSync(output, 'utf8');
    assert.deepEqual(JSON.parse(report).blocked, []);
    assert.equal(readFileSync(input, 'utf8'), original);
    assert.notEqual(execute(output).status, 0);
    assert.equal(readFileSync(output, 'utf8'), report);
    const root = legacy();
    root.publishedDemands.d1.title = 'Projeções divergentes';
    writeFileSync(input, JSON.stringify(root));
    assert.equal(execute(blocked).status, 1);
    assert.equal(JSON.parse(readFileSync(blocked, 'utf8')).blocked.length, 1);
  } finally {
    for (const path of [input, output, blocked]) { try { unlinkSync(path); } catch (error) { if (error.code !== 'ENOENT') throw error; } }
    rmdirSync(directory);
  }
});
