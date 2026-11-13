import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { Disclosure, EmptyState, Options } from "../mvp/Controls";
import { CatalogLoading } from "../mvp/ReferenceEditor";
import { choiceLabel } from "../looks/helpers";
import { ROLES, ROUTINES, assessStep, facts, resolveEditItem, reusableIn, type EditItem, type NeuEdit, type RoutineRole, type WardrobeContext } from "./model";
import { collectionOptions, editSpend, itemPrice } from "./helpers";

export function EvidenceState({ loading, error, retry }: { loading: boolean; error: boolean; retry: () => void }) {
  if (error) return <section className="mvp-notice" role="alert"><h2>Evidence is unavailable</h2><p>Your collection and edits are kept. We cannot confirm current product support yet.</p><Button variant="secondary" onClick={retry} data-testid="button-retry-edit-evidence">Try again</Button></section>;
  if (!loading) return null;
  return <section className="mvp-panel mvp-stack" aria-busy="true" aria-label="Checking current makeup evidence">
    <p className="mvp-muted" role="status">Checking current product and complexion evidence. Your selections will not be replaced.</p>
    <CatalogLoading />
  </section>;
}

export function BudgetSummary({ edit, context }: { edit: NeuEdit; context: WardrobeContext }) {
  const spend = editSpend(edit, context);
  if (!edit.items.length) return <div className="mvp-notice" data-testid="text-edit-budget"><p>No items selected. There is no collection total to verify yet.</p><p className="mvp-muted">Keep open roles as gaps, or choose only the evidenced options you want.</p></div>;
  return <div className="mvp-notice" data-testid="text-edit-budget">
    <p><strong>{spend.total === null ? `Known new-purchase subtotal: $${spend.known.toFixed(2)}` : `Collection new-purchase cost: $${spend.total.toFixed(2)}`}</strong>{edit.budget.limitUSD !== undefined ? ` · Your cap: $${edit.budget.limitUSD.toFixed(2)}` : " · No total cap set"}</p>
    <p className="mvp-muted">{spend.unknown ? `${spend.unknown} item price${spend.unknown === 1 ? " is" : "s are"} unknown. Overall budget fit is unverified.` : "Only fresh, verified prices are included; owned items add no new purchase."} {spend.over ? "The known subtotal exceeds your cap. Remove or swap an item before shopping." : ""} A tier is a maximum brand grouping, not a price guarantee. Confirm prices and exact shades at the source.</p>
  </div>;
}

export function EditItemCard({ item, edit, context, onOptional, onReplace, onRemove, onOwn, canOwn }: {
  item: EditItem; edit: NeuEdit; context: WardrobeContext;
  onOptional: () => void; onReplace: () => void; onRemove: () => void; onOwn: () => void; canOwn: boolean;
}) {
  const product = resolveEditItem(item, context);
  const assessment = assessStep({ id: "collection-review", role: item.role, enabled: true, itemId: item.id }, edit, context);
  const shade = context.catalog.shades.find(s => s.id === product?.shadeId);
  const candidate = context.recommendations?.candidates.find(c => c.shadeId === product?.shadeId);
  const reuse = reusableIn(item, context);
  const own = product?.owned || context.owned.some(o => o.shadeId === product?.shadeId && o.product === product?.title && o.brand === product?.brand && o.shade === product?.shade);
  const price = itemPrice(item, context);
  const versatility = product?.productId ? facts(context, product.productId, product.shadeId, "versatility") : [];
  const combination = product?.productId ? facts(context, product.productId, product.shadeId, "combination_role") : [];
  return <article className="mvp-product mvp-stack" data-testid={`card-edit-item-${item.id}`}>
    <div><span className="mono">{item.optional ? "OPTIONAL EXTRA" : "CORE CONSIDERATION"} · {item.role}</span>
      <p className="mvp-brand">{product?.brand || "Retained selection"}</p>
      <h2>{product?.title ?? choiceLabel(item.choice, context.catalog, context.owned)}</h2>
      <p><strong>{product?.shade || "Shade unknown"}</strong> · {own ? "Already in your makeup bag" : price === null ? "Price unverified" : `$${price.toFixed(2)} observed`}</p>
      {shade && <p className="mvp-muted">{shade.description}</p>}
    </div>
    <div><h3>Why it is here</h3><p className="mvp-muted">{candidate?.reasons.slice(0, 2).join(" ") || (own ? "You chose to reuse a product you own. Ownership is not a fit guarantee." : "Your collection choice, not an exact personal match.")}</p>
      <p className="mvp-muted">Contribution: {item.role.toLowerCase()} · Labeled role available in {reuse.length} of {ROUTINES.length} example templates.</p>
      <p className="mvp-muted">{assessment.status === "supported" ? "Labeled role supported by current evidence." : "Unresolved with current evidence."} {assessment.instructions}</p>
    </div>
    {(product?.claims.length || versatility.length || combination.length) ? <Disclosure title="Verified benefits & possible uses">
      {[...(product?.claims ?? []), ...versatility, ...combination].map((claim, index) => <p className="mvp-muted" key={`${claim}-${index}`}>{claim}</p>)}
      <p className="mvp-muted">Example templates: {reuse.join(", ") || "None supported"}. Product combinations are not tested layering guarantees.</p>
    </Disclosure> : null}
    {(assessment.missing.length > 0 || !!candidate?.limitations.length) && <Disclosure title="What is still uncertain">
      {[...assessment.missing, ...(candidate?.limitations ?? [])].map((note, index) => <p className="mvp-muted" key={`${note}-${index}`}>{note}</p>)}
    </Disclosure>}
    <div className="mvp-actions">
      {product?.detailPath && <Link className="mvp-link" href={product.detailPath} data-testid={`link-edit-detail-${item.id}`}>Shade & evidence</Link>}
      {product?.sourceUrl && <a className="mvp-link" href={product.sourceUrl} target="_blank" rel="noreferrer" data-testid={`link-edit-shop-${item.id}`}>Visit product source</a>}
    </div>
    <div className="mvp-actions">
      <Button variant="secondary" onClick={onReplace} data-testid={`button-swap-edit-${item.id}`}>Swap option</Button>
      {!own && <Button variant="text" onClick={onOwn} disabled={!canOwn} data-testid={`button-own-edit-${item.id}`}>I own this exact shade</Button>}
      <Button variant="text" onClick={onOptional} data-testid={`button-optional-edit-${item.id}`}>{item.optional ? "Move to core" : "Make optional"}</Button>
      <Button variant="text" onClick={onRemove} data-testid={`button-remove-edit-${item.id}`}>Remove</Button>
    </div>
  </article>;
}

