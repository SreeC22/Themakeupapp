import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check, Heart, Info, LockKeyhole, LogOut, Shield, Sparkles, Trash2, UserRound } from "lucide-react";
import type { NeuPage, ProductExample, Profile } from "./data";
import { SAMPLE_PRODUCTS } from "./data";
import { Eyebrow, ExampleNotice, PageIntro, ProductCard } from "./Shared";

export type MemberNote = {
  id: string;
  brand: string;
  productName: string;
  category: string;
  shade: string;
  story: string;
  routine: string;
  repurchase: string;
  contextVisible: boolean;
  editOf: string | null;
};

export function SavedPage({ previewMember, savedIds, onNavigate, onOpenProduct, onToggleSave }: {
  previewMember: boolean;
  savedIds: string[];
  onNavigate: (page: NeuPage) => void;
  onOpenProduct: (product: ProductExample) => void;
  onToggleSave: (id: string) => void;
}) {
  const saved = SAMPLE_PRODUCTS.filter((item) => savedIds.includes(item.id));
  return (
    <main className="wj-content">
      <PageIntro eyebrow="Your personal collection" title="Your saved" accent="shade notes.">A place for products you want to revisit. This walkthrough keeps all saves in local demo state only, not in an account or in the cloud.</PageIntro>
      {!previewMember ? (
        <section className="wj-gated-state"><div className="wj-gate-icon"><LockKeyhole size={21} /></div><Eyebrow>ACCOUNT-GATED FEATURE</Eyebrow><h2>Make room for your next favorite.</h2><p>Saving for yourself belongs behind an account. See the sign-up and two-step account-protection screens without entering an email address, password or one-time code.</p><button className="wj-primary" type="button" onClick={() => onNavigate("account")}>Preview the account flow <ArrowRight size={15} /></button><button className="wj-text-action" type="button" onClick={() => onNavigate("discover")}>Keep exploring as a guest</button></section>
      ) : saved.length ? (
        <><div className="wj-preview-session-note"><Sparkles size={15} /><span>Demo session only. These saved cards exist in this browser preview and disappear on refresh.</span></div><div className="wj-product-grid">{saved.map((product) => <ProductCard key={product.id} product={product} onOpen={() => onOpenProduct(product)} isSaved={true} onSave={() => onToggleSave(product.id)} />)}</div></>
      ) : (
        <section className="wj-empty-state wj-saved-empty"><span className="wj-empty-icon"><Heart size={20} /></span><Eyebrow>A clean little shelf</Eyebrow><h2>Nothing saved in your preview yet.</h2><p>Browse the example library and save a card to see how a personal collection could feel.</p><button type="button" className="wj-primary" onClick={() => onNavigate("discover")}>Find a product example <ArrowRight size={15} /></button></section>
      )}
    </main>
  );
}

const SHARE_CATEGORIES = ["Foundation", "Skin tint", "Concealer", "Blush", "Bronzer", "Lipstick", "Lip gloss", "Eyeshadow", "Mascara", "Sunscreen", "Primer", "Powder"];

