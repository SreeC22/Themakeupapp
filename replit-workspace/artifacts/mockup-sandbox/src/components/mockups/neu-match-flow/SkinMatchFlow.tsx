import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Droplets,
  Heart,
  Info,
  Layers3,
  Lightbulb,
  RotateCcw,
  Sparkles,
  SwatchBook,
} from "lucide-react";
import "./skinmatchflow.css";

type Undertone = "Warm" | "Cool" | "Neutral" | "Still exploring";
type Olive = "Yes" | "No" | "Not sure";
type ProductExperience = "None yet" | "A good match" | "A little too light" | "A little too deep" | "Too pink" | "Too yellow";

type MatchAnswers = {
  experience: ProductExperience | null;
  brand: string;
  product: string;
  shade: string;
  depth: number | "unsure" | null;
  undertone: Undertone | null;
  olive: Olive | null;
  skinType: string | null;
  finish: string | null;
  budget: string | null;
  categories: string[];
};

const DEPTHS = [
  { depth: 1, hex: "#f1ded0", label: "Very light" },
  { depth: 2, hex: "#ead2bb", label: "Light" },
  { depth: 3, hex: "#dfbe9f", label: "Light-medium" },
  { depth: 4, hex: "#d2aa86", label: "Medium-light" },
  { depth: 5, hex: "#bd916d", label: "Medium" },
  { depth: 6, hex: "#a57655", label: "Medium-deep" },
  { depth: 7, hex: "#855c44", label: "Deep" },
  { depth: 8, hex: "#684432", label: "Deep rich" },
  { depth: 9, hex: "#4d352d", label: "Very deep" },
  { depth: 10, hex: "#332722", label: "Deepest" },
];

const CATEGORY_GROUPS = [
  { title: "Complexion", options: ["Foundation", "Skin tint", "Concealer"] },
  { title: "Cheeks", options: ["Blush", "Bronzer", "Contour", "Highlighter"] },
  { title: "Lips", options: ["Lipstick", "Lip liner", "Lip gloss"] },
  { title: "Eyes", options: ["Eyeshadow", "Eyeliner", "Mascara"] },
  { title: "Prep & finish", options: ["Sunscreen", "Primer", "Powder"] },
];

const INITIAL_ANSWERS: MatchAnswers = {
  experience: null,
  brand: "",
  product: "",
  shade: "",
  depth: null,
  undertone: null,
  olive: null,
  skinType: null,
  finish: null,
  budget: null,
  categories: [],
};

const FLOW_STEPS = [
  { title: "A shade you know", label: "Your starting point" },
  { title: "Skin depth", label: "A visual guide" },
  { title: "Undertone", label: "What feels like you" },
  { title: "Your preferences", label: "The way you wear it" },
  { title: "What you love", label: "Pick your categories" },
];

