import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowRight, Bookmark, Check, ChevronDown, CircleHelp, Compass, Droplets, FlaskConical, SlidersHorizontal, Sparkles, Sun, Waves } from "lucide-react";
import "./shade-session.css";

const depthScale = [
  { name: "Porcelain", color: "#f4dfcc" },
  { name: "Fair", color: "#ebc9ab" },
  { name: "Light", color: "#dfb590" },
  { name: "Light medium", color: "#d1a17b" },
  { name: "Medium", color: "#bd875f" },
  { name: "Tan", color: "#a66e4e" },
  { name: "Deep tan", color: "#89583f" },
  { name: "Deep", color: "#704632" },
  { name: "Rich", color: "#57372c" },
  { name: "Deepest", color: "#3f2b25" },
];

const catalog = {
  Foundation: [
    { brand: "Kosas", name: "Revealer Skin-Improving Foundation", shade: "260 · Medium neutral olive", color: "#b98461", note: "Closest depth + muted golden cast", fit: 96, finish: "Natural · medium coverage" },
    { brand: "Fenty Beauty", name: "Eaze Drop Blurring Skin Tint", shade: "12 · Medium deep neutral", color: "#aa7656", note: "A touch deeper, beautifully balanced", fit: 91, finish: "Soft matte · light coverage" },
    { brand: "NARS", name: "Light Reflecting Foundation", shade: "Stromboli · medium 3", color: "#c38c68", note: "Warmer by half a step", fit: 87, finish: "Radiant · medium coverage" },
  ],
  Concealer: [
    { brand: "NARS", name: "Radiant Creamy Concealer", shade: "Ginger · medium 2", color: "#c9926d", note: "Brightens without turning pink", fit: 96, finish: "Radiant · buildable" },
    { brand: "Kosas", name: "Revealer Concealer", shade: "6.5 · medium olive", color: "#b9825c", note: "Very close to your base shade", fit: 92, finish: "Skin-like · medium coverage" },
    { brand: "Tower 28", name: "Swipe Serum Concealer", shade: "10.0 DTLA", color: "#d19d77", note: "One step brighter for under-eyes", fit: 88, finish: "Natural · flexible" },
  ],
  Blush: [
    { brand: "Rare Beauty", name: "Soft Pinch Liquid Blush", shade: "Love · terracotta", color: "#b65f4b", note: "Warm contrast that stays lively", fit: 96, finish: "Matte · high pigment" },
    { brand: "Saie", name: "Dew Blush", shade: "Spicy · warm terracotta", color: "#bf715d", note: "Sheer, sun-warmed color", fit: 92, finish: "Dewy · buildable" },
    { brand: "Merit", name: "Flush Balm", shade: "Fox · soft terracotta", color: "#a95e4d", note: "A muted, skin-close alternative", fit: 88, finish: "Sheer · satin" },
  ],
};

type Category = keyof typeof catalog;
const categories = Object.keys(catalog) as Category[];

