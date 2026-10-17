import type { ReactNode } from "react";
import { ArrowRight, Bookmark, Check, Info } from "lucide-react";
import type { NeuPage, ProductExample } from "./data";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="wj-eyebrow"><span aria-hidden="true" />{children}</span>;
}

export function PageIntro({ eyebrow, title, accent, children }: {
  eyebrow: string;
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return <header className="wj-page-intro"><Eyebrow>{eyebrow}</Eyebrow><h1>{title} <em>{accent}</em></h1><p>{children}</p></header>;
}

export function ExampleNotice({ children = "Illustrative design example, not a live member recommendation or verified shade match." }: { children?: ReactNode }) {
  return <div className="wj-example-notice"><Info size={15} /><span>{children}</span></div>;
}

export function ProductCard({
  product,
  onOpen,
  isSaved,
  onSave,
}: {
  product: ProductExample;
  onOpen: () => void;
  isSaved: boolean;
  onSave: () => void;
}) {
  const texture = ({
    Foundation: "base",
    "Skin tint": "base",
    Concealer: "concealer",
    Blush: "blush",
    Bronzer: "bronzer",
    Lipstick: "lip",
    "Lip gloss": "lip",
    Eyeshadow: "eye",
    Mascara: "eye",
    Sunscreen: "prep",
    Primer: "prep",
    Powder: "powder",
  } as Record<string, string>)[product.category] || "blush";

  return (
    <article className="wj-product-card">
      <div className={`wj-product-art wj-product-art--${texture}`} aria-hidden="true">
        <span>EXAMPLE</span><i /><i /><i />
      </div>
      <div className="wj-product-card-info">
        <div className="wj-card-meta"><span>{product.category}</span><span>{product.price}</span></div>
        <p className="wj-brand-name">{product.brand}</p>
        <h3><button type="button" onClick={onOpen}>{product.name}</button></h3>
        <p className="wj-shade-line">{product.shade}</p>
        <p className="wj-card-copy">{product.notes}</p>
        <div className="wj-card-actions">
          <button type="button" className="wj-card-open" onClick={onOpen}>See product note <ArrowRight size={14} /></button>
          <button type="button" className={`wj-save-icon${isSaved ? " is-saved" : ""}`} onClick={onSave} aria-label={isSaved ? "Remove saved example" : "Save this example"} aria-pressed={isSaved}>
            {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>
    </article>
  );
}

export function RouteAction({ page, onNavigate, children, className = "wj-primary" }: {
  page: NeuPage;
  onNavigate: (page: NeuPage) => void;
  children: ReactNode;
  className?: string;
}) {
  return <button type="button" className={className} onClick={() => onNavigate(page)}>{children}</button>;
}
