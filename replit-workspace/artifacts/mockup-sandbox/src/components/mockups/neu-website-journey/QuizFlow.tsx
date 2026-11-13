import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleHelp, Plus, X } from "lucide-react";
import { DEFAULT_PROFILE, SAMPLE_PRODUCTS, type Profile } from "./data";
import { DEPTH_GROUPS, QUIZ_SWATCHES, type CurrentProductType, type ProductMatch, type QuizDraft, type QuizProduct, type QuizStep } from "./_shared/quizDraft";

const QUESTION_STEPS: QuizStep[] = ["products", "depth", "undertone", "categories"];
const STEP_LABELS: Record<QuizStep, string> = {
  products: "Current makeup",
  depth: "Skin depth",
  undertone: "Undertone",
  categories: "Interests",
  review: "Starting point",
};
const PRODUCT_TYPES: CurrentProductType[] = ["Foundation", "Concealer", "Skin tint", "BB or CC cream"];
const BRANDS = ["Maybelline", "L'Oréal", "NYX", "e.l.f.", "Milani", "Revlon", "CoverGirl", "Fenty Beauty", "NARS", "M·A·C", "Rare Beauty", "Huda Beauty", "Estée Lauder", "Clinique"];
const MATCHES: ProductMatch[] = ["Blends in perfectly", "A little too light", "A little too dark", "Too orange", "Too pink", "Too yellow", "Gray or ashy", "Changes color after application", "Not sure yet"];
const UNDERTONES = [
  { value: "Warm", color: "#d8aa78" },
  { value: "Cool", color: "#a67f99" },
  { value: "Neutral", color: "#bda093" },
  { value: "Still exploring", color: "#9a9188" },
] as const;
const CATEGORY_OPTIONS = ["Foundation", "Concealer", "Skin tint", "Blush", "Bronzer", "Contour", "Highlighter", "Lipstick", "Lip liner", "Lip gloss", "Eyeshadow", "Setting powder", "Setting spray", "Primer", "SPF", "Everything"];

function swatchFor(draft: QuizDraft) {
  return QUIZ_SWATCHES.find((item) => item.id === draft.shadeId) ?? null;
}

function Choice({ title, selected, onClick }: { title: string; selected: boolean; onClick: () => void }) {
  return <button type="button" className={`wj-selectable${selected ? " is-selected" : ""}`} aria-pressed={selected} onClick={onClick}>
    <span><strong>{title}</strong></span><i aria-hidden="true">{selected && <Check size={14} />}</i>
  </button>;
}

function Typeahead({ label, value, placeholder, suggestions, onChange, suggestionTag = "Suggestion" }: {
  label: string;
  value: string;
  placeholder: string;
  suggestions: string[];
  onChange: (value: string) => void;
  suggestionTag?: string;
}) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const inputId = `${uid}-input`;
  const listboxId = `${uid}-listbox`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const matching = useMemo(() => {
    const query = value.trim().toLowerCase();
    return query ? suggestions.filter((item) => item.toLowerCase().includes(query) && item.toLowerCase() !== query).slice(0, 6) : [];
  }, [suggestions, value]);
  const choose = (option: string) => {
    onChange(option);
    setOpen(false);
    setActive(-1);
  };
  const activeId = open && active >= 0 && matching[active] ? `${uid}-option-${active}` : undefined;

  return <div className="wj-quiz-field">
    <label id={labelId} htmlFor={inputId}>{label}</label>
    <div className="wj-typeahead">
      <input
        id={inputId}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && matching.length > 0}
        aria-autocomplete="list"
        aria-labelledby={labelId}
        aria-controls={open && matching.length > 0 ? listboxId : undefined}
        aria-activedescendant={activeId}
        onFocus={() => setOpen(true)}
        onBlur={() => { setOpen(false); setActive(-1); }}
        onChange={(event) => { onChange(event.target.value); setOpen(true); setActive(-1); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && matching.length) {
            event.preventDefault();
            setOpen(true);
            setActive((current) => current < 0 ? 0 : (current + 1) % matching.length);
          }
          if (event.key === "ArrowUp" && matching.length) {
            event.preventDefault();
            setOpen(true);
            setActive((current) => current < 0 ? matching.length - 1 : (current - 1 + matching.length) % matching.length);
          }
          if (event.key === "Enter" && open && active >= 0 && matching[active]) {
            event.preventDefault();
            choose(matching[active]);
          }
          if (event.key === "Escape") {
            setOpen(false);
            setActive(-1);
          }
        }}
      />
      {open && matching.length > 0 && <div id={listboxId} className="wj-typeahead-options" role="listbox" aria-labelledby={labelId}>
        {matching.map((option, index) => <button
          id={`${uid}-option-${index}`}
          type="button"
          role="option"
          tabIndex={-1}
          aria-selected={index === active}
          key={option}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => choose(option)}
        >{option}<span>{suggestionTag}</span></button>)}
      </div>}
    </div>
  </div>;
}

