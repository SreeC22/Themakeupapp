import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Link } from "wouter";
import { EmptyState, Heading } from "@/features/mvp/Controls";

export default function AdminUnavailablePage() {
  return <main className="content mvp-page"><Heading eyebrow="RESTRICTED AREA · UNAVAILABLE" title="Editorial tools stay protected.">No administrator session or verified member backend is connected to this local preview.</Heading>
    <EmptyState title="No public moderation or catalog powers" action={<Link className="mvp-link" href="/results">Return to public research browsing</Link>}><p>Approval, rejection, importing and publishing require authenticated role checks and a protected backend. This route does not expose an admin dashboard or pretend to authenticate you.</p><Button disabled variant="secondary">Admin sign-in unavailable</Button></EmptyState>
    <p className="mvp-muted">The clearly labeled moderation-state simulation in a private review draft changes only a local demonstration label. It cannot approve any real content.</p>
  </main>;
}
