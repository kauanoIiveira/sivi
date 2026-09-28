import {
  THEME_COLORS,
  THEME_STORAGE_KEY,
  THEMES,
  nextExplicitTheme,
  resolveThemePreference,
} from "./theme-preference.js";

const root = document.documentElement;
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const getToggles = () => [...document.querySelectorAll("[data-theme-toggle]")];
let preference = readPreference();

function readPreference() {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(value) ? value : null;
  } catch {
    return null;
  }
}

const resolveTheme = () => resolveThemePreference(preference, systemTheme.matches);

const currentTheme = () => (THEMES.includes(root.dataset.theme) ? root.dataset.theme : resolveTheme());

function updateToggle(toggle, theme) {
  const nextTheme = nextExplicitTheme(theme);
  const action = `Ativar tema ${nextTheme === "dark" ? "escuro" : "claro"}`;
  toggle.setAttribute("aria-label", action);
  toggle.setAttribute("title", action);
  toggle.dataset.nextTheme = nextTheme;
}

function initializeAddedToggles(node, theme) {
  if (!(node instanceof Element)) return;
  if (node.matches("[data-theme-toggle]")) updateToggle(node, theme);
  node.querySelectorAll("[data-theme-toggle]").forEach((toggle) => updateToggle(toggle, theme));
}

function applyTheme(theme, { emit = true } = {}) {
  const safeTheme = THEMES.includes(theme) ? theme : resolveTheme();
  root.dataset.theme = safeTheme;
  root.style.colorScheme = safeTheme;
  themeColor?.setAttribute("content", THEME_COLORS[safeTheme]);
  getToggles().forEach((toggle) => updateToggle(toggle, safeTheme));
  if (emit) window.dispatchEvent(new CustomEvent("sivi:themechange", { detail: { theme: safeTheme } }));
}

export function getThemePreference() { return preference ?? 'system'; }

export function setThemePreference(theme) {
  if (![...THEMES, 'system'].includes(theme)) return false;
  preference = theme === 'system' ? null : theme;
  let saved = true;
  try {
    if (preference === null) window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    saved = false;
  }
  applyTheme(resolveTheme());
  return saved;
}

document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-theme-toggle]");
  if (!toggle) return;
  const current = currentTheme();
  const next = nextExplicitTheme(current);
  setThemePreference(next);
});

const themeToggleObserver = new MutationObserver((records) => {
  const theme = currentTheme();
  records.forEach((record) => {
    if (record.type === "attributes") {
      if (record.target.matches("[data-theme-toggle]")) updateToggle(record.target, theme);
      return;
    }
    record.addedNodes.forEach((node) => initializeAddedToggles(node, theme));
  });
});

themeToggleObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["data-theme-toggle"],
});

systemTheme.addEventListener("change", () => {
  if (preference === null) applyTheme(resolveTheme());
});

window.addEventListener("storage", (event) => {
  if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
  preference = THEMES.includes(event.newValue) ? event.newValue : null;
  applyTheme(resolveTheme());
});

window.addEventListener("sivi:theme-refresh", () => {
  applyTheme(resolveTheme(), { emit: false });
});

applyTheme(resolveTheme(), { emit: false });
root.dataset.themeReady = "true";
