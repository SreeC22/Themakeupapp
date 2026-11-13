import { Button } from "@workspace/neu-design-system/components/neu/button";
import { ToneSwatch } from "@workspace/neu-design-system/components/neu/tone-swatch";
import { DEPTH_GROUPS, QUIZ_SWATCHES, type QuizDraft } from "../quiz/_shared/quizDraft";
import { Disclosure, Options } from "./Controls";

export function DepthPalette({ draft, onChange }: { draft: QuizDraft; onChange: (patch: Partial<QuizDraft>) => void }) {
  const selected = QUIZ_SWATCHES.find((item) => item.id === draft.shadeId);
  return <>
    <div className="wj-quiz-depth-groups">{DEPTH_GROUPS.map((group, groupIndex) => <div key={group} className="wj-quiz-depth-row" role="group" aria-label={`${group} skin depth`}>
      <span className="wj-depth-group-label">{group}</span>
      <div className="wj-quiz-swatch-grid">{QUIZ_SWATCHES.slice(groupIndex * 5, groupIndex * 5 + 5).map((shade) =>
        <ToneSwatch key={shade.id} label={`${shade.label}, swatch ${shade.number} of 40`} color={shade.color} selected={draft.shadeId === shade.id} onClick={() => onChange({ shadeId: shade.id, depthUnsure: false })} />
      )}</div>
    </div>)}</div>
    <p className="mvp-muted" role="status" data-testid="text-selected-depth">{selected ? `${selected.label} · ${selected.id}` : draft.depthUnsure ? "Still exploring depth" : "No depth chosen"}</p>
    <Button variant="text" aria-pressed={draft.depthUnsure} onClick={() => onChange({ shadeId: null, depthUnsure: true })}>I'm not sure yet</Button>
    <p className="mvp-muted">40 approximate on-screen swatches, not a measurement, licensed color scale or exact product match. Screens and lighting change color.</p>
  </>;
}

export function ColoringFields({ draft, onChange }: { draft: QuizDraft; onChange: (patch: Partial<QuizDraft>) => void }) {
  return <>
    <Options label="Undertone (optional)" options={["Warm", "Cool", "Neutral", "Olive", "Still exploring"]} value={draft.undertone ?? ""} onChange={(value) => {
      const undertone = draft.undertone === value ? null : value as QuizDraft["undertone"];
      onChange({ undertone, ...(undertone === "Olive" ? { olive: "yes" } : { olive: null, oliveSubtype: "" }) });
    }} hint="Your impression, not a test. Olive is not automatically warm." />
    {(draft.undertone === "Olive" || draft.olive === "yes" || draft.olive === "maybe") && <Options label="Olive temperature (optional)" options={["Warm-olive", "Cool-olive", "Neutral-olive", "Not sure"]} value={draft.oliveSubtype ?? ""} onChange={(value) => onChange({ oliveSubtype: draft.oliveSubtype === value ? "" : value })} />}
    <Disclosure title="Saturation and olive cast (optional)">
      <Options label="Saturation" options={["Muted", "Balanced", "Bright / saturated", "Not sure"]} value={draft.saturation ?? ""} onChange={(value) => onChange({ saturation: draft.saturation === value ? "" : value })} hint="Softer or clearer coloring, separate from depth. Leave it open if unsure." />
      {draft.undertone !== "Olive" && <Options label="Olive cast" options={["Yes", "Possibly", "No", "Not sure"]} value={draft.olive === "yes" ? "Yes" : draft.olive === "maybe" ? "Possibly" : draft.olive === "no" ? "No" : draft.olive === "unsure" ? "Not sure" : ""} onChange={(value) => {
        const olive = ({ Yes: "yes", Possibly: "maybe", No: "no", "Not sure": "unsure" } as const)[value as "Yes" | "Possibly" | "No" | "Not sure"];
        onChange({ olive, ...(olive === "no" || olive === "unsure" ? { oliveSubtype: "" } : {}) });
      }} />}
    </Disclosure>
  </>;
}

export function SkinTypeField({ draft, onChange }: { draft: QuizDraft; onChange: (patch: Partial<QuizDraft>) => void }) {
  return <>
    <Options label="Skin type" options={["Oily", "Dry", "Combination", "Skip for now"]} value={draft.skinType || "Skip for now"} onChange={(value) => onChange({ skinType: value === "Skip for now" ? "" : draft.skinType === value ? "" : value })} hint="Self-described, not a diagnosis or a promise of formula suitability." />
    {draft.skinType && !["Oily", "Dry", "Combination"].includes(draft.skinType) && <p className="mvp-muted">Your earlier “{draft.skinType}” answer is preserved. Choose another option only if you want to change it.</p>}
  </>;
}
