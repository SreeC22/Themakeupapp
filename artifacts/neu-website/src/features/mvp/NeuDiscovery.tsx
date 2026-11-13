import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { LAUNCH_CATEGORIES } from "./catalog";
import { CatalogCoverage, CatalogShadeCard } from "./CatalogEvidence";
import { CategoryPreferences } from "./CategoryPreferences";
import { Disclosure, EmptyState } from "./Controls";
import { CatalogLoading } from "./ReferenceEditor";
import { useNeuCatalog, useNeuRecommendations } from "./use-neu";
import { usePreview } from "./use-preview";

export function NeuDiscovery() {
  const { state, updateQuiz } = usePreview();
  const catalog = useNeuCatalog();
  const recommendations = useNeuRecommendations(state.quiz);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  return <section aria-labelledby="discovery-title">
    <h2 id="discovery-title">Four ways to make it yours.</h2>
    <p className="mvp-muted">Descriptor-aligned candidates are separate from limited-evidence suggestions and playful color exploration. None is an exact cross-brand match. Edit preferences in context; they are saved separately for each category.</p>
    <nav className="mvp-actions" aria-label="Discovery categories">{LAUNCH_CATEGORIES.map((category) => <a key={category} href={`#discover-${category.toLowerCase()}`} className="mvp-link">{category}</a>)}</nav>
    <Disclosure title="Discovery budget (optional)">
      <Typeahead label="Budget in US dollars" value={state.quiz.budget} placeholder="Leave open for flexible" suggestions={[]} onChange={(budget) => updateQuiz({ ...state.quiz, budget: budget.slice(0, 100) })} />
      <p className="mvp-muted">Saved with your profile. Verified current prices are unavailable, so no price fit is promised.</p>
    </Disclosure>
    {catalog.isError && <EmptyState title="The reviewed catalog could not load" action={<Button variant="secondary" onClick={() => void catalog.refetch()}>Retry reviewed catalog</Button>}><p>We have not substituted historical records or invented shade data. Your saved preferences are still available below.</p></EmptyState>}
    {recommendations.isError && <EmptyState title="Candidates could not be prepared" action={<Button variant="secondary" onClick={recommendations.retry}>Retry recommendations</Button>}><p>Your profile and preferences are still here. No fallback matches have been generated. You can continue exploring the separate historical research library.</p></EmptyState>}
    {recommendations.data && <aside className="mvp-notice" data-testid="status-recommendation-notes">
      <h3>How to read your candidates</h3><ul>{recommendations.data.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      <p className="mvp-muted">{recommendations.data.excludedCount} candidates excluded by the evidence rules. An exclusion does not judge your skin or your style.</p>
      {state.quiz.products.some((item) => !item.catalogShadeId) && <p className="mvp-muted">Your self-reported references remain in your profile. Missing catalog identities cannot support precise cross-brand alignment.</p>}
    </aside>}
    {LAUNCH_CATEGORIES.map((category) => {
      const candidates = recommendations.data?.candidates.filter((item) => item.category === category) ?? [];
      return <section key={category} id={`discover-${category.toLowerCase()}`} className="my-8" aria-labelledby={`title-${category}`} data-testid={`section-discovery-${category}`}>
        <div className="mvp-row"><h2 id={`title-${category}`}>{category}</h2><Link href="/profile" className="mvp-link">Edit complexion & references</Link></div>
        <Disclosure title={`${category} preferences`}><CategoryPreferences category={category} draft={state.quiz} onChange={updateQuiz} /></Disclosure>
        {catalog.isLoading || recommendations.isLoading ? <div className="mvp-panel"><CatalogLoading /></div> : catalog.data && recommendations.data ? <>
          {candidates.length === 0 ? <EmptyState title={`No supported ${category.toLowerCase()} candidates yet`}><p>Current evidence cannot support candidates for this profile and these preferences. Keep your choices, edit them above or browse historical research below. We will not fill this gap with a made-up match.</p></EmptyState>
            : (["Descriptor-aligned candidate", "Limited-evidence suggestion", "Color exploration"] as const).map((label) => {
              const group = candidates.filter((item) => item.label === label);
              const groupId = `${category}-${label}`;
              const expanded = expandedGroups.includes(groupId);
              const visible = expanded ? group : group.slice(0, 3);
              return group.length ? <div key={label}><h3>{label === "Descriptor-aligned candidate" ? "Descriptor-aligned candidates" : label === "Limited-evidence suggestion" ? "Limited-evidence suggestions" : label}</h3>
                <p className="mvp-muted">{group.length} {group.length === 1 ? "candidate" : "candidates"} · ordered by descriptor support, not guaranteed fit</p>
                <div className="mvp-grid">{visible.map((candidate) => {
                  const shade = catalog.data!.shades.find((item) => item.id === candidate.shadeId && item.productId === candidate.productId);
                  return shade ? <CatalogShadeCard key={shade.id} catalog={catalog.data!} shade={shade} candidate={candidate} /> : <aside className="mvp-panel" key={candidate.shadeId}><h3>Candidate evidence changed</h3><p className="mvp-muted">This shade cannot be resolved against the loaded catalog. No details have been invented.</p><Button variant="secondary" onClick={() => { void catalog.refetch(); recommendations.retry(); }}>Refresh evidence</Button></aside>;
                })}</div>
                {group.length > 3 && <Button variant="secondary" aria-expanded={expanded} onClick={() => setExpandedGroups((current) => expanded ? current.filter((item) => item !== groupId) : [...current, groupId])}>{expanded ? "Show fewer" : `Show ${group.length - visible.length} more ${category.toLowerCase()} candidates`}</Button>}
              </div> : null;
            })}
        </> : <p className="mvp-muted">Candidates are unavailable until the catalog and recommendation service are ready. Retry above; your category preferences are preserved.</p>}
      </section>;
    })}
    {catalog.data && <CatalogCoverage catalog={catalog.data} />}
  </section>;
}
