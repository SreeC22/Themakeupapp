// Illustrative quiz content, not verified shade matches.
export type NeuPage = "home" | "quiz" | "profile" | "learn" | "discover";
export type Undertone = "Warm" | "Cool" | "Neutral" | "Olive" | "Still exploring";

export type Profile = {
  depth: number | null;
  /** Exact quiz palette identity, separate from the shared 1..10 profile depth contract. */
  quizShadeId?: string | null;
  undertone: Undertone | null;
  olive: boolean | null;
  skinType: string | null;
  concerns: string[];
  displayName: string;
  categories: string[];
  shadeEvidence?: ShadeEvidence | null;
};

export type ProductExample = {
  id: string;
  brand: string;
  name: string;
  category: string;
  price: "Drugstore" | "Mid-range" | "Prestige";
  finish: string;
  shade: string;
  depth: number;
  undertone: "Warm" | "Cool" | "Neutral";
  olive: boolean;
  notes: string;
  routine: string;
  author: string;
};

export type ShadeEvidence = {
  brand: string;
  product: string;
  formula: string;
  shade: string;
  source: "illustrative" | "manual";
};

export const SAMPLE_PRODUCTS: ProductExample[] = [
  {
    id: "skin-tint-note",
    brand: "Fenty Beauty",
    name: "Eaze Drop Blurring Skin Tint",
    category: "Skin tint",
    price: "Prestige",
    finish: "Soft-focus",
    shade: "Illustrative shade entry · not verified",
    depth: 5,
    undertone: "Neutral",
    olive: true,
    notes: "A design example for a personal note: a sheer, skin-like finish that still lets freckles feel like part of the look.",
    routine: "The sample routine uses a small amount and builds slowly through the centre of the face.",
    author: "Illustrative profile, not a real member",
  },
  {
    id: "concealer-note",
    brand: "NARS",
    name: "Radiant Creamy Concealer",
    category: "Concealer",
    price: "Prestige",
    finish: "Natural radiant",
    shade: "Illustrative shade entry · not verified",
    depth: 5,
    undertone: "Warm",
    olive: false,
    notes: "A sample description: a little warmth can brighten one area without turning every part of the look pink.",
    routine: "The design example shows one small dot tapped where it is wanted.",
    author: "Illustrative profile, not a real member",
  },
  {
    id: "blush-note",
    brand: "Rare Beauty",
    name: "Soft Pinch Liquid Blush",
    category: "Blush",
    price: "Prestige",
    finish: "Soft flush",
    shade: "Illustrative shade entry · not verified",
    depth: 3,
    undertone: "Cool",
    olive: false,
    notes: "A design example of a sheer rosy cheek, layered slowly until it feels right.",
    routine: "Warm between the fingers, then press onto the high points of the cheeks.",
    author: "Illustrative profile, not a real member",
  },
  {
    id: "foundation-note",
    brand: "M·A·C",
    name: "Studio Fix Fluid",
    category: "Foundation",
    price: "Prestige",
    finish: "Natural matte",
    shade: "Illustrative shade entry · not verified",
    depth: 7,
    undertone: "Neutral",
    olive: true,
    notes: "A sample routine can demonstrate how a thin layer leaves room for personal texture and a second pass.",
    routine: "Apply in thin layers and check how the formula looks after it dries down.",
    author: "Illustrative profile, not a real member",
  },
  {
    id: "lip-note",
    brand: "NYX Professional Makeup",
    name: "Fat Oil Lip Drip",
    category: "Lip gloss",
    price: "Drugstore",
    finish: "Glossy",
    shade: "Illustrative shade entry · not verified",
    depth: 4,
    undertone: "Cool",
    olive: false,
    notes: "A sample makeup note: a sheer berry can feel understated or become the whole point.",
    routine: "Swipe once, blot gently, and layer if you want more color.",
    author: "Illustrative profile, not a real member",
  },
  {
    id: "powder-note",
    brand: "Maybelline New York",
    name: "Fit Me Loose Finishing Powder",
    category: "Powder",
    price: "Drugstore",
    finish: "Soft matte",
    shade: "Illustrative shade entry · not verified",
    depth: 6,
    undertone: "Warm",
    olive: false,
    notes: "The product card uses a sample story to show where a member could describe feel and wear.",
    routine: "Use a small amount only where a softer finish is wanted.",
    author: "Illustrative profile, not a real member",
  },
  {
    id: "mascara-note",
    brand: "Tower 28",
    name: "MakeWaves Mascara",
    category: "Mascara",
    price: "Mid-range",
    finish: "Defined",
    shade: "Illustrative shade entry · not verified",
    depth: 4,
    undertone: "Neutral",
    olive: false,
    notes: "This example card demonstrates personal wording, not an actual review or product claim.",
    routine: "A single coat first, then a second only where extra definition is wanted.",
    author: "Illustrative profile, not a real member",
  },
  {
    id: "primer-note",
    brand: "Glossier",
    name: "Futuredew",
    category: "Primer",
    price: "Mid-range",
    finish: "Dewy",
    shade: "Illustrative product entry · not verified",
    depth: 5,
    undertone: "Neutral",
    olive: true,
    notes: "A product detail can explain how a sample finish might pair with sheer base makeup.",
    routine: "A design example layers a small amount over moisturizer.",
    author: "Illustrative profile, not a real member",
  },
  {
    id: "spf-note",
    brand: "Supergoop!",
    name: "Unseen Sunscreen SPF 40",
    category: "Sunscreen",
    price: "Prestige",
    finish: "Clear",
    shade: "Illustrative product entry · not verified",
    depth: 6,
    undertone: "Neutral",
    olive: true,
    notes: "This card shows the kind of first-person product note a member might write. It is not a sunscreen review.",
    routine: "A sunscreen example places SPF underneath makeup, with time to settle.",
    author: "Illustrative profile, not a real member",
  },
];
export const DEFAULT_PROFILE: Profile = {
  depth: null,
  undertone: null,
  olive: null,
  skinType: null,
  concerns: [],
  displayName: "",
  categories: [],
};
