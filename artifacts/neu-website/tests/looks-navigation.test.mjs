import test from "node:test";
import assert from "node:assert/strict";
import {
  createWorkingDraftCache, initialWorkingDraft, workingEditorKey,
} from "../src/features/looks/working-draft.ts";
import { buildLook } from "../src/features/looks/model.ts";
import { collectSelections, emptySelections } from "../src/features/looks/helpers.ts";

// Synthetic identities only exercise editor navigation; never used by the app.
const selections = () => ({
  Foundation: { kind: "catalog", shadeId: "unit-medium-sand" },
  Concealer: { kind: "catalog", shadeId: "unit-concealer" },
  Blush: { kind: "owned", ownedId: "unit-owned-blush" },
  Lips: { kind: "catalog", shadeId: "unit-lip" },
});
const working = () => ({
  ...initialWorkingDraft(undefined, "unit-base-revision"),
  name: "My unsaved Soft Glam", occasion: "Soft Glam", tier: "Mid-range", limit: "75.00",
  selections: selections(), dirty: true, active: true, saveMode: "update",
});
const savedLook = () => ({
  id: "unit-saved-look", name: "Saved look", occasion: "Everyday", budget: { tier: "Any" },
  selections: selections(), updatedAt: "2026-11-12T12:00:00Z",
});

test("detail, Learn, Profile and Saved navigation restore the four-slot working editor", () => {
  for (const destination of ["/catalog/shades/unit-medium-sand", "/learn", "/profile", "/looks/saved"]) {
    const cache = createWorkingDraftCache();
    const before = working();
    const route = workingEditorKey("");
    cache.write(route, before);
    // Route unmount and navigation do not hold a page-state object or persist a library entry.
    const elsewhere = { path: destination };
    assert.equal(elsewhere.path, destination);
    const returned = cache.restore(route, undefined, "new-current-library-revision");
    assert.deepEqual(returned, before);
    assert.equal(returned.occasion, "Soft Glam");
    assert.equal(returned.tier, "Mid-range");
    assert.equal(returned.dirty, true);
    assert.equal(returned.baseRevision, "unit-base-revision");
    assert.equal(Object.keys(returned.selections).length, 4);
    assert.equal(Object.hasOwn(returned, "intent"), false);
    assert.equal(Object.hasOwn(returned, "recommendations"), false);
  }
});

test("snapshot and restore detach nested selections instead of sharing mutable page state", () => {
  const cache = createWorkingDraftCache();
  const before = working();
  cache.write("draft:default", before);
  before.selections.Foundation.shadeId = "unit-mutated-after-unmount";
  const returned = cache.restore("draft:default", undefined, "different-revision");
  assert.equal(returned.selections.Foundation.shadeId, "unit-medium-sand");
  returned.selections.Foundation.shadeId = "unit-mutated-restored-page";
  assert.equal(cache.read("draft:default").selections.Foundation.shadeId, "unit-medium-sand");
});

test("explicit nulls, missing retained IDs and raw budget/name edits survive the round trip", () => {
  const cache = createWorkingDraftCache();
  const before = {
    ...working(), name: "Name still being edited", limit: "not yet a valid amount",
    selections: {
      Foundation: { kind: "catalog", shadeId: "unit-no-longer-in-catalog" },
      Concealer: null, Blush: { kind: "owned", ownedId: "unit-removed-from-inventory" }, Lips: null,
    },
  };
  cache.write("draft:default", before);
  assert.deepEqual(cache.restore("draft:default", undefined, "later"), before);
});

test("return-time evidence revalidation marks missing choices unresolved without replacing them", () => {
  const cache = createWorkingDraftCache();
  cache.write("draft:default", working());
  const returned = cache.restore("draft:default", undefined, "later");
  const plan = buildLook({
    catalog: { brands: [], products: [], shades: [], coverage: {} },
    recommendations: { version: "unit-empty-evidence", candidates: [], notes: [], excludedCount: 0 },
    profile: { depth: "Medium", preferences: { Foundation: { finish: "Matte" } } },
    occasion: returned.occasion, budget: { tier: returned.tier, limitUSD: Number(returned.limit) },
    owned: [], selections: returned.selections,
  });
  assert.ok(plan.slots.every(slot => slot.selected === null && slot.unresolved.length > 0));
  assert.deepEqual(collectSelections(plan, returned.selections), returned.selections);
  assert.deepEqual(cache.read("draft:default").selections, selections());
});

