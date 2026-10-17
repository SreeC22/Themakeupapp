import { useEffect, useMemo, useState } from "react";
import type { NeuPage, ProductExample, Profile } from "./data";
import { DEFAULT_PROFILE, PAGE_TITLES, SAMPLE_PRODUCTS } from "./data";
import { PreviewNotice, SiteFooter, SiteHeader } from "./SiteChrome";
import { HomePage, DiscoverPage, ProductPage, ReviewPage, ShadePage } from "./DiscoveryPages";
import { LearnPage, ProfilePage } from "./LearnProfilePages";
import { QuizFlow, ResultsPage } from "./QuizFlow";
import { AccountLanding, DesignReport, DraftDocumentPage, MfaPage, RecoveryPage, ReportsPage, ReportDialog, SignInPage, SignUpPage, SystemPage } from "./AccountSafetyPages";
import { DeleteNoteDialog, OwnNotePage, SavedPage, SettingsPage, SharePage, SharePreviewPage, type MemberNote } from "./MemberPages";
import "./websitejourney.css";

const KNOWN_PAGES = new Set<string>(Object.keys(PAGE_TITLES));
type DeferredIntent = { kind: "save"; productId: string } | { kind: "share" } | null;

function previewProfileFromUrl(): Profile {
  if (new URLSearchParams(window.location.search).get("sampleEntry") !== "1") return DEFAULT_PROFILE;
  return {
    ...DEFAULT_PROFILE,
    shadeEvidence: {
      brand: SAMPLE_PRODUCTS[0].brand,
      product: SAMPLE_PRODUCTS[0].name,
      formula: "Illustrative formula / variant A · unverified",
      shade: "Shade example A · unverified",
      source: "illustrative",
    },
  };
}

function pageFromUrl(): NeuPage {
  const value = new URLSearchParams(window.location.search).get("page") || "home";
  return KNOWN_PAGES.has(value) ? value as NeuPage : "not-found";
}

