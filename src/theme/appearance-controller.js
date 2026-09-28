import { APPEARANCE_DEFAULTS, APPEARANCE_OPTIONS, APPEARANCE_STORAGE_KEY, readAppearance } from './appearance-preference.js';
import { getThemePreference, setThemePreference } from './theme-controller.js';

const root = document.documentElement;
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let appearance;
try { appearance = readAppearance(window.localStorage); }
catch { appearance = { ...APPEARANCE_DEFAULTS }; }

export function getAppearancePreferences() { return { theme: getThemePreference(), ...appearance }; }

function apply() {
  root.dataset.motion = appearance.motion === 'reduce' || systemMotion.matches ? 'reduce' : 'full';
  root.dataset.textSize = appearance.textSize;
  root.dataset.density = appearance.density;
  root.dataset.contrast = appearance.contrast;
  window.dispatchEvent(new CustomEvent('sivi:appearancechange', { detail: getAppearancePreferences() }));
}

export function setAppearancePreference(key, value) {
  if (key === 'theme') return setThemePreference(value);
  if (!APPEARANCE_OPTIONS[key]?.includes(value)) return false;
  appearance[key] = value;
  let saved = true;
  try { window.localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(appearance)); }
  catch { saved = false; }
  apply();
  return saved;
}

export function resetAppearancePreferences() {
  appearance = { ...APPEARANCE_DEFAULTS };
  let saved = setThemePreference('system');
  try { window.localStorage.removeItem(APPEARANCE_STORAGE_KEY); }
  catch { saved = false; }
  apply();
  return saved;
}

systemMotion.addEventListener('change', apply);
window.addEventListener('storage', event => {
  if (event.key !== APPEARANCE_STORAGE_KEY && event.key !== null) return;
  try { appearance = readAppearance(window.localStorage); }
  catch { appearance = { ...APPEARANCE_DEFAULTS }; }
  apply();
});
apply();