function ProductRow({ product, index, matchOpen, onChange, onRemove, onToggleMatch }: {
  product: QuizProduct;
  index: number;
  matchOpen: boolean;
  onChange: (patch: Partial<QuizProduct>) => void;
  onRemove: () => void;
  onToggleMatch: () => void;
}) {
  const sampleProductNames = SAMPLE_PRODUCTS.filter((item) => item.brand.toLowerCase() === product.brand.trim().toLowerCase()).map((item) => item.name);
  const brandSuggestions = BRANDS.filter((brand) => brand.toLowerCase().includes(product.brand.toLowerCase()));

  return <article className="wj-quiz-product-row">
    <header>
      <label className="wj-visually-hidden" htmlFor={`wj-product-type-${product.id}`}>Product type for product {index + 1}</label>
      <select id={`wj-product-type-${product.id}`} value={product.type} onChange={(event) => onChange({
        type: event.target.value as CurrentProductType,
        brand: "",
        brandUnknown: false,
        product: "",
        formula: "",
        shade: "",
        shadeUnknown: false,
        match: [],
      })}>{PRODUCT_TYPES.map((type) => <option key={type}>{type}</option>)}</select>
      <button type="button" onClick={onRemove} aria-label={`Remove product ${index + 1}`}><X size={15} /> Remove</button>
    </header>

    {!product.brandUnknown
      ? <><Typeahead label="Brand" value={product.brand} placeholder="Type any brand" suggestions={brandSuggestions} suggestionTag="Brand" onChange={(brand) => onChange({ brand, brandUnknown: false, product: "", formula: "", shade: "", shadeUnknown: false, match: [] })} />
        <button type="button" className="wj-quiz-inline-skip" onClick={() => onChange({ brandUnknown: true, brand: "", product: "", formula: "", shade: "", shadeUnknown: false, match: [] })}>I’m not sure of the brand</button></>
      : <button type="button" className="wj-quiz-inline-skip" onClick={() => onChange({ brandUnknown: false })}>Add brand name</button>}

    {(product.brand.trim() || product.brandUnknown) && <>
      <Typeahead label="Product or line" value={product.product} placeholder="Type product name" suggestions={sampleProductNames} suggestionTag="Illustrative" onChange={(value) => onChange({ product: value, formula: "", shade: "", shadeUnknown: false, match: [] })} />
      {product.product.trim() && <div className="wj-quiz-product-subgrid">
        <Typeahead label="Formula or variant" value={product.formula} placeholder="Type if known" suggestions={[]} onChange={(value) => onChange({ formula: value, shade: "", shadeUnknown: false, match: [] })} />
        <div className="wj-quiz-shade-entry">
          {!product.shadeUnknown && <Typeahead label="Exact shade" value={product.shade} placeholder="Type if known" suggestions={[]} onChange={(value) => onChange({ shade: value, match: [] })} />}
          <button type="button" className={`wj-shade-unknown${product.shadeUnknown ? " is-selected" : ""}`} aria-pressed={product.shadeUnknown} onClick={() => onChange({ shadeUnknown: !product.shadeUnknown, shade: "", match: [] })}>I do not know my shade</button>
        </div>
      </div>}
    </>}

    <HelpDisclosure title="Shade observations (optional)" open={matchOpen} onClick={onToggleMatch}>
      <div className="wj-quiz-match-options">{MATCHES.map((value) => <button
        type="button"
        key={value}
        aria-pressed={product.match.includes(value)}
        className={product.match.includes(value) ? "is-selected" : ""}
        onClick={() => onChange({ match: toggleMatch(product.match, value) })}
      >{value}{product.match.includes(value) && <Check size={13} />}</button>)}</div>
      <p className="wj-quiz-match-policy">“Blends in perfectly” and “Not sure yet” stand alone; too light and too dark cannot combine.</p>
    </HelpDisclosure>
  </article>;
}

