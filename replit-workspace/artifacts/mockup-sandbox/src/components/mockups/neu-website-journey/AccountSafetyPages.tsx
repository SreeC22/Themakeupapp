import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleAlert, ClipboardList, Info, LockKeyhole, MailCheck, Shield, ShieldCheck, ShieldQuestion, UserCheck } from "lucide-react";
import type { NeuPage } from "./data";
import { Eyebrow, PageIntro } from "./Shared";

export type DesignReport = {
  context: string;
  reason: string;
  detail: string;
  createdInPreview: boolean;
  resolved: boolean;
};

export function AccountLanding({ onNavigate, pendingMessage = "" }: { onNavigate: (page: NeuPage) => void; pendingMessage?: string }) {
  return (
    <main className="wj-content wj-account-page">
      <section className="wj-account-intro"><Eyebrow>YOUR OWN LITTLE CORNER</Eyebrow><h1>A beauty community,<br /><em>on your terms.</em></h1><p>See how a thoughtful account could help you save finds, edit your profile and share a product note. This design walkthrough does not collect your email or password.</p><div className="wj-account-promise"><ShieldCheck size={15} /><span>No credentials collected. No email sent. The preview is not an authenticated service.</span></div></section>
      <section className="wj-account-options">
        <article><span className="wj-account-option-icon"><UserCheck size={18} /></span><Eyebrow>NEW AROUND HERE?</Eyebrow><h2>Make a space for yourself.</h2><p>Walk through a first account setup, eligibility screen and a plain-language explanation of the second factor.</p><button type="button" className="wj-primary" onClick={() => onNavigate("signup")}>Preview sign-up <ArrowRight size={15} /></button></article>
        <article><span className="wj-account-option-icon"><LockKeyhole size={18} /></span><Eyebrow>COMING BACK?</Eyebrow><h2>Your saved finds, together.</h2><p>Preview a sign-in and what recovery could look like. No password, email, verification number or recovery code is requested.</p><button type="button" className="wj-secondary" onClick={() => onNavigate("signin")}>Preview sign-in <ArrowRight size={15} /></button></article>
      </section>
      {pendingMessage && <div className="wj-pending-intent"><Check size={15} /><span>{pendingMessage}</span></div>}
      <section className="wj-account-info"><Shield size={18} /><p>A real account is not connected. The sign-up, security and recovery screens here are design examples only. Identity, region, age, email, MFA and deletion policy need owner review before launch.</p><button type="button" onClick={() => onNavigate("guidelines")}>Read community guidelines <ArrowRight size={13} /></button></section>
      <button type="button" className="wj-text-action" onClick={() => onNavigate("discover")}>Continue without an account <ArrowRight size={14} /></button>
    </main>
  );
}

export function SignUpPage({ onNavigate, onContinue }: {
  onNavigate: (page: NeuPage) => void;
  onContinue: () => void;
}) {
  const [region, setRegion] = useState("");
  const [eligible, setEligible] = useState(false);
  const [acceptDraft, setAcceptDraft] = useState(false);
  const [error, setError] = useState("");
  const submit = () => {
    if (!region || !eligible || !acceptDraft) {
      setError("Choose a region and acknowledge both preview questions to continue.");
      return;
    }
    setError("");
    onContinue();
  };
  return (
    <main className="wj-content wj-narrow-content">
      <div className="wj-account-back"><button type="button" onClick={() => onNavigate("account")}><ArrowLeft size={14} />Account flow</button></div>
      <section className="wj-auth-card">
        <Eyebrow>01 / ACCOUNT ELIGIBILITY PREVIEW</Eyebrow><h1>A space that <em>feels like you.</em></h1>
        <p>Before a real sign-up, Neu needs to decide who can use the community in each region. This screen is a policy placeholder, not an eligibility check.</p>
        <label className="wj-form-label">Region you plan to use Neu<select value={region} onChange={(event) => setRegion(event.target.value)}><option value="">Choose a region</option><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option><option>India</option><option>Somewhere else / still deciding</option></select></label>
        <label className="wj-check-row"><input type="checkbox" checked={eligible} onChange={(event) => setEligible(event.target.checked)} /><span><strong>I meet applicable account eligibility requirements.</strong><small>No date of birth is entered or checked in this preview.</small></span></label>
        <label className="wj-check-row"><input type="checkbox" checked={acceptDraft} onChange={(event) => setAcceptDraft(event.target.checked)} /><span><strong>I have read the terms and privacy concepts.</strong><small>Drafts only. Not legal advice or legal agreement.</small></span></label>
        {error && <p className="wj-form-error" role="alert">{error}</p>}
        <div className="wj-auth-actions"><button className="wj-secondary" type="button" onClick={() => onNavigate("terms")}>Read draft policies</button><button className="wj-primary" type="button" onClick={submit}>Continue the preview <ArrowRight size={14} /></button></div>
        <div className="wj-pending-policy"><Info size={16} /><p>The roadmap suggests a minimum age and mandatory second factor. The age, regional consent, retention and identity policies still need review. This screen commits to none.</p></div>
      </section>
      <p className="wj-auth-privacy">This demo asks for no email, date of birth, legal name, password or location.</p>
    </main>
  );
}