export function SharePage({
  profile,
  previewMember,
  editingNote,
  draftNote,
  onNavigate,
  onPreview,
}: {
  profile: Profile;
  previewMember: boolean;
  editingNote: MemberNote | null;
  draftNote: MemberNote | null;
  onNavigate: (page: NeuPage) => void;
  onPreview: (note: MemberNote) => void;
}) {
  const [brand, setBrand] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(SHARE_CATEGORIES[0]);
  const [shade, setShade] = useState("");
  const [story, setStory] = useState("");
  const [routine, setRoutine] = useState("");
  const [repurchase, setRepurchase] = useState("Still deciding");
  const [contextVisible, setContextVisible] = useState(false);
  const sourceNote = draftNote ?? editingNote;

  useEffect(() => {
    setBrand(sourceNote?.brand || "");
    setProductName(sourceNote?.productName || "");
    setCategory(sourceNote?.category || SHARE_CATEGORIES[0]);
    setShade(sourceNote?.shade || "");
    setStory(sourceNote?.story || "");
    setRoutine(sourceNote?.routine || "");
    setRepurchase(sourceNote?.repurchase || "Still deciding");
    setContextVisible(sourceNote?.contextVisible || false);
  }, [sourceNote?.id]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onPreview({
      id: editingNote?.id || sourceNote?.id || `demo-note-${Date.now()}`,
      brand: brand.trim(),
      productName: productName.trim(),
      category,
      shade: shade.trim(),
      story: story.trim(),
      routine: routine.trim(),
      repurchase,
      contextVisible,
      editOf: editingNote?.id || sourceNote?.editOf || null,
    });
  };

  return (
    <main className="wj-content">
      <PageIntro eyebrow="A note worth passing on" title="Share what" accent="works for you.">Specific is generous. Write about one product, a shade and how you personally use it. Your preview note is not sent to anyone.</PageIntro>
      <ExampleNotice>{previewMember ? "Preview publish is local only. No account, post or community service is connected." : "This future feature is account-gated. Use the preview account flow first. No contact details are collected."}</ExampleNotice>
      {!previewMember ? <section className="wj-share-gate"><LockKeyhole size={22} /><div><h2>A note is yours before it is anyone else’s.</h2><p>Sharing sits behind an account. Walk through the concept without entering email or password details.</p></div><button type="button" className="wj-primary" onClick={() => onNavigate("account")}>Preview account steps <ArrowRight size={15} /></button></section> :
        <div className="wj-share-layout">
          <aside className="wj-share-aside"><Eyebrow>{editingNote ? "A THOUGHT, REVISITED" : "PASS THE GOOD STUFF ON"}</Eyebrow><h2>{editingNote ? "Change it until it feels like you." : "A product that gets you?"}</h2><p>Add the shade, the finish and the little detail that makes a product feel personal.</p><div><Shield size={16} /><span>Your note stays local to this design preview. Nothing will be shared.</span></div><p className="wj-profile-preview">{profile.depth ? `Depth ${profile.depth}` : "Depth left open"} · {profile.undertone || "Undertone left open"}</p></aside>
          <form className="wj-share-form" onSubmit={submit}>
            <div className="wj-form-heading"><span>NOTE DETAILS / DESIGN PREVIEW</span><span>{editingNote ? "EDIT" : "NEW"}</span></div>
            <div className="wj-form-grid"><label>Brand<input required value={brand} onChange={(event) => setBrand(event.target.value)} placeholder="e.g. a brand you use" /></label><label>Exact product / formula<input required value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="Name it as clearly as you can" /></label></div>
            <div className="wj-form-grid"><label>Makeup category<select required value={category} onChange={(event) => setCategory(event.target.value)}>{SHARE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label><label>Shade name or number<input value={shade} onChange={(event) => setShade(event.target.value)} placeholder="Optional if unknown" /></label></div>
            <label>What does it feel like on you?<textarea required rows={4} maxLength={420} value={story} onChange={(event) => setStory(event.target.value)} placeholder="Finish, feel, wear or the way it makes you feel. Speak in your own voice." /></label>
            <label>How do you use it?<textarea rows={3} maxLength={240} value={routine} onChange={(event) => setRoutine(event.target.value)} placeholder="A small application note, if useful." /></label>
            <fieldset><legend>Would you buy it again? <small>Optional</small></legend><div className="wj-inline-chips">{["Yes", "No", "Still deciding"].map((item) => <button className={repurchase === item ? "is-selected" : ""} type="button" key={item} aria-pressed={repurchase === item} onClick={() => setRepurchase(item === repurchase ? "Still deciding" : item)}>{item}</button>)}</div></fieldset>
            <label className="wj-context-consent"><input type="checkbox" checked={contextVisible} onChange={(event) => setContextVisible(event.target.checked)} /><span><strong>Show skin context with this note.</strong><small>Default is private. If selected, the depth and undertone below will appear in this design preview.</small></span></label>
            <div className="wj-profile-chip-row"><span>YOUR PROFILE IS PRIVATE</span>{profile.depth && <span>Depth {profile.depth}</span>}{profile.undertone && <span>{profile.undertone}</span>}{profile.olive && <span>Olive cast</span>}{profile.depth === null && !profile.undertone && !profile.olive && <span>No profile context added</span>}</div>
            <div className="wj-rights-note"><Info size={15} /><span>Do not add photos here. Photo uploads need separate rights, privacy and moderation review.</span></div>
            <div className="wj-share-form-actions"><button type="button" className="wj-text-action" onClick={() => onNavigate("discover")}>Cancel</button><button type="submit" className="wj-primary">{editingNote ? "Preview my edit" : "Preview my note"} <ArrowRight size={14} /></button></div>
          </form>
        </div>
      }
    </main>
  );
}

export function SharePreviewPage({ note, previewMember, onBack, onEdit, onPublish }: {
  note: MemberNote | null;
  previewMember: boolean;
  onBack: () => void;
  onEdit: () => void;
  onPublish: () => void;
}) {
  if (!note) return <main className="wj-content"><section className="wj-empty-state"><Eyebrow>Nothing to preview</Eyebrow><h1>Your note draft is open.</h1><button className="wj-primary" type="button" onClick={onBack}>Return to sharing <ArrowRight size={14} /></button></section></main>;
  return (
    <main className="wj-content wj-narrow-content">
      <div className="wj-breadcrumb"><span>SHARE A FIND</span><ArrowRight size={13} /><span>PREVIEW</span></div>
      <PageIntro eyebrow="Before it leaves your hands" title="Take one more" accent="look.">Read the note the way someone else would. This review has not been published. In the prototype, continuing adds a local example only.</PageIntro>
      <article className="wj-note-preview">
        <div className="wj-note-preview-status">YOUR PREVIEW / NOT SHARED</div>
        <span className="wj-utility-label">{note.brand}</span><h2>{note.productName}</h2><p>{note.category} {note.shade && `· ${note.shade}`}</p>
        <blockquote>{note.story}</blockquote>
        {note.routine && <section><small>HOW I USE IT</small><p>{note.routine}</p></section>}
        {note.repurchase !== "Still deciding" && <section><small>REPURCHASE</small><p>{note.repurchase}</p></section>}
        {note.contextVisible && <section><small>SKIN CONTEXT · SHOWN BY CHOICE</small><p>Your context will be shown if this feature is connected.</p></section>}
        <span className="wj-note-author">Preview identity · no public member profile</span>
      </article>
      <div className="wj-privacy-callout"><Info size={15} /><p>Text and profile visibility are separate choices. Photos are intentionally not part of this first share preview.</p></div>
      <div className="wj-share-preview-actions"><button type="button" className="wj-text-action" onClick={onEdit}>Back to edit</button><button type="button" className="wj-secondary" onClick={onBack}>Keep this as a draft</button><button type="button" className="wj-primary" onClick={() => previewMember ? onPublish() : onBack()}>{previewMember ? "Preview publish on this device" : "Keep exploring"} <ArrowRight size={14} /></button></div>
    </main>
  );
}

export function SavedLibraryNotice() {
  return <span className="wj-inline-status"><Check size={13} />This saved list exists only in your current design session.</span>;
}

export function SettingsPage({ profile, shareProfileConsent, importConsent, onConsentChange, onImportConsentChange, onNavigate, onSignOut }: {
  profile: Profile;
  shareProfileConsent: boolean;
  importConsent: boolean;
  onConsentChange: (value: boolean) => void;
  onImportConsentChange: (value: boolean) => void;
  onNavigate: (page: NeuPage) => void;
  onSignOut: () => void;
}) {
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  return (
    <main className="wj-content">
      <PageIntro eyebrow="Your account, your choices" title="Keep your profile" accent="on your terms.">A privacy-first account design, not a connected account. Each control is illustrative and changes only this local preview.</PageIntro>
      <div className="wj-settings-layout">
        <section className="wj-settings-main">
          <div className="wj-settings-section"><Eyebrow>ACCOUNT ACCESS</Eyebrow><h2>No account is connected.</h2><p>Use the sign-in journey preview to see where account, email confirmation and a second factor would belong.</p><button type="button" className="wj-secondary" onClick={() => onNavigate("account")}>See the account flow <ArrowRight size={14} /></button></div>
          <div className="wj-settings-section"><Eyebrow>PROFILE VISIBILITY</Eyebrow><h2>Start private. Share only by choice.</h2><p>A profile does not appear in a public product note until a person opts into that particular note.</p><label className="wj-context-consent"><input type="checkbox" checked={shareProfileConsent} onChange={(event) => onConsentChange(event.target.checked)} /><span><strong>Preview a separate profile-sharing permission</strong><small>This toggle is local, resets on refresh and does not grant real community visibility.</small></span></label><button className="wj-text-action" type="button" onClick={() => onNavigate("profile")}>Review skin profile <ArrowRight size={13} /></button></div>
          <div className="wj-settings-section"><Eyebrow>LOGIN SECURITY</Eyebrow><h2>Two steps, one clear purpose.</h2><p>Roadmap proposes an authenticator factor. Recovery codes, account eligibility and deployment still need review before real sign-in.</p><button className="wj-secondary" type="button" onClick={() => onNavigate("mfa-enroll")}>Explore two-factor concept <ArrowRight size={14} /></button></div>
          <div className="wj-settings-section"><Eyebrow>YOUR DATA</Eyebrow><h2>Import only with a clear yes.</h2><p>This preview does not collect data. In a real sign-up, browser profile data would remain local unless you explicitly chose to import it.</p><button className="wj-text-action" type="button" onClick={() => onNavigate("privacy")}>Read the privacy draft <ArrowRight size={13} /></button></div>
          <div className="wj-settings-section"><Eyebrow>OPTIONAL LOCAL IMPORT</Eyebrow><h2>Keep the choice with you.</h2><p>Separate, opt-in consent is required before any profile import. Nothing in this preview reads from your browser or imports data.</p><label className="wj-context-consent"><input type="checkbox" checked={importConsent} onChange={(event) => onImportConsentChange(event.target.checked)} /><span><strong>Allow a local-profile import in this design preview</strong><small>Illustrative permission state only. No data is read, uploaded or retained.</small></span></label></div>
          <button className="wj-danger-action" type="button" onClick={() => setConfirmSignOut(true)}><LogOut size={14} />End this local preview session</button>
        </section>
        <aside className="wj-profile-summary"><UserRound size={17} /><span className="wj-utility-label">PREVIEW PROFILE</span><h2>{profile.displayName || "Your own starting point"}</h2><p>{profile.depth ? `Depth ${profile.depth}` : "Depth open"} · {profile.undertone || "Undertone open"}</p><small>No profile is stored or shared outside this page.</small></aside>
      </div>
      {confirmSignOut && <div className="wj-modal-backdrop" role="presentation"><section className="wj-report-dialog" role="alertdialog" aria-modal="true" aria-labelledby="wj-signout-heading"><span className="wj-dialog-icon"><LogOut size={18} /></span><Eyebrow>LOCAL SESSION ONLY</Eyebrow><h2 id="wj-signout-heading">End this preview session?</h2><p>Your demo saves and share drafts will clear from the current page state. No real account will be signed out.</p><div className="wj-modal-actions"><button type="button" className="wj-text-action" onClick={() => setConfirmSignOut(false)}>Stay here</button><button type="button" className="wj-danger-confirm" onClick={onSignOut}>End local preview <LogOut size={13} /></button></div></section></div>}
    </main>
  );
}

export function OwnNotePage({ note, onNavigate, onEdit, onRequestDelete }: {
  note: MemberNote;
  onNavigate: (page: NeuPage) => void;
  onEdit: () => void;
  onRequestDelete: () => void;
}) {
  return (
    <main className="wj-content wj-narrow-content">
      <div className="wj-breadcrumb"><button type="button" onClick={() => onNavigate("share")}>Share a find</button><ArrowRight size={13} /><span>Your note</span></div>
      <div className="wj-sample-review-banner">YOUR PREVIEW NOTE / VISIBLE ONLY IN THIS DESIGN SESSION</div>
      <article className="wj-review-detail">
        <div className="wj-review-top"><span className="wj-profile-initials">You</span><div><strong>Local preview identity</strong><span>Created on this device · not published</span></div><span className="wj-neutral-pill">Your note</span></div>
        <div className="wj-review-product"><span className="wj-utility-label">{note.brand}</span><h1>{note.productName}</h1><p>{note.category} {note.shade && `· ${note.shade}`}</p></div>
        <div className="wj-review-story"><p>“{note.story}”</p>{note.routine && <p>{note.routine}</p>}</div>
        {note.repurchase !== "Still deciding" && <div className="wj-review-context"><small>REPURCHASE</small><p>{note.repurchase}</p></div>}
        {note.contextVisible && <div className="wj-review-context"><small>PROFILE CONTEXT DISPLAYED BY CHOICE</small><p>This design would display your selected profile context.</p><span>Real visibility remains disconnected.</span></div>}
        <div className="wj-own-note-status"><Check size={15} /><span>This note exists in temporary component state only. It is not part of a shared community.</span></div>
        <div className="wj-own-note-actions"><button type="button" className="wj-secondary" onClick={onEdit}>Edit this note <ArrowRight size={14} /></button><button type="button" className="wj-danger-action" onClick={onRequestDelete}><Trash2 size={14} /> Delete this preview note</button></div>
      </article>
    </main>
  );
}

export function DeleteNoteDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return <div className="wj-modal-backdrop" role="presentation"><section className="wj-report-dialog" role="alertdialog" aria-modal="true" aria-labelledby="wj-delete-heading"><span className="wj-dialog-icon"><Trash2 size={19} /></span><Eyebrow>PREVIEW-ONLY ACTION</Eyebrow><h2 id="wj-delete-heading">Delete this note?</h2><p>Remove this local preview note from the current session. This does not delete or affect a real post.</p><div className="wj-modal-actions"><button type="button" className="wj-text-action" onClick={onCancel}>Keep note</button><button type="button" className="wj-danger-confirm" onClick={onConfirm}>Delete local preview <Trash2 size={14} /></button></div></section></div>;
}
