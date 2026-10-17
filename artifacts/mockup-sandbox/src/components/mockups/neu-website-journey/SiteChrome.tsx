import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Dices,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import type { NeuPage } from "./data";

export function PreviewNotice() {
  return (
    <div className="wj-notice" role="note">
      <span className="wj-notice-dot" />
      <strong>Design preview</strong>
      <span className="wj-notice-separator" aria-hidden="true">/</span>
      <span>Sample content only. No live accounts, email, saving or publishing.</span>
    </div>
  );
}

export function SiteHeader({
  page,
  previewMember,
  onNavigate,
}: {
  page: NeuPage;
  previewMember: boolean;
  onNavigate: (page: NeuPage) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (destination: NeuPage) => {
    onNavigate(destination);
    setMenuOpen(false);
  };
  const primary: { id: NeuPage; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "discover", label: "Discover" },
    { id: "learn", label: "Learn" },
  ];

  return (
    <header className="wj-header-wrap">
      <div className="wj-header">
        <button type="button" className="wj-brand" onClick={() => go("home")} aria-label="Neu home">
          <span className="wj-brand-mark">n</span><span>neu</span>
        </button>
        <nav className="wj-primary-nav" aria-label="Main navigation">
          {primary.map((item) => (
            <button key={item.id} type="button" className={page === item.id ? "is-active" : ""} aria-current={page === item.id ? "page" : undefined} onClick={() => go(item.id)}>{item.label}</button>
          ))}
        </nav>
        <div className="wj-header-actions">
          <button className="wj-profile-link" type="button" onClick={() => go("profile")}><UserRound size={15} /> Profile</button>
          <button className="wj-header-share" type="button" onClick={() => go("share")}>Share a find</button>
          <button className="wj-header-cta" type="button" onClick={() => go("quiz")}>Find a match <ArrowRight size={13} /></button>
          <button className="wj-signin-link" type="button" onClick={() => go(previewMember ? "settings" : "account")}>
            {previewMember ? "Preview session" : "Sign in"}
            <ArrowRight size={14} />
          </button>
          <button className="wj-mobile-menu-button" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setMenuOpen((current) => !current)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <div className="wj-mobile-nav">
        {primary.map((item) => (
          <button type="button" key={item.id} className={page === item.id ? "is-active" : ""} aria-current={page === item.id ? "page" : undefined} onClick={() => go(item.id)}>
            {item.id === "discover" ? <Search size={14} /> : item.id === "learn" ? <BookOpen size={14} /> : <Sparkles size={14} />}{item.label}
          </button>
        ))}
        <button type="button" className={page === "quiz" ? "is-active" : ""} onClick={() => go("quiz")}><Compass size={14} />Find your match</button>
        <button type="button" onClick={() => go("share")}><ArrowRight size={14} />Share a find</button>
      </div>
      {menuOpen && (
        <nav className="wj-drawer" aria-label="More Neu pages">
          <p>EXPLORE NEU</p>
          <button type="button" onClick={() => go("quiz")}>Find your skin match <ArrowRight size={15} /></button>
          <button type="button" onClick={() => go("saved")}>Saved finds <ArrowRight size={15} /></button>
          <button type="button" onClick={() => go("share")}>Share a product <ArrowRight size={15} /></button>
          <button type="button" onClick={() => go("profile")}>Skin profile <ArrowRight size={15} /></button>
          <button type="button" onClick={() => go("guidelines")}>Community guidelines <ArrowRight size={15} /></button>
        </nav>
      )}
    </header>
  );
}

const FOOTER_LINKS: { id: NeuPage; label: string }[] = [
  { id: "discover", label: "Browse examples" },
  { id: "quiz", label: "Find your match" },
  { id: "saved", label: "Saved" },
  { id: "share", label: "Share a find" },
];
const POLICY_LINKS: { id: NeuPage; label: string }[] = [
  { id: "guidelines", label: "Guidelines" },
  { id: "privacy", label: "Privacy" },
  { id: "terms", label: "Terms" },
  { id: "accessibility", label: "Accessibility" },
  { id: "copyright", label: "Rights" },
];

export function SiteFooter({ onNavigate }: { onNavigate: (page: NeuPage) => void }) {
  return (
    <footer className="wj-footer">
      <div className="wj-footer-main">
        <button className="wj-brand" type="button" onClick={() => onNavigate("home")} aria-label="Neu home"><span className="wj-brand-mark">n</span><span>neu</span></button>
        <p>Beauty belongs to the person wearing it.</p>
        <nav className="wj-footer-links" aria-label="Explore">
          {FOOTER_LINKS.map((item) => <button type="button" key={item.id} onClick={() => onNavigate(item.id)}>{item.label}</button>)}
        </nav>
      </div>
      <div className="wj-footer-meta">
        <span>Sample designs, not live community recommendations.</span>
        <nav aria-label="Policies">{POLICY_LINKS.map((item) => <button type="button" key={item.id} onClick={() => onNavigate(item.id)}>{item.label}</button>)}</nav>
        <button type="button" onClick={() => onNavigate("offline")}><ShieldCheck size={13} />Preview an offline state</button>
        <button type="button" onClick={() => onNavigate("not-found")}><Dices size={13} />Preview a not-found page</button>
      </div>
    </footer>
  );
}
