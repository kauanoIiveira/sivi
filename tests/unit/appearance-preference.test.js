import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeAppearance, readAppearance, APPEARANCE_DEFAULTS } from '../../src/theme/appearance-preference.js';

test('invalid or older appearance settings fall back independently without losing valid choices', () => {
  assert.deepEqual(normalizeAppearance({ motion: 'reduce', textSize: 'huge', density: 'compact', contrast: 'more', extra: true }), {
    motion: 'reduce', textSize: 'standard', density: 'compact', contrast: 'more',
  });
  for (const value of [null, [], 'large', 42]) assert.deepEqual(normalizeAppearance(value), APPEARANCE_DEFAULTS);
});

test('damaged or unavailable browser storage never prevents opening the application', () => {
  assert.deepEqual(readAppearance({ getItem: () => '{broken' }), APPEARANCE_DEFAULTS);
  assert.deepEqual(readAppearance({ getItem: () => { throw new Error('denied'); } }), APPEARANCE_DEFAULTS);
  assert.equal(readAppearance({ getItem: () => '{"textSize":"large"}' }).textSize, 'large');
});
