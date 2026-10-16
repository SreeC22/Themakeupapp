import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  Heart,
  Info,
  Mail,
  Palette,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import "./CommunityFlow.css";

type View = "home" | "profile" | "learn" | "feed" | "share" | "saved" | "you";
type Tone = "Warm" | "Cool" | "Neutral";
type Undertone = Tone | "Not sure";
const SKIN_TYPES = ["Normal", "Dry", "Oily", "Combination", "Sensitive"] as const;
type SkinType = (typeof SKIN_TYPES)[number];

const CATEGORY_GROUPS = {
  Complexion: [
    "Foundation",
    "Concealer",
    "Color corrector",
    "Skin tint",
    "Setting powder",
    "Primer",
  ],
  Cheeks: ["Blush", "Bronzer", "Contour", "Highlighter"],
  "Eyes & brows": ["Eyeshadow", "Eyeliner", "Mascara", "Brow pencil", "Brow gel"],
  Lips: ["Lipstick", "Lip liner", "Lip gloss", "Lip balm"],
  "Prep & finish": ["Moisturizer", "Sunscreen", "Setting spray"],
} as const;
type ProductCategory =
  (typeof CATEGORY_GROUPS)[keyof typeof CATEGORY_GROUPS][number];

const ALL_CATEGORIES = Object.values(CATEGORY_GROUPS).flat() as ProductCategory[];

type Profile = {
  handle: string;
  depth: number;
  undertone: Undertone;
  oliveCast: boolean;
  skinType: SkinType;
  concerns: string[];
};

type ProductPost = {
  id: string;
  author: string;
  initials: string;
  tone: Tone;
  oliveCast: boolean;
  depth: number;
  skinType: SkinType;
  category: ProductCategory;
  brand: string;
  product: string;
  shade: string;
  note: string;
  routine: string;
  art: string;
  artLabel: string;
  likes: number;
  starter: boolean;
};

const STARTER_POSTS: ProductPost[] = [
  {
    id: "fenty-skin-tint",
    author: "Mina R.",
    initials: "MR",
    tone: "Neutral",
    oliveCast: true,
    depth: 5,
    skinType: "Combination",
    category: "Skin tint",
    brand: "Fenty Beauty",
    product: "Eaze Drop Blurring Skin Tint",
    shade: "Shade 12 · example match",
    note: "An easy, skin-like base for days when I want my freckles to stay part of the look.",
    routine: "Pressed in with a damp sponge; set only around my nose.",
    art: "product-art--fenty",
    artLabel: "Warm beige skin tint bottle",
    likes: 38,
    starter: true,
  },
  {
    id: "nars-concealer",
    author: "Liv C.",
    initials: "LC",
    tone: "Neutral",
    oliveCast: true,
    depth: 5,
    skinType: "Combination",
    category: "Concealer",
    brand: "NARS",
    product: "Radiant Creamy Concealer",
    shade: "Ginger · example match",
    note: "A little warmth brightens my under-eyes without turning the rest of my face pink.",
    routine: "One small dot, left to sit for a few seconds before blending.",
    art: "product-art--nars",
    artLabel: "Soft peach concealer tube",
    likes: 24,
    starter: true,
  },
  {
    id: "rare-blush",
    author: "Ari S.",
    initials: "AS",
    tone: "Warm",
    oliveCast: false,
    depth: 3,
    skinType: "Dry",
    category: "Blush",
    brand: "Rare Beauty",
    product: "Soft Pinch Liquid Blush",
    shade: "Hope · example pick",
    note: "One tiny dot gives my cheeks a watercolor flush. I tap the extra onto my lips.",
    routine: "Warm it between fingers, then press onto the high points of my cheeks.",
    art: "product-art--rare",
    artLabel: "Dusty rose liquid blush",
    likes: 31,
    starter: true,
  },
];

const MEMBER_EXAMPLES: ProductPost[] = [
  {
    id: "laura-powder",
    author: "Jules W.",
    initials: "JW",
    tone: "Warm",
    oliveCast: false,
    depth: 6,
    skinType: "Oily",
    category: "Setting powder",
    brand: "Laura Mercier",
    product: "Translucent Loose Setting Powder",
    shade: "Honey · example pick",
    note: "Keeps my T-zone comfortable through a full day without flattening the glow.",
    routine: "A small puff, pressed rather than swept over my base.",
    art: "product-art--powder",
    artLabel: "Pale gold loose powder jar",
    likes: 19,
    starter: false,
  },
  {
    id: "mac-foundation",
    author: "Nia D.",
    initials: "ND",
    tone: "Neutral",
    oliveCast: true,
    depth: 6,
    skinType: "Combination",
    category: "Foundation",
    brand: "M·A·C",
    product: "Studio Fix Fluid",
    shade: "NC42 · example match",
    note: "I mix one pump with moisturizer for a more lived-in finish.",
    routine: "Applied in thin layers with a soft brush.",
    art: "product-art--mac",
    artLabel: "Satin black foundation bottle",
    likes: 17,
    starter: false,
  },
  {
    id: "nyx-lip",
    author: "Tess P.",
    initials: "TP",
    tone: "Cool",
    oliveCast: false,
    depth: 4,
    skinType: "Normal",
    category: "Lip gloss",
    brand: "NYX",
    product: "Fat Oil Lip Drip",
    shade: "That's Chic · example pick",
    note: "A sheer berry layer that makes my everyday face feel a little more like me.",
    routine: "Blotted once, then topped with a second swipe.",
    art: "product-art--lip",
    artLabel: "Translucent berry lip oil",
    likes: 22,
    starter: false,
  },
  {
    id: "glossier-primer",
    author: "Rae M.",
    initials: "RM",
    tone: "Neutral",
    oliveCast: true,
    depth: 5,
    skinType: "Combination",
    category: "Primer",
    brand: "Glossier",
    product: "Futuredew",
    shade: "Universal · example pick",
    note: "The soft sheen makes a sheer base look more like my actual skin.",
    routine: "A thin layer over moisturizer, mostly on the cheeks.",
    art: "product-art--primer",
    artLabel: "Soft pink skin prep serum",
    likes: 14,
    starter: false,
  },
  {
    id: "tower-mascara",
    author: "Sam K.",
    initials: "SK",
    tone: "Neutral",
    oliveCast: false,
    depth: 4,
    skinType: "Sensitive",
    category: "Mascara",
    brand: "Tower 28",
    product: "MakeWaves Mascara",
    shade: "Jet · example pick",
    note: "Defined lashes without making the rest of my makeup feel too precious.",
    routine: "One coat at the roots, a second just on the outer lashes.",
    art: "product-art--mascara",
    artLabel: "Midnight mascara tube",
    likes: 11,
    starter: false,
  },
  {
    id: "summer-spf",
    author: "Eden B.",
    initials: "EB",
    tone: "Neutral",
    oliveCast: true,
    depth: 5,
    skinType: "Combination",
    category: "Sunscreen",
    brand: "Supergoop!",
    product: "Unseen Sunscreen SPF 40",
    shade: "Clear · example pick",
    note: "Sits well under my base and doesn't leave a cast on my skin.",
    routine: "Two-finger amount, then give it a minute before makeup.",
    art: "product-art--spf",
    artLabel: "Clear sunscreen tube",
    likes: 16,
    starter: false,
  },
];

const ALL_POSTS = [...STARTER_POSTS, ...MEMBER_EXAMPLES];

