import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Heading, EmptyState } from "@/features/mvp/Controls";
import { getResearchProduct } from "@/features/mvp/catalog";
import { ProductCard } from "@/features/mvp/ProductCard";
import { usePreview } from "@/features/mvp/use-preview";
import { CatalogShadeCard, savedCatalogShadeId } from "@/features/mvp/CatalogEvidence";
import { CatalogLoading } from "@/features/mvp/ReferenceEditor";
import { useNeuCatalog } from "@/features/mvp/use-neu";

export default function SavedProductsPage() {
  const { state, toggleSave } = usePreview();
  const catalog = useNeuCatalog();
  const saved = state.savedIds.map((id) => ({ id, product: getResearchProduct(id) }));
  return <main className="content mvp-page"><Heading eyebrow="YOUR LOCAL LIST" title="Keep what interests you.">These are your actual saved product IDs in this browser, not cloud saves or recommendations. They remain after reload when browser storage is available.</Heading>
    {saved.length ? <><p role="status">{saved.length} locally saved {saved.length === 1 ? "item" : "items"}</p><div className="mvp-grid">{saved.map(({ id, product }) => {
      if (product) return <ProductCard key={id} product={product} />;
      const shadeId = savedCatalogShadeId(id);
      const shade = catalog.data?.shades.find((item) => item.id === shadeId);
      if (shade && catalog.data?.products.some((item) => item.id === shade.productId)) return <CatalogShadeCard key={id} catalog={catalog.data} shade={shade} />;
      return <section key={id} className="mvp-panel"><h2>{shadeId && catalog.isLoading ? "Loading saved shade" : "Saved item unavailable"}</h2>
        {shadeId && catalog.isLoading ? <CatalogLoading /> : <><p className="mvp-break">{id}</p><p className="mvp-muted">{shadeId && catalog.isError ? "The reviewed catalog could not load. Your save is preserved; no fallback evidence was substituted." : "This identifier cannot be resolved against the current catalog or historical library. Its save has been preserved."}</p>
          {shadeId && catalog.isError && <Button variant="secondary" onClick={() => void catalog.refetch()}>Retry catalog</Button>}</>}
        <Button variant="text" onClick={() => toggleSave(id)}>Remove this save</Button></section>;
    })}</div></>
      : <EmptyState title="Nothing saved here yet" action={<Link className="mvp-link" href="/results">Explore the research library</Link>}><p>Use “Save locally” on a listing to start a private shortlist. No sign-in needed.</p></EmptyState>}
  </main>;
}
