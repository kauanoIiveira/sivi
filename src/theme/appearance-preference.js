export const APPEARANCE_STORAGE_KEY = 'sivi.appearance.v1';
export const APPEARANCE_OPTIONS = Object.freeze({
  motion: ['system', 'reduce'],
  textSize: ['standard', 'large'],
  density: ['comfortable', 'compact'],
  contrast: ['standard', 'more'],
});
export const APPEARANCE_DEFAULTS = Object.freeze({ motion: 'system', textSize: 'standard', density: 'comfortable', contrast: 'standard' });

export function normalizeAppearance(value) {
  return Object.fromEntries(Object.entries(APPEARANCE_OPTIONS).map(([key, options]) => [
    key, options.includes(value?.[key]) ? value[key] : APPEARANCE_DEFAULTS[key],
  ]));
}

export function readAppearance(storage) {
  try { return normalizeAppearance(JSON.parse(storage.getItem(APPEARANCE_STORAGE_KEY))); }
  catch { return { ...APPEARANCE_DEFAULTS }; }
}
