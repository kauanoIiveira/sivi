import assert from "node:assert/strict";
import test from "node:test";
import { RAIL_STATUS_LABELS } from "../../src/visualizations/industrial-rail/industrial-rail.js";

test("labels every demonstrative rail status without relying on color", () => {
  assert.deepEqual(Object.keys(RAIL_STATUS_LABELS).sort(), [
    "active",
    "attention",
    "completed",
    "locked",
    "partial",
    "upcoming",
  ]);
  assert.equal(RAIL_STATUS_LABELS.attention.glyph, "!");
  assert.match(RAIL_STATUS_LABELS.locked.label, /bloqueada/i);
});
