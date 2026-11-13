import { useState } from "react";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Choice } from "@workspace/neu-design-system/components/neu/choice";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import type { QuizDraft, QuizProduct } from "../quiz/_shared/quizDraft";
import { Disclosure, EmptyState, Options } from "./Controls";
import { editReference, FIT_OPTIONS, newReference, oldProductMatch, OXIDATION_OPTIONS, resolveReference } from "./neu-profile";
import { useNeuCatalog } from "./use-neu";
import { mismatchObservations } from "../wardrobe/model";

export function CatalogLoading() {
  return <div className="mvp-stack" role="status" aria-label="Loading reviewed catalog" data-testid="status-catalog-loading">
    <div className="h-4 rounded-md bg-muted w-3/4" /><div className="h-4 rounded-md bg-muted w-1/2" />
    <span className="sr-only">Loading reviewed catalog</span>
  </div>;
}

export function ReferenceFields({ reference, onChange }: { reference: QuizProduct; onChange: (reference: QuizProduct) => void }) {
  const { data: catalog, isLoading, isError, refetch } = useNeuCatalog();
  const resolved = resolveReference(catalog, reference);
  const change = (patch: Partial<QuizProduct>) => onChange(editReference(reference, patch, catalog));
  const shade = catalog?.shades.find((item) => item.id === reference.catalogShadeId && item.productId === reference.catalogProductId);
  const observations = mismatchObservations(reference.match.map(value => value === "A little too light" ? "Too light" : value === "A little too dark" ? "Too dark" : value), reference.oxidation);
  return <div className="mvp-stack">
    <Options label="Reference product type" options={["Foundation", "Concealer"]} value={reference.type} onChange={(type) => change({ type: type as QuizProduct["type"] })} />
    {!["Foundation", "Concealer"].includes(reference.type) && <p className="mvp-muted">Your earlier {reference.type.toLowerCase()} note is preserved as self-reported. Choose foundation or concealer to search the reviewed catalog.</p>}
    {isLoading && <CatalogLoading />}
    {isError && <aside className="mvp-notice" role="status"><p>The reviewed catalog is unavailable. You can still keep a self-reported reference. Existing catalog IDs are preserved, but no new facts will be assumed.</p><Button variant="secondary" onClick={() => void refetch()}>Retry catalog</Button></aside>}
    <Typeahead label="Brand" value={reference.brand} placeholder="Type your brand" suggestions={catalog?.brands.map((item) => item.name) ?? []} suggestionTag="Catalog brand" onChange={(brand) => change({ brand: brand.slice(0, 200), brandUnknown: false })} />
    <Typeahead label={`Exact ${reference.type.toLowerCase()} product`} value={reference.product} placeholder="Type the product or line" suggestions={resolved.products.map((item) => item.name)} suggestionTag="Reviewed line" onChange={(product) => change({ product: product.slice(0, 200) })} />
    <Typeahead label="Exact shade name or code" value={reference.shade} placeholder="Type the shade you use" suggestions={resolved.shades.map((item) => item.name)} suggestionTag="Catalog shade" onChange={(value) => change({ shade: value.slice(0, 200), shadeUnknown: false })} />
    {resolved.shades.length > 0 && !reference.shade && <p className="mvp-muted">Start typing to search this product's {resolved.shades.length} recorded shades. Match the exact shade name or code, not a nearby number.</p>}
    {shade && <aside className="mvp-notice" data-testid={`status-reference-${reference.id}`}>
      <strong>Catalog reference selected: {shade.name}</strong><p>{shade.description || "No manufacturer shade description recorded."}</p>
      <p>{shade.status === "verified" ? "Source-backed shade identity, not a laboratory-validated match." : "Shade identity still needs review. Precise alignment may not be supported."} Your fit remains a personal observation.</p>
      {resolved.product && <a className="mvp-link" href={resolved.product.sourceUrl} target="_blank" rel="noopener noreferrer">Source · checked {resolved.product.checkedOn}</a>}
    </aside>}
    {!shade && (reference.brand || reference.product || reference.shade) && !isLoading && <p className="mvp-muted" role="status">
      {reference.catalogShadeId && !catalog ? "Catalog selection retained. Its evidence cannot be checked while the catalog is unavailable."
        : "Self-reported reference. Brand, product or exact shade is missing from the reviewed catalog. Keep typing your own entry; it will not become a catalog fact or a precise cross-brand match."}
    </p>}
    {catalog && resolved.brand && resolved.products.length === 0 && <p className="mvp-muted">This brand is in the selected directory, but no reviewed {reference.type.toLowerCase()} line is available here yet.</p>}
    <div>
      <p className="mvp-muted">Record depth and color separately. Perfect match and unsure stand alone. No corrected shade or automatic offset is inferred.</p>
      {[
        { label: "Depth fit", values: ["A little too light", "A little too dark"] },
        { label: "Color / undertone fit", values: ["Too yellow", "Too orange", "Too pink", "Gray or ashy"] },
        { label: "Overall observation", values: ["Blends in perfectly", "Not sure yet"] },
      ].map(group => <fieldset className="mvp-fieldset" key={group.label}><legend>{group.label}</legend><div className="mvp-options">{FIT_OPTIONS.filter(option => group.values.includes(option.value)).map(option => <Choice key={option.value} title={option.label} selected={reference.match.includes(option.value)} onClick={() => change({ match: oldProductMatch(reference.match, option.value) })} />)}</div></fieldset>)}
      {reference.match.length > 0 && <p className="mvp-muted" role="status">Depth: {observations.depth.join(", ") || "Not reported"}. Color: {observations.color.join(", ") || "Not reported"}. {observations.other.join(", ")}{observations.oxidation ? ` Oxidation: ${observations.oxidation}.` : ""}</p>}
    </div>
    <Disclosure title="Oxidation and other personal notes (optional)">
      <Options label="Color change after application" options={OXIDATION_OPTIONS} value={reference.oxidation ?? ""} onChange={(oxidation) => change({ oxidation: reference.oxidation === oxidation ? "" : oxidation })} hint="Your wear observation, not a manufacturer claim." />
      <Typeahead label="Formula or variant note" value={reference.formula} placeholder="If known" suggestions={[]} onChange={(formula) => change({ formula: formula.slice(0, 200) })} />
      <Options label="Unknown details" multiple options={["Brand unknown", "Shade unknown"]} value={[...(reference.brandUnknown ? ["Brand unknown"] : []), ...(reference.shadeUnknown ? ["Shade unknown"] : [])]} onChange={(value) => change(value === "Brand unknown" ? { brandUnknown: !reference.brandUnknown, brand: "" } : { shadeUnknown: !reference.shadeUnknown, shade: "" })} />
    </Disclosure>
  </div>;
}

export function ReferenceEditor({ draft, onChange }: { draft: QuizDraft; onChange: (draft: QuizDraft) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  return <section className="mvp-panel">
    <h2>Your reference shades</h2><p className="mvp-muted">Add, correct or remove references anytime. These are private, self-reported observations alongside any separately sourced catalog facts. Incorrect-fit references never become invented equivalents.</p>
    {!draft.products.length && <EmptyState title="No reference needed to begin"><p>Add one if you know a foundation or concealer shade. Otherwise, your manual traits are enough to explore.</p></EmptyState>}
    {draft.products.map((reference, index) => <article key={reference.id} className="mvp-disclosure">
      <div className="mvp-row"><div><strong>{reference.brand || reference.type} · {reference.product || "Product left open"}</strong><p className="mvp-muted">{reference.shade || (reference.shadeUnknown ? "Shade unknown" : "Shade left open")} · {reference.catalogShadeId ? "Catalog-linked reference" : "Self-reported reference"}</p><p className="mvp-muted">{reference.match.map((value) => value === "Blends in perfectly" ? "Perfect match" : value).join(", ") || "Fit left open"}{reference.oxidation ? ` · ${reference.oxidation}` : ""}</p></div>
        <div className="mvp-actions"><Button variant="text" aria-expanded={editingId === reference.id} aria-label={`Edit reference ${index + 1}`} onClick={() => setEditingId(editingId === reference.id ? null : reference.id)}>{editingId === reference.id ? "Close editor" : "Edit"}</Button><Button variant="text" aria-label={`Remove reference ${index + 1}`} onClick={() => setRemovingId(reference.id)}>Remove</Button></div>
      </div>
      {editingId === reference.id && <ReferenceFields reference={reference} onChange={(next) => onChange({ ...draft, products: draft.products.map((item) => item.id === next.id ? next : item) })} />}
      {removingId === reference.id && <div className="mvp-notice" role="group" aria-label={`Confirm removal of reference ${index + 1}`}><p>Remove this reference and its personal fit notes?</p><div className="mvp-actions"><Button variant="secondary" onClick={() => {
        onChange({ ...draft, products: draft.products.filter((item) => item.id !== reference.id), referenceProductId: draft.referenceProductId === reference.id ? null : draft.referenceProductId });
        setRemovingId(null);
      }}>Confirm remove</Button><Button variant="text" onClick={() => setRemovingId(null)}>Keep reference</Button></div></div>}
    </article>)}
    <Button variant="secondary" disabled={draft.products.length >= 50} onClick={() => {
      const reference = newReference();
      onChange({ ...draft, products: [...draft.products, reference], noCurrentMakeup: false, currentMakeupSkipped: false });
      setEditingId(reference.id);
    }}>Add a reference shade</Button>
    {draft.products.length >= 50 && <p className="mvp-muted">Your local profile holds up to 50 references. Remove one to add another.</p>}
  </section>;
}
