import { useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  Heart,
  Mail,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import "./CommunityFlow.css";

type View = "feed" | "share" | "saved" | "you";
type ProductCategory = "Base" | "Cheeks" | "Lips" | "Skin";
type Tone = "Warm" | "Cool" | "Neutral" | "Olive";

type Post = {
  id: string;
  handle: string;
  depth: number;
  tone: Tone;
  category: ProductCategory;
  brand: string;
  product: string;
  shade: string;
  note: string;
  rating: number;
  art: string;
  retailerUrl?: string;
};

const EXAMPLE_POSTS: Post[] = [
  {
    id: "example-base",
    handle: "softfocus",
    depth: 5,
    tone: "Olive",
    category: "Base",
    brand: "Fenty Beauty",
    product: "Eaze Drop Skin Tint",
    shade: "Shade 12",
    note: "Example note: the finish feels light, and the olive tone looks balanced in daylight.",
    rating: 5,
    art: "tint",
  },
  {
    id: "example-cheeks",
    handle: "petalnotes",
    depth: 3,
    tone: "Warm",
    category: "Cheeks",
    brand: "Rare Beauty",
    product: "Soft Pinch Liquid Blush",
    shade: "Virtue",
    note: "Example note: a sheer rosy wash that is easy to build without losing the skin underneath.",
    rating: 4,
    art: "blush",
  },
  {
    id: "example-skin",
    handle: "sunkissededit",
    depth: 7,
    tone: "Neutral",
    category: "Skin",
    brand: "Tower 28",
    product: "SunnyDays Tinted SPF",
    shade: "Melrose",
    note: "Example note: comfortable for everyday wear, with a natural-looking finish.",
    rating: 5,
    art: "spf",
  },
];

const CATEGORIES = ["All finds", "Base", "Cheeks", "Lips", "Skin"] as const;
const UNDERTONES: Tone[] = ["Warm", "Cool", "Neutral", "Olive"];
const SKIN_TONES = [
  "#F6EDE4",
  "#F3E7DB",
  "#F7EAD0",
  "#EADABA",
  "#D7BD96",
  "#A07E56",
  "#825C43",
  "#604134",
  "#3A312A",
  "#292420",
];

function ToneDot({ depth, size = "sm" }: { depth: number; size?: "sm" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={`tone-dot tone-dot-${size}`}
      style={{ "--tone-color": SKIN_TONES[Math.max(0, Math.min(9, depth - 1))] } as CSSProperties}
    />
  );
}

function Logo() {
  return (
    <span className="neu-logo" aria-label="Neu">
      neu<span className="logo-dot" />
    </span>
  );
}

function ProductArt({ kind }: { kind: string }) {
  return (
    <div className={`product-art product-art-${kind}`} aria-hidden="true">
      <span className="art-orbit art-orbit-one" />
      <span className="art-orbit art-orbit-two" />
      <span className="art-pack art-pack-main">
        <span className="pack-cap" />
        <span className="pack-mark">NEU<br />BEAUTY</span>
      </span>
      <span className="art-pack art-pack-small">
        <span className="pack-cap" />
      </span>
      <span className="art-shade" />
    </div>
  );
}

function ExampleMark() {
  return (
    <span className="example-mark">
      <Sparkles size={12} strokeWidth={1.8} />
      Example post
    </span>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 in this example`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span className={index < value ? "star-filled" : ""} key={index}>★</span>
      ))}
    </span>
  );
}

function PostCard({
  post,
  saved,
  onSave,
  compact = false,
  onRetailer,
}: {
  post: Post;
  saved: boolean;
  onSave: (id: string) => void;
  compact?: boolean;
  onRetailer: () => void;
}) {
  return (
    <article className={`recommendation-card${compact ? " recommendation-card-compact" : ""}`}>
      <div className="recommendation-topline">
        <ExampleMark />
        <span className="category-label">{post.category}</span>
      </div>
      <div className="recommendation-heading">
        <div className="member-mark">
          <ToneDot depth={post.depth} />
          <div>
            <strong>@{post.handle}</strong>
            <span>MST-{String(post.depth).padStart(2, "0")} · {post.tone}</span>
          </div>
        </div>
        <button
          className={`icon-button save-button${saved ? " is-saved" : ""}`}
          type="button"
          aria-label={saved ? "Remove from saved finds" : "Save this example find"}
          aria-pressed={saved}
          onClick={() => onSave(post.id)}
        >
          {saved ? <Heart size={18} fill="currentColor" /> : <Bookmark size={18} />}
        </button>
      </div>
      <div className="product-summary">
        <ProductArt kind={post.art} />
        <div className="product-copy">
          <span className="product-brand">{post.brand}</span>
          <h3>{post.product}</h3>
          <p>Shade <strong>{post.shade}</strong></p>
          <Stars value={post.rating} />
        </div>
      </div>
      <p className="post-note">{post.note}</p>
      <div className="recommendation-footer">
        <span className="wear-note">A shade story, shared.</span>
        <button className="text-action" type="button" onClick={onRetailer}>
          <ShoppingBag size={15} />
          Where to find it
        </button>
      </div>
    </article>
  );
}

function PreviewNotice({ children }: { children: ReactNode }) {
  return (
    <div className="preview-notice" role="note">
      <span className="notice-sparkle"><Sparkles size={14} /></span>
      <span>{children}</span>
    </div>
  );
}

function FeedView({
  posts,
  savedIds,
  onSave,
  onShare,
  onRetailer,
}: {
  posts: Post[];
  savedIds: Set<string>;
  onSave: (id: string) => void;
  onShare: () => void;
  onRetailer: () => void;
}) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All finds");
  const [toneOnly, setToneOnly] = useState(false);
  const [search, setSearch] = useState("");
  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((post) => {
      const categoryMatches = category === "All finds" || post.category === category;
      const toneMatches = !toneOnly || post.tone === "Olive";
      const searchMatches =
        !term ||
        `${post.brand} ${post.product} ${post.shade} ${post.handle}`.toLowerCase().includes(term);
      return categoryMatches && toneMatches && searchMatches;
    });
  }, [category, posts, search, toneOnly]);

  return (
    <>
      <section className="feed-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" />Beauty, in your own shade</p>
          <h1>Makeup is a way<br />of <em>being yourself.</em></h1>
          <p className="hero-description">
            Find the colors and products that feel like you. Share what you love, and help
            someone else find their next favorite.
          </p>
          <div className="hero-actions">
            <button className="button button-plum" type="button" onClick={onShare}>
              Share a find <ArrowRight size={16} />
            </button>
            <span className="no-photo-note"><Check size={14} /> No face photos</span>
          </div>
          <div className="hero-tone-row" aria-label="Skin tone palette">
            <span>Your tone, your starting point</span>
            <div className="tone-strip">
              {SKIN_TONES.map((tone, index) => (
                <span key={tone} style={{ backgroundColor: tone }} title={`Skin tone ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="hero-artboard">
          <div className="artboard-top">
            <span>COLOR NOTES</span>
            <span>NO. 01 / YOU</span>
          </div>
          <div className="artboard-composition">
            <div className="hero-swatches">
              <span className="hero-swatch swatch-berry" />
              <span className="hero-swatch swatch-clay" />
              <span className="hero-swatch swatch-caramel" />
              <span className="hero-swatch swatch-lilac" />
            </div>
            <div className="hero-product hero-product-tube">
              <span className="hero-tube-cap" />
              <span className="hero-product-name">COLOR<br />PLAY</span>
            </div>
            <div className="hero-product hero-product-compact">
              <span className="compact-center" />
            </div>
            <div className="hero-note-card">
              <span>YOUR BEAUTY, YOUR RULES</span>
              <strong>Try a little<br /><em>something new.</em></strong>
            </div>
            <span className="artboard-stamp">NEU<br />BEAUTY</span>
          </div>
          <div className="artboard-bottom">
            <span>Every shade has a story.</span>
            <span className="mini-flower" aria-hidden="true"><i /><i /><i /><i /><b /></span>
          </div>
        </div>
      </section>

      <section className="feed-section" aria-labelledby="community-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" />The community edit</p>
            <h2 id="community-title">Find your next <em>feel-good.</em></h2>
          </div>
          <button className="text-action share-inline" type="button" onClick={onShare}>
            <Plus size={16} /> Add your find
          </button>
        </div>
        <PreviewNotice>
          Example posts only. These are design samples, not member posts or reviews.
        </PreviewNotice>
        <div className="feed-controls">
          <label className="search-box">
            <Search size={17} />
            <span className="visually-hidden">Search example finds</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products, shades, brands" />
          </label>
          <div className="category-chips" role="group" aria-label="Filter by product category">
            {CATEGORIES.map((item) => (
              <button
                aria-pressed={category === item}
                className={`filter-chip${category === item ? " filter-chip-active" : ""}`}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <label className="tone-filter">
            <input checked={toneOnly} onChange={(event) => setToneOnly(event.target.checked)} type="checkbox" />
            <span className="tone-filter-mark"><Check size={12} /></span>
            My tone & nearby
          </label>
        </div>
        <div className="recommendation-grid">
          {filteredPosts.length ? filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              onRetailer={onRetailer}
              onSave={onSave}
              post={post}
              saved={savedIds.has(post.id)}
            />
          )) : (
            <div className="no-results">
              <Search size={20} />
              <strong>No example finds match those filters.</strong>
              <button className="text-action" type="button" onClick={() => { setCategory("All finds"); setToneOnly(false); setSearch(""); }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ShareView({ onPost }: { onPost: (post: Omit<Post, "id">) => void }) {
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    brand: "",
    product: "",
    category: "Base" as ProductCategory,
    shade: "",
    url: "",
    note: "",
  });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.brand.trim() || !form.product.trim() || !form.shade.trim() || !form.note.trim()) return;
    onPost({
      handle: "your-preview",
      depth: 5,
      tone: "Neutral",
      category: form.category,
      brand: form.brand.trim(),
      product: form.product.trim(),
      shade: form.shade.trim(),
      note: `Example preview note: ${form.note.trim()}`,
      rating,
      art: form.category === "Cheeks" ? "blush" : form.category === "Skin" ? "spf" : "tint",
      retailerUrl: form.url.trim() || undefined,
    });
    setMessage("Added to this preview only. It has not been published.");
    setForm({ brand: "", product: "", category: "Base", shade: "", url: "", note: "" });
  }
  return (
    <section className="inner-page">
      <div className="inner-page-head">
        <p className="eyebrow"><span className="eyebrow-line" />Your recommendation</p>
        <h1>Share a <em>find.</em></h1>
        <p>Tell us what you reached for, the exact shade, and how it made you feel.</p>
      </div>
      <div className="share-layout">
        <form className="editor-card" onSubmit={submit}>
          <div className="form-intro">
            <div className="form-intro-icon"><Sparkles size={20} /></div>
            <div><strong>Everyday favorite or new obsession?</strong><span>Both belong here.</span></div>
          </div>
          <div className="form-grid">
            <label>Brand<input maxLength={80} onChange={(event) => setForm({ ...form, brand: event.target.value })} placeholder="e.g. Tower 28" required value={form.brand} /></label>
            <label>Product<input maxLength={100} onChange={(event) => setForm({ ...form, product: event.target.value })} placeholder="e.g. SunnyDays SPF" required value={form.product} /></label>
            <label>Category<select onChange={(event) => setForm({ ...form, category: event.target.value as ProductCategory })} value={form.category}><option>Base</option><option>Cheeks</option><option>Lips</option><option>Skin</option></select></label>
            <label>Shade<input maxLength={80} onChange={(event) => setForm({ ...form, shade: event.target.value })} placeholder="The exact shade name" required value={form.shade} /></label>
            <label className="form-field-full">Where to find it <span className="optional-label">Optional</span><input onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="Paste a product link" type="url" value={form.url} /></label>
            <label className="form-field-full">What do you love about it?<textarea maxLength={500} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Share a detail that might help someone pick their shade." required rows={4} value={form.note} /><span className="field-hint">Up to 500 characters. Please do not include face photos.</span></label>
          </div>
          <fieldset className="rating-select">
            <legend>Would you buy it again?</legend>
            <div className="rating-pills">{[1, 2, 3, 4, 5].map((value) => <button aria-pressed={rating === value} className={rating === value ? "rating-pill selected" : "rating-pill"} key={value} onClick={() => setRating(value)} type="button">{value}</button>)}</div>
          </fieldset>
          {message && <p className="form-success" role="status"><Check size={15} />{message}</p>}
          <button className="button button-plum button-submit" type="submit"><Send size={15} /> Add to preview</button>
          <p className="privacy-line">In the real community, your handle and tone are public. Your email stays private.</p>
        </form>
        <aside className="share-aside">
          <div className="share-aside-art"><ProductArt kind="blush" /></div>
          <p className="eyebrow">A little note</p>
          <h2>Your taste is<br /><em>the recommendation.</em></h2>
          <p>Not a perfect routine. Not a “must-have.” Just something you tried and want to pass along.</p>
          <div className="aside-swatch-row">{SKIN_TONES.slice(2, 8).map((tone) => <span key={tone} style={{ background: tone }} />)}</div>
        </aside>
      </div>
    </section>
  );
}

function SavedView({ posts, savedIds, onSave, onBrowse, onRetailer }: {
  posts: Post[];
  savedIds: Set<string>;
  onSave: (id: string) => void;
  onBrowse: () => void;
  onRetailer: () => void;
}) {
  const savedPosts = posts.filter((post) => savedIds.has(post.id));
  return (
    <section className="inner-page">
      <div className="inner-page-head">
        <p className="eyebrow"><span className="eyebrow-line" />Your little beauty shelf</p>
        <h1>Saved <em>finds.</em></h1>
        <p>Keep the shades that caught your eye close by.</p>
      </div>
      <PreviewNotice>Saved items here are example preview states. Nothing is stored.</PreviewNotice>
      {savedPosts.length ? (
        <div className="recommendation-grid saved-grid">
          {savedPosts.map((post) => <PostCard key={post.id} compact onRetailer={onRetailer} onSave={onSave} post={post} saved />)}
        </div>
      ) : (
        <div className="saved-empty">
          <div className="empty-mark"><Heart size={27} /></div>
          <p className="eyebrow">Room for your next favorite</p>
          <h2>Nothing saved <em>just yet.</em></h2>
          <p>Tap the save icon on a find that feels like you, and it will live here.</p>
          <button className="button button-plum" onClick={onBrowse} type="button">Explore the feed <ArrowRight size={15} /></button>
        </div>
      )}
    </section>
  );
}

function ProfileView({ handle, setHandle, depth, setDepth, tone, setTone, onToast }: {
  handle: string;
  setHandle: (value: string) => void;
  depth: number;
  setDepth: (value: number) => void;
  tone: Tone;
  setTone: (value: Tone) => void;
  onToast: (value: string) => void;
}) {
  return (
    <section className="inner-page profile-page">
      <div className="inner-page-head">
        <p className="eyebrow"><span className="eyebrow-line" />A little more you</p>
        <h1>Your tone, <em>your story.</em></h1>
        <p>Set a starting point for the shades you want to discover. You can change it whenever you like.</p>
      </div>
      <div className="profile-layout">
        <div className="editor-card profile-editor">
          <label className="profile-handle-label">Your public handle<input maxLength={24} onChange={(event) => setHandle(event.target.value)} placeholder="Choose a name that feels like you" value={handle} /><span className="field-hint">Your email address is never shown on a post.</span></label>
          <div className="tone-picker">
            <div className="tone-picker-head">
              <div className="tone-preview"><ToneDot depth={Math.max(1, Math.round((depth / 100) * 9) + 1)} size="lg" /></div>
              <div><span className="eyebrow">Your skin depth</span><strong>Monk Skin Tone {Math.max(1, Math.round((depth / 100) * 9) + 1)}</strong><span className="field-hint">An estimate is enough.</span></div>
            </div>
            <input aria-label="Choose skin depth from fairest to deepest" className="depth-slider" max="100" min="0" onChange={(event) => setDepth(Number(event.target.value))} style={{ "--depth": `${depth}%` } as CSSProperties} type="range" value={depth} />
            <div className="range-captions"><span>Fairest</span><span>Deepest</span></div>
            <div className="tone-palette">{SKIN_TONES.map((shade, index) => <button aria-label={`Choose Monk Skin Tone ${index + 1}`} aria-pressed={Math.max(1, Math.round((depth / 100) * 9) + 1) === index + 1} className="tone-chip" key={shade} onClick={() => setDepth(index * (100 / 9))} style={{ background: shade }} type="button" />)}</div>
          </div>
          <fieldset className="undertone-fieldset">
            <legend>Your undertone</legend>
            <p className="field-hint">Choose what feels closest, not what someone else tells you.</p>
            <div className="undertone-grid">{UNDERTONES.map((item) => <button aria-pressed={tone === item} className={`undertone-choice undertone-${item.toLowerCase()}${tone === item ? " is-selected" : ""}`} key={item} onClick={() => setTone(item)} type="button"><span className="undertone-color" />{item}{tone === item && <Check size={15} />}</button>)}</div>
          </fieldset>
          <div className="preview-privacy"><span className="privacy-dot"><Check size={12} /></span><span><strong>Your face stays yours.</strong> Neu does not ask for a photo.</span></div>
          <button className="button button-plum button-submit" onClick={() => onToast("Profile changes are preview-only and not saved.")} type="button">Save my tone <ArrowRight size={15} /></button>
        </div>
        <aside className="profile-aside">
          <div className="profile-portrait"><ToneDot depth={Math.max(1, Math.round((depth / 100) * 9) + 1)} size="lg" /><span>YOUR<br />PLACEMENT</span></div>
          <p className="eyebrow">Not a box. A beginning.</p>
          <h2>Make the rules<br /><em>your own.</em></h2>
          <p>Your tone helps surface useful shades. Your style is always yours to define.</p>
          <div className="profile-aside-tags"><span>{tone}</span><span>MST-{String(Math.max(1, Math.round((depth / 100) * 9) + 1)).padStart(2, "0")}</span></div>
        </aside>
      </div>
    </section>
  );
}

export function CommunityFlow() {
  const [view, setView] = useState<View>("feed");
  const [posts, setPosts] = useState<Post[]>(EXAMPLE_POSTS);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["example-base"]));
  const [handle, setHandle] = useState("yourbeautyedit");
  const [depth, setDepth] = useState(50);
  const [tone, setTone] = useState<Tone>("Olive");
  const [showAuth, setShowAuth] = useState(false);
  const [toast, setToast] = useState("");

  function showMessage(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }
  function toggleSaved(id: string) {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    showMessage(savedIds.has(id) ? "Removed from your example saves." : "Added to your example saves.");
  }
  function addExample(post: Omit<Post, "id">) {
    const id = `preview-${Date.now()}`;
    setPosts((current) => [{ ...post, id }, ...current]);
  }

  const navItems: { key: View; label: string; icon: typeof Sparkles }[] = [
    { key: "feed", label: "Feed", icon: Sparkles },
    { key: "share", label: "Share a find", icon: Plus },
    { key: "saved", label: "Saved", icon: Bookmark },
    { key: "you", label: "You", icon: UserRound },
  ];

  return (
    <div className="neu-app">
      <div className="preview-ribbon">
        <Sparkles size={13} />
        <span>Interactive preview</span>
        <i />
        <span>Sample posts only. Nothing here is published.</span>
      </div>
      <header className="site-header">
        <button className="brand-lockup" onClick={() => setView("feed")} type="button">
          <Logo />
          <span className="brand-subtitle">BEAUTY, YOUR WAY</span>
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button aria-current={view === key ? "page" : undefined} className={`nav-link${view === key ? " nav-link-active" : ""}`} key={key} onClick={() => setView(key)} type="button">
              <Icon size={15} strokeWidth={1.8} />{label}
            </button>
          ))}
        </nav>
        <button className="profile-entry" onClick={() => setShowAuth(true)} type="button">
          <span className="profile-entry-dot"><ToneDot depth={5} /></span>
          <span>Sign in</span>
          <ChevronDown size={14} />
        </button>
      </header>

      <main className="main-content">
        {view === "feed" && <FeedView onRetailer={() => showMessage("Retailer links are examples in this preview.")} onSave={toggleSaved} onShare={() => setView("share")} posts={posts} savedIds={savedIds} />}
        {view === "share" && <ShareView onPost={(post) => { addExample(post); setView("feed"); showMessage("Added to this preview only. Not published."); }} />}
        {view === "saved" && <SavedView onBrowse={() => setView("feed")} onRetailer={() => showMessage("Retailer links are examples in this preview.")} onSave={toggleSaved} posts={posts} savedIds={savedIds} />}
        {view === "you" && <ProfileView depth={depth} handle={handle} onToast={showMessage} setDepth={setDepth} setHandle={setHandle} setTone={setTone} tone={tone} />}
      </main>

      <footer className="site-footer">
        <Logo />
        <span>Makeup is personal. Your recommendations should be, too.</span>
        <button className="footer-link" onClick={() => setView("you")} type="button">Your profile <ArrowRight size={13} /></button>
      </footer>

      <nav className="mobile-nav" aria-label="Main navigation">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button aria-current={view === key ? "page" : undefined} className={`mobile-nav-item${view === key ? " mobile-nav-active" : ""}`} key={key} onClick={() => setView(key)} type="button">
            <Icon size={18} strokeWidth={1.9} />
            <span>{key === "share" ? "Share" : label}</span>
          </button>
        ))}
      </nav>

      {showAuth && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAuth(false); }} role="presentation">
          <section aria-labelledby="sign-in-title" aria-modal="true" className="auth-modal" role="dialog">
            <button aria-label="Close sign in dialog" className="modal-close" onClick={() => setShowAuth(false)} type="button"><X size={19} /></button>
            <div className="modal-mark"><Mail size={21} /></div>
            <p className="eyebrow">Your little corner</p>
            <h2 id="sign-in-title">Come on <em>in.</em></h2>
            <p>In the live website, you would get a one-time sign-in link. This preview does not send email.</p>
            <label>Email address<input autoComplete="off" placeholder="you@example.com" type="email" /></label>
            <button className="button button-plum button-submit" onClick={() => { setShowAuth(false); showMessage("Email sign-in is visual only in this preview."); }} type="button">Continue in preview <ArrowRight size={15} /></button>
            <span className="field-hint">Your email stays private and never appears on recommendations.</span>
          </section>
        </div>
      )}

      {toast && <div className="toast-message" role="status"><Check size={15} />{toast}</div>}
    </div>
  );
}