export function SignInPage({ onNavigate, onTry }: { onNavigate: (page: NeuPage) => void; onTry: () => void }) {
  return <main className="wj-content wj-narrow-content"><div className="wj-account-back"><button type="button" onClick={() => onNavigate("account")}><ArrowLeft size={14} />Account flow</button></div><section className="wj-auth-card"><Eyebrow>EXISTING MEMBER / INTERACTION PREVIEW</Eyebrow><h1>Welcome back to <em>your collection.</em></h1><p>Real authentication must use the account service. This design cannot check a password or identify a real member.</p><div className="wj-auth-placeholder"><LockKeyhole size={17} /><div><strong>Sign-in inputs intentionally omitted</strong><span>No email or password field is displayed or sent.</span></div></div><button className="wj-primary wj-auth-main-cta" type="button" onClick={onTry}>Preview the two-step journey <ArrowRight size={15} /></button><div className="wj-auth-bottom-links"><button type="button" onClick={() => onNavigate("signup")}>Create an account preview</button><button type="button" onClick={() => onNavigate("recovery")}>Preview account recovery</button></div><div className="wj-pending-policy"><Shield size={16} /><p>Successful sign-in must require the enrolled second factor. That is a concept only here, not an implemented security feature.</p></div></section></main>;
}

export function MfaPage({ page, onNavigate, onComplete }: { page: "mfa-enroll" | "mfa-challenge"; onNavigate: (page: NeuPage) => void; onComplete: () => void }) {
  const enrolling = page === "mfa-enroll";
  return (
    <main className="wj-content wj-narrow-content">
      <div className="wj-account-back"><button type="button" onClick={() => onNavigate(enrolling ? "signup" : "signin")}><ArrowLeft size={14} />Back to {enrolling ? "eligibility" : "sign in"}</button></div>
      <section className="wj-mfa-card">
        <span className="wj-mfa-symbol">{enrolling ? <ShieldCheck size={24} /> : <LockKeyhole size={24} />}</span>
        <Eyebrow>02 / TWO-STEP SECURITY CONCEPT</Eyebrow>
        <h1>{enrolling ? <>A second step, <em>explained.</em></> : <>One more check, <em>by design.</em></>}</h1>
        <p>{enrolling ? "A real account could pair your password with an authenticator app. Setup, recovery and reset would need a secure backend." : "A real account asks for a rotating authenticator code before opening your profile. No working verification is available in this preview."}</p>
        <div className="wj-mfa-step-list">
          {(enrolling ? [
            ["1", "Install an authenticator", "Use an authenticator you trust, not an email link."],
            ["2", "Pair it privately", "The real service would display a one-time QR code and a manual backup key. Neither is generated here."],
            ["3", "Confirm and save recovery codes", "The real service confirms the setup and shows recovery codes one time. No codes exist in this prototype."],
          ] : [
            ["1", "Open your authenticator", "Use the authenticator paired with your real Neu account."],
            ["2", "Enter the current code", "A secure service would check the code and reject replays. No code is generated or checked here."],
            ["3", "Keep recovery private", "Only use recovery procedures from a real authenticated account."],
          ]).map(([number, title, description]) => <article key={number}><i>{number}</i><div><strong>{title}</strong><span>{description}</span></div></article>)}
        </div>
        <div className="wj-no-secret-box"><Info size={16} /><p>Do not type a real code, password or recovery key into a design preview. No authenticator setup is occurring.</p></div>
        <div className="wj-auth-actions">
          <button type="button" className="wj-text-action" onClick={() => onNavigate("recovery")}>Preview account recovery</button>
          <button type="button" className="wj-primary" onClick={enrolling ? () => onNavigate("mfa-challenge") : onComplete}>{enrolling ? "Continue to the sign-in example" : "Enter the local preview session"} <ArrowRight size={14} /></button>
        </div>
        <span className="wj-session-disclaimer">“Preview session” only. This screen has not authenticated an account or enabled MFA.</span>
      </section>
    </main>
  );
}

