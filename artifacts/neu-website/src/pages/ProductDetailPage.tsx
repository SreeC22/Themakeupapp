import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { PageMeta } from "@/components/SiteShell";
import { getResearchProduct } from "@/features/mvp/catalog";
import { EvidenceFacts } from "@/features/mvp/ProductCard";
import { EmptyState, Heading } from "@/features/mvp/Controls";
import { usePreview } from "@/features/mvp/use-preview";

export default function ProductDetailPage({ slug }: { slug: string }) {
  const product = getResearchProduct(slug);
  const { state, toggleSave } = usePreview();
  if (!product) return <main className="content mvp-page"><PageMeta title="Research listing not found" description="This product identifier is not in Neu's historical research library." /><EmptyState title="This listing is not in our research library" action={<Link className="mvp-link" href="/results">Browse research listings</Link>}><p>No shade or retailer link has been invented for this address.</p></EmptyState></main>;
  const saved = state.savedIds.includes(product.id);
  return <main className="content mvp-page">
    <PageMeta title={`${product.brandName}: ${product.name}`} description={`Historical ${product.category.toLowerCase()} listing observed ${product.checkedOn}. Shade, formula, stock and suitability unverified.`} />
    <Link className="mvp-link" href="/results">Back to your results & research</Link>
    <Heading eyebrow={`${product.category} · HISTORICAL LISTING`} title={product.name}>{product.brandName} · Recorded subtype: {product.subtype}. The title is reproduced as recorded; words in it are not independently verified formula claims.</Heading>
    <div className="mvp-two-col">
      <section className="mvp-panel"><h2>What is recorded</h2><p>Brand, product title, category, source URL and a retailer product link were recorded on <time dateTime={product.checkedOn}>{product.checkedOn}</time>.</p><p>{product.evidenceNote}</p>
        <a className="mvp-link" href={product.sourceUrl} target="_blank" rel="noopener noreferrer">Open recorded source page (external)</a>
        <a className="mvp-link" href={product.productUrl} target="_blank" rel="noopener noreferrer">Open recorded retailer product page (external)</a>
        <p className="mvp-muted">Historical links may have changed or stopped working. This is not a current stock check, offer or checkout. Neu has not reverified these pages for this preview.</p>
      </section>
      <section className="mvp-panel"><h2>What remains unknown</h2><EvidenceFacts product={product} /><p className="mvp-muted">No verified shade variants, product swatches or licensed product images are available. No exact-shade selector is shown. Your own product notes cannot verify these facts.</p>
        <Button variant="secondary" aria-pressed={saved} onClick={() => toggleSave(product.id)}>{saved ? "Saved locally · remove" : "Save locally"}</Button>
      </section>
    </div>
    <EmptyState title="No genuine community reviews for this product" action={<Link className="mvp-link" href={`/review/new?product=${encodeURIComponent(product.id)}`}>Write a private local draft</Link>}><p>Zero published experiences are connected. No ratings, wearer stories or purchase verification have been invented. A local draft is not submitted or public.</p></EmptyState>
  </main>;
}
