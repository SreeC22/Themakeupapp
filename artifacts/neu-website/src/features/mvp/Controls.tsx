import { useId, useState, type ReactNode } from "react";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Choice } from "@workspace/neu-design-system/components/neu/choice";

/** Domain compositions of the five shared Neu control families. */
export function Options({ label, options, value, onChange, multiple = false, hint }: {
  label: string; options: readonly string[]; value: string | string[];
  onChange: (value: string) => void; multiple?: boolean; hint?: string;
}) {
  const id = useId();
  return <fieldset className="mvp-fieldset" aria-describedby={hint ? id : undefined}>
    <legend>{label}{multiple ? " · choose any" : ""}</legend>
    {hint && <p id={id} className="mvp-muted">{hint}</p>}
    <div className="mvp-options">{options.map((option) => <Choice key={option} title={option}
      selected={Array.isArray(value) ? value.includes(option) : value === option} onClick={() => onChange(option)} />)}</div>
  </fieldset>;
}
export function Disclosure({ title, children, initialOpen = false }: { title: string; children: ReactNode; initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const id = useId();
  return <div className="mvp-disclosure">
    <Button variant="text" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? "Close" : "Open"}: {title}</Button>
    {open && <div id={id} className="mvp-stack">{children}</div>}
  </div>;
}
export function EmptyState({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="mvp-empty"><h2>{title}</h2><div className="mvp-muted">{children}</div>{action && <div className="mvp-actions">{action}</div>}</section>;
}
export function Heading({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <header className="mvp-heading"><span className="eyebrow">{eyebrow}</span><h1 tabIndex={-1}>{title}</h1><p>{children}</p></header>;
}
export function toggleItem(current: string[], value: string): string[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}
