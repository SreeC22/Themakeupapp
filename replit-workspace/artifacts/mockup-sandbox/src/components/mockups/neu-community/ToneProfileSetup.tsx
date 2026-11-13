import { useState, type CSSProperties } from "react";
import { ArrowRight, Check, ChevronLeft, Eye, Sparkles } from "lucide-react";
import "./toneprofilesetup.css";

const skinTones = [
  "#F5E9DE",
  "#F1DECB",
  "#EBD2B8",
  "#DDBD9B",
  "#C9A17B",
  "#AF805E",
  "#906447",
  "#744B38",
  "#56392D",
  "#392820",
];

const undertones = [
  { name: "Warm", hint: "Golden or peachy", tint: "#d99b68", mark: "sun" },
  { name: "Cool", hint: "Rosy or bluish", tint: "#bc8da0", mark: "rose" },
  { name: "Neutral", hint: "A little of both", tint: "#b8a18b", mark: "balanced" },
  { name: "Olive", hint: "Subtle green cast", tint: "#9b9c72", mark: "leaf" },
] as const;

export function ToneProfileSetup() {
  const [depth, setDepth] = useState(5);
  const [undertone, setUndertone] = useState<string>("Neutral");
  const [handle, setHandle] = useState("softfocus");
  const [complete, setComplete] = useState(false);
  const currentTone = skinTones[depth - 1];
  const validHandle = /^[a-zA-Z0-9._]{3,20}$/.test(handle);

  return (
    <div className="tone-setup">
      <header className="tone-header">
        <div className="tone-brand" aria-label="Neu">
          neu<span className="tone-brand-dot" />
          <span className="tone-brand-caption">BEAUTY, YOUR WAY</span>
        </div>
        <div className="tone-progress" aria-label="Step 1 of 3">
          <span className="tone-progress-label">YOUR PROFILE</span>
          <span className="tone-progress-track"><i /></span>
          <span className="tone-progress-count">01 <span>/ 03</span></span>
        </div>
        <button className="tone-back" type="button" onClick={() => setComplete(false)}>
          <ChevronLeft size={15} /> Back
        </button>
      </header>

      <main className="tone-main">
        {complete ? (
          <section className="tone-success" aria-live="polite">
            <div className="tone-success-mark"><Check size={24} /></div>
            <p className="tone-kicker"><Sparkles size={13} /> YOUR TONE, YOUR WAY</p>
            <h1>Looking good,<br /><em>{handle}.</em></h1>
            <p className="tone-success-copy">Your profile is ready. You can fine-tune your tone any time as you discover new favorites.</p>
            <div className="tone-success-summary">
              <span className="tone-summary-swatch" style={{ "--sample": currentTone } as CSSProperties} />
              <span><b>Depth {depth} · {undertone}</b><small>Shown beside your beauty notes</small></span>
              <button type="button" onClick={() => setComplete(false)}>Edit</button>
            </div>
            <button className="tone-submit" type="button" onClick={() => setComplete(false)}>Back to my profile <ArrowRight size={16} /></button>
          </section>
        ) : (
          <div className="tone-layout">
            <section className="tone-intro">
              <p className="tone-kicker"><span className="tone-kicker-line" /> A BETTER SHADE STARTS HERE</p>
              <h1>Let’s find<br />your <em>true tone.</em></h1>
              <p className="tone-intro-copy">A few little details help Neu bring you recommendations that feel like <i>you</i>, never a guess.</p>

              <div className="tone-art">
                <div className="tone-art-stamp">NEU<br />NO. 01</div>
                <div className="tone-art-caption"><span>YOUR STARTING POINT</span><b>A palette<br />that sees you.</b></div>
                <div className="tone-art-flatlay" aria-hidden="true">
                  <span className="tone-art-swipe tone-art-swipe-coral" />
                  <span className="tone-art-swipe tone-art-swipe-berry" />
                  <div className="tone-art-compact">
                    <span className="tone-art-pan tone-art-pan-peach" />
                    <span className="tone-art-pan tone-art-pan-pink" />
                    <span className="tone-art-pan tone-art-pan-coral" />
                    <span className="tone-art-pan tone-art-pan-gold" />
                  </div>
                  <span className="tone-art-lipstick"><i /><span /></span>
                  <span className="tone-art-jar" />
                </div>
                <div className="tone-art-bottom"><span>01 / 03</span><span>NO PHOTO NEEDED</span></div>
              </div>

              <div className="tone-privacy"><Eye size={14} /><span><b>Made for you, not the algorithm.</b><br />Your tone profile is always yours to edit.</span></div>
            </section>

            <section className="tone-form-panel" aria-label="Set up your tone profile">
              <div className="tone-form-heading">
                <span className="tone-form-step">01</span>
                <div><h2>Your skin, in your words.</h2><p>Estimates are perfect. There’s no wrong answer.</p></div>
              </div>

              <fieldset className="tone-depth-section">
                <legend><span>01</span> Skin depth <small>Choose the closest match</small></legend>
                <div className="tone-depth-scale" role="group" aria-label="Estimate your skin depth">
                  {skinTones.map((shade, index) => {
                    const level = index + 1;
                    return (
                      <button
                        aria-label={`Depth ${level}`}
                        aria-pressed={depth === level}
                        className={`tone-swatch${depth === level ? " tone-swatch-active" : ""}`}
                        key={shade}
                        onClick={() => setDepth(level)}
                        style={{ "--sample": shade } as CSSProperties}
                        type="button"
                      >
                        {depth === level && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
                <div className="tone-depth-labels"><span>Light</span><span className="tone-depth-selected">Depth {depth}</span><span>Deep</span></div>
                <input
                  aria-label="Skin depth estimate"
                  className="tone-range"
                  max="10"
                  min="1"
                  onChange={(event) => setDepth(Number(event.target.value))}
                  style={{ "--range-progress": `${((depth - 1) / 9) * 100}%` } as CSSProperties}
                  type="range"
                  value={depth}
                />
                <p className="tone-help">Think of your bare skin in natural daylight, before makeup or self-tan.</p>
              </fieldset>

              <fieldset className="tone-undertone-section">
                <legend><span>02</span> Undertone <small>What do you notice?</small></legend>
                <div className="tone-undertone-options">
                  {undertones.map((option) => (
                    <button
                      aria-pressed={undertone === option.name}
                      className={`tone-undertone-option${undertone === option.name ? " tone-undertone-active" : ""}`}
                      key={option.name}
                      onClick={() => setUndertone(option.name)}
                      type="button"
                    >
                      <span className={`undertone-mark undertone-${option.mark}`} style={{ "--undertone": option.tint } as CSSProperties}><i /></span>
                      <span className="undertone-copy"><b>{option.name}</b><small>{option.hint}</small></span>
                      <span className="undertone-check"><Check size={11} /></span>
                    </button>
                  ))}
                </div>
                <p className="tone-help">Not sure? Neutral is a lovely place to start. You can change this later.</p>
              </fieldset>

              <div className="tone-handle-section">
                <label htmlFor="tone-handle"><span className="tone-section-number">03</span> Your public handle</label>
                <div className={`tone-handle-input${!validHandle ? " tone-handle-invalid" : ""}`}>
                  <span>@</span>
                  <input
                    autoComplete="off"
                    id="tone-handle"
                    maxLength={20}
                    onChange={(event) => setHandle(event.target.value.replace(/^@/, ""))}
                    value={handle}
                  />
                  <span className="handle-visibility"><Eye size={13} /> PUBLIC</span>
                </div>
                <p className="tone-help">This is the name shown with your shared shade notes. Your email and full name stay private.</p>
                {!validHandle && <p className="tone-error" role="alert">Use 3–20 letters, numbers, dots, or underscores.</p>}
              </div>

              <div className="tone-form-footer">
                <span><i /> You can update this any time</span>
                <button className="tone-submit" disabled={!validHandle} onClick={() => setComplete(true)} type="button">
                  Save my tone profile <ArrowRight size={15} />
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
      <footer className="tone-footer"><span>neu<span className="tone-footer-dot">.</span></span><span>BEAUTY IS PERSONAL. YOUR MATCH SHOULD BE, TOO.</span></footer>
    </div>
  );
}

export default ToneProfileSetup;
