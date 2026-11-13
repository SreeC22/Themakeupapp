import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import "./beautydiaryhome.css";

const diaryColors = [
  { name: "Petal", color: "#d8928c", caption: "Soft, sheer, still yours" },
  { name: "Rosewood", color: "#a95858", caption: "A little depth for every day" },
  { name: "Mulberry", color: "#6d3f52", caption: "For the days you want more" },
  { name: "Apricot", color: "#e69e70", caption: "A warm wash, not a rule" },
];

const diaryCategories = ["Complexion", "Blush", "Bronzer", "Eyes", "Lips", "Prep & finish"];

export function BeautyDiaryHome() {
  const [activeColor, setActiveColor] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Blush");
  const [saved, setSaved] = useState(false);
  const color = diaryColors[activeColor];

  return (
    <div className="bd-home">
      <div className="bd-topline">Your makeup notes, collected in one place</div>
      <header className="bd-nav">
        <a className="bd-logo" href="#bd-top" aria-label="Neu home">neu<span className="bd-logo-flower" /></a>
        <nav className="bd-links" aria-label="Main navigation">
          <a href="#bd-journal">The community</a><a href="#bd-journal">Color diary</a><a href="#bd-how">How it works</a>
        </nav>
        <a className="bd-account" href="#bd-how">Start with your skin</a>
      </header>

      <main id="bd-top">
        <section className="bd-hero">
          <div className="bd-copy">
            <span className="bd-overline">Notes from real-life beauty</span>
            <h1>The shades<br />you keep<br /><em>coming back to.</em></h1>
            <p>Stories, shade notes and favorite routines from people whose skin feels familiar. Explore first. Save the ones that stay with you.</p>
            <div className="bd-actions">
              <a className="bd-primary" href="#bd-journal">Open the beauty diary <ArrowRight size={15} /></a>
              <a className="bd-secondary" href="#bd-how">How it works <ArrowUpRight size={14} /></a>
            </div>
            <div className="bd-hero-note">Your skin is a starting point, never a label.</div>
          </div>
          <div className="bd-collage" aria-label="A beauty journal collage">
            <div className="bd-photo"><img src="/__mockup/images/neu-home-beauty-diary.png" alt="Tactile makeup journal still life with pigment swatches" /></div>
            <div className="bd-index">A NOTE TO SELF · 01</div>
            <div className="bd-paper-note"><small>Color to come back to</small><strong>{color.name}<br />looks like a good idea.</strong></div>
            <div className="bd-flower-sticker" aria-hidden="true">neu</div>
          </div>
        </section>

        <section className="bd-journal" id="bd-journal">
          <div className="bd-journal-head">
            <div><span className="bd-overline">The beauty diary</span><h2>Little things that<br />made the look.</h2></div>
            <p>Browse a few example community notes. Create your profile to find routines from people with similar skin.</p>
          </div>
          <div className="bd-category-line" aria-label="Makeup categories">
            {diaryCategories.map((category) => <button className={activeCategory === category ? "is-active" : ""} key={category} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category}</button>)}
          </div>
          <div className="bd-product-grid">
            <article className="bd-product bd-product--feature">
              <span className="bd-product-tag">Example community note</span>
              <h3>{activeCategory === "Blush" ? "Rare Beauty Soft Pinch" : `A little ${activeCategory.toLowerCase()} note`}</h3>
              <p>One tiny tap. Warm it between fingers. Keep the rest of the look completely your own.</p>
              <div className="bd-product-actions"><small>Depth 3 · warm · dry skin</small><button onClick={() => setSaved((value) => !value)}>{saved ? <><Check size={12} /> Saved in preview</> : "Save this note"}</button></div>
            </article>
            <article className="bd-product">
              <span className="bd-product-tag">Shade note</span>
              <h3>Soft color, close to skin</h3>
              <p>A sheer wash of color for days that call for something easy.</p>
              <div className="bd-product-actions"><small>Example pick</small><button onClick={() => setSaved((value) => !value)}>{saved ? "Saved in preview" : "Keep this"}</button></div>
            </article>
            <article className="bd-product">
              <span className="bd-product-tag">A little more</span>
              <h3>Find your own version</h3>
              <p>Share the products and shades that have earned a place in your routine.</p>
              <div className="bd-product-actions"><small>One more note, yours</small><button onClick={() => setSaved((value) => !value)}>{saved ? "Saved in preview" : "Save a find"}</button></div>
            </article>
          </div>
          <div className="bd-category-line" aria-label="Try a color from the diary">
            {diaryColors.map((item, index) => <button key={item.name} className={activeColor === index ? "is-active" : ""} onClick={() => setActiveColor(index)} aria-pressed={activeColor === index}>{item.name}</button>)}
          </div>
        </section>

        <section className="bd-closer" id="bd-how">
          <div><span className="bd-overline">Every routine tells a story</span><h2>Write yours<br />as you go.</h2></div>
          <p>Tell Neu about your skin, explore product categories, and learn how color can play. Make an account when you want to save your favorite notes.</p>
          <a className="bd-primary" href="#bd-journal">Start with my skin <ArrowRight size={15} /></a>
        </section>
      </main>
      <footer className="bd-footer"><span>neu beauty notes</span><span>Example posts only. No notes are published from this preview.</span></footer>
    </div>
  );
}

export default BeautyDiaryHome;
