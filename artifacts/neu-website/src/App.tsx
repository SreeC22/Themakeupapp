import { useEffect, type ReactNode } from "react";
import { Redirect, Route, Switch, useLocation, useSearch, Router as WouterRouter } from "wouter";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageMeta, SiteFooter, SiteHeader } from "@/components/SiteShell";
import HomePage from "@/pages/HomePage";
import DesignGuidePage from "@/pages/DesignGuidePage";
import ResultsPage from "@/pages/ResultsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CommunityPage from "@/pages/CommunityPage";
import ReviewDraftPage from "@/pages/ReviewDraftPage";
import SavedProductsPage from "@/pages/SavedProductsPage";
import LocalProfilePage from "@/pages/LocalProfilePage";
import AdminUnavailablePage from "@/pages/AdminUnavailablePage";
import { NotFoundPage } from "@/pages/UtilityPages";
import { QuizPage } from "@/features/quiz/QuizPage";
import { PreviewProvider, usePreview } from "@/features/mvp/use-preview";
import { StorageNotice } from "@/features/mvp/StorageNotice";
import { LearnRoute } from "@/features/mvp/LearnRoute";

function RouteBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Website() {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const { state, updateQuiz } = usePreview();
  const quizPage = location === "/quiz";
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [location]);
  return <div className="neu-app">
    {!quizPage && <SiteHeader />}
    <StorageNotice />
    <RouteBoundary>
      <Switch>
        <Route path="/"><PageMeta title="Makeup, your way" description="Makeup self-expression across complexion depths. Build an optional local starting point and explore honest historical product research." /><HomePage /></Route>
        <Route path="/quiz">
          <PageMeta title="Build your local starting point" description="Four short optional sections: complexion depth, coloring, shopping interests and prior experience. No photos or account needed." />
          <QuizPage draft={state.quiz} onChange={updateQuiz} guideNote={new URLSearchParams(search).get("guideDepth") === "changed" ? "The guide explores broad ranges. Choose a swatch yourself here, or stay unsure." : ""}
            onHome={() => navigate("/")} onLearn={() => navigate("/learn?returnTo=quiz")} onComplete={() => navigate("/results")} />
        </Route>
        <Route path="/results"><PageMeta title="Your starting point & product research" description="Edit your local profile and browse four categories of historical listings. No exact shade matches, current stock claims or match scores." /><ResultsPage /></Route>
        <Route path="/products/:slug">{(params) => <ProductDetailPage slug={params.slug} />}</Route>
        <Route path="/community"><PageMeta title="Community evidence & local drafts" description="Explore the genuine empty member evidence view and your own private local drafts. No invented reviews or public posting." /><CommunityPage /></Route>
        <Route path="/review/new"><PageMeta title="Write a private local review draft" description="Keep structured self-reported product observations as a local draft only. Nothing is submitted, approved or public." /><ReviewDraftPage key={search} /></Route>
        <Route path="/saved"><PageMeta title="Your locally saved products" description="Your actual saved product identifiers in this browser. Remove them or revisit the historical source evidence." /><SavedProductsPage /></Route>
        <Route path="/profile"><PageMeta title="Your local profile & privacy" description="Edit answers, choose a private-by-default local preference, export this preview's data or confirm a local reset. No account service connected." /><LocalProfilePage /></Route>
        <Route path="/admin"><PageMeta title="Protected editorial tools unavailable" description="Administrator tools require verified authorization and are unavailable in this local preview. No public moderation powers." /><AdminUnavailablePage /></Route>
        <Route path="/learn"><PageMeta title="Learn about color" description="A public guide to depth, undertone, olive cast and playful color theory. Guide examples never become known profile traits automatically." /><LearnRoute /></Route>
        <Route path="/design-guide"><PageMeta title="Design guide" description="Neu's approved palette, typography and source-backed design-system controls." /><DesignGuidePage /></Route>
        <Route path="/discover"><Redirect to={`/results${search ? `?${search}` : ""}`} /></Route>
        <Route path="/share"><Redirect to={`/review/new${search ? `?${search}` : ""}`} /></Route>
        <Route><PageMeta title="Page not found" description="This Neu route is not available. Return home or explore the research library." /><NotFoundPage /></Route>
      </Switch>
    </RouteBoundary>
    {!quizPage && <SiteFooter />}
    {location !== "/" && <span className="sr-only" aria-live="polite">{location}</span>}
  </div>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><PreviewProvider><Website /></PreviewProvider></WouterRouter>;
}

export default App;
