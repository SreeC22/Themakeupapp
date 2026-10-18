import { Check } from "lucide-react";
import "../neu.css";
export function Choice({ title, detail, selected, onClick, className = "" }: {
  title: string; detail?: string; selected: boolean; onClick: () => void; className?: string;
}) {
  return <button type="button" className={`wj-selectable${selected ? " is-selected" : ""} ${className}`} aria-pressed={selected} onClick={onClick}>
    <span><strong>{title}</strong>{detail && <small>{detail}</small>}</span><i aria-hidden="true">{selected && <Check size={14} />}</i>
  </button>;
}
