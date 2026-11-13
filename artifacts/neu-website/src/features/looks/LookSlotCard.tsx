import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import type { NeuCatalog } from "@workspace/api-client-react";
import { Disclosure, EmptyState } from "../mvp/Controls";
import { sameChoice, type LookChoice, type LookOption, type LookSlot, type OwnedProduct } from "./model";
import { choiceLabel } from "./helpers";

export function LookSlotCard({ slot, requested, catalog, owned, onChoose, onOwn }: {
  slot: LookSlot; requested: LookChoice | null | undefined; catalog: NeuCatalog; owned: OwnedProduct[];
  onChoose: (choice: LookChoice | null) => void; onOwn: (option: LookOption) => void;
}) {
  const selected = slot.selected;
  return <section className="mvp-product" aria-label={`${slot.category} look slot`} data-testid={`card-look-slot-${slot.category}`}>
    <span className="mono">{slot.category}</span>
    <h2>{selected?.title ?? "Unresolved slot"}</h2>
    {selected ? <><p>{selected.brand} · {selected.shade}</p>
      <p className="mvp-muted">{selected.owned ? "Already owned · no new purchase" : selected.priceUSD === null ? "Price unverified" : `Verified source price: $${selected.priceUSD.toFixed(2)} USD`}</p>
      <p className="mvp-muted">{selected.supported ? slot.category === "Foundation" || slot.category === "Concealer" ? "Descriptor-aligned candidate, not a tested match" : "Source color family available; styling direction is editorial" : "Explicit limited-evidence choice"}</p>
      <Evidence option={selected} />
    </> : <p className="mvp-muted">{requested ? `Preserved choice: ${choiceLabel(requested, catalog, owned)}` : "No product selected. This slot will stay empty until you choose."}</p>}
    {slot.unresolved.map(note => <p key={note} className="mvp-error" data-testid={`status-unresolved-${slot.category}`}>{note}</p>)}
    <div className="mvp-actions">
      <Button variant="text" onClick={() => onChoose(null)} disabled={!requested && !selected} data-testid={`button-clear-slot-${slot.category}`}>Leave {slot.category} empty</Button>
    </div>
    <Disclosure title={`Customize ${slot.category} · ${slot.options.length} available options`}>
      <p className="mvp-muted">Choosing one product only updates this slot. Limited-evidence options are your explicit choice, not a verified personal match.</p>
      {slot.options.length === 0 ? <EmptyState title="No available alternative"><p>Current source evidence, your profile or this budget tier does not support an option here. Edit your profile or budget, or add a self-reported owned product below. Nothing is substituted.</p></EmptyState>
        : slot.options.map(option => <article className="mvp-product" key={option.choice.kind === "catalog" ? option.choice.shadeId : option.choice.ownedId}>
          <h3>{option.title}</h3><p>{option.brand} · {option.shade}</p>
          <p className="mvp-muted">{option.owned ? "Owned · no new purchase" : option.priceUSD === null ? "Price unverified" : `$${option.priceUSD.toFixed(2)} USD · verified source price`}</p>
          {!option.supported && <p className="mvp-error">Limited evidence. Not a verified personal match or coordinated color recommendation.</p>}
          <Evidence option={option} />
          <div className="mvp-actions">
            <Button variant="secondary" aria-pressed={sameChoice(requested, option.choice)} onClick={() => onChoose(option.choice)}>{sameChoice(requested, option.choice) ? "Selected" : option.supported ? `Use in ${slot.category}` : "Choose anyway, with these limits"}</Button>
            {!option.owned && <Button variant="text" disabled={owned.some(o => option.choice.kind === "catalog" && o.shadeId === option.choice.shadeId)} onClick={() => onOwn(option)}>{owned.some(o => option.choice.kind === "catalog" && o.shadeId === option.choice.shadeId) ? "In your makeup bag" : "Mark as already owned"}</Button>}
          </div>
        </article>)}
    </Disclosure>
  </section>;
}

function Evidence({ option }: { option: LookOption }) {
  return <Disclosure title="Reasons, limits & source">
    <ul>{option.reasons.map((reason, index) => <li key={`reason-${index}`}>{reason}</li>)}</ul>
    <ul className="mvp-muted">{option.limitations.map((limit, index) => <li key={`limit-${index}`}>{limit}</li>)}</ul>
    <div className="mvp-actions">
      {option.detailPath && <Link className="mvp-link" href={option.detailPath}>Read catalog shade evidence</Link>}
      {!option.owned && option.sourceUrl && <a className="mvp-link" href={option.sourceUrl} target="_blank" rel="noreferrer">Shop / visit manufacturer source</a>}
    </div>
    {!option.owned && option.sourceUrl && <p className="mvp-muted">External source only. Current price, stock and checkout are not confirmed here.</p>}
  </Disclosure>;
}
