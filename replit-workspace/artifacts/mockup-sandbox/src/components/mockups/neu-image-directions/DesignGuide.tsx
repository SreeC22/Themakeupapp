import { ArrowDown, ArrowRight, Check, Layers3, Palette, Type, X } from "lucide-react";
import "./designguide.css";

const colors = [
  { name: "Paper", hex: "#FBF7F2", role: "Main background" },
  { name: "Blush paper", hex: "#F3ECEB", role: "Soft section" },
  { name: "Dusty plum", hex: "#786B88", role: "Warm accent" },
  { name: "Deep plum", hex: "#514659", role: "Primary action" },
  { name: "Ink", hex: "#322B34", role: "Headlines and body" },
  { name: "Berry", hex: "#B85F78", role: "Small detail only" },
];

const pages = [
  { name: "Home", detail: "A confident welcome, clear next step, and calm introduction to Neu.", status: "Approved" },
  { name: "Learn", detail: "Public education on skin depth, undertone, olive cast, and color theory.", status: "Keep public" },
  { name: "Discover", detail: "Explore shade notes, products, categories, and relevant skin profiles.", status: "Core flow" },
  { name: "Profile", detail: "A personal, editable starting point. Avoid presenting guesses as facts.", status: "Core flow" },
  { name: "Share", detail: "Help people add products and honest first-person routine notes.", status: "Core flow" },
  { name: "Saved", detail: "Return to products and shades someone chose to keep.", status: "Core flow" },
];

function SectionHead({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="ngu-section-head">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {note && <p>{note}</p>}
    </div>
  );
}

