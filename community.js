(() => {
  "use strict";

  const DEPTH_NAMES = [
    "Porcelain 1",
    "Fair 2",
    "Light 3",
    "Medium 4",
    "Tan 5",
    "Bronze 6",
    "Deep 7",
    "Deep 8",
    "Rich 9",
    "Rich 10",
  ];
  const DEPTH_STOPS = [0, 7, 14, 22, 32, 47, 62, 78, 90, 100];
  const DEPTH_COLORS = [
    "#F6EDE4",
    "#F3E7DB",
    "#F7EAD0",
    "#EADABA",
    "#D7BD96",
    "#A07E56",
    "#825C43",
    "#604134",
    "#3A312A",
    "#292420",
  ];
  const CATEGORY_NAMES = {
    base: "Base",
    blush: "Blush",
    lip: "Lip",
    eye: "Eye",
    spf: "SPF",
    other: "Other",
  };
  const PROFILE_KEY = "neu.web.profile.v1";
  const LOCAL_EXAMPLE_SAVES_KEY = "neu.web.example-saves.v1";
  const EXAMPLE_POSTS = [
    {
      id: "example-skin-tint",
      body: "A sheer, skin-like base for days when I want freckles to stay part of the look.",
      routine: "Pressed in with a damp sponge; set only around the nose.",
      rating: null,
      example: true,
      profiles: { handle: "Example profile", tone_depth: 5, tone_value: 47, tone_hex: "#D7BD96", undertone: "neutral" },
      products: { brand: "Fenty Beauty", name: "Eaze Drop Blurring Skin Tint", category: "base", shade_label: "Shade 12 · example match", buy_url: "" },
    },
    {
      id: "example-concealer",
      body: "A little warmth brightens the under-eyes without turning the rest of the face pink.",
      routine: "One small dot, left to sit for a few seconds before blending.",
      rating: null,
      example: true,
      profiles: { handle: "Example profile", tone_depth: 5, tone_value: 47, tone_hex: "#D7BD96", undertone: "neutral" },
      products: { brand: "NARS", name: "Radiant Creamy Concealer", category: "base", shade_label: "Ginger · example match", buy_url: "" },
    },
    {
      id: "example-blush",
      body: "One tiny dot gives the cheeks a watercolor flush. Tap the extra onto the lips.",
      routine: "Warm between fingers, then press onto the high points of the cheeks.",
      rating: null,
      example: true,
      profiles: { handle: "Example profile", tone_depth: 3, tone_value: 22, tone_hex: "#F7EAD0", undertone: "warm" },
      products: { brand: "Rare Beauty", name: "Soft Pinch Liquid Blush", category: "blush", shade_label: "Hope · example pick", buy_url: "" },
    },
    {
      id: "example-powder",
      body: "Keeps the T-zone comfortable through a full day without flattening the glow.",
      routine: "Use a small puff and press rather than sweep over the base.",
      rating: null,
      example: true,
      profiles: { handle: "Example profile", tone_depth: 6, tone_value: 55, tone_hex: "#A07E56", undertone: "warm" },
      products: { brand: "Laura Mercier", name: "Translucent Loose Setting Powder", category: "other", shade_label: "Honey · example pick", buy_url: "" },
    },
    {
      id: "example-lip-oil",
      body: "A sheer berry layer makes an everyday face feel a little more like you.",
      routine: "Blot once, then add a second swipe if you want more color.",
      rating: null,
      example: true,
      profiles: { handle: "Example profile", tone_depth: 4, tone_value: 32, tone_hex: "#EADABA", undertone: "cool" },
      products: { brand: "NYX", name: "Fat Oil Lip Drip", category: "lip", shade_label: "That's Chic · example pick", buy_url: "" },
    },
    {
      id: "example-sunscreen",
      body: "Sits well under a sheer base and leaves no visible cast in this example routine.",
      routine: "Apply a generous amount, then give it a minute before makeup.",
      rating: null,
      example: true,
      profiles: { handle: "Example profile", tone_depth: 5, tone_value: 47, tone_hex: "#D7BD96", undertone: "neutral" },
      products: { brand: "Supergoop!", name: "Unseen Sunscreen SPF 40", category: "spf", shade_label: "Clear · example pick", buy_url: "" },
    },
  ];
  const config = window.NEU_SUPABASE_CONFIG || {};
  const hasSdk = Boolean(window.supabase && window.supabase.createClient);
  const hasConfig = Boolean(config.url && config.anonKey);
  const db = hasSdk && hasConfig
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;

  const state = {
    session: null,
    profile: readLocalProfile(),
    posts: [],
    saved: new Set(readLocalExampleSaves()),
    savedPosts: [],
    activeView: "feed",
    feedError: "",
    isLoading: false,
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function readLocalProfile() {
    try {
      const profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
      if (!profile || typeof profile.depth !== "number") return null;
      return profile;
    } catch {
      return null;
    }
  }

  function readLocalExampleSaves() {
    try {
      const saved = JSON.parse(localStorage.getItem(LOCAL_EXAMPLE_SAVES_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter((id) => EXAMPLE_POSTS.some((post) => post.id === id)) : [];
    } catch {
      return [];
    }
  }

  function storeLocalProfile(profile) {
    state.profile = profile;
    try {
      if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      else localStorage.removeItem(PROFILE_KEY);
    } catch {
      showToast("This browser could not save your tone profile.");
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);
  }

  function validColor(value) {
    return /^#[0-9a-f]{6}$/i.test(value || "") ? value : "#D7BD96";
  }

  function toneName(value) {
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    DEPTH_STOPS.forEach((stop, index) => {
      const nextDistance = Math.abs(stop - Number(value));
      if (nextDistance < distance) {
        nearest = index;
        distance = nextDistance;
      }
    });
    return DEPTH_NAMES[nearest];
  }

  function toneIndex(value) {
    return Math.max(1, DEPTH_STOPS.indexOf(
      DEPTH_STOPS.reduce((nearest, stop) =>
        Math.abs(stop - value) < Math.abs(nearest - value) ? stop : nearest,
      DEPTH_STOPS[0]),
    ) + 1);
  }

  function toneColor(value) {
    const depth = Number(value);
    let segment = 0;
    while (segment < DEPTH_STOPS.length - 2 && depth > DEPTH_STOPS[segment + 1]) {
      segment += 1;
    }
    const ratio = Math.max(
      0,
      Math.min(
        1,
        (depth - DEPTH_STOPS[segment]) /
          (DEPTH_STOPS[segment + 1] - DEPTH_STOPS[segment]),
      ),
    );
    const from = DEPTH_COLORS[segment].slice(1).match(/.{2}/g).map((n) => parseInt(n, 16));
    const to = DEPTH_COLORS[segment + 1].slice(1).match(/.{2}/g).map((n) => parseInt(n, 16));
    return `#${from.map((value, index) =>
      Math.round(value + (to[index] - value) * ratio).toString(16).padStart(2, "0"),
    ).join("")}`;
  }

  function asOne(value) {
    return Array.isArray(value) ? value[0] || {} : value || {};
  }

  function validBuyUrl(rawValue) {
    const value = String(rawValue || "").trim();
    if (!value) return "";
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.toString() : "";
    } catch {
      return "";
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function setMessage(element, text, type = "") {
    if (!element) return;
    element.textContent = text;
    element.className = `form-message${type ? ` ${type}` : ""}`;
  }

  function showSetupState() {
    const notice = $("#connection-notice");
    const ribbon = $("#setup-notice");
    if (!db) {
      if (notice) {
        notice.hidden = false;
        notice.innerHTML = "<strong>Community setup is not connected yet.</strong><span>Browse clearly labeled examples. Live member recommendations, account sign-in, posting, and synced saves are unavailable until Supabase is configured.</span>";
      }
      if (ribbon) ribbon.innerHTML = '<span class="ribbon-mark" aria-hidden="true">n</span><strong>Offline preview</strong><i aria-hidden="true"></i><span>Example content only. No member activity is shown.</span>';
    } else {
      if (notice) notice.hidden = true;
      if (ribbon) ribbon.innerHTML = '<span class="ribbon-mark" aria-hidden="true">n</span><strong>Neu community</strong><i aria-hidden="true"></i><span>Posts are shared by members. The example guide below is separate.</span>';
    }
  }

  function navigate(view) {
    if (!["feed", "share", "saved", "profile"].includes(view)) return;
    state.activeView = view;
    $$(".view-panel").forEach((panel) => {
      const active = panel.id === `view-${view}`;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });
    $$(".desktop-nav [data-view], .mobile-nav [data-view]").forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle("active", active);
      button.classList.toggle("nav-link-active", active);
      button.classList.toggle("mobile-nav-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    renderView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderView() {
    renderFeed();
    renderProfile();
    renderShareAccess();
    renderSaved();
  }

  function renderShareAccess() {
    const signedIn = Boolean(state.session?.user);
    const readyToPost = signedIn && Boolean(state.profile?.handle);
    $("#share-signed-out").hidden = signedIn;
    $("#post-form").hidden = !readyToPost;
    if (signedIn && !state.profile?.handle) {
      $("#share-signed-out").hidden = false;
      $("#share-signed-out").innerHTML =
        '<div><strong>One quick step before posting.</strong><p class="field-help">Choose a public handle and save your tone in your profile.</p></div><button class="button button-plum" type="button" data-profile-link>Set up profile</button>';
      $("[data-profile-link]")?.addEventListener("click", () => navigate("profile"));
    }
  }

  function renderProfile() {
    const form = $("#profile-form");
    if (!form) return;
    const depth = state.profile?.depth ?? Number($("#depth").value || 50);
    const undertone = state.profile?.undertone || "neutral";
    const handle = state.profile?.handle || "";
    $("#depth").value = String(depth);
    $("#profile-swatch").style.backgroundColor = toneColor(depth);
    $("#profile-portrait-tone").style.backgroundColor = toneColor(depth);
    $("#depth-name").textContent = toneName(depth);
    form.elements.namedItem("handle").value = handle;
    const selected = form.querySelector(`input[name="undertone"][value="${undertone}"]`);
    if (selected) selected.checked = true;

    const label = $("#account-label");
    const help = $("#account-help");
    const accountButton = $("#account-card [data-auth]");
    if (state.session?.user) {
      label.textContent = `Signed in as ${state.session.user.email || "member"}`;
      help.textContent = "Your email is for sign-in only. Your public handle and tone appear with your recommendations.";
      accountButton.textContent = "Sign out";
    } else {
      label.textContent = "Not signed in";
      help.textContent = "Your tone stays on this browser until you sign in. Sign in to post and sync saved finds.";
      accountButton.textContent = "Sign in";
    }
  }

  function renderFeed() {
    const list = $("#feed-list");
    if (!list) return;
    const search = ($("#search")?.value || "").trim().toLowerCase();
    const category = $(".filter-chip-active")?.dataset.category || "all";
    const similarOnly = Boolean($("#tone-filter")?.checked);
    const profile = state.profile;

    $("#tone-filter").disabled = !profile;
    $("#tone-hint").textContent = profile
      ? `Your tone: ${toneName(profile.depth)} · ${capitalize(profile.undertone)}. Similar means the same undertone and within one depth step.`
      : "Set your tone in You to filter by a similar undertone and nearby depth.";
    const sourcePosts = db ? state.posts : EXAMPLE_POSTS;
    const posts = sourcePosts.filter((post) => {
      const product = asOne(post.products);
      const author = asOne(post.profiles);
      const categoryMatch = category === "all" || product.category === category ||
        (category === "base" && product.category === "base");
      if (!categoryMatch) return false;
      if (search && !`${product.brand} ${product.name} ${product.shade_label} ${post.body}`.toLowerCase().includes(search)) return false;
      if (similarOnly && profile && (
        author.undertone !== profile.undertone ||
        Math.abs(Number(author.tone_depth) - toneIndex(profile.depth)) > 1
      )) return false;
      return true;
    });

    $("#example-notice").hidden = Boolean(db);
    if (db && state.isLoading) {
      list.innerHTML = '<div class="skeleton-card" aria-label="Loading member recommendations"></div><div class="skeleton-card" aria-hidden="true"></div><div class="skeleton-card" aria-hidden="true"></div>';
      return;
    }
    if (state.feedError) {
      list.innerHTML = emptyCard("Recommendations could not load.", "Check your connection and try again.", "Try again", "reload");
      $("[data-reload]", list)?.addEventListener("click", loadFeed);
      return;
    }
    if (!posts.length) {
      list.innerHTML = sourcePosts.length
        ? emptyCard("No finds match those filters.", "Try another category, change the search, or clear the tone filter.")
        : emptyCard("No recommendations yet.", "Member recommendations will appear here when someone shares a find.", "Share a find", "share");
      return;
    }
    list.innerHTML = posts.map(renderPost).join("");
  }

  function emptyCard(title, body, action, view) {
    const actionHtml = action
      ? `<button class="button button-plum" type="button" data-empty-action="${escapeHtml(view)}">${escapeHtml(action)}</button>`
      : "";
    return `<div class="empty-state"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p>${actionHtml}</div>`;
  }

  function renderPost(post) {
    const product = asOne(post.products);
    const author = asOne(post.profiles);
    const depth = Number(author.tone_depth);
    const color = validColor(author.tone_hex);
    const undertone = capitalize(author.undertone || "tone not set");
    const name = `${DEPTH_NAMES[Math.max(0, Math.min(9, depth - 1))] || "Tone not set"} · ${undertone}`;
    const handle = post.example ? "Example profile" : (author.handle ? `@${author.handle}` : "Neu member");
    const date = new Date(post.created_at);
    const dateText = Number.isNaN(date.getTime())
      ? ""
      : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
    const buyUrl = validBuyUrl(product.buy_url);
    const buyLink = buyUrl && !post.example
      ? `<a class="buy-link" href="${escapeHtml(buyUrl)}" target="_blank" rel="noopener noreferrer">Where to buy</a>`
      : "";
    const isSaved = state.saved.has(post.id);
    const saveLabel = isSaved ? "Remove saved find" : (post.example && !db ? "Save example" : "Save");
    const deleteButton = state.session?.user?.id === post.author_id
      ? `<button class="text-button" type="button" data-delete="${escapeHtml(post.id)}">Delete</button>`
      : "";
    const categoryClass = {
      blush: "blush",
      lip: "lip",
      eye: "eye",
      spf: "spf",
      other: "powder",
    }[product.category] || "tint";
    const categoryName = CATEGORY_NAMES[product.category] || "Product";
    const avatar = post.example ? "EX" : escapeHtml((author.handle || "N").slice(0, 2).toUpperCase());
    const exampleBadge = post.example
      ? '<span class="example-mark">EXAMPLE NOTE</span>'
      : '<span class="example-mark member-note-mark">MEMBER NOTE</span>';
    const routine = post.routine
      ? `<p class="routine-note">${escapeHtml(post.routine)}</p>`
      : "";
    const ratingText = !post.example && Number(post.rating) > 0
      ? `<span class="wear-note">${Math.max(1, Math.min(5, Number(post.rating)))} / 5 · buy again</span>`
      : '<span class="wear-note">SHADE NOTES, NOT SCORES</span>';
    const detailsLabel = post.example ? "Example details" : "Product details";
    return `
      <article class="recommendation-card">
        <div class="recommendation-topline">${exampleBadge}<span class="category-label">${escapeHtml(categoryName)}</span></div>
        <div class="recommendation-heading">
          <div class="member-mark">
            <span class="member-avatar" style="background:${color}" aria-hidden="true">${avatar}</span>
            <div><strong>${escapeHtml(handle)}</strong><span>${escapeHtml(name)}${dateText ? ` · ${escapeHtml(dateText)}` : ""}</span></div>
          </div>
          <button class="icon-button save-button${isSaved ? " is-saved" : ""}" type="button" data-save="${escapeHtml(post.id)}" aria-label="${escapeHtml(saveLabel)}" aria-pressed="${isSaved}" title="${escapeHtml(saveLabel)}"><span class="bookmark-mark${isSaved ? " is-saved" : ""}" aria-hidden="true"></span></button>
        </div>
        <div class="product-summary">
          <div class="product-art product-art-${categoryClass}" aria-hidden="true"><span class="art-orbit art-orbit-one"></span><span class="art-orbit art-orbit-two"></span><span class="art-pack art-pack-main"><span class="pack-cap"></span><span class="pack-mark">NEU</span></span><span class="art-pack art-pack-small"></span><span class="art-shade" style="background:${color}"></span></div>
          <div class="product-copy"><span class="product-brand">${escapeHtml(product.brand)}</span><h3>${escapeHtml(product.name)}</h3><p><strong>Shade:</strong> ${escapeHtml(product.shade_label || "Not listed")}</p></div>
        </div>
        <p class="post-note">${escapeHtml(post.body || "")}</p>
        ${routine}
        <div class="recommendation-footer">
          ${ratingText}
          <div class="post-actions">${buyLink}<button class="text-action" type="button" data-product="${escapeHtml(post.id)}">${detailsLabel}</button>${deleteButton}${post.example ? "" : `<button class="text-action" type="button" data-report="${escapeHtml(post.id)}">Report</button>`}</div>
          </div>
      </article>`;
  }

  function renderSaved() {
    const list = $("#saved-list");
    if (!list) return;
    const savedExampleNotice = $("#saved-example-notice");
    if (!state.session?.user) {
      if (!db) {
        const savedExamples = EXAMPLE_POSTS.filter((post) => state.saved.has(post.id));
        savedExampleNotice.hidden = savedExamples.length === 0;
        list.innerHTML = savedExamples.length
          ? savedExamples.map(renderPost).join("")
          : emptyCard("Your saved shelf is ready.", "Save an example product to keep a browser-only note here. Example saves are separate from member saves.");
      } else {
        savedExampleNotice.hidden = true;
        list.innerHTML = emptyCard(
          "Sign in to keep saved finds.",
          "Member saves are private to your account and can follow you between devices.",
          "Sign in",
          "auth",
        );
      }
      return;
    }
    savedExampleNotice.hidden = true;
    const savedPosts = state.savedPosts;
    if (!savedPosts.length) {
      list.innerHTML = emptyCard(
        "Nothing saved yet.",
        "Use Save on any recommendation and it will show up here.",
        "Browse the feed",
        "feed",
      );
      return;
    }
    list.innerHTML = savedPosts.map(renderPost).join("");
  }

  function capitalize(value) {
    const text = String(value || "");
    return text ? text[0].toUpperCase() + text.slice(1) : "";
  }

  function openAuth() {
    if (!db) {
      showToast("Sign-in setup is not connected yet.");
      return;
    }
    const dialog = $("#auth-dialog");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    $("#auth-form input[name='email']").focus();
  }

  function closeAuth() {
    const dialog = $("#auth-dialog");
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function openProductInfo(postId) {
    const post = db
      ? [...state.posts, ...state.savedPosts].find((item) => item.id === postId)
      : EXAMPLE_POSTS.find((item) => item.id === postId);
    if (!post) return;
    const product = asOne(post.products);
    $("#product-dialog-kicker").textContent = post.example ? "PRODUCT NOTE · EXAMPLE" : "MEMBER PRODUCT NOTE";
    $("#product-dialog-brand").textContent = product.brand || "Product";
    $("#product-dialog-title").textContent = product.name || "Product details";
    $("#product-dialog-shade").textContent = `Shade: ${product.shade_label || "Not listed"}`;
    $("#product-dialog-note").textContent = post.body || "No product note was provided.";
    $("#product-dialog-routine").textContent = post.routine || "No routine detail was provided.";
    $("#product-dialog-disclaimer").textContent = post.example
      ? "Example content only. No retailer link or member recommendation is attached."
      : "Member-submitted details. Product names and shade matches are personal experiences.";
    const dialog = $("#product-dialog");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeProductInfo() {
    const dialog = $("#product-dialog");
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function openReport(postId) {
    if (!state.session?.user) {
      openAuth();
      return;
    }
    if (!/^[0-9a-f-]{36}$/i.test(postId)) return;
    const dialog = $("#report-dialog");
    $("#report-form").elements.namedItem("postId").value = postId;
    setMessage($("#report-message"), "");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeReport() {
    const dialog = $("#report-dialog");
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  async function sendReport(event) {
    event.preventDefault();
    if (!db || !state.session?.user) {
      closeReport();
      openAuth();
      return;
    }
    const form = event.currentTarget;
    const values = new FormData(form);
    const postId = String(values.get("postId") || "");
    if (!/^[0-9a-f-]{36}$/i.test(postId)) return;
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    try {
      const { error } = await db.from("post_reports").insert({
        post_id: postId,
        reporter_id: state.session.user.id,
        reason: String(values.get("reason") || "other"),
        details: String(values.get("details") || "").trim() || null,
      });
      if (error?.code === "23505") {
        setMessage($("#report-message"), "You have already reported this recommendation.", "success");
      } else if (error) {
        throw error;
      } else {
        setMessage($("#report-message"), "Thanks. Your report was sent for review.", "success");
        window.setTimeout(closeReport, 900);
      }
    } catch {
      setMessage($("#report-message"), "The report could not be sent. Try again.", "error");
    } finally {
      button.disabled = false;
    }
  }

  async function loadSession() {
    if (!db) {
      showSetupState();
      renderView();
      return;
    }
    const { data, error } = await db.auth.getSession();
    if (error) {
      state.feedError = error.message;
      renderView();
      return;
    }
    state.session = data.session;
    await loadAccountProfile();
    await loadFeed();
    await loadSavedIds();
    renderView();
    db.auth.onAuthStateChange((_event, session) => {
      state.session = session;
      window.setTimeout(async () => {
        await loadAccountProfile();
        await loadSavedIds();
        await loadFeed();
        renderView();
      }, 0);
    });
  }

  async function loadAccountProfile() {
    if (!db || !state.session?.user) return;
    const { data, error } = await db
      .from("profiles")
      .select("handle,tone_depth,tone_value,tone_hex,undertone")
      .eq("id", state.session.user.id)
      .maybeSingle();
    if (error) {
      showToast("Could not load your profile.");
      return;
    }
    if (data) {
      storeLocalProfile({
        handle: data.handle || "",
        depth: Number(data.tone_value ?? (Number(data.tone_depth) - 1) * (100 / 9)),
        undertone: data.undertone || "neutral",
      });
    }
  }

  async function loadFeed() {
    if (!db) {
      renderFeed();
      return;
    }
    state.isLoading = true;
    state.feedError = "";
    renderFeed();
    const { data, error } = await db
      .from("posts")
      .select("id,author_id,body,rating,created_at,profiles(handle,tone_depth,tone_value,tone_hex,undertone),products(id,brand,name,category,shade_label,buy_url)")
      .order("created_at", { ascending: false })
      .limit(100);
    state.isLoading = false;
    if (error) {
      state.feedError = error.message;
      state.posts = [];
    } else {
      state.posts = data || [];
    }
    renderFeed();
    renderSaved();
  }

  async function loadSavedIds() {
    if (!db || !state.session?.user) {
      state.saved.clear();
      state.savedPosts = [];
      return;
    }
    const { data, error } = await db
      .from("saves")
      .select("post_id,posts(id,author_id,body,rating,created_at,profiles(handle,tone_depth,tone_value,tone_hex,undertone),products(id,brand,name,category,shade_label,buy_url))")
      .eq("user_id", state.session.user.id);
    if (error) {
      showToast("Could not load saved finds.");
      return;
    }
    state.saved = new Set((data || []).map((item) => item.post_id));
    state.savedPosts = (data || []).map((item) => asOne(item.posts)).filter((post) => post.id);
  }

  async function syncProfile(profile) {
    if (!db || !state.session?.user) return;
    const { error } = await db.from("profiles").upsert({
      id: state.session.user.id,
      handle: profile.handle || null,
      tone_depth: toneIndex(profile.depth),
      tone_value: Number(profile.depth),
      tone_hex: toneColor(profile.depth),
      undertone: profile.undertone,
    });
    if (error) throw error;
  }

  async function saveProfile(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const handle = String(data.get("handle") || "").trim().replace(/^@/, "");
    if (handle && !/^[A-Za-z0-9_]{3,24}$/.test(handle)) {
      setMessage($("#profile-message"), "Use 3 to 24 letters, numbers, or underscores for your handle.", "error");
      return;
    }
    const depth = Number(data.get("depth"));
    const profile = {
      handle,
      depth,
      undertone: String(data.get("undertone") || "neutral"),
    };
    storeLocalProfile(profile);

    if (state.session?.user && db) {
      try {
        await syncProfile(profile);
      } catch {
        setMessage($("#profile-message"), "Your browser saved this profile, but it could not sync. Check your handle and try again.", "error");
        return;
      }
    }
    setMessage(
      $("#profile-message"),
      state.session?.user ? "Your tone profile is saved." : "Saved on this browser. Sign in to sync it and share posts.",
      "success",
    );
    renderView();
  }

  async function sendSignInLink(event) {
    event.preventDefault();
    if (!db) return;
    const form = event.currentTarget;
    const button = form.querySelector("button[type='submit']");
    const message = $("#auth-message");
    const email = String(new FormData(form).get("email") || "").trim();
    button.disabled = true;
    button.textContent = "Sending…";
    setMessage(message, "");
    try {
      const { error } = await db.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.href.split("#")[0] },
      });
      if (error) throw error;
      setMessage(message, "Check your inbox for your sign-in link.", "success");
    } catch {
      setMessage(message, "The link could not be sent. Check the email and try again.", "error");
    } finally {
      button.disabled = false;
      button.textContent = "Email me a sign-in link";
    }
  }

  async function findOrCreateProduct(values) {
    const productFields = {
      brand: values.brand,
      name: values.product,
      category: values.category,
      shade_label: values.shade,
      buy_url: values.buyUrl || null,
      created_by: state.session.user.id,
    };
    const { data: existing, error: lookupError } = await db
      .from("products")
      .select("id")
      .eq("brand", productFields.brand)
      .eq("name", productFields.name)
      .eq("shade_label", productFields.shade_label)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return existing.id;

    const { data, error } = await db
      .from("products")
      .insert(productFields)
      .select("id")
      .single();
    if (!error && data) return data.id;
    if (error?.code === "23505") {
      const { data: duplicate, error: duplicateError } = await db
        .from("products")
        .select("id")
        .eq("brand", productFields.brand)
        .eq("name", productFields.name)
        .eq("shade_label", productFields.shade_label)
        .single();
      if (duplicateError) throw duplicateError;
      return duplicate.id;
    }
    throw error || new Error("Product could not be saved.");
  }

  async function submitPost(event) {
    event.preventDefault();
    if (!state.session?.user) {
      openAuth();
      return;
    }
    if (!state.profile?.handle) {
      showToast("Set a public handle and tone before posting.");
      navigate("profile");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    const message = $("#post-message");
    const button = form.querySelector("button[type='submit']");
    const buyUrlInput = String(data.get("buyUrl") || "").trim();
    const buyUrl = validBuyUrl(buyUrlInput);
    if (buyUrlInput && !buyUrl) {
      setMessage(message, "Use a valid https link for the product page.", "error");
      return;
    }
    const values = {
      brand: String(data.get("brand") || "").trim(),
      product: String(data.get("product") || "").trim(),
      category: String(data.get("category") || "other"),
      shade: String(data.get("shade") || "").trim(),
      buyUrl,
      body: String(data.get("note") || "").trim(),
      rating: Number(data.get("rating")),
    };
    if (!values.brand || !values.product || !values.shade || !values.body || values.rating < 1 || values.rating > 5) {
      setMessage(message, "Add the product, shade, note, and buy-again rating.", "error");
      return;
    }
    button.disabled = true;
    button.textContent = "Posting…";
    setMessage(message, "");
    try {
      await syncProfile(state.profile);
      const productId = await findOrCreateProduct(values);
      const { error } = await db.from("posts").insert({
        author_id: state.session.user.id,
        product_id: productId,
        body: values.body,
        rating: values.rating,
      });
      if (error) throw error;
      form.reset();
      setMessage(message, "Your recommendation is posted.", "success");
      await loadFeed();
      navigate("feed");
      showToast("Recommendation posted.");
    } catch (error) {
      setMessage(message, "Your post could not be saved. Check your connection and try again.", "error");
      console.error("Post submission failed", error?.code || "unknown");
    } finally {
      button.disabled = false;
      button.textContent = "Post recommendation";
    }
  }

  async function toggleSaved(postId) {
    if (!db && EXAMPLE_POSTS.some((post) => post.id === postId)) {
      if (state.saved.has(postId)) state.saved.delete(postId);
      else state.saved.add(postId);
      try {
        localStorage.setItem(LOCAL_EXAMPLE_SAVES_KEY, JSON.stringify([...state.saved]));
      } catch {
        showToast("This browser could not keep the example save.");
      }
      renderView();
      showToast(state.saved.has(postId) ? "Example saved on this browser." : "Example removed from this browser.");
      return;
    }
    if (!db || !state.session?.user) {
      openAuth();
      return;
    }
    if (!/^[0-9a-f-]{36}$/i.test(postId)) return;
    if (!state.profile) {
      navigate("profile");
      showToast("Set your tone profile before saving finds.");
      return;
    }
    try {
      await syncProfile(state.profile);
    } catch {
      showToast("Save your tone profile before keeping this find.");
      navigate("profile");
      return;
    }
    if (state.saved.has(postId)) {
      const { error } = await db
        .from("saves")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", state.session.user.id);
      if (error) {
        showToast("Could not remove this find.");
        return;
      }
      state.saved.delete(postId);
      state.savedPosts = state.savedPosts.filter((post) => post.id !== postId);
    } else {
      const { error } = await db.from("saves").insert({
        post_id: postId,
        user_id: state.session.user.id,
      });
      if (error && error.code !== "23505") {
        showToast("Could not save this find.");
        return;
      }
      state.saved.add(postId);
      const savedPost = state.posts.find((post) => post.id === postId);
      if (savedPost) state.savedPosts.push(savedPost);
    }
    renderView();
  }

  async function deletePost(postId) {
    if (!db || !state.session?.user || !/^[0-9a-f-]{36}$/i.test(postId)) return;
    if (!window.confirm("Delete your recommendation? This cannot be undone.")) return;
    const { error } = await db
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("author_id", state.session.user.id);
    if (error) {
      showToast("Could not delete this recommendation.");
      return;
    }
    state.posts = state.posts.filter((post) => post.id !== postId);
    state.saved.delete(postId);
    state.savedPosts = state.savedPosts.filter((post) => post.id !== postId);
    renderView();
    showToast("Recommendation deleted.");
  }

  async function signOut() {
    if (!db || !state.session?.user) return;
    const { error } = await db.auth.signOut();
    if (error) {
      showToast("Could not sign out. Try again.");
      return;
    }
    state.session = null;
    state.saved.clear();
    renderView();
    showToast("You are signed out.");
  }

  function wireEvents() {
    $$("[data-view]").forEach((button) => {
      button.addEventListener("click", () => navigate(button.dataset.view));
    });
    $$("[data-auth]").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.session?.user) signOut();
        else openAuth();
      });
    });
    $("[data-close-auth]").addEventListener("click", closeAuth);
    $$("[data-close-product]").forEach((button) => button.addEventListener("click", closeProductInfo));
    $("#auth-dialog").addEventListener("click", (event) => {
      if (event.target === $("#auth-dialog")) closeAuth();
    });
    $("#auth-form").addEventListener("submit", sendSignInLink);
    $("#profile-form").addEventListener("submit", saveProfile);
    $("#post-form").addEventListener("submit", submitPost);
    $("#report-form").addEventListener("submit", sendReport);
    $("[data-close-report]").addEventListener("click", closeReport);
    $("#search").addEventListener("input", renderFeed);
    $("#tone-filter").addEventListener("change", renderFeed);
    $$(".filter-chip").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".filter-chip").forEach((chip) => {
          const selected = chip === button;
          chip.classList.toggle("filter-chip-active", selected);
          chip.setAttribute("aria-pressed", String(selected));
        });
        renderFeed();
      });
    });
    ["feed-list", "saved-list"].forEach((id) => {
      $(`#${id}`).addEventListener("click", (event) => {
        const saveButton = event.target.closest("[data-save]");
        if (saveButton) toggleSaved(saveButton.dataset.save);
        const productButton = event.target.closest("[data-product]");
        if (productButton) openProductInfo(productButton.dataset.product);
        const reportButton = event.target.closest("[data-report]");
        if (reportButton) openReport(reportButton.dataset.report);
        const deleteButton = event.target.closest("[data-delete]");
        if (deleteButton) deletePost(deleteButton.dataset.delete);
        const emptyAction = event.target.closest("[data-empty-action]");
        if (!emptyAction) return;
        if (emptyAction.dataset.emptyAction === "reload") loadFeed();
        else if (emptyAction.dataset.emptyAction === "profile") navigate("profile");
        else if (emptyAction.dataset.emptyAction === "auth") openAuth();
        else navigate(emptyAction.dataset.emptyAction);
      });
    });
    $("#depth").addEventListener("input", (event) => {
      const depth = Number(event.currentTarget.value);
      $("#profile-swatch").style.backgroundColor = toneColor(depth);
      $("#depth-name").textContent = toneName(depth);
    });
  }

  showSetupState();
  wireEvents();
  renderView();
  loadSession();
})();