const TONE_SWATCHES: { depth: number; hex: string; label: string }[] = [
  { depth: 1, hex: "#F6EDE4", label: "Very light" },
  { depth: 2, hex: "#F3E7DB", label: "Light" },
  { depth: 3, hex: "#F7EAD0", label: "Light medium" },
  { depth: 4, hex: "#EADABA", label: "Medium light" },
  { depth: 5, hex: "#D7BD96", label: "Medium" },
  { depth: 6, hex: "#A07E56", label: "Medium deep" },
  { depth: 7, hex: "#825C43", label: "Deep" },
  { depth: 8, hex: "#604134", label: "Deep rich" },
  { depth: 9, hex: "#3A312A", label: "Very deep" },
  { depth: 10, hex: "#292420", label: "Deepest" },
];

const UNDERTONE_SWATCHES: { name: Tone; description: string; color: string }[] = [
  { name: "Warm", description: "Golden, peach or yellow", color: "#DFAD72" },
  { name: "Cool", description: "Pink, red or blue", color: "#C88D9B" },
  { name: "Neutral", description: "A balance of warm and cool", color: "#C9BBA1" },
];

const CONCERN_OPTIONS = ["Dry patches", "Redness", "Texture", "Breakouts", "Sensitivity"];

function isProfileMatch(post: ProductPost, profile: Profile) {
  return (
    (profile.undertone === "Not sure" || post.tone === profile.undertone) &&
    (!profile.oliveCast || post.oliveCast) &&
    post.skinType === profile.skinType &&
    Math.abs(post.depth - profile.depth) <= 1
  );
}

function BrandMark() {
  return (
    <div className="neu-brand-lockup" aria-label="Neu beauty community">
      <span className="neu-brand-mark">n</span>
      <span className="neu-brand-name">neu</span>
      <span className="neu-brand-divider" />
      <span className="neu-brand-descriptor">beauty, in your own tone</span>
    </div>
  );
}