export function RecoveryPage({ onNavigate }: { onNavigate: (page: NeuPage) => void }) {
  return (
    <main className="wj-content wj-narrow-content">
      <div className="wj-account-back"><button type="button" onClick={() => onNavigate("signin")}><ArrowLeft size={14} />Sign-in preview</button></div>
      <section className="wj-auth-card"><span className="wj-mfa-symbol"><MailCheck size={23} /></span><Eyebrow>RECOVERY / SAFETY FIRST</Eyebrow><h1>Still your <em>account.</em></h1><p>Recovery should not be an easy way around a second factor. These options show the product conversation, not working account recovery.</p><div className="wj-recovery-options"><article><ShieldCheck size={18} /><div><strong>Private recovery codes</strong><p>Generated once, stored somewhere private, and never shared with another person.</p></div><span>Not generated here</span></article><article><CircleAlert size={18} /><div><strong>Lost your authenticator?</strong><p>A secure support process needs anti-impersonation checks and clear response times.</p></div><span>No support inbox connected</span></article><article><UserCheck size={18} /><div><strong>Delete or restore data</strong><p>Identity checks, data export and deletion terms require an approved account policy.</p></div><span>Requires owner decision</span></article></div><div className="wj-auth-actions"><button type="button" className="wj-secondary" onClick={() => onNavigate("signin")}>Back to sign in</button><button type="button" className="wj-primary" onClick={() => onNavigate("home")}>Return to the public preview <ArrowRight size={14} /></button></div><p className="wj-auth-privacy">No identity, contact information or secret is collected in this recovery walkthrough.</p></section>
    </main>
  );
}

