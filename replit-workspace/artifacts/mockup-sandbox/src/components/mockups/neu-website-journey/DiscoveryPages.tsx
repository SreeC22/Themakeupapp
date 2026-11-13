import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  PackageSearch,
  Search,
  Sparkles,
} from "lucide-react";
import { CATEGORIES, DEPTHS, SAMPLE_PRODUCTS, type NeuPage, type ProductExample, type Profile } from "./data";
import { Eyebrow, ExampleNotice, PageIntro, ProductCard } from "./Shared";

export function HomePage({ onNavigate }: { onNavigate: (page: NeuPage) => void }) {
  return (
    <main className="wj-content">
      <section className="wj-home-hero">
        <div className="wj-home-copy">
          <Eyebrow>A community for every shade story</Eyebrow>
          <h1>Makeup is a way<br />to <em>be more you.</em></h1>
          <p>Explore product notes, color theory and ideas from a range of skin tones. Find your own starting point, then keep what feels like you.</p>
          <div className="wj-home-actions">
            <button type="button" className="wj-primary" onClick={() => onNavigate("quiz")}>Build a starting point <ArrowRight size={16} /></button>
            <button type="button" className="wj-text-action" onClick={() => onNavigate("discover")}>Browse product examples <ArrowRight size={14} /></button>
          </div>
          <p className="wj-home-guest"><i />Explore Learn and Discover without an account.</p>
        </div>
        <figure className="wj-hero-art">
          <img
            src="/__mockup/images/neu-pigment-study.jpg"
            width={1024}
            height={1024}
            fetchPriority="high"
            decoding="async"
            alt="Loose makeup textures in dusty rose, soft mauve and warm neutral shades on an ivory surface."
          />
        </figure>
      </section>

      <section className="wj-home-how">
        <span className="wj-utility-label">FIND YOUR NEXT FAVOURITE, YOUR WAY</span>
        <div className="wj-home-steps">
          {[
            ["01", "Start where you are.", "Use an existing shade as an optional clue, or begin with a visual profile."],
            ["02", "Look around.", "Explore a clearly labeled example library and a public color guide."],
            ["03", "Make it your own.", "Share the shades and stories that feel like you. The community is a preview here."],
          ].map(([number, title, copy]) => (
            <article key={number}><span>{number}</span><div><h2>{title}</h2><p>{copy}</p></div></article>
          ))}
        </div>
      </section>

      <section className="wj-home-bottom">
        <div><span className="wj-utility-label">A LITTLE REMINDER</span><h2>There is not one right way to wear it.</h2></div>
        <p>Bare skin, sharp liner, a favorite shade. Start wherever you are, and keep what feels like you.</p>
        <button type="button" onClick={() => onNavigate("learn")} aria-label="Learn about color"><ArrowDownRight size={20} /></button>
      </section>

      <button className="wj-learn-promo" type="button" onClick={() => onNavigate("learn")}>
        <span className="wj-learn-promo-icon"><BookOpen size={19} /></span>
        <span><small>A LITTLE COLOR KNOWLEDGE</small><strong>Undertone, depth and color. Start with what feels right.</strong><span>A public guide, with room to experiment and make it your own.</span></span>
        <ArrowRight size={16} />
      </button>
    </main>
  );
}

const FILTER_CATEGORIES = ["All makeup", ...CATEGORIES.filter((category) => category !== "All makeup")];

