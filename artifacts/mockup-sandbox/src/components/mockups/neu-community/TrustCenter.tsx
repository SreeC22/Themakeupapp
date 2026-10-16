import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import "./trustcenter.css";

type TrustTab = "overview" | "privacy" | "community" | "terms";

type Article = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  note?: string;
};

const documents: Record<Exclude<TrustTab, "overview">, { title: string; intro: string; articles: Article[] }> = {
  privacy: {
    title: "Your beauty notes. Your call.",
    intro: "Here is the privacy approach Neu is proposing. The exact data flow and retention details must be confirmed before launch.",
    articles: [
      {
        id: "profile",
        title: "What your profile may include",
        summary: "A few optional details can make shade notes easier to explore.",
        points: [
          "Skin depth, undertone, olive cast, skin type and concerns you choose to share.",
          "A public handle for community posts. Your email and full name should never appear on public notes.",
          "You should be able to skip a detail, change it later or browse without a profile.",
        ],
        note: "These are proposed product principles, not a statement about a live production service.",
      },
      {
        id: "use",
        title: "How we intend to use those details",
        summary: "The profile should help organize discovery, not define anyone.",
        points: [
          "Use skin details to sort community product notes when you ask to see similar profiles.",
          "Do not infer someone's identity, health, ethnicity or worth from their shade or skin type.",
          "Ask for separate permission before any use beyond the feature a person chose.",
        ],
      },
      {
        id: "control",
        title: "Your choices and control",
        summary: "Privacy controls should be easy to find, not buried in fine print.",
        points: [
          "Make profile details optional and editable.",
          "Offer clear ways to hide, correct or delete a profile and its posts.",
          "Explain what happens to saved items and backups when someone closes an account.",
        ],
        note: "The controls shown in this preview are illustrative only and do not change stored data.",
      },
      {
        id: "photos",
        title: "Photos and personal information",
        summary: "No face photo should be needed to get started.",
        points: [
          "A text product note should always be a valid way to participate.",
          "If product photos are introduced, give people a choice before upload and explain visibility.",
          "Do not post someone else's face, private details or image without their permission.",
        ],
      },
      {
        id: "tracking",
        title: "Cookies, analytics and partners",
        summary: "A real policy should name the services that touch data.",
        points: [
          "List essential cookies separately from optional measurement tools.",
          "Explain every third-party service, retailer link and any affiliate relationship.",
          "Do not promise tracking is off until the actual site configuration has been verified.",
        ],
        note: "Providers, retention periods, contact details and applicable rights need to be filled in before publication.",
      },
    ],
  },
  community: {
    title: "Make room for every version of beauty.",
    intro: "Community rules protect honest sharing and let people explore without being judged for their skin, shade or style.",
    articles: [
      {
        id: "respect",
        title: "Respect every shade and skin story",
        summary: "No one owes the community a photo, explanation or particular look.",
        points: [
          "No colorism, shade ranking, skin-tone gatekeeping or harassment.",
          "Do not tell another person what they must wear or what their skin should look like.",
          "Talk about products and experiences without turning personal preference into a universal rule.",
        ],
      },
      {
        id: "honesty",
        title: "Be clear about the product",
        summary: "Useful notes are specific, kind and honest about uncertainty.",
        points: [
          "Use the correct brand, product, shade name and category when you can.",
          "Say whether a match is exact, close, mixed or based on memory.",
          "Be respectful in reviews. Product criticism is welcome; attacks on people are not.",
        ],
      },
      {
        id: "disclosure",
        title: "Disclose gifts and affiliations",
        summary: "People deserve to know when a recommendation may be incentivized.",
        points: [
          "Clearly disclose gifted items, sponsorships, employment and affiliate links.",
          "Do not disguise advertising as an ordinary community post.",
          "Do not buy votes, likes, reviews or shade recommendations.",
        ],
      },
      {
        id: "safety",
        title: "Keep personal information personal",
        summary: "A beauty community should not make anyone less safe.",
        points: [
          "No doxxing, threats, impersonation, spam or publishing private conversations.",
          "Do not upload content you do not own or have permission to share.",
          "Do not present shade matching or skincare experiences as medical diagnosis or treatment.",
        ],
      },
      {
        id: "moderation",
        title: "Reporting and moderation",
        summary: "Reports should be easy to make and handled with care.",
        points: [
          "Give people a clear way to report harmful posts or behavior.",
          "Explain how content can be reviewed, hidden, removed or appealed.",
          "Publish a real support contact and response expectations before inviting members.",
        ],
        note: "Moderation tools and response times are not active in this design preview.",
      },
    ],
  },
  terms: {
    title: "Terms & conditions for a kind beauty community.",
    intro: "This is a plain-language outline of the terms a real launch needs. It is not a complete or legally reviewed agreement.",
    articles: [
      {
        id: "eligibility",
        title: "Who can use Neu",
        summary: "Eligibility must be clear before anyone creates an account.",
        points: [
          "Define the minimum age and any guardian-consent requirements for each launch region.",
          "Explain account security and what happens if account details are inaccurate.",
          "Do not launch until eligibility, accessibility and regional requirements are reviewed.",
        ],
      },
      {
        id: "content",
        title: "Your posts and our limited permission",
        summary: "People should retain ownership of what they contribute.",
        points: [
          "Explain the narrow permission needed to display and operate a post in the community.",
          "Explain how edits and deletion work, including what may remain in backups or legal records.",
          "Do not reuse posts in marketing or train AI on them without clear, separate permission.",
        ],
      },
      {
        id: "accurate",
        title: "Shade notes are personal experience",
        summary: "A community recommendation is a starting point, not a guarantee.",
        points: [
          "Formula, lighting, screen settings, application and individual skin can change how a shade appears.",
          "Members describe their own experience, not a verified match or professional diagnosis.",
          "Retailer availability, price and ingredients can change. Check the seller and packaging.",
        ],
      },
      {
        id: "conduct",
        title: "Community conduct and enforcement",
        summary: "Terms should explain the rules and what happens when they are broken.",
        points: [
          "Link to the Community Rules and explain reporting and appeal options.",
          "Describe when content or accounts may be restricted, suspended or removed.",
          "Tell people how policy changes will be announced and when they take effect.",
        ],
      },
      {
        id: "service",
        title: "Service, links and legal details",
        summary: "The final terms need real business and jurisdiction information.",
        points: [
          "Identify the service operator, contact details, applicable law and dispute process.",
          "Explain third-party retailer links, advertising and any affiliate compensation.",
          "Describe service availability, changes and any warranty or liability terms in plain language.",
        ],
        note: "A qualified legal professional should adapt and review the final terms for the business and launch locations.",
      },
    ],
  },
};