const DOCS: Partial<Record<NeuPage, { eyebrow: string; title: string; accent: string; intro: string; sections: [string, string][] }>> = {
  guidelines: {
    eyebrow: "BE KIND, GET SPECIFIC", title: "A good beauty conversation", accent: "starts here.", intro: "A public conduct guide concept for a future community. Draft content: it is not a live enforceable policy.",
    sections: [
      ["Speak from your experience.", "Share how a formula feels on you, the shade you tried and the conditions around your experience. One person’s match is not someone else’s promise."],
      ["Make room for every depth.", "No complexion, skin condition, age, gender expression or experience is up for judgment. Do not comment on someone’s face, ethnicity or identity without invitation."],
      ["Do not confuse preference with fact.", "Shade names, wear tests and undertone clues are subjective. Say what you observed and avoid medical, SPF or guaranteed-match claims."],
      ["Keep each other safe.", "No harassment, impersonation, doxing, solicitation, spam or unsafe requests for photographs. Never post another person’s details."],
      ["Give credit. Respect rights.", "Post original descriptions. Ask permission before quoting, copying, linking or sharing someone else’s words or images. This preview does not permit uploads."],
      ["Report, do not pile on.", "A real report must be private and reviewed under a clear process. There is no live reporting or moderator queue in this preview."],
    ],
  },
  privacy: {
    eyebrow: "PRIVACY / DRAFT, NOT LEGAL ADVICE", title: "A beauty profile", accent: "is personal.", intro: "Privacy and retention copy are placeholders for design review. No information from this preview is stored or transmitted.",
    sections: [
      ["Collect less.", "A real service would need to name each data element, why it is needed, its legal basis, retention and deletion process. Only information required to make a feature work should be considered."],
      ["Local data means local.", "Saved browser makeup preferences should stay on the device by default. Upload, export or sign-in must not silently import them."],
      ["Separate sharing choice.", "Profile fields stay private until their owner explicitly selects and previews which detail to attach to one post. Future changes must be explained."],
      ["Precise analytics.", "Optional diagnostics or analytics need their own plain-language disclosure and controls. No advertising or tracking is implemented in this prototype."],
      ["Photos are not part of this design.", "Rights, identity, face-image privacy, storage and moderation need separate review before photos can be uploaded."],
      ["Take it down.", "A real product needs accessible account access, data export, account deletion and verified removal times. These controls are not live here."],
    ],
  },
  terms: {
    eyebrow: "TERMS / DRAFT, NOT LEGAL ADVICE", title: "Clear expectations", accent: "from day one.", intro: "This draft is not a legal agreement and should be reviewed by product counsel for every launch region.",
    sections: [
      ["Examples are not advice.", "This prototype contains illustrative user content and unverified product details. It cannot provide personal shade-match, medical, allergy, SPF or performance advice."],
      ["People own their words.", "The sharing model should give members clear control over where their writing appears and how they can edit or remove it. No rights grant or actual publishing occurs here."],
      ["A respectful community.", "A real service needs a fair rules process with clear reasons for content actions and a route for appeal. The sample queue does not enforce policy."],
      ["Availability and safety.", "A product must describe its reasonable availability, moderation and account-security limits without promising certainty or perfection."],
      ["Age and location.", "Age eligibility, parental consent, launch regions, privacy rights and consumer obligations need an explicit owner decision and regional legal review."],
      ["Before launch.", "Payment terms, affiliate relationships, accessibility, dispute handling, security contact and a complete update process require review before real users join."],
    ],
  },
  accessibility: {
    eyebrow: "ACCESSIBILITY / PRODUCT COMMITMENT", title: "Make room for", accent: "everybody.", intro: "A first-pass accessibility statement for design review, not a claim of full standards testing.",
    sections: [
      ["Words travel further than swatches.", "No color-only answer communicates depth, tone or selection. Controls have text names, visible state, and keyboard access."],
      ["Comfortable to navigate.", "The responsive website aims to keep usable touch targets, readable type and short, scannable forms on small screens."],
      ["Motion stays optional.", "Prefer quiet, short transitions. Honor a request for reduced motion, do not rely on animation to convey status, and avoid forced movement."],
      ["Beauty changes in light.", "Digital swatches vary across screens. Never promise an exact skin-color reading from screen pixels. Provide a text label and invite daylight comparison."],
      ["Test with people.", "Keyboard, zoom, screen reader, color perception, device and assistive-technology review are needed before launch."],
      ["Help should be reachable.", "A real accessibility contact, clear issue feedback path and public response commitment have not been supplied."],
    ],
  },
  copyright: {
    eyebrow: "CONTENT RIGHTS / HELP US GET IT RIGHT", title: "Credit, ask,", accent: "give a choice.", intro: "An artwork and product-content process for a future site. Draft guidance, not a legal takedown policy.",
    sections: [
      ["Product names and marks.", "Brand names in sample cards identify an illustrative product page. No affiliation, authorization or trademark endorsement is claimed."],
      ["Your words stay yours.", "Members should know who can see their notes, how they are licensed for display, and how to withdraw them. This prototype does not publish a note."],
      ["Images need permission.", "Do not upload another person’s face, brand campaign art, swatches or packaging without the rights and consent the real service requires."],
      ["Submit a concern.", "A real copyright process needs a contact, required notice fields, verification, response timing and dispute handling. The demo report only records a local preview."],
      ["Correct and remove.", "Catalog details need a verified source and correction path. Product photos, shade references and retailer listings are not connected."],
    ],
  },
};

