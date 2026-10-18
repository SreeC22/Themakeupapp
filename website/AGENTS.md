# Website contributor rules

- This directory is the current website. The Expo app in `../app/` is preserved separately.
- Follow the approved cream, mauve and plum design system in `design-system/`. Earlier root documents describe an older landing page and do not override this website's approved direction.
- Keep four quiz sections and one combined outcome. Do not turn uncertainty into more mandatory questions.
- Brand entry is typed autocomplete with manual entry, not a select menu.
- Keep the mobile hero image embedded in normal document flow.
- Keep public learning and guest browsing available without a quiz or account.
- Use shared Neu controls and tokens. Preserve visible focus, reduced motion and at least 44px targets.
- Label illustrative examples. Do not claim verified matches, cloud saves, real accounts or shared posts until implemented.
- No credentials, generated builds, dependency directories, emojis or decorative em dashes in new copy.
- Run `pnpm typecheck` and `pnpm build` from this directory before committing functional changes.
- Preserve the existing app, its assets, root `index.html`, SQL scripts and historical references. Native parity tests depend on the root legacy quiz.
