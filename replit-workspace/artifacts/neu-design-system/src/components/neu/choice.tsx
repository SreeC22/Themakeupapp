import { Check } from "lucide-react";
import "../neu.css";
export function Choice({ title, selected, onClick }: { title: string; selected: boolean; onClick: () => void }) {
  return <button type="button" className={`wj-selectable${selected ? " is-selected" : ""}`} aria-pressed={selected} onClick={onClick}>
    <span><strong>{title}</strong></span><i aria-hidden="true">{selected && <Check size={14} />}</i>
  </button>;
}
