import { useId, useMemo, useState } from "react";
import "../neu.css";
export function Typeahead({ label, value, placeholder, suggestions, onChange, suggestionTag = "Suggestion" }: {
  label: string; value: string; placeholder: string; suggestions: string[]; onChange: (value: string) => void; suggestionTag?: string;
}) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const inputId = `${uid}-input`;
  const listboxId = `${uid}-listbox`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const matching = useMemo(() => {
    const query = value.trim().toLowerCase();
    return query ? suggestions.filter((item) => item.toLowerCase().includes(query) && item.toLowerCase() !== query).slice(0, 6) : [];
  }, [suggestions, value]);
  const choose = (option: string) => { onChange(option); setOpen(false); setActive(-1); };
  const activeId = open && active >= 0 && matching[active] ? `${uid}-option-${active}` : undefined;
  return <div className="wj-quiz-field">
    <label id={labelId} htmlFor={inputId}>{label}</label>
    <div className="wj-typeahead">
      <input
        id={inputId}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && matching.length > 0}
        aria-autocomplete="list"
        aria-labelledby={labelId}
        aria-controls={open && matching.length > 0 ? listboxId : undefined}
        aria-activedescendant={activeId}
        onFocus={() => setOpen(true)}
        onBlur={() => { setOpen(false); setActive(-1); }}
        onChange={(event) => { onChange(event.target.value); setOpen(true); setActive(-1); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && matching.length) { event.preventDefault(); setOpen(true); setActive((current) => current < 0 ? 0 : (current + 1) % matching.length); }
          if (event.key === "ArrowUp" && matching.length) { event.preventDefault(); setOpen(true); setActive((current) => current < 0 ? matching.length - 1 : (current - 1 + matching.length) % matching.length); }
          if (event.key === "Enter" && open && active >= 0 && matching[active]) { event.preventDefault(); choose(matching[active]); }
          if (event.key === "Escape") { setOpen(false); setActive(-1); }
        }}
      />
      {open && matching.length > 0 && <div id={listboxId} className="wj-typeahead-options" role="listbox" aria-labelledby={labelId}>{matching.map((option, index) =>
        <button id={`${uid}-option-${index}`} type="button" role="option" tabIndex={-1} aria-selected={index === active} key={option} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(option)}>{option}<span>{suggestionTag}</span></button>
      )}</div>}
    </div>
  </div>;
}
