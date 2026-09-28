import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  nextExplicitTheme,
  resolveThemePreference,
  THEME_COLORS,
} from "../../src/theme/theme-preference.js";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("resolves system, explicit and invalid theme preferences", () => {
  assert.equal(resolveThemePreference(null, false), "light");
  assert.equal(resolveThemePreference(null, true), "dark");
  assert.equal(resolveThemePreference("light", true), "light");
  assert.equal(resolveThemePreference("invalid", true), "dark");
  assert.equal(nextExplicitTheme("dark"), "light");
  assert.equal(THEME_COLORS.light, "#F3F4F4");
});

test("defines orange as the primary action in both themes", async () => {
  const [css, operationsCss] = await Promise.all([
    read("src/styles/theme-tokens.css"),
    read("src/pages/operations/operations-page.css"),
  ]).then((files) => files.map((file) => file.toLowerCase()));
  const lightTheme = css.split(':root[data-theme="dark"]')[0];
  assert.match(lightTheme, /--canvas:\s*#f3f4f4/);
  assert.match(lightTheme, /--surface:\s*#ffffff/);
  assert.match(lightTheme, /--surface-raised:\s*#eceff0/);
  assert.match(lightTheme, /--text-primary:\s*#18232b/);
  assert.match(lightTheme, /--text-muted:\s*#52616b/);
  assert.match(lightTheme, /--action-primary:\s*#fe7f2d/);
  assert.match(lightTheme, /--action-text:\s*#a54100/);
  assert.match(lightTheme, /--page-glow:\s*transparent/);
  assert.match(lightTheme, /--button-primary-fg:\s*#000000/);
  assert.match(lightTheme, /--brand-fox:\s*#fe7f2d/);

  assert.match(css, /:root\[data-theme="dark"\][\s\S]*--canvas:\s*#111315/);
  assert.match(css, /:root\[data-theme="dark"\][\s\S]*--surface:\s*#181a1d/);
  assert.match(css, /:root\[data-theme="dark"\][\s\S]*--surface-raised:\s*#1d2024/);
  assert.match(css, /:root\[data-theme="dark"\][\s\S]*--surface-interactive:\s*#24272b/);
  assert.match(css, /:root\[data-theme="dark"\][\s\S]*--action-primary:\s*#fe7f2d/);
  assert.match(css, /:root\[data-theme="dark"\][\s\S]*--action-text:\s*#fe7f2d/);
  assert.doesNotMatch(css, /#2563eb/);
  assert.doesNotMatch(css, /:root\[data-theme="dark"\][\s\S]*--canvas:\s*#0b171f/);
  assert.match(operationsCss, /\.operations-page button[^}]*color:\s*var\(--button-primary-fg\)/);
});

test("keeps pre-paint colors aligned and forbids global wildcard transitions", async () => {
  const [html, globalCss] = await Promise.all([read("index.html"), read("src/styles/global.css")]);
  assert.match(html, /theme === "dark" \? "#111315" : "#F3F4F4"/);
  assert.doesNotMatch(globalCss, /body\s+\*[^\{]*\{[^\}]*transition/s);
  assert.match(globalCss, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});

test("keeps the light context composition identical to the dark reference", async () => {
  const [contextCss, shellCss] = await Promise.all([
    read("src/pages/context/context-page.css"),
    read("src/layouts/app-shell/app-shell.css"),
  ]);

  assert.match(contextCss, /\.context-page__eyebrow\s*\{[^}]*color:\s*var\(--text-muted\)/);
  assert.match(contextCss, /\.context-card > span\s*\{[^}]*color:\s*var\(--action-text\)/);
  assert.match(contextCss, /\.context-card > em\s*\{[^}]*color:\s*var\(--action-text\)/);
  assert.doesNotMatch(contextCss, /:root\[data-theme="light"\]/);
  assert.doesNotMatch(shellCss, /:root\[data-theme="light"\]/);
});
