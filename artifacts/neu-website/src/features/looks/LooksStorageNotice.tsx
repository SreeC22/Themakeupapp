import { Button } from "@workspace/neu-design-system/components/neu/button";
import { useLooks } from "./use-looks";

export function LooksStorageNotice() {
  const { snapshot, changed, message, reload, exportRaw } = useLooks();
  if (snapshot.status === "ready" && !changed && !message) return null;
  return <aside className="mvp-notice" aria-label="Local look storage" data-testid="status-looks-storage">
    {snapshot.status !== "ready" && <p role="alert">Looks storage: {snapshot.status}. Existing data is protected. Saving is blocked; your working draft stays in memory. Export the original before a confirmed reset in your profile.</p>}
    {message && <p role="status">{message}</p>}
    <div className="mvp-actions">
      <Button variant="secondary" onClick={reload} data-testid="button-reload-looks-library">Reload local library</Button>
      <Button variant="text" onClick={exportRaw} data-testid="button-export-looks-raw">Export original looks data</Button>
    </div>
    {changed && <p className="mvp-muted">Reloading the library does not replace your unsaved editor draft. Review the saved version before confirming an update.</p>}
  </aside>;
}
