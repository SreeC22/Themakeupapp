import { useEffect, useState, type ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageMeta, SiteFooter, SiteHeader } from "@/components/SiteShell";
import { useGuestProfile } from "@/hooks/use-profile";
import HomePage from "@/pages/HomePage";
import { QuizPage } from "@/features/quiz/QuizPage";
import { INITIAL_QUIZ_DRAFT, QUIZ_SWATCHES, type QuizDraft } from "@/features/quiz/_shared/quizDraft";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import LearnPage from "@/pages/LearnPage";
import DiscoverPage from "@/pages/DiscoverPage";
import DesignGuidePage from "@/pages/DesignGuidePage";
import { NotFoundPage, SavedPage, SharePage } from "@/pages/UtilityPages";
import { Redirect, Route, Switch, useLocation, Router as WouterRouter } from "wouter";

function RouteBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Website() {
  const [location, setLocation] = useLocation();
  const { profile, updateProfile } = useGuestProfile();
  const [quizDraft, setQuizDraft] = useState<QuizDraft>(() => ({
    ...INITIAL_QUIZ_DRAFT, products: [], categories: [], clues: [],
  }));
  const [returnToQuiz, setReturnToQuiz] = useState(false);
  const [guideNote, setGuideNote] = useState("");
  const quizPage = location === "/quiz";
  const shade = QUIZ_SWATCHES.find((item) => item.id === quizDraft.shadeId);
  const knownUndertone = quizDraft.undertone && quizDraft.undertone !== "Still exploring" ? quizDraft.undertone : null;
  const profileReady = Boolean(shade && knownUndertone);
  const browsingProfile = {
    ...profile,
    depth: shade?.profileDepth ?? profile.depth,
    undertone: knownUndertone ?? "Not sure" as const,
    oliveCast: quizDraft.olive === "yes",
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return (
    <div className="neu-app">
      {!quizPage && <SiteHeader />}
      <RouteBoundary>
        <Switch>
          <Route path="/">
            <PageMeta title="Makeup, your way" description="Discover shade notes, explore color and build a personal skin starting point with Neu." />
            <HomePage />
          </Route>
          <Route path="/learn">
            <PageMeta title="Learn about color" description="A public guide to skin depth, undertone, olive cast and playful color theory." />
            {returnToQuiz && <aside className="quiz-return"><p>Your quiz answers are still here.</p><Button onClick={() => { setReturnToQuiz(false); setLocation("/quiz"); }}>Return to your quiz</Button></aside>}
            <LearnPage profile={browsingProfile} onUseProfile={(patch) => {
              updateProfile(patch);
              const changedDepth = patch.depth !== undefined && patch.depth !== shade?.profileDepth;
              setQuizDraft((current) => ({
                ...current,
                ...(patch.undertone ? { undertone: patch.undertone === "Not sure" ? "Still exploring" : patch.undertone } : {}),
                ...(patch.oliveCast !== undefined ? { olive: patch.oliveCast ? "yes" : "no" } : {}),
                ...(changedDepth ? { shadeId: null, depthUnsure: true, step: "depth" } : {}),
              }));
              setGuideNote(changedDepth ? "The guide explores broad ranges. Choose a swatch yourself here, or stay unsure." : "");
              setReturnToQuiz(false);
              setLocation("/quiz");
            }} />
          </Route>
          <Route path="/profile">
            <Redirect to="/quiz" />
          </Route>
          <Route path="/quiz">
            <PageMeta title={quizDraft.step === "review" ? "Your starting point" : "Build a starting point"} description="Four short, optional sections to explore your makeup, skin depth, undertone and interests." />
            <QuizPage draft={quizDraft} onChange={setQuizDraft} guideNote={guideNote}
              onHome={() => setLocation("/")}
              onLearn={() => { setReturnToQuiz(true); setLocation("/learn"); }}
              onComplete={() => setLocation("/discover")} />
          </Route>
          <Route path="/discover">
            <PageMeta title="Discover shade notes" description="Browse Neu's clearly labeled example products and filter them by category and skin profile." />
            <DiscoverPage profile={browsingProfile} profileReady={profileReady} />
          </Route>
          <Route path="/saved">
            <PageMeta title="Saved picks" description="Learn about account-based saving. Cloud saves are not connected in this Neu website build." />
            <SavedPage />
          </Route>
          <Route path="/share">
            <PageMeta title="Share a find" description="Sharing is not connected yet. Explore the current Neu community handoff and sample content." />
            <SharePage />
          </Route>
          <Route path="/design-guide">
            <PageMeta title="Design guide" description="Neu's approved visual direction, website flow and implementation handoff reference." />
            <DesignGuidePage />
          </Route>
          <Route><NotFoundPage /></Route>
        </Switch>
      </RouteBoundary>
      {!quizPage && <SiteFooter />}
      {location !== "/" && <span className="sr-only" aria-live="polite">{location}</span>}
    </div>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Website />
    </WouterRouter>
  );
}

export default App;
