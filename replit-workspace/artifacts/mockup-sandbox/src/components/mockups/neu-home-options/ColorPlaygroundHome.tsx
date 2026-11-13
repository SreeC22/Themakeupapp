import { useState, type CSSProperties } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import "./colorplaygroundhome.css";

const skinDepths = ["#f4e4d5", "#ebd4bf", "#dfc0a2", "#c79d7b", "#a77a5c", "#845a42", "#674534", "#432f27"];
const undertones = ["Warm", "Cool", "Neutral", "Olive"];
const categories = ["Foundation", "Concealer", "Corrector", "Powder", "Blush", "Bronzer", "Eyeshadow", "Eyeliner", "Mascara", "Brows", "Lipstick", "Lip liner", "Gloss", "Skin prep"];

export function ColorPlaygroundHome() {
  const [depth, setDepth] = useState(3);
  const [undertone, setUndertone] = useState("Neutral");
  const [category, setCategory] = useState("Foundation");
  const [saved, setSaved] = useState(false);

  return (
    <div className="pl-home">
      <header className="pl-nav">
        <a className="pl-brand" href="#pl-top" aria-label="Neu home"><span className="pl-brand-mark" /> neu</a>
        <nav className="pl-nav-links" aria-label="Main navigation">
          <a href="#pl-finder">Tone finder</a><a href="#pl-categories">Product library</a><a href="#pl-categories">Color notes</a>
        </nav>
        <a className="pl-nav-signup" href="#pl-finder">Start exploring</a>
      </header>
      <main id="pl-top">
        <section className="pl-hero">
          <div className="pl-copy">
            <span className="pl-index">Beauty is a spectrum</span>
            <h1>A little color<br />theory, no<br /><span>rules.</span></h1>
            <p>Learn how skin depth, undertone and makeup color play together. Then find the products and people that help you make it yours.</p>
            <div className="pl-actions">
              <a className="pl-button" href="#pl-finder">Find my starting point <ArrowRight size={15} /></a>
              <a className="pl-link" href="#pl-categories">Explore the library</a>
            </div>
          </div>
          <div className="pl-hero-art" aria-label="Color lab beauty still life">
            <div className="pl-main-image"><img src="/__mockup/images/neu-home-playful-lab.png" alt="Colorful makeup products and pigment swatches in a modern color lab" /></div>
            <div className="pl-color-wheel" aria-hidden="true" />
            <div className="pl-art-note"><small>TRY THE PALETTE</small>Color has no single right answer.</div>
            <div className="pl-art-counter">02 / 03</div>
          </div>
        </section>

        <section className="pl-try" id="pl-finder">
          <div className="pl-try-intro">
            <span className="pl-index">Start with a swatch</span>
            <h2>Color is a conversation.</h2>
            <p>Skin depth describes lightness to depth. Undertone describes the cast beneath it. Olive can sit alongside warm, cool or neutral. This is a playful starting point, not a diagnosis.</p>
          </div>
          <div className="pl-selector">
            <label>01 · Try a skin depth</label>
            <div className="pl-depth-row" role="group" aria-label="Select example skin depth">
              {skinDepths.map((tone, index) => <button key={tone} className={depth === index ? "is-active" : ""} style={{ backgroundColor: tone }} aria-label={`Depth ${index + 1}`} aria-pressed={depth === index} onClick={() => setDepth(index)} />)}
            </div>
            <p className="pl-depth-copy">Light <span>Depth {depth + 1}</span> Deep</p>
            <label>02 · Explore an undertone</label>
            <div className="pl-undertone-row" role="group" aria-label="Select an undertone">
              {undertones.map((tone) => <button key={tone} className={undertone === tone ? "is-active" : ""} aria-pressed={undertone === tone} onClick={() => setUndertone(tone)}>{tone}</button>)}
            </div>
            <div className="pl-result"><span className="pl-result-dot" style={{ "--pl-selected-tone": skinDepths[depth] } as CSSProperties} /><span><strong>Depth {depth + 1} · {undertone}</strong><br />Explore example products in your own light.</span></div>
          </div>
        </section>

        <section className="pl-categories" id="pl-categories">
          <span className="pl-index">The makeup library</span>
          <h2 className="pl-category-title">From base to lip. Every category belongs.</h2>
          <div className="pl-category-grid">
            {categories.map((item, index) => <button key={item} className={`pl-category${category === item ? " is-active" : ""}`} onClick={() => setCategory(item)} aria-pressed={category === item}><small>{String(index + 1).padStart(2, "0")}</small><strong>{item}</strong></button>)}
          </div>
          <div className="pl-samples">
            {["A few starter picks", "Notes from similar skin", "Your next color idea"].map((title, index) => <article className="pl-sample" key={title}><small>{index === 0 ? "Guest preview" : "Example community note"}</small><h3>{index === 0 ? `Explore ${category.toLowerCase()}` : title}</h3><p>Depth {depth + 1} · {undertone} · A starting point from a real-life routine.</p><button className="pl-save" onClick={() => setSaved((value) => !value)}>{saved ? <><Check size={11} /> Saved in preview</> : <><Sparkles size={11} /> Save this find</>}</button></article>)}
          </div>
        </section>
      </main>
      <footer className="pl-footer"><strong>neu.</strong><span>Browse a few favorites before you join. Create an account to keep your finds.</span><span>Color is a playground.</span></footer>
    </div>
  );
}

export default ColorPlaygroundHome;
