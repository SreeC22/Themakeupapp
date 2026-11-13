import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Choice } from "@workspace/neu-design-system/components/neu/choice";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { Disclosure } from "../mvp/Controls";
import { assessStep, permittedRole, resolveEditItem, type NeuEdit, type RoutineStep, type WardrobeContext } from "./model";
import { collectionItemMissing } from "./helpers";

export function RoutineStepCard({ step, index, edit, context, onChange, onRemove }: {
  step: RoutineStep; index: number; edit: NeuEdit; context: WardrobeContext;
  onChange: (step: RoutineStep) => void; onRemove: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const assessment = assessStep(step, edit, context);
  const preparation = step.role === "Moisturizer" || step.role === "SPF";
  const eligible = preparation ? [] : edit.items.filter(item => permittedRole(item, step.role, context));
  return <article className="mvp-product" data-testid={`card-routine-step-${step.id}`}>
    <div className="mvp-row"><div><span className="mono">STEP {index + 1} · {assessment.status}</span><h2>{step.role}</h2></div>
      <Button variant="secondary" onClick={() => onChange({ ...step, enabled: !step.enabled })} data-testid={`button-toggle-step-${step.id}`}>{step.enabled ? "Skip this step" : "Include this step"}</Button>
    </div>
    {assessment.product && <p><strong>{assessment.product.brand} · {assessment.product.title}</strong><br />{assessment.product.shade}</p>}
    {!preparation && collectionItemMissing(step, edit) && <p className="mvp-muted">The retained item is no longer available in this collection. Its reference is kept until you choose a replacement.</p>}
    <p className="mvp-muted">{assessment.instructions}</p>
    {assessment.missing.map(note => <p className="mvp-muted" key={note}>{note}</p>)}
    {!preparation && <Disclosure title="Choose from this same collection">
      <p className="mvp-muted">A source-safe swap never adds a purchase or changes another step. Complexion support is still rechecked against your profile.</p>
      <Choice title="Leave unselected" selected={step.itemId === null} onClick={() => onChange({ ...step, itemId: null })} />
      {eligible.map(item => {
        const product = resolveEditItem(item, context)!;
        return <Choice key={item.id} title={`${product.brand} · ${product.title} · ${product.shade}${product.owned ? " · Owned" : ""}`} selected={step.itemId === item.id} onClick={() => onChange({ ...step, itemId: item.id })} />;
      })}
      {!eligible.length && <p className="mvp-muted">Your Edit has no currently labeled item for this role. Leave it unresolved or skip it. No ordinary blush is assumed lip- or eye-safe.</p>}
      <Link href="/edit" className="mvp-link">Review collection options, keep this routine</Link>
    </Disclosure>}
    <Disclosure title={step.note ? "Edit your personal step note" : "Add a personal step note"}>
      <Typeahead label="Your note (up to 500 characters)" value={step.note ?? ""} placeholder="Your preference or reminder, not manufacturer evidence" suggestions={[]} onChange={note => onChange({ ...step, note })} />
      {(step.note?.length ?? 0) > 500 && <p className="mvp-error" role="alert">Keep this note within 500 characters before saving.</p>}
    </Disclosure>
    <div className="mvp-actions">
      {assessment.product?.detailPath && <Link className="mvp-link" href={assessment.product.detailPath} data-testid={`link-routine-detail-${step.id}`}>Shade details</Link>}
      {assessment.status === "supported" && assessment.product?.sourceUrl && <a className="mvp-link" href={assessment.product.sourceUrl} target="_blank" rel="noreferrer" data-testid={`link-routine-shop-${step.id}`}>Shop this source</a>}
      <Button variant="text" onClick={() => setConfirm(true)} data-testid={`button-remove-step-${step.id}`}>Remove step</Button>
    </div>
    {confirm && <div className="mvp-notice" role="group" aria-label="Confirm removing routine step"><p>Remove this step and its personal note from this working routine? Skipping keeps both.</p><div className="mvp-actions"><Button variant="secondary" onClick={onRemove}>Confirm remove step</Button><Button variant="text" onClick={() => setConfirm(false)}>Keep step</Button></div></div>}
  </article>;
}
