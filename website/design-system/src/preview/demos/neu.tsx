import { useState } from "react";
import { Button } from "../../components/neu/button";
import { Typeahead } from "../../components/neu/typeahead";
import { Choice } from "../../components/neu/choice";
import { ToneSwatch } from "../../components/neu/tone-swatch";
import { Navigation } from "../../components/neu/navigation";

function Sample({ children }: { children: React.ReactNode }) {
  return <div className="wj-app neu-ds-sample">{children}</div>;
}
export function ButtonStory() {
  return <Sample><h2>Buttons</h2><p>One primary action per decision. Use text actions for lower-priority navigation.</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
      <Button>Continue</Button><Button variant="secondary">Compare shades</Button>
      <Button variant="text">Skip for now</Button><Button disabled>Unavailable</Button>
    </div></Sample>;
}
export function TypeaheadStory() {
  const [value, setValue] = useState("");
  return <Sample><h2>Typed autocomplete</h2><p>Type “fen” or enter a brand that is not listed. Arrow keys and Enter select suggestions; Escape closes them.</p>
    <Typeahead label="Brand" value={value} onChange={setValue} placeholder="Type a brand"
      suggestions={["Fenty Beauty", "Maybelline", "NARS", "Clinique"]} />
    <p role="status">Current entry: {value || "None"}</p></Sample>;
}
export function ChoiceStory() {
  const [selected, setSelected] = useState<string[]>([]);
  return <Sample><h2>Choices</h2><p>These examples allow multiple interests. The selected state uses a check mark as well as color.</p>
    {["Foundation", "Blush", "Lipstick"].map((title) => <Choice key={title} title={title}
      selected={selected.includes(title)} onClick={() => setSelected((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title])} />)}
  </Sample>;
}
export function SwatchStory() {
  const [selected, setSelected] = useState<number | null>(null);
  return <Sample><h2>Tone swatches</h2><p>Illustrative screen colors, not complexion measurements. Every swatch has a text label and a 44px target.</p>
    <div style={{ display: "flex", gap: 4 }}>{["#F7E6D8", "#C08B68", "#412A23"].map((color, index) =>
      <ToneSwatch key={color} color={color} label={["Light example", "Medium example", "Deep example"][index]}
        selected={selected === index} onClick={() => setSelected(selected === index ? null : index)} />)}</div>
    <p role="status">{selected === null ? "No example selected" : ["Light example", "Medium example", "Deep example"][selected]}</p>
  </Sample>;
}
export function NavigationStory() {
  const [step, setStep] = useState(1);
  return <Sample><h2>Step navigation</h2><p role="status">Example step {step} of 4</p>
    <Navigation onBack={() => setStep((current) => Math.max(1, current - 1))}
      onContinue={() => setStep((current) => Math.min(4, current + 1))}
      continueLabel="Continue" secondary={<Button variant="text" onClick={() => setStep(4)}>Skip</Button>} />
  </Sample>;
}
