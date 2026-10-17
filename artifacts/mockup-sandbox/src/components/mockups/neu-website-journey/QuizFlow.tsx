import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleHelp, Info, Lightbulb, Sparkles } from "lucide-react";
import { CATEGORIES, DEFAULT_PROFILE, DEPTHS, SAMPLE_PRODUCTS, type NeuPage, type Profile, type ShadeEvidence, type Undertone } from "./data";
import { Eyebrow } from "./Shared";

type Experience = "" | "A good match" | "A little light" | "A little deep" | "Too pink" | "Too yellow" | "None yet" | "Not sure yet";
type Answers = {
  experience: Experience;
  brand: string;
  manualBrand: string;
  product: string;
  manualProduct: string;
  formula: string;
  manualFormula: string;
  shade: string;
  manualShade: string;
  depth: number | "unsure" | null;
  undertone: Undertone | null;
  olive: "yes" | "no" | "unsure" | null;
  skinType: string;
  finish: string;
  budget: string;
  categories: string[];
};

const INITIAL: Answers = {
  experience: "", brand: "", manualBrand: "", product: "", manualProduct: "", formula: "", manualFormula: "", shade: "", manualShade: "", depth: null, undertone: null,
  olive: null, skinType: "", finish: "", budget: "", categories: [],
};

const COMPLEXION_CATEGORIES = new Set(["Foundation", "Skin tint", "Concealer"]);
const COMPLEXION_PRODUCTS = SAMPLE_PRODUCTS.filter((product) => COMPLEXION_CATEGORIES.has(product.category));
const ILLUSTRATIVE_FORMULA_OPTIONS = [
  { value: "illustrative-variant-a", label: "Illustrative formula / variant A" },
  { value: "illustrative-variant-b", label: "Illustrative formula / variant B" },
];
const ILLUSTRATIVE_SHADE_OPTIONS = [
  { value: "illustrative-shade-a", label: "Shade example A · unverified" },
  { value: "illustrative-shade-b", label: "Shade example B · unverified" },
];

const CHOICES: { value: Experience; detail: string }[] = [
  { value: "A good match", detail: "Something you feel at home in" },
  { value: "A little light", detail: "The depth feels slightly too light" },
  { value: "A little deep", detail: "The depth feels slightly too deep" },
  { value: "Too pink", detail: "The undertone does not feel right" },
  { value: "Too yellow", detail: "The undertone does not feel right" },
  { value: "None yet", detail: "No current match, or still exploring" },
  { value: "Not sure yet", detail: "A good place to start, too" },
];

const STEPS = ["A shade you know", "Skin depth", "Undertone", "Formula", "Makeup you love"];

function Selectable({ title, description, selected, onClick }: {
  title: string; description?: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button type="button" className={`wj-selectable${selected ? " is-selected" : ""}`} aria-pressed={selected} onClick={onClick}>
      <span><strong>{title}</strong>{description && <small>{description}</small>}</span>
      <i aria-hidden="true">{selected && <Check size={14} />}</i>
    </button>
  );
}

