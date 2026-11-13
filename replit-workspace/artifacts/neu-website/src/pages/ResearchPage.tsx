import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { getGetNeuResearchQueryKey, useGetNeuResearch, type NeuResearchEntry } from "@workspace/api-client-react";
import { Disclosure, EmptyState, Heading } from "@/features/mvp/Controls";
import { CatalogLoading } from "@/features/mvp/ReferenceEditor";

function ResearchEntry({ entry }: { entry: NeuResearchEntry }) {
  const sourceValid = /^https:\/\//.test(entry.sourceUrl);
  return <article className="mvp-product" data-testid={`card-research-${entry.id}`}>
    <span className="mono">{entry.platform} · {entry.status === "research_candidate" ? "EARLY RESEARCH" : "SUPPORTED FAVORITE"}</span>
    <h3>{entry.productName}</h3><p><strong>{entry.shade || "Exact shade not reported"}</strong></p>
    <p className="mvp-muted">Observed {entry.observedOn} · {entry.strength}</p>
    <p className="mvp-muted">Disclosure: {entry.disclosure || "Not disclosed"}</p>
    <dl className="mvp-facts">
      <div><dt>Reported characteristics, not verified profile facts</dt><dd>{entry.reportedCharacteristics.join(", ") || "Not reported"}</dd></div>
      <div><dt>Reported routine use</dt><dd>{entry.routines.join(", ") || "Not reported"}</dd></div>
      <div><dt>Independent source grouping</dt><dd>{entry.independentGroup || "Not established. No independent-mention count is inferred."}</dd></div>
    </dl>
    <Disclosure title="Reported experience & limitations" initialOpen>
      <h4 className="text-sm font-semibold text-primary">Positive observations</h4>
      {entry.positive.length ? <ul className="mvp-muted">{entry.positive.map((note, i) => <li key={i}>{note}</li>)}</ul> : <p className="mvp-muted">No positive observation recorded.</p>}
      <h4 className="text-sm font-semibold text-primary">Negative observations & limitations</h4>
      {entry.negative.length ? <ul className="mvp-muted">{entry.negative.map((note, i) => <li key={i}>{note}</li>)}</ul> : <p className="mvp-muted">No negative observation recorded. That is not evidence of no drawbacks.</p>}
    </Disclosure>
    {sourceValid ? <a className="mvp-link mvp-break" href={entry.sourceUrl} target="_blank" rel="noreferrer" data-testid={`link-research-source-${entry.id}`}>{entry.sourceUrl}</a> : <p className="mvp-muted">Public HTTPS source unavailable. Do not treat this entry as verified product evidence.</p>}
  </article>;
}

export default function ResearchPage() {
  const research = useGetNeuResearch({ query: { queryKey: getGetNeuResearchQueryKey(), staleTime: 60_000, retry: 1 }, request: { credentials: "include" } });
  const [query, setQuery] = useState("");
  const filtered = research.data?.entries.filter(entry => [entry.productName, entry.shade, entry.platform, ...entry.routines].join(" ").toLowerCase().includes(query.toLowerCase().trim())) ?? [];
  return <main className="content mvp-page">
    <Heading eyebrow="CURATED RESEARCH LIBRARY" title="Worth a closer look.">Public sources, considered carefully. Early discoveries stay separate from supported favorites. No invented endorsements, copied creator media or public posting.</Heading>
    <div className="mvp-actions"><Link href="/edit" className="mvp-link">Your Neu Edit</Link><Link href="/results" className="mvp-link">Catalog discovery</Link></div>
    <p className="mvp-muted">Research can inspire exploration, not establish complexion fit or eye/lip safety. Manufacturer labeling and fresh product evidence remain separate. Public community remains deferred.</p>
    {research.isLoading ? <section className="mvp-panel"><CatalogLoading /></section>
      : research.isError ? <EmptyState title="Research could not load" action={<Button variant="secondary" onClick={() => void research.refetch()} data-testid="button-retry-research">Try again</Button>}><p>No reviews or source activity have been substituted.</p></EmptyState>
        : <>
          <section className="mvp-panel"><Typeahead label="Find a product, shade or routine" value={query} placeholder="Search this curated library" suggestions={[...new Set(research.data?.entries.map(entry => entry.productName) ?? [])]} onChange={setQuery} /></section>
          {(["supported_favorite", "research_candidate"] as const).map(status => {
            const entries = filtered.filter(entry => entry.status === status);
            return <section key={status} className="my-6" aria-labelledby={`research-${status}`}>
              <h2 id={`research-${status}`}>{status === "supported_favorite" ? "Supported favorites" : "Early research candidates"}</h2>
              <p className="mvp-muted">{status === "supported_favorite" ? "Only entries classified as supported by the curated evidence appear here. A favorite is not a personal-fit guarantee." : "Starting leads with limited or incomplete independent experience. Not community favorites or endorsements."}</p>
              {!entries.length ? <EmptyState title={query ? "No matching entries in this group" : status === "supported_favorite" ? "No supported favorites established yet" : "No research candidates recorded yet"}><p>{query ? "Try another product, shade or routine." : "We leave this open rather than inventing social proof."}</p></EmptyState>
                : <div className="mvp-two-col">{entries.map(entry => <ResearchEntry key={entry.id} entry={entry} />)}</div>}
            </section>;
          })}
          {!!research.data?.notes.length && <section className="mvp-notice"><h2>How to read this research</h2>{research.data.notes.map((note, index) => <p className="mvp-muted" key={index}>{note}</p>)}</section>}
        </>}
  </main>;
}
