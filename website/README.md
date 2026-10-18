# Neu website

The active browser-first frontend. The mobile homepage embeds the approved makeup textures into the page. The quiz has four question sections and one editable outcome, typed brand suggestions, forty depth swatches, optional undertone and olive choices, and public learning content.

## Source map

| Path | Purpose |
| --- | --- |
| `site/` | React website. Routes and session draft are in `src/App.tsx`; the shorter quiz is in `src/features/quiz/`. |
| `design-system/` | Shared tokens, five Neu component families and an interactive documentation browser. |
| `design-system/tokens.json` | Color, typography, spacing and radius source. |
| `design-system/docs/` | Component APIs, consumption guidance and visual references. |
| `VERIFICATION.md` | Frontend test coverage and known limitations from the Replit delivery. |

The website imports the design-system workspace package directly. Do not create independent page palettes or edit generated token outputs.

## Run

Use Node.js 22.12 or newer and pnpm 10. From this directory:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The website runs on port 5173 by default. Run `pnpm design-system` in another terminal for the component browser on port 5174. `PORT` overrides either default; `BASE_PATH` defaults to `/` and must start and end with `/`.

```sh
pnpm typecheck
pnpm build
pnpm preview
```

The website output is `site/dist/public/`; the optional design-system documentation output is `design-system/dist/public/`. Each is a separate static SPA. Configure the host to serve its `index.html` for direct route requests such as `/quiz` and `/learn`.

For a subdirectory build:

```sh
BASE_PATH=/Themakeupapp/ pnpm build
```

These sources have portable Vite configurations and no dependency on Replit's API client or development plugins. They are a source port of the approved Replit website, not a deployment of it. No build output or credentials belong in Git.

## Release boundary

This is a frontend preview, not a live community beta:

- Quiz answers survive in-app navigation, not refresh or another device.
- Products and community examples are illustrative, not verified matches or real member posts.
- Real accounts, persistent saves, shared posts, moderation and database permissions remain unfinished.
- Public education is available without completing a quiz or signing in.

The existing Expo app and root static pages are preserved. Their older quiz, palette and storage behavior are not silently migrated into this website. The root static pages remain where they are because the native app's parity checks depend on `index.html`.

Supabase setup documents at repository root describe the older community implementation. Do not assume that applying those scripts alone connects this React website. Review the owner's existing schema, row-level security and callback settings before implementing real member features. Never put service-role keys or admin credentials in browser code.

## Review and publish

Pushing this source does not publish the React build. Do not switch the live host, run database migrations or advertise community posting until the owner approves the release and its remaining backend work is verified.
