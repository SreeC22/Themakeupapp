import { db, neuSelectedBrands, neuProductLines, neuShades, neuSources, neuMatchingEvidence } from "../index";
import type { Catalog, Claim, Product, Shade } from "./types.ts";

export async function loadNeuCatalog(): Promise<Catalog> {
  // A single transaction gives readers a coherent snapshot during curator imports.
  return db.transaction(async tx => {
    // These share one transaction/client; do not enqueue concurrent pg queries.
    const brands = await tx.select().from(neuSelectedBrands);
    const lines = await tx.select().from(neuProductLines);
    const variants = await tx.select().from(neuShades);
    const sources = await tx.select().from(neuSources);
    const evidence = await tx.select().from(neuMatchingEvidence);
    if (!brands.length || !lines.length) throw new Error("Neu curated catalog has not been imported.");
    const sourceMap = new Map(sources.map(s => [s.id, s]));
    const claims = (productId: string, shadeId: string | null, sourceId: string): Claim[] =>
      evidence.filter(e => e.productId === productId && e.shadeId === shadeId && e.sourceId === sourceId).map(e => {
        const source = sourceMap.get(e.sourceId)!;
        return { field: e.field, value: e.value, basis: e.basis as Claim["basis"], rawText: e.rawText, sourceUrl: source.url, checkedOn: source.observedOn };
      });
    const products: Product[] = lines.map(p => {
      const source = sourceMap.get(p.sourceId)!;
      return { id: p.id, brandId: p.brandId, name: p.name, category: p.category as Product["category"],
        sourceUrl: source.url, checkedOn: source.observedOn, rangeStatus: p.rangeStatus as Product["rangeStatus"],
        declaredShadeCount: p.declaredShadeCount, notes: p.notes, claims: claims(p.id, null, p.sourceId),
        verifiedShadeCount: variants.filter(v => v.productId === p.id && v.sourceId === p.sourceId && v.status === "verified").length };
    }).sort((a, b) => a.id.localeCompare(b.id));
    const shades: Shade[] = variants.filter(v => lines.some(p => p.id === v.productId && p.sourceId === v.sourceId))
      .map(v => ({ id: v.id, productId: v.productId, name: v.name, description: v.description,
        status: v.status as Shade["status"], claims: claims(v.productId, v.id, v.sourceId) })).sort((a, b) => a.id.localeCompare(b.id));
    return {
      brands: brands.map(b => ({ id: b.brandId, name: b.displayName, tier: b.tier as Catalog["brands"][number]["tier"], candidate: !lines.some(p => p.brandId === b.brandId) })).sort((a, b) => a.name.localeCompare(b.name)),
      products, shades,
      coverage: {
        selectedBrands: brands.length, verifiedBrands: new Set(lines.map(p => p.brandId)).size,
        verifiedProducts: lines.length, verifiedShades: shades.filter(s => s.status === "verified").length,
        enumeratedRanges: products.filter(p => p.rangeStatus === "enumerated" && p.verifiedShadeCount === p.declaredShadeCount).length,
        targetProducts: "100–150", targetShades: "2,000–4,000",
        checkedOn: products.map(p => p.checkedOn).sort()[0],
        gaps: [
          "Counts describe source-observed identities, not current stock or laboratory-verified shade matches.",
          `${brands.length - new Set(lines.map(p => p.brandId)).size} selected brands have no reviewed product lines yet. Full catalog targets are progressive, not a completed-catalog claim.`,
          "Fenty Fluid Flex: 466/466W identity conflict remains unresolved; this range is partial.",
          "e.l.f. Soft Glam: all 36 identities enumerated, but shade depth/undertone are not inferred from names.",
          "Rich, rich-deep and medium-deep descriptors have no calibrated equivalence to Neu's palette.",
          "No calibrated color measurements, foundation saturation data, cool-olive complexion descriptors or live availability. Prices remain unknown except for individually source-verified variant claims.",
          "Lip color families and outcomes on two-toned lips remain unverified; finish/coverage claims alone do not prove a result.",
          "Enumerated ranges mean the reviewed US selector reconciled on the observation date, not that every variant remains sold or in stock.",
        ],
      },
    };
  }, { isolationLevel: "repeatable read", accessMode: "read only" });
}
