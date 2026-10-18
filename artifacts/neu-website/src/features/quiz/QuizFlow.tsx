import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleHelp, Info, Plus, Sparkles, X } from "lucide-react";
import { DEFAULT_PROFILE, SAMPLE_PRODUCTS, type NeuPage, type Profile } from "./data";
import { Eyebrow } from "./Shared";
import { Choice } from "@workspace/neu-design-system/components/neu/choice";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { Navigation } from "@workspace/neu-design-system/components/neu/navigation";
import { DEPTH_GROUPS, QUIZ_SWATCHES, type CurrentProductType, type ProductMatch, type QuizDraft, type QuizProduct, type QuizStep } from "./_shared/quizDraft";

const PRODUCT_TYPES: CurrentProductType[] = ["Foundation", "Concealer", "Skin tint", "BB or CC cream"];
const BRANDS = ["Maybelline", "L'Oréal", "NYX", "e.l.f.", "Milani", "Revlon", "CoverGirl", "Fenty Beauty", "NARS", "M·A·C", "Rare Beauty", "Huda Beauty", "Estée Lauder", "Clinique"];
const MATCHES: ProductMatch[] = ["Blends in perfectly", "A little too light", "A little too dark", "Too orange", "Too pink", "Too yellow", "Gray or ashy", "Changes color after application", "Not sure yet"];
const UNDERTONES = [
  { value: "Warm", description: "Golden, yellow or peach characteristics", color: "#d8aa78" },
  { value: "Cool", description: "Pink, rosy or sometimes bluish characteristics", color: "#a67f99" },
  { value: "Neutral", description: "A balance of warm and cool characteristics", color: "#bda093" },
  { value: "Still exploring", description: "No need to decide yet", color: "#9a9188" },
] as const;
const CLUES = [
  "My skin looks more golden or peachy",
  "My skin looks more rosy or pink",
  "My skin looks fairly balanced",
  "My skin sometimes looks muted or gray-green",
  "I'm not sure",
];
const VEINS = ["Mostly blue or purple", "Mostly green or teal", "Both blue and green", "I can't see them clearly", "I'm not sure"];
const CATEGORY_OPTIONS = ["Foundation", "Concealer", "Skin tint", "Blush", "Bronzer", "Contour", "Highlighter", "Lipstick", "Lip liner", "Lip gloss", "Eyeshadow", "Setting powder", "Setting spray", "Primer", "SPF", "Everything"];
const STEP_LABELS: Record<QuizStep, string> = {
  welcome: "Welcome", products: "Makeup you use", matches: "Shade experience", depth: "Skin depth",
  undertone: "Undertone", veins: "Vein clue", clues: "Other clues", olive: "Olive", categories: "Explore", preferences: "Preferences", review: "Your profile", discovery: "Discovery",
};
function hasDefiniteUndertone(draft: QuizDraft) {
  return !!draft.undertone && draft.undertone !== "Still exploring";
}
function activeQuizPath(draft: QuizDraft) {
  const steps: QuizStep[] = ["products"];
  if (draft.products.length > 0) steps.push("matches");
  steps.push("depth", "undertone");
  if (!hasDefiniteUndertone(draft) || draft.step === "veins" || draft.step === "clues") steps.push("veins", "clues");
  steps.push("olive", "categories", "preferences", "review", "discovery");
  return steps;
}
function nextStep(draft: QuizDraft, current: QuizStep): QuizStep {
  if (current === "products") return draft.products.length ? "matches" : "depth";
  if (current === "matches") return "depth";
  if (current === "undertone") return hasDefiniteUndertone(draft) ? "olive" : "veins";
  if (current === "veins") return "clues";
  if (current === "clues") return "olive";
  const path = activeQuizPath(draft);
  return path[Math.min(path.indexOf(current) + 1, path.length - 1)] ?? "review";
}
function previousStep(draft: QuizDraft, current: QuizStep): QuizStep {
  if (current === "products") return "welcome";
  if (current === "matches") return "products";
  if (current === "depth") return draft.products.length ? "matches" : "products";
  if (current === "undertone") return "depth";
  if (current === "veins") return "undertone";
  if (current === "clues") return "veins";
  if (current === "olive") return hasDefiniteUndertone(draft) ? "undertone" : "clues";
  const path = activeQuizPath(draft);
  return path[Math.max(0, path.indexOf(current) - 1)] ?? "welcome";
}
function swatchFor(draft: QuizDraft) { return QUIZ_SWATCHES.find((item) => item.id === draft.shadeId) ?? null; }