export default function DesignGuide() {
  return (
    <main className="ngu-guide">
      <header className="ngu-bar">
        <a className="ngu-wordmark" href="#top" aria-label="Neu design guide home">n <strong>neu</strong></a>
        <nav aria-label="Design guide navigation">
          <a href="#direction">Direction</a>
          <a href="#system">Visual system</a>
          <a href="#flow">Website flow</a>
          <a href="#handoff">Handoff</a>
        </nav>
        <span className="ngu-version">DESIGN GUIDE · V1</span>
      </header>

      <section className="ngu-intro" id="top">
        <div className="ngu-intro-copy">
          <span className="ngu-eyebrow"><i /> THE DECISION, IN ONE PLACE</span>
          <h1>Soft color.<br /><em>Clear point of view.</em></h1>
          <p className="ngu-lede">
            Neu is a makeup community where people share what feels like them.
            Start with skin, discover ideas, and learn enough to choose for yourself.
          </p>
          <a className="ngu-action" href="#handoff">See what stays <ArrowDown size={16} /></a>
          <p className="ngu-small-note">This is the approved direction to take forward into the real website.</p>
        </div>
        <figure className="ngu-art">
          <img src="/__mockup/images/neu-pigment-study.jpg" alt="Dusty rose and muted plum makeup textures on a soft ivory surface" />
          <figcaption><span>COLOR NOTES · CONCEPT ART</span><strong>Makeup is a way to be more you.</strong></figcaption>
        </figure>
      </section>

      <section className="ngu-block ngu-decision" id="direction">
        <SectionHead eyebrow="01 / CREATIVE DIRECTION" title="What Neu should feel like." note="Expressive and beauty-led, but not intimidating. Softness in the colors, confidence in the voice, and real readability in every detail." />
        <div className="ngu-decision-grid">
          <article className="ngu-keep">
            <span className="ngu-status"><Check size={14} /> KEEP</span>
            <h3>The heart of it</h3>
            <ul>
              <li>Makeup as personal self-expression, not a set of rules.</li>
              <li>Real-life shade notes shared by people with similar skin.</li>
              <li>Skin depth and undertone as helpful context, never a verdict.</li>
              <li>A welcoming community that invites beginners in.</li>
              <li>Public learning, guest browsing, and honest content labels.</li>
            </ul>
          </article>
          <article className="ngu-leave">
            <span className="ngu-status"><X size={14} /> LET GO</span>
            <h3>What made it harder</h3>
            <ul>
              <li>The bright, busy color-collage artwork.</li>
              <li>Boxed hero imagery or floating information on top of it.</li>
              <li>The rejected “beauty in your own tone” tagline.</li>
              <li>Decorative dashes and tiny, washed-out text.</li>
              <li>Repeating the same invitation and preview notice everywhere.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="ngu-block ngu-system" id="system">
        <SectionHead eyebrow="02 / VISUAL SYSTEM" title="A small set of rules that does the work." note="Keep the background gentle. Make important text dark enough to read quickly. Let one plum button do the asking." />
        <div className="ngu-colors">
          {colors.map((color) => (
            <article className="ngu-color" key={color.name}>
              <div className="ngu-swatch" style={{ backgroundColor: color.hex }} />
              <strong>{color.name}</strong>
              <span>{color.hex}</span>
              <small>{color.role}</small>
            </article>
          ))}
        </div>
        <div className="ngu-rules-grid">
          <article className="ngu-type-sample">
            <div className="ngu-rule-label"><Type size={16} /> TYPE</div>
            <h3>Editorial headlines.<br /><em>Plain spoken body text.</em></h3>
            <p><b>Headlines:</b> Cormorant Garamond, confident scale, short lines.</p>
            <p><b>Reading text:</b> DM Sans, comfortable size, deep ink on light surfaces.</p>
            <p><b>Utility labels:</b> Space Mono sparingly, never as the main reading voice.</p>
          </article>
          <article className="ngu-behavior-sample">
            <div className="ngu-rule-label"><Palette size={16} /> USAGE</div>
            <div className="ngu-sample-row"><button type="button">Find my starting point <ArrowRight size={15} /></button><span>One primary action</span></div>
            <div className="ngu-sample-row"><span className="ngu-neutral-sample">Browse shade notes</span><span>One clear alternative</span></div>
            <div className="ngu-sample-row"><strong>Deep plum text</strong><span>Links and labels stay readable</span></div>
            <small>Reserve berry pink for a small accent. Do not fade body copy to make a page feel softer.</small>
          </article>
        </div>
      </section>

      <section className="ngu-block ngu-flow" id="flow">
        <SectionHead eyebrow="03 / WEBSITE FLOW" title="The path should feel obvious." note="A person can look around first. They only need an account when they want to keep or share something." />
        <div className="ngu-path">
          <article><span>01</span><h3>Arrive</h3><p>Understand Neu and pick a starting point.</p></article>
          <ArrowRight className="ngu-path-arrow" size={18} />
          <article><span>02</span><h3>Explore</h3><p>Browse starter picks or make a skin profile.</p></article>
          <ArrowRight className="ngu-path-arrow" size={18} />
          <article><span>03</span><h3>Learn</h3><p>See how undertone and color theory can guide choices.</p></article>
          <ArrowRight className="ngu-path-arrow" size={18} />
          <article><span>04</span><h3>Share</h3><p>Save or add a product note after sign-up.</p></article>
        </div>
        <div className="ngu-page-list">
          {pages.map((page) => (
            <article key={page.name}>
              <strong>{page.name}</strong>
              <p>{page.detail}</p>
              <span>{page.status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="ngu-block ngu-handoff" id="handoff">
        <div className="ngu-handoff-mark"><Layers3 size={23} /></div>
        <div>
          <span className="ngu-eyebrow">04 / HANDOFF TO THE WEBSITE BUILD</span>
          <h2>Build this, not a new direction.</h2>
          <p>Carry this palette, image treatment, tone, and simple guest-to-member flow into production. Reuse the Learn guide as a real public page. Keep preview-only examples clearly labeled until there is real community content.</p>
        </div>
        <ul>
          <li><Check size={14} /> Preserve clear contrast and visible focus states.</li>
          <li><Check size={14} /> Make the navigation simple on small screens.</li>
          <li><Check size={14} /> Keep profile and recommendation details out of the hero art.</li>
          <li><Check size={14} /> Do not imply that a shade match is guaranteed.</li>
        </ul>
      </section>

      <footer className="ngu-footer">
        <a className="ngu-wordmark" href="#top"><span>n</span><strong>neu</strong></a>
        <p>Beauty is personal. Keep it that way.</p>
        <span>DESIGN DIRECTION · V1</span>
      </footer>
    </main>
  );
}
