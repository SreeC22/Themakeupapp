import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import type { NeuCandidate, NeuCatalog, NeuClaim, NeuShade } from "@workspace/api-client-react";
import { Disclosure } from "./Controls";
import { usePreview } from "./use-preview";

export const catalogSaveId = (shadeId: string) => `neu-catalog-shade:${shadeId}`;
export const savedCatalogShadeId = (saveId: string) => saveId.startsWith("neu-catalog-shade:") ? saveId.slice("neu-catalog-shade:".length) : null;
export const catalogShadePath = (shadeId: string) => `/catalog/shades/${encodeURIComponent(shadeId)}`;

export function CatalogSaveButton({ shade }: { shade: NeuShade }) {
  const { state, toggleSave } = usePreview();
  const id = catalogSaveId(shade.id);
  const saved = state.savedIds.includes(id);
  return <Button variant="secondary" aria-pressed={saved} disabled={!saved && state.savedIds.length >= 500} aria-label={`${saved ? "Remove saved shade" : "Save shade locally"}: ${shade.name}`} onClick={() => toggleSave(id)}>{saved ? "Saved locally · remove" : "Save shade locally"}</Button>;
}

export function CatalogShadeCard({ catalog, shade, candidate }: { catalog: NeuCatalog; shade: NeuShade; candidate?: NeuCandidate }) {
  const product = catalog.products.find((item) => item.id === shade.productId);
  if (!product) return null;
  const brand = catalog.brands.find((item) => item.id === product.brandId);
  return <article className="mvp-product" data-testid={`card-catalog-shade-${shade.id}`}>
    <span className="mono">{product.category} · {candidate?.label ?? "CATALOG OBSERVATION"}</span>
    <p className="mvp-brand">{brand?.name ?? "Brand not recorded"}</p>
    <h3><Link className="mvp-title-link" href={catalogShadePath(shade.id)}>{product.name} · {shade.name}</Link></h3>
    <p className="mvp-muted">{shade.description || "No shade descriptor recorded."}</p>
    {candidate && <>
      <strong className="text-sm text-primary">Why this is here</strong>
      <ul className="mvp-muted">{candidate.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
      <strong className="text-sm text-primary">What this cannot tell us</strong>
      <ul className="mvp-muted">{candidate.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
    </>}
    <p className="mvp-muted">Manufacturer descriptors are not laboratory validation. Price and stock are unknown.</p>
    <p className="mvp-muted">Range: {product.rangeStatus === "enumerated" ? "Enumerated, not live stock" : product.rangeStatus === "partial" ? "Partial" : "Needs review"} · Checked {candidate?.checkedOn ?? product.checkedOn}</p>
    <div className="mvp-actions"><CatalogSaveButton shade={shade} /><Link className="mvp-link" href={catalogShadePath(shade.id)}>Shade evidence & details</Link></div>
    <a className="mvp-link" href={candidate?.sourceUrl ?? product.sourceUrl} target="_blank" rel="noopener noreferrer">Open recorded source (external)</a>
  </article>;
}

export function ClaimList({ claims }: { claims: NeuClaim[] }) {
  return claims.length ? <dl className="mvp-facts">{claims.map((claim, index) => <div key={`${claim.field}-${index}`}><dt>{claim.field}</dt><dd>
    <strong>{claim.value}</strong><p className="mvp-muted">{claim.basis === "verified" ? "Source-verified claim" : claim.basis === "user_report" ? "User-reported, not verified" : "Estimate, not verified"} · {claim.checkedOn}</p>
    <p>{claim.rawText}</p><a className="mvp-link" href={claim.sourceUrl} target="_blank" rel="noopener noreferrer">Claim source (external)</a>
  </dd></div>)}</dl> : <p className="mvp-muted">No field-level claims recorded. Unknowns are not inferred from product names, codes or images.</p>;
}

export function CatalogCoverage({ catalog }: { catalog: NeuCatalog }) {
  const { coverage } = catalog;
  return <section className="mvp-panel" data-testid="section-catalog-coverage">
    <span className="mono">ACTUAL COVERAGE, NOT TARGET COMPLETION</span><h2>A growing evidence library.</h2>
    <dl className="mvp-facts">
      <div><dt>Selected directory brands</dt><dd>{coverage.selectedBrands} · inclusion alone does not verify a product</dd></div>
      <div><dt>Source-verified brands / lines / variants</dt><dd>{coverage.verifiedBrands} / {coverage.verifiedProducts} / {coverage.verifiedShades}</dd></div>
      <div><dt>Enumerated ranges</dt><dd>{coverage.enumeratedRanges} · not a current stock check</dd></div>
      <div><dt>Progressive targets, not current totals</dt><dd>{coverage.targetProducts} product lines · {coverage.targetShades} variants</dd></div>
      <div><dt>Coverage observed</dt><dd>{coverage.checkedOn}</dd></div>
    </dl>
    <Disclosure title="Category, tier and range coverage with gaps">
      <div className="mvp-two-col">
        <div><h3>Categories</h3>{(["Foundation", "Concealer", "Blush", "Lips"] as const).map((category) => {
          const products = catalog.products.filter((item) => item.category === category);
          const variants = catalog.shades.filter((item) => item.status === "verified" && products.some((product) => product.id === item.productId));
          return <p className="mvp-muted" key={category}>{category}: {products.length} reviewed lines, {variants.length} source-verified shade identities.</p>;
        })}</div>
        <div><h3>Price tiers</h3>{(["Drugstore", "Mid-range", "Luxury"] as const).map((tier) => {
          const brands = catalog.brands.filter((item) => item.tier === tier);
          const verified = brands.filter((brand) => catalog.products.some((product) => product.brandId === brand.id && product.verifiedShadeCount > 0));
          return <p className="mvp-muted" key={tier}>{tier}: {brands.length} selected brands; {verified.length} with source-verified variants.</p>;
        })}</div>
      </div>
      {catalog.products.map((product) => <article key={product.id} className="mvp-disclosure">
        <h3>{catalog.brands.find((item) => item.id === product.brandId)?.name} · {product.name}</h3>
        <p className="mvp-muted">{product.rangeStatus === "enumerated" ? "Enumerated range" : product.rangeStatus === "partial" ? "Partial range" : "Needs review"} · {product.verifiedShadeCount} source-verified variants · Source-declared total: {product.declaredShadeCount ?? "Unknown"} · {product.checkedOn}</p>
        <ul className="mvp-muted">{product.notes.map((note) => <li key={note}>{note}</li>)}</ul>
        <a className="mvp-link" href={product.sourceUrl} target="_blank" rel="noopener noreferrer">Range source (external)</a>
      </article>)}
      <h3>Known gaps</h3><ul className="mvp-muted">{coverage.gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>
      <p className="mvp-muted">Dates describe observations, not a promise of freshness or stock. Missing variants, descriptors and formulas limit recommendations. Historical research below is separate and has not been upgraded to shade evidence.</p>
    </Disclosure>
  </section>;
}
