import { useMemo, useState } from "react";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { useSearch } from "wouter";
import { Heading, Disclosure, EmptyState, Options, toggleItem } from "@/features/mvp/Controls";
import { ProfileSummary } from "@/features/mvp/ProfileSummary";
import { ProductCard } from "@/features/mvp/ProductCard";
import { Comparison } from "@/features/mvp/Comparison";
import { LAUNCH_CATEGORIES, RESEARCH_PRODUCTS, type LaunchCategory } from "@/features/mvp/catalog";
import { filterResearchProducts, validBudget, type BrowseFilters } from "@/features/mvp/browse";
import { usePreview } from "@/features/mvp/use-preview";

const BRANDS = [...new Set(RESEARCH_PRODUCTS.map((product) => product.brandName))].sort();
export default function ResultsPage() {
  const { state } = usePreview();
  const searchParams = useSearch();
  const [category, setCategory] = useState<LaunchCategory | "">(() => {
    const requested = new URLSearchParams(searchParams).get("category");
    return LAUNCH_CATEGORIES.includes(requested as LaunchCategory) ? requested as LaunchCategory : "";
  });
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState(state.quiz.budget);
  const [finish, setFinish] = useState(state.quiz.finish);
  const [coverage, setCoverage] = useState(state.quiz.coverage ?? "");
  const [includeUnknown, setIncludeUnknown] = useState(true);
  const [sort, setSort] = useState<BrowseFilters["sort"]>("alphabetical");
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [retailer, setRetailer] = useState("");
  const [skinType, setSkinType] = useState("");
  const [evidence, setEvidence] = useState<BrowseFilters["evidence"]>("historical-listing");
  const products = useMemo(() => filterResearchProducts(RESEARCH_PRODUCTS, { category, search, brand, budget, finish, coverage, includeUnknown, sort, retailer, skinType, evidence }), [category, search, brand, budget, finish, coverage, includeUnknown, sort, retailer, skinType, evidence]);
  const resetFilters = () => { setCategory(""); setSearch(""); setBrand(""); setBudget(""); setFinish(""); setCoverage(""); setIncludeUnknown(true); setSort("alphabetical"); setRetailer(""); setSkinType(""); setEvidence("historical-listing"); };
  const comparedProducts = RESEARCH_PRODUCTS.filter((product) => comparisonIds.includes(product.id));
  return <main className="content mvp-page">
    <Heading eyebrow="YOUR ANSWERS + RESEARCH" title="A starting point, not a verdict.">Edit your profile and explore Foundation, Concealer, Blush and Lips in one place. No match ranking or invented certainty.</Heading>
    <ProfileSummary compact />
    <aside className="mvp-notice">
      <h2>No verified shade match yet</h2>
      <p>We do not have enough evidence to identify an exact shade in your range. The 16 listings below were observed in historical retailer research, not selected for your complexion. Shade details, formulas, current prices and stock have not been verified.</p>
      <p>Your olive, muted, deep-skin and lip-pigmentation answers remain part of your own profile. They do not silently become product claims. Blush and lips are color exploration, not foundation shade matches.</p>
    </aside>
    <section className="mvp-panel" aria-labelledby="research-filters-heading">
      <div className="mvp-row"><h2 id="research-filters-heading">Explore the research library</h2><Button variant="text" onClick={resetFilters}>Clear filters</Button></div>
      <p className="mvp-muted">Browse controls are independent of profile editing. Your initial budget, finish and coverage entries can be used below, but changing your profile does not silently re-filter the library or create a match.</p>
      <Options label="Category" options={["All four", ...LAUNCH_CATEGORIES]} value={category || "All four"} onChange={(value) => setCategory(value === "All four" ? "" : value as LaunchCategory)} />
      <Options label="Recorded retailer" options={["All retailers", "Ulta", "Sephora", "Target"]} value={retailer === "www.ulta.com" ? "Ulta" : retailer === "www.sephora.com" ? "Sephora" : retailer === "www.target.com" ? "Target" : "All retailers"} onChange={(value) => setRetailer(value === "Ulta" ? "www.ulta.com" : value === "Sephora" ? "www.sephora.com" : value === "Target" ? "www.target.com" : "")} hint="Recorded source, not a claim of current retailer stock." />
      <div className="mvp-two-col">
        <Typeahead label="Search product or brand" value={search} placeholder="Search the recorded names" suggestions={[]} onChange={setSearch} />
        <Typeahead label="Brand filter (type any brand)" value={brand} placeholder="All recorded brands" suggestions={BRANDS} suggestionTag="Recorded brand" onChange={setBrand} />
      </div>
      <Disclosure title="Budget, finish, coverage and missing evidence">
        <Typeahead label="Maximum budget in US dollars" value={budget} placeholder="Flexible" suggestions={[]} onChange={setBudget} />
        {budget && !validBudget(budget) && <p role="status" className="mvp-error">Enter a non-negative number or clear the field. This budget entry is not applied.</p>}
        <Options label="Finish" options={["Natural", "Dewy", "Matte", "Satin", "No preference"]} value={finish} onChange={(value) => setFinish(finish === value ? "" : value)} />
        <Options label="Coverage" options={["Sheer", "Medium", "Full", "No preference"]} value={coverage} onChange={(value) => setCoverage(coverage === value ? "" : value)} />
        <Options label="Skin type evidence" options={["Dry", "Oily", "Combination", "No preference"]} value={skinType} onChange={(value) => setSkinType(skinType === value ? "" : value)} />
        <Options label="Evidence required" options={["Historical product listing", "Verified shade evidence only"]} value={evidence === "verified-shade" ? "Verified shade evidence only" : "Historical product listing"} onChange={(value) => setEvidence(value === "Verified shade evidence only" ? "verified-shade" : "historical-listing")} hint="None of these historical listings establishes exact-shade compatibility." />
        <Options label="When selected evidence is missing" options={["Include unknowns, clearly labeled", "Only documented matches to these filters"]} value={includeUnknown ? "Include unknowns, clearly labeled" : "Only documented matches to these filters"} onChange={(value) => setIncludeUnknown(value === "Include unknowns, clearly labeled")} />
        <p className="mvp-muted">Every price, finish and coverage field in this library is unknown, even if a product name contains one of these words. Including unknowns keeps exploratory listings visible, not verified within budget or compatible. Requiring documentation returns no listings when one of these filters is set. Skin type, fragrance, sensitivity, color family and application preferences cannot be checked against this evidence.</p>
      </Disclosure>
      <Options label="Sort listings" options={["Brand & product A–Z", "Source date, newest first", "Source date, oldest first"]} value={sort === "alphabetical" ? "Brand & product A–Z" : sort === "source-newest" ? "Source date, newest first" : "Source date, oldest first"} onChange={(value) => setSort(value === "Brand & product A–Z" ? "alphabetical" : value === "Source date, newest first" ? "source-newest" : "source-oldest")} hint="Source dates are historical observations, not fresh verification. All current records have the same source date; ties use alphabetical order." />
    </section>
    <div className="mvp-row"><h2>Research listings</h2><p role="status">{products.length} of {RESEARCH_PRODUCTS.length} listings · no match scores</p></div>
    {comparisonIds.length > 0 && <Comparison products={comparedProducts} onRemove={(id) => setComparisonIds(comparisonIds.filter((item) => item !== id))} onClear={() => setComparisonIds([])} />}
    {products.length > 0 ? <div className="mvp-grid">{products.map((product) => <ProductCard key={product.id} product={product} compare={comparisonIds.includes(product.id)} comparisonFull={comparisonIds.length >= 3} onCompare={() => setComparisonIds((current) => current.includes(product.id) || current.length < 3 ? toggleItem(current, product.id) : current)} />)}</div>
      : <EmptyState title="No listings meet these filters" action={<Button onClick={resetFilters}>Reset filters and explore</Button>}><p>Try another category, brand or search. If you required documented price, finish or coverage, this library cannot support that check yet. You can include unknowns without treating them as matches.</p></EmptyState>}
  </main>;
}
