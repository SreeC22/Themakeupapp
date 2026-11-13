import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { Disclosure, EmptyState, Heading, Options } from "@/features/mvp/Controls";
import { CategoryPreferences } from "@/features/mvp/CategoryPreferences";
import { usePreview } from "@/features/mvp/use-preview";
import { useLooks } from "@/features/looks/use-looks";
import { LooksStorageNotice } from "@/features/looks/LooksStorageNotice";
import { OwnedInventory } from "@/features/looks/OwnedInventory";
import { choiceLabel } from "@/features/looks/helpers";
import { LOOK_CATEGORIES, OWNED_CATEGORIES, type LookBudget, type OwnedProduct } from "@/features/looks/model";
import { useEditEvidence } from "@/features/wardrobe/use-edit-evidence";
import { initialEditDraft, type EditDraft } from "@/features/wardrobe/working-draft";
import { CORE_ROLES, budgetInput, effectiveEdit, initializeEdit, missingCore, replaceCollectionItem } from "@/features/wardrobe/helpers";
import { BudgetSummary, CollectionPicker, EditItemCard, EvidenceState } from "@/features/wardrobe/WardrobeParts";
import { resolveEditItem, type RoutineRole, type WardrobeContext } from "@/features/wardrobe/model";

export default function NeuEditPage() {
  const { state, updateQuiz } = usePreview();
  const { snapshot, changed, commit, wardrobeDrafts } = useLooks();
  const evidence = useEditEvidence(state.quiz);
  const [draft, setDraft] = useState<EditDraft>(() => wardrobeDrafts.readEdit() ?? initialEditDraft(snapshot.data.wardrobe));
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState<string | null>(null);
  const [remove, setRemove] = useState("");
  const [reuse, setReuse] = useState<OwnedProduct | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => { wardrobeDrafts.writeEdit(draft); }, [draft, wardrobeDrafts]);
  const budget = budgetInput(draft.tier, draft.limit);
  const edit = effectiveEdit(draft);
  const context: WardrobeContext | null = evidence.catalog ? { catalog: evidence.catalog, owned: snapshot.data.owned, recommendations: evidence.data, profile: evidence.profile } : null;
  const writable = snapshot.status === "ready" && !changed;
  const conflict = draft.base !== (snapshot.data.wardrobe ? JSON.stringify(snapshot.data.wardrobe) : "");
  const patch = (value: Partial<EditDraft>) => setDraft(current => ({ ...current, ...value, dirty: true }));
  const ready = !!context && !!evidence.data && !!evidence.profile && !evidence.isError && !evidence.isLoading;
  const replacing = edit?.items.find(item => item.id === picker);
  const validName = !!draft.name.trim() && draft.name.length <= 200;
  const save = () => {
    setMessage("");
    if (!edit || !budget || !validName || conflict) return;
    const record = { ...edit, name: draft.name.trim(), updatedAt: new Date().toISOString() };
    if (commit(data => ({ ...data, wardrobe: record }))) {
      setDraft(initialEditDraft(record)); setMessage("Your Neu Edit is saved in this browser. Explore routines using this same collection.");
    }
  };
  const own = (itemId: string) => {
    if (!edit || !context) return;
    const item = edit.items.find(i => i.id === itemId);
    const product = item ? resolveEditItem(item, context) : null;
    const line = context.catalog.products.find(p => p.id === product?.productId);
    if (!product || !line || !product.shadeId) return;
    if (commit(data => data.owned.some(o => o.shadeId === product.shadeId && o.product === product.title && o.brand === product.brand && o.shade === product.shade) ? data : ({ ...data, owned: [...data.owned, { id: crypto.randomUUID(), category: line.category, brand: product.brand, product: product.title, shade: product.shade, shadeId: product.shadeId }] }))) setMessage("Exact shade marked as owned in your existing makeup bag. No routine or collection identity was replaced.");
  };
  return <main className="content mvp-page">
    <Heading eyebrow="MAXIMALISM WITH CAUTION" title="Your Neu Edit.">More looks. Fewer unnecessary products. A considered collection you can use in different ways, not a new shopping list for every mood.</Heading>
    <div className="mvp-actions"><Link className="mvp-link" href="/profile">Your complexion profile</Link><Link className="mvp-link" href="/routines">Explore looks</Link><Link className="mvp-link" href="/looks/saved">Your makeup bag & earlier looks</Link></div>
    <LooksStorageNotice />
    {conflict && <section className="mvp-notice" role="alert"><h2>The saved Edit has changed</h2><p>Your working collection is kept. Export the local library first if needed, then explicitly discard these edits to load the saved version.</p><Button variant="secondary" onClick={() => { setDraft(initialEditDraft(snapshot.data.wardrobe)); setPicker(null); setMessage("Loaded the saved collection."); }}>Discard working edits & load saved Edit</Button></section>}
    <section className="mvp-panel">
      <div className="mvp-row"><div><span className="mono">{draft.dirty ? "UNSAVED WORKING EDIT" : edit ? "YOUR COLLECTION" : "YOUR STARTING POINT"}</span><h2>{edit ? draft.name || "Untitled Edit" : "Start small. Leave room to play."}</h2></div>
        {edit && <Button disabled={!writable || !validName || !budget || conflict} onClick={save} data-testid="button-save-neu-edit">Save your Neu Edit</Button>}
      </div>
      <p className="mvp-muted">Core means a starting consideration, never a requirement. Profile or evidence changes recheck support without silently swapping anything. Working changes survive internal navigation but are not saved until you choose Save.</p>
      <Disclosure title="Collection name & budget" initialOpen={!edit}>
        <Typeahead label="Collection name (up to 200 characters)" value={draft.name} placeholder="Your Neu Edit" suggestions={[]} onChange={name => patch({ name })} />
        <Options label="Maximum brand tier" options={["Any", "Drugstore", "Mid-range", "Luxury"]} value={draft.tier} onChange={tier => patch({ tier: tier as LookBudget["tier"] })} />
        <Typeahead label="Optional new-purchase cap in USD" value={draft.limit} placeholder="Leave open, or enter an amount" suggestions={[]} onChange={limit => patch({ limit })} />
        {!budget && <p className="mvp-error" role="alert">Enter an amount above 0 and no more than 10,000, or leave the cap empty.</p>}
        {!validName && <p className="mvp-error" role="alert">Use a collection name of 1 to 200 characters.</p>}
      </Disclosure>
      <div className="mvp-actions"><Button variant={edit ? "secondary" : "primary"} disabled={!ready || !budget || !validName} onClick={() => setConfirm(true)} data-testid="button-create-edit">{edit ? "Refresh starting collection…" : "Create a focused starting Edit"}</Button>
        {edit && <Button variant="text" disabled={edit.items.length >= 60 || !ready} onClick={() => { setReuse(null); setPicker("new"); }} data-testid="button-add-edit-item">Add an optional extra</Button>}
      </div>
      {confirm && <section className="mvp-notice" role="group" aria-label="Confirm collection generation"><h3>{edit ? "Replace this working collection?" : "Create your starting collection?"}</h3><p>Consider up to four evidenced core options, with eligible owned makeup first. Gaps stay gaps. {edit ? "All replacement items get new identities. Saved routines keep their original item references, which may become unresolved." : "Nothing is purchased or saved automatically."}</p>
        <div className="mvp-actions"><Button variant="secondary" disabled={!ready || !budget || !validName} onClick={() => {
          if (!context || !evidence.profile || !budget) return;
          const next = initializeEdit(context, evidence.profile, budget, edit?.id ?? crypto.randomUUID(), draft.name.trim(), () => crypto.randomUUID());
          patch({ edit: next }); setConfirm(false); setPicker(null); setMessage("Working Edit created. Review the exact shades and gaps, then save when ready.");
        }} data-testid="button-confirm-create-edit">Confirm {edit ? "refresh" : "create"}</Button><Button variant="text" onClick={() => setConfirm(false)}>Keep things as they are</Button></div>
      </section>}
    </section>
    <EvidenceState loading={evidence.isLoading} error={evidence.isError} retry={evidence.retry} />
    {edit && context && <>
      <BudgetSummary edit={edit} context={context} />
      <p className="mvp-muted">Template reuse counts show possible labeled roles, not popularity or a promise of a complete look. Support is checked again in each routine.</p>
      {missingCore(edit, context).length > 0 && <p className="mvp-muted" data-testid="text-edit-gaps">Core roles left open or unsupported: {missingCore(edit, context).join(", ")}. These are options to explore, not a list of required purchases.</p>}
      {picker && <CollectionPicker key={picker} context={context} edit={edit} initialQuery={reuse?.product} initialRole={replacing?.role ?? (reuse ? ({ ...CORE_ROLES, Eyes: "Eyes", "Multi-use": "Cheeks", Setting: "Setting" }[reuse.category] as RoutineRole) : undefined)} replacing={!!replacing} onCancel={() => { setPicker(null); setReuse(null); }} onPick={option => {
        patch({ edit: replaceCollectionItem(edit, replacing?.id ?? null, option.item.choice, option.item.role, replacing?.optional ?? true, crypto.randomUUID()) }); setPicker(null); setMessage("Working collection updated. Saved routine references were not rewritten.");
      }} />}
      {!edit.items.length ? <EmptyState title="Room for a thoughtful first choice"><p>No product has sufficient evidence for this starting collection yet. Keep the gaps or explore an evidenced optional role.</p><Button variant="secondary" disabled={!ready} onClick={() => setPicker("new")}>Explore optional choices</Button></EmptyState>
        : <div className="mvp-two-col">{edit.items.map(item => <div key={item.id}>
          <EditItemCard item={item} edit={edit} context={context} onOptional={() => patch({ edit: { ...edit, items: edit.items.map(i => i.id === item.id ? { ...i, optional: !i.optional } : i) } })} onReplace={() => { setReuse(null); setPicker(item.id); }} onRemove={() => setRemove(item.id)} onOwn={() => own(item.id)}
            canOwn={writable && snapshot.data.owned.length < 200 && context.catalog.products.some(product => product.id === resolveEditItem(item, context)?.productId && OWNED_CATEGORIES.includes(product.category))} />
          {remove === item.id && <section className="mvp-notice" role="group" aria-label="Confirm collection removal"><p>Remove this item from the working Edit? Saved routines keep its ID and will show an unresolved step, not an automatic replacement.</p><div className="mvp-actions"><Button variant="secondary" onClick={() => { patch({ edit: { ...edit, items: edit.items.filter(i => i.id !== item.id) } }); setRemove(""); }}>Confirm remove item</Button><Button variant="text" onClick={() => setRemove("")}>Keep item</Button></div></section>}
        </div>)}</div>}
      <section className="mvp-panel"><h2>One collection, different expressions.</h2><p>Save your collection, then explore six adaptable routines. Skip anything, use a simpler version, or make more of the products you already have.</p><Link className="mvp-link" href="/routines">Explore looks with this Edit</Link>{draft.dirty && <p className="mvp-muted">Routines can preview this working Edit. Save it too if you want its item references to survive a browser reload.</p>}</section>
    </>}
    {edit && !context && <section className="mvp-panel"><h2>Your choices are retained</h2><ul className="mvp-muted">{edit.items.map(item => <li key={item.id}>{item.role}: {choiceLabel(item.choice, undefined, snapshot.data.owned)}</li>)}</ul><p className="mvp-muted">Support and product details cannot be checked until the catalog loads. Nothing has been replaced.</p></section>}
    {!edit && <EmptyState title="A wardrobe, not a fixed bundle"><p>Create a starting Edit when you are ready. Unknown traits stay unknown; there is no obligation to fill all four core categories.</p></EmptyState>}
    <Disclosure title="Optional color, coverage & lip preferences">
      <p className="mvp-muted">Saved context for future checks. Changing a preference never regenerates your collection. Lip pigmentation and layering can change the result; identical color on two-toned lips is not promised.</p>
      {LOOK_CATEGORIES.map(category => <Disclosure key={category} title={category}><CategoryPreferences category={category} draft={state.quiz} onChange={updateQuiz} /></Disclosure>)}
    </Disclosure>
    <Disclosure title="Manage your existing makeup bag">
      <OwnedInventory catalog={evidence.catalog} onReuse={item => {
        if (!edit) { setMessage("Create a starting Edit first, then choose an eligible item from your bag."); return; }
        if (!ready || edit.items.length >= 60) { setMessage("Wait for current evidence, or make room in the collection, before reviewing this owned option."); return; }
        setReuse(item); setPicker(`owned:${item.id}`); setMessage("Review the labeled role and exact owned shade above. A missing identity or unsupported use remains unavailable; ownership alone does not prove fit.");
      }} />
    </Disclosure>
    {message && <p className="mvp-notice" role="status" data-testid="status-edit-message">{message}</p>}
  </main>;
}
