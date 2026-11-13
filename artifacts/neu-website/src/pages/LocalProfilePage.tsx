import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Heading } from "@/features/mvp/Controls";
import { ProfileSummary } from "@/features/mvp/ProfileSummary";
import { usePreview } from "@/features/mvp/use-preview";
import { PREVIEW_STORAGE_KEY, serializePreviewState } from "@/features/mvp/storage";

export default function LocalProfilePage() {
  const { state, status, reset } = usePreview();
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const exportData = () => {
    try {
      const url = URL.createObjectURL(new Blob([serializePreviewState(state)], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url; link.download = "neu-local-preview.json";
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("A local JSON export was requested. It contains this session’s answers, saved IDs and drafts. Nothing was uploaded.");
    } catch {
      setMessage("Your browser could not start the export. Your local data has not changed.");
    }
  };
  return <main className="content mvp-page">
    <Heading eyebrow="LOCAL PROFILE & PRIVACY" title="Your answers, in your hands.">Edit your starting point, choose a local privacy preference and manage only this preview’s data. There is no cloud account.</Heading>
    <ProfileSummary />
    <section className="mvp-panel mvp-stack"><h2>Data in this browser</h2><p>Storage status: {status === "ready" ? "Ready, no preview data saved yet" : status}. Storage key: <code>{PREVIEW_STORAGE_KEY}</code>.</p><p className="mvp-muted">Answers, saved product IDs and drafts are stored locally when your browser permits it. A shared device is not a secure account. Nothing is submitted or synchronized. No camera, photos or tracking are used.</p>
      <div className="mvp-actions"><Button variant="secondary" onClick={exportData}>Export this preview’s local data</Button><Button variant="text" onClick={() => setConfirm(true)}>Reset / delete this preview’s data</Button></div>
      {(status === "corrupt" || status === "unsupported") && <p className="mvp-muted">The unreadable original is preserved in browser storage. This export contains only the current memory session, not that original. A confirmed reset removes the original preview key.</p>}
      {confirm && <section className="mvp-notice" role="group" aria-labelledby="confirm-reset-heading"><h3 id="confirm-reset-heading">Delete this preview’s local data?</h3><p>This clears this preview’s answers, saved IDs, drafts and privacy choice. It does not delete or change unrelated legacy guest state, accounts or any remote data. Export first if you want a copy. This cannot be undone here.</p>
        <div className="mvp-actions"><Button variant="secondary" onClick={() => {
          const deleted = reset(); setConfirm(false);
          setMessage(deleted ? "This preview’s data was deleted from this browser and memory. Legacy guest state was preserved. No remote data was changed." : "This session was reset, but browser storage could not be cleared. Stored preview data may remain and return on reload. Retry deletion when storage is available.");
        }}>Confirm delete this preview’s data</Button><Button variant="text" onClick={() => setConfirm(false)}>Cancel, keep my data</Button></div>
      </section>}
      {message && <p role="status" className="mvp-notice">{message}</p>}
    </section>
    <section className="mvp-panel"><h2>Account actions are not connected</h2><p className="mvp-muted">This preview cannot create an account, send a password email, sync data or delete a server account. These actions remain disabled rather than showing a fake success.</p><div className="mvp-actions"><Button disabled variant="secondary">Sign in unavailable</Button><Button disabled variant="secondary">Register unavailable</Button><Button disabled variant="secondary">Password recovery unavailable</Button><Button disabled variant="secondary">Delete account unavailable</Button></div></section>
    <Link href="/results" className="mvp-link">Back to combined results & research</Link>
  </main>;
}
