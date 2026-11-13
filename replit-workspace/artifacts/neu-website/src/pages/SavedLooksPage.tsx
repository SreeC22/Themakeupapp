import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Heading, EmptyState, Disclosure } from "@/features/mvp/Controls";
import { useNeuCatalog } from "@/features/mvp/use-neu";
import { LOOK_CATEGORIES } from "@/features/looks/model";
import { choiceLabel } from "@/features/looks/helpers";
import { useLooks } from "@/features/looks/use-looks";
import { LooksStorageNotice } from "@/features/looks/LooksStorageNotice";
import { OwnedInventory } from "@/features/looks/OwnedInventory";

export default function SavedLooksPage() {
  const { snapshot, changed, commit, startNewLook } = useLooks();
  const [, navigate] = useLocation();
  const catalog = useNeuCatalog();
  const [removeId, setRemoveId] = useState("");
  const [filter, setFilter] = useState<"all" | "four" | "drafts">("all");
  const count = (look: typeof snapshot.data.looks[number]) => LOOK_CATEGORIES.filter(category => look.selections[category]).length;
  const looks = [...snapshot.data.looks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).filter(look => filter === "all" || (filter === "four" ? count(look) === 4 : count(look) < 4));
  return <main className="content mvp-page">
    <Heading eyebrow="SAVED IN THIS BROWSER" title="Your looks, ready to revisit.">Complete selections and unfinished drafts live here. Open a look to revalidate it against your current profile and evidence. Saved choices are never silently replaced.</Heading>
    <div className="mvp-actions"><Button variant="text" onClick={() => navigate(startNewLook())}>Create a Neu Look</Button><Link className="mvp-link" href="/saved">Individually saved products</Link><Link className="mvp-link" href="/profile">Profile, export & privacy</Link></div>
    <LooksStorageNotice />
    <div className="mvp-actions" role="group" aria-label="Filter saved looks">
      <Button variant="text" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All looks</Button>
      <Button variant="text" aria-pressed={filter === "four"} onClick={() => setFilter("four")}>Four selections saved</Button>
      <Button variant="text" aria-pressed={filter === "drafts"} onClick={() => setFilter("drafts")}>Unfinished drafts</Button>
    </div>
    {catalog.isError && <div className="mvp-notice" role="alert"><p>Catalog names are temporarily unavailable. Your saved identifiers are preserved below. Opening a look will retry current evidence.</p><Button variant="secondary" onClick={() => void catalog.refetch()}>Retry catalog</Button></div>}
    {looks.length === 0 ? <EmptyState title={snapshot.status === "ready" ? "Room for your next look" : "Your saved library is protected"} action={<Button variant="text" onClick={() => navigate(startNewLook())}>Build a new look</Button>}><p>{snapshot.status === "ready" ? "No looks in this view yet. Start with a direction, set a budget and save all four selections or an unfinished draft." : "Saved data cannot be safely read. Export the original data above; it has not been overwritten."}</p></EmptyState>
      : <div className="looks-slots">{looks.map(look => <article className="mvp-product" key={look.id} data-testid={`card-saved-look-${look.id}`}>
        <span className="mono">{look.occasion}</span><h2>{look.name}</h2>
        <p>{count(look) === 4 ? "Four selections saved · revalidation required" : `Draft · ${count(look)} of 4 selections saved`}</p>
        <p className="mvp-muted">Maximum tier: {look.budget.tier}{look.budget.limitUSD !== undefined ? ` · New-purchase limit: $${look.budget.limitUSD.toFixed(2)} USD` : " · No overall limit"}. Price and availability are not verified by a saved record.</p>
        <p className="mvp-muted">Updated {new Date(look.updatedAt).toLocaleString()}</p>
        <Disclosure title="Saved selections, not current match claims"><dl className="mvp-facts">{LOOK_CATEGORIES.map(category => <div key={category}><dt>{category}</dt><dd>{choiceLabel(look.selections[category], catalog.data, snapshot.data.owned)}</dd></div>)}</dl></Disclosure>
        <div className="mvp-actions"><Link className="mvp-link" href={`/looks?edit=${encodeURIComponent(look.id)}`} data-testid={`link-edit-look-${look.id}`}>Open, revalidate & edit</Link><Button variant="text" disabled={snapshot.status !== "ready" || changed} onClick={() => setRemoveId(look.id)} data-testid={`button-delete-look-${look.id}`}>Delete look</Button></div>
        {removeId === look.id && <div className="mvp-notice" role="group" aria-label="Confirm deleting saved look"><p>Delete “{look.name}” from this browser? Your owned inventory and individually saved products will be kept. This cannot be undone.</p><div className="mvp-actions"><Button variant="secondary" onClick={() => {
          if (commit(data => ({ ...data, looks: data.looks.filter(item => item.id !== look.id) }))) setRemoveId("");
        }} data-testid={`button-confirm-delete-look-${look.id}`}>Confirm delete look</Button><Button variant="text" onClick={() => setRemoveId("")}>Keep look</Button></div></div>}
      </article>)}</div>}
    <OwnedInventory catalog={catalog.data} />
  </main>;
}
