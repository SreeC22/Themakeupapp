import { useState } from "react";
import { ArrowRight, Check, Info } from "lucide-react";
import { CATEGORIES, COLOR_WHEEL, DEPTHS, type NeuPage, type Profile, type Undertone } from "./data";
import { Eyebrow, PageIntro } from "./Shared";

function ColorWheel({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  const point = (degrees: number, radius: number) => {
    const radians = ((degrees - 90) * Math.PI) / 180;
    return { x: 130 + radius * Math.cos(radians), y: 130 + radius * Math.sin(radians) };
  };
  return (
    <svg className="wj-wheel" viewBox="0 0 260 260" role="group" aria-label="Select a color from the twelve-part wheel">
      {COLOR_WHEEL.map((hue, index) => {
        const start = point(index * 30 + 2, 108);
        const end = point((index + 1) * 30 - 2, 108);
        const path = `M 130 130 L ${start.x} ${start.y} A 108 108 0 0 1 ${end.x} ${end.y} Z`;
        return <path key={hue.name} d={path} fill={hue.hex} role="button" tabIndex={0} aria-label={`Choose ${hue.name}`} aria-pressed={selected === index} onClick={() => onSelect(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(index); } }} />;
      })}
      <circle cx="130" cy="130" r="47" />
      <text x="130" y="126" textAnchor="middle">YOUR</text><text x="130" y="145" textAnchor="middle">COLOR</text>
    </svg>
  );
}

