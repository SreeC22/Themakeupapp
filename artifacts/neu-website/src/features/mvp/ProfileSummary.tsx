import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { QuizFlow } from "../quiz/QuizFlow";
import { QUIZ_SWATCHES, type QuizStep } from "../quiz/_shared/quizDraft";
import { usePreview } from "./use-preview";
import { Disclosure, Options } from "./Controls";

export function ProfileSummary({ compact = false }: { compact?: boolean }) {
  const { state, updateQuiz, setPrivacy } = usePreview();
  const [editing, setEditing] = useState(false);
  const [location, navigate] = useLocation();
  const draft = state.quiz;
  const shade = QUIZ_SWATCHES.find((swatch) => swatch.id === draft.shadeId);
  const reference = draft.products.find((product) => product.id === draft.referenceProductId);
  const rows: { label: string; value: string; step: QuizStep }[] = [
    { label: "Depth", value: shade ? `${shade.label} · ${shade.id}` : draft.depthUnsure ? "Unsure" : "Left open", step: "depth" },
    { label: "Undertone", value: draft.undertone || "Left open", step: "undertone" },
    { label: "Olive", value: [draft.olive === "yes" ? "Yes" : draft.olive === "maybe" ? "Possibly" : draft.olive === "no" ? "No" : "Unsure / left open", draft.oliveSubtype].filter(Boolean).join(" · "), step: "undertone" },
    { label: "Saturation & skin type", value: [draft.saturation, draft.skinType].filter(Boolean).join(" · ") || "Left open", step: "undertone" },
    { label: "Shopping needs", value: draft.categories.join(", ") || "All four categories", step: "categories" },
    { label: "Budget / finish / coverage", value: [draft.budget ? `Budget entry: ${draft.budget} USD` : "", draft.finish, draft.coverage].filter(Boolean).join(" · ") || "Flexible / left open", step: "categories" },
    { label: "Concealer intent", value: draft.concealerIntent?.join(", ") || "Left open", step: "categories" },
    { label: "Lips", value: [draft.lipPigmentation, draft.lipOpacity].filter(Boolean).join(" · ") || "Left open", step: "categories" },
    { label: "Color families", value: draft.colorFamilies?.join(", ") || "Left open", step: "categories" },
    { label: "Other preferences", value: [draft.fragrancePreference, draft.sensitivityPreference, draft.applicationStyle, draft.surfaceRedness].filter(Boolean).join(" · ") || "Left open", step: "categories" },
    { label: "Prior products", value: draft.products.map((item) => [item.brand || (item.brandUnknown ? "Brand unknown" : item.type), item.product, item.formula, item.shadeUnknown ? "Shade unknown" : item.shade, item.match.join(", ")].filter(Boolean).join(" · ")).join("; ") || (draft.newToMakeup ? "New to makeup" : draft.noCurrentMakeup ? "No current makeup" : "None entered"), step: "products" },
    { label: "Personal depth reference", value: reference ? [reference.brand || reference.type, reference.product, reference.shadeUnknown ? "Shade unknown" : reference.shade].filter(Boolean).join(" · ") : "None", step: "depth" },
  ];
  const summaryRows = (items: typeof rows) => <dl className="mvp-summary">{items.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd><Button variant="text" aria-label={`Edit ${row.label}`} onClick={() => { updateQuiz({ ...draft, step: row.step }); setEditing(true); }}>Edit</Button></div>)}</dl>;
  const details = <>
    <p className="mvp-muted">A personal description, not a diagnosis or confirmed shade match. Unknown answers stay unknown. Nothing here establishes product compatibility.</p>
    {summaryRows(rows.slice(0, 5))}
    <Disclosure title="Optional preferences & prior product notes">{summaryRows(rows.slice(5))}</Disclosure>
    <Options label="Profile privacy preference" options={["Private", "Share selected details with a future review"]} value={state.privacy === "private" ? "Private" : "Share selected details with a future review"} onChange={(value) => setPrivacy(value === "Private" ? "private" : "share-selected")} hint="Private by default. This setting is local only; no public profile exists. Each review draft requires its own explicit sharing choice." />
    {editing && <div className="mvp-inline-editor">
      <div className="mvp-row"><strong>Edit your answers</strong><Button variant="text" onClick={() => setEditing(false)}>Close editor, keep changes</Button></div>
      <QuizFlow draft={draft} onDraftChange={updateQuiz} onComplete={() => setEditing(false)} onLearn={() => navigate(`/learn?returnTo=${location === "/profile" ? "profile" : "results"}`)} />
    </div>}
  </>;
  return <section className="mvp-panel" aria-labelledby="profile-summary-heading">
    <div className="mvp-row"><div><span className="mono">SELF-REPORTED · EDITABLE</span><h2 id="profile-summary-heading">Your starting point</h2></div><Link className="mvp-link" href="/profile">Privacy & local data</Link></div>
    {compact ? <>
      <p className="mvp-muted">Depth: {shade?.label ?? (draft.depthUnsure ? "Unsure" : "Left open")} · Undertone: {draft.undertone || "Left open"}. Self-reported, not a confirmed shade match.</p>
      <Disclosure title="Editable profile details & privacy">{details}</Disclosure>
    </> : details}
  </section>;
}