function QuizProgress({ draft, step }: { draft: QuizDraft; step: QuizStep }) {
  const path = activeQuizPath(draft);
  const activeIndex = Math.max(0, path.indexOf(step));
  const matchProgress = step === "matches" ? (draft.productMatchIndex + 1) / Math.max(1, draft.products.length) : 1;
  const progress = step === "discovery" ? 100 : ((activeIndex + matchProgress) / path.length) * 100;
  const label = step === "matches"
    ? `STEP ${activeIndex + 1} OF ${path.length}`
    : `STEP ${activeIndex + 1} OF ${path.length}`;
  return <div className="wj-quiz-progress">
    <div className="wj-progress-track"><i style={{ width: `${progress}%` }} /></div>
    <div className="wj-progress-label"><span>{STEP_LABELS[step].toUpperCase()}</span><span>{label}</span></div>
  </div>;
}

function ProductRow({ product, index, onChange, onRemove }: {
  product: QuizProduct; index: number; onChange: (patch: Partial<QuizProduct>) => void; onRemove: () => void;
}) {
  const sampleProductNames = SAMPLE_PRODUCTS.filter((item) => item.brand.toLowerCase() === product.brand.trim().toLowerCase()).map((item) => item.name);
  const brandSuggestions = BRANDS.filter((brand) => brand.toLowerCase().includes(product.brand.toLowerCase()));
  return <article className="wj-quiz-product-row">
    <header><label className="wj-visually-hidden" htmlFor={`wj-product-type-${product.id}`}>Product type for product {index + 1}</label><select id={`wj-product-type-${product.id}`} value={product.type} onChange={(event) => onChange({ type: event.target.value as CurrentProductType, brand: "", brandUnknown: false, product: "", formula: "", shade: "", shadeUnknown: false, match: [] })}>{PRODUCT_TYPES.map((type) => <option key={type}>{type}</option>)}</select><button type="button" onClick={onRemove} aria-label={`Remove product ${index + 1}`}><X size={15} /> Remove</button></header>
    {!product.brandUnknown ? <><Typeahead label="Brand" value={product.brand} placeholder="Type any brand" suggestions={brandSuggestions} suggestionTag="Brand" onChange={(brand) => onChange({ brand, brandUnknown: false, product: "", formula: "", shade: "", shadeUnknown: false, match: [] })} /><button type="button" className="wj-quiz-inline-skip" onClick={() => onChange({ brandUnknown: true, brand: "", product: "", formula: "", shade: "", shadeUnknown: false, match: [] })}>I’m not sure of the brand</button></> : <button type="button" className="wj-quiz-inline-skip" onClick={() => onChange({ brandUnknown: false })}>Add brand name</button>}
    {(product.brand.trim() || product.brandUnknown) && <><Typeahead label="Product or line" value={product.product} placeholder="Type product name" suggestions={sampleProductNames} suggestionTag="Illustrative" onChange={(value) => onChange({ product: value, formula: "", shade: "", shadeUnknown: false, match: [] })} />
      {product.product.trim() && <div className="wj-quiz-product-subgrid">
        <Typeahead label="Formula or variant" value={product.formula} placeholder="Type if known" suggestions={[]} onChange={(value) => onChange({ formula: value, shade: "", shadeUnknown: false, match: [] })} />
        <div className="wj-quiz-shade-entry">{!product.shadeUnknown && <Typeahead label="Exact shade" value={product.shade} placeholder="Type if known" suggestions={[]} onChange={(value) => onChange({ shade: value, match: [] })} />}<button type="button" className={`wj-shade-unknown${product.shadeUnknown ? " is-selected" : ""}`} aria-pressed={product.shadeUnknown} onClick={() => onChange({ shadeUnknown: !product.shadeUnknown, shade: "", match: [] })}>I do not know my shade</button></div>
      </div>}</>}
  </article>;
}