const tabs: { id: TrustTab; label: string }[] = [
  { id: "overview", label: "Our approach" },
  { id: "privacy", label: "Privacy policy" },
  { id: "community", label: "Community rules" },
  { id: "terms", label: "Terms & conditions" },
];

export function TrustCenter() {
  const [activeTab, setActiveTab] = useState<TrustTab>("overview");
  const [expandedId, setExpandedId] = useState("profile");
  const [optionalAnalytics, setOptionalAnalytics] = useState(false);
  const [productUpdates, setProductUpdates] = useState(false);
  const [toast, setToast] = useState("");

  const openDocument = (tab: Exclude<TrustTab, "overview">) => {
    setActiveTab(tab);
    setExpandedId(documents[tab].articles[0].id);
    setToast("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previewPreferences = () => {
    setToast("Preview only. Your choices are not saved or sent.");
  };

  return (
    <div className="trust-shell" id="top">
      <div className="trust-preview-ribbon">
        <Sparkles size={13} />
        <span>TRUST CENTER PREVIEW</span>
        <i />
        <span>Policy copy and controls are drafts, not active legal terms.</span>
      </div>

      <header className="trust-header">
        <button className="trust-wordmark" type="button" onClick={() => setActiveTab("overview")} aria-label="Neu trust center home">
          neu<span>.</span><small>BEAUTY, YOUR WAY</small>
        </button>
        <nav className="trust-tabs" aria-label="Trust center sections" role="tablist">
          {tabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? "trust-tab is-active" : "trust-tab"}
              id={`trust-tab-${tab.id}`}
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setToast("");
              }}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="trust-header-note"><LockKeyhole size={14} /> Privacy comes first</div>
      </header>

      <main className="trust-main">
        {activeTab === "overview" ? (
          <>
            <section className="trust-hero">
              <div className="trust-hero-copy">
                <p className="trust-eyebrow"><span /> CARE, IN EVERY DETAIL</p>
                <h1>Beauty is personal.<br /><em>So is your privacy.</em></h1>
                <p className="trust-hero-lede">
                  Neu is a place to learn, compare shade notes and share what makes a look feel like you.
                  Trust means knowing what is public, what is optional and what is still being built.
                </p>
                <button className="trust-primary" onClick={() => openDocument("privacy")} type="button">
                  Explore our privacy approach <ArrowRight size={16} />
                </button>
              </div>
              <div className="trust-hero-art" aria-label="Illustration of layered color swatches with a privacy shield">
                <div className="trust-orbit trust-orbit-one" />
                <div className="trust-orbit trust-orbit-two" />
                <span className="trust-color-dot trust-dot-one" />
                <span className="trust-color-dot trust-dot-two" />
                <span className="trust-color-dot trust-dot-three" />
                <div className="trust-shield"><ShieldCheck size={39} strokeWidth={1.3} /></div>
                <div className="trust-art-caption"><small>OUR STARTING POINT</small><b>Care with<br />a clear view.</b></div>
                <span className="trust-art-index">NEU / 04</span>
              </div>
            </section>

            <section className="trust-principles" aria-label="Neu trust principles">
              <article className="trust-principle trust-principle-main">
                <span className="trust-principle-index">01 / FOR YOU</span>
                <LockKeyhole size={21} />
                <h2>Share only what helps.</h2>
                <p>Profile details are meant to guide discovery. Skin depth, undertone and skin type should never be a price of entry.</p>
              </article>
              <article className="trust-principle trust-principle-side">
                <span className="trust-principle-index">02 / YOUR CHOICE</span>
                <Eye size={20} />
                <h2>Know what is public.</h2>
                <p>Private account details and public beauty notes should be clearly separated.</p>
              </article>
              <article className="trust-principle trust-principle-side">
                <span className="trust-principle-index">03 / OUR COMMUNITY</span>
                <Sparkles size={20} />
                <h2>Make room for everyone.</h2>
                <p>Different skin and different taste deserve respect, never ranking.</p>
              </article>
            </section>

            <section className="trust-paths">
              <div className="trust-paths-heading">
                <div><p className="trust-eyebrow"><span /> THE FINE PRINT, MADE HUMAN</p><h2>Choose what you want to know.</h2></div>
                <p>Clear answers, no mystery. These pages are drafts for review before launch.</p>
              </div>
              <div className="trust-path-list">
                <button className="trust-path" onClick={() => openDocument("privacy")} type="button">
                  <span className="trust-path-number">01</span><span className="trust-path-icon"><LockKeyhole size={18} /></span>
                  <span className="trust-path-copy"><strong>Privacy, your way</strong><small>What a profile includes, what is visible and how to stay in control.</small></span>
                  <ArrowRight size={17} />
                </button>
                <button className="trust-path" onClick={() => openDocument("community")} type="button">
                  <span className="trust-path-number">02</span><span className="trust-path-icon trust-path-icon-rose"><Sparkles size={18} /></span>
                  <span className="trust-path-copy"><strong>Community rules</strong><small>How we protect honest beauty talk and treat one another.</small></span>
                  <ArrowRight size={17} />
                </button>
                <button className="trust-path" onClick={() => openDocument("terms")} type="button">
                  <span className="trust-path-number">03</span><span className="trust-path-icon trust-path-icon-olive"><ShieldCheck size={18} /></span>
                  <span className="trust-path-copy"><strong>Terms &amp; conditions</strong><small>The agreement members need to understand before joining.</small></span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </section>

            <section className="trust-draft-note">
              <div className="trust-draft-note-mark"><SlidersHorizontal size={19} /></div>
              <div><strong>Built on clarity, not blanket promises.</strong><p>This preview describes intended principles. Data storage, retention, cookies, moderation and legal details must be verified before any policy is published.</p></div>
              <button type="button" onClick={() => openDocument("terms")}>What still needs review <ArrowRight size={15} /></button>
            </section>
          </>
        ) : (
          <section className="trust-document" id={`trust-panel-${activeTab}`} role="tabpanel" aria-labelledby={`trust-tab-${activeTab}`}>
            <button className="trust-back" type="button" onClick={() => setActiveTab("overview")}><ArrowLeft size={15} /> Trust center</button>
            <div className="trust-document-heading">
              <div>
                <p className="trust-eyebrow"><span /> NEU / {activeTab === "privacy" ? "01" : activeTab === "community" ? "02" : "03"}</p>
                <h1 id="trust-document-title">{documents[activeTab].title}</h1>
                <p>{documents[activeTab].intro}</p>
              </div>
              <div className="trust-reading-note"><span>READING TIME</span><strong>About 2 minutes</strong></div>
            </div>

            <div className="trust-document-body">
              <aside className="trust-outline" aria-label={`${documents[activeTab].title} topics`}>
                <span className="trust-outline-label">IN THIS GUIDE</span>
                {documents[activeTab].articles.map((article, index) => (
                  <button
                    aria-current={expandedId === article.id ? "location" : undefined}
                    className={expandedId === article.id ? "trust-outline-link is-active" : "trust-outline-link"}
                    key={article.id}
                    onClick={() => setExpandedId(article.id)}
                    type="button"
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>{article.title}
                  </button>
                ))}
              </aside>
              <div className="trust-articles">
                {documents[activeTab].articles.map((article, index) => {
                  const isOpen = expandedId === article.id;
                  return (
                    <article className={isOpen ? "trust-article is-open" : "trust-article"} key={article.id}>
                      <button aria-expanded={isOpen} className="trust-article-toggle" onClick={() => setExpandedId(isOpen ? "" : article.id)} type="button">
                        <span className="trust-article-count">{String(index + 1).padStart(2, "0")}</span>
                        <span className="trust-article-head"><strong>{article.title}</strong><small>{article.summary}</small></span>
                        <ChevronDown size={17} />
                      </button>
                      {isOpen && (
                        <div className="trust-article-content">
                          <ul>{article.points.map((point) => <li key={point}>{point}</li>)}</ul>
                          {article.note && <p className="trust-article-note"><InfoIcon />{article.note}</p>}
                        </div>
                      )}
                    </article>
                  );
                })}
                {activeTab === "privacy" && (
                  <section className="trust-preferences">
                    <div className="trust-pref-heading"><div><SlidersHorizontal size={17} /><h2>Preference controls preview</h2></div><span>DEMO ONLY</span></div>
                    <p>These switches illustrate possible choices. They do not change or save actual account settings.</p>
                    <label className="trust-pref-row"><span><strong>Optional product updates</strong><small>Occasional notes about new features.</small></span><input checked={productUpdates} onChange={(event) => { setProductUpdates(event.target.checked); setToast(""); }} type="checkbox" /></label>
                    <label className="trust-pref-row"><span><strong>Optional usage analytics</strong><small>Only after clear consent and full disclosure.</small></span><input checked={optionalAnalytics} onChange={(event) => { setOptionalAnalytics(event.target.checked); setToast(""); }} type="checkbox" /></label>
                    <button className="trust-pref-save" onClick={previewPreferences} type="button">Preview my choices <Check size={14} /></button>
                    {toast && <p className="trust-toast" role="status">{toast}</p>}
                  </section>
                )}
              </div>
            </div>
            <button className="trust-return" type="button" onClick={() => setActiveTab("overview")}>Back to trust center <ArrowLeft size={15} /></button>
          </section>
        )}
      </main>

      <footer className="trust-footer">
        <button className="trust-footer-wordmark" onClick={() => setActiveTab("overview")} type="button">neu<span>.</span></button>
        <span>BEAUTY IS PERSONAL. SO IS TRUST.</span>
        <div><button onClick={() => openDocument("privacy")} type="button">Privacy policy</button><button onClick={() => openDocument("community")} type="button">Community rules</button><button onClick={() => openDocument("terms")} type="button">Terms &amp; conditions</button></div>
      </footer>
    </div>
  );
}

function InfoIcon() {
  return <span className="trust-info-icon" aria-hidden="true">i</span>;
}

export default TrustCenter;
