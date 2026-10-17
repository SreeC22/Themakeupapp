import { ArrowRight, Palette } from "lucide-react";
import { Link } from "wouter";

const pigmentArt = `${import.meta.env.BASE_URL}images/neu-pigment-study.jpg`;

export default function HomePage() {
  return (
    <main className="content">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">A community for every shade story</span>
          <h1>Makeup is a way<br />to <em>be more you.</em></h1>
          <p className="hero-lede">Find makeup ideas through people with skin like yours. Explore first, then keep a personal starting point right here on your device.</p>
          <div className="hero-actions">
            <Link className="primary" href="/profile">Find my starting point <ArrowRight size={17} /></Link>
            <Link className="text-button" href="/discover">Browse shade notes <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-note"><i />Explore first. No account needed.</div>
        </div>
        <figure className="hero-art">
          <img src={pigmentArt} alt="Dusty rose, muted mauve and warm beige makeup textures on a soft ivory surface." />
          <span className="hero-art-index">01 / COLOR NOTES</span>
          <figcaption className="hero-caption">
            <small>CONCEPT IMAGE</small>
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="how-title">
        <h2 id="how-title" className="section-kicker">Find your next favourite, your way</h2>
        <div className="how-grid">
          <article className="how-step"><span className="step-num">01</span><div><h2>Start with your skin.</h2><p>Choose depth, undertone and skin type. Change your profile whenever you like.</p></div></article>
          <article className="how-step"><span className="step-num">02</span><div><h2>Find what feels familiar.</h2><p>Explore a clearly labeled example library of shade notes and everyday routines.</p></div></article>
          <article className="how-step"><span className="step-num">03</span><div><h2>Make it your own.</h2><p>Learn the color basics, then keep what feels like you. Shared community features are not connected yet.</p></div></article>
        </div>
      </section>

      <section className="home-bottom">
        <div><span className="mono">A LITTLE REMINDER</span><h2>There is not one right way to wear it.</h2></div>
        <p>Bare skin, sharp liner, a favorite shade. Start wherever you are, and keep what feels like you.</p>
        <Link className="round-link" href="/profile" aria-label="Build your profile"><ArrowRight size={19} /></Link>
      </section>

      <section className="learn-invite">
        <span className="learn-mark"><Palette size={20} strokeWidth={1.6} /></span>
        <div><span className="mono">A LITTLE COLOR KNOWLEDGE</span><h2>Undertone, depth and color. Start with what feels right.</h2><p>A friendly guide to the basics, with room to experiment and make them your own.</p></div>
        <Link className="text-button" href="/learn">Explore the Learn guide <ArrowRight size={15} /></Link>
      </section>
    </main>
  );
}
