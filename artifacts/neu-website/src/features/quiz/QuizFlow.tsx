import { useEffect, type ReactNode } from "react";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { Navigation } from "@workspace/neu-design-system/components/neu/navigation";
import { ToneSwatch } from "@workspace/neu-design-system/components/neu/tone-swatch";
import { DEPTH_GROUPS, QUIZ_SWATCHES, type CurrentProductType, type ProductMatch, type QuizDraft, type QuizProduct, type QuizStep } from "./_shared/quizDraft";
import { LAUNCH_CATEGORIES, RESEARCH_PRODUCTS } from "../mvp/catalog";
import { Disclosure, Options, toggleItem } from "../mvp/Controls";
import { Preferences } from "../mvp/Preferences";

const QUESTION_STEPS: QuizStep[] = ["depth", "undertone", "categories", "products"];
const STEP_LABELS = ["Your depth", "Your coloring", "Your interests", "Your experience"];
const PRODUCT_TYPES: CurrentProductType[] = ["Foundation", "Concealer", "Skin tint", "BB or CC cream"];
const MATCHES: ProductMatch[] = ["Blends in perfectly", "A little too light", "A little too dark", "Too orange", "Too pink", "Too yellow", "Gray or ashy", "Changes color after application", "Not sure yet"];
const BRANDS = [...new Set(RESEARCH_PRODUCTS.map((product) => product.brandName))];

export function toggleProductMatch(current: ProductMatch[], value: ProductMatch): ProductMatch[] {
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (value === "Blends in perfectly" || value === "Not sure yet") return [value];
  const exclusive = value === "A little too light" ? "A little too dark" : value === "A little too dark" ? "A little too light" : null;
  return [...current.filter((item) => item !== "Blends in perfectly" && item !== "Not sure yet" && item !== exclusive), value];
}

function ProductRow({ product, index, onChange, onRemove }: {
  product: QuizProduct; index: number; onChange: (patch: Partial<QuizProduct>) => void; onRemove: () => void;
}) {
  const suggestions = RESEARCH_PRODUCTS.filter((item) => item.brandName.toLowerCase() === product.brand.trim().toLowerCase()).map((item) => item.name);
  return <article className="wj-quiz-product-row">
    <div className="mvp-row"><strong>Prior product {index + 1}</strong><Button variant="text" onClick={onRemove} aria-label={`Remove prior product ${index + 1}`}>Remove</Button></div>
    <Options label="Prior product type" options={PRODUCT_TYPES} value={product.type} onChange={(type) => onChange({ type: type as CurrentProductType })} />
    <Typeahead label="Brand (type any brand)" value={product.brand} placeholder="Brand name, if known" suggestions={BRANDS} suggestionTag="Historical listing" onChange={(brand) => onChange({ brand, brandUnknown: false })} />
    <Button variant="text" aria-pressed={product.brandUnknown} onClick={() => onChange({ brandUnknown: !product.brandUnknown, brand: "" })}>{product.brandUnknown ? "Brand marked unknown" : "I do not know the brand"}</Button>
    <Typeahead label="Product or line" value={product.product} placeholder="Type what you used" suggestions={suggestions} suggestionTag="Historical listing" onChange={(value) => onChange({ product: value })} />
    <Disclosure title="Shade, formula and personal observations">
      <Typeahead label="Formula or variant (self-reported)" value={product.formula} placeholder="If known" suggestions={[]} onChange={(formula) => onChange({ formula })} />
      <Typeahead label="Shade name or code (self-reported)" value={product.shade} placeholder="If known, not a verified variant" suggestions={[]} onChange={(shade) => onChange({ shade, shadeUnknown: false })} />
      <Button variant="text" aria-pressed={product.shadeUnknown} onClick={() => onChange({ shade: "", shadeUnknown: !product.shadeUnknown })}>{product.shadeUnknown ? "Shade marked unknown" : "I do not know the shade"}</Button>
      <Options label="What you noticed" multiple options={MATCHES} value={product.match} onChange={(match) => onChange({ match: toggleProductMatch(product.match, match as ProductMatch) })} hint="Your experience, not an official shade classification. Perfect blend and unsure stand alone; too light and too dark cannot combine." />
    </Disclosure>
  </article>;
}