function Choice({
  selected,
  onClick,
  title,
  detail,
  marker,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  detail?: string;
  marker?: ReactNode;
}) {
  return (
    <button
      className={`nmf-choice${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      {marker && <span className="nmf-choice-marker" aria-hidden="true">{marker}</span>}
      <span className="nmf-choice-copy">
        <strong>{title}</strong>
        {detail && <span>{detail}</span>}
      </span>
      <span className="nmf-check" aria-hidden="true">{selected && <Check size={15} />}</span>
    </button>
  );
}

export default function SkinMatchFlow() {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<MatchAnswers>(INITIAL_ANSWERS);
  const [error, setError] = useState("");
  const [showLearning, setShowLearning] = useState(false);

  const setAnswer = <K extends keyof MatchAnswers>(key: K, value: MatchAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const resetFlow = () => {
    setAnswers(INITIAL_ANSWERS);
    setScreen(0);
    setError("");
    setShowLearning(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previous = () => {
    setError("");
    setScreen((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const advance = () => {
    if (screen === 1 && answers.experience === null) {
      setError("Choose an answer to continue.");
      return;
    }
    if (screen === 2 && answers.depth === null) {
      setError("Choose a starting depth, or choose “I'm not sure.”");
      return;
    }
    if (screen === 3 && (!answers.undertone || !answers.olive)) {
      setError("Choose an undertone and an olive-cast response. “Not sure” is a valid answer.");
      return;
    }
    if (screen === 5 && answers.categories.length === 0) {
      setError("Choose at least one kind of makeup you'd like to explore.");
      return;
    }
    setError("");
    setScreen((current) => Math.min(7, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCategory = (category: string) => {
    setAnswers((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
    setError("");
  };

  const editSection = (nextScreen: number) => {
    setError("");
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedDepth = typeof answers.depth !== "number"
    ? "Still exploring"
    : `Depth ${answers.depth}, ${DEPTHS[answers.depth - 1]?.label.toLowerCase()}`;

  return (
    <div className="nmf">
      <header className="nmf-header">
        <a className="nmf-brand" href="#home" onClick={(event) => { event.preventDefault(); resetFlow(); }}>
          <span className="nmf-brand-mark">n</span><span>neu</span>
        </a>
        {screen === 0 || screen === 7 ? (
          <button className="nmf-text-action" type="button" onClick={resetFlow}>
            {screen === 7 ? "Start over" : "Guest preview"} <ArrowRight size={15} />
          </button>
        ) : (
          <button className="nmf-text-action" type="button" onClick={resetFlow}>
            <RotateCcw size={14} /> Start over
          </button>
        )}
      </header>

      {screen > 0 && screen < 7 && (
        <nav className="nmf-progress" aria-label="Profile questions">
          <div className="nmf-progress-track" aria-hidden="true">
            <span style={{ width: `${Math.min(100, ((screen - 1) / FLOW_STEPS.length) * 100)}%` }} />
          </div>
          <ol>
            {FLOW_STEPS.map((step, index) => {
              const currentScreen = index + 1;
              const complete = currentScreen < screen;
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => complete && editSection(currentScreen)}
                    aria-current={currentScreen === screen ? "step" : undefined}
                    aria-label={`${step.title}${complete ? ", edit" : ""}`}
                    className={`${currentScreen === screen ? "is-active" : ""}${complete ? " is-complete" : ""}`}
                  >
                    <span className="nmf-step-index">{complete ? <Check size={12} /> : `0${currentScreen}`}</span>
                    <span>{step.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <main className={`nmf-main${screen === 0 ? " nmf-main--welcome" : ""}${screen === 7 ? " nmf-main--result" : ""}`}>
        {screen === 0 && (
          <section className="nmf-welcome">
            <div className="nmf-welcome-copy">
              <span className="nmf-eyebrow"><Sparkles size={13} /> YOUR MAKEUP, YOUR STARTING POINT</span>
              <h1>Let’s find what <em>feels like you.</em></h1>
              <p className="nmf-lede">A few small clues about the products you love, your skin depth and what you want to wear. No perfect answers. No selfie needed.</p>
              <div className="nmf-welcome-actions">
                <button className="nmf-primary" type="button" onClick={advance}>Find my starting point <ArrowRight size={16} /></button>
                <span>Takes about 2 minutes. Explore as a guest.</span>
              </div>
              <div className="nmf-promise">
                <span><SwatchBook size={16} /></span>
                <p>Your skin is not a box. Your profile is yours to change or skip, any time.</p>
              </div>
            </div>
            <div className="nmf-welcome-art" aria-label="Warm skin-tone and makeup color swatches">
              <div className="nmf-art-caption"><span>NEU SHADE NOTES</span><span>01 / 05</span></div>
              <div className="nmf-art-swatches" aria-hidden="true">
                {["#f0d6c1", "#ddb696", "#c98e76", "#ad6d67", "#8e5555", "#643d43", "#412e34"].map((tone) => (
                  <i key={tone} style={{ backgroundColor: tone }} />
                ))}
              </div>
              <div className="nmf-color-strokes" aria-hidden="true"><i /><i /><i /></div>
              <div className="nmf-art-bottom"><span>DEPTH · UNDERTONE · PLAY</span><span>COLOR, FELT PERSONALLY</span></div>
            </div>
          </section>
        )}

        {screen === 1 && (
          <section className="nmf-question">
            <div className="nmf-question-heading">
              <span className="nmf-eyebrow"><Droplets size={13} /> 01 · A SHADE YOU KNOW</span>
              <h1>Is there a complexion product you already <em>know?</em></h1>
              <p>An everyday foundation, concealer or skin tint that feels close can give us a useful clue. If none comes to mind, that's completely fine.</p>
            </div>
            <div className="nmf-choice-list">
              {([
                ["A good match", "One I feel at home in"],
                ["Too light", "A little lighter than my skin"],
                ["Too deep", "A little deeper than my skin"],
                ["Too pink", "The undertone feels off"],
                ["Too yellow", "The undertone feels off"],
                ["None yet", "Not sure, or no product to add"],
              ] as [ProductExperience, string][]).map(([value, detail]) => (
                <Choice key={value} title={value} detail={detail} selected={answers.experience === value} onClick={() => setAnswer("experience", value)} />
              ))}
            </div>
            {answers.experience && answers.experience !== "None yet" && (
              <div className="nmf-existing-product">
                <div className="nmf-inline-note"><Info size={15} /><span>Share what you know. Neu will treat these details as your own notes, not as a verified brand match.</span></div>
                <div className="nmf-input-grid">
                  <label>Brand<input autoComplete="off" value={answers.brand} onChange={(event) => setAnswer("brand", event.target.value)} placeholder="e.g. Fenty Beauty" /></label>
                  <label>Product / formula<input autoComplete="off" value={answers.product} onChange={(event) => setAnswer("product", event.target.value)} placeholder="e.g. skin tint or foundation" /></label>
                  <label className="nmf-input-grid-wide">Shade name or number<input autoComplete="off" value={answers.shade} onChange={(event) => setAnswer("shade", event.target.value)} placeholder="Anything you remember" /></label>
                </div>
                {(!answers.brand.trim() || !answers.product.trim() || !answers.shade.trim()) && (
                  <p className="nmf-field-hint">Add the brand, product and shade to use this as a starting clue.</p>
                )}
              </div>
            )}
          </section>
        )}

        {screen === 2 && (
          <section className="nmf-question">
            <div className="nmf-question-heading">
              <span className="nmf-eyebrow"><SwatchBook size={13} /> 02 · A VISUAL GUIDE</span>
              <h1>Where does your skin <em>feel like it sits?</em></h1>
              <p>Skin depth describes how light or deep your complexion is. Choose a nearby starting point, not a label for who you are.</p>
            </div>
            <div className="nmf-depth-grid" role="group" aria-label="Choose a skin depth">
              {DEPTHS.map((item) => (
                <button
                  type="button"
                  key={item.depth}
                  className={`nmf-depth-choice${answers.depth === item.depth ? " is-selected" : ""}`}
                  aria-pressed={answers.depth === item.depth}
                  onClick={() => setAnswer("depth", item.depth)}
                >
                  <span className="nmf-depth-swatch" style={{ backgroundColor: item.hex }} aria-hidden="true">
                    {answers.depth === item.depth && <Check size={16} />}
                  </span>
                  <strong>{item.label}</strong><small>{String(item.depth).padStart(2, "0")}</small>
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`nmf-uncertain-choice${answers.depth === "unsure" ? " is-selected" : ""}`}
              aria-pressed={answers.depth === "unsure"}
              onClick={() => setAnswer("depth", "unsure")}
            >
              <CircleHelp size={16} /> I'm not sure yet
            </button>
            <div className="nmf-note"><Info size={15} /><p>Screen color, daylight and personal perception all vary. You can adjust your profile later.</p></div>
          </section>
        )}

        {screen === 3 && (
          <section className="nmf-question">
            <div className="nmf-question-heading">
              <span className="nmf-eyebrow"><Layers3 size={13} /> 03 · WHAT FEELS LIKE YOU</span>
              <h1>What undertone <em>feels closest?</em></h1>
              <p>Undertone is a subtle quality in how your complexion reads. It isn't a test you have to pass.</p>
            </div>
            <div className="nmf-undertone-grid" role="group" aria-label="Choose an undertone">
              {([
                ["Warm", "Golden, peach or yellow"],
                ["Cool", "Rosy, pink or bluish"],
                ["Neutral", "A mix of warm and cool"],
                ["Still exploring", "I don't need to know yet"],
              ] as [Undertone, string][]).map(([value, detail]) => (
                <Choice
                  key={value}
                  title={value}
                  detail={detail}
                  selected={answers.undertone === value}
                  onClick={() => setAnswer("undertone", value)}
                  marker={<span className={`nmf-undertone-mark nmf-undertone-mark--${value.toLowerCase().replace(" ", "-")}`} />}
                />
              ))}
            </div>
            <div className="nmf-olive-card">
              <div><strong>Do you notice an olive cast?</strong><span>It can appear alongside warm, cool or neutral undertones.</span></div>
              <div className="nmf-segmented" role="group" aria-label="Olive cast">
                {(["Yes", "No", "Not sure"] as Olive[]).map((value) => (
                  <button type="button" key={value} className={answers.olive === value ? "is-selected" : ""} aria-pressed={answers.olive === value} onClick={() => setAnswer("olive", value)}>{value}</button>
                ))}
              </div>
            </div>
            <div className="nmf-note"><Lightbulb size={15} /><p>Veins, jewelry and sun response are weak clues, not reliable diagnoses. “Still exploring” is a full, useful answer.</p></div>
          </section>
        )}

        {screen === 4 && (
          <section className="nmf-question">
            <div className="nmf-question-heading">
              <span className="nmf-eyebrow"><Sparkles size={13} /> 04 · THE WAY YOU WEAR IT</span>
              <h1>What makes a formula <em>feel right?</em></h1>
              <p>Optional little preferences for products you might enjoy. Change or skip anything.</p>
            </div>
            <div className="nmf-preference-group">
              <h2>Your skin type <span>Optional</span></h2>
              <div className="nmf-chip-row" role="group" aria-label="Skin type">
                {["Dry", "Oily", "Combination", "Normal", "Sensitive", "Not sure"].map((value) => <button key={value} type="button" className={answers.skinType === value ? "is-selected" : ""} aria-pressed={answers.skinType === value} onClick={() => setAnswer("skinType", value)}>{value}</button>)}
              </div>
            </div>
            <div className="nmf-preference-group">
              <h2>Finish <span>Optional</span></h2>
              <div className="nmf-chip-row" role="group" aria-label="Preferred finish">
                {["Natural", "Soft matte", "Dewy", "No preference"].map((value) => <button key={value} type="button" className={answers.finish === value ? "is-selected" : ""} aria-pressed={answers.finish === value} onClick={() => setAnswer("finish", value)}>{value}</button>)}
              </div>
            </div>
            <div className="nmf-preference-group">
              <h2>Price range <span>Optional</span></h2>
              <div className="nmf-chip-row" role="group" aria-label="Preferred price range">
                {["Drugstore", "Mid-range", "Prestige", "Any price"].map((value) => <button key={value} type="button" className={answers.budget === value ? "is-selected" : ""} aria-pressed={answers.budget === value} onClick={() => setAnswer("budget", value)}>{value}</button>)}
              </div>
            </div>
            <p className="nmf-gentle-note">These preferences help shape a discovery starting point, never a skin-care or medical recommendation.</p>
          </section>
        )}

        {screen === 5 && (
          <section className="nmf-question">
            <div className="nmf-question-heading">
              <span className="nmf-eyebrow"><Heart size={13} /> 05 · MAKEUP YOU LOVE</span>
              <h1>What would you love to <em>find?</em></h1>
              <p>Choose a few favorites to make your first discovery feel more like you. You can change these any time.</p>
            </div>
            <div className="nmf-category-groups">
              {CATEGORY_GROUPS.map((group) => (
                <fieldset className="nmf-category-group" key={group.title}>
                  <legend>{group.title}</legend>
                  {group.options.map((category) => (
                    <button
                      type="button"
                      className={`nmf-category-chip${answers.categories.includes(category) ? " is-selected" : ""}`}
                      aria-pressed={answers.categories.includes(category)}
                      onClick={() => toggleCategory(category)}
                      key={category}
                    >
                      {category}{answers.categories.includes(category) && <Check size={13} />}
                    </button>
                  ))}
                </fieldset>
              ))}
            </div>
            {error && <p className="nmf-error" role="alert">{error}</p>}
          </section>
        )}

        {screen === 6 && (
          <section className="nmf-question">
            <div className="nmf-question-heading">
              <span className="nmf-eyebrow"><Check size={13} /> A PROFILE YOU CAN CHANGE</span>
              <h1>Your starting point, <em>your call.</em></h1>
              <p>Look it over, make changes, or carry on with what you have. Nobody has to fit neatly into a box.</p>
            </div>
            <div className="nmf-review-list">
              <ReviewRow index="01" title="A shade I know" detail={answers.experience === "None yet" ? "No current match, and that's okay" : answers.experience ? [answers.brand, answers.product, answers.shade].filter(Boolean).join(" · ") || answers.experience : "Not set yet"} onEdit={() => editSection(1)} />
              <ReviewRow index="02" title="Skin depth" detail={selectedDepth} onEdit={() => editSection(2)} swatch={typeof answers.depth === "number" ? DEPTHS[answers.depth - 1]?.hex : undefined} />
              <ReviewRow index="03" title="Undertone" detail={`${answers.undertone || "Not set yet"}${answers.olive === "Yes" ? " · olive cast" : answers.olive === "No" ? " · no olive cast" : answers.olive ? " · exploring olive cast" : ""}`} onEdit={() => editSection(3)} />
              <ReviewRow index="04" title="Formula preferences" detail={[answers.skinType, answers.finish, answers.budget].filter(Boolean).join(" · ") || "Still open"} onEdit={() => editSection(4)} />
              <ReviewRow index="05" title="Your categories" detail={answers.categories.join(", ") || "Not chosen yet"} onEdit={() => editSection(5)} />
            </div>
            <div className="nmf-privacy-note"><Info size={15} /><p>This preview keeps your choices only on this screen. No account, profile, or community post is created.</p></div>
          </section>
        )}

        {screen === 7 && (
          <section className="nmf-results">
            <span className="nmf-eyebrow"><Sparkles size={13} /> A FIRST STEP, NOT A FINAL ANSWER</span>
            <h1>Your shade story <em>starts here.</em></h1>
            <p className="nmf-results-lede">A few clues make it easier to explore. Your shade is never a score, diagnosis or guarantee of a product match.</p>
            <div className="nmf-results-profile">
              <div className="nmf-results-depth">
                <span className="nmf-results-color" style={{ backgroundColor: typeof answers.depth === "number" ? DEPTHS[answers.depth - 1]?.hex : "#d8c1ae" }} />
                <span><small>SKIN DEPTH</small><strong>{selectedDepth}</strong></span>
              </div>
              <div><small>UNDERTONE</small><strong>{answers.undertone || "Still exploring"}{answers.olive === "Yes" ? " · olive cast" : ""}</strong></div>
              <div><small>YOUR INTERESTS</small><strong>{answers.categories.slice(0, 3).join(", ") || "Explore at your pace"}</strong></div>
            </div>
            <div className="nmf-catalog-status"><Layers3 size={19} /><div><strong>Your personal starting point is ready.</strong><p>A verified product catalog and member recommendations aren't connected in this preview, so Neu won't invent a match. Your answers are ready to guide future discovery.</p></div></div>
            {showLearning && (
              <div className="nmf-learning-card">
                <h2>A little color theory, your way.</h2>
                <p>Undertone and depth describe different things. Depth is how light or deep a complexion appears. Undertone is the subtle warm, cool or balanced quality you may notice across it. Neither defines what makeup you can wear.</p>
                <p>Olive can overlap warm, cool or neutral undertones. Color choices are an invitation to experiment, not a rulebook.</p>
              </div>
            )}
            <div className="nmf-results-actions">
              <button className="nmf-primary" type="button" onClick={resetFlow}>Start another match <RotateCcw size={15} /></button>
              <button className="nmf-secondary" type="button" onClick={() => setShowLearning((current) => !current)}><Lightbulb size={15} />{showLearning ? "Close color notes" : "Learn a little about undertones"}</button>
              <button className="nmf-text-action" type="button" onClick={() => editSection(6)}>Review my answers <ArrowRight size={14} /></button>
            </div>
          </section>
        )}

        {error && screen !== 5 && <p className="nmf-error" role="alert">{error}</p>}

        {screen > 0 && screen < 7 && (
          <div className="nmf-form-footer">
            <button className="nmf-back" type="button" onClick={previous}><ArrowLeft size={16} /> Back</button>
            {screen === 4 && <button className="nmf-skip" type="button" onClick={advance}>Skip preferences</button>}
            <button
              className="nmf-primary"
              type="button"
              onClick={() => {
                if (screen === 1 && answers.experience && answers.experience !== "None yet" &&
                  (!answers.brand.trim() || !answers.product.trim() || !answers.shade.trim())) {
                  setError("Add the brand, product and shade name. Or pick “None yet” to explore without them.");
                  return;
                }
                if (screen === 6) {
                  if (!answers.categories.length) {
                    setError("Head back and choose at least one makeup category.");
                    return;
                  }
                }
                advance();
              }}
            >
              {screen === 6 ? "See my starting point" : "Continue"} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </main>
      <footer className="nmf-footer">
        <span>neu</span>
        <p>Makeup as personal as you are. Nothing to prove, nothing to get exactly right.</p>
      </footer>
    </div>
  );
}

function ReviewRow({
  index,
  title,
  detail,
  onEdit,
  swatch,
}: {
  index: string;
  title: string;
  detail: string;
  onEdit: () => void;
  swatch?: string;
}) {
  return (
    <div className="nmf-review-row">
      <span className="nmf-review-index">{index}</span>
      <div className="nmf-review-title">{swatch && <i style={{ backgroundColor: swatch }} aria-hidden="true" />}{title}</div>
      <p>{detail}</p>
      <button type="button" onClick={onEdit}>Edit</button>
    </div>
  );
}