export function QuizFlow({
  draft, onDraftChange, onComplete, onLearn,
}: {
  draft: QuizDraft;
  onDraftChange: (draft: QuizDraft) => void;
  onComplete: (profile: Profile) => void;
  onLearn: () => void;
}) {
  const [error, setError] = useState("");
  const [openHelp, setOpenHelp] = useState("");
  const [showAddOptions, setShowAddOptions] = useState(false);
  const change = (patch: Partial<QuizDraft>) => { onDraftChange({ ...draft, ...patch }); setError(""); };
  const setStep = (step: QuizStep) => {
    change({ step });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };
  useEffect(() => {
    document.getElementById("wj-quiz-title")?.focus({ preventScroll: true });
  }, [draft.step, draft.productMatchIndex]);
  const addProduct = (type: CurrentProductType) => {
    const id = `quiz-product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    change({ products: [...draft.products, { id, type, brand: "", brandUnknown: false, product: "", formula: "", shade: "", shadeUnknown: false, match: [] }], productMatchIndex: 0, noCurrentMakeup: false, newToMakeup: false, currentMakeupSkipped: false });
    setShowAddOptions(false);
  };
  const patchProduct = (id: string, patch: Partial<QuizProduct>) => change({ products: draft.products.map((product) => product.id === id ? { ...product, ...patch } : product) });
  const removeProduct = (id: string) => {
    const products = draft.products.filter((product) => product.id !== id);
    const removedIndex = draft.products.findIndex((product) => product.id === id);
    const productMatchIndex = removedIndex < draft.productMatchIndex ? Math.max(0, draft.productMatchIndex - 1) : Math.min(draft.productMatchIndex, Math.max(products.length - 1, 0));
    change({ products, productMatchIndex, referenceProductId: draft.referenceProductId === id ? null : draft.referenceProductId, step: products.length ? draft.step : draft.step === "matches" ? "products" : draft.step });
  };
  const toggleMatch = (product: QuizProduct, value: ProductMatch) => {
    const standalone = value === "Blends in perfectly" || value === "Not sure yet";
    let match = product.match.includes(value) ? product.match.filter((item) => item !== value) : standalone
      ? [value]
      : [...product.match.filter((item) => item !== "Blends in perfectly" && item !== "Not sure yet"), value];
    if (!standalone && (value === "A little too light" || value === "A little too dark")) {
      match = match.filter((item) => item !== (value === "A little too light" ? "A little too dark" : "A little too light"));
    }
    patchProduct(product.id, { match });
  };
  const toggleChoice = (current: string[], value: string, exclusive = false) => exclusive
    ? (current.includes(value) ? [] : [value])
    : current.includes(value) ? current.filter((item) => item !== value) : [...current.filter((item) => item !== "I'm not sure"), value];
  const advance = () => {
    if (draft.step === "matches") {
      if (draft.productMatchIndex < draft.products.length - 1) {
        change({ productMatchIndex: draft.productMatchIndex + 1 });
      } else {
        setStep("depth");
      }
      return;
    }
    if (draft.step === "products" && draft.products.length === 0 && !draft.noCurrentMakeup && !draft.newToMakeup && !draft.currentMakeupSkipped) return setError("Add a product, choose no current complexion makeup, or choose new to makeup.");
    if (draft.step === "depth" && !draft.shadeId && !draft.depthUnsure) return setError("Choose a starting shade or leave this open for now.");
    if (draft.step === "categories" && draft.categories.length === 0) return setError("Choose a category or select Everything.");
    setError("");
    setStep(nextStep(draft, draft.step));
  };
  const buildProfile = (): Profile => {
    const selected = swatchFor(draft);
    return {
      ...DEFAULT_PROFILE,
      depth: selected?.profileDepth ?? null,
      quizShadeId: selected?.id ?? null,
      undertone: draft.undertone,
      olive: draft.olive === "yes" ? true : draft.olive === "no" ? false : null,
      skinType: draft.skinType || null,
      categories: draft.categories,
      shadeEvidence: draft.products.length ? {
        brand: draft.products[0].brand || "Not entered",
        product: draft.products[0].product || "Not entered",
        formula: draft.products[0].formula || "Not entered",
        shade: draft.products[0].shade || "Not entered",
        source: "manual",
      } : null,
    };
  };
  const complete = () => {
    if (!draft.categories.length) { setError("Choose a category before viewing your discovery preview."); setStep("categories"); return; }
    onComplete(buildProfile());
  };
  const goBack = () => {
    if (draft.step === "matches" && draft.productMatchIndex > 0) {
      change({ productMatchIndex: draft.productMatchIndex - 1 });
      return;
    }
    setStep(previousStep(draft, draft.step));
  };
  const selectedSwatch = swatchFor(draft);
  const selectedMatchProduct = draft.products[Math.min(draft.productMatchIndex, Math.max(draft.products.length - 1, 0))];
  const displayStep = draft.step === "matches" && !selectedMatchProduct ? "depth" : draft.step;

  return <main className="wj-quiz-frame wj-quiz-complete" aria-labelledby="wj-quiz-title">
    {displayStep !== "welcome" && <QuizProgress draft={draft} step={displayStep} />}

    {displayStep === "welcome" && <section className="wj-quiz-start">
      <div className="wj-quiz-start-main">
        <h1 id="wj-quiz-title" tabIndex={-1}>Let’s get to know <em>your skin.</em></h1>
        <p>A few small questions about your skin, makeup and what you’d like to explore.</p>
        <button type="button" className="wj-primary" onClick={() => setStep("products")}>Find my match <ArrowRight size={15} /></button>
        <HelpDisclosure title="About this preview" open={openHelp === "welcome"} onClick={() => setOpenHelp(openHelp === "welcome" ? "" : "welcome")}>
          <span>No camera or account needed. Answers stay in this session and may clear on refresh. Screen colors are approximate; product examples are illustrative and unverified.</span>
          <button type="button" className="wj-inline-learn" onClick={onLearn}>Open the color guide <ArrowRight size={14} /></button>
        </HelpDisclosure>
      </div>
    </section>}

    {displayStep === "products" && <section className="wj-quiz-question">
      <Question kicker="CURRENT MAKEUP" title={<>What complexion makeup do you <em>currently use?</em></>} copy={draft.products.length ? "Add a product you know, or continue with the notes you have." : "Choose one to add its details, or tell us where you’re starting."} />
      {draft.products.length === 0 && <div className="wj-quiz-current-options">
        {PRODUCT_TYPES.map((type) => <button type="button" key={type} onClick={() => addProduct(type)}>{type}</button>)}
        <button type="button" aria-pressed={draft.noCurrentMakeup} className={draft.noCurrentMakeup ? "is-selected" : ""} onClick={() => change({ noCurrentMakeup: !draft.noCurrentMakeup, newToMakeup: false, currentMakeupSkipped: false, products: [], referenceProductId: null, productMatchIndex: 0 })}>No current makeup</button>
        <button type="button" aria-pressed={draft.newToMakeup} className={draft.newToMakeup ? "is-selected" : ""} onClick={() => change({ newToMakeup: !draft.newToMakeup, noCurrentMakeup: false, currentMakeupSkipped: false, products: [], referenceProductId: null, productMatchIndex: 0 })}>I’m new to makeup</button>
      </div>}
      {draft.products.map((product, index) => <ProductRow key={product.id} product={product} index={index} onChange={(patch) => patchProduct(product.id, patch)} onRemove={() => removeProduct(product.id)} />)}
      {draft.products.length > 0 && <div className="wj-quiz-product-actions"><button type="button" className="wj-secondary" onClick={() => setShowAddOptions(!showAddOptions)}><Plus size={15} /> Add another product</button><button type="button" className="wj-quiz-inline-skip" onClick={() => change({ noCurrentMakeup: true, newToMakeup: false, currentMakeupSkipped: false, products: [], referenceProductId: null, productMatchIndex: 0 })}>I don’t use complexion makeup instead</button><button type="button" className="wj-quiz-inline-skip" onClick={() => change({ newToMakeup: true, noCurrentMakeup: false, currentMakeupSkipped: false, products: [], referenceProductId: null, productMatchIndex: 0 })}>I’m new to makeup instead</button></div>}
      {showAddOptions && draft.products.length > 0 && <div className="wj-quiz-current-options wj-quiz-current-options--add" aria-label="Choose another product type">{PRODUCT_TYPES.map((type) => <button type="button" key={type} onClick={() => addProduct(type)}>{type}</button>)}</div>}
      {draft.noCurrentMakeup && draft.products.length === 0 && <p className="wj-quiz-answer-note">No current complexion makeup</p>}
      {draft.newToMakeup && draft.products.length === 0 && <p className="wj-quiz-answer-note">New to makeup</p>}
      {error && <p role="alert" className="wj-form-error">{error}</p>}
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" secondary={<button type="button" className="wj-text-action" onClick={() => change({ currentMakeupSkipped: !draft.products.length && !draft.noCurrentMakeup && !draft.newToMakeup, productMatchIndex: 0, step: draft.products.length ? "matches" : "depth" })}>Skip this question <ArrowRight size={14} /></button>} />
    </section>}

    {displayStep === "matches" && <section className="wj-quiz-question">
      <Question kicker="MAKEUP EXPERIENCE" title={<>How does your shade <em>look on you?</em></>} copy="Choose what feels most typical. You can select more than one observation." />
      {selectedMatchProduct && <article className="wj-quiz-match-product">
        <div><span>PRODUCT {draft.productMatchIndex + 1} OF {draft.products.length}</span><strong>{selectedMatchProduct.brand || selectedMatchProduct.type}{selectedMatchProduct.product ? ` · ${selectedMatchProduct.product}` : ""}</strong></div>
        <div className="wj-quiz-match-options">{MATCHES.map((value) => <button type="button" key={value} aria-pressed={selectedMatchProduct.match.includes(value)} className={selectedMatchProduct.match.includes(value) ? "is-selected" : ""} onClick={() => toggleMatch(selectedMatchProduct, value)}>{value}{selectedMatchProduct.match.includes(value) && <Check size={13} />}</button>)}</div>
      </article>}
      <div className="wj-quiz-match-actions"><button type="button" className="wj-quiz-inline-skip" onClick={() => setStep("products")}>Edit products</button><span>Perfect / unsure are exclusive; light / dark conflict.</span></div>
      <Navigation onBack={goBack} onContinue={advance} continueLabel={draft.productMatchIndex < draft.products.length - 1 ? "Next product" : "Continue"} secondary={<button type="button" className="wj-text-action" onClick={advance}>Skip this product <ArrowRight size={14} /></button>} />
    </section>}

    {displayStep === "depth" && <section className="wj-quiz-question">
      <Question kicker="SKIN DEPTH" title={<>Which shade looks closest to <em>your skin?</em></>} copy="Choose a starting point from any depth." />
      {draft.products.length > 0 && <label className="wj-quiz-reference"><span>Optional product reference</span><select value={draft.referenceProductId ?? ""} onChange={(event) => change({ referenceProductId: event.target.value || null })}><option value="">None</option>{draft.products.map((product, index) => <option key={product.id} value={product.id}>{product.brand || product.type}{product.shade ? ` · ${product.shade}` : ` · product ${index + 1}`}</option>)}</select></label>}
      <div className="wj-quiz-depth-groups">{DEPTH_GROUPS.map((group, groupIndex) => <div key={group} className="wj-quiz-depth-row" role="group" aria-label={`${group} skin shades`}><span className="wj-depth-group-label">{group}</span><div className="wj-quiz-swatch-grid">{QUIZ_SWATCHES.slice(groupIndex * 5, groupIndex * 5 + 5).map((shade) =>
        <button type="button" key={shade.id} aria-label={`${shade.label}, swatch ${shade.number} of 40`} aria-pressed={draft.shadeId === shade.id} title={shade.label} className={draft.shadeId === shade.id ? "is-selected" : ""} style={{ "--swatch": shade.color } as CSSProperties} onClick={() => change({ shadeId: shade.id, depthUnsure: false })}><i />{draft.shadeId === shade.id && <Check size={13} aria-hidden="true" />}</button>
      )}</div></div>)}</div>
      <div className="wj-depth-selected-preview" aria-live="polite">{selectedSwatch ? <><span className="wj-depth-preview-swatch" style={{ background: selectedSwatch.color }} /><strong>{selectedSwatch.label}</strong><small>{selectedSwatch.number} of 40</small></> : <><span className="wj-depth-preview-empty" /><strong>{draft.depthUnsure ? "Still exploring" : "No shade selected"}</strong></>}</div>
      <button type="button" className={`wj-unsure-button${draft.depthUnsure ? " is-selected" : ""}`} aria-pressed={draft.depthUnsure} onClick={() => change({ depthUnsure: !draft.depthUnsure, shadeId: null })}><CircleHelp size={16} /> I’m not sure yet</button>
      {error && <p role="alert" className="wj-form-error">{error}</p>}
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" />
    </section>}

    {displayStep === "undertone" && <section className="wj-quiz-question">
      <Question kicker="UNDERTONE" title={<>What feels closest to your <em>undertone?</em></>} copy="Depth and undertone are different. This is only your impression." />
      <div className="wj-undertone-education">{UNDERTONES.slice(0, 3).map((item) => <article key={item.value}><i style={{ background: item.color }} /><strong>{item.value}</strong></article>)}</div>
      <p className="wj-olive-explainer">Olive can appear with warm, cool or neutral undertones, at any depth.</p>
      <div className="wj-undertone-picker" role="group" aria-label="Undertone impression">{UNDERTONES.map((item) => <Choice key={item.value} title={item.value} selected={draft.undertone === item.value} onClick={() => change({ undertone: draft.undertone === item.value ? null : item.value })} />)}</div>
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" secondary={<button type="button" className="wj-text-action" onClick={advance}>Skip for now <ArrowRight size={14} /></button>} />
    </section>}

    {displayStep === "veins" && <section className="wj-quiz-question">
      <Question kicker="WRIST VEINS" title={<>What color do your wrist veins <em>look?</em></>} copy="An optional clue, not a test." />
      <HelpDisclosure title="How to check your wrist veins" open={openHelp === "veins"} onClick={() => setOpenHelp(openHelp === "veins" ? "" : "veins")}>
        In indirect daylight, look at the lines on your inner wrist or forearm. Their color is not a reliable standalone undertone test.
      </HelpDisclosure>
      <div className="wj-vein-illustration" aria-label="Illustrative vein colors across varied skin depths">{["#f3dfcf", "#d4ad91", "#aa8063", "#775541", "#493329"].map((tone, index) => <i key={tone} aria-label={`Illustrative skin depth ${index + 1}`} style={{ background: tone }}><b className={index % 2 ? "wj-vein-line wj-vein-line--teal" : "wj-vein-line"} /><b className="wj-vein-line wj-vein-line--blue" /></i>)}</div>
      <div className="wj-quiz-choice-grid">{VEINS.map((value) => <Choice key={value} title={value} selected={draft.veinClue === value} onClick={() => change({ veinClue: draft.veinClue === value ? null : value })} />)}</div>
      <p className="wj-quiz-footnote">Blue or purple is sometimes linked to cool, green to warm and mixed to neutral. Veins cannot determine undertone.</p>
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" secondary={<button type="button" className="wj-text-action" onClick={advance}>Skip this clue <ArrowRight size={14} /></button>} />
    </section>}

    {displayStep === "clues" && <section className="wj-quiz-question">
      <Question kicker="OTHER CLUES" title={<>What have you noticed about <em>your skin?</em></>} copy="Choose anything that feels familiar." />
      <div className="wj-quiz-choice-grid">{CLUES.map((value) => <Choice key={value} title={value} selected={draft.clues.includes(value)} onClick={() => change({ clues: toggleChoice(draft.clues, value, value === "I'm not sure") })} />)}</div>
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" secondary={<button type="button" className="wj-text-action" onClick={advance}>Skip for now <ArrowRight size={14} /></button>} />
    </section>}

    {displayStep === "olive" && <section className="wj-quiz-question">
      <Question kicker="OLIVE" title={<>Does your skin ever look slightly <em>green-gray?</em></>} copy="An optional observation at any skin depth." />
      <div className="wj-olive-depth-note">{QUIZ_SWATCHES.filter((item) => [2, 12, 22, 32, 38].includes(item.number)).map((shade) => <i key={shade.id} style={{ background: shade.color }} aria-label={`Illustrative depth ${shade.number}`} />)}</div>
      <div className="wj-quiz-choice-grid wj-quiz-choice-grid--compact">{(["yes", "maybe", "no", "unsure"] as const).map((value) => <Choice key={value} title={value === "yes" ? "Yes, I’ve noticed this" : value === "maybe" ? "Possibly" : value === "no" ? "No" : "I’m not sure"} selected={draft.olive === value} onClick={() => change({ olive: draft.olive === value ? null : value })} />)}</div>
      <HelpDisclosure title="What does olive mean?" open={openHelp === "olive"} onClick={() => setOpenHelp(openHelp === "olive" ? "" : "olive")}>Olive describes a muted green or gray-green quality. Warm olive, neutral olive and cool olive are all possible. This quiz does not assign it from your depth or vein answer.</HelpDisclosure>
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" secondary={<button type="button" className="wj-text-action" onClick={advance}>Skip for now <ArrowRight size={14} /></button>} />
    </section>}

    {displayStep === "categories" && <section className="wj-quiz-question">
      <Question kicker="DISCOVER" title={<>What would you love to <em>discover?</em></>} copy="Choose any categories that interest you." />
      <div className="wj-quiz-category-grid">{CATEGORY_OPTIONS.map((category) => <button type="button" key={category} aria-pressed={draft.categories.includes(category)} className={draft.categories.includes(category) ? "is-selected" : ""} onClick={() => change({ categories: category === "Everything" ? (draft.categories.includes("Everything") ? [] : ["Everything"]) : draft.categories.includes(category) ? draft.categories.filter((item) => item !== category && item !== "Everything") : [...draft.categories.filter((item) => item !== "Everything"), category] })}>{category}{draft.categories.includes(category) && <Check size={14} />}</button>)}</div>
      {error && <p role="alert" className="wj-form-error">{error}</p>}
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" secondary={<button type="button" className="wj-text-action" onClick={() => change({ categories: ["Everything"] })}>Choose everything</button>} />
    </section>}

    {displayStep === "preferences" && <section className="wj-quiz-question">
      <Question kicker="PREFERENCES" title={<>What do you like in <em>makeup?</em></>} copy="Optional. Leave any answer open." />
      <div className="wj-preference-fields">{[
        { key: "budget" as const, legend: "Budget", options: ["Drugstore", "Mid-range", "Luxury", "No preference"] },
        { key: "finish" as const, legend: "Finish", options: ["Natural", "Dewy", "Matte", "Satin", "No preference"] },
        { key: "skinType" as const, legend: "Skin type", options: ["Dry", "Oily", "Combination", "Normal", "Not sure"] },
      ].map((group) => <fieldset key={group.key}><legend>{group.legend}<span>OPTIONAL</span></legend><div>{group.options.map((item) => <button key={item} type="button" aria-pressed={draft[group.key] === item} className={draft[group.key] === item ? "is-selected" : ""} onClick={() => change({ [group.key]: draft[group.key] === item ? "" : item })}>{item}</button>)}</div></fieldset>)}</div>
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Review my profile" secondary={<button type="button" className="wj-text-action" onClick={advance}>Skip preferences <ArrowRight size={14} /></button>} />
    </section>}

    {displayStep === "review" && <ProfileReview draft={draft} setStep={setStep} complete={() => setStep("discovery")} onBack={goBack} />}

    {displayStep === "discovery" && <DiscoveryPreview draft={draft} onEdit={() => setStep("review")} onBack={goBack} onComplete={() => onComplete(buildProfile())} />}

  </main>;
}

function Question({ kicker, title, copy }: { kicker: string; title: ReactNode; copy: string }) {
  return <div className="wj-quiz-question-copy"><span className="wj-quiz-kicker">{kicker}</span><h1 id="wj-quiz-title" tabIndex={-1}>{title}</h1><p>{copy}</p></div>;
}
function HelpDisclosure({ title, open, onClick, children }: { title: string; open: boolean; onClick: () => void; children: ReactNode }) {
  return <div className="wj-quiz-help"><button type="button" aria-expanded={open} onClick={onClick}><CircleHelp size={16} />{title}<ChevronDown size={15} /></button>{open && <div className="wj-quiz-help-copy">{children}</div>}</div>;
}

function ProfileReview({ draft, setStep, complete, onBack }: { draft: QuizDraft; setStep: (step: QuizStep) => void; complete: () => void; onBack: () => void }) {
  const [showReasoning, setShowReasoning] = useState(false);
  const shade = swatchFor(draft);
  const olive = draft.olive === "yes" ? "Yes, noticed an olive cast" : draft.olive === "maybe" ? "Possibly" : draft.olive === "no" ? "No" : "Still exploring";
  const matchText = draft.products.map((item) => `${item.brand || item.type}${item.product ? ` · ${item.product}` : ""}: ${item.match.join(", ") || "No match notes"}`).join(" · ");
  const referenceProduct = draft.products.find((item) => item.id === draft.referenceProductId);
  return <section className="wj-quiz-review">
    <h1 id="wj-quiz-title" tabIndex={-1}>Your starting <em>point.</em></h1>
    <p>Your answers, in your words. Nothing is inferred.</p>
    <div className="wj-quiz-profile-preview">
      <div className="wj-quiz-profile-tone"><span>SKIN DEPTH</span><i style={{ background: shade?.color ?? "#ddd0c7" }} /><strong>{shade ? shade.label : "Still exploring"}</strong><small>{shade ? `Selected swatch ${shade.number} of 40 · ${shade.id}` : "No depth selected"}</small></div>
        <div className="wj-quiz-profile-info"><ProfileSummary label="Undertone" value={draft.undertone ?? "Still exploring"} step="undertone" setStep={setStep} />
        <ProfileSummary label="Olive" value={olive} step="olive" setStep={setStep} />
        <ProfileSummary label="Current makeup" value={draft.products.length ? matchText : draft.newToMakeup ? "New to makeup" : draft.noCurrentMakeup ? "No current complexion makeup" : draft.currentMakeupSkipped ? "Skipped" : "No product notes added"} step={draft.products.length ? "matches" : "products"} setStep={setStep} />
        <ProfileSummary label="Depth reference" value={referenceProduct ? `${referenceProduct.brand || referenceProduct.type}${referenceProduct.shadeUnknown ? " · shade unknown" : referenceProduct.shade ? ` · ${referenceProduct.shade}` : ""}` : "No product reference"} step="depth" setStep={setStep} />
        <ProfileSummary label="Other clues" value={draft.clues.join(", ") || "Still exploring"} step="clues" setStep={setStep} />
        <ProfileSummary label="Veins" value={draft.veinClue ?? "Skipped or still exploring"} step="veins" setStep={setStep} />
        <ProfileSummary label="Explore" value={draft.categories.length ? draft.categories.join(", ") : "No category selected"} step="categories" setStep={setStep} />
        <ProfileSummary label="Preferences" value={[draft.budget, draft.finish, draft.skinType].filter(Boolean).join(" · ") || "Left open"} step="preferences" setStep={setStep} />
      </div>
    </div>
    <HelpDisclosure title="What brought us here" open={showReasoning} onClick={() => setShowReasoning(!showReasoning)}>
      {[
      shade ? `You chose ${shade.label} as a starting depth.` : "You left skin depth open.",
      draft.undertone ? `You described your undertone impression as ${draft.undertone.toLowerCase()}.` : "You are still exploring undertone.",
      draft.veinClue ? `Your optional vein observation was “${draft.veinClue}”, which is shown as a clue only.` : "No vein clue was used.",
      draft.clues.length ? `You also noted: ${draft.clues.join("; ")}.` : "No additional color clues were selected.",
    ].concat(draft.products.some((product) => product.match.length) ? [`Your product observations were ${draft.products.filter((product) => product.match.length).map((product) => product.match.join(" and ")).join("; ")}.`] : []).join(" ")} No scoring, diagnosis or recommendation algorithm is used.
    </HelpDisclosure>
    <div className="wj-quiz-navigation"><button className="wj-text-action" type="button" onClick={onBack}><ArrowLeft size={15} /> Back</button><button className="wj-primary" type="button" onClick={complete}>Continue <ArrowRight size={15} /></button></div>
  </section>;
}
function ProfileSummary({ label, value, step, setStep }: { label: string; value: string; step: QuizStep; setStep: (step: QuizStep) => void }) {
  return <div className="wj-answer-row"><span>{label}</span><strong>{value}</strong><button type="button" onClick={() => setStep(step)}>Edit</button></div>;
}
function DiscoveryPreview({ draft, onEdit, onBack, onComplete }: { draft: QuizDraft; onEdit: () => void; onBack: () => void; onComplete: () => void }) {
  const filtered = SAMPLE_PRODUCTS.filter((item) => draft.categories.includes("Everything") || draft.categories.includes(item.category) || !draft.categories.length);
  const examples = (filtered.length ? filtered : SAMPLE_PRODUCTS).slice(0, 3);
  return <section className="wj-quiz-discovery">
    <Eyebrow>ILLUSTRATIVE DISCOVERY PREVIEW</Eyebrow><h1 id="wj-quiz-title" tabIndex={-1}>A few things <em>to explore.</em></h1>
    <p>Illustrative examples, not verified shade listings, recommendations or matches.</p>
    <div className="wj-quiz-sample-products">{examples.map((item) => <article key={item.id}>
      <span>{item.category.toUpperCase()} · EXAMPLE</span><h2>{item.brand}</h2><strong>{item.name}</strong>
      <dl><div><dt>Catalog details</dt><dd>Not verified</dd></div></dl>
    </article>)}</div>
    <div className="wj-quiz-navigation"><button className="wj-text-action" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to your profile</button><button className="wj-secondary" type="button" onClick={onEdit}>Edit my answers</button><button className="wj-primary" type="button" onClick={onComplete}>View my starting point <ArrowRight size={15} /></button></div>
  </section>;
}

export function ResultsPage({ profile, draft, onNavigate }: { profile: Profile; draft: QuizDraft; onNavigate: (page: NeuPage) => void }) {
  const depth = swatchFor(draft);
  const selected = draft.undertone;
  const undertone = selected && selected !== "Still exploring" ? `Possibly ${selected.toLowerCase()}` : "Still exploring";
  return <main className="wj-content wj-narrow-content wj-quiz-results-complete" data-profile-depth={profile.depth ?? "unset"}>
    <Eyebrow>A FIRST STEP, NOT A FINAL ANSWER</Eyebrow><div className="wj-results-heading"><h1>Your shade story <em>starts here.</em></h1><p>A transparent summary of your own answers. No inferred profile, score or algorithmic match.</p></div>
    <div className="wj-results-profile"><div><span>SKIN DEPTH</span><strong>{depth ? `${depth.label} · swatch ${depth.number} of 40` : "Still exploring"}</strong>{depth && <i className="wj-results-selected-swatch" style={{ background: depth.color }} />}</div><div><span>UNDERTONE IMPRESSION</span><strong>{undertone}</strong></div><div><span>CATEGORIES TO EXPLORE</span><strong>{draft.categories.join(", ") || "Everything"}</strong></div><div><span>CURRENT MAKEUP</span><strong>{draft.products.length ? `${draft.products.length} product ${draft.products.length === 1 ? "note" : "notes"}` : draft.newToMakeup ? "New to makeup" : draft.noCurrentMakeup ? "No current complexion makeup" : draft.currentMakeupSkipped ? "Skipped" : "Not noted"}</strong></div></div>
    {draft.products.length > 0 && <section className="wj-shade-evidence"><div className="wj-shade-evidence-heading"><Eyebrow>YOUR CURRENT MAKEUP NOTES · UNVERIFIED</Eyebrow><h2>What you already use.</h2><p>These are your typed product details and match observations, not verified catalog records.</p></div>{draft.products.map((item) => <dl key={item.id}><div><dt>Product type</dt><dd>{item.type}</dd></div><div><dt>Brand / product</dt><dd>{[item.brand, item.product].filter(Boolean).join(" · ") || "Not entered"}</dd></div><div><dt>Formula / shade</dt><dd>{[item.formula, item.shadeUnknown ? "I do not know my shade" : item.shade].filter(Boolean).join(" · ") || "Not entered"}</dd></div><div><dt>Your observation</dt><dd>{item.match.join(", ") || "No match notes"}</dd></div></dl>)}</section>}
    <section className="wj-what-brought"><Eyebrow>WHAT BROUGHT US HERE</Eyebrow><h2>Only the clues you shared.</h2><p>{depth ? `You selected ${depth.label}, swatch ${depth.number} of 40. ` : "You left depth open. "}{selected ? `You described your undertone impression as ${selected.toLowerCase()}. ` : "You did not choose an undertone. "}{draft.veinClue ? `You noted “${draft.veinClue}” as an optional vein clue, not proof. ` : ""}{draft.clues.length ? `You also selected ${draft.clues.join(", ")}. ` : ""}{draft.olive === "yes" ? "You said you have noticed an olive cast. " : draft.olive === "maybe" ? "You are possibly noticing an olive cast. " : "No olive characteristic was inferred."}{draft.products.some((product) => product.match.length) ? ` Your product observations were ${draft.products.filter((product) => product.match.length).map((product) => product.match.join(" and ")).join("; ")}.` : ""}</p><small>Depth was not used to infer undertone. Veins were not treated as a diagnosis.</small></section>
    <div className="wj-no-match-card"><Sparkles size={20} /><div><strong>No exact shade claims here.</strong><p>Catalog formulas and shades are unverified. No recommendation engine or real community recommendations are connected.</p></div></div>
    <section className="wj-results-next"><h2>Your next step can be a little discovery.</h2><p>Browse illustrative product examples or revisit your profile notes.</p><div><button type="button" className="wj-primary" onClick={() => onNavigate("discover")}>Browse product examples <ArrowRight size={15} /></button><button type="button" className="wj-secondary" onClick={() => onNavigate("learn")}>Learn about color <ArrowRight size={15} /></button><button type="button" className="wj-text-action" onClick={() => onNavigate("quiz")}>Edit my quiz answers</button><button type="button" className="wj-text-action" onClick={() => onNavigate("profile")}>Edit my profile</button></div></section>
  </main>;
}
