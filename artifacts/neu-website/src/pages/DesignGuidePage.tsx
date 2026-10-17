import { ArrowDown, ArrowRight, Check, Layers3, Palette, Type, X } from "lucide-react";
import { Link } from "wouter";

const pigmentArt = `${import.meta.env.BASE_URL}images/neu-pigment-study.jpg`;
const colors = [
  { name: "Paper", hex: "#FBF7F2", role: "Main background" },
  { name: "Blush paper", hex: "#F3ECEB", role: "Soft section" },
  { name: "Dusty plum", hex: "#786B88", role: "Warm accent" },
  { name: "Deep plum", hex: "#514659", role: "Primary action" },
  { name: "Ink", hex: "#322B34", role: "Headlines and body" },
  { name: "Berry", hex: "#B85F78", role: "Small detail only" },
];
const pageMap = [
  ["Home", "A confident welcome, clear next step, and calm introduction to Neu.", "Approved"],
  ["Learn", "Public education on skin depth, undertone, olive cast, and color theory.", "Keep public"],
  ["Discover", "Browse a small illustrative product library with category and profile filters.", "Example library"],
  ["Profile", "A personal, editable starting point stored on this device.", "On-device"],
  ["Share", "A clear explanation that publishing is not connected yet.", "Not connected"],
  ["Saved", "An honest account-saving status page, with no simulated cloud list.", "Not connected"],
];

export default function DesignGuidePage() {
  return (
    <main className="content">
      <section className="guide-hero">
        <div><span className="eyebrow">The decision, in one place</span><h1>Soft color.<br /><em>Clear point of view.</em></h1>
          <p className="hero-lede">Neu is a makeup community where people share what feels like them. Start with skin, discover ideas, and learn enough to choose for yourself.</p>
          <a className="text-button" href="#handoff">See what stays <ArrowDown size={15} /></a>
          <p className="field-hint">Approved website direction and handoff notes.</p></div>
        <figure className="guide-art"><img src={pigmentArt} alt="Dusty rose and muted plum makeup textures on a soft ivory surface." /></figure>
      </section>

      <section className="guide-block">
        <span className="eyebrow">01 / Creative direction</span><h2>What Neu should feel like.</h2><p>Expressive and beauty-led, but not intimidating. Softness in the colors, confidence in the voice, and real readability in every detail.</p>
        <div className="guide-grid">
          <article className="guide-list"><span className="mono"><Check size={14} /> KEEP</span><h3>The heart of it</h3><ul>
            <li>Makeup as personal self-expression, not a set of rules.</li><li>Real-life shade notes shared by people with similar skin.</li>
            <li>Skin depth and undertone as helpful context, never a verdict.</li><li>A welcoming community that invites beginners in.</li><li>Public learning, guest browsing, and honest content labels.</li>
          </ul></article>
          <article className="guide-list"><span className="mono"><X size={14} /> LET GO</span><h3>What made it harder</h3><ul>
            <li>Bright, busy color-collage artwork.</li><li>Boxed hero imagery or floating information on top of it.</li>
            <li>The rejected “beauty in your own tone” tagline.</li><li>Decorative dashes and tiny, washed-out text.</li><li>Repeating the same invitation and preview notice everywhere.</li>
          </ul></article>
        </div>
      </section>

      <section className="guide-block">
        <span className="eyebrow">02 / Visual system</span><h2>A small set of rules that does the work.</h2><p>Keep the background gentle. Make important text dark enough to read quickly. Let one plum button do the asking.</p>
        <div className="guide-colors">{colors.map((item) => <article key={item.name} className="guide-color"><span className="guide-color-swatch" style={{ backgroundColor: item.hex }} /><strong>{item.name}</strong><span>{item.hex}</span><small>{item.role}</small></article>)}</div>
        <div className="guide-grid">
          <article className="guide-list"><span className="mono"><Type size={15} /> TYPE</span><h3>Editorial headlines.<br /><em>Plain spoken body text.</em></h3><p><strong>Headlines:</strong> Cormorant Garamond, confident scale, short lines.</p><p><strong>Reading text:</strong> DM Sans, comfortable size, deep ink on light surfaces.</p><p><strong>Utility labels:</strong> Space Mono sparingly, never as the main reading voice.</p></article>
          <article className="guide-list"><span className="mono"><Palette size={15} /> USAGE</span><p><strong>Deep plum text</strong> Links and labels stay readable.</p><p>Reserve berry pink for a small accent. Do not fade body copy to make a page feel softer.</p><span className="primary">One clear primary action <ArrowRight size={14} /></span></article>
        </div>
      </section>

      <section className="guide-block">
        <span className="eyebrow">03 / Website flow</span><h2>The path should feel obvious.</h2><p>A person can look around first. This handoff does not connect sign-in, sharing or cloud saves.</p>
        <div className="guide-path"><article><span>01</span><h3>Arrive</h3><p>Understand Neu and pick a starting point.</p></article><article><span>02</span><h3>Explore</h3><p>Browse example picks or make a local skin profile.</p></article><article><span>03</span><h3>Learn</h3><p>See how undertone and color theory can guide choices.</p></article><article><span>04</span><h3>Connect later</h3><p>Account-based sharing and saving need the separate setup.</p></article></div>
        <div className="guide-pages">{pageMap.map(([name, detail, status]) => <article key={name}><strong>{name}</strong><p>{detail}</p><span>{status}</span></article>)}</div>
      </section>

      <section className="guide-block" id="handoff">
        <div className="guide-grid">
          <div><span className="eyebrow">04 / Handoff to the website build</span><h2>Build this, not a new direction.</h2><p>Carry this palette, image treatment, tone, and simple guest-to-member flow into production. Reuse the Learn guide as a real public page. Keep sample products clearly labeled until there is real community content.</p></div>
          <article className="guide-list"><span className="mono"><Layers3 size={15} /> HANDOFF</span><ul>
            <li>Preserve clear contrast and visible focus states.</li><li>Make navigation simple on small screens.</li>
            <li>Keep profile details out of the hero artwork.</li><li>Do not imply a shade match is guaranteed.</li>
            <li>Local profile is on this device. Accounts, shared notes and cloud saves are not connected.</li>
          </ul><Link className="text-button" href="/">Return to Neu <ArrowRight size={14} /></Link></article>
        </div>
      </section>
      <footer className="guide-footer"><Link className="brand" href="/"><span className="brand-mark">n</span><span className="brand-word">neu</span></Link><p>Beauty is personal. Keep it that way.</p><span className="mono">DESIGN DIRECTION · V1</span></footer>
    </main>
  );
}
