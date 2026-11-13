import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { Heading, Disclosure, Options } from "@/features/mvp/Controls";
import { ProfileSummary } from "@/features/mvp/ProfileSummary";
import { usePreview } from "@/features/mvp/use-preview";
import { buildLook, LOOK_CATEGORIES, OCCASIONS, OCCASION_NOTES, type LookBudget, type LookOption, type LookSelections, type Occasion, type SavedLook } from "@/features/looks/model";
import { validBudget } from "@/features/looks/storage";
import { choiceLabel, collectSelections, emptySelections, generatedSelections, replaceSlot } from "@/features/looks/helpers";
import { useLooks } from "@/features/looks/use-looks";
import { useLookEvidence } from "@/features/looks/use-look-evidence";
import { LooksStorageNotice } from "@/features/looks/LooksStorageNotice";
import { OwnedInventory } from "@/features/looks/OwnedInventory";
import { LookSlotCard } from "@/features/looks/LookSlotCard";
import { workingEditorKey, type WorkingLookDraft } from "@/features/looks/working-draft";

export default function LooksPage() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const editId = new URLSearchParams(search).get("edit");
  const editorKey = workingEditorKey(search);
  const { snapshot, changed, commit, workingDrafts, currentRevision, startNewLook } = useLooks();
  const { state } = usePreview();
  const [restored] = useState(() => workingDrafts.restore(editorKey, snapshot.data.looks.find(l => l.id === editId), snapshot.data.revision));
  const [base, setBase] = useState(restored.base);
  const [baseRevision, setBaseRevision] = useState(restored.baseRevision);
  const [id, setId] = useState(restored.id);
  const [name, setName] = useState(restored.name);
  const [occasion, setOccasion] = useState<Occasion>(restored.occasion);
  const [tier, setTier] = useState<LookBudget["tier"]>(restored.tier);
  const [limit, setLimit] = useState(restored.limit);
  const budget = useMemo<LookBudget>(() => ({ tier, ...(limit.trim() ? { limitUSD: Number(limit) } : {}) }), [tier, limit]);
  const budgetValid = validBudget(budget);
  const [selections, setSelections] = useState<LookSelections>(restored.selections);
  const [active, setActive] = useState(restored.active);
  const [intent, setIntent] = useState<string | null>(null);
  const [replaceConfirm, setReplaceConfirm] = useState(false);
  const [saveMode, setSaveMode] = useState<"update" | "new" | null>(restored.saveMode);
  const [dirty, setDirty] = useState(restored.dirty);
  const [message, setMessage] = useState("");
  const evidence = useLookEvidence(state.quiz, occasion, active);
  const contextKey = JSON.stringify([evidence.contextKey, budget]);
  const owned = snapshot.data.owned;
  const plan = useMemo(() => evidence.catalog && evidence.data && evidence.profile && budgetValid
    ? buildLook({ catalog: evidence.catalog, recommendations: evidence.data, profile: evidence.profile, occasion, budget, owned, selections })
    : null, [evidence.catalog, evidence.data, evidence.profile, budgetValid, occasion, budget, owned, selections]);
  const currentSaved = snapshot.data.looks.find(l => l.id === id);
  const editConflict = !!id && JSON.stringify(currentSaved) !== base;
  const hasChoices = Object.values(selections).some(Boolean);
  const writable = snapshot.status === "ready" && !changed;
  const missingRequested = !!editId && !restored.id;
  const working = useMemo<WorkingLookDraft>(() => ({
    id, name, occasion, tier, limit, selections, base, baseRevision, dirty, active, saveMode,
  }), [id, name, occasion, tier, limit, selections, base, baseRevision, dirty, active, saveMode]);

  // Publish committed editor changes before internal links can unmount this page.
  // This is memory-only: no library write, evidence snapshot or generation intent.
  useLayoutEffect(() => {
    if (editId && id && editId !== id) return;
    workingDrafts.write(editorKey, working);
  }, [workingDrafts, editorKey, working, editId, id]);
  useEffect(() => {
    // Back to a former new-draft URL after Save must retain its saved identity.
    if (restored.id && restored.id !== editId) navigate(`/looks?edit=${encodeURIComponent(restored.id)}`, { replace: true });
  }, [restored.id, editId, navigate]);

  useEffect(() => {
    if (!intent) return;
    if (intent !== contextKey) {
      setIntent(null);
      setMessage("Your profile, look direction or budget changed during generation. No choices were replaced. Generate again when ready.");
      return;
    }
    if (!evidence.data || !evidence.catalog || !evidence.profile || !budgetValid) return;
    const generated = buildLook({ catalog: evidence.catalog, recommendations: evidence.data, profile: evidence.profile, occasion, budget, owned });
    setSelections(generatedSelections(generated));
    setIntent(null);
    setDirty(true);
    setMessage("Your set is ready to customize. Any unresolved slot stays visible; only source-supported choices were selected.");
  }, [intent, contextKey, evidence.data, evidence.catalog, evidence.profile, budgetValid, occasion, budget, owned]);

  const generate = () => {
    setReplaceConfirm(false);
    setMessage("");
    setActive(true);
    setIntent(contextKey);
    evidence.refresh();
  };
  const own = (option: LookOption) => {
    setMessage("");
    if (option.choice.kind !== "catalog" || owned.some(o => o.shadeId === (option.choice.kind === "catalog" ? option.choice.shadeId : ""))) return;
    if (owned.length >= 200) { setMessage("Your makeup bag has reached 200 items. Remove one before adding another."); return; }
    const category = plan?.slots.find(slot => slot.options.includes(option))?.category;
    if (!category) return;
    const shadeId = option.choice.shadeId;
    if (commit(data => ({ ...data, owned: [...data.owned, { id: crypto.randomUUID(), category, brand: option.brand, product: option.title, shade: option.shade, shadeId }] }))) {
      setMessage("Marked as owned. Your look is unchanged. Use this owned item explicitly from your makeup bag below to avoid a new purchase.");
    }
  };
  const reloadEditor = () => {
    if (!currentSaved) return;
    setName(currentSaved.name);
    setOccasion(currentSaved.occasion);
    setTier(currentSaved.budget.tier);
    setLimit(currentSaved.budget.limitUSD?.toString() ?? "");
    setSelections({ ...emptySelections(), ...currentSaved.selections });
    setBase(JSON.stringify(currentSaved));
    setBaseRevision(snapshot.data.revision);
    setDirty(false);
    setActive(true);
    setIntent(null);
    setMessage("The saved look was explicitly reloaded. Its exact selections are being revalidated, not replaced.");
    evidence.refresh();
  };
  const save = () => {
    setMessage("");
    if (!saveMode || !budgetValid || !name.trim() || name.length > 200) return;
    if (saveMode === "update" && id && editConflict) { setMessage("Not saved: the saved look changed or was deleted. Reload it explicitly, or save your draft as a new look."); return; }
    const newId = saveMode === "new" || !id ? crypto.randomUUID() : id;
    const record: SavedLook = {
      id: newId, name: name.trim(), occasion, budget,
      selections: plan ? collectSelections(plan, selections) : { ...emptySelections(), ...selections },
      updatedAt: new Date().toISOString(),
    };
    if (commit(data => ({ ...data, looks: [...data.looks.filter(l => l.id !== newId), record] }))) {
      const revision = currentRevision();
      workingDrafts.saved(editorKey, working, record, revision);
      setId(newId); setBase(JSON.stringify(record)); setSelections(record.selections);
      setBaseRevision(revision);
      setDirty(false); setSaveMode(null);
      setMessage("Look saved in this browser with all selected choices and empty slots. No account or cloud sync is involved.");
      if (editId !== newId) navigate(`/looks?edit=${encodeURIComponent(newId)}`);
    }
  };
  return <main className="content mvp-page">
    <Heading eyebrow="YOUR NEU LOOK" title={id ? "Make this look your own." : "A look that feels like you."}>Beauty profile, a look direction, your budget. Build a four-category starting set, reuse what you own and change only what you want.</Heading>
    <div className="mvp-actions"><Link className="mvp-link" href="/looks/saved">Saved looks & drafts</Link><Link className="mvp-link" href="/results">Browse individual products</Link><Link className="mvp-link" href="/profile">Edit beauty profile</Link><Button variant="text" onClick={() => navigate(startNewLook())} data-testid="button-start-new-look">Start a new look</Button></div>
    <p className="mvp-muted">Internal navigation keeps this working editor in memory; Back returns to its choices without regenerating. Only Save writes a library entry. A page refresh or closing this tab loses unsaved work.</p>
    <LooksStorageNotice />
    {missingRequested ? <section className="mvp-notice" role="alert"><h2>This saved look could not be opened</h2><p>It may have been deleted, or local storage may be protected or unavailable. No saved look has been changed.</p><Link className="mvp-link" href="/looks/saved">Return to saved looks</Link><Button variant="text" onClick={() => navigate(startNewLook())}>Start a separate new look</Button></section> : <>
      <ProfileSummary compact />
      {!state.quiz.onboardingPath && <p className="mvp-muted"><Link className="mvp-link" href="/quiz">Start your guided beauty profile</Link> or leave traits open. No complexion match is invented for missing answers.</p>}
      <section className="mvp-panel">
        <span className="mono">01 · CHOOSE A LOOK</span><h2>What are you in the mood for?</h2>
        <Options label="Look direction" options={OCCASIONS} value={occasion} onChange={value => { setOccasion(value as Occasion); setDirty(true); }} />
        <p className="mvp-muted">{OCCASION_NOTES[occasion]}</p>
        <p className="mvp-muted">Your saved cheek and lip color preferences come first. These directions fill in only where you left color open. The recipe is editorial, not tested compatibility.</p>
        <Disclosure title="Adjust your category preferences"><p className="mvp-muted">Your existing preferences are preserved. Editing them revalidates this look without silently replacing any selection.</p><Link className="mvp-link" href="/results">Edit preferences & browse individual products</Link></Disclosure>
      </section>
      <section className="mvp-panel">
        <span className="mono">02 · SET YOUR BUDGET</span><h2>Keep it comfortable.</h2>
        <Options label="Maximum editorial brand tier" options={["Any", "Drugstore", "Mid-range", "Luxury"]} value={tier} onChange={value => { setTier(value as LookBudget["tier"]); setDirty(true); }} hint="A maximum includes lower tiers. These are editorial brand groupings, not proof of a product's price." />
        <Typeahead label="Optional overall new-purchase limit (USD)" value={limit} placeholder="Leave open, or enter a positive amount" suggestions={[]} onChange={value => { setLimit(value); setDirty(true); }} />
        {!budgetValid && <p className="mvp-error" role="alert">Enter an amount greater than 0 and no more than 10,000, or clear the limit. Generation and saving are blocked until it is valid.</p>}
        <p className="mvp-muted">Unknown prices are not free. A complete total is available only when all four slots have selections and every new-purchase price is verified. Reused owned items add no new purchase.</p>
        <Button disabled={!budgetValid || evidence.isLoading || !!intent} onClick={() => hasChoices ? setReplaceConfirm(true) : generate()} data-testid="button-generate-look">{intent ? "Preparing your set" : "Generate personalized makeup set"}</Button>
        {replaceConfirm && <div className="mvp-notice" role="group" aria-label="Confirm generating a replacement set"><h3>Generate a new starting set?</h3><p>This explicitly replaces the current four working selections. Your saved version is unchanged until you save an update. To change just one product, use Customize in that slot instead.</p><div className="mvp-actions"><Button variant="secondary" onClick={generate} disabled={!budgetValid || evidence.isLoading}>Confirm generate new set</Button><Button variant="text" onClick={() => setReplaceConfirm(false)}>Keep my choices</Button></div></div>}
      </section>
      <section aria-labelledby="customize-heading">
        <div className="mvp-row"><div><span className="mono">03 · CUSTOMIZE</span><h2 id="customize-heading">Your four places to play.</h2></div><p className="mvp-muted">{dirty ? "Unsaved working draft" : id ? "Saved selections, revalidated on current evidence" : "Not saved yet"}</p></div>
        {evidence.isError && <div className="mvp-notice" role="alert"><h3>Current evidence is unavailable</h3><p>Your selections are preserved below, but they are not presented as current recommendations. Retry when the service is available. You can still save a draft.</p><Button variant="secondary" onClick={evidence.retry} data-testid="button-retry-look-evidence">Retry evidence</Button></div>}
        {evidence.isLoading && <div className="looks-skeleton" aria-busy="true" role="status" data-testid="status-look-loading"><p className="mvp-muted">Checking current source evidence. Your choices will not be replaced.</p>{LOOK_CATEGORIES.map(category => <div key={category} className="mvp-product"><span className="mono">{category}</span><div className="h-4 bg-muted rounded-md my-4" /><div className="h-4 bg-muted rounded-md" /></div>)}</div>}
        {!active && !evidence.isLoading && <p className="mvp-notice">Choose a look and budget, then generate when you are ready. No recommendations are requested until you choose to generate. You can also explicitly reuse an owned product or save an empty draft.</p>}
        {evidence.catalog && evidence.catalog.shades.length === 0 && <p className="mvp-notice">The catalog has no shades to offer right now. No substitute data is used. You can reuse self-reported owned products and save a draft.</p>}
        {plan ? <div className="looks-slots">{plan.slots.map(slot => <LookSlotCard key={slot.category} slot={slot} requested={selections[slot.category]} catalog={evidence.catalog!} owned={owned} onChoose={choice => { setIntent(null); setSelections(current => replaceSlot(current, slot.category, choice)); setDirty(true); }} onOwn={own} />)}</div>
          : (!evidence.isLoading || hasChoices) && <div className="looks-slots">{LOOK_CATEGORIES.map(category => <section key={category} className="mvp-product" data-testid={`card-preserved-slot-${category}`}><span className="mono">{category}</span><h3>{selections[category] ? "Selection preserved" : "Unresolved slot"}</h3><p>{choiceLabel(selections[category], evidence.catalog, owned)}</p><p className="mvp-muted">No current evidence confirmed for this slot. Nothing will be substituted.</p><Button variant="text" disabled={!selections[category]} onClick={() => { setIntent(null); setSelections(current => replaceSlot(current, category, null)); setDirty(true); }}>Leave {category} empty</Button></section>)}</div>}
        {plan && <section className="mvp-notice" data-testid="status-look-budget">
          <h3>{plan.totalUSD === null ? "Complete total unverified" : `New-purchase total: $${plan.totalUSD.toFixed(2)} USD`}</h3>
          <p>{plan.selectedCount} of 4 slots selected · {plan.slots.filter(s => s.unresolved.length > 0).length} slots with unresolved evidence.</p>
          {plan.totalUSD === null && <p>Known new-purchase subtotal only: ${plan.knownSpendUSD.toFixed(2)} USD. This excludes unknown prices and empty or unavailable slots; it is not a complete budget estimate.</p>}
          <p>{plan.budgetStatus === "over" ? "Known new-purchase spend already exceeds your limit. Choose alternatives or adjust the limit." : plan.budgetStatus === "within" ? "The complete source-priced set is within your entered limit. Current checkout prices and stock may differ." : "Overall-budget fit is unverified or no limit was entered."}</p>
          <Disclosure title="How to read this set"><ul>{plan.notes.map((note, index) => <li key={index}>{note}</li>)}</ul></Disclosure>
        </section>}
      </section>
      <OwnedInventory catalog={evidence.catalog} onReuse={item => {
        setIntent(null);
        setSelections(current => replaceSlot(current, item.category, { kind: "owned", ownedId: item.id }));
        setActive(true); setDirty(true); setMessage(`Your owned ${item.product} was explicitly selected for ${item.category}. Other slots were kept.`);
      }} />
      <section className="mvp-panel" aria-labelledby="save-look-heading">
        <span className="mono">04 · SAVE OR SHOP</span><h2 id="save-look-heading">Keep your look, your way.</h2>
        <p className="mvp-muted">Save complete selections or an unfinished draft in this browser. Shop links in each selected product’s evidence lead only to its actual source; no stock or checkout promise.</p>
        {editConflict && <div className="mvp-notice" role="alert"><p>The saved look changed or was deleted while this editor stayed open. Your draft is kept. Updating it is blocked until you explicitly reload the saved version, or save as a new look.</p>{currentSaved && <Button variant="secondary" onClick={reloadEditor}>Discard this working draft & reload saved look</Button>}</div>}
        <div className="mvp-actions">
          <Button variant="secondary" disabled={!writable || !budgetValid || !!intent || !!id && editConflict || !id && snapshot.data.looks.length >= 100} onClick={() => setSaveMode("update")} data-testid="button-save-look">{id ? "Save changes to this look" : "Save look or draft"}</Button>
          {id && <Button variant="text" disabled={!writable || !budgetValid || snapshot.data.looks.length >= 100 || !!intent} onClick={() => setSaveMode("new")}>Save as a new look</Button>}
          <Link className="mvp-link" href="/looks/saved">View saved looks</Link>
        </div>
        {snapshot.data.looks.length >= 100 && <p className="mvp-muted">The local library holds up to 100 looks. Existing looks can still be updated; delete one to make room for a new look.</p>}
        {saveMode && <div className="mvp-inline-editor mvp-stack" role="group" aria-label="Confirm saving a look">
          <Typeahead label="Look name" value={name} placeholder="Give your look a name" suggestions={[]} onChange={value => { setName(value); setDirty(true); }} />
          {name.length > 200 && <p className="mvp-error">Use no more than 200 characters.</p>}
          <p className="mvp-muted">{saveMode === "new" ? "This creates a separate saved look." : id ? "This updates the same saved look ID." : "This creates a local look or draft."} Empty slots and unavailable saved references are kept exactly. {plan ? `${plan.selectedCount}/4 slots have current selections; ${plan.slots.filter(slot => slot.unresolved.length > 0).length} slots need review.` : "Evidence is not current; this will be saved as a draft for later review."}</p>
          <div className="mvp-actions"><Button variant="secondary" onClick={save} disabled={!writable || !name.trim() || name.length > 200 || !budgetValid || saveMode === "update" && !!id && editConflict || (saveMode === "new" || !id) && snapshot.data.looks.length >= 100} data-testid="button-confirm-save-look">{id && saveMode === "update" ? "Confirm update this look" : "Confirm save locally"}</Button><Button variant="text" onClick={() => setSaveMode(null)}>Cancel</Button></div>
        </div>}
      </section>
      {message && <p className="mvp-notice" role="status" data-testid="status-look-editor">{message}</p>}
    </>}
  </main>;
}
