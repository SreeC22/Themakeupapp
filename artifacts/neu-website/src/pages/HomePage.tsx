import { ArrowRight, Palette } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { usePreview } from "@/features/mvp/use-preview";
import { LAUNCH_CATEGORIES } from "@/features/mvp/catalog";

const pigmentArt = `${import.meta.env.BASE_URL}images/neu-pigment-study.jpg`;

export default function HomePage() {
  const [, navigate] = useLocation();
  const { state } = usePreview();
  const hasProfile = !!state.quiz.onboardingPath || !!state.quiz.shadeId || state.quiz.depthUnsure || state.quiz.products.length > 0;
  return (
    <main className="content">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Maximalism with caution</span>
          <h1>More looks.<br /><em>Fewer unnecessary<br />products.</em></h1>
          <p className="hero-lede">Make room for creative possibilities, not more things you do not need. Build your personal makeup wardrobe, reuse what you own and discover new ways to wear it.</p>
          <div className="hero-actions">
            <Button onClick={() => navigate(hasProfile ? "/edit" : "/quiz")} data-testid="button-home-build-look">{hasProfile ? "Open your Neu Edit" : "Start your complexion profile"} <ArrowRight size={17} /></Button>
            <Link className="text-button" href="/edit">Explore your Neu Edit <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-note"><i />Explore first. No account needed.</div>
        </div>
        <figure className="hero-art">
          <img src={pigmentArt} width={1024} height={1024} fetchPriority="high" decoding="async" alt="Dusty rose, muted mauve and warm beige makeup textures on a soft ivory surface." />
        </figure>
      </section>

      <section aria-labelledby="how-title">
        <h2 id="how-title" className="section-kicker">Your profile. Your Edit. Your expression.</h2>
        <div className="how-grid">
          <article className="how-step"><span className="step-num">01</span><div><h2>Start with you.</h2><p>Build your beauty profile with a shade you know or the manual palette. Unsure is always welcome.</p></div></article>
          <article className="how-step"><span className="step-num">02</span><div><h2>Consider your essentials.</h2><p>Your Neu Edit is a focused collection, with options you already own, thoughtful extras and honest evidence gaps. Nothing is a must-have.</p></div></article>
          <article className="how-step"><span className="step-num">03</span><div><h2>Make more of it.</h2><p>Explore six flexible looks using the same collection. Skip steps, swap safely, then save your routine or visit a real product source.</p></div></article>
        </div>
      </section>

      <section className="mvp-home-categories" aria-labelledby="launch-categories-heading">
        <span className="mono">FOUR PLACES TO BEGIN</span><h2 id="launch-categories-heading">Explore what interests you.</h2>
        <nav aria-label="Launch makeup categories">{LAUNCH_CATEGORIES.map((category) => <Link key={category} className="mvp-link" href={`/results?category=${encodeURIComponent(category)}`}>{category} <ArrowRight size={14} /></Link>)}</nav>
        <p>Explore a growing reviewed catalog alongside clearly separate curated research. Manufacturer descriptors are not laboratory validation, exact cross-brand matches or a current stock check.</p>
        <p>Public community is outside the MVP. Your personal notes and profile stay private in this browser.</p>
        <Link href="/profile" className="mvp-link">Your profile & private drafts <ArrowRight size={14} /></Link>
      </section>

      <section className="home-bottom">
        <div><span className="mono">A LITTLE REMINDER</span><h2>There is not one right way to wear it.</h2></div>
        <p>Bare skin, sharp liner, a favorite shade. Start wherever you are, and keep what feels like you.</p>
        <Link className="round-link" href="/edit" aria-label="Open your Neu Edit"><ArrowRight size={19} /></Link>
      </section>

      <section className="learn-invite">
        <span className="learn-mark"><Palette size={20} strokeWidth={1.6} /></span>
        <div><span className="mono">A LITTLE COLOR KNOWLEDGE</span><h2>Undertone, depth and color. Start with what feels right.</h2><p>A friendly guide to the basics, with room to experiment and make them your own.</p></div>
        <Link className="text-button" href="/learn">Explore the Learn guide <ArrowRight size={15} /></Link>
      </section>
    </main>
  );
}
