import type { LookBudget } from "../looks/model.ts";
import { ROUTINES, type NeuEdit, type RoutineName, type SavedRoutine } from "./model.ts";

export type EditDraft = { edit: NeuEdit | null; name: string; tier: LookBudget["tier"]; limit: string; base: string; dirty: boolean };
export type RoutineDraft = { routine: SavedRoutine; base: string; dirty: boolean; initialized: boolean };
export function initialEditDraft(edit?: NeuEdit): EditDraft {
  return { edit: edit ? structuredClone(edit) : null, name: edit?.name ?? "Your Neu Edit", tier: edit?.budget.tier ?? "Any", limit: edit?.budget.limitUSD?.toString() ?? "", base: edit ? JSON.stringify(edit) : "", dirty: false };
}
export function routineRoute(search: string): { key: string; savedId: string | null; template: RoutineName | null } {
  const params = new URLSearchParams(search);
  const savedId = params.get("id") || params.get("saved");
  const requested = params.get("template");
  const template = ROUTINES.find(name => name === requested) ?? null;
  return { key: savedId ? `routine:${savedId}` : `template:${template ?? "chooser"}`, savedId, template };
}
export function initialRoutineDraft(template: RoutineName, id: string, saved?: SavedRoutine): RoutineDraft {
  return { routine: saved ? structuredClone(saved) : { id, name: template, template, variant: "simple", steps: [], updatedAt: new Date().toISOString() }, base: saved ? JSON.stringify(saved) : "", dirty: false, initialized: !!saved };
}

/** Typed provider-lifetime snapshots, not a second localStorage key or an autosave. */
export function createWardrobeDraftCache(capacity = 24) {
  let edit: EditDraft | undefined;
  const routines = new Map<string, RoutineDraft>();
  const clone = <T,>(value: T): T => structuredClone(value);
  return {
    readEdit: () => edit ? clone(edit) : undefined,
    writeEdit: (value: EditDraft) => { edit = clone(value); },
    readRoutine: (key: string) => {
      const value = routines.get(key);
      if (!value) return undefined;
      routines.delete(key); routines.set(key, value);
      return clone(value);
    },
    writeRoutine: (key: string, value: RoutineDraft) => {
      routines.delete(key); routines.set(key, clone(value));
      while (routines.size > Math.max(2, capacity)) routines.delete(routines.keys().next().value!);
    },
    removeRoutine: (key: string) => { routines.delete(key); },
    removeRoutineRecord: (id: string) => {
      for (const [key, value] of routines) if (value.routine.id === id) routines.delete(key);
    },
    clear: () => { edit = undefined; routines.clear(); },
  };
}