function SiteHeader({
  view,
  onNavigate,
  isMember,
  onAccount,
}: {
  view: View;
  onNavigate: (next: View) => void;
  isMember: boolean;
  onAccount: () => void;
}) {
  const navItems: { id: View; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "feed", label: "Discover" },
    { id: "learn", label: "Learn" },
    { id: "profile", label: "My profile" },
    { id: "saved", label: "Saved" },
  ];

  return (
    <>
      <header className="neu-site-header">
        <button className="neu-brand-button" onClick={() => onNavigate("home")}>
          <BrandMark />
        </button>
        <nav className="neu-main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`neu-nav-link ${view === item.id ? "is-active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="neu-header-actions">
          <button className="neu-share-link" onClick={() => onNavigate("share")}>
            <Plus size={15} strokeWidth={1.8} />
            Share a find
          </button>
          {isMember ? (
            <button className="neu-account-chip" onClick={() => onNavigate("you")}>
              <span className="neu-account-avatar">Y</span>
              Your preview
            </button>
          ) : (
            <button className="neu-header-join" onClick={onAccount}>
              Create account <ArrowRight size={15} />
            </button>
          )}
        </div>
      </header>
      <nav className="neu-mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`neu-mobile-nav-item ${view === item.id ? "is-active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

function PreviewBanner() {
  return (
    <div className="neu-preview-banner">
      <Sparkles size={13} />
      <span>Design preview</span>
      <span className="neu-preview-banner-divider" />
      <span>Products and community notes are examples, not live member posts.</span>
    </div>
  );
}

function HomeView({
  onProfile,
  onBrowse,
}: {
  onProfile: () => void;
  onBrowse: () => void;
}) {
  return (
    <main className="neu-home-page">
      <section className="neu-home-hero">
        <div className="neu-home-copy">
          <div className="neu-eyebrow"><span /> A beauty community for your real-life skin</div>
          <h1>
            Makeup is a way
            <br />
            to <em>be more you.</em>
          </h1>
          <p className="neu-home-lede">
            Find shades and products through people who share your skin tone and skin type.
            Try a few ideas first; make an account when you want to save your finds.
          </p>
          <div className="neu-home-actions">
            <button className="neu-primary-button" onClick={onProfile}>
              Build my skin profile <ArrowRight size={17} />
            </button>
            <button className="neu-text-button" onClick={onBrowse}>
              Browse three starter picks <span>↗</span>
            </button>
          </div>
          <div className="neu-home-note">
            <span className="neu-home-note-dot" />
            No account needed to look around.
          </div>
        </div>
        <div className="neu-home-art" aria-label="Editorial still life of beauty products">
          <div className="neu-art-sun" />
          <div className="neu-art-caption">A little colour, a lot of you.</div>
          <div className="neu-art-swatch neu-art-swatch--one" />
          <div className="neu-art-swatch neu-art-swatch--two" />
          <div className="neu-art-palette">
            <div className="neu-art-palette-row">
              <span /><span /><span /><span />
            </div>
            <div className="neu-art-palette-row">
              <span /><span /><span /><span />
            </div>
          </div>
          <div className="neu-art-tube">
            <span>neu</span>
          </div>
          <div className="neu-art-compact">
            <div className="neu-art-compact-inner" />
          </div>
          <div className="neu-art-pencil" />
          <div className="neu-art-vertical-type">YOUR SHADE, YOUR STORY</div>
          <div className="neu-art-index">01 / 04</div>
        </div>
      </section>

      <section className="neu-home-how">
        <div className="neu-section-kicker">A softer way to find your next favourite</div>
        <div className="neu-how-grid">
          <article className="neu-how-step">
            <span className="neu-step-number">01</span>
            <div>
              <h2>Tell us about your skin.</h2>
              <p>Choose a tone, undertone and skin type. Your profile is yours to edit.</p>
            </div>
          </article>
          <article className="neu-how-step">
            <span className="neu-step-number">02</span>
            <div>
              <h2>See what feels familiar.</h2>
              <p>Browse shade notes and everyday routines from people with similar skin.</p>
            </div>
          </article>
          <article className="neu-how-step">
            <span className="neu-step-number">03</span>
            <div>
              <h2>Keep what speaks to you.</h2>
              <p>Create an account to save finds, then share the products you love.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="neu-home-bottom">
        <div>
          <span className="neu-bottom-overline">A note from neu</span>
          <h2>There isn’t one right way to wear it.</h2>
        </div>
        <p>
          Bare skin, sharp liner, a red lip at noon. Beauty is personal. Neu helps you
          find the little details that make a look feel like yours.
        </p>
        <button className="neu-round-arrow" aria-label="Build your profile" onClick={onProfile}>
          <ArrowRight size={19} />
        </button>
      </section>
    </main>
  );
}

function ProfileView({
  profile,
  onChange,
  onContinue,
  onLearn,
}: {
  profile: Profile;
  onChange: (next: Partial<Profile>) => void;
  onContinue: () => void;
  onLearn: () => void;
}) {
  return (
    <main className="neu-profile-setup-page">
      <div className="neu-flow-backline">
        <span>YOUR SHADE PROFILE</span>
        <span className="neu-flow-step">STEP 01 <i /> 02</span>
      </div>
      <div className="neu-profile-heading">
        <div>
          <div className="neu-eyebrow"><span /> Make it yours</div>
          <h1>Your skin, <em>your starting point.</em></h1>
          <p>
            This helps us bring the most relevant shade notes and product routines to the top.
            It is a guide, not a label.
          </p>
        </div>
        <div className="neu-profile-privacy">
          <div className="neu-profile-privacy-mark"><UserRound size={18} /></div>
          <span>Just the details that help you find a better match.</span>
        </div>
      </div>

      <div className="neu-profile-form">
        <section className="neu-profile-section neu-profile-tone-section">
          <div className="neu-profile-section-heading">
            <div><span className="neu-form-step">01</span><h2>Skin depth</h2></div>
            <span className="neu-section-hint">Choose the closest starting point</span>
          </div>
          <div className="neu-tone-palette" role="radiogroup" aria-label="Skin depth">
            {TONE_SWATCHES.map((swatch) => (
              <button
                key={swatch.depth}
                className={`neu-tone-swatch ${profile.depth === swatch.depth ? "is-selected" : ""}`}
                style={{ backgroundColor: swatch.hex }}
                onClick={() => onChange({ depth: swatch.depth })}
                role="radio"
                aria-checked={profile.depth === swatch.depth}
                aria-label={`Depth ${swatch.depth}: ${swatch.label}`}
                title={`Depth ${swatch.depth} · ${swatch.label}`}
              >
                {profile.depth === swatch.depth && <Check size={16} />}
              </button>
            ))}
          </div>
          <div className="neu-tone-ruler">
            <span>Light</span>
            <span>Medium</span>
            <span>Deep</span>
          </div>
          <div className="neu-selected-tone">
            <span className="neu-selected-tone-dot" style={{ backgroundColor: TONE_SWATCHES[profile.depth - 1].hex }} />
            <span><strong>Depth {String(profile.depth).padStart(2, "0")}</strong> · {TONE_SWATCHES[profile.depth - 1].label}</span>
            <span className="neu-tone-scale-note">10-point shade scale</span>
          </div>
        </section>

        <section className="neu-profile-section">
          <div className="neu-profile-section-heading">
            <div><span className="neu-form-step">02</span><h2>Undertone</h2></div>
            <span className="neu-section-hint">What do you notice beneath the surface?</span>
          </div>
          <div className="neu-undertone-grid">
            {UNDERTONE_SWATCHES.map((option) => (
              <button
                key={option.name}
                className={`neu-undertone-card ${profile.undertone === option.name ? "is-selected" : ""}`}
                onClick={() => onChange({ undertone: option.name })}
                aria-pressed={profile.undertone === option.name}
              >
                <span className="neu-undertone-color" style={{ backgroundColor: option.color }} />
                <span className="neu-undertone-copy"><strong>{option.name}</strong><small>{option.description}</small></span>
                {profile.undertone === option.name && <Check size={15} className="neu-undertone-check" />}
              </button>
            ))}
          </div>
          <button
            className={`neu-unsure-option ${profile.undertone === "Not sure" ? "is-selected" : ""}`}
            onClick={() => onChange({ undertone: "Not sure" })}
            aria-pressed={profile.undertone === "Not sure"}
          >
            <span className="neu-unsure-radio">{profile.undertone === "Not sure" && <span />}</span>
            Not sure yet
          </button>
          <button
            className={`neu-olive-option ${profile.oliveCast ? "is-selected" : ""}`}
            onClick={() => onChange({ oliveCast: !profile.oliveCast })}
            aria-pressed={profile.oliveCast}
          >
            <span className="neu-olive-swatch" />
            <span><strong>I notice an olive cast</strong><small>Olive can sit alongside warm, cool or neutral tendencies.</small></span>
            <span className="neu-olive-check">{profile.oliveCast && <Check size={13} />}</span>
          </button>
          <button className="neu-learn-inline-link" onClick={onLearn}>
            Learn how undertone and color work <ArrowRight size={14} />
          </button>
        </section>

        <section className="neu-profile-section">
          <div className="neu-profile-section-heading">
            <div><span className="neu-form-step">03</span><h2>Skin type</h2></div>
            <span className="neu-section-hint">Pick what sounds most like your everyday skin</span>
          </div>
          <div className="neu-skin-type-row">
            {SKIN_TYPES.map((type) => (
              <button
                key={type}
                className={`neu-skin-type-option ${profile.skinType === type ? "is-selected" : ""}`}
                onClick={() => onChange({ skinType: type })}
                aria-pressed={profile.skinType === type}
              >
                {profile.skinType === type && <Check size={14} />}
                {type}
              </button>
            ))}
          </div>
        </section>

        <section className="neu-profile-section">
          <div className="neu-profile-section-heading">
            <div><span className="neu-form-step">04</span><h2>Anything else?</h2><span className="neu-optional-label">optional</span></div>
            <span className="neu-section-hint">Select all that feel relevant</span>
          </div>
          <div className="neu-concern-row">
            {CONCERN_OPTIONS.map((concern) => {
              const selected = profile.concerns.includes(concern);
              return (
                <button
                  key={concern}
                  className={`neu-concern-chip ${selected ? "is-selected" : ""}`}
                  onClick={() =>
                    onChange({
                      concerns: selected
                        ? profile.concerns.filter((item) => item !== concern)
                        : [...profile.concerns, concern],
                    })
                  }
                  aria-pressed={selected}
                >
                  {selected && <Check size={13} />}{concern}
                </button>
              );
            })}
          </div>
        </section>

        <section className="neu-profile-section neu-profile-handle-section">
          <label className="neu-handle-label" htmlFor="neu-handle">
            <span><span className="neu-form-step">05</span><strong>Your display name</strong><small>How you’ll appear when you share a find</small></span>
            <input
              id="neu-handle"
              value={profile.handle}
              onChange={(event) => onChange({ handle: event.target.value })}
              maxLength={28}
              placeholder="yourbeautyedit"
            />
          </label>
        </section>
      </div>

      <div className="neu-profile-footer">
        <span>Profile details can be changed whenever you like.</span>
        <button className="neu-primary-button" onClick={onContinue}>
          Show my matches <ArrowRight size={17} />
        </button>
      </div>
    </main>
  );
}

const WHEEL_HUES = [
  { name: "Red", hex: "#B64F55" },
  { name: "Red-orange", hex: "#CC6849" },
  { name: "Orange", hex: "#DE874D" },
  { name: "Golden yellow", hex: "#D9AD57" },
  { name: "Yellow", hex: "#D4C45D" },
  { name: "Yellow-green", hex: "#8FA66B" },
  { name: "Green", hex: "#568C70" },
  { name: "Blue-green", hex: "#548E91" },
  { name: "Blue", hex: "#5F81A8" },
  { name: "Blue-violet", hex: "#7776A5" },
  { name: "Violet", hex: "#9A7199" },
  { name: "Red-violet", hex: "#B66F8A" },
];
const MAKEUP_EXAMPLES = ["Foundation", "Blush", "Lip", "Eyeshadow", "Color corrector"] as const;
type MakeupExample = (typeof MAKEUP_EXAMPLES)[number];

function wheelPoint(cx: number, cy: number, radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

function wheelPath(index: number) {
  const start = wheelPoint(130, 130, 112, index * 30 + 2);
  const end = wheelPoint(130, 130, 112, (index + 1) * 30 - 2);
  return `M 130 130 L ${start.x} ${start.y} A 112 112 0 0 1 ${end.x} ${end.y} Z`;
}

function LearnView({
  profile,
  onUseProfile,
  onExplore,
}: {
  profile: Profile;
  onUseProfile: (next: Partial<Profile>) => void;
  onExplore: () => void;
}) {
  const [depth, setDepth] = useState(profile.depth);
  const [undertone, setUndertone] = useState<Undertone>(profile.undertone);
  const [oliveCast, setOliveCast] = useState(profile.oliveCast);
  const [hueIndex, setHueIndex] = useState(2);
  const [harmony, setHarmony] = useState<"analogous" | "complementary">("complementary");
  const [example, setExample] = useState<MakeupExample>("Foundation");

  const selectedHue = WHEEL_HUES[hueIndex];
  const harmonyIndices =
    harmony === "complementary"
      ? [hueIndex, (hueIndex + 6) % WHEEL_HUES.length]
      : [(hueIndex + 10) % 12, (hueIndex + 11) % 12, hueIndex, (hueIndex + 1) % 12, (hueIndex + 2) % 12];
  const undertoneLabel =
    undertone === "Not sure"
      ? "still exploring"
      : `${undertone.toLowerCase()}${oliveCast ? " with an olive cast" : ""}`;
  const depthLabel = TONE_SWATCHES[depth - 1].label.toLowerCase();
  const correctorExample =
    depth <= 3 ? "soft peach" : depth <= 6 ? "peach or apricot" : "orange, terracotta or red-orange";

  const exampleCopy: Record<MakeupExample, { title: string; copy: string; colorNames: string[] }> = {
    Foundation: {
      title: "Match depth first; refine undertone second.",
      copy: `At ${depthLabel} depth, start by comparing a few neighboring shades along the jaw and down to the neck in indirect daylight. Look at the dry-down, too. A shade name is only a starting clue: brands and formulas vary.`,
      colorNames: ["Depth " + Math.max(1, depth - 1), "Depth " + depth, "Depth " + Math.min(10, depth + 1)],
    },
    Blush: {
      title: "A cheek color can echo, contrast or simply delight.",
      copy:
        undertone === "Warm"
          ? "Try peach, apricot or warm coral for a tonal flush; reach for berry or plum when you want more contrast."
          : undertone === "Cool"
            ? "Try rose, raspberry or berry for a tonal flush; warm peach or terracotta can make a lively contrast."
            : "Try rose, peach, berry or terracotta side by side. Notice which one feels like your version of a fresh cheek.",
      colorNames: ["Rose", "Peach", "Berry"],
    },
    Lip: {
      title: "The best lip shade is a mood, not a formula.",
      copy:
        undertone === "Warm"
          ? "Explore cinnamon, brick, warm rose and caramel nude. For a cooler contrast, try a clear berry or blue-red."
          : undertone === "Cool"
            ? "Explore rose, mauve, berry and blue-red. A warm brown, terracotta or coral can be a beautiful counterpoint."
            : "Explore rosewood, soft berry, warm nude and classic red. Swatch on the lip when possible; natural lip color changes the result.",
      colorNames: ["Rosewood", "Caramel", "Berry"],
    },
    Eyeshadow: {
      title: "Use the wheel as a starting sketch.",
      copy: `A color near ${selectedHue.name.toLowerCase()} can sit quietly beside its neighbors, or pop against its opposite. Bronze, plum, teal, taupe and every version in between can work across depths; adjust saturation to the feeling you want.`,
      colorNames: harmonyIndices.slice(0, 3).map((index) => WHEEL_HUES[index].name),
    },
    "Color corrector": {
      title: "Correct a specific tone, not your whole face.",
      copy: `For blue or purple shadows, try a small amount of ${correctorExample} and blend only where needed. Green can soften visible redness. An olive cast is not redness, and olive skin does not need green corrector by default.`,
      colorNames: [correctorExample, "Muted green", "Use only where needed"],
    },
  };

  const currentExample = exampleCopy[example];
  const foundationSwatches = [
    TONE_SWATCHES[Math.max(0, depth - 2)].hex,
    TONE_SWATCHES[depth - 1].hex,
    TONE_SWATCHES[Math.min(9, depth)].hex,
  ];
  const correctorSwatches = [
    depth <= 3 ? "#E9BEA2" : depth <= 6 ? "#DCA578" : "#B96F4C",
    "#A2A881",
    depth <= 3 ? "#E5A093" : depth <= 6 ? "#C97868" : "#9D594D",
  ];
  const undertonePalettes = {
    warm: {
      blush: ["#D98165", "#C56662", "#B17B55"],
      lip: ["#A94C3E", "#BE7252", "#765044"],
    },
    cool: {
      blush: ["#C0788B", "#A85271", "#D18C91"],
      lip: ["#A44767", "#C07182", "#755067"],
    },
    neutral: {
      blush: ["#D07C73", "#BB7582", "#BA8669"],
      lip: ["#A8565D", "#BA7F77", "#805A65"],
    },
  };
  const paletteKey = undertone === "Warm" ? "warm" : undertone === "Cool" ? "cool" : "neutral";
  const exampleSwatches =
    example === "Foundation"
      ? foundationSwatches
      : example === "Color corrector"
        ? correctorSwatches
        : example === "Blush"
          ? undertonePalettes[paletteKey].blush
          : example === "Lip"
            ? undertonePalettes[paletteKey].lip
            : harmonyIndices.slice(0, 3).map((index) => WHEEL_HUES[index].hex);
  const wheelKeys = (event: KeyboardEvent<SVGPathElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setHueIndex(index);
    }
  };

  return (
    <main className="neu-learn-page">
      <section className="neu-learn-hero">
        <div className="neu-learn-hero-copy">
          <span className="neu-eyebrow"><span /> THE NEU COLOR ROOM</span>
          <h1>Color is a language.<br /><em>There are no wrong accents.</em></h1>
          <p>
            A friendly guide to skin depth, undertone and color theory. Use it to get curious,
            try a combination, and keep the shades that feel like you.
          </p>
          <a className="neu-learn-jump" href="#neu-color-lab">Enter the color lab <ArrowRight size={15} /></a>
        </div>
        <div className="neu-learn-hero-art" aria-label="Color swatches arranged around an editorial color wheel">
          <div className="neu-learn-orbit neu-learn-orbit--one" />
          <div className="neu-learn-orbit neu-learn-orbit--two" />
          <div className="neu-learn-hero-wheel">
            {WHEEL_HUES.map((hue, index) => (
              <span key={hue.name} style={{ transform: `rotate(${index * 30}deg)`, backgroundColor: hue.hex }} />
            ))}
            <div className="neu-learn-hero-wheel-center">COLOR<br />IS PLAY</div>
          </div>
          <div className="neu-learn-art-note">DEPTH × TEMPERATURE × YOU</div>
        </div>
      </section>

      <section className="neu-learn-principles">
        <article className="neu-learn-principle neu-learn-principle--depth">
          <span className="neu-learn-number">01</span>
          <div className="neu-learn-depth-strip">
            {TONE_SWATCHES.map((swatch) => <span key={swatch.depth} style={{ backgroundColor: swatch.hex }} />)}
          </div>
          <h2>Depth is light to deep.</h2>
          <p>It describes how light or deep a skin tone appears. It does not tell you whether the skin leans warm, cool or olive.</p>
        </article>
        <article className="neu-learn-principle neu-learn-principle--undertone">
          <span className="neu-learn-number">02</span>
          <div className="neu-learn-temp-swatches">
            {UNDERTONE_SWATCHES.map((swatch) => <span key={swatch.name} style={{ backgroundColor: swatch.color }} />)}
            <span className="neu-learn-olive-swatch" />
          </div>
          <h2>Undertone is a subtle cast.</h2>
          <p>Warm, cool and neutral describe temperature tendencies. Olive is a muted green-gold cast that can overlap with any of them.</p>
        </article>
      </section>

      <section className="neu-learn-explain">
        <div className="neu-learn-explain-heading">
          <span className="neu-eyebrow"><span /> A more useful way to think about it</span>
          <h2>Two different questions.<br /><em>Both can be true.</em></h2>
        </div>
        <div className="neu-learn-explain-copy">
          <p><strong>Depth:</strong> how light or deep is the shade family that disappears most naturally into my skin?</p>
          <p><strong>Undertone:</strong> does the skin seem to lean golden, peach, pink, blue, muted green—or a blend?</p>
          <p>People can have warm undertones at deeper depths, cool undertones at lighter depths, or an olive cast alongside another temperature. You do not need to fit one tidy box.</p>
          <div className="neu-learn-clue-note"><Info size={16} /><span>Vein color and gold-versus-silver jewelry are clues some people like to try, not reliable diagnoses. If they disagree, trust your own side-by-side swatches—or leave the label open.</span></div>
        </div>
      </section>

      <section className="neu-color-lab" id="neu-color-lab">
        <div className="neu-color-lab-header">
          <span className="neu-eyebrow"><span /> Try it, change it, try again</span>
          <h2>Your little <em>color lab.</em></h2>
          <p>Explore a few variables. Nothing here is a rule or a final answer.</p>
        </div>
        <div className="neu-lab-controls">
          <div className="neu-lab-control-block">
            <div className="neu-lab-control-heading"><span>01 · DEPTH</span><strong>{depthLabel} <i>· {depth}/10</i></strong></div>
            <div className="neu-lab-depth-swatches" role="radiogroup" aria-label="Try a skin depth">
              {TONE_SWATCHES.map((swatch) => (
                <button
                  key={swatch.depth}
                  role="radio"
                  aria-checked={depth === swatch.depth}
                  aria-label={`Depth ${swatch.depth}: ${swatch.label}`}
                  className={depth === swatch.depth ? "is-selected" : ""}
                  style={{ backgroundColor: swatch.hex }}
                  onClick={() => setDepth(swatch.depth)}
                />
              ))}
            </div>
            <p>Tap a swatch to change the examples below.</p>
          </div>
          <div className="neu-lab-control-block">
            <div className="neu-lab-control-heading"><span>02 · TEMPERATURE</span><strong>{undertone}</strong></div>
            <div className="neu-lab-temp-options">
              {(["Warm", "Cool", "Neutral", "Not sure"] as Undertone[]).map((option) => (
                <button
                  key={option}
                  className={undertone === option ? "is-selected" : ""}
                  onClick={() => setUndertone(option)}
                  aria-pressed={undertone === option}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              className={`neu-lab-olive-toggle ${oliveCast ? "is-selected" : ""}`}
              onClick={() => setOliveCast((current) => !current)}
              aria-pressed={oliveCast}
            >
              <span className="neu-lab-olive-dot" />
              <span>Explore an olive cast too</span>
              <span className="neu-lab-toggle-indicator">{oliveCast && <Check size={12} />}</span>
            </button>
          </div>
        </div>

        <div className="neu-color-playground">
          <div className="neu-wheel-panel">
            <div className="neu-wheel-panel-heading">
              <span><Palette size={15} /> COLOR WHEEL</span>
              <small>Choose a starting color</small>
            </div>
            <div className="neu-wheel-wrap">
              <svg viewBox="0 0 260 260" className="neu-interactive-wheel" aria-label="Interactive 12 hue color wheel">
                {WHEEL_HUES.map((hue, index) => (
                  <path
                    key={hue.name}
                    d={wheelPath(index)}
                    fill={hue.hex}
                    className={hueIndex === index ? "is-selected" : ""}
                    role="button"
                    tabIndex={0}
                    aria-label={`Choose ${hue.name}`}
                    aria-pressed={hueIndex === index}
                    onClick={() => setHueIndex(index)}
                    onKeyDown={(event) => wheelKeys(event, index)}
                  />
                ))}
                <circle cx="130" cy="130" r="48" className="neu-wheel-center" />
                <text x="130" y="126" textAnchor="middle" className="neu-wheel-center-label">YOUR</text>
                <text x="130" y="145" textAnchor="middle" className="neu-wheel-center-label">COLOR</text>
              </svg>
            </div>
            <div className="neu-wheel-selection"><span style={{ backgroundColor: selectedHue.hex }} />{selectedHue.name}</div>
          </div>
          <div className="neu-harmony-panel">
            <div className="neu-harmony-heading">
              <div><span>COLOR THEORY, LOOSELY HELD</span><h3>Choose a mood.</h3></div>
              <span className="neu-harmony-selected-note">{selectedHue.name}</span>
            </div>
            <div className="neu-harmony-tabs">
              <button className={harmony === "analogous" ? "is-selected" : ""} onClick={() => setHarmony("analogous")} aria-pressed={harmony === "analogous"}>Analogous</button>
              <button className={harmony === "complementary" ? "is-selected" : ""} onClick={() => setHarmony("complementary")} aria-pressed={harmony === "complementary"}>Complementary</button>
            </div>
            <p className="neu-harmony-definition">
              {harmony === "analogous"
                ? "Neighboring hues feel connected and tonal. Try a soft gradient or repeat one color in a smaller detail."
                : "Opposite hues create a livelier contrast. One can be the main event; the other can be a small accent."}
            </p>
            <div className="neu-harmony-swatch-row">
              {harmonyIndices.map((index) => (
                <button key={`${harmony}-${index}`} className="neu-harmony-color" onClick={() => setHueIndex(index)} aria-label={`Try ${WHEEL_HUES[index].name}`} title={WHEEL_HUES[index].name}>
                  <span style={{ backgroundColor: WHEEL_HUES[index].hex }} />
                  <small>{WHEEL_HUES[index].name}</small>
                </button>
              ))}
            </div>
            <div className="neu-harmony-depth-note">
              <span className="neu-harmony-depth-chip" style={{ backgroundColor: TONE_SWATCHES[depth - 1].hex }} />
              <p>Try the same hue at different depths or transparencies. Your skin depth changes contrast—not permission.</p>
            </div>
          </div>
        </div>

        <section className="neu-makeup-examples">
          <div className="neu-makeup-examples-heading">
            <span className="neu-eyebrow"><span /> Bring the ideas to makeup</span>
            <h3>Try a color story.</h3>
          </div>
          <div className="neu-makeup-example-tabs" role="tablist" aria-label="Makeup color examples">
            {MAKEUP_EXAMPLES.map((item) => (
              <button key={item} className={example === item ? "is-selected" : ""} onClick={() => setExample(item)} role="tab" aria-selected={example === item}>{item}</button>
            ))}
          </div>
          <div className="neu-makeup-example-content">
            <div className="neu-example-colors">
              {currentExample.colorNames.map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  className={`neu-example-color-chip neu-example-color-chip--${index}`}
                  style={{ backgroundColor: exampleSwatches[index] }}
                  title={name}
                  aria-label={name}
                />
              ))}
            </div>
            <div className="neu-example-color-copy"><h4>{currentExample.title}</h4><p>{currentExample.copy}</p></div>
            <div className="neu-example-context"><span>YOUR EXPLORATION</span><strong>{depthLabel} · {undertoneLabel}</strong><small>Use the controls above to play with another combination.</small></div>
          </div>
        </section>
      </section>

      <section className="neu-learn-real-world">
        <div>
          <span className="neu-eyebrow"><span /> Reality check</span>
          <h2>Color changes in the real world.</h2>
        </div>
        <div className="neu-learn-real-world-copy">
          <p>Screens, lighting, wear time and product formulas all shift how a shade looks. A product can oxidize, sheer out or read differently beside your natural lip or cheek color.</p>
          <p>Compare swatches in daylight when you can, give complexion products time to dry down, and use sample sizes or store testers if available. Your own mirror is more useful than a rigid chart.</p>
        </div>
      </section>

      <section className="neu-learn-cta">
        <div className="neu-learn-cta-mark"><Sparkles size={19} /></div>
        <div><span>TAKE YOUR NOTES WITH YOU</span><h2>Keep exploring on your own terms.</h2><p>Use these choices in your profile, or head straight to product discovery.</p></div>
        <div className="neu-learn-cta-actions">
          <button className="neu-primary-button" onClick={() => onUseProfile({ depth, undertone, oliveCast })}>Use in my profile <ArrowRight size={15} /></button>
          <button className="neu-learn-explore-link" onClick={onExplore}>Explore products <ArrowRight size={14} /></button>
        </div>
      </section>
    </main>
  );
}

function CategoryDirectory({
  selected,
  onSelect,
}: {
  selected: ProductCategory | "All products";
  onSelect: (category: ProductCategory | "All products") => void;
}) {
  return (
    <section className="neu-category-directory">
      <div className="neu-category-directory-heading">
        <div>
          <span className="neu-eyebrow"><span /> Find your kind of product</span>
          <h2>Browse by category</h2>
        </div>
        <button
          className={`neu-category-all ${selected === "All products" ? "is-selected" : ""}`}
          onClick={() => onSelect("All products")}
        >
          All products <ArrowRight size={14} />
        </button>
      </div>
      <div className="neu-category-groups">
        {Object.entries(CATEGORY_GROUPS).map(([group, items]) => (
          <div className="neu-category-group" key={group}>
            <h3>{group}</h3>
            <div className="neu-category-pills">
              {items.map((item) => (
                <button
                  key={item}
                  className={`neu-category-pill ${selected === item ? "is-selected" : ""}`}
                  onClick={() => onSelect(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  post,
  liked,
  matching,
  onSave,
  onShop,
}: {
  post: ProductPost;
  liked: boolean;
  matching: boolean;
  onSave: () => void;
  onShop: () => void;
}) {
  return (
    <article className="neu-product-card">
      <div className={`neu-product-art ${post.art}`}>
        <span className="neu-example-label">Example product</span>
        <span className="neu-product-art-label">{post.artLabel}</span>
        <div className="neu-product-object">
          <span className="neu-product-object-mark">{post.brand}</span>
        </div>
        <button
          className={`neu-product-save ${liked ? "is-saved" : ""}`}
          aria-label={liked ? "Remove from saved" : "Save this product"}
          onClick={onSave}
        >
          <Bookmark size={17} fill={liked ? "currentColor" : "none"} />
        </button>
        {matching && <span className="neu-match-stamp"><Check size={12} /> Similar skin</span>}
      </div>
      <div className="neu-product-content">
        <div className="neu-product-meta-line">
          <span>{post.category}</span>
          <span className="neu-product-skin-meta">{post.tone}{post.oliveCast ? " · olive" : ""} · depth {post.depth} · {post.skinType.toLowerCase()}</span>
        </div>
        <div className="neu-product-brand">{post.brand}</div>
        <h3>{post.product}</h3>
        <div className="neu-shade-note"><span className="neu-shade-dot" />{post.shade}</div>
        <p className="neu-product-note">“{post.note}”</p>
        <div className="neu-routine-note"><span>IN MY ROUTINE</span><p>{post.routine}</p></div>
        <div className="neu-product-card-footer">
          <div className="neu-post-author">
            <span className="neu-post-avatar">{post.initials}</span>
            <span><strong>{post.author}</strong><small>community example</small></span>
          </div>
          <button className="neu-shop-link" onClick={onShop}>
            Product info <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function FeedView({
  posts,
  profile,
  profileReady,
  isMember,
  savedIds,
  onSave,
  onAccount,
  onProfile,
  onShare,
  onShop,
}: {
  posts: ProductPost[];
  profile: Profile;
  profileReady: boolean;
  isMember: boolean;
  savedIds: string[];
  onSave: (id: string) => void;
  onAccount: () => void;
  onProfile: () => void;
  onShare: () => void;
  onShop: (post: ProductPost) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All products">("All products");
  const [matchesOnly, setMatchesOnly] = useState(profileReady);
  const [query, setQuery] = useState("");

  const visiblePosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const categoryMatches = selectedCategory === "All products" || post.category === selectedCategory;
      const matchMatches = !matchesOnly || !profileReady || isProfileMatch(post, profile);
      const textMatches =
        !normalized ||
        `${post.brand} ${post.product} ${post.category} ${post.shade}`.toLowerCase().includes(normalized);
      return categoryMatches && matchMatches && textMatches;
    });
  }, [matchesOnly, posts, profile, profileReady, query, selectedCategory]);

  return (
    <main className="neu-discover-page">
      <section className="neu-discover-intro">
        <div className="neu-discover-intro-copy">
          <span className="neu-eyebrow"><span /> A better starting point</span>
          <h1>Find your shade <em>in good company.</em></h1>
          <p>
            Browse real-life routines by skin depth, undertone and skin type.
            Every product shown here is clearly marked as an example in this preview.
          </p>
          {!profileReady && (
            <button className="neu-inline-profile-link" onClick={onProfile}>
              Add your skin profile for closer matches <ArrowRight size={14} />
            </button>
          )}
        </div>
        <div className="neu-discover-stats">
          <div className="neu-discover-stat">
            <span className="neu-discover-stat-icon"><Sparkles size={16} /></span>
            <span><strong>{profileReady ? "Your profile" : "No account"}</strong><small>{profileReady ? `${profile.undertone}${profile.oliveCast ? " + olive" : ""} · ${profile.skinType.toLowerCase()}` : "Browse a few picks first"}</small></span>
          </div>
          <div className="neu-discover-stat">
            <span className="neu-discover-stat-icon neu-discover-stat-icon--rose"><Bookmark size={16} /></span>
            <span><strong>{isMember ? "Save your finds" : "Save with an account"}</strong><small>{isMember ? "Your list stays in this preview" : "A free account unlocks saves"}</small></span>
          </div>
        </div>
      </section>

      <CategoryDirectory selected={selectedCategory} onSelect={setSelectedCategory} />

      <section className="neu-results-section">
        <div className="neu-results-heading">
          <div>
            <span className="neu-section-kicker">{isMember ? "COMMUNITY EXAMPLES" : "A FEW STARTER PICKS"}</span>
            <h2>{matchesOnly && profileReady ? "Close to your skin profile" : "A little inspiration to start"}</h2>
            <p>
              {isMember
                ? "A wider sample of product notes across the community."
                : "Guest browsing stays small. Create an account to unlock the full product library and save what you like."}
            </p>
          </div>
          <div className="neu-results-controls">
            <label className="neu-search-box">
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
            </label>
            {profileReady && (
              <button
                className={`neu-match-toggle ${matchesOnly ? "is-active" : ""}`}
                onClick={() => setMatchesOnly((current) => !current)}
              >
                <span className="neu-toggle-dot" />{matchesOnly ? "My matches" : "All skin profiles"}
              </button>
            )}
          </div>
        </div>

        {visiblePosts.length > 0 ? (
          <div className="neu-product-grid">
            {visiblePosts.map((post) => (
              <ProductCard
                key={post.id}
                post={post}
                liked={savedIds.includes(post.id)}
                matching={profileReady && isProfileMatch(post, profile)}
                onSave={() => onSave(post.id)}
                onShop={() => onShop(post)}
              />
            ))}
          </div>
        ) : (
          <div className="neu-empty-results">
            <span className="neu-empty-results-mark"><Search size={19} /></span>
            <div>
              <h3>{selectedCategory !== "All products" && !isMember ? `No guest picks in ${selectedCategory} yet.` : "No close matches in this sample."}</h3>
              <p>
                {isMember
                  ? "Try viewing all skin profiles or choosing another category."
                  : "The full library includes more categories and skin profiles. Create a free account to explore it."}
              </p>
            </div>
            <button className="neu-secondary-button" onClick={isMember ? () => setMatchesOnly(false) : onAccount}>
              {isMember ? "Show all profiles" : "Create account"} <ArrowRight size={15} />
            </button>
          </div>
        )}
      </section>

      {!isMember && (
        <section className="neu-unlock-panel">
          <div className="neu-unlock-mark"><Bookmark size={20} /></div>
          <div className="neu-unlock-copy">
            <span>YOUR BEAUTY EDIT, KEPT</span>
            <h2>Want more than a first look?</h2>
            <p>Create a free account to unlock the full library, save products and share what works for you.</p>
          </div>
          <button className="neu-primary-button" onClick={onAccount}>Create a free account <ArrowRight size={16} /></button>
        </section>
      )}
      {isMember && (
        <section className="neu-share-invite">
          <div><span>YOUR EXPERIENCE MATTERS</span><h2>Found something worth passing on?</h2></div>
          <button className="neu-secondary-button" onClick={onShare}>Share a product <ArrowRight size={15} /></button>
        </section>
      )}
    </main>
  );
}

function ShareView({
  profile,
  onSubmit,
  onCancel,
}: {
  profile: Profile;
  onSubmit: (post: ProductPost) => void;
  onCancel: () => void;
}) {
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Foundation");
  const [shade, setShade] = useState("");
  const [note, setNote] = useState("");
  const [routine, setRoutine] = useState("");

function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brand.trim() || !product.trim() || !note.trim()) return;
    onSubmit({
      id: `local-${Date.now()}`,
      author: profile.handle.trim() || "Your edit",
      initials: (profile.handle.trim() || "Y").slice(0, 2).toUpperCase(),
      tone: profile.undertone === "Not sure" ? "Neutral" : profile.undertone,
      oliveCast: profile.oliveCast,
      depth: profile.depth,
      skinType: profile.skinType,
      category,
      brand: brand.trim(),
      product: product.trim(),
      shade: shade.trim() || "Shade not listed",
      note: note.trim(),
      routine: routine.trim() || "Not added yet",
      art: "product-art--new",
      artLabel: "Community product entry",
      likes: 0,
      starter: false,
    });
  }

  return (
    <main className="neu-share-page">
      <div className="neu-flow-backline">
        <button onClick={onCancel}>← Back to discovery</button>
        <span>YOUR BEAUTY EDIT</span>
      </div>
      <div className="neu-share-layout">
        <div className="neu-share-intro">
          <span className="neu-eyebrow"><span /> Pass the good stuff on</span>
          <h1>A product that <em>gets you?</em></h1>
          <p>
            Add the shade, the finish and the little detail that makes it work.
            Your skin profile travels with your note so others can find a useful match.
          </p>
          <div className="neu-share-profile-note">
            <span className="neu-share-profile-swatch" style={{ backgroundColor: TONE_SWATCHES[profile.depth - 1].hex }} />
            <span><strong>{profile.undertone}{profile.oliveCast ? " + olive" : ""} · depth {profile.depth}</strong><small>{profile.skinType} skin · shown with your post</small></span>
          </div>
          <div className="neu-share-promise">
            <Sparkles size={16} /><span>Specific is generous. A shade name or application tip can save someone a lot of guessing.</span>
          </div>
        </div>
        <form className="neu-share-form" onSubmit={submit}>
          <div className="neu-share-form-top"><span>NEW PRODUCT NOTE</span><span>01 / 01</span></div>
          <label className="neu-form-label">Brand<input value={brand} onChange={(event) => setBrand(event.target.value)} placeholder="e.g. Fenty Beauty" required /></label>
          <label className="neu-form-label">Product name<input value={product} onChange={(event) => setProduct(event.target.value)} placeholder="What do you use?" required /></label>
          <div className="neu-form-two-col">
            <label className="neu-form-label">Category<select value={category} onChange={(event) => setCategory(event.target.value as ProductCategory)}>{ALL_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="neu-form-label">Shade name<input value={shade} onChange={(event) => setShade(event.target.value)} placeholder="Optional" /></label>
          </div>
          <label className="neu-form-label">Why does it work for you?<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Finish, feel, wear, or the way it makes you feel…" rows={4} required /></label>
          <label className="neu-form-label">How do you use it?<textarea value={routine} onChange={(event) => setRoutine(event.target.value)} placeholder="A quick application note (optional)" rows={2} /></label>
          <div className="neu-share-form-footer">
            <span>Saved only in this design preview.</span>
            <button className="neu-primary-button" type="submit">Add to my edit <Send size={15} /></button>
          </div>
        </form>
      </div>
    </main>
  );
}

function SavedView({
  posts,
  savedIds,
  isMember,
  onAccount,
  onSave,
  onDiscover,
  onShop,
}: {
  posts: ProductPost[];
  savedIds: string[];
  isMember: boolean;
  onAccount: () => void;
  onSave: (id: string) => void;
  onDiscover: () => void;
  onShop: (post: ProductPost) => void;
}) {
  const saved = posts.filter((post) => savedIds.includes(post.id));
  return (
    <main className="neu-saved-page">
      <div className="neu-saved-heading">
        <span className="neu-eyebrow"><span /> The little things you want to remember</span>
        <h1>Your <em>saved edit.</em></h1>
        <p>Product notes worth coming back to, all in one place.</p>
      </div>
      {!isMember ? (
        <div className="neu-saved-gate">
          <div className="neu-saved-gate-art"><Bookmark size={25} /></div>
          <span>YOUR EDIT, KEPT IN ONE PLACE</span>
          <h2>Save the products you want to come back to.</h2>
          <p>Browse a few starter picks without an account. Create a free account to save products and unlock the full library.</p>
          <button className="neu-primary-button" onClick={onAccount}>Create a free account <ArrowRight size={16} /></button>
        </div>
      ) : saved.length ? (
        <div className="neu-product-grid">
          {saved.map((post) => (
            <ProductCard
              key={post.id}
              post={post}
              liked
              matching={false}
              onSave={() => onSave(post.id)}
              onShop={() => onShop(post)}
            />
          ))}
        </div>
      ) : (
        <div className="neu-saved-empty">
          <span className="neu-saved-empty-icon"><Heart size={19} /></span>
          <h2>Nothing saved just yet.</h2>
          <p>When a product feels like you, tap the bookmark and it will find a home here.</p>
          <button className="neu-secondary-button" onClick={onDiscover}>
            Explore products <ArrowRight size={15} />
          </button>
        </div>
      )}
    </main>
  );
}

function YouView({
  profile,
  isMember,
  onEditProfile,
  onCreateAccount,
}: {
  profile: Profile;
  isMember: boolean;
  onEditProfile: () => void;
  onCreateAccount: () => void;
}) {
  return (
    <main className="neu-you-page">
      <span className="neu-eyebrow"><span /> YOUR CORNER OF NEU</span>
      <div className="neu-you-heading">
        <div className="neu-you-avatar">{(profile.handle || "Y").slice(0, 1).toUpperCase()}</div>
        <div><h1>{profile.handle || "Your beauty edit"}</h1><p>{profile.undertone}{profile.oliveCast ? " + olive cast" : ""} · depth {profile.depth} · {profile.skinType} skin</p></div>
        <button className="neu-secondary-button" onClick={onEditProfile}>Edit profile <ArrowRight size={15} /></button>
      </div>
      <section className="neu-you-card">
        <div><span>{isMember ? "PREVIEW ACCOUNT" : "PROFILE PREVIEW"}</span><h2>{isMember ? "Your community space is ready." : "Your profile is set up."}</h2><p>{isMember ? "Explore more sample finds and keep your saved products together." : "A free account unlocks more product notes and lets you save your edit."}</p></div>
        {!isMember && <button className="neu-primary-button" onClick={onCreateAccount}>Create account <ArrowRight size={15} /></button>}
      </section>
    </main>
  );
}

function AccountModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  if (!open) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    onCreate(email);
  }

  return (
    <div className="neu-modal-scrim" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="neu-account-modal" role="dialog" aria-modal="true" aria-labelledby="neu-account-title">
        <button className="neu-modal-close" onClick={onClose} aria-label="Close account dialog"><X size={18} /></button>
        <div className="neu-modal-mark"><span>n</span></div>
        <span className="neu-eyebrow"><span /> Your finds, all together</span>
        <h2 id="neu-account-title">Keep your beauty edit.</h2>
        <p className="neu-modal-description">A free account opens the full sample library and lets you save the products you love.</p>
        <form className="neu-account-form" onSubmit={submit}>
          <label htmlFor="neu-email">Email address</label>
          <div className="neu-email-field"><Mail size={16} /><input id="neu-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></div>
          <button className="neu-primary-button" type="submit">Create free account <ArrowRight size={16} /></button>
        </form>
        <div className="neu-modal-preview-note"><Sparkles size={14} /><span>This is a design preview. Your email stays on this screen; nothing is submitted.</span></div>
      </section>
    </div>
  );
}

function ProductInfoModal({ post, onClose }: { post: ProductPost | null; onClose: () => void }) {
  if (!post) return null;
  return (
    <div className="neu-modal-scrim" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="neu-product-info-modal" role="dialog" aria-modal="true" aria-labelledby="neu-info-title">
        <button className="neu-modal-close" onClick={onClose} aria-label="Close product information"><X size={18} /></button>
        <span className="neu-eyebrow"><span /> PRODUCT NOTE · EXAMPLE</span>
        <div className="neu-product-info-brand">{post.brand}</div>
        <h2 id="neu-info-title">{post.product}</h2>
        <div className="neu-shade-note"><span className="neu-shade-dot" />{post.shade}</div>
        <p>{post.note}</p>
        <div className="neu-product-info-routine"><span>HOW IT FITS IN A ROUTINE</span><p>{post.routine}</p></div>
        <div className="neu-product-info-footer"><ShoppingBag size={16} /><span>No retailer links in this preview. Product names are examples.</span></div>
        <button className="neu-secondary-button" onClick={onClose}>Back to discovery</button>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="neu-site-footer">
      <BrandMark />
      <span>Beauty is personal. Keep it that way.</span>
      <span className="neu-footer-note">DESIGN PREVIEW · SAMPLE CONTENT</span>
    </footer>
  );
}

export default function CommunityFlow() {
  const [view, setView] = useState<View>("home");
  const [profile, setProfile] = useState<Profile>({
    handle: "yourbeautyedit",
    depth: 5,
    undertone: "Not sure",
    oliveCast: false,
    skinType: "Combination",
    concerns: [],
  });
  const [profileReady, setProfileReady] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [localPosts, setLocalPosts] = useState<ProductPost[]>([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductPost | null>(null);

  const currentPosts = isMember ? [...localPosts, ...ALL_POSTS] : STARTER_POSTS;

  function navigate(next: View) {
    if (next === "share" && !isMember) {
      setAccountOpen(true);
      return;
    }
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveProduct(id: string) {
    if (!isMember) {
      setPendingSave(id);
      setAccountOpen(true);
      return;
    }
    setSavedIds((current) =>
      current.includes(id) ? current.filter((saved) => saved !== id) : [...current, id],
    );
  }

  function createAccount() {
    setIsMember(true);
    if (pendingSave) {
      setSavedIds((current) => (current.includes(pendingSave) ? current : [...current, pendingSave]));
      setPendingSave(null);
    }
    setAccountOpen(false);
    setView("feed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addPost(post: ProductPost) {
    setLocalPosts((current) => [post, ...current]);
    setView("feed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function patchProfile(next: Partial<Profile>) {
    setProfile((current) => ({ ...current, ...next }));
  }

  return (
    <div className="neu-app">
      <PreviewBanner />
      <SiteHeader view={view} onNavigate={navigate} isMember={isMember} onAccount={() => setAccountOpen(true)} />
      {view === "home" && <HomeView onProfile={() => navigate("profile")} onBrowse={() => navigate("feed")} />}
      {view === "profile" && <ProfileView profile={profile} onChange={patchProfile} onContinue={() => { setProfileReady(true); navigate("feed"); }} onLearn={() => navigate("learn")} />}
      {view === "learn" && (
        <LearnView
          profile={profile}
          onUseProfile={(next) => { patchProfile(next); setView("profile"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          onExplore={() => navigate("feed")}
        />
      )}
      {view === "feed" && (
        <FeedView
          posts={currentPosts}
          profile={profile}
          profileReady={profileReady}
          isMember={isMember}
          savedIds={savedIds}
          onSave={saveProduct}
          onAccount={() => setAccountOpen(true)}
          onProfile={() => navigate("profile")}
          onShare={() => navigate("share")}
          onShop={setProductInfo}
        />
      )}
      {view === "share" && isMember && <ShareView profile={profile} onSubmit={addPost} onCancel={() => navigate("feed")} />}
      {view === "saved" && <SavedView posts={currentPosts} savedIds={savedIds} isMember={isMember} onAccount={() => setAccountOpen(true)} onSave={saveProduct} onDiscover={() => navigate("feed")} onShop={setProductInfo} />}
      {view === "you" && <YouView profile={profile} isMember={isMember} onEditProfile={() => navigate("profile")} onCreateAccount={() => setAccountOpen(true)} />}
      <Footer />
      <AccountModal
        open={accountOpen}
        onClose={() => { setAccountOpen(false); setPendingSave(null); }}
        onCreate={createAccount}
      />
      <ProductInfoModal post={productInfo} onClose={() => setProductInfo(null)} />
    </div>
  );
}
