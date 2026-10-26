import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeAppearance, readAppearance, APPEARANCE_DEFAULTS } from '../../src/theme/appearance-preference.js';

test('invalid or older appearance settings fall back independently without losing valid choices', () => {
  assert.deepEqual(normalizeAppearance({ motion: 'reduce', textSize: 'huge', density: 'compact', contrast: 'more', extra: true }), {
    textSize: 'standard', contrast: 'more', colorVision: 'standard', vlibras: 'off',
  });
  for (const value of [null, [], 'large', 42]) assert.deepEqual(normalizeAppearance(value), APPEARANCE_DEFAULTS);
});

test('color-vision and VLibras choices are normalized independently and removed controls are ignored', () => {
  assert.deepEqual(normalizeAppearance({ textSize: 'large', contrast: 'more', colorVision: 'redGreen', vlibras: 'on', motion: 'reduce', density: 'compact' }), {
    textSize: 'large', contrast: 'more', colorVision: 'redGreen', vlibras: 'on',
  });
  assert.deepEqual(normalizeAppearance({ colorVision: 'blueYellow', vlibras: true }), { ...APPEARANCE_DEFAULTS, colorVision: 'blueYellow' });
  assert.deepEqual(normalizeAppearance({ colorVision: 'unknown', vlibras: 'enabled' }), APPEARANCE_DEFAULTS);
});

test('damaged or unavailable browser storage never prevents opening the application', () => {
  assert.deepEqual(readAppearance({ getItem: () => '{broken' }), APPEARANCE_DEFAULTS);
  assert.deepEqual(readAppearance({ getItem: () => { throw new Error('denied'); } }), APPEARANCE_DEFAULTS);
  assert.equal(readAppearance({ getItem: () => '{"textSize":"large"}' }).textSize, 'large');
});