export function QuizFlow({ draft, onDraftChange, onComplete, onLearn }: {
  draft: QuizDraft; onDraftChange: (draft: QuizDraft) => void; onComplete: () => void; onLearn: () => void;
}) {
  const step = draft.step === "review" ? "products" : draft.step;
  const index = Math.max(0, QUESTION_STEPS.indexOf(step));
  const change = (patch: Partial<QuizDraft>) => onDraftChange({ ...draft, ...patch });
  const setStep = (next: QuizStep) => {
    change({ step: next });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  useEffect(() => { document.getElementById("wj-quiz-title")?.focus({ preventScroll: true }); }, [step]);
  const advance = () => index === 3 ? onComplete() : setStep(QUESTION_STEPS[index + 1]);
  const selectedSwatch = QUIZ_SWATCHES.find((item) => item.id === draft.shadeId);
  const patchProduct = (id: string, patch: Partial<QuizProduct>) => change({ products: draft.products.map((product) => product.id === id ? { ...product, ...patch } : product) });
  const addProduct = () => change({
    products: [...draft.products, { id: `prior-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, type: "Foundation", brand: "", brandUnknown: false, product: "", formula: "", shade: "", shadeUnknown: false, match: [] }],
    noCurrentMakeup: false, newToMakeup: false, currentMakeupSkipped: false,
  });
  const nav = <Navigation hideBack={index === 0} onBack={() => setStep(QUESTION_STEPS[Math.max(0, index - 1)])} onContinue={advance} continueLabel={index === 3 ? "Explore my results" : "Continue"} />;

  return <div className="wj-quiz-frame wj-quiz-complete">
    <div className="wj-quiz-progress">
      <div className="wj-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={index + 1} aria-label={`Section ${index + 1} of 4`}><i style={{ transform: `scaleX(${(index + 1) / 4})`, width: "100%", transformOrigin: "left" }} /></div>
      <div className="wj-progress-label"><span>{STEP_LABELS[index]}</span><span>SECTION {index + 1} OF 4</span></div>
    </div>
    {step === "depth" && <section className="wj-quiz-question">
      <Question title={<>Find your <em>complexion.</em></>} copy="Which depth feels closest? Every answer is optional, and unsure is welcome." />
      <div className="wj-quiz-depth-groups">{DEPTH_GROUPS.map((group, groupIndex) => <div key={group} className="wj-quiz-depth-row" role="group" aria-label={`${group} skin depth`}>
        <span className="wj-depth-group-label">{group}</span>
        <div className="wj-quiz-swatch-grid">{QUIZ_SWATCHES.slice(groupIndex * 5, groupIndex * 5 + 5).map((shade) =>
          <ToneSwatch key={shade.id} label={`${shade.label}, swatch ${shade.number} of 40`} color={shade.color} selected={draft.shadeId === shade.id} onClick={() => change({ shadeId: shade.id, depthUnsure: false })} />
        )}</div>
      </div>)}</div>
      <div className="wj-depth-selected-preview" aria-live="polite">
        <strong>{selectedSwatch?.label ?? (draft.depthUnsure ? "Still exploring" : "No depth chosen")}</strong>
        {selectedSwatch && <small>{selectedSwatch.id}</small>}
      </div>
      <Button variant="text" aria-pressed={draft.depthUnsure} onClick={() => change({ shadeId: null, depthUnsure: !draft.depthUnsure })}>I’m not sure yet</Button>
      <p className="mvp-muted">40 approximate on-screen swatches, not a measurement, certified scale or exact product match. Screens and lighting change color.</p>
      {draft.products.length > 0 && <Disclosure title="Use a prior product as a personal reference">
        <Options label="Optional prior product reference" options={["None", ...draft.products.map((product, productIndex) => `${productIndex + 1}. ${product.brand || product.type}${product.shade ? ` · ${product.shade}` : ""}`)]}
          value={draft.referenceProductId ? (() => {
            const productIndex = draft.products.findIndex((product) => product.id === draft.referenceProductId);
            const product = draft.products[productIndex];
            return product ? `${productIndex + 1}. ${product.brand || product.type}${product.shade ? ` · ${product.shade}` : ""}` : "None";
          })() : "None"}
          onChange={(value) => {
            const productIndex = Number.parseInt(value, 10) - 1;
            change({ referenceProductId: Number.isInteger(productIndex) ? draft.products[productIndex]?.id ?? null : null });
          }} hint="A reminder of your own entry only. We do not infer a depth or shade match from it." />
      </Disclosure>}
      <Button variant="text" onClick={onLearn}>Learn about depth and color</Button>
      {nav}
    </section>}
    {step === "undertone" && <section className="wj-quiz-question">
      <Question title={<>How would you describe <em>your coloring?</em></>} copy="Your impression, not a test. You can leave all of this open." />
      <Options label="Undertone" options={["Warm", "Cool", "Neutral", "Olive", "Still exploring"]} value={draft.undertone ?? ""} onChange={(value) => change({
        undertone: draft.undertone === value ? null : value as QuizDraft["undertone"],
        ...(value === "Olive" ? { olive: "yes" as const } : {}),
      })} />
      {(draft.undertone === "Olive" || draft.olive === "yes" || draft.olive === "maybe") && <Disclosure title="Olive leaning (optional)">
        <Options label="Olive subtype" options={["Warm-olive", "Cool-olive", "Neutral-olive", "Not sure"]} value={draft.oliveSubtype ?? ""} onChange={(value) => change({ oliveSubtype: draft.oliveSubtype === value ? "" : value })} hint="Olive is not automatically warm." />
      </Disclosure>}
      <Disclosure title="Saturation, skin type and olive cast">
        <Options label="Saturation" options={["Muted", "Balanced", "Bright / saturated", "Not sure"]} value={draft.saturation ?? ""} onChange={(value) => change({ saturation: draft.saturation === value ? "" : value })} hint="Muted can feel softer or grayer; bright can feel clearer. This does not describe how light or deep your skin is." />
        <Options label="Skin type (self-described)" options={["Dry", "Oily", "Combination", "Normal", "Not sure"]} value={draft.skinType} onChange={(value) => change({ skinType: draft.skinType === value ? "" : value })} />
        {draft.skinType === "Sensitive" && <p className="mvp-muted">Your earlier “Sensitive” entry is preserved. Sensitivity is now a separate optional preference. Choose a skin type only if you want to change this saved answer.</p>}
        {draft.undertone !== "Olive" && <Options label="Olive cast, separate from temperature" options={["Yes", "Possibly", "No", "Not sure"]} value={draft.olive === "yes" ? "Yes" : draft.olive === "maybe" ? "Possibly" : draft.olive === "no" ? "No" : draft.olive === "unsure" ? "Not sure" : ""} onChange={(value) => {
          const olive = ({ Yes: "yes", Possibly: "maybe", No: "no", "Not sure": "unsure" } as const)[value as "Yes" | "Possibly" | "No" | "Not sure"];
          change({ olive: draft.olive === olive ? null : olive });
        }} />}
      </Disclosure>
      <Button variant="text" onClick={onLearn}>Open the color guide, keep my place</Button>
      {nav}
    </section>}
    {step === "categories" && <section className="wj-quiz-question">
      <Question title={<>What would you like to <em>explore?</em></>} copy="Choose any of our four launch categories, or leave open to browse all four." />
      <Options label="Shopping needs" multiple options={LAUNCH_CATEGORIES} value={draft.categories} onChange={(value) => change({ categories: toggleItem(draft.categories, value) })} />
      <Disclosure title="Concealer intent and natural lip color">
        <Options label="Concealer intent" multiple options={["Spot concealing", "Under-eye brightening", "Color correcting", "Not sure"]} value={draft.concealerIntent ?? []} onChange={(value) => change({ concealerIntent: toggleItem(draft.concealerIntent ?? [], value) })} hint="These are different goals. We do not apply a universal 'shades lighter' rule." />
        <Options label="Natural lip pigmentation" options={["Even", "Two-toned", "Upper lip darker", "Lower lip darker", "Darker outline", "Overall pigmented", "Not sure"]} value={draft.lipPigmentation ?? ""} onChange={(value) => change({ lipPigmentation: draft.lipPigmentation === value ? "" : value })} />
        <Options label="Lip opacity goal" options={["Sheer / natural", "Opaque / even", "Flexible", "Not sure"]} value={draft.lipOpacity ?? ""} onChange={(value) => change({ lipOpacity: draft.lipOpacity === value ? "" : value })} hint="Sheer color may look different on upper and lower lips. No product in this library has verified opacity evidence." />
      </Disclosure>
      <Disclosure title="Budget, finish and more optional preferences"><Preferences draft={draft} onChange={change} /></Disclosure>
      {nav}
    </section>}
    {step === "products" && <section className="wj-quiz-question">
      <Question title={<>Anything you have <em>already tried?</em></>} copy="Optional. Type prior complexion products in your own words, or go straight to results." />
      {draft.products.length === 0 && <Options label="Your experience (optional)" options={["No current makeup", "New to makeup", "Skip prior products"]} value={draft.noCurrentMakeup ? "No current makeup" : draft.newToMakeup ? "New to makeup" : draft.currentMakeupSkipped ? "Skip prior products" : ""} onChange={(value) => change({
        noCurrentMakeup: value === "No current makeup" && !draft.noCurrentMakeup,
        newToMakeup: value === "New to makeup" && !draft.newToMakeup,
        currentMakeupSkipped: value === "Skip prior products" && !draft.currentMakeupSkipped,
      })} />}
      {draft.products.map((product, productIndex) => <ProductRow key={product.id} product={product} index={productIndex} onChange={(patch) => patchProduct(product.id, patch)} onRemove={() => change({ products: draft.products.filter((item) => item.id !== product.id), referenceProductId: draft.referenceProductId === product.id ? null : draft.referenceProductId })} />)}
      <Button variant="secondary" onClick={addProduct} disabled={draft.products.length >= 20}>Add a prior product</Button>
      {draft.products.length >= 20 && <p className="mvp-muted">This local consultation keeps up to 20 prior product notes. Remove one to add another.</p>}
      <p className="mvp-muted">Personal notes are not verified product facts. Your answers stay in this browser when local storage is available, never in a cloud account.</p>
      {nav}
    </section>}
  </div>;
}

function Question({ title, copy }: { title: ReactNode; copy: string }) {
  return <div className="wj-quiz-question-copy"><h1 id="wj-quiz-title" tabIndex={-1}>{title}</h1><p>{copy}</p></div>;
}
