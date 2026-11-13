export type Category = "Foundation" | "Concealer" | "Blush" | "Lips";
export type CatalogCategory = Category | "Eyes" | "Multi-use" | "Setting";
export type Claim = {
  field: string; value: string; basis: "verified" | "estimate" | "user_report";
  sourceUrl: string; checkedOn: string; rawText: string;
};
export type Brand = { id: string; name: string; tier: "Drugstore" | "Mid-range" | "Luxury"; candidate: boolean };
export type Product = {
  id: string; brandId: string; name: string; category: CatalogCategory; sourceUrl: string; checkedOn: string;
  rangeStatus: "enumerated" | "partial" | "needs_review"; declaredShadeCount: number | null;
  verifiedShadeCount: number; notes: string[]; claims: Claim[];
  applicationAreas?: string[]; routineRoles?: string[]; lipSubcategories?: string[];
  versatility?: string[]; benefits?: string[]; combinationRoles?: string[];
};
export type Shade = {
  id: string; productId: string; name: string; description: string; status: "verified" | "needs_review"; claims: Claim[];
};
export type Coverage = {
  selectedBrands: number; verifiedBrands: number; verifiedProducts: number; verifiedShades: number;
  enumeratedRanges: number; targetProducts: string; targetShades: string; checkedOn: string; gaps: string[];
};
export type Catalog = { brands: Brand[]; products: Product[]; shades: Shade[]; coverage: Coverage };
export type Preference = { coverage?: string; finish?: string; formula?: string; intent?: string; pigmentation?: string; opacity?: string; colorFamilies?: string[] };
export type ProfileInput = {
  depth?: string | null; undertone?: string | null; oliveSubtype?: string; saturation?: string; skinType?: string; budget?: string;
  references?: { shadeId: string; fit: string[]; oxidation?: string }[];
  preferences?: Partial<Record<Category, Preference>>;
};
export type Candidate = {
  shadeId: string; productId: string; category: Category;
  label: "Descriptor-aligned candidate" | "Limited-evidence suggestion" | "Color exploration";
  reasons: string[]; limitations: string[]; sourceUrl: string; checkedOn: string;
};
export type Recommendations = { version: string; candidates: Candidate[]; notes: string[]; excludedCount: number };
