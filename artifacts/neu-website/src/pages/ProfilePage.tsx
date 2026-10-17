import { Check, Info } from "lucide-react";
import { CONCERNS, DEPTHS, SKIN_TYPES, UNDERTONES, type Profile } from "@/data/neu";
import { Link } from "wouter";

type Props = {
  profile: Profile;
  storageStatus: "loading" | "saved" | "unavailable";
  onChange: (patch: Partial<Profile>) => void;
};

export default function ProfilePage({ profile, storageStatus, onChange }: Props) {
  const chosenDepth = DEPTHS[profile.depth - 1];
  return (
    <main className="content">
      <header className="page-heading">
        <span className="eyebrow">Your shade profile</span>
        <h1>Your skin, <em>your starting point.</em></h1>
        <p>A starting point for exploring product notes, not a label or a verdict. You can leave anything open or change it at any time.</p>
      </header>
      <div className="profile-layout">
        <form className="editor" onSubmit={(event) => event.preventDefault()}>
          <section className="editor-section">
            <div className="section-title"><h2><span className="number">01</span>Skin depth</h2><span>Choose the closest starting point</span></div>
            <div className="depth-options" role="radiogroup" aria-label="Skin depth">
              {DEPTHS.map((item) => (
                <button key={item.depth} type="button" role="radio" aria-checked={profile.depth === item.depth}
                  aria-label={`Depth ${item.depth}: ${item.label}`} title={`Depth ${item.depth}: ${item.label}`}
                  className={`depth-option ${profile.depth === item.depth ? "is-selected" : ""}`}
                  style={{ backgroundColor: item.hex }} onClick={() => onChange({ depth: item.depth })}>
                  {profile.depth === item.depth && <Check size={15} />}
                </button>
              ))}
            </div>
            <div className="depth-legend"><span>Light</span><span>Medium</span><span>Deep</span></div>
            <div className="selected-depth"><span className="depth-dot" style={{ backgroundColor: chosenDepth.hex }} />
              <span><strong>Depth {String(profile.depth).padStart(2, "0")}</strong> · {chosenDepth.label}</span><span className="mono">10-POINT SCALE</span>
            </div>
          </section>

          <section className="editor-section">
            <div className="section-title"><h2><span className="number">02</span>Undertone</h2><span>What do you notice beneath the surface?</span></div>
            <div className="option-grid">
              {UNDERTONES.map((option) => (
                <button key={option.name} type="button" className={`option-card ${profile.undertone === option.name ? "is-selected" : ""}`}
                  aria-pressed={profile.undertone === option.name} onClick={() => onChange({ undertone: option.name })}>
                  <span className="undertone-dot" style={{ backgroundColor: option.hex }} />
                  <span><strong>{option.name}</strong><small>{option.description}</small></span>
                  {profile.undertone === option.name && <Check size={15} />}
                </button>
              ))}
            </div>
            <div className="toggle-row">
              <button type="button" className={`pill ${profile.undertone === "Not sure" ? "is-selected" : ""}`}
                aria-pressed={profile.undertone === "Not sure"} onClick={() => onChange({ undertone: "Not sure" })}>I am still exploring</button>
              <button type="button" className={`pill ${profile.oliveCast ? "is-selected" : ""}`}
                aria-pressed={profile.oliveCast} onClick={() => onChange({ oliveCast: !profile.oliveCast })}>I notice an olive cast</button>
            </div>
            <p className="field-hint">Olive is a muted green-gold cast. It can overlap with warm, cool or neutral undertones.</p>
          </section>

          <section className="editor-section">
            <div className="section-title"><h2><span className="number">03</span>Skin type</h2><span>Choose what feels most useful</span></div>
            <div className="chip-row">
              {SKIN_TYPES.map((type) => <button key={type} type="button" className={`pill ${profile.skinType === type ? "is-selected" : ""}`}
                aria-pressed={profile.skinType === type} onClick={() => onChange({ skinType: type })}>{type}</button>)}
            </div>
          </section>

          <section className="editor-section">
            <div className="section-title"><h2><span className="number">04</span>Anything else?</h2><span>Optional, select all that apply</span></div>
            <div className="chip-row">
              {CONCERNS.map((concern) => {
                const selected = profile.concerns.includes(concern);
                return <button key={concern} type="button" className={`pill ${selected ? "is-selected" : ""}`}
                  aria-pressed={selected} onClick={() => onChange({ concerns: selected ? profile.concerns.filter((item) => item !== concern) : [...profile.concerns, concern] })}>
                  {selected && <Check size={13} />} {concern}
                </button>;
              })}
            </div>
          </section>

          <section className="editor-section">
            <label className="field-label" htmlFor="profile-name">Display name <span className="field-hint">Optional. This stays on this device and is not shared.</span>
              <input id="profile-name" value={profile.handle} maxLength={28} placeholder="Your name for your notes"
                onChange={(event) => onChange({ handle: event.target.value })} />
            </label>
          </section>

          <div className="form-foot">
            <p>{storageStatus === "saved" ? "Your profile saves only in this browser on this device." : storageStatus === "loading" ? "Checking local profile storage…" : "This browser could not save your profile. Your current choices remain until you leave."}</p>
            <Link className="primary" href="/discover">Explore the examples <span aria-hidden="true">→</span></Link>
          </div>
        </form>

        <aside className="side-note">
          <span className="eyebrow">A note on your data</span>
          <h2>Your profile stays on this device.</h2>
          <p>Neu stores these guest profile choices in this browser only. Nothing is sent to an account or shared with a community. Clearing this browser’s site data removes them.</p>
          <div className="save-status" role="status" aria-live="polite">
            <Info size={15} /> {storageStatus === "unavailable" ? "Local storage is unavailable right now." : "On-device guest profile only. No account is connected."}
          </div>
          <p>Depth and undertone can be hard to name. Visit the public guide to compare ideas, or leave a selection at “still exploring.”</p>
          <Link className="text-button" href="/learn">Read the Learn guide <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
    </main>
  );
}