export function LearnPage({ profile, onNavigate, onUpdateProfile, quizReturnAvailable, onReturnToQuiz }: {
  profile: Profile;
  onNavigate: (page: NeuPage) => void;
  onUpdateProfile: (patch: Partial<Profile>) => void;
  quizReturnAvailable: boolean;
  onReturnToQuiz: () => void;
}) {
  const [depth, setDepth] = useState(profile.depth ?? 5);
  const [undertone, setUndertone] = useState<Undertone>(profile.undertone ?? "Still exploring");
  const [olive, setOlive] = useState<boolean>(profile.olive ?? false);
  const [hueIndex, setHueIndex] = useState(2);
  const [harmony, setHarmony] = useState<"Analogous" | "Complementary">("Complementary");
  const [example, setExample] = useState("Foundation");
  const hue = COLOR_WHEEL[hueIndex];
  const harmonies = harmony === "Complementary" ? [hueIndex, (hueIndex + 6) % 12] : [(hueIndex + 11) % 12, hueIndex, (hueIndex + 1) % 12];
  const colorExamples: Record<string, { title: string; body: string; tones: string[] }> = {
    Foundation: { title: "Match depth first. Then explore undertone.", body: `Try a few neighboring depths around ${DEPTHS[depth - 1].label.toLowerCase()} along the jaw in indirect daylight. Wait for the formula to dry before deciding. Brand names vary, and a close product shade is not a guaranteed match.`, tones: [DEPTHS[Math.max(0, depth - 2)].color, DEPTHS[depth - 1].color, DEPTHS[Math.min(9, depth)].color] },
    Blush: { title: "Echo the warmth, or play against it.", body: undertone === "Warm" ? "Peach, apricot and coral can feel tonal. Berry and plum can create a lively contrast. Both can feel like you." : undertone === "Cool" ? "Rose, raspberry and berry can feel tonal. Warm peach and terracotta can be a fun counterpoint." : "Try rose, peach, berry and terracotta side by side. Notice which feeling you want to keep.", tones: ["#D68583", "#BD8093", "#C4936E"] },
    Lip: { title: "Your lip color gets its own say.", body: "Try rosewood, brick, berry, warm nude or blue-red as starting ideas, not rules. Natural lip color changes the result, so testing on the lip is more informative than a chart.", tones: ["#AA6974", "#9E5553", "#785263"] },
    Eyeshadow: { title: "Give the wheel a little room to play.", body: `Starting near ${hue.name.toLowerCase()}, neighboring colors feel connected. The opposite side gives brighter contrast. Your eye look doesn't need to coordinate with your undertone.`, tones: harmonies.map((index) => COLOR_WHEEL[index].hex) },
    "Color corrector": { title: "Correct a specific tone, only where needed.", body: `A small amount of peach or apricot can offset blue or purple shadows at lighter depths; richer orange or terracotta tones are often used at deeper depths. Green can visually soften visible redness. An olive cast is not redness, and it does not automatically call for green.`, tones: ["#DFB095", "#C68C6F", "#9F5944"] },
    Eyeliner: { title: "Color on the eyes is pure expression.", body: "A plum, copper, blue or green liner can become an accent beside a neutral wash. Use analogous hues for a quieter story and complementary hues when a brighter contrast is the mood.", tones: harmonies.map((index) => COLOR_WHEEL[index].hex) },
  };

  return (
    <main className="wj-content">
      {quizReturnAvailable && <div className="wj-learn-return-quiz"><div><strong>Your quiz is still right where you left it.</strong><span>Your answers and current question are held in this preview’s memory.</span></div><button type="button" className="wj-primary" onClick={onReturnToQuiz}>Return to my unfinished quiz <ArrowRight size={14} /></button></div>}
      <section className="wj-learn-hero">
        <div><Eyebrow>The Neu color room</Eyebrow><h1>Color is a language.<br /><em>There are no wrong accents.</em></h1><p>A friendly guide to skin depth, undertone, olive cast and color theory. Get curious, try a combination, and keep what feels like you.</p><button className="wj-text-action" type="button" onClick={() => document.getElementById("wj-color-lab")?.scrollIntoView({ behavior: "smooth" })}>Try the color lab <ArrowRight size={14} /></button></div>
        <div className="wj-learn-wheel-art"><div className="wj-wheel-ring wj-wheel-ring--one" /><div className="wj-wheel-ring wj-wheel-ring--two" /><div className="wj-wheel-disc" /><span>DEPTH × TEMPERATURE × YOU</span></div>
      </section>

      <section className="wj-color-principles">
        <article><span>01 / LIGHT TO DEEP</span><div className="wj-tone-strip">{DEPTHS.map((item) => <i key={item.number} style={{ background: item.color }} title={item.label} />)}</div><h2>Depth is light to deep.</h2><p>Depth describes the relative lightness or darkness of a complexion. It does not tell you whether skin reads warm, cool or olive.</p></article>
        <article><span>02 / TEMPERATURE & CAST</span><div className="wj-temperature-dots"><i /><i /><i /><i /></div><h2>Undertone is a subtle cast.</h2><p>Warm, cool and neutral describe broad tendencies. Olive is a muted quality that may overlap with any of them.</p></article>
      </section>

      <section className="wj-explain-basics">
        <div><Eyebrow>Two different questions</Eyebrow><h2>Depth and undertone<br /><em>can both be true.</em></h2></div>
        <div><p><strong>Depth:</strong> which light-to-deep shade range feels closest to my skin?</p><p><strong>Undertone:</strong> do I notice golden, peach, rosy, blue, balanced or muted green notes?</p><p>Someone can have light skin with a warm undertone, deep skin with a cool undertone, or an olive cast alongside a different temperature. No category defines your makeup style.</p><div className="wj-guide-note"><Info size={17} /><p>Vein color and gold-versus-silver jewelry are weak clues, not a diagnostic test. Daylight and side-by-side swatches tell you more.</p></div></div>
      </section>

      <section className="wj-color-lab" id="wj-color-lab">
        <div className="wj-lab-header"><Eyebrow>Try it, change it, try again</Eyebrow><h2>Your little <em>color lab.</em></h2><p>Explore one choice at a time. Nothing here is a rule or a final answer.</p></div>
        <div className="wj-lab-profile-controls">
          <fieldset><legend>01 / Skin depth <strong>{DEPTHS[depth - 1].label} · {depth}/10</strong></legend><div className="wj-lab-depths" role="radiogroup" aria-label="Change skin depth">{DEPTHS.map((item) => <button key={item.number} type="button" role="radio" aria-checked={depth === item.number} aria-label={`Depth ${item.number}, ${item.label}`} className={depth === item.number ? "is-selected" : ""} style={{ background: item.color }} onClick={() => setDepth(item.number)} />)}</div><small>The colors are illustrative and shift across screens.</small></fieldset>
          <fieldset><legend>02 / Undertone <strong>{undertone}</strong></legend><div className="wj-inline-chips" role="group" aria-label="Choose an undertone">{(["Warm", "Cool", "Neutral", "Still exploring"] as Undertone[]).map((item) => <button key={item} type="button" aria-pressed={undertone === item} className={undertone === item ? "is-selected" : ""} onClick={() => setUndertone(item)}>{item}</button>)}</div><button type="button" aria-pressed={olive} className={`wj-olive-toggle${olive ? " is-selected" : ""}`} onClick={() => setOlive((current) => !current)}>{olive && <Check size={13} />} Try an olive cast as well</button></fieldset>
        </div>
        <div className="wj-harmony-area">
          <div className="wj-interactive-wheel"><ColorWheel selected={hueIndex} onSelect={setHueIndex} /></div>
          <div className="wj-harmony-copy"><span className="wj-utility-label">COLOR THEORY, LOOSELY HELD</span><h3>Choose a mood.</h3><p>You chose <strong>{hue.name}</strong>. Try a color beside it, or across the wheel.</p><div className="wj-inline-chips" role="group" aria-label="Color harmony">{(["Analogous", "Complementary"] as const).map((item) => <button key={item} type="button" aria-pressed={harmony === item} className={harmony === item ? "is-selected" : ""} onClick={() => setHarmony(item)}>{item}</button>)}</div><div className="wj-harmony-swatches">{harmonies.map((index) => <button key={index} type="button" aria-label={`Choose ${COLOR_WHEEL[index].name}`} title={COLOR_WHEEL[index].name} style={{ background: COLOR_WHEEL[index].hex }} onClick={() => setHueIndex(index)} />)}</div><p>{harmony === "Analogous" ? "Neighboring hues can feel soft and connected. Repeat a small color in more than one place." : "Opposite hues make a brighter contrast. Let one take the lead, or share the spotlight."}</p><small>Skin depth changes contrast, not permission.</small></div>
        </div>
        <div className="wj-makeup-lab">
          <Eyebrow>Bring the ideas to makeup</Eyebrow><h3>Try a color story.</h3>
          <div className="wj-inline-chips" role="group" aria-label="Choose makeup color example">{["Foundation", "Blush", "Lip", "Eyeshadow", "Color corrector", "Eyeliner"].map((item) => <button key={item} type="button" aria-pressed={example === item} className={example === item ? "is-selected" : ""} onClick={() => setExample(item)}>{item}</button>)}</div>
          <div className="wj-example-palette"><div>{colorExamples[example].tones.map((tone, index) => <i key={`${tone}-${index}`} style={{ background: tone }} />)}</div><section><h4>{colorExamples[example].title}</h4><p>{colorExamples[example].body}</p></section></div>
          <div className="wj-guide-note"><Info size={15} /><p>Colors change in real life. Formula, lighting, oxidation and natural lip or cheek color affect what you see. Compare and test where possible.</p></div>
          <button type="button" className="wj-text-action wj-lab-profile-action" onClick={() => { onUpdateProfile({ depth, undertone, olive }); onNavigate("profile"); }}>Use these as a starting point in my profile <ArrowRight size={13} /></button>
        </div>
      </section>

      <section className="wj-learn-bottom"><div><Eyebrow>Take your notes with you</Eyebrow><h2>Keep exploring on your own terms.</h2><p>Build a personal starting point or browse illustrative product examples first.</p></div><div><button className="wj-primary" type="button" onClick={() => onNavigate("quiz")}>Build a starting point <ArrowRight size={14} /></button><button className="wj-text-action" type="button" onClick={() => onNavigate("discover")}>Explore examples <ArrowRight size={14} /></button></div></section>
    </main>
  );
}

