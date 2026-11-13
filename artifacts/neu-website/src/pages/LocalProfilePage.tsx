import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Heading } from "@/features/mvp/Controls";
import { ProfileSummary } from "@/features/mvp/ProfileSummary";
import { usePreview } from "@/features/mvp/use-preview";
import { PREVIEW_STORAGE_KEY } from "@/features/mvp/storage";
import { localExport } from "@/features/looks/local-export";
import { downloadJson } from "@/features/looks/helpers";
import { LooksStorageNotice } from "@/features/looks/LooksStorageNotice";

export default function LocalProfilePage() {
  const { state, status, reset } = usePreview();
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const exportData = () => {
    try {
      downloadJson(localExport(state, window.localStorage), "neu-local-preview.json");
      setMessage("A local JSON export was requested. It contains your answers, saved product IDs, private drafts, complete look selections and owned inventory, plus the exact original raw stores for recovery. Nothing was uploaded.");
    } catch {
      setMessage("Your browser could not read all local data or start the lossless export. Your data has not changed. Try again when storage is available.");
    }
  };
  return <main className="content mvp-page">
    <Heading eyebrow="LOCAL PROFILE & PRIVACY" title="Your answers, in your hands.">Edit complexion traits and reference shades anytime. Category preferences live in discovery. No account needed, and no public profile.</Heading>
    <ProfileSummary />
    <div className="mvp-actions"><Link href="/looks" className="mvp-link">Build your Neu Look</Link><Link href="/looks/saved" className="mvp-link">Saved looks & owned makeup</Link></div>
    <LooksStorageNotice />
    <section className="mvp-panel"><h2>Private experience drafts</h2><p className="mvp-muted">Your earlier review drafts are preserved locally. They are not submitted, moderated or public. Public community is outside the MVP and requires 500+ registered users and explicit phase approval.</p><Link href="/community" className="mvp-link">Manage private local drafts</Link></section>
    <section className="mvp-panel mvp-stack"><h2>Data in this browser</h2><p>Storage status: {status === "ready" ? "Ready, no preview data saved yet" : status}. Storage key: <code>{PREVIEW_STORAGE_KEY}</code>.</p><p className="mvp-muted">Answers, saved product IDs and drafts are stored locally when your browser permits it. Selected complexion traits, catalog reference IDs, fit/oxidation feedback and category preferences are sent to Neu's recommendation service to prepare suggestions, not saved as a server profile or logged in request bodies. Private review drafts are not sent. A shared device is not a secure account. No public posting, account synchronization, camera, photos or tracking are used.</p>
      <div className="mvp-actions"><Button variant="secondary" onClick={exportData}>Export this preview’s local data</Button><Button variant="text" onClick={() => setConfirm(true)}>Reset / delete this preview’s data</Button></div>
      {(status === "corrupt" || status === "unsupported") && <p className="mvp-muted">The unreadable original is preserved in browser storage. The export includes its exact raw value as well as this memory session. A confirmed reset removes the original preview key and local looks key.</p>}
      {confirm && <section className="mvp-notice" role="group" aria-labelledby="confirm-reset-heading"><h3 id="confirm-reset-heading">Delete this preview’s local data?</h3><p>This clears this preview’s answers, saved product IDs, private drafts, complete and draft looks, owned inventory and privacy choice, including protected originals in these two preview keys. It does not delete or change unrelated legacy guest state, accounts or any remote data. Export first if you want a copy. This cannot be undone here.</p>
        <div className="mvp-actions"><Button variant="secondary" onClick={() => {
          const deleted = reset(); setConfirm(false);
          setMessage(deleted ? "This preview’s profile, looks, owned inventory and drafts were deleted from this browser and memory. Legacy guest state was preserved. No remote data was changed." : "This session was reset, but one or both local stores could not be cleared. Stored data may remain and return on reload. Retry deletion when storage is available.");
        }}>Confirm delete this preview’s data</Button><Button variant="text" onClick={() => setConfirm(false)}>Cancel, keep my data</Button></div>
      </section>}
      {message && <p role="status" className="mvp-notice">{message}</p>}
    </section>
    <section className="mvp-panel"><h2>Account actions are not connected</h2><p className="mvp-muted">This preview cannot create an account, send a password email, sync data or delete a server account. These actions remain disabled rather than showing a fake success.</p><div className="mvp-actions"><Button disabled variant="secondary">Sign in unavailable</Button><Button disabled variant="secondary">Register unavailable</Button><Button disabled variant="secondary">Password recovery unavailable</Button><Button disabled variant="secondary">Delete account unavailable</Button></div></section>
    <Link href="/results" className="mvp-link">Back to combined results & research</Link>
  </main>;
}
