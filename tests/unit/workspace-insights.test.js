import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkspaceInsights } from '../../src/domain/workspace-insights.js';

const now = Date.parse('2026-10-24T01:00:00Z'); // 23/10 em São Paulo.
const at = value => Date.parse(value);
test('workspace insights group six intervals by Sao Paulo day and reconcile all series', () => {
  const records = { demands: [{ createdAt: at('2026-09-24T03:00:00Z') }, { createdAt: at('2026-09-24T02:59:59Z') }], proposals: [{ createdAt: at('2026-10-24T00:10:00Z'), versions: [{}, {}] }], orders: [{ createdAt: now, status: 'accepted', version: { totalCents: 101, freightCents: 20 } }] };
  const result = buildWorkspaceInsights(records, { days: 30, now });
  assert.equal(result.series.length, 6);
  assert.equal(result.period.start, '2026-09-24');
  assert.equal(result.period.end, '2026-10-23');
  assert.equal(result.totals.demands, 1);
  assert.equal(result.totals.proposals, 1);
  assert.equal(result.totals.orders, 1);
  for (const key of ['demands', 'proposals', 'orders']) assert.equal(result.series.reduce((sum, row) => sum + row[key], 0), result.totals[key]);
  assert.equal(result.orderValueCents, 121);
});
test('workspace insights exclude unknown and future dates without inventing historical states', () => {
  const records = { demands: [{}, { createdAt: 'invalid' }], proposals: [{ createdAt: now + 1 }], orders: [{ createdAt: at('2026-07-31T12:00:00Z'), status: 'delivered', version: { totalCents: 1250, freightCents: 50 } }, { status: 'unrecognized' }] };
  const short = buildWorkspaceInsights(records, { days: 30, now });
  const long = buildWorkspaceInsights(records, { days: 90, now });
  assert.equal(short.totals.orders, 0);
  assert.equal(long.totals.orders, 1);
  assert.equal(short.portfolio.reduce((sum, row) => sum + row.count, 0), 2);
  assert.deepEqual(short.portfolio, long.portfolio);
  assert.equal(short.portfolio.find(row => row.id === 'other').count, 1);
  assert.equal(short.omitted.demands, 2);
  assert.equal(short.omitted.orders, 1);
  assert.equal(short.totals.proposals, 0);
  assert.equal(short.incompleteOrderValues, 1);
  assert.equal(short.orderValueCents, 1300);
});
test('workspace insights preserve records, normalize periods and handle empty data', () => {
  const records = Object.freeze({ demands: Object.freeze([]), proposals: Object.freeze([]), orders: Object.freeze([]) });
  const result = buildWorkspaceInsights(records, { days: 7, role: 'supplier', now });
  assert.equal(result.period.days, 90);
  assert.equal(result.role, 'supplier');
  assert.equal(result.orderValueCents, 0);
  assert.deepEqual(result.totals, { demands: 0, proposals: 0, orders: 0 });
  assert.equal(result.series.length, 6);
  assert.throws(() => buildWorkspaceInsights(records, { now: NaN }), /instante/i);
});
test('workspace insights do not fabricate a monetary total when integer precision is lost', () => {
  const records = { orders: [{ status: 'accepted', version: { totalCents: Number.MAX_SAFE_INTEGER, freightCents: 1 } }] };
  const result = buildWorkspaceInsights(records, { now });
  assert.equal(result.orderValueCents, 0);
  assert.equal(result.incompleteOrderValues, 1);
});
test('workspace insights use the first version creation date in the actual proposal contract', () => {
  const records = { proposals: [
    { id: 'p1', versions: [{ revision: 2, createdAt: now }, { revision: 1, createdAt: now - 50 * 86400000 }] },
    { id: 'p2', versions: [{ revision: 1, createdAt: now - 2 * 86400000 }, { revision: 2, createdAt: now }] },
  ] };
  const short = buildWorkspaceInsights(records, { days: 30, now });
  const long = buildWorkspaceInsights(records, { days: 90, now });
  assert.equal(short.totals.proposals, 1);
  assert.equal(long.totals.proposals, 2);
  assert.equal(short.omitted.proposals, 0);
});
