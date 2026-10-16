import { useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Check, Heart } from "lucide-react";
import "./colorstudiohome.css";

const pigments = [
  { name: "Tangerine", color: "#ef7959", note: "A little warmth, a lot of play." },
  { name: "Petal", color: "#eb9aa6", note: "Soft color can still say plenty." },
  { name: "Berry", color: "#974957", note: "Deep contrast, no permission needed." },
  { name: "Golden hour", color: "#efc85c", note: "Let your light have its moment." },
  { name: "Olive leaf", color: "#78815c", note: "Unexpected is a color direction." },
];

const categories = ["Foundation", "Concealer", "Blush", "Bronzer", "Eyes", "Lips", "Skin prep"];

export function ColorStudioHome() {
  const [activePigment, setActivePigment] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Blush");
  const [saved, setSaved] = useState(false);
  const pigment = pigments[activePigment];

  return (
    <div className="cs-home">
      <div className="cs-promo">A beauty community for every shade of you</div>
      <header className="cs-nav">
        <a className="cs-wordmark" href="#top" aria-label="Neu home">neu<span className="cs-wordmark-dot" /></a>
        <nav className="cs-nav-links" aria-label="Main navigation">
          <a href="#cs-discover">Discover</a>
          <a href="#cs-color">Color notes</a>
          <a href="#cs-how">How it works</a>
        </nav>
        <a className="cs-nav-cta" href="#cs-color">Find my colors <ArrowRight size={14} /></a>
      </header>

      <main id="top">
        <section className="cs-hero">
          <div className="cs-hero-copy">
            <p className="cs-kicker"><span className="cs-kicker-line" /> Beauty, with the volume up</p>
            <h1>Makeup<br />made to look<br /><em>like you.</em></h1>
            <p className="cs-hero-desc">
              Find shades and products through people with skin like yours. A starting point for the looks you want to make your own.
            </p>
            <div className="cs-hero-actions">
              <a className="cs-button-primary" href="#cs-color">Find my colors <ArrowRight size={16} /></a>
              <a className="cs-button-quiet" href="#cs-discover">Browse a few finds <ArrowUpRight size={15} /></a>
            </div>
            <div className="cs-note"><span className="cs-note-dot" /> Look around first. Join when you want to save.</div>
          </div>
          <div className="cs-art-frame" aria-label="Colorful beauty product still life">
            <div className="cs-art-image"><img src="/__mockup/images/neu-home-color-studio.png" alt="Unbranded blush, lip color and warm complexion shades arranged on peach and coral paper" /></div>
            <div className="cs-art-sticker">COLOR IS<br />A FEELING<br />FIRST</div>
            <div className="cs-art-caption"><small>YOUR SHADE STORY</small>A little color.<br />A lot of you.</div>
            <div className="cs-index">01 / 03</div>
          </div>
        </section>

        <section className="cs-discovery" id="cs-discover">
          <div className="cs-section-head">
            <div><span className="cs-eyebrow">See what speaks to you</span><h2>Good finds, from<br />real routines.</h2></div>
            <p>Start with a few community favorites. Set your tone to see notes from people closer to your shade story.</p>
          </div>
          <div className="cs-category-row" aria-label="Product categories">
            {categories.map((category) => (
              <button className={`cs-category-chip${activeCategory === category ? " is-active" : ""}`} key={category} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category}</button>
            ))}
          </div>
          <div className="cs-color-shelf">
            <div className="cs-palette-card" id="cs-color">
              <span className="cs-eyebrow">A tiny color lab</span>
              <h3>Choose a color mood.</h3>
              <p>Tap a shade. Try it, change it, make it yours.</p>
              <div className="cs-swatches" role="group" aria-label="Choose a color mood">
                {pigments.map((item, index) => <button key={item.name} className={activePigment === index ? "is-active" : ""} style={{ backgroundColor: item.color }} aria-label={item.name} aria-pressed={activePigment === index} onClick={() => setActivePigment(index)} />)}
              </div>
              <div className="cs-selected-pigment"><span style={{ "--cs-selected-color": pigment.color } as CSSProperties} /><strong>{pigment.name}</strong> {pigment.note}</div>
            </div>
            <article className="cs-pick-card">
              <div>
                <div className="cs-pick-card-top"><span className="cs-pick-label">Example community pick</span><Heart size={15} /></div>
                <h3>{activeCategory === "Blush" ? "Soft Pinch Liquid Blush" : `${activeCategory} people keep close`}</h3>
                <p>Shade notes from real routines help you explore what might work for your own skin and style.</p>
              </div>
              <div className="cs-pick-meta">
                <span>Example post · skin depth 3 · warm</span>
                <button onClick={() => setSaved((value) => !value)}>{saved ? <><Check size={12} /> Saved in preview</> : "Save this find"}</button>
              </div>
            </article>
          </div>
        </section>

        <section className="cs-how" id="cs-how">
          <div>
            <span className="cs-eyebrow">A good place to begin</span>
            <h2>Your skin.<br />Your choice.</h2>
            <p className="cs-how-intro">No shade is a rulebook. Neu brings together the little details that can make discovering products feel less like guessing.</p>
          </div>
          <div className="cs-steps">
            <article className="cs-step"><span className="cs-step-num">01</span><div><h3>Start with your skin</h3><p>Choose a depth, undertone and skin type, or leave anything open until you feel sure.</p></div></article>
            <article className="cs-step"><span className="cs-step-num">02</span><div><h3>Find familiar notes</h3><p>Browse makeup categories and routines from people with skin like yours.</p></div></article>
            <article className="cs-step"><span className="cs-step-num">03</span><div><h3>Keep what feels right</h3><p>Save your finds and share the products that make your own routine feel like you.</p></div></article>
          </div>
        </section>
      </main>
      <footer className="cs-footer"><strong>neu.</strong><span>Preview only. Community picks shown here are design examples.</span><span>Makeup, your way.</span></footer>
    </div>
  );
}

export default ColorStudioHome;
