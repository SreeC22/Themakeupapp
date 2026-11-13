import { PREVIEW_STORAGE_KEY, type PreviewState, type StorageLike } from "../mvp/storage.ts";
import { exportLooks } from "./helpers.ts";

/** Keep legacy export fields intact and add the exact raw stores for lossless recovery. */
export function localExport(state: PreviewState, storage: StorageLike) {
  const looksStore = exportLooks(storage);
  if (looksStore.status === "unavailable") throw new Error("Looks storage cannot be read for a lossless export");
  return { ...state, looksStore, previewOriginalRaw: storage.getItem(PREVIEW_STORAGE_KEY) };
}
