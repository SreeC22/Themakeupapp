import { Options, toggleItem } from "./Controls";
import { categoryPreference } from "./neu-profile";
import type { CategoryPreference, QuizDraft } from "../quiz/_shared/quizDraft";
import type { LaunchCategory } from "./catalog";

export function CategoryPreferences({ category, draft, onChange }: { category: LaunchCategory; draft: QuizDraft; onChange: (draft: QuizDraft) => void }) {
  const preference = categoryPreference(draft, category);
  const set = (key: keyof CategoryPreference, value: string) => onChange({
    ...draft,
    categoryPreferences: { ...draft.categoryPreferences, [category]: { ...preference, [key]: preference[key] === value ? "" : value } },
  });
  return <div className="mvp-stack">
    <p className="mvp-muted">Saved for {category.toLowerCase()} only. Unknown product traits stay unknown rather than being treated as a fit.</p>
    {(category === "Foundation" || category === "Lips") && <Options label={`${category} coverage`} options={["Sheer", "Medium", "Full", "No preference"]} value={preference.coverage ?? ""} onChange={(value) => set("coverage", value)} />}
    {category !== "Concealer" && <Options label={`${category} finish`} options={category === "Lips" ? ["Natural", "Dewy", "Matte", "Satin", "Velvet", "Glossy", "No preference"] : ["Natural", "Dewy", "Matte", "Satin", "No preference"]} value={preference.finish ?? ""} onChange={(value) => set("finish", value)} />}
    {category === "Concealer" && <Options label="Concealer purpose" options={["Spot concealing", "Under-eye brightening", "Color correcting", "Not sure"]} value={preference.intent ?? ""} onChange={(value) => set("intent", value)} hint="A brightening goal is not a universal rule to go shades lighter. Color correction needs specific evidence." />}
    {category === "Blush" && <Options label="Blush formula" options={["Cream", "Liquid", "Powder", "No preference"]} value={preference.formula ?? ""} onChange={(value) => set("formula", value)} />}
    {category === "Lips" && <>
      <Options label="Lip formula, optional" options={["Lipstick", "Liner", "Gloss", "Oil", "Tint / stain", "No preference"]} value={preference.formula ?? ""} onChange={value => set("formula", value)} hint="A requested formula is not proof that a product is labeled for that subtype." />
      <Options label="Natural lip pigmentation" options={["Even", "Two-toned", "Upper lip darker", "Lower lip darker", "Darker outline", "Overall pigmented", "Not sure"]} value={preference.pigmentation ?? ""} onChange={(value) => set("pigmentation", value)} />
      <Options label="Opacity goal" options={["Sheer / natural", "Opaque / even", "Flexible", "Not sure"]} value={preference.opacity ?? ""} onChange={(value) => set("opacity", value)} hint="Two-toned lips may show sheer color differently on each lip. Pigmentation is not a flaw to correct." />
    </>}
    {(category === "Blush" || category === "Lips") && <Options label={`${category} color families`} multiple options={category === "Lips" ? ["Rose", "Berry", "Peach", "Nude", "Coral", "Red", "Brown", "Mauve", "MLBB", "Statement", "Open to anything"] : ["Rose", "Berry", "Peach", "Nude", "Coral", "Red", "Brown", "Open to anything"]} value={preference.colorFamilies ?? []} onChange={value => {
      const current = preference.colorFamilies ?? [];
      const next = value === "Open to anything" ? current.includes(value) ? [] : [value] : toggleItem(current.filter(item => item !== "Open to anything"), value);
      if (next.length > 10) return;
      onChange({ ...draft, categoryPreferences: { ...draft.categoryPreferences, [category]: { ...preference, colorFamilies: next } } });
    }} hint="Color is self-expression, not an exact complexion match. Choose up to 10 directions, or stay open to anything." />}
  </div>;
}
