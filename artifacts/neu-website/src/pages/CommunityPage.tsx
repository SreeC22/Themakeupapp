import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Heading, EmptyState, Options, Disclosure } from "@/features/mvp/Controls";
import { LAUNCH_CATEGORIES, getResearchProduct } from "@/features/mvp/catalog";
import { QUIZ_SWATCHES } from "@/features/quiz/_shared/quizDraft";
import { usePreview } from "@/features/mvp/use-preview";

export default function CommunityPage() {
  const { state, deleteReview } = usePreview();
  const [category, setCategory] = useState("All four");
  const [tone, setTone] = useState("Any undertone");
  const [depth, setDepth] = useState("Any depth");
  const [skinType, setSkinType] = useState("Any skin type");
  const [lips, setLips] = useState("Any lip experience");
  const [evidence, setEvidence] = useState("All disclosures");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const shade = QUIZ_SWATCHES.find((swatch) => swatch.id === state.quiz.shadeId);
  const clearFilters = () => { setCategory("All four"); setTone("Any undertone"); setDepth("Any depth"); setSkinType("Any skin type"); setLips("Any lip experience"); setEvidence("All disclosures"); };
  const drafts = state.reviews.filter((review) => category === "All four" || getResearchProduct(review.productId)?.category === category);
  return <main className="content mvp-page">
    <Heading eyebrow="GENUINE EXPERIENCES, NOT INVENTED ACTIVITY" title="Room for your real story.">A place for voluntary makeup experiences across complexion depths, including olive or muted coloring and two-toned or pigmented lips. No member evidence is connected in this preview.</Heading>
    <section className="mvp-panel"><div className="mvp-row"><h2>Explore community evidence</h2><Button variant="text" onClick={clearFilters}>Reset community filters</Button></div>
      <Options label="Category" options={["All four", ...LAUNCH_CATEGORIES]} value={category} onChange={setCategory} />
      <Disclosure title="Profile similarity and disclosure filters">
        <Options label="Skin depth" options={["Any depth", "Similar to my selected depth", "Depth left open"]} value={depth} onChange={setDepth} hint={shade ? `Your local depth: ${shade.label}. Similarity is not calculated without genuine member evidence.` : "Your depth is open. No assumed medium depth is used."} />
        <Options label="Undertone" options={["Any undertone", "Warm", "Cool", "Neutral", "Olive", "Unsure"]} value={tone} onChange={setTone} />
        <Options label="Skin type" options={["Any skin type", "Dry", "Oily", "Combination", "Normal", "Unsure"]} value={skinType} onChange={setSkinType} />
        <Options label="Lip experience" options={["Any lip experience", "Two-toned lips", "Pigmented lips"]} value={lips} onChange={setLips} />
        <Options label="Disclosure" options={["All disclosures", "Self-reported no incentive"]} value={evidence} onChange={setEvidence} hint="Self-reported is not independently verified." />
      </Disclosure>
      <p className="mvp-muted" role="status">Filters: {[category, depth, tone, skinType, lips, evidence].join(" · ")}. 0 genuine public experiences.</p>
    </section>
    <EmptyState title="No genuine member experiences here yet" action={<Link href="/review/new" className="mvp-link">Write a local experience draft</Link>}><p>These filters have no member evidence to return. We have not created sample users, copied reviews or manufactured ratings. Local drafts below are not counted as community reviews.</p></EmptyState>
    <section className="mvp-panel"><h2>Your private local drafts</h2><p className="mvp-muted">Category filters above narrow this local list. Profile-similarity and disclosure filters apply only to the empty public evidence view, not your drafts.</p>
      {drafts.length ? <ul className="mvp-draft-list">{drafts.map((review) => {
        const product = getResearchProduct(review.productId);
        return <li key={review.id}>
          <span className="mono">LOCAL DRAFT · NOT SUBMITTED</span><h3>{product ? `${product.brandName} · ${product.name}` : "Recorded product unavailable"}</h3>
          <p>Self-reported shade: {review.shade || "Unknown"} · Repurchase: {review.repurchase || "Unsure"}</p>
          <p className="mvp-muted">Simulated state: {review.simulation}. Not an actual moderation decision. {review.shareProfile ? "Selected profile details attached locally." : "Profile not attached."}</p>
          <div className="mvp-actions"><Link href={`/review/new?draft=${encodeURIComponent(review.id)}`} className="mvp-link">Edit local draft</Link><Button variant="text" onClick={() => setPendingDelete(review.id)}>Delete draft</Button></div>
          {pendingDelete === review.id && <div role="group" aria-label="Confirm draft deletion"><p>Delete this preview’s draft? It cannot be restored here.</p><div className="mvp-actions"><Button variant="secondary" onClick={() => { deleteReview(review.id); setPendingDelete(null); }}>Confirm delete</Button><Button variant="text" onClick={() => setPendingDelete(null)}>Cancel</Button></div></div>}
        </li>;
      })}</ul> : <p>{state.reviews.length ? "No local drafts in this category. Choose All four to see your other drafts." : "No local drafts saved. Start one in your own words, without an account or photos."}</p>}
    </section>
    <aside className="mvp-notice"><h2>Before a future public community</h2><p>Real posting needs member ownership, privacy controls, moderation and abuse reporting. There are no public reporting or approval actions here because no real reviews are connected. Brand relationships would need visible disclosures; no rewards or paid ranking are part of this preview.</p></aside>
  </main>;
}
