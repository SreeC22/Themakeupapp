import { ArrowRight, Bookmark, CloudOff, Info, Share2 } from "lucide-react";
import { Link } from "wouter";

export function SavedPage() {
  return (
    <main className="content">
      <header className="utility-intro"><span className="eyebrow">Your shade notes</span><h1>Your <em>saved edit.</em></h1><p>A home for the products you want to revisit. Account saving is not connected in this website build.</p></header>
      <div className="utility-layout">
        <section className="callout"><span className="beta-mark"><Bookmark size={19} /></span><span className="mono">SAVING IS NOT CONNECTED</span><h2>Nothing is being saved to an account yet.</h2><p>This site has no sign-in or cloud-saving service. We have not stored a pretend saved list. Your local skin profile is separate and remains in this browser only.</p>
          <Link className="primary" href="/discover">Browse example notes <ArrowRight size={15} /></Link></section>
        <aside className="side-note"><span className="eyebrow">Beta status</span><h2>What works today</h2><p>You can explore original sample notes and keep a profile on this device. Shared account features are not active.</p><Link className="text-button" href="/share">Read about sharing <ArrowRight size={14} /></Link></aside>
      </div>
    </main>
  );
}

export function SharePage() {
  return (
    <main className="content">
      <header className="utility-intro"><span className="eyebrow">Pass the good stuff on</span><h1>Share a find, <em>when it is ready.</em></h1><p>Personal shade notes are at the heart of Neu. Publishing them is not connected in this website build.</p></header>
      <div className="utility-layout">
        <section className="callout"><span className="beta-mark"><Share2 size={19} /></span><span className="mono">SHARED POSTS ARE NOT CONNECTED</span><h2>Your note will not be submitted.</h2><p>There is no account system or shared community data source behind this page. We are not collecting product notes, profile details or email addresses here.</p><Link className="primary" href="/discover">Browse the example library <ArrowRight size={15} /></Link></section>
        <aside className="side-note"><Info size={18} /><h2>What happens next?</h2><p>When connected community features are ready, sharing will need clear account, storage and publishing setup. Until then, examples stay labeled as examples.</p><Link className="text-button" href="/learn">Explore the public guide <ArrowRight size={14} /></Link></aside>
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return <main className="content not-found"><span className="eyebrow">A little detour</span><h1>That page is not here.</h1><p>Head back to Neu and find your way from there.</p><Link className="primary" href="/">Back to Neu <ArrowRight size={15} /></Link></main>;
}
