import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Heading, EmptyState, Options } from "@/features/mvp/Controls";
import { LAUNCH_CATEGORIES, getResearchProduct } from "@/features/mvp/catalog";
import { usePreview } from "@/features/mvp/use-preview";

/** Compatibility route for Stage 1 private drafts, never a public community. */
export default function CommunityPage() {
  const { state, deleteReview } = usePreview();
  const [category, setCategory] = useState("All four");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const drafts = state.reviews.filter((review) => category === "All four" || getResearchProduct(review.productId)?.category === category);
  return <main className="content mvp-page">
    <Heading eyebrow="PRIVATE LOCAL DRAFTS" title="Your notes, just for you.">This earlier address now keeps your private experience drafts. Public community is not in the MVP.</Heading>
    <aside className="mvp-notice"><h2>Public community unavailable</h2><p>A public phase requires both 500+ registered users and explicit approval. No registered-user count is claimed here. Drafts are not public reviews, and earlier simulation labels do not grant moderation powers.</p></aside>
    <section className="mvp-panel">
      <div className="mvp-row"><h2>Your private drafts</h2><Link href="/review/new" className="mvp-link">Write a private draft</Link></div>
      <Options label="Filter private drafts" options={["All four", ...LAUNCH_CATEGORIES]} value={category} onChange={setCategory} />
      {drafts.length ? <ul className="mvp-draft-list">{drafts.map((review) => {
        const product = getResearchProduct(review.productId);
        return <li key={review.id}>
          <span className="mono">PRIVATE · NOT SUBMITTED</span><h3>{product ? `${product.brandName} · ${product.name}` : "Recorded product unavailable"}</h3>
          <p>Self-reported shade: {review.shade || "Unknown"} · Repurchase: {review.repurchase || "Unsure"}</p>
          <p className="mvp-muted">{review.shareProfile ? "Selected profile details attached to this local draft only." : "Profile not attached."} Earlier demonstration label: {review.simulation}, not an actual moderation decision.</p>
          <div className="mvp-actions"><Link href={`/review/new?draft=${encodeURIComponent(review.id)}`} className="mvp-link">Edit private draft</Link><Button variant="text" onClick={() => setPendingDelete(review.id)}>Delete draft</Button></div>
          {pendingDelete === review.id && <div role="group" aria-label="Confirm private draft deletion"><p>Delete this private draft? It cannot be restored here.</p><div className="mvp-actions"><Button variant="secondary" onClick={() => { deleteReview(review.id); setPendingDelete(null); }}>Confirm delete</Button><Button variant="text" onClick={() => setPendingDelete(null)}>Keep draft</Button></div></div>}
        </li>;
      })}</ul> : <EmptyState title={state.reviews.length ? "No drafts in this category" : "No private drafts yet"} action={state.reviews.length ? <Button variant="secondary" onClick={() => setCategory("All four")}>Show all drafts</Button> : <Link href="/review/new" className="mvp-link">Write a private draft</Link>}><p>Keep a personal experience in your own words. Nothing is uploaded or shared.</p></EmptyState>}
    </section>
    <Link href="/profile" className="mvp-link">Back to your profile</Link>
  </main>;
}