export default function ShadeSession() {
  const [category, setCategory] = useState<Category>("Foundation");
  const [depth, setDepth] = useState(5);
  const [undertone, setUndertone] = useState("Olive");
  const [finish, setFinish] = useState("Natural");
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(false);
  const [compare, setCompare] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const picks = catalog[category];
  const active = picks[selected];
  const depthInfo = depthScale[depth - 1];
  const stepName = useMemo(() => depth <= 3 ? "light" : depth <= 6 ? "medium" : "deep", [depth]);

  return (
    <div className="shade-session">
      <header className="ss-topbar">
        <div className="ss-brand"><span className="ss-mark">n</span><span className="ss-wordmark">neu</span><span className="ss-brand-rule" /><span className="ss-brand-caption">THE SHADE DESK</span></div>
        <div className="ss-session-label"><span className="ss-live-dot" /> YOUR PRIVATE MATCH SESSION <span className="ss-session-number">NO. 0148</span></div>
        <button className="ss-profile-button" onClick={() => setHelpOpen(!helpOpen)}><span className="ss-avatar">A</span><span>My profile</span><ChevronDown size={14} /></button>
      </header>

      <div className="ss-workspace">
        <aside className="ss-rail">
          <div className="ss-rail-top">
            <span className="ss-rail-kicker">TODAY'S EDIT</span>
            <h2>A match,<br /><em>not a mask.</em></h2>
            <p>A considered starting point for products that feel like they belong on your skin.</p>
          </div>
          <div className="ss-profile-card">
            <div className="ss-profile-card-head"><span>YOUR SKIN NOTES</span><button onClick={() => setHelpOpen(!helpOpen)} aria-label="Explain skin notes"><CircleHelp size={15} /></button></div>
            <div className="ss-profile-person"><span className="ss-profile-avatar">A</span><span><strong>Alex's edit</strong><small>Updated just now</small></span></div>
            <div className="ss-note-row"><span className="ss-note-icon"><Sun size={14} /></span><span><small>DEPTH</small><strong>{depthInfo.name}</strong></span><span className="ss-note-swatch" style={{ background: depthInfo.color }} /></div>
            <div className="ss-note-row"><span className="ss-note-icon ss-note-icon--olive"><Waves size={14} /></span><span><small>UNDERTONE</small><strong>{undertone} · muted</strong></span><i className="ss-olive-chip" /></div>
            <div className="ss-note-row"><span className="ss-note-icon ss-note-icon--skin"><Droplets size={14} /></span><span><small>SKIN TYPE</small><strong>Combination</strong></span></div>
          </div>
          {helpOpen && <div className="ss-help-note"><strong>These are clues, not rules.</strong><span>Depth and undertone are separate. Olive can overlap with warm, cool, or neutral.</span></div>}
          <div className="ss-rail-bottom">
            <div className="ss-rail-progress"><span>YOUR MATCH PROFILE</span><strong>04 <i>/ 05</i></strong></div>
            <div className="ss-progress-track"><span /></div>
            <button className="ss-edit-profile" onClick={() => setHelpOpen(!helpOpen)}><SlidersHorizontal size={14} /> Adjust skin notes <ArrowRight size={13} /></button>
            <div className="ss-rail-foot"><span>DESIGN PREVIEW</span><span>Example product matches</span></div>
          </div>
        </aside>

        <main className="ss-main">
          <div className="ss-main-header">
            <div>
              <div className="ss-eyebrow"><span /> YOUR SHADE SHORTLIST <span className="ss-eyebrow-count">03 OPTIONS</span></div>
              <h1>Start with a shade.<br /><em>See how it sits.</em></h1>
            </div>
            <div className="ss-header-note"><span className="ss-note-spark"><Sparkles size={15} /></span><span><strong>Made for your skin notes</strong><small>Depth {depth} · {undertone.toLowerCase()} · {stepName} range</small></span></div>
          </div>

          <div className="ss-controlbar">
            <div className="ss-category-switch" role="tablist" aria-label="Product category">
              {categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? "is-active" : ""} onClick={() => { setCategory(item); setSelected(0); setSaved(false); }}>{item}<span>{item === "Foundation" ? "01" : item === "Concealer" ? "02" : "03"}</span></button>)}
            </div>
            <button className={`ss-compare-toggle ${compare ? "is-on" : ""}`} onClick={() => setCompare(!compare)}><span className="ss-toggle-track"><i /></span> Compare shades</button>
          </div>

          <div className="ss-results-layout">
            <section className="ss-shortlist" aria-label={`${category} shade options`}>
              <div className="ss-list-intro"><span>THE SHORTLIST</span><small>Ranked by how closely they echo your notes</small></div>
              {picks.map((item, index) => (
                <button key={item.brand} className={`ss-pick ${selected === index ? "is-selected" : ""}`} onClick={() => { setSelected(index); setSaved(false); }}>
                  <span className="ss-pick-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="ss-pick-swatch" style={{ background: item.color }} />
                  <span className="ss-pick-copy"><strong>{item.brand}</strong><span>{item.shade}</span><small>{item.name}</small></span>
                  <span className="ss-fit"><strong>{item.fit}</strong><small>FIT</small></span>
                  {selected === index && <span className="ss-pick-check"><Check size={12} /></span>}
                </button>
              ))}
              <div className="ss-list-foot"><span>Match score is a guide, never a verdict.</span><button onClick={() => setHelpOpen(!helpOpen)}>How we compare <ArrowRight size={12} /></button></div>
            </section>

            <section className="ss-detail-card">
              <div className="ss-detail-topline"><span><FlaskConical size={13} /> SHADE STUDY <i>·</i> {category.toUpperCase()}</span><span>EXAMPLE MATCH</span></div>
              <div className="ss-swatch-stage">
                <div className="ss-stage-orbit ss-stage-orbit--one" /><div className="ss-stage-orbit ss-stage-orbit--two" />
                <div className="ss-swatch-card ss-swatch-card--skin" style={{ background: `linear-gradient(138deg, ${depthInfo.color}, ${active.color})` }}><span>YOUR DEPTH</span><strong>{depthInfo.name}</strong></div>
                <ArrowDownRight className="ss-blend-arrow" size={24} />
                <div className="ss-swatch-card ss-swatch-card--product" style={{ background: active.color }}><span>SHADE {selected + 1}</span><strong>{active.shade.split(" · ")[0]}</strong></div>
                <div className="ss-swatch-footnote">SIDE-BY-SIDE, IN DAYLIGHT</div>
              </div>
              <div className="ss-detail-body">
                <div className="ss-product-title"><span>{active.brand}</span><h2>{active.name}</h2><div className="ss-shade-line"><i style={{ backgroundColor: active.color }} />{active.shade}</div></div>
                <div className="ss-fit-meter"><div><span>PROFILE RESONANCE</span><strong>{active.fit}<small>%</small></strong></div><div className="ss-meter-track"><i style={{ width: `${active.fit}%` }} /></div><small>Depth, undertone & formula fit</small></div>
              </div>
              <div className="ss-match-note"><span className="ss-note-spark"><Sparkles size={14} /></span><span><strong>Why this one is on your list</strong><small>{active.note}. Compare on your jawline in indirect daylight; shade names vary by brand.</small></span></div>
              <div className="ss-detail-footer">
                <span className="ss-finish-note"><span>FINISH</span>{active.finish}</span>
                <button className={`ss-save-button ${saved ? "is-saved" : ""}`} onClick={() => setSaved(!saved)}>{saved ? <Check size={15} /> : <Bookmark size={15} />}{saved ? "Saved to your edit" : "Save this shade"}</button>
              </div>
            </section>
          </div>

          <section className="ss-tune-strip">
            <div className="ss-tune-title"><span className="ss-tune-icon"><SlidersHorizontal size={15} /></span><span><strong>Fine-tune the match</strong><small>Change the starting notes; shortlist updates instantly.</small></span></div>
            <div className="ss-depth-tune"><div className="ss-tune-label"><span>DEPTH</span><strong>{depthInfo.name}</strong></div><div className="ss-depth-swatches">{depthScale.map((tone, i) => <button key={tone.name} aria-label={`Depth ${i + 1}, ${tone.name}`} aria-pressed={depth === i + 1} className={depth === i + 1 ? "is-current" : ""} style={{ backgroundColor: tone.color }} onClick={() => setDepth(i + 1)} />)}</div></div>
            <div className="ss-undertone-tune"><span className="ss-tune-label">UNDERTONE</span><div>{["Warm", "Neutral", "Olive", "Cool"].map((tone) => <button key={tone} className={undertone === tone ? "is-current" : ""} onClick={() => setUndertone(tone)}>{tone}</button>)}</div></div>
          </section>

          <div className={`ss-compare-drawer ${compare ? "is-open" : ""}`} aria-hidden={!compare}>
            <span className="ss-drawer-icon"><Compass size={16} /></span><span><strong>Compare the shortlist in natural light.</strong><small>{picks.map((item) => item.shade.split(" · ")[0]).join("  /  ")}</small></span><button onClick={() => setCompare(false)}>Done <Check size={14} /></button>
          </div>
          <footer className="ss-disclaimer"><span>NEU / SHADE DESK</span><span>Matchmaking is a starting point, not a diagnosis. Try a sample when possible.</span><span>01 — 03</span></footer>
        </main>
      </div>
    </div>
  );
}
