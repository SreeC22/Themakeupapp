import { useEffect, type ReactNode } from "react";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Choice } from "@workspace/neu-design-system/components/neu/choice";
import { Navigation } from "@workspace/neu-design-system/components/neu/navigation";
import type { OnboardingScreen, QuizDraft } from "./_shared/quizDraft";
import { ColoringFields, DepthPalette, SkinTypeField } from "../mvp/ComplexionFields";
import { Disclosure } from "../mvp/Controls";
import { newReference, oldProductMatch, onboardingJourney } from "../mvp/neu-profile";
import { ReferenceFields } from "../mvp/ReferenceEditor";

export const toggleProductMatch = oldProductMatch;

export function QuizFlow({ draft, onDraftChange, onComplete, onLearn }: {
  draft: QuizDraft; onDraftChange: (draft: QuizDraft) => void; onComplete: () => void; onLearn: () => void;
}) {
  const { screen, path, screens, index } = onboardingJourney(draft);
  const change = (patch: Partial<QuizDraft>) => onDraftChange({ ...draft, ...patch });
  const go = (next: OnboardingScreen) => {
    change({ onboardingPath: path, onboardingScreen: next, step: next === "reference" ? "products" : next === "coloring" || next === "skin" ? "undertone" : "depth" });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  useEffect(() => { document.getElementById("wj-quiz-title")?.focus({ preventScroll: true }); }, [screen]);
  const reference = draft.products[0];
  const next = () => screen === "skin" ? onComplete() : go(screens[index + 1] ?? "skin");
  const nav = <Navigation onBack={() => go(screens[index - 1] ?? "start")} onContinue={next} continueLabel={screen === "skin" ? "Explore your Neu Edit" : "Continue"} />;
  return <div className="wj-quiz-frame wj-quiz-complete">
    <div className="wj-quiz-progress">
      <div className="wj-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={screens.length} aria-valuenow={index + 1} aria-label={`Step ${index + 1} of ${screens.length}`}><i style={{ transform: `scaleX(${(index + 1) / screens.length})`, width: "100%", transformOrigin: "left" }} /></div>
      <div className="wj-progress-label"><span>{screen === "start" ? "Your way to begin" : screen === "reference" ? "Your reference" : screen === "depth" ? "Your depth" : screen === "coloring" ? "Your coloring" : "One last thing"}</span><span>{index + 1} OF {screens.length}</span></div>
    </div>
    <section className="wj-quiz-question" key={screen}>
      {screen === "start" && <>
        <Question title={<>Your complexion profile, <em>your way.</em></>} copy="A starting point for your personal makeup wardrobe. How would you like to begin?" />
        <div className="mvp-stack">
          <Choice title="I already know my shade" selected={draft.onboardingPath === "known"} onClick={() => {
            change({ onboardingPath: "known", onboardingScreen: "reference", step: "products", products: draft.products.length ? draft.products : [newReference()] });
          }} />
          <Choice title="Help me find my shade" selected={draft.onboardingPath === "manual"} onClick={() => change({ onboardingPath: "manual", onboardingScreen: "depth", step: "depth" })} />
        </div>
        <p className="mvp-muted">Start with a foundation or concealer you use, or explore our manual palette. Both build the same editable profile. No photos, account or purchase needed.</p>
        <Button variant="text" onClick={onComplete}>Explore your Edit without a profile</Button>
      </>}
      {screen === "reference" && <>
        <Question title={<>A shade <em>you know.</em></>} copy="Find the exact product and shade, then tell us how it fits. Missing entries can stay self-reported." />
        {reference ? <ReferenceFields reference={reference} onChange={(product) => change({ products: draft.products.map((item) => item.id === product.id ? product : item) })} />
          : <Button variant="secondary" onClick={() => change({ products: [newReference()] })}>Add a reference shade</Button>}
        <p className="mvp-muted">You can add more references in your profile later. A manufacturer descriptor is not laboratory validation or proof of a cross-brand equivalent.</p>
        <Button variant="text" onClick={() => change({ onboardingPath: "manual", onboardingScreen: "depth", step: "depth" })}>Use the manual palette instead</Button>
        {nav}
      </>}
      {screen === "depth" && <>
        <Question title={<>Find your <em>complexion.</em></>} copy="Which depth feels closest? Unsure is a complete answer." />
        <DepthPalette draft={draft} onChange={change} />
        <Button variant="text" onClick={onLearn}>Learn about depth and color, keep my place</Button>
        {nav}
      </>}
      {screen === "coloring" && <>
        <Question title={<>Your coloring, <em>your words.</em></>} copy="Choose an undertone if you know it. You can correct it anytime or leave it open." />
        <ColoringFields draft={draft} onChange={change} />
        <Button variant="text" onClick={onLearn}>Open the color guide, keep my place</Button>
        {nav}
      </>}
      {screen === "skin" && <>
        <Question title={<>What feels like <em>your skin?</em></>} copy="One optional question before you explore. Category preferences come later, only where useful." />
        <SkinTypeField draft={draft} onChange={change} />
        {draft.onboardingPath !== "manual" && <Disclosure title="Confirm undertone if you know it (optional)"><ColoringFields draft={draft} onChange={change} /></Disclosure>}
        <p className="mvp-muted">Your profile stays editable. We explain candidates using available evidence, never match percentages or invented shade equivalents.</p>
        {nav}
      </>}
    </section>
  </div>;
}

function Question({ title, copy }: { title: ReactNode; copy: string }) {
  return <div className="wj-quiz-question-copy"><h1 id="wj-quiz-title" tabIndex={-1}>{title}</h1><p>{copy}</p></div>;
}