export function DraftDocumentPage({ page, onNavigate }: { page: NeuPage; onNavigate: (page: NeuPage) => void }) {
  const doc = DOCS[page];
  if (!doc) return <SystemPage page={page} onNavigate={onNavigate} />;
  return (
    <main className="wj-content wj-doc-page">
      <div className="wj-draft-ribbon"><Info size={15} /><span>DRAFT / NOT LEGALLY REVIEWED / NO POLICY TAKES EFFECT IN THIS PREVIEW</span></div>
      <PageIntro eyebrow={doc.eyebrow} title={doc.title} accent={doc.accent}>{doc.intro}</PageIntro>
      <div className="wj-doc-sections">{doc.sections.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><section><h2>{title}</h2><p>{body}</p></section><ChevronDown size={15} aria-hidden="true" /></article>)}</div>
      <div className="wj-doc-footer"><span>Concept copy only. Not an active promise, consent form or legal policy.</span><button type="button" className="wj-text-action" onClick={() => onNavigate("home")}>Back to Neu <ArrowRight size={14} /></button></div>
    </main>
  );
}

export function ReportDialog({ context, onClose, onSubmit }: {
  context: string;
  onClose: () => void;
  onSubmit: (report: DesignReport) => void;
}) {
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reason) {
      setError("Choose a reason so the report preview has useful context.");
      return;
    }
    onSubmit({ context, reason, detail: detail.trim(), createdInPreview: true, resolved: false });
  };
  return <div className="wj-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="wj-report-dialog" role="dialog" aria-modal="true" aria-labelledby="wj-report-title">
    <button type="button" className="wj-modal-close" aria-label="Close report preview" onClick={onClose}>×</button>
    <span className="wj-dialog-icon"><ShieldQuestion size={19} /></span><Eyebrow>PRIVATE / SAFETY PREVIEW ONLY</Eyebrow><h2 id="wj-report-title">Report a concern.</h2><p>Choose a reason and share only what a moderator needs. This report will be held in local design state, not sent to a person.</p><div className="wj-report-context"><span>REPORT ABOUT</span><strong>{context}</strong></div>
    <form onSubmit={handleSubmit}><label className="wj-form-label">What is the concern?<select value={reason} onChange={(event) => { setReason(event.target.value); setError(""); }}><option value="">Choose one</option><option>Harassment or hateful content</option><option>Personal details or safety risk</option><option>Spam or impersonation</option><option>Incorrect product information</option><option>Copyright or image rights</option><option>Something else</option></select></label><label className="wj-form-label">Context for the report <span>Optional. Do not include your contact details or anyone’s private information.</span><textarea rows={3} maxLength={250} value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="A short note for the local preview…" /></label>{error && <p className="wj-form-error" role="alert">{error}</p>}<div className="wj-report-disclosure"><LockKeyhole size={14} /><span>No report is delivered, no identity check is made and no moderation response will arrive.</span></div><div className="wj-modal-actions"><button type="button" className="wj-text-action" onClick={onClose}>Cancel</button><button type="submit" className="wj-primary">Create a local report preview <ArrowRight size={13} /></button></div></form>
  </section></div>;
}