export function DiscoverPage({
  profile,
  savedIds,
  onNavigate,
  onOpenProduct,
  onToggleSave,
}: {
  profile: Profile;
  savedIds: string[];
  onNavigate: (page: NeuPage) => void;
  onOpenProduct: (product: ProductExample) => void;
  onToggleSave: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All makeup");
  const [budget, setBudget] = useState("Any price");
  const [matchesOnly, setMatchesOnly] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return SAMPLE_PRODUCTS.filter((product) => {
      const matchesQuery = !normalized || `${product.brand} ${product.name} ${product.category} ${product.shade}`.toLowerCase().includes(normalized);
      const matchesCategory = category === "All makeup" || product.category === category;
      const matchesBudget = budget === "Any price" || product.price === budget;
      const matchesProfile = !matchesOnly || (
        (profile.undertone === null || profile.undertone === "Still exploring" || profile.undertone === product.undertone)
        && (profile.depth === null || Math.abs(profile.depth - product.depth) <= 1)
        && (profile.olive !== true || product.olive)
      );
      return matchesQuery && matchesCategory && matchesBudget && matchesProfile;
    });
  }, [budget, category, matchesOnly, profile, query]);

  const resetFilters = () => { setQuery(""); setCategory("All makeup"); setBudget("Any price"); setMatchesOnly(false); };

  return (
    <main className="wj-content">
      <section className="wj-discover-hero">
        <div className="wj-discover-copy">
          <Eyebrow>A more personal starting point</Eyebrow>
          <h1>Find your shade <em>in good company.</em></h1>
          <p>Discover product experiences from different skin depths, undertones and styles. Your browsing does not need an account.</p>
          <button type="button" className="wj-text-action" onClick={() => onNavigate("quiz")}>Build a starting point <ArrowRight size={15} /></button>
        </div>
        <div className="wj-example-callout"><span>ABOUT THESE RESULTS</span><strong>Examples, not live community posts.</strong><p>Brand and product names are real. Example shade labels, profile details and experiences are unverified design data.</p></div>
      </section>

      <section className="wj-discovery-controls" aria-label="Filter product examples">
        <label className="wj-search"><Search size={17} /><span className="wj-visually-hidden">Search example products</span><input type="search" placeholder="Search brands, products or category" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>/</kbd></label>
        <div className="wj-filter-line">
          <div className="wj-category-filter" aria-label="Product category">
            <button type="button" className={category === "All makeup" ? "is-active" : ""} onClick={() => setCategory("All makeup")}>All</button>
            {FILTER_CATEGORIES.slice(1).map((item) => <button key={item} type="button" className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <label className="wj-filter-select"><span>Price</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option>Any price</option><option>Drugstore</option><option>Mid-range</option><option>Prestige</option></select></label>
        </div>
        <div className="wj-match-filter-row">
          <label className="wj-match-toggle">
            <input type="checkbox" checked={matchesOnly} onChange={(event) => setMatchesOnly(event.target.checked)} />
            <span className="wj-toggle-track" aria-hidden="true"><i /></span>
            <span>Show examples near my profile</span>
          </label>
          <span>{filtered.length} example{filtered.length === 1 ? "" : "s"} shown</span>
        </div>
      </section>

      <section className="wj-discover-results" aria-labelledby="wj-discover-heading">
        <div className="wj-section-head">
          <div><span className="wj-utility-label">{matchesOnly ? "PROFILE FILTER, FOR EXPLORING" : "A FEW STARTING NOTES"}</span><h2 id="wj-discover-heading">{matchesOnly ? "A little closer to your profile." : "Makeup worth looking into."}</h2></div>
          <button type="button" className="wj-text-action" onClick={resetFilters}>Clear all filters <ArrowRight size={14} /></button>
        </div>
        {filtered.length ? (
          <div className="wj-product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => onOpenProduct(product)} isSaved={savedIds.includes(product.id)} onSave={() => onToggleSave(product.id)} />
            ))}
          </div>
        ) : (
          <div className="wj-empty-state">
            <span className="wj-empty-icon"><PackageSearch size={20} /></span>
            <Eyebrow>A quieter shelf</Eyebrow>
            <h2>No examples for that combination yet.</h2>
            <p>Clear a filter or try a wider search. Neu does not have a live catalog to fill in the gaps.</p>
            <button type="button" className="wj-secondary" onClick={resetFilters}>Clear filters <ArrowRight size={14} /></button>
          </div>
        )}
      </section>

      <div className="wj-bottom-invite">
        <Bookmark size={18} />
        <div><span>YOUR BEAUTY EDIT, KEPT</span><strong>A personal collection can come along for the ride.</strong><p>Saving and shared member accounts are shown as preview flows, not connected features.</p></div>
        <button type="button" className="wj-text-action" onClick={() => onNavigate("saved")}>Preview saved finds <ArrowRight size={14} /></button>
      </div>
    </main>
  );
}

