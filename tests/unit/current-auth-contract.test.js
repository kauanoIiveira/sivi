import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("preserves the approved auth selectors and providers", async () => {
  const html = await read("index.html");
  assert.match(html, /class="auth-shell"/);
  assert.match(html, /id="confirm-password"/);
  assert.equal((html.match(/data-provider="google"/g) ?? []).length, 2);
  assert.equal((html.match(/data-provider="github"/g) ?? []).length, 2);
  assert.match(html, /data-switch-mode="login"/);
  assert.match(html, /data-switch-mode="register"/);
});

test("keeps the bidirectional motion and reduced-motion branch", async () => {
  const transitions = await read("src/pages/auth/auth-transitions.js");
  assert.match(transitions, /switchDesktopMode/);
  assert.match(transitions, /switchCompactMode/);
  assert.match(transitions, /reducedMotionQuery\.matches/);
});
