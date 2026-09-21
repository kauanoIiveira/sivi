export const THEME_STORAGE_KEY = "sivi.theme.v1";
export const THEMES = Object.freeze(["light", "dark"]);
export const THEME_COLORS = Object.freeze({ light: "#F3F4F4", dark: "#111315" });

export function resolveThemePreference(storedValue, systemDark) {
  return THEMES.includes(storedValue) ? storedValue : systemDark ? "dark" : "light";
}

export function nextExplicitTheme(currentTheme) {
  return currentTheme === "dark" ? "light" : "dark";
}
