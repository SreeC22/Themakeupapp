import type { ResearchProduct, LaunchCategory } from "./catalog";

export type BrowseFilters = {
  category: LaunchCategory | "";
  search: string;
  brand: string;
  budget: string;
  finish: string;
  coverage: string;
  includeUnknown: boolean;
  sort: "alphabetical" | "source-newest" | "source-oldest";
  retailer?: string;
  skinType?: string;
  evidence?: "historical-listing" | "verified-shade";
};
export function validBudget(value: string): boolean {
  return value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;
}
/** Browsing only. Missing evidence is never a personalized match. */
export function filterResearchProducts(products: readonly ResearchProduct[], filters: BrowseFilters): ResearchProduct[] {
  const query = filters.search.trim().toLowerCase();
  const brand = filters.brand.trim().toLowerCase();
  const wantsMetadata = validBudget(filters.budget)
    || Boolean(filters.finish && filters.finish !== "No preference")
    || Boolean(filters.coverage && filters.coverage !== "No preference")
    || Boolean(filters.skinType && !["No preference", "Not sure"].includes(filters.skinType));
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (query && !`${product.brandName} ${product.name} ${product.category}`.toLowerCase().includes(query)) return false;
    if (brand && !product.brandName.toLowerCase().includes(brand)) return false;
    if (filters.retailer && new URL(product.sourceUrl).hostname !== filters.retailer) return false;
    if (filters.evidence === "verified-shade") return false; // Historical listings do not verify exact shades.
    if (wantsMetadata && !filters.includeUnknown) return false; // All Stage 1 metadata is explicitly unknown.
    return true;
  }).sort((a, b) => {
    const alphabetical = `${a.brandName} ${a.name}`.localeCompare(`${b.brandName} ${b.name}`);
    if (filters.sort === "alphabetical") return alphabetical;
    const dates = a.checkedOn.localeCompare(b.checkedOn);
    return (filters.sort === "source-newest" ? -dates : dates) || alphabetical;
  });
}
