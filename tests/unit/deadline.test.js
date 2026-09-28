import test from 'node:test';
import assert from 'node:assert/strict';
import { describeRequestedDate, daysUntil } from '../../src/domain/deadline.js';

test('requested dates use civil days across months and leap years', () => {
  assert.equal(daysUntil('2028-03-01', '2028-02-28'), 2);
  assert.equal(daysUntil('2026-01-01', '2025-12-31'), 1);
  assert.equal(daysUntil('2026-09-18', '2026-09-20'), -2);
  assert.equal(daysUntil('2026-02-30', '2026-02-28'), null);
  assert.equal(daysUntil('', '2026-02-28'), null);
});

test('requested date messages do not turn a buyer preference into a delivery promise', () => {
  assert.deepEqual(describeRequestedDate('2026-09-18', '2026-09-20'), {
    days: -2, urgent: true, text: 'Data desejada pelo comprador: 18/09/2026 (há 2 dias).',
  });
  assert.equal(describeRequestedDate('2026-09-20', '2026-09-20').text, 'Data desejada pelo comprador: hoje (20/09/2026).');
  assert.equal(describeRequestedDate('2026-09-21', '2026-09-20').urgent, true);
  assert.equal(describeRequestedDate('2026-09-24', '2026-09-20').urgent, false);
  assert.equal(describeRequestedDate(undefined, '2026-09-20'), null);
});
