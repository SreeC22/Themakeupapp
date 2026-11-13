import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Route, Switch, useLocation, useSearch, Router as WouterRouter } from "wouter";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageMeta, SiteFooter, SiteHeader } from "@/components/SiteShell";
import HomePage from "@/pages/HomePage";
import DesignGuidePage from "@/pages/DesignGuidePage";
import ResultsPage from "@/pages/ResultsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CatalogShadePage from "@/pages/CatalogShadePage";
import CommunityPage from "@/pages/CommunityPage";
import ReviewDraftPage from "@/pages/ReviewDraftPage";
import SavedProductsPage from "@/pages/SavedProductsPage";
import LooksPage from "@/pages/LooksPage";
import SavedLooksPage from "@/pages/SavedLooksPage";
import LocalProfilePage from "@/pages/LocalProfilePage";
import AdminUnavailablePage from "@/pages/AdminUnavailablePage";
import { NotFoundPage } from "@/pages/UtilityPages";
import { QuizPage } from "@/features/quiz/QuizPage";
import { PreviewProvider, usePreview } from "@/features/mvp/use-preview";
import { StorageNotice } from "@/features/mvp/StorageNotice";
import { LearnRoute } from "@/features/mvp/LearnRoute";
import { LooksProvider } from "@/features/looks/use-looks";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false } } });

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
        <Route path="/"><PageMeta title="Makeup, your way" description="Build your personal Neu Look. Start with a beauty profile, choose a look and budget, customize your source-backed set, then save locally or shop real product sources." /><HomePage /></Route>
        <Route path="/looks"><PageMeta title="Your Neu Look" description="Choose a look, set a budget and generate a personal makeup starting set. Customize each slot, reuse what you own and save complete selections or an unfinished local draft." /><LooksPage key={search} /></Route>
        <Route path="/looks/saved"><PageMeta title="Your saved looks & drafts" description="Revisit complete look selections and drafts saved in this browser. Revalidate on current evidence, edit or delete looks, and manage your self-reported owned makeup." /><SavedLooksPage /></Route>
        <Route path="/quiz">
          <PageMeta title="Your beauty profile, your way" description="Start with a shade you know or the manual palette, then optional skin type. Both build one editable local beauty profile for your Neu Look. No photos or account needed." />
          <QuizPage draft={state.quiz} onChange={updateQuiz} guideNote={new URLSearchParams(search).get("guideDepth") === "changed" ? "The guide explores broad ranges. Choose a swatch yourself here, or stay unsure." : ""}
            onHome={() => navigate("/")} onLearn={() => navigate("/learn?returnTo=quiz")} onComplete={() => navigate("/looks")} />
        </Route>
        <Route path="/results"><PageMeta title="Makeup discovery & evidence" description="Explore four categories with saved contextual preferences, source-backed candidate reasons and honest evidence limits. No exact cross-brand matches or match scores." /><ResultsPage /></Route>
        <Route path="/catalog/shades/:shadeId">{(params) => <CatalogShadePage shadeId={params.shadeId} />}</Route>
        <Route path="/products/:slug">{(params) => <ProductDetailPage slug={params.slug} />}</Route>
        <Route path="/community"><PageMeta title="Private local drafts" description="A compatibility address for your earlier private drafts. Public community is outside the MVP and requires 500+ registered users plus explicit phase approval." /><CommunityPage /></Route>
        <Route path="/review/new"><PageMeta title="Write a private local review draft" description="Keep structured self-reported product observations as a local draft only. Nothing is submitted, approved or public." /><ReviewDraftPage key={search} /></Route>
        <Route path="/saved"><PageMeta title="Your locally saved products" description="Your actual saved catalog shades and historical product identifiers in this browser. Remove them or revisit their separately labeled source evidence." /><SavedProductsPage /></Route>
        <Route path="/profile"><PageMeta title="Your local profile & privacy" description="Edit complexion traits and multiple reference shades, manage private drafts, export your local data or confirm a local reset. No account gate or public profile." /><LocalProfilePage /></Route>
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
  return <QueryClientProvider client={queryClient}><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><PreviewProvider><LooksProvider><Website /></LooksProvider></PreviewProvider></WouterRouter></QueryClientProvider>;
}

export default App;
