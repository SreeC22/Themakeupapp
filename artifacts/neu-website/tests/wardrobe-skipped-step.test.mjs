import { test } from "node:test";
import assert from "node:assert/strict";
import { collectionItemMissing } from "../src/features/wardrobe/helpers.ts";
test("skipping a step does not falsely declare its retained collection item missing", () => {
  const edit = { items: [{ id: "TEST-kept" }] };
  assert.equal(collectionItemMissing({ itemId: "TEST-kept", enabled: false }, edit), false);
  assert.equal(collectionItemMissing({ itemId: "TEST-kept", enabled: true }, edit), false);
  assert.equal(collectionItemMissing({ itemId: null }, edit), false);
  assert.equal(collectionItemMissing({ itemId: "TEST-removed", enabled: false }, edit), true);
});
