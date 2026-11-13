import tokens from "../../tokens.json";
import { useState } from "react";
import { Button } from "../components/neu/button";
import { ButtonStory, TypeaheadStory, ChoiceStory, SwatchStory, NavigationStory } from "./demos/neu";

function orderedColors(mode: "light" | "dark") {
  const ranks: Record<string, number> = { primary: 0, secondary: 1, accent: 2 };
  const rank = (role: string) => ranks[role] ?? 3;
  return Object.entries(tokens.color[mode]).sort(([a], [b]) => rank(a) - rank(b));
}
export function OverviewPage({ allowThemeSwitch = true }: { allowThemeSwitch?: boolean } = {}) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  return <div className="neu-guide"><h1>Neu, consistently.</h1>
    <p>A cream, mauve and plum system for expressive makeup discovery. This is the first five-family component pilot, built from the approved website and compact quiz reference.</p>
    {allowThemeSwitch && <Button variant="secondary" aria-pressed={dark} onClick={() => {
      document.documentElement.classList.toggle("dark", !dark);
      setDark(!dark);
    }}>{dark ? "Preview approved light palette" : "Preview derived dark palette"}</Button>}
    <section><h2>Design rules</h2><ul><li>Four short questions and one useful starting point.</li><li>One primary action, concise help and no repeated results.</li><li>Uncertainty is welcome. It must not create extra mandatory work.</li><li>Keep text readable and every interactive target at least 44px.</li><li>Use examples honestly. Never imply a verified shade match.</li></ul></section>
    <ButtonStory /><TypeaheadStory /><ChoiceStory /><SwatchStory /><NavigationStory />
  </div>;
}
export function ColorsPage() {
  return <div className="neu-guide"><h1>Colors</h1><p>Deep plum for primary actions, soft cream for the page and mauve for emphasis. Dark mode is a derived reference, not a released website theme.</p>
    {(["light", "dark"] as const).map((mode) => <section key={mode}><h2>{mode === "light" ? "Approved light palette" : "Derived dark palette"}</h2>
      <div className="neu-color-list">{orderedColors(mode).map(([name, token]) => <div key={name}>
        <i style={{ background: token.$value }} /><strong>{name}</strong><code>{token.$value}</code>
      </div>)}</div></section>)}
  </div>;
}
export function FontsPage() {
  return <div className="neu-guide"><h1>Typography</h1>
    <section><h2>Headlines: Cormorant Garamond</h2><p style={{ fontFamily: "var(--app-font-serif)", fontSize: 40 }}>Makeup is a way to be more you.</p></section>
    <section><h2>Reading and controls: DM Sans</h2><p>Use short, direct sentences. Explain the next action without assuming makeup expertise. Reading text should not be tiny or faded.</p></section>
    <section><h2>Utility: Space Mono</h2><p style={{ fontFamily: "var(--app-font-mono)" }}>STEP 2 OF 4</p><p>Reserve this for brief labels, not paragraphs.</p></section>
  </div>;
}
export function LayoutPage() {
  return <div className="neu-guide"><h1>Spacing and accessibility</h1>
    <p>Use a 4px spacing rhythm and restrained 8px corners for quiz controls. Compact does not mean cramped.</p>
    <ul><li>One question per screen; optional detail expands when needed.</li><li>Minimum 44px hit areas, including small-looking swatches.</li><li>Use text and check marks alongside color.</li><li>Visible keyboard focus on controls, not decorative heading outlines.</li><li>Back, help and closing the quiz retain the draft for the current page session.</li><li>Do not imply that screen colors, veins or a questionnaire diagnose a complexion.</li><li>Honor reduced-motion preferences.</li></ul>
  </div>;
}
