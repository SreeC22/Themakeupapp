import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import type { QuizDraft } from "../quiz/_shared/quizDraft";
import { Options, toggleItem } from "./Controls";
import { validBudget } from "./browse";

export function Preferences({ draft, onChange }: { draft: QuizDraft; onChange: (patch: Partial<QuizDraft>) => void }) {
  const single = (key: "finish" | "coverage" | "fragrancePreference" | "sensitivityPreference" | "applicationStyle" | "surfaceRedness") =>
    (value: string) => onChange({ [key]: draft[key] === value ? "" : value });
  const budgetValid = !draft.budget.trim() || validBudget(draft.budget);
  return <>
    <p className="mvp-muted">Optional preferences, not compatibility checks. This historical library has no verified prices, finish, coverage, ingredients or application evidence.</p>
    <Typeahead label="Maximum budget in US dollars (optional)" value={draft.budget} placeholder="For example, 30. Leave blank for flexible." suggestions={[]} onChange={(budget) => onChange({ budget })} />
    {!budgetValid && <p role="status" className="mvp-error">Enter a non-negative amount, or leave this open. Your answer will not limit browsing until it is a valid number.</p>}
    <Options label="Finish preference" options={["Natural", "Dewy", "Matte", "Satin", "No preference"]} value={draft.finish} onChange={single("finish")} />
    <Options label="Coverage preference" options={["Sheer", "Medium", "Full", "No preference"]} value={draft.coverage ?? ""} onChange={single("coverage")} />
    <Options label="Color families for blush or lips" multiple options={["Rose", "Berry", "Peach", "Nude", "Coral", "Red", "Brown", "Open to anything"]} value={draft.colorFamilies ?? []} onChange={(value) => onChange({ colorFamilies: toggleItem(draft.colorFamilies ?? [], value) })} />
    <Options label="Fragrance preference" options={["Prefer fragrance-free", "No preference", "Not sure"]} value={draft.fragrancePreference ?? ""} onChange={single("fragrancePreference")} />
    <Options label="Sensitivity preference (self-described)" options={["I consider my skin sensitive", "No preference", "Not sure"]} value={draft.sensitivityPreference ?? ""} onChange={single("sensitivityPreference")} hint="This is not a safety assessment or a promise that a product will suit your skin." />
    <Options label="Application style" options={["Fingers", "Brush", "Sponge", "Flexible", "Not sure"]} value={draft.applicationStyle ?? ""} onChange={single("applicationStyle")} />
    <Options label="Surface redness (optional observation)" options={["I notice surface redness", "I do not notice it", "Not sure"]} value={draft.surfaceRedness ?? ""} onChange={single("surfaceRedness")} hint="Your observation only. This is not a diagnosis and never determines undertone." />
  </>;
}
