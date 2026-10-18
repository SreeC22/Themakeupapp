import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import "../neu.css";

export function ToneSwatch({ label, color, selected, onClick }: {
  label: string; color: string; selected: boolean; onClick: () => void;
}) {
  return <button type="button" className={`neu-tone-swatch${selected ? " is-selected" : ""}`}
    aria-label={label} aria-pressed={selected} title={label} onClick={onClick}
    style={{ "--swatch": color } as CSSProperties}>
    <i />{selected && <Check size={14} aria-hidden="true" />}
  </button>;
}
