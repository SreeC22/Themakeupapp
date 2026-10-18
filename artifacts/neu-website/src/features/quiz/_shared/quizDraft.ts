import type { Undertone } from "../data";

export const QUIZ_STEPS = [
  "welcome", "products", "matches", "depth", "undertone", "veins",
  "clues", "olive", "categories", "preferences", "review", "discovery",
] as const;

export type QuizStep = typeof QUIZ_STEPS[number];
export type CurrentProductType = "Foundation" | "Concealer" | "Skin tint" | "BB or CC cream";
export type ProductMatch =
  | "Blends in perfectly" | "A little too light" | "A little too dark"
  | "Too orange" | "Too pink" | "Too yellow" | "Gray or ashy"
  | "Changes color after application" | "Not sure yet";

export type QuizProduct = {
  id: string;
  type: CurrentProductType;
  brand: string;
  brandUnknown: boolean;
  product: string;
  formula: string;
  shade: string;
  shadeUnknown: boolean;
  match: ProductMatch[];
};

export type QuizDraft = {
  step: QuizStep;
  products: QuizProduct[];
  productMatchIndex: number;
  noCurrentMakeup: boolean;
  newToMakeup: boolean;
  currentMakeupSkipped: boolean;
  shadeId: string | null;
  depthUnsure: boolean;
  referenceProductId: string | null;
  undertone: Undertone | null;
  veinClue: string | null;
  clues: string[];
  olive: "yes" | "maybe" | "no" | "unsure" | null;
  categories: string[];
  budget: string;
  finish: string;
  skinType: string;
};

export const INITIAL_QUIZ_DRAFT: QuizDraft = {
  step: "welcome",
  products: [],
  productMatchIndex: 0,
  noCurrentMakeup: false,
  newToMakeup: false,
  currentMakeupSkipped: false,
  shadeId: null,
  depthUnsure: false,
  referenceProductId: null,
  undertone: null,
  veinClue: null,
  clues: [],
  olive: null,
  categories: [],
  budget: "",
  finish: "",
  skinType: "",
};

export const DEPTH_GROUPS = [
  "Very fair", "Fair", "Light", "Light-medium",
  "Medium", "Tan", "Deep", "Very deep",
] as const;

const endpoints = [
  [249, 232, 219], [240, 216, 198], [229, 195, 171], [214, 172, 143], [194, 145, 113],
  [169, 117, 88], [143, 92, 67], [117, 71, 53], [90, 53, 42], [61, 38, 32],
];

function hex([r, g, b]: number[]) {
  return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}

export const QUIZ_SWATCHES = Array.from({ length: 40 }, (_, index) => {
  const position = (index / 39) * (endpoints.length - 1);
  const start = Math.floor(position);
  const end = Math.min(endpoints.length - 1, start + 1);
  const amount = position - start;
  const color = endpoints[start].map((value, channel) => value + (endpoints[end][channel] - value) * amount);
  const group = Math.floor(index / 5);
  const withinGroup = (index % 5) + 1;
  return {
    id: `neu-depth-${String(index + 1).padStart(2, "0")}`,
    number: index + 1,
    group: DEPTH_GROUPS[group],
    withinGroup,
    label: `${DEPTH_GROUPS[group]}, starting shade ${withinGroup}`,
    color: hex(color),
    profileDepth: Math.max(1, Math.min(10, Math.round(1 + (index / 39) * 9))),
  };
});

export function createQuizDraftFromPreview(): QuizDraft {
  const params = new URLSearchParams(window.location.search);
  const fixtureStep = params.get("quizStep");
  const fixtureSteps: QuizStep[] = ["welcome", "products", "matches", "depth", "undertone", "veins", "clues", "olive", "categories", "preferences", "review", "discovery"];
  const withSample = params.get("sampleEntry") === "1" || fixtureStep === "matches";
  const seeded: QuizDraft = withSample ? {
    ...INITIAL_QUIZ_DRAFT,
    products: [{
      id: "sample-product-row",
      type: "Skin tint",
      brand: "Fenty Beauty",
      brandUnknown: false,
      product: "Eaze Drop Blurring Skin Tint",
      formula: "Illustrative formula / variant A · unverified",
      shade: "Shade example A · unverified",
      shadeUnknown: false,
      match: ["Blends in perfectly"],
    }],
  } : INITIAL_QUIZ_DRAFT;
  return fixtureSteps.includes(fixtureStep as QuizStep)
    ? { ...seeded, step: fixtureStep as QuizStep }
    : seeded;
}
