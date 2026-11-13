import { useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { Heading, EmptyState, Options } from "@/features/mvp/Controls";
import { RESEARCH_PRODUCTS, getResearchProduct } from "@/features/mvp/catalog";
import { observationFields } from "@/features/mvp/review-fields";
import { createInitialPreviewState, type LocalReview, type ModerationState } from "@/features/mvp/storage";
import { usePreview } from "@/features/mvp/use-preview";

const labelFor = (product: typeof RESEARCH_PRODUCTS[number]) => `${product.brandName} · ${product.name}`;
const PRODUCT_LABELS = RESEARCH_PRODUCTS.map(labelFor);
export default function ReviewDraftPage() {
  const params = new URLSearchParams(useSearch());
  const [, navigate] = useLocation();
  const { state, saveReview, deleteReview } = usePreview();
  const requestedDraftId = params.get("draft");
  const existing = state.reviews.find((review) => review.id === requestedDraftId);
  const initialProduct = getResearchProduct(existing?.productId ?? params.get("product") ?? "");
  const draftId = useRef(existing?.id ?? `local-review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [productText, setProductText] = useState(initialProduct ? labelFor(initialProduct) : "");
  const product = RESEARCH_PRODUCTS.find((item) => labelFor(item) === productText);
  const [shade, setShade] = useState(existing?.shade ?? "");
  const [repurchase, setRepurchase] = useState(existing?.repurchase ?? "");
  const [observations, setObservations] = useState<Record<string, string>>(existing?.observations ?? {});
  const [text, setText] = useState(existing?.text ?? "");
  const [disclosure, setDisclosure] = useState(existing?.disclosure ?? "");
  const [shareProfile, setShareProfile] = useState(existing?.shareProfile ?? false);
  const [simulation] = useState<ModerationState>(existing?.simulation ?? "Draft");
  const [message, setMessage] = useState(existing ? "Your private local draft was opened. Nothing is submitted or public." : "");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const saved = state.reviews.some((review) => review.id === draftId.current);
  const atDraftLimit = !saved && state.reviews.length >= 100;
  const dirty = () => { setMessage(""); setError(""); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (atDraftLimit) { setError("This local preview keeps up to 100 drafts. Delete an old draft before saving another."); return; }
    if (!product) { setError("Choose a recorded product from the suggestions. We cannot create a catalog record from typed text."); return; }
    if (!repurchase) { setError("Choose Yes, No or Unsure for repurchase. Unsure is a complete answer."); return; }
    const profileSnapshot = shareProfile ? {
      ...createInitialPreviewState().quiz,
      shadeId: state.quiz.shadeId, depthUnsure: state.quiz.depthUnsure,
      undertone: state.quiz.undertone, olive: state.quiz.olive, oliveSubtype: state.quiz.oliveSubtype,
      saturation: state.quiz.saturation, skinType: state.quiz.skinType,
      lipPigmentation: state.quiz.lipPigmentation, lipOpacity: state.quiz.lipOpacity,
    } : null;
    const review: LocalReview = { id: draftId.current, productId: product.id, shade, repurchase, observations, text, disclosure, shareProfile, profileSnapshot, simulation, updatedAt: new Date().toISOString() };
    saveReview(review);
    setError("");
    setMessage("Local draft updated in this session. Nothing was submitted, approved or made public. Browser persistence status is shown above.");
    if (requestedDraftId !== review.id) navigate(`/review/new?draft=${encodeURIComponent(review.id)}`, { replace: true });
  };
  if (requestedDraftId && !existing && !saved) return <main className="content mvp-page"><EmptyState title="This local draft is not available" action={<Link href="/community" className="mvp-link">Return to private drafts</Link>}><p>It may have been deleted or belong to a different browser. There is no cloud copy.</p></EmptyState></main>;
  return <main className="content mvp-page">
    <Heading eyebrow="LOCAL DRAFT ONLY" title="Keep an honest experience.">This is a private drafting space, not a review submission. There is no member sign-in, public posting or live moderation in this preview.</Heading>
    <form className="mvp-panel mvp-stack" onSubmit={submit} noValidate>
      <h2>What did you try?</h2>
      <Typeahead label="Recorded product (choose a suggestion)" value={productText} placeholder="Type a brand or product name" suggestions={PRODUCT_LABELS} suggestionTag="Historical listing" onChange={(value) => {
        dirty(); setProductText(value); setShade(""); setObservations({});
      }} />
      {!product && <p className="mvp-muted">Select one of the sixteen recorded products to link a draft. Free text does not add a product or verify a shade.</p>}
      {product && <p className="mvp-muted">Selected: {product.brandName} · {product.name} · {product.category}. Historical source date: {product.checkedOn}.</p>}
      <Typeahead label="Shade name or code you used (self-reported, optional)" value={shade} placeholder="Type if known; blank means unknown" suggestions={[]} onChange={(value) => { dirty(); setShade(value.slice(0, 500)); }} />
      <Options label="Would you repurchase?" options={["Yes", "No", "Unsure"]} value={repurchase} onChange={(value) => { dirty(); setRepurchase(value); }} />
      {product && <section className="mvp-stack"><h2>{product.category} observations</h2><p className="mvp-muted">Optional, self-reported experiences. These do not become official product facts.</p>
        {observationFields(product.category).map((field) => <Options key={field.key} label={field.label} options={field.options} value={observations[field.key] ?? ""} onChange={(value) => { dirty(); setObservations((current) => ({ ...current, [field.key]: current[field.key] === value ? "" : value })); }} />)}
      </section>}
      <Typeahead label="Your experience, wear context or other notes (optional)" value={text} placeholder="In your own words, up to 4,000 characters" suggestions={[]} onChange={(value) => { dirty(); setText(value.slice(0, 4000)); }} />
      <Options label="Product relationship disclosure (optional, self-reported)" options={["Purchased myself, no incentive", "Gift from someone I know", "Received free from a brand", "Paid or other brand relationship", "Prefer not to say"]} value={disclosure} onChange={(value) => { dirty(); setDisclosure(disclosure === value ? "" : value); }} hint="This is not a verified purchase or an independent check. Relationships would need visible disclosure in a future public review." />
      <Options label="Attach selected profile details to this local draft?" options={["No, keep profile separate", "Yes, attach the listed details locally"]} value={shareProfile ? "Yes, attach the listed details locally" : "No, keep profile separate"} onChange={(value) => { dirty(); setShareProfile(value === "Yes, attach the listed details locally"); }} hint="Only depth swatch, undertone, olive, saturation, skin type, lip pigmentation and opacity goal. No prior product notes or other preferences. Nothing is public." />
      {existing && <p className="mvp-muted">Earlier demonstration label retained: {simulation}. This is not an actual moderation decision. No public review or moderation actions are available.</p>}
      {error && <p className="mvp-error" role="alert">{error}</p>}
      {message && <p className="mvp-notice" role="status">{message}</p>}
      <p className="mvp-muted">Drafts save only when you choose the action below. Unsaved changes are not retained if you leave this page.</p>
      {atDraftLimit && <p className="mvp-muted">This local preview keeps up to 100 drafts. Delete an old private draft before adding another.</p>}
      <div className="mvp-actions"><Button type="submit" disabled={atDraftLimit}>{saved ? "Update local draft" : "Save local draft only"}</Button></div>
      <p className="mvp-muted">Public community is outside the MVP. That phase requires both 500+ registered users and explicit approval. No registered-user count is claimed here.</p>
      {saved && <div className="mvp-disclosure">
        {!confirmDelete ? <Button variant="text" onClick={() => setConfirmDelete(true)}>Delete this local draft</Button> : <div role="group" aria-label="Confirm local draft deletion"><p>This deletes only this preview’s local draft. This cannot be undone here.</p><div className="mvp-actions"><Button variant="secondary" onClick={() => { deleteReview(draftId.current); setConfirmDelete(false); setMessage("Local draft removed from this session. No public review existed."); }}>Confirm delete draft</Button><Button variant="text" onClick={() => setConfirmDelete(false)}>Cancel deletion</Button></div></div>}
      </div>}
    </form>
    <Link className="mvp-link" href="/community">Back to private local drafts</Link>
  </main>;
}
