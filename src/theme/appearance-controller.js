import { APPEARANCE_DEFAULTS, APPEARANCE_OPTIONS, APPEARANCE_STORAGE_KEY, readAppearance } from './appearance-preference.js';
import { getThemePreference, setThemePreference } from './theme-controller.js';
import { createVLibrasController } from './vlibras-controller.js';

const root = document.documentElement;
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let appearance;
try { appearance = readAppearance(window.localStorage); }
catch { appearance = { ...APPEARANCE_DEFAULTS }; }
const vlibras = createVLibrasController({
  onStateChange: state => window.dispatchEvent(new CustomEvent('sivi:vlibraschange', { detail: state })),
});
let vlibrasSurface;
let vlibrasEnabled = false;

export function getAppearancePreferences() { return { theme: getThemePreference(), ...appearance }; }
export function getVLibrasState() { return vlibras.getState(); }
export function retryVLibras() { vlibras.setEnabled(false); vlibras.setEnabled(document.body.dataset.surface === 'app' && appearance.vlibras === 'on'); }

function apply() {
  const surface = document.body.dataset.surface;
  const inSystem = surface === 'app';
  root.dataset.motion = systemMotion.matches ? 'reduce' : 'full';
  root.dataset.textSize = inSystem ? appearance.textSize : 'standard';
  root.removeAttribute('data-density');
  root.dataset.contrast = inSystem ? appearance.contrast : 'standard';
  root.dataset.colorVision = inSystem ? appearance.colorVision : 'standard';
  const enableVLibras = inSystem && appearance.vlibras === 'on';
  if (vlibrasEnabled && !enableVLibras) { vlibras.setEnabled(false); vlibrasEnabled = false; }
  if (vlibrasSurface !== surface) { vlibras.setSurface(surface); vlibrasSurface = surface; }
  if (vlibrasEnabled !== enableVLibras) { vlibras.setEnabled(enableVLibras); vlibrasEnabled = enableVLibras; }
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
const surfaceObserver = new MutationObserver(apply);
surfaceObserver.observe(document.body, { attributes: true, attributeFilter: ['data-surface'] });
window.addEventListener('storage', event => {
  if (event.key !== APPEARANCE_STORAGE_KEY && event.key !== null) return;
  try { appearance = readAppearance(window.localStorage); }
  catch { appearance = { ...APPEARANCE_DEFAULTS }; }
  apply();
});
apply();
