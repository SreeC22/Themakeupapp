export const DEPTHS = [
  { depth: 1, hex: "#F6EDE4", label: "Very light" },
  { depth: 2, hex: "#F3E7DB", label: "Light" },
  { depth: 3, hex: "#F7EAD0", label: "Light medium" },
  { depth: 4, hex: "#EADABA", label: "Medium light" },
  { depth: 5, hex: "#D7BD96", label: "Medium" },
  { depth: 6, hex: "#A07E56", label: "Medium deep" },
  { depth: 7, hex: "#825C43", label: "Deep" },
  { depth: 8, hex: "#604134", label: "Deep rich" },
  { depth: 9, hex: "#3A312A", label: "Very deep" },
  { depth: 10, hex: "#292420", label: "Deepest" },
] as const;

export const UNDERTONES = [
  { name: "Warm", description: "Golden, peach or yellow", hex: "#DFAD72" },
  { name: "Cool", description: "Pink, red or blue", hex: "#C88D9B" },
  { name: "Neutral", description: "A balance of warm and cool", hex: "#C9BBA1" },
] as const;

export const SKIN_TYPES = ["Normal", "Dry", "Oily", "Combination", "Sensitive"] as const;
export const CONCERNS = ["Dry patches", "Redness", "Texture", "Breakouts", "Sensitivity"] as const;
export const CATEGORIES = {
  Complexion: ["Foundation", "Concealer", "Color corrector", "Skin tint", "Setting powder", "Primer"],
  Cheeks: ["Blush", "Bronzer", "Contour", "Highlighter"],
  "Eyes & brows": ["Eyeshadow", "Eyeliner", "Mascara", "Brow pencil", "Brow gel"],
  Lips: ["Lipstick", "Lip liner", "Lip gloss", "Lip balm"],
  "Prep & finish": ["Moisturizer", "Sunscreen", "Setting spray"],
} as const;
export type ProductCategory = (typeof CATEGORIES)[keyof typeof CATEGORIES][number];
export type Undertone = "Warm" | "Cool" | "Neutral" | "Not sure";
export type SkinType = (typeof SKIN_TYPES)[number];
export type Profile = {
  handle: string;
  depth: number;
  undertone: Undertone;
  oliveCast: boolean;
  skinType: SkinType;
  concerns: string[];
};
export const DEFAULT_PROFILE: Profile = {
  handle: "",
  depth: 5,
  undertone: "Not sure",
  oliveCast: false,
  skinType: "Combination",
  concerns: [],
};

export type ProductExample = {
  id: string;
  author: string;
  initials: string;
  tone: Exclude<Undertone, "Not sure">;
  oliveCast: boolean;
  depth: number;
  skinType: SkinType;
  category: ProductCategory;
  brand: string;
  product: string;
  shade: string;
  note: string;
  routine: string;
};

export const PRODUCT_EXAMPLES: ProductExample[] = [
  {
    id: "fenty-skin-tint", author: "Mina R.", initials: "MR", tone: "Neutral", oliveCast: true,
    depth: 5, skinType: "Combination", category: "Skin tint", brand: "Fenty Beauty",
    product: "Eaze Drop Blurring Skin Tint", shade: "Shade 12 · example match",
    note: "An easy, skin-like base for days when I want my freckles to stay part of the look.",
    routine: "Pressed in with a damp sponge; set only around my nose.",
  },
  {
    id: "nars-concealer", author: "Liv C.", initials: "LC", tone: "Neutral", oliveCast: true,
    depth: 5, skinType: "Combination", category: "Concealer", brand: "NARS",
    product: "Radiant Creamy Concealer", shade: "Ginger · example match",
    note: "A little warmth brightens my under-eyes without turning the rest of my face pink.",
    routine: "One small dot, left to sit for a few seconds before blending.",
  },
  {
    id: "rare-blush", author: "Ari S.", initials: "AS", tone: "Warm", oliveCast: false,
    depth: 3, skinType: "Dry", category: "Blush", brand: "Rare Beauty",
    product: "Soft Pinch Liquid Blush", shade: "Hope · example pick",
    note: "One tiny dot gives my cheeks a watercolor flush. I tap the extra onto my lips.",
    routine: "Warm it between fingers, then press onto the high points of my cheeks.",
  },
  {
    id: "laura-powder", author: "Jules W.", initials: "JW", tone: "Warm", oliveCast: false,
    depth: 6, skinType: "Oily", category: "Setting powder", brand: "Laura Mercier",
    product: "Translucent Loose Setting Powder", shade: "Honey · example pick",
    note: "Keeps my T-zone comfortable through a full day without flattening the glow.",
    routine: "A small puff, pressed rather than swept over my base.",
  },
  {
    id: "mac-foundation", author: "Nia D.", initials: "ND", tone: "Neutral", oliveCast: true,
    depth: 6, skinType: "Combination", category: "Foundation", brand: "M·A·C",
    product: "Studio Fix Fluid", shade: "NC42 · example match",
    note: "I mix one pump with moisturizer for a more lived-in finish.",
    routine: "Applied in thin layers with a soft brush.",
  },
  {
    id: "nyx-lip", author: "Tess P.", initials: "TP", tone: "Cool", oliveCast: false,
    depth: 4, skinType: "Normal", category: "Lip gloss", brand: "NYX",
    product: "Fat Oil Lip Drip", shade: "That's Chic · example pick",
    note: "A sheer berry layer that makes my everyday face feel a little more like me.",
    routine: "Blotted once, then topped with a second swipe.",
  },
  {
    id: "glossier-primer", author: "Rae M.", initials: "RM", tone: "Neutral", oliveCast: true,
    depth: 5, skinType: "Combination", category: "Primer", brand: "Glossier",
    product: "Futuredew", shade: "Universal · example pick",
    note: "The soft sheen makes a sheer base look more like my actual skin.",
    routine: "A thin layer over moisturizer, mostly on the cheeks.",
  },
  {
    id: "tower-mascara", author: "Sam K.", initials: "SK", tone: "Neutral", oliveCast: false,
    depth: 4, skinType: "Sensitive", category: "Mascara", brand: "Tower 28",
    product: "MakeWaves Mascara", shade: "Jet · example pick",
    note: "Defined lashes without making the rest of my makeup feel too precious.",
    routine: "One coat at the roots, a second just on the outer lashes.",
  },
  {
    id: "summer-spf", author: "Eden B.", initials: "EB", tone: "Neutral", oliveCast: true,
    depth: 5, skinType: "Combination", category: "Sunscreen", brand: "Supergoop!",
    product: "Unseen Sunscreen SPF 40", shade: "Clear · example pick",
    note: "Sits well under my base and does not leave a cast on my skin.",
    routine: "Two-finger amount, then give it a minute before makeup.",
  },
];

export const COLOR_WHEEL = [
  { name: "Red", hex: "#B64F55" }, { name: "Red-orange", hex: "#CC6849" },
  { name: "Orange", hex: "#DE874D" }, { name: "Golden yellow", hex: "#D9AD57" },
  { name: "Yellow", hex: "#D4C45D" }, { name: "Yellow-green", hex: "#8FA66B" },
  { name: "Green", hex: "#568C70" }, { name: "Blue-green", hex: "#548E91" },
  { name: "Blue", hex: "#5F81A8" }, { name: "Blue-violet", hex: "#7776A5" },
  { name: "Violet", hex: "#9A7199" }, { name: "Red-violet", hex: "#B66F8A" },
] as const;
