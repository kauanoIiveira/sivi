import assert from "node:assert/strict";
import test from "node:test";

test("directory suite executes sibling unit test modules", () => {
  assert.equal(globalThis.__SIVI_UNIT_SUITE__, true);
});
