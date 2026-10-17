# Neu web community setup

`community.html` is the browser-first community page. It supports a public recommendation feed, tone filtering, email sign-in, member posts, private saved finds, and report submission. It is text-only for the first beta. Contributors add the product, exact shade, a short note, and a buy-again rating. Face photos are not requested or stored.

## Connect the shared feed

1. Create a Supabase project.
2. Run `SCHEMA.sql`, then `WEB_MVP_SCHEMA.sql`, in the Supabase SQL editor.
3. Put the project URL and its browser-safe publishable/anon key in `community-config.js`. This key is visible to website visitors by design. Never use a `service_role` key in browser code.
4. In Supabase Auth, set the site URL to the GitHub Pages site and add this redirect URL: `https://sreec22.github.io/Themakeupapp/community.html`.
5. Open `community.html`, create two test accounts, and verify that visitors can read posts, one member cannot edit another member's post, saves are private, and a reported post appears in `post_reports`.
6. Keep the site in a small beta until the owner has reviewed the privacy and community-guideline copy and confirmed moderation access.

The public profile contains a handle and tone only. Email addresses remain in Supabase Auth. Posts and product details are public. Saves and reports are visible only to their owner through the website.

## Local preview

Open `community.html` from a static server. If Supabase is not configured, the page displays an honest setup notice and clearly labeled example product cards. Example cards are not member posts. Browser-only example saves are identified separately and are not member saves. Sign-in, posting, live recommendations, and synced saves do not report success until the shared service is configured.
