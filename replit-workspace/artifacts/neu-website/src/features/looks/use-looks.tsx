import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { LOOKS_KEY, readLooks, writeLooks, type LooksData, type LooksRead } from "./storage";
import { downloadJson } from "./helpers";
import { createWorkingDraftCache } from "./working-draft";
import { createWardrobeDraftCache } from "../wardrobe/working-draft";

export const LOOKS_CHANGED = "neu-looks-changed";
const unavailableStorage = {
  getItem: (): string | null => { throw new Error("Storage unavailable"); },
  setItem: () => { throw new Error("Storage unavailable"); },
  removeItem: () => { throw new Error("Storage unavailable"); },
};
function storage() {
  try { return window.localStorage; } catch { return unavailableStorage; }
}

function useLooksResource() {
  const [workingDrafts] = useState(createWorkingDraftCache);
  const [wardrobeDrafts] = useState(createWardrobeDraftCache);
  const [draftEpoch, setDraftEpoch] = useState(0);
  const [snapshot, setSnapshot] = useState<LooksRead>(() => readLooks(storage()));
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;
  const [changed, setChanged] = useState(false);
  const changedRef = useRef(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const change = (event: StorageEvent) => {
      if (event.key !== LOOKS_KEY && event.key !== null) return;
      changedRef.current = true;
      setChanged(true);
      setMessage("Your Neu Edit, routines, looks or owned products changed in another tab. Your unsaved draft is kept. Reload the local library before saving.");
    };
    const reset = () => {
      workingDrafts.clear();
      wardrobeDrafts.clear();
      setDraftEpoch(epoch => epoch + 1);
      const next = readLooks(storage());
      snapshotRef.current = next;
      setSnapshot(next);
      setChanged(false);
      changedRef.current = false;
      setMessage("Your local Neu Edit, routines, looks and owned products were reset.");
    };
    window.addEventListener("storage", change);
    window.addEventListener(LOOKS_CHANGED, reset);
    return () => {
      window.removeEventListener("storage", change);
      window.removeEventListener(LOOKS_CHANGED, reset);
    };
  }, [workingDrafts, wardrobeDrafts]);
  const reload = () => {
    const next = readLooks(storage());
    snapshotRef.current = next;
    setSnapshot(next);
    changedRef.current = false;
    setChanged(false);
    setMessage("Local library reloaded. Any unsaved editor draft is still kept; explicitly reload that saved look to replace it.");
  };
  const commit = (update: (data: LooksData) => LooksData): boolean => {
    if (changedRef.current) {
      setMessage("Not saved: another tab changed the library. Your draft is kept. Reload the local library first.");
      return false;
    }
    const current = snapshotRef.current;
    if (current.status !== "ready") {
      setMessage("Not saved: this local store is protected or unavailable. Export the original data if available. No data was overwritten.");
      return false;
    }
    try {
      const next = { ...update(current.data), revision: crypto.randomUUID() };
      const result = writeLooks(storage(), next, current.data.revision);
      if (result !== "saved") {
        setMessage(result === "conflict"
          ? "Not saved: concurrent revision conflict. Your unsaved draft is kept. Reload the library before trying again."
          : "Not saved: local storage is protected, invalid, full or unavailable. Your unsaved draft is kept.");
        if (result === "conflict") { changedRef.current = true; setChanged(true); }
        return false;
      }
      const nextSnapshot: LooksRead = { status: "ready", data: next, raw: JSON.stringify(next) };
      snapshotRef.current = nextSnapshot;
      setSnapshot(nextSnapshot);
      setMessage("Saved in this browser only.");
      return true;
    } catch {
      setMessage("Not saved: your browser could not write the local data. Your unsaved draft is kept.");
      return false;
    }
  };
  const exportRaw = () => {
    try {
      const latest = readLooks(storage());
      if (latest.status === "unavailable") { setMessage("Storage is unavailable, so its original data cannot be exported."); return; }
      downloadJson({ key: LOOKS_KEY, status: latest.status, raw: latest.raw }, "neu-looks-original.json");
      setMessage("Original local looks data export requested. Nothing was uploaded.");
    } catch { setMessage("Export could not start. Nothing was changed."); }
  };
  return {
    snapshot, changed, message, commit, reload, exportRaw, workingDrafts, wardrobeDrafts, draftEpoch,
    currentRevision: () => snapshotRef.current.data.revision,
    startNewLook: () => workingDrafts.startNew(crypto.randomUUID(), snapshotRef.current.data.revision),
  };
}

type LooksResource = ReturnType<typeof useLooksResource>;
const LooksContext = createContext<LooksResource | null>(null);
export function LooksProvider({ children }: { children: ReactNode }) {
  const resource = useLooksResource();
  return <LooksContext.Provider value={resource}>{children}</LooksContext.Provider>;
}
export function useLooks() {
  const resource = useContext(LooksContext);
  if (!resource) throw new Error("LooksProvider is required");
  return resource;
}
