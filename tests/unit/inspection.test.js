import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectionQuantities, inspectionSummary } from '../../src/domain/inspection.js';

const order = { quantity: 30, items: [{ id: 'a', description: 'Eixo', quantity: 10, unit: 'un' }, { id: 'b', description: 'Tubo', quantity: 20, unit: 'm' }] };

test('a multi-item inspection cannot release a sum without identifying each item', () => {
  assert.throws(() => inspectionQuantities(order, { approved: 30 }), /cada item/i);
  for (const itemApprovals of [[], [{ itemId: 'a', approved: 10 }], [{ itemId: 'a', approved: 10 }, { itemId: 'a', approved: 20 }], [{ itemId: 'a', approved: 11 }, { itemId: 'b', approved: 19 }], [{ itemId: 'a', approved: '' }, { itemId: 'b', approved: 20 }]]) {
    assert.throws(() => inspectionQuantities(order, { itemApprovals }));
  }
});

test('partial item approval stays blocked and reports the original units', () => {
  const partial = inspectionQuantities(order, { itemApprovals: [{ itemId: 'a', approved: 10 }, { itemId: 'b', approved: 19 }] });
  assert.equal(partial.complete, false);
  assert.equal(partial.approved, 29);
  assert.equal(inspectionSummary(order, partial), 'Eixo: 10/10 un · Tubo: 19/20 m');
  const complete = inspectionQuantities(order, { itemApprovals: [{ itemId: 'b', approved: 20 }, { itemId: 'a', approved: 10 }] });
  assert.equal(complete.complete, true);
});

test('single-item and legacy orders accept a scalar approval without losing its unit', () => {
  const single = { quantity: 20, items: [order.items[1]] };
  const result = inspectionQuantities(single, { approved: '20' });
  assert.equal(result.complete, true);
  assert.equal(inspectionSummary(single, result), 'Tubo: 20/20 m');
  assert.equal(inspectionQuantities({ quantity: 5 }, { approved: 5 }).complete, true);
  assert.throws(() => inspectionQuantities({ quantity: 5 }, { approved: 6 }), /maior/i);
  assert.match(inspectionSummary(order, { approved: 29 }), /sem detalhamento por item/i);
});
