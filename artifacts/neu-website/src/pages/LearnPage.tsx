import { ArrowRight, Info } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { COLOR_WHEEL, DEPTHS, UNDERTONES, type Profile, type Undertone } from "@/data/neu";

const EXAMPLES = ["Foundation", "Blush", "Lip", "Eyeshadow", "Color corrector"] as const;
type Example = (typeof EXAMPLES)[number];
const samplePalettes: Record<Example, string[]> = {
  Foundation: ["#EADABA", "#D7BD96", "#A07E56"],
  Blush: ["#D07C73", "#BB7582", "#BA8669"],
  Lip: ["#A8565D", "#BA7F77", "#805A65"],
  Eyeshadow: ["#9A7199", "#5F81A8", "#D9AD57"],
  "Color corrector": ["#DCA578", "#A2A881", "#C97868"],
};

function ColorWheel({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  const point = (degrees: number) => {
    const radians = ((degrees - 90) * Math.PI) / 180;
    return { x: 130 + 112 * Math.cos(radians), y: 130 + 112 * Math.sin(radians) };
  };
  return (
    <svg className="interactive-wheel" viewBox="0 0 260 260" role="group" aria-label="Choose a color on the 12-hue wheel">
      {COLOR_WHEEL.map((hue, index) => {
        const start = point(index * 30 + 2);
        const end = point((index + 1) * 30 - 2);
        const path = `M 130 130 L ${start.x} ${start.y} A 112 112 0 0 1 ${end.x} ${end.y} Z`;
        return <path key={hue.name} d={path} fill={hue.hex} role="button" tabIndex={0}
          aria-label={`Choose ${hue.name}`} aria-pressed={selected === index}
          className={selected === index ? "is-selected" : ""}
          onClick={() => onSelect(index)} onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(index); }
          }} />;
      })}
      <circle cx="130" cy="130" r="47" className="wheel-center" />
      <text x="130" y="127" textAnchor="middle" className="wheel-center-text">YOUR</text>
      <text x="130" y="146" textAnchor="middle" className="wheel-center-text">COLOR</text>
    </svg>
  );
}