function toggleMatch(current: ProductMatch[], value: ProductMatch): ProductMatch[] {
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (value === "Blends in perfectly" || value === "Not sure yet") return [value];
  const withoutExclusive = current.filter((item) => item !== "Blends in perfectly" && item !== "Not sure yet");
  if (value === "A little too light") return [...withoutExclusive.filter((item) => item !== "A little too dark"), value];
  if (value === "A little too dark") return [...withoutExclusive.filter((item) => item !== "A little too light"), value];
  return [...withoutExclusive, value];
}

function QuizProgress({ step }: { step: QuizStep }) {
  const complete = step === "review";
  const questionNumber = QUESTION_STEPS.indexOf(step) + 1;
  const progress = complete ? 100 : (questionNumber / QUESTION_STEPS.length) * 100;
  return <div className="wj-quiz-progress">
    <div className="wj-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={complete ? "Four questions complete" : `Question ${questionNumber} of four`}>
      <i style={{ width: `${progress}%` }} />
    </div>
    <div className="wj-progress-label">
      <span>{STEP_LABELS[step].toUpperCase()}</span>
      <span>{complete ? "COMPLETE · 4 QUESTIONS" : `QUESTION ${questionNumber} OF 4`}</span>
    </div>
  </div>;
}

export function QuizFlow({ draft, onDraftChange, onComplete, onLearn }: {
  draft: QuizDraft;
  onDraftChange: (draft: QuizDraft) => void;
  onComplete: (profile: Profile) => void;
  onLearn: () => void;
}) {
  const [openHelp, setOpenHelp] = useState<string | null>(null);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const change = (patch: Partial<QuizDraft>) => onDraftChange({ ...draft, ...patch });
  const setStep = (step: QuizStep, patch: Partial<QuizDraft> = {}) => {
    onDraftChange({ ...draft, ...patch, step });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    document.getElementById("wj-quiz-title")?.focus({ preventScroll: true });
  }, [draft.step]);

  const addProduct = (type: CurrentProductType) => {
    const id = `quiz-product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    change({
      products: [...draft.products, { id, type, brand: "", brandUnknown: false, product: "", formula: "", shade: "", shadeUnknown: false, match: [] }],
      noCurrentMakeup: false,
      newToMakeup: false,
      currentMakeupSkipped: false,
    });
    setShowAddOptions(false);
  };
  const patchProduct = (id: string, patch: Partial<QuizProduct>) => onDraftChange({
    ...draft,
    products: draft.products.map((product) => product.id === id ? { ...product, ...patch } : product),
  });
  const removeProduct = (id: string) => onDraftChange({
    ...draft,
    products: draft.products.filter((product) => product.id !== id),
    referenceProductId: draft.referenceProductId === id ? null : draft.referenceProductId,
  });
  const goBack = () => {
    if (draft.step === "review") {
      setStep("categories");
      return;
    }
    const previous = QUESTION_STEPS.indexOf(draft.step);
    setStep(previous <= 0 ? "products" : QUESTION_STEPS[previous - 1]);
  };
  const advance = () => {
    const current = QUESTION_STEPS.indexOf(draft.step);
    setStep(current < 0 || current === QUESTION_STEPS.length - 1 ? "review" : QUESTION_STEPS[current + 1]);
  };
  const skipProducts = () => {
    setStep("depth", { currentMakeupSkipped: draft.products.length === 0 && !draft.noCurrentMakeup && !draft.newToMakeup });
  };
  const skipCategories = () => {
    setStep("review", { categories: ["Everything"] });
  };
  const buildProfile = (): Profile => {
    const selected = swatchFor(draft);
    const firstProduct = draft.products[0];
    return {
      ...DEFAULT_PROFILE,
      depth: selected?.profileDepth ?? null,
      quizShadeId: selected?.id ?? null,
      undertone: draft.undertone,
      olive: draft.olive === "yes" ? true : draft.olive === "no" ? false : null,
      skinType: draft.skinType || null,
      categories: draft.categories,
      shadeEvidence: firstProduct ? {
        brand: firstProduct.brand || "Not entered",
        product: firstProduct.product || "Not entered",
        formula: firstProduct.formula || "Not entered",
        shade: firstProduct.shade || "Not entered",
        source: "manual",
      } : null,
    };
  };
  const selectedSwatch = swatchFor(draft);

  return <main className="wj-quiz-frame wj-quiz-complete" aria-labelledby="wj-quiz-title">
    <QuizProgress step={draft.step} />

    {draft.step === "products" && <section className="wj-quiz-question">
      <Question title={<>What complexion makeup do you <em>currently use?</em></>} copy="Optional. Add what you use, or continue. Answers clear if you refresh this preview." />
      {draft.products.length === 0 && <div className="wj-quiz-current-options">
        {PRODUCT_TYPES.map((type) => <button type="button" key={type} onClick={() => addProduct(type)}>{type}</button>)}
        <button type="button" aria-pressed={draft.noCurrentMakeup} className={draft.noCurrentMakeup ? "is-selected" : ""} onClick={() => change({ noCurrentMakeup: !draft.noCurrentMakeup, newToMakeup: false, currentMakeupSkipped: false, products: [], referenceProductId: null })}>No current makeup</button>
        <button type="button" aria-pressed={draft.newToMakeup} className={draft.newToMakeup ? "is-selected" : ""} onClick={() => change({ newToMakeup: !draft.newToMakeup, noCurrentMakeup: false, currentMakeupSkipped: false, products: [], referenceProductId: null })}>I’m new to makeup</button>
      </div>}
      {draft.products.map((product, index) => <ProductRow
        key={product.id}
        product={product}
        index={index}
        matchOpen={openHelp === `matches-${product.id}`}
        onChange={(patch) => patchProduct(product.id, patch)}
        onRemove={() => removeProduct(product.id)}
        onToggleMatch={() => setOpenHelp(openHelp === `matches-${product.id}` ? null : `matches-${product.id}`)}
      />)}
      {draft.products.length > 0 && <div className="wj-quiz-product-actions">
        <button type="button" className="wj-secondary" onClick={() => setShowAddOptions((current) => !current)}><Plus size={15} /> Add another product</button>
        <button type="button" className="wj-quiz-inline-skip" onClick={() => change({ noCurrentMakeup: true, newToMakeup: false, currentMakeupSkipped: false, products: [], referenceProductId: null })}>I don’t use complexion makeup</button>
        <button type="button" className="wj-quiz-inline-skip" onClick={() => change({ newToMakeup: true, noCurrentMakeup: false, currentMakeupSkipped: false, products: [], referenceProductId: null })}>I’m new to makeup</button>
      </div>}
      {showAddOptions && draft.products.length > 0 && <div className="wj-quiz-current-options wj-quiz-current-options--add" aria-label="Choose another product type">
        {PRODUCT_TYPES.map((type) => <button type="button" key={type} onClick={() => addProduct(type)}>{type}</button>)}
      </div>}
      {(draft.noCurrentMakeup || draft.newToMakeup) && draft.products.length === 0 && <p className="wj-quiz-answer-note">{draft.noCurrentMakeup ? "No current makeup" : "New to makeup"}</p>}
      <Navigation onBack={() => {}} onContinue={advance} continueLabel="Continue" hideBack />
    </section>}

    {draft.step === "depth" && <section className="wj-quiz-question">
      <Question title={<>Which shade looks closest to <em>your skin?</em></>} copy="A starting point only. You can leave this open." />
      {draft.products.length > 0 && <label className="wj-quiz-reference">
        <span>Optional product reference</span>
        <select value={draft.referenceProductId ?? ""} onChange={(event) => change({ referenceProductId: event.target.value || null })}>
          <option value="">None</option>
          {draft.products.map((product, index) => <option key={product.id} value={product.id}>{product.brand || product.type}{product.shadeUnknown ? " · shade unknown" : product.shade ? ` · ${product.shade}` : ` · product ${index + 1}`}</option>)}
        </select>
      </label>}
      <div className="wj-quiz-depth-groups">{DEPTH_GROUPS.map((group, groupIndex) => <div key={group} className="wj-quiz-depth-row" role="group" aria-label={`${group} skin shades`}>
        <span className="wj-depth-group-label">{group}</span>
        <div className="wj-quiz-swatch-grid">{QUIZ_SWATCHES.slice(groupIndex * 5, groupIndex * 5 + 5).map((shade) =>
          <button
            type="button"
            key={shade.id}
            aria-label={`${shade.label}, swatch ${shade.number} of 40`}
            aria-pressed={draft.shadeId === shade.id}
            title={shade.label}
            className={draft.shadeId === shade.id ? "is-selected" : ""}
            style={{ "--swatch": shade.color } as CSSProperties}
            onClick={() => change({ shadeId: shade.id, depthUnsure: false })}
          ><i />{draft.shadeId === shade.id && <Check size={13} aria-hidden="true" />}</button>
        )}</div>
      </div>)}</div>
      <div className="wj-depth-selected-preview" aria-live="polite">
        {selectedSwatch
          ? <><span className="wj-depth-preview-swatch" style={{ background: selectedSwatch.color }} /><strong>{selectedSwatch.label}</strong><small>{selectedSwatch.number} of 40 · {selectedSwatch.id}</small></>
          : <><span className="wj-depth-preview-empty" /><strong>{draft.depthUnsure ? "Still exploring" : "No shade selected"}</strong></>}
      </div>
      <button type="button" className={`wj-unsure-button${draft.depthUnsure ? " is-selected" : ""}`} aria-pressed={draft.depthUnsure} onClick={() => change({ depthUnsure: !draft.depthUnsure, shadeId: null })}><CircleHelp size={16} /> I’m not sure yet</button>
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" />
    </section>}

    {draft.step === "undertone" && <section className="wj-quiz-question">
      <Question title={<>What feels familiar about your <em>coloring?</em></>} copy="Optional. Leave any answer open." />
      <div className="wj-undertone-picker" role="group" aria-label="Undertone impression">{UNDERTONES.map((item) => <button
        key={item.value}
        type="button"
        aria-pressed={draft.undertone === item.value}
        className={`wj-selectable${draft.undertone === item.value ? " is-selected" : ""}`}
        onClick={() => change({ undertone: draft.undertone === item.value ? null : item.value })}
      ><span><i className="wj-undertone-mark" style={{ background: item.color }} /><strong>{item.value}</strong></span><i aria-hidden="true">{draft.undertone === item.value && <Check size={14} />}</i></button>)}</div>
      <div className="wj-quiz-olive-section">
        <h2>Do you notice an <em>olive cast?</em></h2>
        <p>Olive can be independent of warm, cool or neutral undertones.</p>
        <div className="wj-quiz-choice-grid wj-quiz-choice-grid--compact" role="group" aria-label="Optional olive cast">
          {(["yes", "maybe", "no", "unsure"] as const).map((value) => <Choice
            key={value}
            title={value === "yes" ? "Yes" : value === "maybe" ? "Possibly" : value === "no" ? "No" : "Not sure"}
            selected={draft.olive === value}
            onClick={() => change({ olive: draft.olive === value ? null : value })}
          />)}
        </div>
      </div>
      <HelpDisclosure title="Learn about depth, undertone and olive" open={openHelp === "undertone"} onClick={() => setOpenHelp(openHelp === "undertone" ? null : "undertone")}>
        <p>Depth describes light to deep; undertone is a subtle color impression. Olive can overlap with any undertone. These are personal observations, not a test.</p>
        <button type="button" className="wj-inline-learn" onClick={onLearn}>Open the color guide <ArrowRight size={14} /></button>
      </HelpDisclosure>
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" secondary={<button type="button" className="wj-text-action" onClick={advance}>Skip for now <ArrowRight size={14} /></button>} />
    </section>}

    {draft.step === "categories" && <section className="wj-quiz-question">
      <Question title={<>What would you like to <em>explore?</em></>} copy="Choose what interests you, or browse everything." />
      <div className="wj-quiz-category-grid">{CATEGORY_OPTIONS.map((category) => <button
        type="button"
        key={category}
        aria-pressed={draft.categories.includes(category)}
        className={draft.categories.includes(category) ? "is-selected" : ""}
        onClick={() => change({
          categories: category === "Everything"
            ? draft.categories.includes("Everything") ? [] : ["Everything"]
            : draft.categories.includes(category)
              ? draft.categories.filter((item) => item !== category && item !== "Everything")
              : [...draft.categories.filter((item) => item !== "Everything"), category],
        })}
      >{category}{draft.categories.includes(category) && <Check size={14} />}</button>)}</div>
      <HelpDisclosure title="More preferences (optional)" open={openHelp === "preferences"} onClick={() => setOpenHelp(openHelp === "preferences" ? null : "preferences")}>
        <PreferenceFields draft={draft} onChange={change} />
      </HelpDisclosure>
      <Navigation onBack={goBack} onContinue={advance} continueLabel="Continue" secondary={<button type="button" className="wj-text-action" onClick={skipCategories}>Skip · browse Everything</button>} />
    </section>}

    {draft.step === "review" && <ProfileReview
      draft={draft}
      setStep={setStep}
      onBack={goBack}
      onBrowse={() => onComplete(buildProfile())}
    />}
  </main>;
}

function Question({ title, copy }: { title: ReactNode; copy: string }) {
  return <div className="wj-quiz-question-copy">
    <h1 id="wj-quiz-title" tabIndex={-1}>{title}</h1>
    <p>{copy}</p>
  </div>;
}

function HelpDisclosure({ title, open, onClick, children }: { title: string; open: boolean; onClick: () => void; children: ReactNode }) {
  return <div className="wj-quiz-help">
    <button type="button" aria-expanded={open} onClick={onClick}><CircleHelp size={16} />{title}<ChevronDown size={15} /></button>
    {open && <div className="wj-quiz-help-copy">{children}</div>}
  </div>;
}

function Navigation({ onBack, onContinue, continueLabel, secondary, hideBack = false }: {
  onBack: () => void;
  onContinue: () => void;
  continueLabel: string;
  secondary?: ReactNode;
  hideBack?: boolean;
}) {
  return <div className="wj-quiz-navigation">
    {hideBack ? <span aria-hidden="true" /> : <button type="button" className="wj-text-action" onClick={onBack}><ArrowLeft size={15} /> Back</button>}
    {secondary}
    <button type="button" className="wj-primary" onClick={onContinue}>{continueLabel} <ArrowRight size={15} /></button>
  </div>;
}

function PreferenceFields({ draft, onChange }: { draft: QuizDraft; onChange: (patch: Partial<QuizDraft>) => void }) {
  const groups = [
    { key: "budget" as const, legend: "Budget", options: ["Drugstore", "Mid-range", "Prestige", "No preference"] },
    { key: "finish" as const, legend: "Finish", options: ["Natural", "Dewy", "Matte", "Satin", "No preference"] },
    { key: "skinType" as const, legend: "Skin type", options: ["Dry", "Oily", "Combination", "Normal", "Not sure"] },
  ];
  return <div className="wj-preference-fields">{groups.map((group) => <fieldset key={group.key}>
    <legend>{group.legend}</legend>
    <div>{group.options.map((item) => <button
      key={item}
      type="button"
      aria-pressed={draft[group.key] === item}
      className={draft[group.key] === item ? "is-selected" : ""}
      onClick={() => onChange({ [group.key]: draft[group.key] === item ? "" : item })}
    >{item}</button>)}</div>
  </fieldset>)}</div>;
}

function ProfileReview({ draft, setStep, onBack, onBrowse }: {
  draft: QuizDraft;
  setStep: (step: QuizStep) => void;
  onBack: () => void;
  onBrowse: () => void;
}) {
  const [showReasoning, setShowReasoning] = useState(false);
  const shade = swatchFor(draft);
  const oliveText = draft.olive === "yes" ? "Yes" : draft.olive === "maybe" ? "Possibly" : draft.olive === "no" ? "No" : draft.olive === "unsure" ? "Not sure" : "Not selected";
  const currentMakeup = draft.products.length
    ? draft.products.map((item) => `${item.brand || item.type}${item.product ? ` · ${item.product}` : ""}${item.shadeUnknown ? " · shade unknown" : item.shade ? ` · ${item.shade}` : ""}${item.match.length ? ` — ${item.match.join(", ")}` : ""}`).join("; ")
    : draft.newToMakeup ? "New to makeup"
      : draft.noCurrentMakeup ? "No current makeup"
        : draft.currentMakeupSkipped ? "Skipped" : "No product added";
  const interest = draft.categories.includes("Everything") ? "Everything" : draft.categories.join(", ") || "Not chosen";
  const preferences = [draft.budget, draft.finish, draft.skinType].filter(Boolean).join(" · ") || "Left open";
  const categories = draft.categories.filter((item) => item !== "Everything");
  const relevantProducts = categories.length ? SAMPLE_PRODUCTS.filter((item) => categories.includes(item.category)) : SAMPLE_PRODUCTS;
  const examples = (relevantProducts.length ? relevantProducts : SAMPLE_PRODUCTS).slice(0, 2);
  const reference = draft.products.find((item) => item.id === draft.referenceProductId);
  const explanation = [
    shade ? `You chose ${shade.label}, swatch ${shade.number} of 40.` : "You left depth open.",
    draft.undertone ? `Your undertone impression is ${draft.undertone.toLowerCase()}.` : "You left undertone open.",
    `Olive cast: ${oliveText.toLowerCase()}.`,
    draft.products.length ? `You entered ${draft.products.length} optional product ${draft.products.length === 1 ? "note" : "notes"}.` : `Current makeup: ${currentMakeup.toLowerCase()}.`,
    `Interests: ${interest}.`,
  ].join(" ");

  return <section className="wj-quiz-review">
    <h1 id="wj-quiz-title" tabIndex={-1}>Your starting <em>point.</em></h1>
    <p>Your answers, in your words. No score or inferred match.</p>
    <div className="wj-quiz-profile-preview">
      <div className="wj-quiz-profile-tone">
        <span>SKIN DEPTH</span>
        <i style={{ background: shade?.color ?? "#ddd0c7" }} />
        <strong>{shade ? shade.label : draft.depthUnsure ? "Still exploring" : "Not selected"}</strong>
        <small>{shade ? `Swatch ${shade.number} of 40 · ${shade.id}` : "No depth selected"}</small>
      </div>
      <div className="wj-quiz-profile-info">
        <ProfileSummary label="Products" value={currentMakeup} step="products" setStep={setStep} />
        <ProfileSummary label="Undertone" value={draft.undertone ?? "Not selected"} step="undertone" setStep={setStep} />
        <ProfileSummary label="Olive cast" value={oliveText} step="undertone" setStep={setStep} />
        <ProfileSummary label="Product reference" value={reference ? `${reference.brand || reference.type}${reference.shadeUnknown ? " · shade unknown" : reference.shade ? ` · ${reference.shade}` : ""}` : "None"} step="depth" setStep={setStep} />
        <ProfileSummary label="Interests" value={interest} step="categories" setStep={setStep} />
        <ProfileSummary label="More preferences" value={preferences} step="categories" setStep={setStep} />
      </div>
    </div>

    <HelpDisclosure title="What brought us here" open={showReasoning} onClick={() => setShowReasoning((current) => !current)}>
      <p>{explanation} The example cards below are not recommendations, catalog matches or community notes.</p>
      {draft.products.length > 0 && <ul className="wj-quiz-reasoning-products">{draft.products.map((product) => <li key={product.id}>
        {[product.type, product.brand || (product.brandUnknown ? "Brand unknown" : ""), product.product, product.formula, product.shadeUnknown ? "Shade unknown" : product.shade, product.match.join(", ")].filter(Boolean).join(" · ") || "Product details left open"}
      </li>)}</ul>}
    </HelpDisclosure>

    <section className="wj-quiz-sample-section" aria-labelledby="wj-examples-heading">
      <div className="wj-quiz-sample-heading">
        <h2 id="wj-examples-heading">Illustrative product examples</h2>
        <p>Examples to browse—not shade recommendations or verified catalog records.</p>
      </div>
      <div className="wj-quiz-sample-products">{examples.map((item) => <article key={item.id}>
        <span>{item.category.toUpperCase()} · ILLUSTRATIVE</span>
        <h3>{item.brand}</h3>
        <strong>{item.name}</strong>
        <p>Product and shade details are not verified.</p>
      </article>)}</div>
    </section>

    <div className="wj-quiz-navigation">
      <button type="button" className="wj-text-action" onClick={onBack}><ArrowLeft size={15} /> Back</button>
      <button type="button" className="wj-primary" onClick={onBrowse}>Browse product examples <ArrowRight size={15} /></button>
    </div>
  </section>;
}

function ProfileSummary({ label, value, step, setStep }: { label: string; value: string; step: QuizStep; setStep: (step: QuizStep) => void }) {
  return <div className="wj-answer-row">
    <span>{label}</span><strong>{value}</strong>
    <button type="button" onClick={() => setStep(step)} aria-label={`Edit ${label}`}>Edit</button>
  </div>;
}
