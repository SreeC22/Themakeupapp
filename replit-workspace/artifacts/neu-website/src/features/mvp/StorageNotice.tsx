import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { usePreview } from "./use-preview";

export function StorageNotice() {
  const { status, retryStorage } = usePreview();
  const failed = status === "unavailable" || status === "corrupt" || status === "unsupported";
  return <aside className={`mvp-storage${failed ? " mvp-storage-warning" : ""}`} aria-label="Local preview storage">
    <p role="status">{status === "corrupt" ? "Stored Neu data could not be read. It has not been overwritten. Changes work in memory only. Export this session or confirm a reset in Profile."
      : status === "unsupported" ? "Stored Neu data uses a different version. It has been preserved. This session is memory-only until you explicitly reset in Profile."
      : status === "unavailable" ? "Browser storage is unavailable. Your changes work in memory only and may be lost on reload. Export them from Profile."
      : "Saved in this browser. Selected traits are processed by Neu for suggestions, not stored on the server. No public posting or account sync."}</p>
    {status === "unavailable" && <Button variant="text" onClick={retryStorage}>Retry storage</Button>}
    {failed && <Link href="/profile" className="mvp-link">Storage settings</Link>}
  </aside>;
}