export function ProfilePage({ profile, onChange, onNavigate }: {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
  onNavigate: (page: NeuPage) => void;
}) {
  const selectedDepth = profile.depth === null ? null : DEPTHS[profile.depth - 1];
  const toggle = (value: string) => onChange({ concerns: profile.concerns.includes(value) ? profile.concerns.filter((item) => item !== value) : [...profile.concerns, value] });

  return (
    <main className="wj-content">
      <PageIntro eyebrow="A personal starting point" title="Your skin," accent="your call.">A useful profile for exploring shade experiences, not a label, diagnosis or verdict. Leave anything blank. Change it any time.</PageIntro>
      <div className="wj-profile-layout">
        <form className="wj-profile-editor" onSubmit={(event) => event.preventDefault()}>
          <section><div className="wj-editor-heading"><span>01</span><div><h2>Skin depth</h2><p>Start with the closest range, or leave the question open.</p></div></div>
            <div className="wj-profile-depth-grid" role="group" aria-label="Skin depth">{DEPTHS.map((item) => <button key={item.number} type="button" role="radio" aria-checked={profile.depth === item.number} aria-label={`Depth ${item.number}, ${item.label}`} className={profile.depth === item.number ? "is-selected" : ""} style={{ backgroundColor: item.color }} onClick={() => onChange({ depth: item.number })}>{profile.depth === item.number && <Check size={14} />}</button>)}</div>
            <div className="wj-depth-readout">{selectedDepth ? <><i style={{ background: selectedDepth.color }} />Depth {selectedDepth.number} · {selectedDepth.label}</> : "No depth selected"}</div>
            <button type="button" className="wj-text-action" onClick={() => onChange({ depth: null })}>Leave depth unset</button>
          </section>
          <section><div className="wj-editor-heading"><span>02</span><div><h2>Undertone</h2><p>What feels familiar, if anything?</p></div></div>
            <div className="wj-profile-undertones">{(["Warm", "Cool", "Neutral", "Still exploring"] as Undertone[]).map((item, index) => <button key={item} type="button" className={profile.undertone === item ? "is-selected" : ""} aria-pressed={profile.undertone === item} onClick={() => onChange({ undertone: profile.undertone === item ? null : item })}><i className={`wj-undertone-mark wj-undertone-mark--${index}`} /><span><strong>{item}</strong><small>{["Golden, peach or yellow", "Rosy, pink or blue", "A balance of tendencies", "No need to decide"][index]}</small></span>{profile.undertone === item && <Check size={15} />}</button>)}</div>
            <div className="wj-profile-olive"><div><strong>Notice an olive cast?</strong><small>Olive can overlap with warm, cool or neutral tendencies.</small></div><div role="group" aria-label="Olive cast">{[["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]].map(([value, label]) => <button type="button" className={profile.olive === (value === "yes" ? true : value === "no" ? false : null) && profile.olive !== null || value === "unsure" && profile.olive === null ? "is-selected" : ""} aria-pressed={profile.olive === (value === "yes" ? true : value === "no" ? false : null) && profile.olive !== null || value === "unsure" && profile.olive === null} key={value} onClick={() => onChange({ olive: value === "yes" ? true : value === "no" ? false : null })}>{label}</button>)}</div></div>
            <button type="button" className="wj-text-action" onClick={() => onChange({ undertone: "Still exploring", olive: null })}>Leave it open <ArrowRight size={13} /></button>
          </section>
          <section><div className="wj-editor-heading"><span>03</span><div><h2>Skin and formula</h2><p>Optional preferences. Not a medical assessment.</p></div></div>
            <div className="wj-chip-wrap">{["Dry", "Oily", "Combination", "Normal", "Sensitive", "Not sure"].map((item) => <button type="button" className={profile.skinType === item ? "is-selected" : ""} aria-pressed={profile.skinType === item} onClick={() => onChange({ skinType: profile.skinType === item ? null : item })} key={item}>{item}</button>)}</div>
          </section>
          <section><div className="wj-editor-heading"><span>04</span><div><h2>What I notice</h2><p>Optional cosmetic observations, not health or medical conditions.</p></div></div>
            <div className="wj-chip-wrap">{["Dry patches", "Visible shine", "Uneven texture", "Visible redness", "Visible pores", "Uneven tone", "Under-eye tone", "Post-blemish marks", "Occasional sensitivity", "Not sure"].map((item) => <button key={item} type="button" className={profile.concerns.includes(item) ? "is-selected" : ""} aria-pressed={profile.concerns.includes(item)} onClick={() => toggle(item)}>{profile.concerns.includes(item) && <Check size={13} />}{item}</button>)}</div>
          </section>
          <section><div className="wj-editor-heading"><span>05</span><div><h2>What you reach for</h2><p>Categories can shape your example browsing.</p></div></div>
            <div className="wj-chip-wrap">{CATEGORIES.slice(1).map((item) => <button key={item} type="button" className={profile.categories.includes(item) ? "is-selected" : ""} aria-pressed={profile.categories.includes(item)} onClick={() => onChange({ categories: profile.categories.includes(item) ? profile.categories.filter((entry) => entry !== item) : [...profile.categories, item] })}>{profile.categories.includes(item) && <Check size={13} />}{item}</button>)}</div>
          </section>
          <section><label className="wj-display-name">Display name <span>Optional. Your name is not used by this design preview.</span><input value={profile.displayName} maxLength={28} placeholder="Add a display name" onChange={(event) => onChange({ displayName: event.target.value })} /></label></section>
          <footer className="wj-profile-footer"><span>These edits stay in the current preview only.</span><button className="wj-primary" type="button" onClick={() => onNavigate("discover")}>Browse examples <ArrowRight size={14} /></button></footer>
        </form>
        <aside className="wj-profile-aside"><Eyebrow>A note on your data</Eyebrow><h2>Nothing leaves this preview.</h2><p>Changes are held in temporary page state. No account, browser storage, server profile or community visibility is connected.</p><div><Info size={15} /> Sharing profile details with a post must always require a separate, explicit choice.</div><button className="wj-text-action" type="button" onClick={() => onNavigate("learn")}>Read the public Learn guide <ArrowRight size={14} /></button></aside>
      </div>
    </main>
  );
}