export default function LearnPage({ profile, onUseProfile }: { profile: Profile; onUseProfile: (patch: Partial<Profile>) => void }) {
  const [depth, setDepth] = useState(profile.depth);
  const [undertone, setUndertone] = useState<Undertone>(profile.undertone);
  const [olive, setOlive] = useState(profile.oliveCast);
  const [selectedHue, setSelectedHue] = useState(2);
  const [harmony, setHarmony] = useState<"analogous" | "complementary">("complementary");
  const [example, setExample] = useState<Example>("Foundation");
  const harmonyIndices = harmony === "complementary"
    ? [selectedHue, (selectedHue + 6) % 12]
    : [(selectedHue + 10) % 12, (selectedHue + 11) % 12, selectedHue, (selectedHue + 1) % 12, (selectedHue + 2) % 12];
  const toneLabel = undertone === "Not sure" ? "still exploring" : `${undertone.toLowerCase()}${olive ? " with an olive cast" : ""}`;
  const selectedDepth = DEPTHS[depth - 1];
  const selectedColor = COLOR_WHEEL[selectedHue];
  const exampleCopy: Record<Example, { title: string; body: string }> = {
    Foundation: {
      title: "Match depth first; refine undertone second.",
      body: `At ${selectedDepth.label.toLowerCase()} depth, compare a few neighboring shades along the jaw and down to the neck in indirect daylight. Look at the dry-down, too. Shade names are only clues. Brands and formulas vary.`,
    },
    Blush: {
      title: "A cheek color can echo, contrast or simply delight.",
      body: undertone === "Warm" ? "Try peach, apricot or warm coral for a tonal flush; reach for berry or plum when you want more contrast." : undertone === "Cool" ? "Try rose, raspberry or berry for a tonal flush; warm peach or terracotta can make a lively contrast." : "Try rose, peach, berry or terracotta side by side. Notice which one feels like your version of a fresh cheek.",
    },
    Lip: {
      title: "The best lip shade is a mood, not a formula.",
      body: undertone === "Warm" ? "Explore cinnamon, brick, warm rose and caramel nude. For a cooler contrast, try a clear berry or blue-red." : undertone === "Cool" ? "Explore rose, mauve, berry and blue-red. A warm brown, terracotta or coral can be a beautiful counterpoint." : "Explore rosewood, soft berry, warm nude and classic red. Swatch on the lip when possible; natural lip color changes the result.",
    },
    Eyeshadow: {
      title: "Use the wheel as a starting sketch.",
      body: `A color near ${selectedColor.name.toLowerCase()} can sit quietly beside its neighbors, or pop against its opposite. Bronze, plum, teal, taupe and every version in between can work across depths.`,
    },
    "Color corrector": {
      title: "Correct a specific tone, not your whole face.",
      body: `For blue or purple shadows, try a small amount of ${depth <= 3 ? "soft peach" : depth <= 6 ? "peach or apricot" : "orange, terracotta or red-orange"} and blend only where needed. Green can soften visible redness. Olive cast is not redness, and olive skin does not need green corrector by default.`,
    },
  };

  return (
    <main className="content">
      <section className="learn-hero">
        <div><span className="eyebrow">The Neu color room</span><h1>Color is a language.<br /><em>There are no wrong accents.</em></h1>
          <p>A friendly guide to skin depth, undertone and color theory. Get curious, try a combination, and keep the shades that feel like you.</p>
          <a className="text-button" href="#color-lab">Enter the color lab <ArrowRight size={15} /></a>
        </div>
        <div className="learn-wheel-hero" aria-label="Color swatches arranged around an editorial color wheel">
          <span className="wheel-ring" /><span className="wheel-ring two" /><div className="wheel-visual" /><small className="wheel-caption">DEPTH × TEMPERATURE × YOU</small>
        </div>
      </section>

      <section className="principles" aria-label="Color basics">
        <article className="principle"><span className="principle-num">01</span><div className="depth-strip">{DEPTHS.map((item) => <span key={item.depth} style={{ backgroundColor: item.hex }} />)}</div>
          <h2>Depth is light to deep.</h2><p>It describes how light or deep a skin tone appears. It does not tell you whether skin leans warm, cool or olive.</p></article>
        <article className="principle"><span className="principle-num">02</span><div className="temp-strip">{UNDERTONES.map((item) => <span key={item.name} style={{ backgroundColor: item.hex }} />)}<span style={{ backgroundColor: "#9BA47B" }} /></div>
          <h2>Undertone is a subtle cast.</h2><p>Warm, cool and neutral describe temperature tendencies. Olive is a muted green-gold cast that can overlap with any of them.</p></article>
      </section>

      <section className="explain">
        <div><span className="eyebrow">A more useful way to think about it</span><h2>Two different questions.<br /><em>Both can be true.</em></h2></div>
        <div><p><strong>Depth:</strong> how light or deep is the shade family that disappears most naturally into my skin?</p>
          <p><strong>Undertone:</strong> does the skin seem to lean golden, peach, pink, blue, muted green, or a blend?</p>
          <p>People can have warm undertones at deeper depths, cool undertones at lighter depths, or an olive cast alongside another temperature. You do not need to fit one tidy box.</p>
          <div className="clue-note"><Info size={17} /><span>Vein color and gold-versus-silver jewelry are clues some people like to try, not reliable diagnoses. If they disagree, trust your own side-by-side swatches, or leave the label open.</span></div>
        </div>
      </section>

      <section className="learn-panel" id="color-lab">
        <header className="learn-panel-head"><span className="eyebrow">Try it, change it, try again</span><h2>Your little <em>color lab.</em></h2><p>Explore a few variables. Nothing here is a rule or a final answer.</p></header>
        <div className="lab-controls">
          <div className="lab-control"><div className="control-heading"><span>01 · Depth</span><strong>{selectedDepth.label} · {depth}/10</strong></div>
            <div className="lab-depth" role="radiogroup" aria-label="Try a skin depth">{DEPTHS.map((item) => <button key={item.depth} type="button" role="radio" aria-checked={depth === item.depth} aria-label={`Depth ${item.depth}: ${item.label}`} className={depth === item.depth ? "is-selected" : ""} style={{ backgroundColor: item.hex }} onClick={() => setDepth(item.depth)} />)}</div><p>Choose a swatch to change the examples below.</p>
          </div>
          <div className="lab-control"><div className="control-heading"><span>02 · Temperature</span><strong>{undertone}</strong></div>
            <div className="lab-undertone">{(["Warm", "Cool", "Neutral", "Not sure"] as Undertone[]).map((item) => <button type="button" key={item} className={`pill ${undertone === item ? "is-selected" : ""}`} aria-pressed={undertone === item} onClick={() => setUndertone(item)}>{item}</button>)}</div>
            <button type="button" className={`pill ${olive ? "is-selected" : ""}`} aria-pressed={olive} onClick={() => setOlive((current) => !current)}>Explore an olive cast too</button>
          </div>
        </div>
        <div className="harmony-row">
          <ColorWheel selected={selectedHue} onSelect={setSelectedHue} />
          <div className="harmony-copy"><span className="mono">COLOR THEORY, LOOSELY HELD</span><h3>Choose a mood.</h3>
            <div className="toggle-row"><button type="button" className={`pill ${harmony === "analogous" ? "is-selected" : ""}`} aria-pressed={harmony === "analogous"} onClick={() => setHarmony("analogous")}>Analogous</button>
              <button type="button" className={`pill ${harmony === "complementary" ? "is-selected" : ""}`} aria-pressed={harmony === "complementary"} onClick={() => setHarmony("complementary")}>Complementary</button></div>
            <p>{harmony === "analogous" ? "Neighboring hues feel connected and tonal. Try a soft gradient or repeat one color in a smaller detail." : "Opposite hues create a livelier contrast. One can be the main event; the other can be a small accent."}</p>
            <div className="swatch-row">{harmonyIndices.map((index) => <button type="button" key={index} className="example-swatch" style={{ backgroundColor: COLOR_WHEEL[index].hex }} title={`Try ${COLOR_WHEEL[index].name}`} aria-label={`Try ${COLOR_WHEEL[index].name}`} onClick={() => setSelectedHue(index)} />)}</div>
            <p>Your skin depth changes contrast, not permission.</p>
          </div>
        </div>
        <div className="editor-section">
          <span className="eyebrow">Bring the ideas to makeup</span><h3>Try a color story.</h3>
          <div className="example-tabs" role="tablist" aria-label="Makeup color examples">{EXAMPLES.map((item) => <button key={item} type="button" role="tab" aria-selected={example === item} className={`pill ${example === item ? "is-selected" : ""}`} onClick={() => setExample(item)}>{item}</button>)}</div>
          <div className="example-content"><div className="swatch-row">{samplePalettes[example].map((color, index) => <span key={`${color}-${index}`} className="example-swatch" style={{ backgroundColor: color }} />)}</div>
            <div><h3>{exampleCopy[example].title}</h3><p>{exampleCopy[example].body}</p></div>
          </div>
          <p className="field-hint">Your exploration: {selectedDepth.label.toLowerCase()} · {toneLabel}. Use the controls above to try another combination.</p>
        </div>
      </section>

      <section className="real-world"><div><span className="eyebrow">Reality check</span><h2>Color changes in the real world.</h2></div>
        <div><p>Screens, lighting, wear time and product formulas all shift how a shade looks. A product can oxidize, sheer out or read differently beside your natural lip or cheek color.</p>
          <p>Compare swatches in daylight when you can, give complexion products time to dry down, and use sample sizes or store testers if available. Your own mirror is more useful than a rigid chart.</p></div>
      </section>
      <section className="learn-cta"><div><span className="mono">TAKE YOUR NOTES WITH YOU</span><h2>Keep exploring on your own terms.</h2><p>Use these choices in your local profile, or head straight to product examples.</p></div>
        <div className="hero-actions"><button className="primary" type="button" onClick={() => onUseProfile({ depth, undertone, oliveCast: olive })}>Use in my profile <ArrowRight size={15} /></button><Link className="text-button" href="/discover">Explore examples <ArrowRight size={14} /></Link></div>
      </section>
    </main>
  );
}