export function QuizFlow({
  onComplete,
  onCancel,
  onLearn,
}: {
  onComplete: (profile: Profile) => void;
  onCancel: () => void;
  onLearn: () => void;
}) {
  const [step, setStep] = useState(() => {
    const previewStep = Number(new URLSearchParams(window.location.search).get("step"));
    return Number.isInteger(previewStep) && previewStep >= 0 && previewStep <= 6 ? previewStep : 0;
  });
  const [answers, setAnswers] = useState<Answers>(() => new URLSearchParams(window.location.search).get("sampleEntry") === "1"
    ? {
      ...INITIAL,
      experience: "A good match",
      brand: "Fenty Beauty",
      product: "skin-tint-note",
      formula: ILLUSTRATIVE_FORMULA_OPTIONS[0].value,
      shade: ILLUSTRATIVE_SHADE_OPTIONS[0].value,
    }
    : INITIAL);
  const [error, setError] = useState("");
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError("");
  };
  const toggleCategory = (value: string) => set("categories", answers.categories.includes(value) ? answers.categories.filter((item) => item !== value) : [...answers.categories, value]);
  const changeExperience = (value: Experience) => {
    setAnswers((current) => ({
      ...current,
      experience: value,
      ...(value === "None yet" || value === "Not sure yet"
        ? { brand: "", manualBrand: "", product: "", manualProduct: "", formula: "", manualFormula: "", shade: "", manualShade: "" }
        : {}),
    }));
    setError("");
  };
  const changeBrand = (value: string) => setAnswers((current) => ({
    ...current, brand: value, manualBrand: "", product: "", manualProduct: "",
    formula: "", manualFormula: "", shade: "", manualShade: "",
  }));
  const changeProduct = (value: string) => setAnswers((current) => ({
    ...current, product: value, manualProduct: "", formula: "", manualFormula: "", shade: "", manualShade: "",
  }));
  const changeFormula = (value: string) => setAnswers((current) => ({
    ...current, formula: value, manualFormula: "", shade: "", manualShade: "",
  }));
  const createShadeEvidence = (): ShadeEvidence | null => {
    if (!answers.experience || answers.experience === "None yet" || answers.experience === "Not sure yet") return null;
    const manual = answers.brand === "other" || answers.product === "other" || answers.formula === "other" || answers.shade === "manual";
    const brand = answers.brand === "other"
      ? answers.manualBrand.trim() || "Brand not entered"
      : answers.brand === "unsure" ? "Not sure yet" : answers.brand;
    const chosenProduct = COMPLEXION_PRODUCTS.find((item) => item.id === answers.product);
    const product = answers.product === "other"
      ? answers.manualProduct.trim() || "Product not entered"
      : answers.product === "unsure" ? "Not sure yet" : chosenProduct?.name ?? "";
    const formula = answers.formula === "other"
      ? answers.manualFormula.trim() || "Formula or variant not entered"
      : answers.formula === "unsure" ? "Not sure yet"
        : ILLUSTRATIVE_FORMULA_OPTIONS.find((item) => item.value === answers.formula)?.label ?? "";
    const shade = answers.shade === "manual"
      ? answers.manualShade.trim() || "Shade name not entered"
      : answers.shade === "unsure" ? "Not sure yet"
        : ILLUSTRATIVE_SHADE_OPTIONS.find((item) => item.value === answers.shade)?.label ?? "";
    if (![brand, product, formula, shade].some(Boolean)) return null;
    return { brand, product, formula, shade, source: manual ? "manual" : "illustrative" };
  };
  const shadeEvidenceSummary = () => {
    if (answers.experience === "None yet") return "None yet";
    if (answers.experience === "Not sure yet") return "Not sure yet";
    const evidence = createShadeEvidence();
    return evidence ? [evidence.brand, evidence.product, evidence.formula, evidence.shade].filter(Boolean).join(" · ") : "No product notes added";
  };
  const next = () => {
    if (step === 1 && !answers.experience) return setError("Choose an answer, or choose “None yet.”");
    if (step === 2 && answers.depth === null) return setError("Choose a depth or “I’m not sure yet.”");
    if (step === 3 && (!answers.undertone || !answers.olive)) return setError("Choose an undertone and an olive-cast response. Unsure is a valid choice.");
    if (step === 5 && !answers.categories.length) return setError("Choose at least one product category, or select All makeup.");
    setError("");
    setStep((current) => Math.min(6, current + 1));
  };
  const createProfile = (): Profile => ({
    ...DEFAULT_PROFILE,
    depth: typeof answers.depth === "number" ? answers.depth : null,
    undertone: answers.undertone,
    olive: answers.olive === "yes" ? true : answers.olive === "no" ? false : null,
    skinType: answers.skinType || null,
    categories: answers.categories,
    shadeEvidence: createShadeEvidence(),
  });
  const sendResult = () => {
    if (!answers.categories.length) return setError("Return to category selection and choose at least one.");
    onComplete(createProfile());
  };
  const changeScreen = (value: number) => { setError(""); setStep(value); };

  return (
    <main className="wj-quiz-frame" aria-labelledby="wj-quiz-title">
      {step > 0 && step < 6 ? (
        <div className="wj-quiz-progress">
          <div className="wj-progress-track"><i style={{ width: `${(step / 5) * 100}%` }} /></div>
          <div className="wj-progress-label"><span>YOUR SHADE STORY</span><span>STEP {String(step).padStart(2, "0")} / 05</span></div>
          <nav aria-label="Quiz progress">{STEPS.map((label, index) => (
            <button type="button" key={label} className={`${step === index + 1 ? "is-current" : ""} ${step > index + 1 ? "is-done" : ""}`} aria-current={step === index + 1 ? "step" : undefined} onClick={() => step > index + 1 && changeScreen(index + 1)}><i>{step > index + 1 ? <Check size={11} /> : `0${index + 1}`}</i><span>{label}</span></button>
          ))}</nav>
        </div>
      ) : null}

      {step === 0 && (
        <section className="wj-quiz-start">
          <div className="wj-quiz-start-main">
            <Eyebrow>YOUR MAKEUP, YOUR STARTING POINT</Eyebrow>
            <h1 id="wj-quiz-title">Find what <em>feels like you.</em></h1>
            <p>Tell us a little about a shade you know, how your skin looks to you, and the makeup you want to explore. You can be certain, unsure, or a little bit of both.</p>
            <button type="button" className="wj-primary" onClick={next}>Start my skin profile <ArrowRight size={15} /></button>
            <span className="wj-quiz-time">A few questions. Skip what you do not know.</span>
          </div>
          <aside><span className="wj-quiz-rings" aria-hidden="true" /><Sparkles size={17} /><strong>Not a diagnosis.</strong><p>Just a starting point you can change. No selfie or account needed.</p><button type="button" onClick={onLearn}>Learn what undertone means <ArrowRight size={13} /></button></aside>
        </section>
      )}

      {step > 0 && step < 6 && (
        <section className="wj-quiz-question">
          <div className="wj-quiz-question-copy">
            <span className="wj-quiz-kicker">{STEPS[step - 1].toUpperCase()}</span>
            {step === 1 && <><h1 id="wj-quiz-title">Is there a shade you <em>already know?</em></h1><p>An everyday foundation, skin tint or concealer can offer a useful clue. No perfect match is required.</p></>}
            {step === 2 && <><h1 id="wj-quiz-title">Where does your skin <em>feel like it sits?</em></h1><p>Depth is how light or deep your complexion reads. It is not a measure of who you are.</p></>}
            {step === 3 && <><h1 id="wj-quiz-title">What undertone <em>feels closest?</em></h1><p>Warm, cool and neutral are ways to describe a subtle color tendency. No right answer is required.</p></>}
            {step === 4 && <><h1 id="wj-quiz-title">What feels good <em>on your skin?</em></h1><p>These personal preferences are all optional. Skin type is not a medical label.</p></>}
            {step === 5 && <><h1 id="wj-quiz-title">What would you love to <em>find?</em></h1><p>Choose all the categories that make you curious. You can change your picks later.</p></>}
          </div>

          {step === 1 && (
            <>
              <div className="wj-quiz-choice-grid">{CHOICES.map(({ value, detail }) => <Selectable key={value} title={value} description={detail} selected={answers.experience === value} onClick={() => changeExperience(value)} />)}</div>
              {answers.experience && answers.experience !== "None yet" && answers.experience !== "Not sure yet" && <div className="wj-known-shade">
                <div className="wj-known-shade-notice"><Info size={15} /><span><strong>Example options, not a verified shade catalog.</strong> Product labels are examples. Formula variants and shade choices below are illustrative and unverified.</span></div>
                <label><span>Brand</span><select value={answers.brand} onChange={(event) => changeBrand(event.target.value)}>
                  <option value="">Choose a brand or skip</option>
                  {[...new Set(COMPLEXION_PRODUCTS.map((product) => product.brand))].map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                  <option value="other">Other / not listed</option>
                  <option value="unsure">Not sure yet</option>
                </select></label>
                {answers.brand === "other" && <label><span>Brand name (optional)</span><input value={answers.manualBrand} onChange={(event) => set("manualBrand", event.target.value)} placeholder="Enter your brand" /></label>}
                <label><span>Exact product or line</span><select value={answers.product} disabled={!answers.brand} onChange={(event) => changeProduct(event.target.value)}>
                  <option value="">{answers.brand ? "Choose a product or skip" : "Choose a brand first"}</option>
                  {COMPLEXION_PRODUCTS.filter((item) => item.brand === answers.brand).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  {!!answers.brand && <><option value="other">Product not listed</option><option value="unsure">Not sure yet</option></>}
                </select></label>
                {answers.product === "other" && <label><span>Product name (optional)</span><input value={answers.manualProduct} onChange={(event) => set("manualProduct", event.target.value)} placeholder="Enter the name on your product" /></label>}
                <label><span>Formula or product variant</span><select value={answers.formula} disabled={!answers.product} onChange={(event) => changeFormula(event.target.value)}>
                  <option value="">{answers.product ? "Choose an example variant or skip" : "Choose a product first"}</option>
                  {answers.product && answers.product !== "other" && answers.product !== "unsure" && ILLUSTRATIVE_FORMULA_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label} · unverified</option>)}
                  {!!answers.product && <><option value="other">Formula / variant not listed</option><option value="unsure">Not sure yet</option></>}
                </select></label>
                {answers.formula === "other" && <label><span>Formula or variant name (optional)</span><input value={answers.manualFormula} onChange={(event) => set("manualFormula", event.target.value)} placeholder="Enter a label from the product" /></label>}
                <label><span>Shade name or example</span><select value={answers.shade} disabled={!answers.formula} onChange={(event) => { setAnswers((current) => ({ ...current, shade: event.target.value, manualShade: "" })); setError(""); }}>
                  <option value="">{answers.formula ? "Choose an example or skip" : "Choose a formula first"}</option>
                  {answers.formula && answers.formula !== "other" && answers.formula !== "unsure" && ILLUSTRATIVE_SHADE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  {!!answers.formula && <><option value="manual">I can't find mine · enter it</option><option value="unsure">Not sure yet</option></>}
                </select></label>
                {answers.shade === "manual" && <label className="wj-known-shade-manual"><span>Your shade name (unverified)</span><input value={answers.manualShade} onChange={(event) => set("manualShade", event.target.value)} placeholder="Type the name on your product" /></label>}
              </div>}
            </>
          )}

          {step === 2 && <><div className="wj-depth-picker" role="group" aria-label="Choose a skin depth">{DEPTHS.map((item) => <button type="button" aria-pressed={answers.depth === item.number} key={item.number} className={answers.depth === item.number ? "is-selected" : ""} onClick={() => set("depth", item.number)}><span style={{ backgroundColor: item.color }}>{answers.depth === item.number && <Check size={15} />}</span><strong>{item.label}</strong><small>{String(item.number).padStart(2, "0")}</small></button>)}</div><button className={`wj-unsure-button${answers.depth === "unsure" ? " is-selected" : ""}`} type="button" aria-pressed={answers.depth === "unsure"} onClick={() => set("depth", "unsure")}><CircleHelp size={16} /> I'm not sure yet</button><p className="wj-quiz-footnote"><Info size={14} /> Screen color and daylight both vary. You can change this whenever you like.</p></>}

          {step === 3 && <><div className="wj-undertone-picker" role="group" aria-label="Choose your undertone">{(["Warm", "Cool", "Neutral", "Still exploring"] as Undertone[]).map((value, index) => <Selectable key={value} title={value} description={["Golden, peach or yellow", "Rosy, pink or blue", "A balance of tendencies", "No need to decide"][index]} selected={answers.undertone === value} onClick={() => set("undertone", value)} />)}</div><div className="wj-olive-field"><div><strong>Do you notice an olive cast?</strong><p>Olive can sit alongside warm, cool or neutral.</p></div><div role="group" aria-label="Olive cast">{(["yes", "no", "unsure"] as const).map((value) => <button key={value} className={answers.olive === value ? "is-selected" : ""} type="button" aria-pressed={answers.olive === value} onClick={() => set("olive", value)}>{value === "yes" ? "Yes" : value === "no" ? "No" : "Not sure"}</button>)}</div></div><p className="wj-quiz-footnote"><Lightbulb size={14} /> Veins, jewelry and sun response are weak clues, not reliable tests.</p></>}

          {step === 4 && <div className="wj-preference-fields">{[
            { name: "skinType", legend: "Skin type", options: ["Dry", "Oily", "Combination", "Normal", "Sensitive", "Not sure"] },
            { name: "finish", legend: "Finish", options: ["Natural", "Soft matte", "Dewy", "No preference"] },
            { name: "budget", legend: "Price range", options: ["Drugstore", "Mid-range", "Prestige", "Any price"] },
          ].map((group) => <fieldset key={group.name}><legend>{group.legend} <span>OPTIONAL</span></legend><div>{group.options.map((value) => <button key={value} className={answers[group.name as "skinType" | "finish" | "budget"] === value ? "is-selected" : ""} type="button" aria-pressed={answers[group.name as "skinType" | "finish" | "budget"] === value} onClick={() => set(group.name as "skinType" | "finish" | "budget", answers[group.name as "skinType" | "finish" | "budget"] === value ? "" : value)}>{value}</button>)}</div></fieldset>)}<p className="wj-quiz-footnote">Skip all of these to keep your profile open-ended.</p></div>}

          {step === 5 && <><div className="wj-category-picker"><fieldset><legend>MAKEUP I WANT TO EXPLORE</legend>{CATEGORIES.filter((item) => item !== "All makeup").map((category) => <button key={category} className={answers.categories.includes(category) ? "is-selected" : ""} type="button" aria-pressed={answers.categories.includes(category)} onClick={() => toggleCategory(category)}>{category}{answers.categories.includes(category) && <Check size={13} />}</button>)}</fieldset><button type="button" className={answers.categories.includes("All makeup") ? "wj-category-all is-selected" : "wj-category-all"} aria-pressed={answers.categories.includes("All makeup")} onClick={() => set("categories", answers.categories.includes("All makeup") ? [] : ["All makeup"])}>All makeup</button></div></>}

          {error && <p className="wj-form-error" role="alert">{error}</p>}
          <div className="wj-quiz-navigation">
            <button type="button" className="wj-text-action" onClick={() => step === 1 ? changeScreen(0) : changeScreen(step - 1)}><ArrowLeft size={15} /> Back</button>
            {step === 4 && <button className="wj-text-action" type="button" onClick={() => setStep(5)}>Skip preferences <ArrowRight size={14} /></button>}
            <button type="button" className="wj-primary" onClick={() => step === 5 ? next() : next()}>{step === 5 ? "Review my starting point" : "Continue"} <ArrowRight size={15} /></button>
          </div>
        </section>
      )}

      {step === 6 && <section className="wj-quiz-review">
        <Eyebrow>A PROFILE YOU CAN CHANGE</Eyebrow>
        <h1 id="wj-quiz-title">Your starting point, <em>your call.</em></h1>
        <p>Review your answers, then choose where you want to go next.</p>
        <div className="wj-answer-list">
          <AnswerSummary label="Shade notes · unverified" value={shadeEvidenceSummary()} onEdit={() => changeScreen(1)} />
          <AnswerSummary label="Skin depth" value={typeof answers.depth === "number" ? `Depth ${answers.depth} · ${DEPTHS[answers.depth - 1].label}` : "Still exploring"} onEdit={() => changeScreen(2)} />
          <AnswerSummary label="Undertone" value={`${answers.undertone || "Still exploring"}${answers.olive === "yes" ? " · olive cast" : ""}`} onEdit={() => changeScreen(3)} />
          <AnswerSummary label="Your preferences" value={[answers.skinType, answers.finish, answers.budget].filter(Boolean).join(" · ") || "Left open"} onEdit={() => changeScreen(4)} />
          <AnswerSummary label="Your categories" value={answers.categories.join(", ") || "Not chosen"} onEdit={() => changeScreen(5)} />
        </div>
        <div className="wj-privacy-callout"><Info size={16} /><p>This prototype does not save or send your answers. A real product would keep an anonymous draft only with clear notice and let you delete it.</p></div>
        {error && <p className="wj-form-error" role="alert">{error}</p>}
        <div className="wj-quiz-navigation"><button className="wj-text-action" type="button" onClick={() => changeScreen(5)}><ArrowLeft size={15} />Edit answers</button><button className="wj-primary" type="button" onClick={sendResult}>See my starting point <ArrowRight size={15} /></button></div>
      </section>}

      {step > 0 && <button className="wj-quiz-exit" type="button" onClick={onCancel}>Leave this preview</button>}
    </main>
  );
}

function AnswerSummary({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return <div className="wj-answer-row"><span>{label}</span><strong>{value}</strong><button type="button" onClick={onEdit}>Edit</button></div>;
}

export function ResultsPage({ profile, onNavigate }: { profile: Profile; onNavigate: (page: NeuPage) => void }) {
  const depth = profile.depth === null ? null : DEPTHS[profile.depth - 1];
  return (
    <main className="wj-content wj-narrow-content">
      <Eyebrow>A first step, not a final answer</Eyebrow>
      <div className="wj-results-heading"><h1>Your shade story <em>starts here.</em></h1><p>A few clues create a place to begin. Your skin and style do not need a score to deserve discovery.</p></div>
      <div className="wj-results-profile">
        <div><span>SKIN DEPTH</span><strong>{depth ? `Depth ${profile.depth} · ${depth.label}` : "Still exploring"}</strong></div>
        <div><span>UNDERTONE</span><strong>{profile.undertone || "Still exploring"}{profile.olive ? " · olive cast" : ""}</strong></div>
        <div><span>YOUR CATEGORIES</span><strong>{profile.categories.join(", ") || "Explore everything"}</strong></div>
      </div>
      {profile.shadeEvidence && <section className="wj-shade-evidence" aria-label="Unverified shade notes">
        <div className="wj-shade-evidence-heading"><Eyebrow>OPTIONAL WEARER EVIDENCE · NOT A MATCH</Eyebrow><h2>A shade you already use.</h2><p>A personal starting clue only. It does not determine depth, undertone or a product match.</p></div>
        <dl>
          <div><dt>Brand</dt><dd>{profile.shadeEvidence.brand || "Not added"}</dd></div>
          <div><dt>Product or line</dt><dd>{profile.shadeEvidence.product || "Not added"}</dd></div>
          <div><dt>Formula or variant</dt><dd>{profile.shadeEvidence.formula || "Not added"}</dd></div>
          <div><dt>Shade</dt><dd>{profile.shadeEvidence.shade || "Not added"}</dd></div>
        </dl>
        <p className="wj-shade-evidence-source">{profile.shadeEvidence.source === "manual" ? "Manually entered by the wearer, unverified." : "Illustrative option only, unverified and not a real shade record."}</p>
      </section>}
      <div className="wj-no-match-card"><Sparkles size={20} /><div><strong>No exact shade claims here.</strong><p>The example catalog is not a verified source and community recommendations are not connected. Neu will not invent your matches.</p></div></div>
      <section className="wj-results-next">
        <h2>Your next step can be a little discovery.</h2>
        <p>Browse an explicitly illustrative product list, read the public color guide or adjust what you chose.</p>
        <div><button type="button" className="wj-primary" onClick={() => onNavigate("discover")}>Browse product examples <ArrowRight size={15} /></button><button type="button" className="wj-secondary" onClick={() => onNavigate("learn")}>Learn about color <ArrowRight size={15} /></button><button type="button" className="wj-text-action" onClick={() => onNavigate("profile")}>Edit my profile</button></div>
      </section>
    </main>
  );
}