export function ReportsPage({ report, onResolve, onNavigate }: { report: DesignReport | null; onResolve: () => void; onNavigate: (page: NeuPage) => void }) {
  return (
    <main className="wj-content">
      <section className="wj-report-preview-banner"><ShieldCheck size={18} /><div><strong>Moderator access concept. Not a permission system.</strong><span>This page has no owner role, private account data or connected reports.</span></div></section>
      <PageIntro eyebrow="OWNER / MODERATOR VIEW CONCEPT" title="Review the concern" accent="not the person.">A private, restrained queue that supports clear actions, respectful context and thoughtful escalation. Every entry on this screen is design-only.</PageIntro>
      <div className="wj-moderation-layout">
        <aside className="wj-moderation-side"><Eyebrow>INBOX / PREVIEW</Eyebrow><h2>Safety first. Ego last.</h2><p>Moderators should see the minimum useful context and an audit trail, not a reporter’s private identity.</p><div><Check size={14} />Original content hidden where possible</div><div><Check size={14} />No public pile-on</div><div><Check size={14} />Reasoned action and appeal path</div><div><Check size={14} />Sensitive reports kept private</div><button type="button" className="wj-text-action" onClick={() => onNavigate("guidelines")}>Read conduct draft <ArrowRight size={13} /></button></aside>
        <section className="wj-moderation-queue"><div className="wj-queue-header"><div><span className="wj-utility-label">LOCAL REVIEW QUEUE</span><h2>{report && !report.resolved ? "01 preview" : "00 reports"}</h2></div><span className="wj-queue-status">NO LIVE MODERATION</span></div>
          {report ? <article className="wj-report-ticket"><span className="wj-report-status">{report.resolved ? "RESOLVED IN PREVIEW" : "LOCAL PREVIEW REPORT"}</span><h3>{report.reason}</h3><small>ABOUT {report.context.toUpperCase()}</small><p>{report.detail || "No further context supplied."}</p><div><ClipboardList size={14} />Report response time and escalation route need a real service owner.</div>{!report.resolved && <button type="button" className="wj-secondary" onClick={onResolve}>Mark handled in preview <Check size={13} /></button>}</article> : <section className="wj-queue-empty"><span><ClipboardList size={19} /></span><h3>The queue is clear.</h3><p>Reports from the illustration are local and private. Try the report flow from the example note if you would like to see a preview ticket.</p><button className="wj-text-action" type="button" onClick={() => onNavigate("review")}>View an illustrative note <ArrowRight size={13} /></button></section>}
          <p className="wj-moderation-policy-note">In a real service, access to this view would be limited, authenticated and audited. This sample screen provides none of those controls.</p>
        </section>
      </div>
    </main>
  );
}

export function SystemPage({ page, onNavigate }: { page: NeuPage; onNavigate: (page: NeuPage) => void }) {
  const isOffline = page === "offline";
  const isError = page === "unavailable";
  const isRestricted = page === "permission";
  const isLoading = page === "loading";
  if (isLoading) return (
    <main className="wj-content">
      <section className="wj-loading-state" aria-label="Illustrative content loading state">
        <Eyebrow>LIGHTWEIGHT CATALOG PLACEHOLDER</Eyebrow><h1>A little pause, <em>before the page.</em></h1>
        <p>This is a design-only loading state. No catalog request is happening behind it.</p>
        <div className="wj-skeleton-grid" aria-hidden="true">{[0, 1, 2].map((item) => <article key={item}><i /><span /><span /><span /></article>)}</div>
        <button type="button" className="wj-primary" onClick={() => onNavigate("discover")}>View the example catalog <ArrowRight size={14} /></button>
      </section>
    </main>
  );
  return (
    <main className="wj-content">
      <section className="wj-system-state">
        <span className="wj-system-icon">{isOffline ? <CircleAlert size={21} /> : isError ? <Info size={21} /> : isRestricted ? <LockKeyhole size={21} /> : <ClipboardList size={21} />}</span>
        <Eyebrow>{isOffline ? "CONNECTION INTERRUPTED" : isError ? "A LITTLE RESET" : isRestricted ? "NOT AVAILABLE HERE" : "404 / NOT FOUND"}</Eyebrow>
        <h1>{isOffline ? <>Your connection<br /><em>took a moment.</em></> : isError ? <>This page is having<br /><em>a quiet minute.</em></> : isRestricted ? <>This space is <em>private.</em></> : <>We could not find<br /><em>that shade story.</em></>}</h1>
        <p>{isOffline ? "The browser can keep exploring this local design preview. No real products or account service are being contacted." : isError ? "The live Neu service is not connected to this prototype. Your draft has not been submitted or lost." : isRestricted ? "The moderator view is an illustrative owner concept. No real roles, moderation access or permission checks are implemented." : "The page may have moved, or it may not be part of this preview yet."}</p>
        <div><button type="button" className="wj-primary" onClick={() => onNavigate(isError ? "discover" : "home")}>{isError ? "Retry page preview" : "Back to Neu"} <ArrowRight size={14} /></button><button type="button" className="wj-secondary" onClick={() => onNavigate(isRestricted ? "guidelines" : "discover")}>{isRestricted ? "See public guidelines" : "Browse example products"} <ArrowRight size={13} /></button></div>
        <button className="wj-text-action" type="button" onClick={() => onNavigate("learn")}>The color guide remains open <ArrowRight size={13} /></button>
      </section>
    </main>
  );
}