export function ProductPage({ product, onNavigate, onSave, onReport, isSaved }: {
  product: ProductExample;
  onNavigate: (page: NeuPage) => void;
  onSave: () => void;
  onReport: () => void;
  isSaved: boolean;
}) {
  return (
    <main className="wj-content">
      <div className="wj-breadcrumb"><button type="button" onClick={() => onNavigate("discover")}>Discover</button><ChevronRight size={13} /><span>{product.category}</span><ChevronRight size={13} /><span>{product.brand}</span></div>
      <ExampleNotice>Product detail preview. Product names are real; product facts, formula, shade listings and member experiences are not verified.</ExampleNotice>
      <section className="wj-product-detail">
        <div className="wj-detail-art">
          <div className={`wj-product-art wj-product-art--${product.category.toLowerCase().replaceAll(" ", "-")}`} aria-hidden="true"><span>PRODUCT PREVIEW</span><i /><i /><i /></div>
          <p>Illustrative product card. No product photography or brand artwork used.</p>
        </div>
        <div className="wj-detail-copy">
          <span className="wj-utility-label">{product.category.toUpperCase()} / {product.price.toUpperCase()}</span>
          <h1>{product.brand} <em>{product.name}</em></h1>
          <p>Learn how a full product page could distinguish catalog information from a person’s own experience.</p>
          <div className="wj-detail-identity"><small>BRAND</small><strong>{product.brand}</strong><small>PRODUCT</small><strong>{product.name}</strong><small>FORMULA & SHADES</small><strong>Not verified for this design example</strong></div>
          <button type="button" className="wj-primary" onClick={() => onNavigate("shade")}>Explore shade detail <ArrowRight size={16} /></button>
          <button type="button" className={`wj-secondary wj-detail-save${isSaved ? " is-selected" : ""}`} onClick={onSave}>{isSaved ? <Check size={15} /> : <Bookmark size={15} />}{isSaved ? "In your preview saves" : "Save this example"}</button>
        </div>
      </section>
      <div className="wj-detail-experience">
        <div><span className="wj-utility-label">COMMUNITY EXPERIENCE</span><h2>Still waiting for real shade notes.</h2><p>There are no live community recommendations in this design preview. Notes will be shown with their author’s consent and product context when the community is connected.</p></div>
        <button type="button" className="wj-text-action" onClick={() => onNavigate("review")}>See how a note is attributed <ArrowRight size={14} /></button>
      </div>
      <div className="wj-safety-inline"><span>HAVE A PRODUCT DATA ISSUE?</span><button type="button" onClick={onReport}>Report a product detail concern <ArrowRight size={13} /></button></div>
    </main>
  );
}

export function ShadePage({ product, onNavigate }: { product: ProductExample; onNavigate: (page: NeuPage) => void }) {
  return (
    <main className="wj-content wj-narrow-content">
      <div className="wj-breadcrumb"><button type="button" onClick={() => onNavigate("product")}>Product</button><ChevronRight size={13} /><span>Shade detail</span></div>
      <ExampleNotice>This shade record is an empty catalog placeholder. Neu does not have a verified product shade source in this preview.</ExampleNotice>
      <section className="wj-shade-detail">
        <span className="wj-utility-label">{product.brand} / {product.name}</span>
        <div className="wj-shade-marker">?</div>
        <h1>Shade detail, <em>with room for truth.</em></h1>
        <p>On a real shade page, exact formula and variant names must match an approved source. We have not guessed a cross-brand shade equivalent.</p>
        <dl><div><dt>Exact catalog shade</dt><dd>Not verified</dd></div><div><dt>Product formula/version</dt><dd>Needs source review</dd></div><div><dt>Community notes</dt><dd>Not connected</dd></div></dl>
        <button type="button" className="wj-primary" onClick={() => onNavigate("review")}>View the note example <ArrowRight size={15} /></button>
      </section>
    </main>
  );
}

export function ReviewPage({ product, onNavigate, onReport }: {
  product: ProductExample;
  onNavigate: (page: NeuPage) => void;
  onReport: () => void;
}) {
  return (
    <main className="wj-content wj-narrow-content">
      <div className="wj-breadcrumb"><button type="button" onClick={() => onNavigate("product")}>Product</button><ChevronRight size={13} /><span>Example note</span></div>
      <div className="wj-sample-review-banner">ILLUSTRATIVE NOTE / NOT A REAL COMMUNITY MEMBER</div>
      <article className="wj-review-detail">
        <div className="wj-review-top"><span className="wj-profile-initials">Ex</span><div><strong>Illustrative member profile</strong><span>Sample content · not a submitted review</span></div><span className="wj-neutral-pill">Design example</span></div>
        <div className="wj-review-product"><span className="wj-utility-label">{product.brand}</span><h1>{product.name}</h1><p>{product.category} · shade entry unverified</p></div>
        <div className="wj-review-story"><p>“{product.notes}”</p><p>{product.routine}</p></div>
        <div className="wj-review-context"><small>PROFILE CONTEXT SHOWN ONLY FOR THE DESIGN</small><p>Depth {product.depth} · {product.undertone}{product.olive ? " · olive cast" : ""}</p><span>Sample context does not represent a real person or match result.</span></div>
        <div className="wj-review-footer"><span>Illustrative text only. This is not a product endorsement.</span><button type="button" onClick={onReport}>Preview a confidential report <ArrowRight size={13} /></button></div>
      </article>
      <button type="button" className="wj-text-action" onClick={() => onNavigate("product")}>Back to product detail <ArrowRight size={14} /></button>
    </main>
  );
}
