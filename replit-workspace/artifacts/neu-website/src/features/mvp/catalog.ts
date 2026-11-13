import records from "./research-products.json";

export const LAUNCH_CATEGORIES = ["Foundation", "Concealer", "Blush", "Lips"] as const;
export type LaunchCategory = typeof LAUNCH_CATEGORIES[number];

export type ResearchProduct = {
  id: string;
  brandName: string;
  name: string;
  category: LaunchCategory;
  subtype: string;
  productUrl: string;
  sourceUrl: string;
  checkedOn: string;
  evidenceNote: string;
  price: null;
  finish: null;
  coverage: null;
  shadeDetails: "unverified";
};

/** Historical product observations, never exact-shade or present-stock evidence. */
export const RESEARCH_PRODUCTS = records as ResearchProduct[];
export function getResearchProduct(id: string) {
  return RESEARCH_PRODUCTS.find((product) => product.id === id);
}
