import assert from 'node:assert/strict';
import test from 'node:test';
import { quantitySummary, quantitiesByUnit } from '../../src/domain/quantity.js';

test('quantities combine equivalent unit spelling without combining different dimensions', () => {
  const record = { quantity: 999, items: [{ quantity: 4, unit: ' UN ' }, { quantity: 6, unit: 'unidades' }, { quantity: 20, unit: 'm' }, { quantity: 3, unit: 'kg' }] };
  assert.equal(quantitySummary(record), '10 un · 20 m · 3 kg');
  assert.deepEqual(quantitiesByUnit([record, { quantity: 2 }]), [{ unit: 'un', quantity: 12 }, { unit: 'm', quantity: 20 }, { unit: 'kg', quantity: 3 }]);
});

test('empty quantities do not render NaN and compound units remain distinct', () => {
  assert.equal(quantitySummary({}), 'Não informada');
  assert.equal(quantitySummary({ items: [{ quantity: 10, unit: 'm²' }, { quantity: 2, unit: 'm' }] }), '10 m² · 2 m');
  assert.equal(quantitySummary({ items: [{ quantity: 1, unit: 'MW' }, { quantity: 2, unit: 'mW' }] }), '1 MW · 2 mW');
});
