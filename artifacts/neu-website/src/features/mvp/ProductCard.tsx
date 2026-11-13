import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import type { ResearchProduct } from "./catalog";
import { usePreview } from "./use-preview";

export function EvidenceFacts({ product }: { product: ResearchProduct }) {
  return <dl className="mvp-facts">
    <div><dt>Recorded category</dt><dd>{product.category}</dd></div>
    <div><dt>Source observation</dt><dd><time dateTime={product.checkedOn}>{product.checkedOn}</time> · historical</dd></div>
    <div><dt>Exact shades & suitability</dt><dd>Unverified</dd></div>
    <div><dt>Price / finish / coverage</dt><dd>Unknown / unknown / unknown</dd></div>
    <div><dt>Availability & formula</dt><dd>Not verified</dd></div>
    <div><dt>Genuine community reviews</dt><dd>0</dd></div>
  </dl>;
}
export function ProductCard({ product, compare, onCompare, comparisonFull = false }: {
  product: ResearchProduct; compare?: boolean; onCompare?: () => void; comparisonFull?: boolean;
}) {
  const { state, toggleSave } = usePreview();
  const saved = state.savedIds.includes(product.id);
  return <article className="mvp-product" data-testid={`card-product-${product.id}`}>
    <span className="mono">{product.category} · HISTORICAL LISTING</span>
    <p className="mvp-brand">{product.brandName}</p>
    <h3><Link href={`/products/${product.id}`} className="mvp-title-link">{product.name}</Link></h3>
    <p className="mvp-muted">{product.category === "Blush" || product.category === "Lips" ? "Color-family exploration only. No verified color, pigmentation or opacity evidence." : "No exact shade recommendation. Depth, undertone and formula compatibility are unverified."}</p>
    <EvidenceFacts product={product} />
    <div className="mvp-actions">
      <Button variant="secondary" aria-pressed={saved} aria-label={`${saved ? "Remove saved" : "Save locally"}: ${product.name}`} onClick={() => toggleSave(product.id)}>{saved ? "Saved locally · remove" : "Save locally"}</Button>
      {onCompare && <Button variant="text" aria-pressed={compare} disabled={!compare && comparisonFull} onClick={onCompare}>{compare ? "Remove comparison" : "Compare"}</Button>}
    </div>
    <a className="mvp-link" href={product.productUrl} target="_blank" rel="noopener noreferrer">Recorded retailer page (external)</a>
    <a className="mvp-link" href={product.sourceUrl} target="_blank" rel="noopener noreferrer">Research source (external)</a>
  </article>;
}
