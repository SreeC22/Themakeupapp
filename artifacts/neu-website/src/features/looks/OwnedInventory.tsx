import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import type { NeuCatalog } from "@workspace/api-client-react";
import { Disclosure, EmptyState, Options } from "../mvp/Controls";
import { LOOK_CATEGORIES, type LookCategory, type OwnedProduct } from "./model";
import { looksUsingOwned } from "./helpers";
import { useLooks } from "./use-looks";
import { usePreview } from "../mvp/use-preview";

const blank = (): OwnedProduct => ({ id: "", category: "Foundation", brand: "", product: "", shade: "" });
const exact = <T extends { name: string }>(items: T[], name: string) => {
  const matches = items.filter(item => item.name.toLowerCase() === name.trim().toLowerCase());
  return matches.length === 1 ? matches[0] : undefined;
};

export function OwnedInventory({ catalog, onReuse }: { catalog?: NeuCatalog; onReuse?: (item: OwnedProduct) => void }) {
  const { snapshot, changed, commit, startNewLook } = useLooks();
  const [, navigate] = useLocation();
  const { state } = usePreview();
  const [draft, setDraft] = useState<OwnedProduct>(blank);
  const [draftBase, setDraftBase] = useState("");
  const [editing, setEditing] = useState(false);
  const [removeId, setRemoveId] = useState("");
  const [message, setMessage] = useState("");
  const data = snapshot.data;
  const brand = exact(catalog?.brands ?? [], draft.brand);
  const products = catalog?.products.filter(p => p.brandId === brand?.id && p.category === draft.category) ?? [];
  const product = exact(products, draft.product);
  const shades = catalog?.shades.filter(s => s.productId === product?.id) ?? [];
  const shade = exact(shades, draft.shade);
  const writable = snapshot.status === "ready" && !changed;
  const currentItem = data.owned.find(item => item.id === draft.id);
  const editConflict = !!draft.id && JSON.stringify(currentItem) !== draftBase;
  const valid = draft.product.trim().length > 0 && [draft.brand, draft.product, draft.shade].every(s => s.length <= 200);
  const references = state.quiz.products.flatMap(ref => {
    const source = catalog?.shades.find(s => s.id === ref.catalogShadeId);
    const line = catalog?.products.find(p => p.id === source?.productId);
    const maker = catalog?.brands.find(b => b.id === line?.brandId);
    if (!source || !line || !maker || data.owned.some(o => o.shadeId === source.id)) return [];
    return [{ id: source.id, category: line.category, brand: maker.name, product: line.name, shade: source.name }];
  }).filter((ref, index, list) => list.findIndex(item => item.id === ref.id) === index);
  const addReference = (ref: typeof references[number]) => {
    setMessage("");
    if (data.owned.length >= 200) { setMessage("The local inventory holds up to 200 items. Remove an item before adding another."); return; }
    if (commit(current => ({ ...current, owned: [...current.owned, { ...ref, id: crypto.randomUUID(), shadeId: ref.id }] }))) {
      setMessage("Marked as owned. It has not been selected for a look.");
    }
  };
  return <section className="mvp-panel" aria-labelledby="owned-heading">
    <div className="mvp-row"><div><span className="mono">REUSE WHAT YOU HAVE</span><h2 id="owned-heading">Your makeup bag</h2></div><p className="mvp-muted">{data.owned.length} / 200 items · this browser</p></div>
    <p className="mvp-muted">Ownership is self-reported, not proof of fit or compatibility. An owned item means no new purchase in a look, not a verified product price. Adding it here never replaces a slot.</p>
    {data.owned.length === 0 ? <EmptyState title="Start with what you already own"><p>Add an exact catalog shade or a product absent from the catalog. Then choose it explicitly in a look.</p></EmptyState>
      : <div className="mvp-stack">{data.owned.map(item => <article key={item.id} className="mvp-product" data-testid={`card-owned-${item.id}`}>
        <h3>{item.product}</h3><p>{[item.brand, item.shade].filter(Boolean).join(" · ") || "Brand and shade left open"}</p>
        <p className="mvp-muted">{item.category} · {item.shadeId ? "Catalog identity recorded; ownership is self-reported" : "Self-reported item, no catalog identity"}</p>
        <div className="mvp-actions">
          {onReuse ? <Button variant="secondary" onClick={() => onReuse(item)} data-testid={`button-reuse-owned-${item.id}`}>Use in {item.category}</Button> : <Button variant="text" onClick={() => navigate(startNewLook())}>Use in a new look</Button>}
          <Button variant="text" onClick={() => { setDraft({ ...item }); setDraftBase(JSON.stringify(item)); setEditing(true); }} data-testid={`button-edit-owned-${item.id}`}>Edit item</Button>
          <Button variant="text" disabled={!writable} onClick={() => setRemoveId(item.id)} data-testid={`button-remove-owned-${item.id}`}>Remove item</Button>
        </div>
        {removeId === item.id && <div className="mvp-notice" role="group" aria-label="Confirm removing owned product">
          <p>Remove this inventory item? {looksUsingOwned(data.looks, item.id).length} saved looks reference it. Their references will remain unchanged and become unresolved. A working look using this item will also keep its reference. No replacement is selected.</p>
          <div className="mvp-actions"><Button variant="secondary" onClick={() => {
            setMessage("");
            if (commit(current => ({ ...current, owned: current.owned.filter(o => o.id !== item.id) }))) {
              setRemoveId(""); setMessage("Inventory item removed. Saved references were kept, not replaced.");
            }
          }} data-testid={`button-confirm-remove-owned-${item.id}`}>Confirm remove</Button><Button variant="text" onClick={() => setRemoveId("")}>Keep item</Button></div>
        </div>}
      </article>)}</div>}
    <div className="mvp-actions"><Button variant="secondary" onClick={() => { setDraft(blank()); setEditing(true); }} data-testid="button-add-owned">Add an owned product</Button></div>
    {editing && <div className="mvp-inline-editor mvp-stack" role="group" aria-label={draft.id ? "Edit owned item" : "Add owned item"}>
      <h3>{draft.id ? "Edit owned item" : "Add what you own"}</h3>
      {draft.id && <p className="mvp-muted">Saved looks referencing this inventory ID will show the edited item. Review those looks after changing its identity.</p>}
      {editConflict && <div className="mvp-notice" role="alert">
        <p>This owned item changed or was removed from the reloaded library. Your edits are kept; updating the original is blocked.</p>
        <div className="mvp-actions">
          {currentItem && <Button variant="secondary" onClick={() => { setDraft({ ...currentItem }); setDraftBase(JSON.stringify(currentItem)); }}>Discard edits & reload owned item</Button>}
          <Button variant="text" onClick={() => setDraft(item => ({ ...item, id: "" }))}>Keep edited values as a new owned item</Button>
        </div>
      </div>}
      <Options label="Product category" options={LOOK_CATEGORIES} value={draft.category} onChange={category => setDraft(d => ({ ...d, category: category as LookCategory, product: "", shade: "", shadeId: undefined }))} />
      <Typeahead label="Brand (optional)" value={draft.brand} placeholder="Type your brand" suggestions={catalog?.brands.map(b => b.name) ?? []} onChange={value => setDraft(d => ({ ...d, brand: value, product: "", shade: "", shadeId: undefined }))} />
      <Typeahead label="Product" value={draft.product} placeholder="Type a product, including one not listed" suggestions={products.map(p => p.name)} onChange={value => setDraft(d => ({ ...d, product: value, shade: "", shadeId: undefined }))} />
      <Typeahead label="Shade (optional)" value={draft.shade} placeholder="Type your shade" suggestions={shades.map(s => s.name)} onChange={value => setDraft(d => ({ ...d, shade: value, shadeId: undefined }))} />
      <p className="mvp-muted">{shade ? "Exact catalog identity found. This is not a fit confirmation." : "No exact catalog identity selected. Save as a self-reported item without inventing a catalog match."} Each field is limited to 200 characters.</p>
      <div className="mvp-actions"><Button variant="secondary" disabled={!writable || !valid || editConflict || !draft.id && data.owned.length >= 200} onClick={() => {
        setMessage("");
        if (editConflict) return;
        const item: OwnedProduct = { ...draft, id: draft.id || crypto.randomUUID(), brand: draft.brand.trim(), product: draft.product.trim(), shade: draft.shade.trim(), shadeId: shade?.id ?? (draft.id ? draft.shadeId : undefined) };
        if (commit(current => ({ ...current, owned: draft.id ? current.owned.map(o => o.id === draft.id ? item : o) : [...current.owned, item] }))) {
          setEditing(false); setDraft(blank()); setMessage("Owned item saved locally. Choose Use in a category to reuse it explicitly.");
        }
      }} data-testid="button-save-owned">{draft.id ? "Confirm update item" : "Save owned item"}</Button><Button variant="text" onClick={() => setEditing(false)}>Cancel</Button></div>
    </div>}
    {references.length > 0 && <Disclosure title="Mark an exact profile reference as owned">
      <p className="mvp-muted">A profile reference does not prove you own it now. Only mark products you actually own.</p>
      {references.map(ref => <div key={ref.id} className="mvp-product"><p>{ref.brand} · {ref.product} · {ref.shade}</p><Button variant="secondary" disabled={!writable || data.owned.length >= 200} onClick={() => addReference(ref)}>I own this product</Button></div>)}
    </Disclosure>}
    {message && <p className="mvp-muted" role="status">{message}</p>}
  </section>;
}
