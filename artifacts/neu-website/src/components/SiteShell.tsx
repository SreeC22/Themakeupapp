import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";

const primaryLinks = [
  { href: "/edit", label: "Your Neu Edit" },
  { href: "/routines", label: "Explore looks" },
  { href: "/research", label: "Research" },
  { href: "/learn", label: "Learn" },
];

export function SiteHeader() {
  const [location] = useLocation();
  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Neu home">
          <span className="brand-mark">n</span><span className="brand-word">neu</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {primaryLinks.map((item) => (
            <Link key={item.href} className={`nav-link ${location === item.href ? "is-active" : ""}`} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <Link className="header-profile" href="/profile">Your profile <ArrowRight size={14} /></Link>
      </header>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {primaryLinks.map((item) => (
          <Link key={item.href} className={location === item.href ? "is-active" : ""} href={item.href}>{item.label}</Link>
        ))}
        <Link className={location === "/profile" ? "is-active" : ""} href="/profile">Profile</Link>
      </nav>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="brand" href="/" aria-label="Neu home">
        <span className="brand-mark">n</span><span className="brand-word">neu</span>
      </Link>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link className="footer-link" href="/edit">Your Neu Edit</Link>
        <Link className="footer-link" href="/routines">Looks & saved routines</Link>
        <Link className="footer-link" href="/looks">Earlier four-slot builder</Link>
        <Link className="footer-link" href="/looks/saved">Earlier looks & makeup bag</Link>
        <Link className="footer-link" href="/learn">Learn about color</Link>
        <Link className="footer-link" href="/research">Curated research</Link>
        <Link className="footer-link" href="/results">Catalog discovery</Link>
        <Link className="footer-link" href="/profile">Beauty profile</Link>
        <Link className="footer-link" href="/saved">Saved products</Link>
        <Link className="footer-link" href="/review/new">Local review draft</Link>
        <Link className="footer-link" href="/design-guide">Design guide</Link>
      </nav>
    </footer>
  );
}

export function PageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | Neu`;
    const descriptionNode = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (descriptionNode) descriptionNode.content = description;
    if (ogTitle) ogTitle.content = `${title} | Neu`;
    if (ogDescription) ogDescription.content = description;
  }, [description, title]);
  return null;
}