test("an external edit or deletion cannot reset a cached editor's identity or conflict baseline", () => {
  const cache = createWorkingDraftCache();
  const original = savedLook();
  const before = {
    ...initialWorkingDraft(original, "original-revision"),
    name: "Unsaved rename", dirty: true, selections: { ...original.selections, Lips: null },
  };
  const key = workingEditorKey(`edit=${original.id}`);
  cache.write(key, before);
  const externallyEdited = { ...original, name: "Changed in another tab" };
  const returned = cache.restore(key, externallyEdited, "new-library-revision");
  assert.deepEqual(returned, before);
  assert.notEqual(JSON.stringify(externallyEdited), returned.base);
  assert.equal(returned.baseRevision, "original-revision");
  const afterDeletion = cache.restore(key, undefined, "deleted-library-revision");
  assert.equal(afterDeletion.id, original.id);
  assert.equal(afterDeletion.dirty, true);
  assert.equal(afterDeletion.selections.Lips, null);
});

test("explicit Start new gets an empty independent editor and Back still restores the old draft", () => {
  const cache = createWorkingDraftCache();
  cache.write("draft:default", working());
  const route = cache.startNew("unit-new-editor", "current-revision");
  assert.equal(route, "/looks?draft=unit-new-editor");
  const fresh = cache.restore(workingEditorKey(route.split("?")[1]), undefined, "current-revision");
  assert.equal(fresh.id, undefined);
  assert.equal(fresh.name, "");
  assert.equal(fresh.occasion, "Everyday");
  assert.equal(fresh.tier, "Any");
  assert.equal(fresh.dirty, false);
  assert.deepEqual(fresh.selections, emptySelections());
  assert.deepEqual(cache.restore("draft:default", undefined, "later"), working());
});

test("successful new Save promotes the draft to its saved identity rather than reviving it as new", () => {
  const cache = createWorkingDraftCache();
  const before = working();
  cache.write("draft:default", before);
  const record = {
    ...savedLook(), name: before.name, occasion: before.occasion,
    budget: { tier: before.tier, limitUSD: Number(before.limit) }, selections: before.selections,
  };
  cache.saved("draft:default", before, record, "revision-after-real-save");
  const fromOldUrl = cache.restore("draft:default", undefined, "later");
  const fromSavedUrl = cache.restore(workingEditorKey(`edit=${record.id}`), record, "later");
  assert.equal(fromOldUrl.id, record.id);
  assert.equal(fromOldUrl.dirty, false);
  assert.equal(fromOldUrl.base, JSON.stringify(record));
  assert.equal(fromOldUrl.baseRevision, "revision-after-real-save");
  assert.deepEqual(fromOldUrl, fromSavedUrl);
  const newRoute = cache.startNew("unit-after-save", "revision-after-real-save");
  const fresh = cache.restore(workingEditorKey(newRoute.split("?")[1]), undefined, "later");
  assert.equal(fresh.id, undefined);
  assert.deepEqual(fresh.selections, emptySelections());
});

test("Save as new keeps the original saved editor's unsaved state and opens a separate saved ID", () => {
  const cache = createWorkingDraftCache();
  const original = savedLook();
  const before = { ...initialWorkingDraft(original, "original-revision"), name: "Edited copy", dirty: true };
  const originalKey = workingEditorKey(`edit=${original.id}`);
  cache.write(originalKey, before);
  const copy = { ...original, id: "unit-copy-id", name: before.name };
  cache.saved(originalKey, before, copy, "copy-save-revision");
  assert.deepEqual(cache.restore(originalKey, original, "copy-save-revision"), before);
  const reopenedCopy = cache.restore(workingEditorKey(`edit=${copy.id}`), copy, "copy-save-revision");
  assert.equal(reopenedCopy.id, copy.id);
  assert.equal(reopenedCopy.dirty, false);
  assert.equal(reopenedCopy.base, JSON.stringify(copy));
  assert.equal(original.id, "unit-saved-look");
  assert.equal(original.name, "Saved look");
});

test("transient snapshots are bounded and explicit reset clears them", () => {
  const cache = createWorkingDraftCache(3);
  cache.write("draft:first", working());
  cache.startNew("second", "r");
  cache.startNew("third", "r");
  cache.read("draft:first");
  cache.startNew("fourth", "r");
  assert.equal(cache.size(), 3);
  assert.equal(cache.read("draft:second"), undefined);
  assert.deepEqual(cache.read("draft:first"), working());
  cache.clear();
  assert.equal(cache.size(), 0);
  assert.deepEqual(cache.restore("draft:first", undefined, "r").selections, emptySelections());
});