/** The pilot has no select/dialog family. Compose its Typeahead, Choice and Button. */
export function CollectionPicker({ context, edit, initialRole, initialQuery = "", replacing, onPick, onCancel }: {
  context: WardrobeContext; edit: NeuEdit; initialRole?: RoutineRole; initialQuery?: string; replacing: boolean;
  onPick: (option: ReturnType<typeof collectionOptions>[number]) => void; onCancel: () => void;
}) {
  const [role, setRole] = useState<RoutineRole>(initialRole ?? "Lip gloss");
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(0);
  const options = collectionOptions(role, context, edit.budget);
  const filtered = options.filter(o => o.label.toLowerCase().includes(query.trim().toLowerCase()));
  const productNames = [...new Set(options.flatMap(o => {
    const product = resolveEditItem(o.item, context);
    return product ? [product.title] : [];
  }))];
  return <section className="mvp-panel mvp-stack" role="group" aria-label={replacing ? "Replace a collection choice" : "Add an optional collection choice"} data-testid="panel-collection-picker">
    <div className="mvp-row"><h2>{replacing ? "Choose an alternative" : "An extra, only if you want it"}</h2><Button variant="text" onClick={onCancel}>Close choices</Button></div>
    <p className="mvp-muted">{replacing ? "A swap creates a new item identity. Saved routines keep the old reference and will need an explicit new selection." : "Options are alternatives, not things you need. Nothing is added until you choose it."} Only labeled roles are offered; missing evidence never becomes cross-use permission.</p>
    <Options label="Contribution to your collection" options={ROLES.filter(r => r !== "Moisturizer" && r !== "SPF")} value={role} onChange={value => { setRole(value as RoutineRole); setPage(0); setQuery(""); }} />
    <Typeahead label="Filter by product, brand or exact shade" value={query} placeholder="Type a product line to see all of its eligible shades" suggestions={productNames} onChange={value => { setQuery(value); setPage(0); }} />
    {filtered.length === 0 ? <EmptyState title="No evidenced option for this role"><p>Keep the gap, skip that routine step, or review the profile. No substitute application or skincare product is invented.</p></EmptyState>
      : <><p className="mvp-muted">{filtered.length} eligible choices. Showing {page * 8 + 1} to {Math.min((page + 1) * 8, filtered.length)}. Alternatives, not a shopping checklist.</p>
        {filtered.slice(page * 8, (page + 1) * 8).map(option => <div className="mvp-comparison" key={option.item.choice.kind === "catalog" ? `catalog:${option.item.choice.shadeId}` : `owned:${option.item.choice.ownedId}`}>
          <p>{option.label}</p>
          <Button variant="secondary" onClick={() => onPick(option)} data-testid={`button-select-option-${option.item.choice.kind === "catalog" ? option.item.choice.shadeId : option.item.choice.ownedId}`}>{replacing ? "Confirm this replacement" : "Add this optional item"}</Button>
        </div>)}
        <div className="mvp-actions"><Button variant="text" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous choices</Button><Button variant="text" disabled={(page + 1) * 8 >= filtered.length} onClick={() => setPage(p => p + 1)}>More choices</Button></div>
      </>}
  </section>;
}
