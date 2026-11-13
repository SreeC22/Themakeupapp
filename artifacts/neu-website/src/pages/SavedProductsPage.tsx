import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Heading, EmptyState } from "@/features/mvp/Controls";
import { getResearchProduct } from "@/features/mvp/catalog";
import { ProductCard } from "@/features/mvp/ProductCard";
import { usePreview } from "@/features/mvp/use-preview";

export default function SavedProductsPage() {
  const { state, toggleSave } = usePreview();
  const saved = state.savedIds.map((id) => ({ id, product: getResearchProduct(id) }));
  return <main className="content mvp-page"><Heading eyebrow="YOUR LOCAL LIST" title="Keep what interests you.">These are your actual saved product IDs in this browser, not cloud saves or recommendations. They remain after reload when browser storage is available.</Heading>
    {saved.length ? <><p role="status">{saved.length} locally saved {saved.length === 1 ? "listing" : "listings"}</p><div className="mvp-grid">{saved.map(({ id, product }) => product ? <ProductCard key={id} product={product} /> : <section key={id} className="mvp-panel"><h2>Saved listing unavailable</h2><p className="mvp-break">{id}</p><p className="mvp-muted">This identifier is no longer in the local research library. Its save has been preserved.</p><Button variant="secondary" onClick={() => toggleSave(id)}>Remove unavailable save</Button></section>)}</div></>
      : <EmptyState title="Nothing saved here yet" action={<Link className="mvp-link" href="/results">Explore the research library</Link>}><p>Use “Save locally” on a listing to start a private shortlist. No sign-in needed.</p></EmptyState>}
  </main>;
}