export default function WebsiteJourney() {
  const [page, setPage] = useState<NeuPage>(pageFromUrl);
  const [profile, setProfile] = useState<Profile>(previewProfileFromUrl);
  const [selectedProduct, setSelectedProduct] = useState<ProductExample>(SAMPLE_PRODUCTS[0]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [previewMember, setPreviewMember] = useState(false);
  const [deferredIntent, setDeferredIntent] = useState<DeferredIntent>(null);
  const [shareProfileConsent, setShareProfileConsent] = useState(false);
  const [importConsent, setImportConsent] = useState(false);
  const [draftNote, setDraftNote] = useState<MemberNote | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [publishedNotes, setPublishedNotes] = useState<MemberNote[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport] = useState<DesignReport | null>(null);
  const [reportContext, setReportContext] = useState("Illustrative member note");

  const editingNote = useMemo(() => publishedNotes.find((note) => note.id === editingNoteId) ?? null, [editingNoteId, publishedNotes]);
  const activeNote = useMemo(() => publishedNotes.find((note) => note.id === activeNoteId) ?? null, [activeNoteId, publishedNotes]);

  useEffect(() => {
    const handlePopstate = () => setPage(pageFromUrl());
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  const navigate = (destination: NeuPage) => {
    const url = new URL(window.location.href);
    if (destination === "home") url.searchParams.delete("page");
    else url.searchParams.set("page", destination);
    window.history.pushState({ page: destination }, "", `${url.pathname}${url.search}${url.hash}`);
    setPage(destination);
    setReportOpen(false);
    setDeletePending(false);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const openReport = (context: string) => {
    setReportContext(context);
    setReportOpen(true);
  };
  const updateProfile = (patch: Partial<Profile>) => setProfile((current) => ({ ...current, ...patch }));
  const openProduct = (product: ProductExample) => {
    setSelectedProduct(product);
    navigate("product");
  };
  const toggleSave = (id: string) => {
    if (!previewMember) {
      setDeferredIntent({ kind: "save", productId: id });
      navigate("account");
      return;
    }
    setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  const beginShare = () => {
    if (!previewMember) {
      setDeferredIntent({ kind: "share" });
      navigate("account");
      return;
    }
    navigate("share");
  };
  const finishSignUp = () => navigate("mfa-enroll");
  const finishPreviewSignIn = () => {
    setPreviewMember(true);
    const nextIntent = deferredIntent;
    setDeferredIntent(null);
    if (nextIntent?.kind === "save") {
      setSavedIds((current) => current.includes(nextIntent.productId) ? current : [...current, nextIntent.productId]);
      navigate("saved");
    } else if (nextIntent?.kind === "share") {
      navigate("share");
    } else {
      navigate("settings");
    }
  };
  const previewNote = (note: MemberNote) => {
    setDraftNote(note);
    setEditingNoteId(note.editOf);
    navigate("share-preview");
  };
  const publishLocalNote = () => {
    if (!draftNote || !previewMember) return;
    const committed = { ...draftNote, editOf: null };
    setPublishedNotes((current) => {
      const alreadyExists = current.some((item) => item.id === committed.id);
      return alreadyExists ? current.map((item) => item.id === committed.id ? committed : item) : [committed, ...current];
    });
    setActiveNoteId(committed.id);
    setDraftNote(null);
    setEditingNoteId(null);
    navigate("review");
  };
  const startEditingOwnNote = () => {
    if (!activeNote) return;
    setEditingNoteId(activeNote.id);
    setDraftNote(null);
    navigate("share");
  };
  const deleteOwnNote = () => {
    if (!activeNote) return;
    setPublishedNotes((current) => current.filter((item) => item.id !== activeNote.id));
    setActiveNoteId(null);
    setDeletePending(false);
    navigate("share");
  };
  const createLocalReport = (created: DesignReport) => {
    setReport(created);
    navigate("reports");
  };
  const resolvePreviewReport = () => setReport((current) => current ? { ...current, resolved: true } : null);
  const signOutOfPreview = () => {
    setPreviewMember(false);
    setSavedIds([]);
    setPublishedNotes([]);
    setDraftNote(null);
    setEditingNoteId(null);
    setActiveNoteId(null);
    setDeferredIntent(null);
    setShareProfileConsent(false);
    setImportConsent(false);
    setProfile(DEFAULT_PROFILE);
    navigate("account");
  };
  const sampleReview = () => <ReviewPage product={selectedProduct} onNavigate={navigate} onReport={() => openReport("Illustrative member note")} />;

  let content;
  switch (page) {
    case "home":
      content = <HomePage onNavigate={navigate} />;
      break;
    case "quiz":
      content = <QuizFlow onComplete={(result) => { setProfile(result); navigate("results"); }} onCancel={() => navigate("home")} onLearn={() => navigate("learn")} />;
      break;
    case "results":
      content = <ResultsPage profile={profile} onNavigate={navigate} />;
      break;
    case "discover":
      content = <DiscoverPage profile={profile} savedIds={savedIds} onNavigate={navigate} onOpenProduct={openProduct} onToggleSave={toggleSave} />;
      break;
    case "product":
      content = <ProductPage product={selectedProduct} isSaved={savedIds.includes(selectedProduct.id)} onNavigate={navigate} onSave={() => toggleSave(selectedProduct.id)} onReport={() => openReport("Illustrative product detail")} />;
      break;
    case "shade":
      content = <ShadePage product={selectedProduct} onNavigate={navigate} />;
      break;
    case "review":
      content = activeNote ? <OwnNotePage note={activeNote} onNavigate={navigate} onEdit={startEditingOwnNote} onRequestDelete={() => setDeletePending(true)} /> : sampleReview();
      break;
    case "learn":
      content = <LearnPage profile={profile} onNavigate={navigate} onUpdateProfile={updateProfile} />;
      break;
    case "profile":
      content = <ProfilePage profile={profile} onChange={updateProfile} onNavigate={navigate} />;
      break;
    case "saved":
      content = <SavedPage previewMember={previewMember} savedIds={savedIds} onNavigate={navigate} onOpenProduct={openProduct} onToggleSave={toggleSave} />;
      break;
    case "account":
      content = <AccountLanding onNavigate={navigate} pendingMessage={deferredIntent?.kind === "save" ? "After the two-step sign-up or sign-in preview, we will return to your saved shade example." : deferredIntent?.kind === "share" ? "After the two-step sign-up or sign-in preview, we will return to your product note." : ""} />;
      break;
    case "signup":
      content = <SignUpPage onNavigate={navigate} onContinue={finishSignUp} />;
      break;
    case "signin":
      content = <SignInPage onNavigate={navigate} onTry={() => navigate("mfa-challenge")} />;
      break;
    case "mfa-enroll":
      content = <MfaPage page="mfa-enroll" onNavigate={navigate} onComplete={finishPreviewSignIn} />;
      break;
    case "mfa-challenge":
      content = <MfaPage page="mfa-challenge" onNavigate={navigate} onComplete={finishPreviewSignIn} />;
      break;
    case "recovery":
      content = <RecoveryPage onNavigate={navigate} />;
      break;
    case "share":
      content = <SharePage profile={profile} previewMember={previewMember} editingNote={editingNote} draftNote={draftNote} onNavigate={navigate} onPreview={previewNote} />;
      break;
    case "share-preview":
      content = <SharePreviewPage note={draftNote} previewMember={previewMember} onBack={() => navigate("share")} onEdit={() => navigate("share")} onPublish={publishLocalNote} />;
      break;
    case "settings":
      content = <SettingsPage profile={profile} shareProfileConsent={shareProfileConsent} importConsent={importConsent} onConsentChange={setShareProfileConsent} onImportConsentChange={setImportConsent} onNavigate={navigate} onSignOut={signOutOfPreview} />;
      break;
    case "reports":
      content = <ReportsPage report={report} onResolve={resolvePreviewReport} onNavigate={navigate} />;
      break;
    case "guidelines":
    case "privacy":
    case "terms":
    case "accessibility":
    case "copyright":
      content = <DraftDocumentPage page={page} onNavigate={navigate} />;
      break;
    case "offline":
    case "loading":
    case "unavailable":
    case "permission":
    case "not-found":
      content = <SystemPage page={page} onNavigate={navigate} />;
      break;
    default:
      content = <SystemPage page="not-found" onNavigate={navigate} />;
  }

  return (
    <div className="wj-app">
      <PreviewNotice />
      <SiteHeader page={page} previewMember={previewMember} onNavigate={navigate} />
      {content}
      <SiteFooter onNavigate={navigate} />
      {reportOpen && <ReportDialog context={reportContext} onClose={() => setReportOpen(false)} onSubmit={createLocalReport} />}
      {deletePending && <DeleteNoteDialog onCancel={() => setDeletePending(false)} onConfirm={deleteOwnNote} />}
    </div>
  );
}
