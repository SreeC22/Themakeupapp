import { useEffect, type ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageMeta, SiteFooter, SiteHeader } from "@/components/SiteShell";
import { useGuestProfile } from "@/hooks/use-profile";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/pages/ProfilePage";
import LearnPage from "@/pages/LearnPage";
import DiscoverPage from "@/pages/DiscoverPage";
import DesignGuidePage from "@/pages/DesignGuidePage";
import { NotFoundPage, SavedPage, SharePage } from "@/pages/UtilityPages";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";

function RouteBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Website() {
  const [location, setLocation] = useLocation();
  const { profile, storageStatus, updateProfile } = useGuestProfile();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return (
    <div className="neu-app">
      <SiteHeader />
      <RouteBoundary>
        <Switch>
          <Route path="/">
            <PageMeta title="Makeup, your way" description="Discover shade notes, explore color and build a personal skin starting point with Neu." />
            <HomePage />
          </Route>
          <Route path="/learn">
            <PageMeta title="Learn about color" description="A public guide to skin depth, undertone, olive cast and playful color theory." />
            <LearnPage profile={profile} onUseProfile={(patch) => { updateProfile(patch); setLocation("/profile"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          </Route>
          <Route path="/profile">
            <PageMeta title="Your skin profile" description="Choose an editable skin depth and undertone starting point, stored locally in this browser." />
            <ProfilePage profile={profile} storageStatus={storageStatus} onChange={updateProfile} />
          </Route>
          <Route path="/discover">
            <PageMeta title="Discover shade notes" description="Browse Neu's clearly labeled example products and filter them by category and skin profile." />
            <DiscoverPage profile={profile} />
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
      <SiteFooter />
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
