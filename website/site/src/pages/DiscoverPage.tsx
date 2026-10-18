import { ArrowRight, Bookmark, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { CATEGORIES, PRODUCT_EXAMPLES, type ProductCategory, type Profile } from "@/data/neu";

const categories = ["All products", ...Object.values(CATEGORIES).flat()] as const;
type SelectedCategory = (typeof categories)[number];

function isCloseMatch(profile: Profile, product: (typeof PRODUCT_EXAMPLES)[number]) {
  return (profile.undertone === "Not sure" || profile.undertone === product.tone)
    && (!profile.oliveCast || product.oliveCast)
    && profile.skinType === product.skinType
    && Math.abs(profile.depth - product.depth) <= 1;
}

export default function DiscoverPage({ profile, profileReady = false }: { profile: Profile; profileReady?: boolean }) {
  const [category, setCategory] = useState<SelectedCategory>("All products");
  const [query, setQuery] = useState("");
  const [matchesOnly, setMatchesOnly] = useState(false);
  const posts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return PRODUCT_EXAMPLES.filter((post) =>
      (category === "All products" || post.category === category)
      && (!matchesOnly || !profileReady || isCloseMatch(profile, post))
      && (!normalized || `${post.brand} ${post.product} ${post.category} ${post.shade}`.toLowerCase().includes(normalized)),
    );
  }, [category, matchesOnly, profile, profileReady, query]);

  return (
    <main className="content">
      <section className="discover-intro">
        <div>
          <span className="eyebrow">A better starting point</span>
          <h1>Find your shade <em>in good company.</em></h1>
          <p>Explore makeup examples through skin depth, undertone and skin type. These are illustrative examples from the original design, not live community posts or verified matches.</p>
          <Link className="text-button" href="/profile">Add or adjust your skin profile <ArrowRight size={14} /></Link>
        </div>
        <div className="sample-callout"><strong>Example library, not member posts.</strong><br />Names and notes are sample content. Neu does not yet have connected community data.</div>
      </section>

      <section className="category-directory" aria-label="Browse example products by category">
        <div className="category-head"><div><span className="eyebrow">Find your kind of product</span><h2>Browse by category</h2></div>
          <button className="text-button" type="button" onClick={() => setCategory("All products")}>All products <ArrowRight size={14} /></button></div>
        <div className="category-groups">
          {Object.entries(CATEGORIES).map(([group, items]) => <div key={group}><h3>{group}</h3><div className="category-pills">
            {items.map((item) => <button key={item} type="button" className={`pill ${category === item ? "is-selected" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item as ProductCategory)}>{item}</button>)}
          </div></div>)}
        </div>
      </section>

      <section aria-labelledby="results-title">
        <div className="results-head"><div><span className="section-kicker">ILLUSTRATIVE EXAMPLES</span><h2 id="results-title">{matchesOnly ? "Close to your profile" : "A little inspiration to start"}</h2>
          <p>These editorial samples are not live member recommendations.</p></div>
          <div className="results-controls"><label className="search-field"><Search size={15} /><input type="search" aria-label="Search example products" placeholder="Search examples" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            {profileReady && <button type="button" className={`match-chip ${matchesOnly ? "is-selected" : ""}`} aria-pressed={matchesOnly} onClick={() => setMatchesOnly((current) => !current)}><Sparkles size={13} /> {matchesOnly ? "Showing profile examples" : "Compare profile examples"}</button>}
          </div></div>
        <div className="product-grid">
          {posts.map((post) => (
            <article className="product-card" key={post.id}>
              <div className="product-art"><span className="example-label">Design example</span><div className="product-object">{post.brand}</div></div>
              <div className="product-content">
                <div className="product-meta"><span>{post.category}</span><span>{post.tone}{post.oliveCast ? " · olive cast" : ""} · depth {post.depth} · {post.skinType.toLowerCase()}</span></div>
                <div className="product-brand">{post.brand}</div><h3>{post.product}</h3>
                <div className="shade-note">{post.shade}</div>
                <p className="product-note">“{post.note}”</p>
                <div className="routine"><small>IN THIS EXAMPLE ROUTINE</small><p>{post.routine}</p></div>
                <div className="sample-author">Sample profile: {post.author} · illustrative content</div>
                <Link className="text-button" href="/saved"><Bookmark size={14} /> About saved picks <ArrowRight size={14} /></Link>
                {matchesOnly && isCloseMatch(profile, post) && <span className="match-label">Similar profile example</span>}
              </div>
            </article>
          ))}
          {posts.length === 0 && <div className="empty-state"><strong>No examples match those filters.</strong><p>Try another category, clear your search, or show all example profiles.</p><button className="secondary" type="button" onClick={() => { setCategory("All products"); setQuery(""); setMatchesOnly(false); }}>Reset filters</button></div>}
        </div>
      </section>

      <section className="beta-note">
        <span className="beta-mark"><Bookmark size={19} /></span>
        <div><span className="mono">SHARED FEATURES NOT CONNECTED</span><h2>Keep your profile close. Shared notes are not connected yet.</h2><p>Saving products to an account and publishing shade notes need the separate account and shared-data setup.</p></div>
        <Link className="secondary" href="/share">About sharing <ArrowRight size={14} /></Link>
      </section>
    </main>
  );
}
