import assert from "node:assert/strict";
import test from "node:test";
import { PAGE_STATE_COPY } from "../../src/components/page-state/page-state.js";

test("has intentional copy for every repository state", () => {
  for (const status of ["loading", "empty", "error", "forbidden", "conflict"]) {
    assert.equal(typeof PAGE_STATE_COPY[status].title, "string");
    assert.equal(PAGE_STATE_COPY[status].title.length > 0, true);
  }
  assert.match(PAGE_STATE_COPY.forbidden.description, /contexto|permissão/i);
});
