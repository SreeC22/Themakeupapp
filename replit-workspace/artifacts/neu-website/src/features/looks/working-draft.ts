import type { LookBudget, LookSelections, Occasion, SavedLook } from "./model.ts";
import { emptySelections } from "./helpers.ts";

export type WorkingLookDraft = {
  id?: string;
  name: string;
  occasion: Occasion;
  tier: LookBudget["tier"];
  limit: string;
  selections: LookSelections;
  base: string;
  baseRevision: string;
  dirty: boolean;
  active: boolean;
  saveMode: "update" | "new" | null;
};

export function workingEditorKey(search: string): string {
  const params = new URLSearchParams(search);
  const edit = params.get("edit");
  return edit ? `saved:${edit}` : `draft:${params.get("draft") || "default"}`;
}

export function initialWorkingDraft(saved: SavedLook | undefined, revision: string): WorkingLookDraft {
  return {
    id: saved?.id, name: saved?.name ?? "", occasion: saved?.occasion ?? "Everyday",
    tier: saved?.budget.tier ?? "Any", limit: saved?.budget.limitUSD?.toString() ?? "",
    selections: { ...emptySelections(), ...saved?.selections },
    base: saved ? JSON.stringify(saved) : "", baseRevision: revision,
    dirty: false, active: !!saved, saveMode: null,
  };
}

function cloneDraft(draft: WorkingLookDraft): WorkingLookDraft {
  return {
    ...draft,
    selections: Object.fromEntries(Object.entries(draft.selections).map(([category, choice]) => [
      category, choice ? { ...choice } : choice,
    ])),
  };
}

/**
 * Provider-lifetime navigation snapshots only, never a saved-library write.
 * Bounded LRU: at most 24 editor routes survive within this mounted app session.
 * API responses and pending generation intents deliberately never enter this cache.
 */
export function createWorkingDraftCache(capacity = 24) {
  const entries = new Map<string, WorkingLookDraft>();
  const maximum = Math.max(2, Math.floor(capacity));
  const write = (key: string, draft: WorkingLookDraft) => {
    entries.delete(key);
    entries.set(key, cloneDraft(draft));
    while (entries.size > maximum) entries.delete(entries.keys().next().value!);
  };
  const read = (key: string): WorkingLookDraft | undefined => {
    const draft = entries.get(key);
    if (!draft) return undefined;
    entries.delete(key);
    entries.set(key, draft);
    return cloneDraft(draft);
  };
  return {
    read, write,
    restore: (key: string, saved: SavedLook | undefined, revision: string) =>
      read(key) ?? initialWorkingDraft(saved, revision),
    startNew: (token: string, revision: string) => {
      const route = `/looks?draft=${encodeURIComponent(token)}`;
      write(workingEditorKey(route.split("?")[1]), initialWorkingDraft(undefined, revision));
      return route;
    },
    saved: (sourceKey: string, current: WorkingLookDraft, record: SavedLook, revision: string) => {
      const saved = initialWorkingDraft(record, revision);
      // Save-as-new must not relabel the original saved editor as the new ID.
      write(sourceKey, sourceKey.startsWith("saved:") && current.id !== record.id ? current : saved);
      write(`saved:${record.id}`, saved);
      return saved;
    },
    clear: () => entries.clear(),
    size: () => entries.size,
  };
}
