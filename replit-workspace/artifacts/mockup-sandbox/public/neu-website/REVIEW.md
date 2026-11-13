# Neu website review copy

This folder contains the real static GitHub Pages website, not the React Canvas
simulation. It is served by the existing Canvas development server at
`/__mockup/neu-website/community.html`. Start at `index.html` for the original
landing page, tone quiz, and waitlist.

The corresponding repository is `sreec22/Themakeupapp`, on branch
`feature/approved-community-flow`. No merge or deployment is authorized.
The uploaded branch is available as a draft review:
https://github.com/SreeC22/Themakeupapp/pull/2
The site's files retain relative URLs so they also work at the GitHub Pages
repository prefix.

## Scope and safety

- Feed, Share, Saved, and You use the approved community visual direction.
- The original landing quiz and waitlist JavaScript is unchanged.
- With empty Supabase settings, cards are labeled examples. Example saves are
  local to this browser and are not member saves.
- Real sign-in, posting, and synced saves remain unavailable until connected.
- No face-photo upload or camera access is requested.
- The public tone guide explains depth, undertones, and color theory.

Real accounts, shared recommendations, and multi-account privacy checks belong
to the separately planned connection work. See `WEB_MVP_SETUP.md`.

## Validate and transfer

Run `node scripts/validate-neu-website.mjs` from the workspace root.
The check protects the complete original quiz/waitlist script and checks
JavaScript syntax, local links, IDs, navigation, and example/privacy constraints.

Review checkouts live under `.local/conversation-workspace/files/` and are
ignored by this workspace's Git. Their nested Git metadata may not survive
session changes; verify the checkout root before committing or recreate it
from the remote branch. This tracked copy preserves the website for subsequent
tasks. Keep its `index.html`, `community.html`,
`community.css`, `community.js`, and `community-config.js` identical to the
review branch when making changes. The SQL files are setup references, not
changes that have been applied to a database.
