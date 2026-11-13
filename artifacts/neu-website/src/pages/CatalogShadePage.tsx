import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { PageMeta } from "@/components/SiteShell";
import { CatalogSaveButton, ClaimList } from "@/features/mvp/CatalogEvidence";
import { EmptyState, Heading } from "@/features/mvp/Controls";
import { CatalogLoading } from "@/features/mvp/ReferenceEditor";
import { useNeuCatalog } from "@/features/mvp/use-neu";

export default function CatalogShadePage({ shadeId }: { shadeId: string }) {
  const { data: catalog, isLoading, isError, refetch } = useNeuCatalog();
  const shade = catalog?.shades.find((item) => item.id === shadeId);
  const product = catalog?.products.find((item) => item.id === shade?.productId);
  const brand = catalog?.brands.find((item) => item.id === product?.brandId);
  return <main className="content mvp-page">
    <PageMeta title={product && shade ? `${product.name}: ${shade.name}` : "Catalog shade evidence"} description="Source-backed shade observations with dates, claim basis and honest limitations. Not an exact match or live stock check." />
    <Link href="/results" className="mvp-link">Back to discovery & research</Link>
    {isLoading ? <section className="mvp-panel"><CatalogLoading /></section>
      : isError ? <EmptyState title="Shade evidence could not load" action={<Button variant="secondary" onClick={() => void refetch()}>Retry catalog</Button>}><p>No product facts or sources have been substituted. A saved reference remains preserved in your local data.</p></EmptyState>
        : !shade || !product ? <EmptyState title="This shade is not in the current reviewed catalog" action={<Link href="/saved" className="mvp-link">Your saved items</Link>}><p>Its identifier may have changed or be outside the reviewed subset. We will not invent shade details. Existing local saves are preserved.</p></EmptyState>
          : <>
            <Heading eyebrow={`${product.category} · CATALOG OBSERVATION`} title={`${product.name} · ${shade.name}`}>{brand?.name ?? "Brand not recorded"} · {shade.description || "No shade descriptor recorded."}</Heading>
            <aside className="mvp-notice"><h2>A descriptor, not a guarantee.</h2><p>Source verification means this information was recorded from the linked source. Manufacturer shade descriptions are not laboratory validation, calibrated color measurements or proof of a cross-brand equivalent. Your own wear experience may differ.</p><p>Price, stock and personal skin compatibility are unknown. No product images have been copied.</p></aside>
            <div className="mvp-two-col">
              <section className="mvp-panel"><h2>Shade evidence</h2><p className="mvp-muted">Identity status: {shade.status === "verified" ? "Source-verified" : "Needs review"}</p><ClaimList claims={shade.claims} /></section>
              <section className="mvp-panel"><h2>Product evidence</h2><ClaimList claims={product.claims} /></section>
            </div>
            <section className="mvp-panel"><h2>Range and observation</h2>
              <p className="mvp-muted">{product.rangeStatus === "enumerated" ? "Enumerated range, not live stock" : product.rangeStatus === "partial" ? "Partial range" : "Range needs review"} · {product.verifiedShadeCount} source-verified variants · Source-declared total: {product.declaredShadeCount ?? "Unknown"} · Checked {product.checkedOn}</p>
              <ul className="mvp-muted">{product.notes.map((note) => <li key={note}>{note}</li>)}</ul>
              <a className="mvp-link" href={product.sourceUrl} target="_blank" rel="noopener noreferrer">Product source (external)</a>
              <div className="mvp-actions"><CatalogSaveButton shade={shade} /><Link href="/profile" className="mvp-link">Manage your reference shades</Link></div>
            </section>
            <p className="mvp-muted">This catalog record is separate from the historical retailer research library. Public reviews are outside the MVP; no ratings, reviews or member activity are invented.</p>
          </>}
  </main>;
}
