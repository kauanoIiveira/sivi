export const APPEARANCE_STORAGE_KEY = 'sivi.appearance.v1';
export const APPEARANCE_OPTIONS = Object.freeze({
  textSize: ['standard', 'large'],
  contrast: ['standard', 'more'],
  colorVision: ['standard', 'redGreen', 'blueYellow'],
  vlibras: ['off', 'on'],
});
export const APPEARANCE_DEFAULTS = Object.freeze({ textSize: 'standard', contrast: 'standard', colorVision: 'standard', vlibras: 'off' });

export function normalizeAppearance(value) {
  return Object.fromEntries(Object.entries(APPEARANCE_OPTIONS).map(([key, options]) => [
    key, options.includes(value?.[key]) ? value[key] : APPEARANCE_DEFAULTS[key],
  ]));
}

export function readAppearance(storage) {
  try { return normalizeAppearance(JSON.parse(storage.getItem(APPEARANCE_STORAGE_KEY))); }
  catch { return { ...APPEARANCE_DEFAULTS }; }
}
