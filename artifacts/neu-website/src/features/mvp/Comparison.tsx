import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Link } from "wouter";
import type { ResearchProduct } from "./catalog";
import { EvidenceFacts } from "./ProductCard";

export function Comparison({ products, onRemove, onClear }: { products: ResearchProduct[]; onRemove: (id: string) => void; onClear: () => void }) {
  return <section className="mvp-panel" aria-labelledby="comparison-heading">
    <div className="mvp-row"><h2 id="comparison-heading">Compare research, not match scores</h2><Button variant="text" onClick={onClear}>Clear comparison</Button></div>
    <p className="mvp-muted" role="status">{products.length < 2 ? "Select one more listing to compare. Choose two or three products." : `${products.length} listings side by side. Unknown evidence cannot establish which will suit you better.`}</p>
    {products.length >= 2 && <div className="mvp-grid">{products.map((product) => <article className="mvp-comparison" key={product.id}>
      <p className="mvp-brand">{product.brandName}</p><h3><Link className="mvp-title-link" href={`/products/${product.id}`}>{product.name}</Link></h3>
      <EvidenceFacts product={product} />
      <a href={product.sourceUrl} className="mvp-link" target="_blank" rel="noopener noreferrer">Source (external)</a>
      <Button variant="text" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.name} from comparison`}>Remove</Button>
    </article>)}</div>}
    {products.length === 3 && <p className="mvp-muted">Three-product limit reached. Remove a listing here to add another.</p>}
  </section>;
}
