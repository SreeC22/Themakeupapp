import { useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { Disclosure, EmptyState, Heading, Options } from "@/features/mvp/Controls";
import { usePreview } from "@/features/mvp/use-preview";
import { useLooks } from "@/features/looks/use-looks";
import { LooksStorageNotice } from "@/features/looks/LooksStorageNotice";
import { useEditEvidence } from "@/features/wardrobe/use-edit-evidence";
import { initialRoutineDraft, routineRoute, type RoutineDraft } from "@/features/wardrobe/working-draft";
import { ROLES, ROUTINES, assessStep, permittedRole, routineSteps, type NeuEdit, type RoutineName, type RoutineRole, type SavedRoutine, type WardrobeContext } from "@/features/wardrobe/model";
import { BudgetSummary, EvidenceState } from "@/features/wardrobe/WardrobeParts";
import { RoutineStepCard } from "@/features/wardrobe/RoutineStepCard";
import { effectiveEdit } from "@/features/wardrobe/helpers";

export default function RoutinesPage() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const route = routineRoute(search);
  const { snapshot, changed, commit, wardrobeDrafts } = useLooks();
  const [deleteId, setDeleteId] = useState("");
  const [freshTemplate, setFreshTemplate] = useState<RoutineName | null>(null);
  const [message, setMessage] = useState("");
  const writable = snapshot.status === "ready" && !changed;
  if (route.savedId || route.template) return <RoutineEditor key={route.key} editorKey={route.key} savedId={route.savedId} template={route.template} />;
  const start = (template: RoutineName, fresh = false) => {
    const key = routineRoute(`template=${encodeURIComponent(template)}`).key;
    if (fresh || !wardrobeDrafts.readRoutine(key)) wardrobeDrafts.writeRoutine(key, initialRoutineDraft(template, crypto.randomUUID()));
    navigate(`/routines?template=${encodeURIComponent(template)}`);
  };
  return <main className="content mvp-page">
    <Heading eyebrow="EXPLORE LOOKS" title="One Edit. More ways to wear it.">Six starting points, not six shopping lists. Make any routine simpler or more elaborate using your same collection.</Heading>
    <div className="mvp-actions"><Link href="/edit" className="mvp-link">Your Neu Edit</Link><Link href="/looks/saved" className="mvp-link">Earlier saved looks & makeup bag</Link></div>
    <LooksStorageNotice />
    <div className="mvp-grid">{ROUTINES.map((template, index) => <article className="mvp-product" key={template} data-testid={`card-routine-template-${index}`}>
      <span className="mono">0{index + 1} · ADAPT TO YOU</span><h2>{template}</h2>
      <p className="mvp-muted">{template === "Five-Minute Face" ? "A quick, flexible starting point. Preparation stays text-only." : "Explore a simple version or add more expression. No step is essential."}</p>
      <Button variant="secondary" onClick={() => start(template)} data-testid={`button-start-routine-${index}`}>Customize {template}</Button>
      {wardrobeDrafts.readRoutine(routineRoute(`template=${encodeURIComponent(template)}`).key) && <div className="mvp-actions"><Button variant="text" onClick={() => setFreshTemplate(template)}>Start a fresh version</Button></div>}
      {freshTemplate === template && <div className="mvp-notice" role="group" aria-label="Confirm fresh routine"><p>Start a separate {template} routine? This replaces this template's transient working editor. Any saved original stays unchanged. Cancel to keep unsaved steps and notes.</p><div className="mvp-actions"><Button variant="secondary" onClick={() => start(template, true)}>Confirm start fresh</Button><Button variant="text" onClick={() => setFreshTemplate(null)}>Keep working version</Button></div></div>}
    </article>)}</div>
    <section className="mvp-panel"><h2>Saved adaptive routines</h2><p className="mvp-muted">Saved in this browser. Reopening rechecks support without regenerating your steps.</p>
      {!snapshot.data.routines?.length ? <EmptyState title="Your first routine starts here"><p>Choose a starting point above, skip what you do not need, and save your own version.</p></EmptyState>
        : <div className="mvp-stack">{snapshot.data.routines.map(routine => <article key={routine.id} className="mvp-comparison" data-testid={`card-saved-routine-${routine.id}`}>
          <h3>{routine.name}</h3><p className="mvp-muted">{routine.template} · {routine.variant} · {routine.steps.filter(s => s.enabled).length} included steps</p>
          <div className="mvp-actions"><Link className="mvp-link" href={`/routines?id=${encodeURIComponent(routine.id)}`} data-testid={`link-saved-routine-${routine.id}`}>Open & customize</Link><Button variant="text" disabled={!writable} onClick={() => setDeleteId(routine.id)}>Delete routine</Button></div>
          {deleteId === routine.id && <div className="mvp-notice" role="group" aria-label="Confirm deleting saved routine"><p>Delete this saved routine? Your Neu Edit, makeup bag and earlier looks stay unchanged.</p><div className="mvp-actions"><Button variant="secondary" disabled={!writable} onClick={() => {
            if (commit(data => ({ ...data, routines: (data.routines ?? []).filter(r => r.id !== routine.id) }))) {
              wardrobeDrafts.removeRoutineRecord(routine.id); setDeleteId(""); setMessage("Saved routine deleted. The collection was not changed.");
            }
          }}>Confirm delete routine</Button><Button variant="text" onClick={() => setDeleteId("")}>Keep routine</Button></div></div>}
        </article>)}</div>}
    </section>
    {message && <p className="mvp-notice" role="status">{message}</p>}
  </main>;
}

function RoutineEditor({ editorKey, savedId, template }: { editorKey: string; savedId: string | null; template: RoutineName | null }) {
  const { state } = usePreview();
  const { snapshot, changed, commit, wardrobeDrafts } = useLooks();
  const evidence = useEditEvidence(state.quiz);
  const saved = snapshot.data.routines?.find(r => r.id === savedId);
  const [draft, setDraft] = useState<RoutineDraft>(() => wardrobeDrafts.readRoutine(editorKey) ?? initialRoutineDraft(template ?? saved?.template ?? "Everyday", savedId ?? crypto.randomUUID(), saved));
  const [pending, setPending] = useState<{ template: RoutineName; variant: SavedRoutine["variant"] } | null>(null);
  const [newRole, setNewRole] = useState<RoutineRole>("Lip gloss");
  const [message, setMessage] = useState("");
  const working = wardrobeDrafts.readEdit();
  const edit: NeuEdit | null = effectiveEdit(working, snapshot.data.wardrobe);
  const context: WardrobeContext | null = evidence.catalog ? { catalog: evidence.catalog, owned: snapshot.data.owned, recommendations: evidence.data, profile: evidence.profile } : null;
  const ready = !!context && !!edit && !!evidence.data && !evidence.isLoading && !evidence.isError;
  const { routine } = draft;
  const currentSaved = snapshot.data.routines?.find(r => r.id === routine.id);
  const conflict = draft.base !== (currentSaved ? JSON.stringify(currentSaved) : "");
  const missingSaved = !!savedId && !saved && !draft.initialized;
  const writable = snapshot.status === "ready" && !changed;
  const nameValid = !!routine.name.trim() && routine.name.length <= 200;
  const notesValid = routine.steps.every(step => (step.note?.length ?? 0) <= 500);
  useEffect(() => { wardrobeDrafts.writeRoutine(editorKey, draft); }, [editorKey, draft, wardrobeDrafts]);
  useEffect(() => {
    if (draft.initialized || savedId || !ready || !edit || !context) return;
    setDraft(current => current.initialized ? current : { ...current, initialized: true, dirty: true, routine: { ...current.routine, steps: routineSteps(current.routine.template, current.routine.variant, edit, context).map(step => ({ ...step, id: crypto.randomUUID() })) } });
  }, [draft.initialized, savedId, ready, edit, context]);
  const update = (patch: Partial<SavedRoutine>) => setDraft(current => ({ ...current, dirty: true, routine: { ...current.routine, ...patch } }));
  const save = () => {
    if (!nameValid || !notesValid || conflict || !draft.initialized) return;
    const record = { ...routine, name: routine.name.trim(), updatedAt: new Date().toISOString() };
    if (commit(data => ({ ...data, routines: [...(data.routines ?? []).filter(r => r.id !== record.id), record] }))) {
      const next = initialRoutineDraft(record.template, record.id, record);
      setDraft(next); wardrobeDrafts.writeRoutine(editorKey, next); wardrobeDrafts.writeRoutine(`routine:${record.id}`, next);
      setMessage("Routine saved in this browser with these exact steps, notes and collection references.");
    }
  };
  const selectVersion = () => {
    if (!pending || !context || !edit) return;
    update({ template: pending.template, variant: pending.variant, steps: routineSteps(pending.template, pending.variant, edit, context).map(step => ({ ...step, id: crypto.randomUUID() })) });
    setPending(null); setMessage("Template explicitly replaced. Review this new working step list before saving.");
  };
  return <main className="content mvp-page">
    <Heading eyebrow="CUSTOMIZE YOUR ROUTINE" title={routine.name || routine.template}>Your products, your intensity. Skip a step, keep a note, or choose a labeled alternative already in your Edit.</Heading>
    <div className="mvp-actions"><Link href="/routines" className="mvp-link">All looks & saved routines</Link><Link href="/edit" className="mvp-link">Your Neu Edit</Link><Link href="/profile" className="mvp-link">Complexion profile</Link></div>
    <LooksStorageNotice />
    {missingSaved && <EmptyState title="This saved routine is not available"><p>The link may refer to a deleted routine. It has not been silently recreated.</p><Link href="/routines" className="mvp-link">Choose another routine</Link></EmptyState>}
    {!missingSaved && <>
      {conflict && <section className="mvp-notice" role="alert"><h2>The saved routine changed or was removed</h2><p>Your working steps are kept. Saving over a changed or deleted original is blocked.</p>{currentSaved && <Button variant="secondary" onClick={() => setDraft(initialRoutineDraft(currentSaved.template, currentSaved.id, currentSaved))}>Discard working changes & reload saved routine</Button>}</section>}
      {!edit && <EmptyState title="Start with your Neu Edit"><p>Routines only use your collection. Create an Edit first; no shopping list is generated here.</p><Link className="mvp-link" href="/edit">Create your Neu Edit</Link></EmptyState>}
      <EvidenceState loading={evidence.isLoading} error={evidence.isError} retry={evidence.retry} />
      {edit && context && <>
        <section className="mvp-panel">
          <div className="mvp-row"><div><span className="mono">{draft.dirty ? "UNSAVED ROUTINE" : "SAVED ROUTINE"} · {routine.variant}</span><h2>{routine.template}</h2></div>
            <Button onClick={save} disabled={!writable || !nameValid || !notesValid || conflict || !draft.initialized || !currentSaved && (snapshot.data.routines?.length ?? 0) >= 100} data-testid="button-save-routine">Save routine</Button>
          </div>
          <Typeahead label="Routine name (up to 200 characters)" value={routine.name} placeholder={routine.template} suggestions={[]} onChange={name => update({ name })} />
          {!nameValid && <p role="alert" className="mvp-error">Use a name of 1 to 200 characters.</p>}
          <p className="mvp-muted">Working changes survive internal detail, Learn and Profile navigation. Save is explicit. {working?.dirty ? "This previews an unsaved working Edit; save that collection too so its item IDs remain available after reload." : "Current support is rechecked, but saved steps are never regenerated automatically."}</p>
          {!currentSaved && (snapshot.data.routines?.length ?? 0) >= 100 && <p className="mvp-error" role="alert">This local library holds up to 100 routines. Delete one before saving another.</p>}
          <Disclosure title="Compare simple & elaborate, same collection">
            <div className="mvp-two-col">{(["simple", "elaborate"] as const).map(variant => {
              const preview = routineSteps(routine.template, variant, edit, context);
              return <section className="mvp-comparison" key={variant}><h3>{variant === "simple" ? "Simple" : "More elaborate"}</h3>
                <ul>{preview.map(step => <li className="mvp-muted" key={step.id}>{step.role}: {assessStep(step, edit, context).status}</li>)}</ul>
                <p className="mvp-muted">Same {edit.items.length} collection items. Unresolved roles are not new product recommendations.</p>
                <Button variant="secondary" disabled={!ready} onClick={() => setPending({ template: routine.template, variant })}>Use {variant} starting steps</Button>
              </section>;
            })}</div>
          </Disclosure>
          <Disclosure title="Change routine template">
            <Options label="New starting point" options={ROUTINES} value={routine.template} onChange={name => setPending({ template: name as RoutineName, variant: routine.variant })} />
          </Disclosure>
          {pending && <section className="mvp-notice" role="group" aria-label="Confirm routine template replacement"><h3>Replace these customized steps?</h3><p>Use {pending.variant} {pending.template} starting steps from this same Edit? This explicitly replaces the current step IDs, skipped states, notes and product choices. Cancel to keep your exact routine.</p><div className="mvp-actions"><Button variant="secondary" disabled={!ready} onClick={selectVersion} data-testid="button-confirm-routine-template">Confirm replace starting steps</Button><Button variant="text" onClick={() => setPending(null)}>Keep current steps</Button></div></section>}
        </section>
        <div className="mvp-stack">{routine.steps.map((step, index) => <RoutineStepCard key={step.id} step={step} index={index} edit={edit} context={context} onChange={next => update({ steps: routine.steps.map(s => s.id === step.id ? next : s) })} onRemove={() => update({ steps: routine.steps.filter(s => s.id !== step.id) })} />)}</div>
        {draft.initialized && !routine.steps.length && <EmptyState title="A routine with room to begin"><p>Add only the steps you want. There is no minimum product count.</p></EmptyState>}
        <Disclosure title="Add an optional step">
          <Options label="Step role" options={ROLES} value={newRole} onChange={role => setNewRole(role as RoutineRole)} />
          <Button variant="secondary" disabled={routine.steps.length >= 30} onClick={() => update({ steps: [...routine.steps, { id: crypto.randomUUID(), role: newRole, enabled: true, itemId: edit.items.find(item => permittedRole(item, newRole, context))?.id ?? null }] })} data-testid="button-add-routine-step">Add {newRole} step</Button>
          <p className="mvp-muted">{routine.steps.length} / 30 steps. Moisturizer and SPF are text-only preparation, never skincare shopping suggestions.</p>
        </Disclosure>
        <BudgetSummary edit={edit} context={context} />
        <p className="mvp-muted">Collection costs are not additional costs for each look. All shopping links open source pages; confirm the exact shade, price and stock there. Missing roles can stay unresolved or skipped.</p>
      </>}
    </>}
    {message && <p className="mvp-notice" role="status" data-testid="status-routine-message">{message}</p>}
  </main>;
}
