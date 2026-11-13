import { ArrowRight, Palette } from "lucide-react";
import { Link } from "wouter";
import { LAUNCH_CATEGORIES } from "@/features/mvp/catalog";

const pigmentArt = `${import.meta.env.BASE_URL}images/neu-pigment-study.jpg`;

export default function HomePage() {
  return (
    <main className="content">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Room for every shade story</span>
          <h1>Makeup is a way<br />to <em>be more you.</em></h1>
          <p className="hero-lede">Makeup self-expression across complexion depths, with room for olive, muted and deep skin, and pigmented or two-toned lips. Build a starting point, or explore your own way.</p>
          <div className="hero-actions">
            <Link className="primary" href="/quiz">Build a starting point <ArrowRight size={17} /></Link>
            <Link className="text-button" href="/results">Explore product research <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-note"><i />Explore first. No account needed.</div>
        </div>
        <figure className="hero-art">
          <img src={pigmentArt} width={1024} height={1024} fetchPriority="high" decoding="async" alt="Dusty rose, muted mauve and warm beige makeup textures on a soft ivory surface." />
        </figure>
      </section>

      <section aria-labelledby="how-title">
        <h2 id="how-title" className="section-kicker">Find your next favourite, your way</h2>
        <div className="how-grid">
          <article className="how-step"><span className="step-num">01</span><div><h2>Start your way.</h2><p>Use a foundation or concealer shade you know, or explore the manual palette. Unsure is always welcome.</p></div></article>
          <article className="how-step"><span className="step-num">02</span><div><h2>Read the evidence.</h2><p>Explore source-backed descriptors with dates and honest limits. No invented shade equivalents or match scores.</p></div></article>
          <article className="how-step"><span className="step-num">03</span><div><h2>Make it your own.</h2><p>Save category preferences, edit your references and keep what feels like you. No account gate.</p></div></article>
        </div>
      </section>

      <section className="mvp-home-categories" aria-labelledby="launch-categories-heading">
        <span className="mono">FOUR PLACES TO BEGIN</span><h2 id="launch-categories-heading">Explore what interests you.</h2>
        <nav aria-label="Launch makeup categories">{LAUNCH_CATEGORIES.map((category) => <Link key={category} className="mvp-link" href={`/results?category=${encodeURIComponent(category)}`}>{category} <ArrowRight size={14} /></Link>)}</nav>
        <p>Explore a growing reviewed catalog alongside clearly separate historical research. Manufacturer descriptors are not laboratory validation, exact cross-brand matches or a current stock check.</p>
        <p>Public community is outside the MVP. Your personal notes and profile stay private in this browser.</p>
        <Link href="/profile" className="mvp-link">Your profile & private drafts <ArrowRight size={14} /></Link>
      </section>

      <section className="home-bottom">
        <div><span className="mono">A LITTLE REMINDER</span><h2>There is not one right way to wear it.</h2></div>
        <p>Bare skin, sharp liner, a favorite shade. Start wherever you are, and keep what feels like you.</p>
        <Link className="round-link" href="/quiz" aria-label="Build a starting point"><ArrowRight size={19} /></Link>
      </section>

      <section className="learn-invite">
        <span className="learn-mark"><Palette size={20} strokeWidth={1.6} /></span>
        <div><span className="mono">A LITTLE COLOR KNOWLEDGE</span><h2>Undertone, depth and color. Start with what feels right.</h2><p>A friendly guide to the basics, with room to experiment and make them your own.</p></div>
        <Link className="text-button" href="/learn">Explore the Learn guide <ArrowRight size={15} /></Link>
      </section>
    </main>
  );
}
