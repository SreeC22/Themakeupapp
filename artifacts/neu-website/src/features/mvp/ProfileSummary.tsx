import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { QUIZ_SWATCHES } from "../quiz/_shared/quizDraft";
import { usePreview } from "./use-preview";
import { ColoringFields, DepthPalette, SkinTypeField } from "./ComplexionFields";
import { Disclosure } from "./Controls";
import { ReferenceEditor } from "./ReferenceEditor";

export function ProfileSummary({ compact = false }: { compact?: boolean }) {
  const { state, updateQuiz } = usePreview();
  const [editing, setEditing] = useState(false);
  const draft = state.quiz;
  const shade = QUIZ_SWATCHES.find((item) => item.id === draft.shadeId);
  const change = (patch: Partial<typeof draft>) => updateQuiz({ ...draft, ...patch });
  return <section className="mvp-panel" aria-labelledby="profile-summary-heading">
    <div className="mvp-row"><div><span className="mono">PRIVATE · EDITABLE</span><h2 id="profile-summary-heading">Your starting point</h2></div>{compact && <Link className="mvp-link" href="/profile">Edit profile & references</Link>}</div>
    <p className="mvp-muted">Depth: {shade?.label ?? (draft.depthUnsure ? "Unsure" : "Left open")} · Undertone: {draft.undertone || "Left open"} · Skin type: {draft.skinType || "Left open"}</p>
    <p className="mvp-muted">{draft.products.length} personal {draft.products.length === 1 ? "reference" : "references"} · {[draft.oliveSubtype, draft.saturation].filter(Boolean).join(" · ") || "Olive temperature and saturation left open"}</p>
    <p className="mvp-muted">Your own description, not a diagnosis or a confirmed match. Source-backed reference descriptors are considered separately. A catalog shade never sets a manual palette swatch.</p>
    {!compact && <>
      <Button variant="secondary" aria-expanded={editing} onClick={() => setEditing(!editing)}>{editing ? "Close trait editor, keep changes" : "Edit complexion traits"}</Button>
      {editing && <div className="mvp-inline-editor mvp-stack">
        <h3>Edit depth</h3><DepthPalette draft={draft} onChange={change} />
        <ColoringFields draft={draft} onChange={change} /><SkinTypeField draft={draft} onChange={change} />
        <Link className="mvp-link" href="/learn?returnTo=profile">Open the color guide, keep my progress</Link>
        <p className="mvp-muted" role="status">Changes update your local profile immediately. Browser persistence status appears above.</p>
      </div>}
      <ReferenceEditor draft={draft} onChange={updateQuiz} />
      <Disclosure title="Earlier answers and optional notes">
        <dl className="mvp-facts">
          <div><dt>Earlier category interests</dt><dd>{draft.categories.join(", ") || "All four categories"}. Discovery now offers all four.</dd></div>
          <div><dt>Earlier budget / finish / coverage</dt><dd>{[draft.budget, draft.finish, draft.coverage].filter(Boolean).join(" · ") || "Left open"}</dd></div>
          <div><dt>Earlier concealer intent / lip preferences</dt><dd>{[draft.concealerIntent?.join(", "), draft.lipPigmentation, draft.lipOpacity, draft.colorFamilies?.join(", ")].filter(Boolean).join(" · ") || "Left open"}</dd></div>
          <div><dt>Other personal notes</dt><dd>{[draft.fragrancePreference, draft.sensitivityPreference, draft.applicationStyle, draft.surfaceRedness, draft.veinClue, draft.clues.join(", ")].filter(Boolean).join(" · ") || "Left open"}</dd></div>
          <div><dt>Earlier experience</dt><dd>{draft.newToMakeup ? "New to makeup" : draft.noCurrentMakeup ? "No current makeup" : draft.currentMakeupSkipped ? "Prior products skipped" : "Left open"}</dd></div>
          <div><dt>Earlier personal depth reference</dt><dd>{(() => {
            const reference = draft.products.find((item) => item.id === draft.referenceProductId);
            return reference ? [reference.brand || reference.type, reference.product, reference.shade].filter(Boolean).join(" · ") : "None";
          })()}</dd></div>
        </dl>
        <p className="mvp-muted">Earlier answers are preserved. Category preferences now save independently in discovery.</p>
      </Disclosure>
      <Link href="/results" className="mvp-link">Edit category preferences in discovery</Link>
      <p className="mvp-muted">No public profile exists. {state.privacy === "share-selected" ? "Your earlier future-sharing preference is retained locally but inactive. Nothing is shared." : "Your profile is private."}</p>
    </>}
  </section>;
}
