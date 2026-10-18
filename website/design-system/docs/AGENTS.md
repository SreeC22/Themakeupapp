# Neu Design System

Use this package for Neu website UI. It is a real workspace dependency,
`@workspace/neu-design-system`, not a set of files to copy into each app.

## Source of truth

- `tokens.json`: DTCG color, font, spacing and radius values.
- `scripts/build-tokens.mjs`: generates `src/index.css`,
  `src/generated/tokens.tsx` and `public/favicon.svg`. Never edit these outputs.
- `src/components/neu/`: Button, Typeahead, Choice, ToneSwatch and Navigation.
- `src/components/neu.css`: the shared source-backed controls and quiz pattern.
- `src/preview/demos/neu.tsx`: live stories for all five public families.
- `src/preview/neu-foundations.tsx`: the overview, colors, typography and layout.
- `src/preview/registry.tsx`: grouped navigation and lazy family stories.
- `docs/neu-source-inventory.md`: source evidence and product rules.
- `docs/references/`: owner-supplied visual reference and source manifest.

The preview browser retains Input and ScrollArea as internal support controls.
Unused stock components and stories were removed. They are not a second Neu
component catalog.

## Public imports

```tsx
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { Typeahead } from "@workspace/neu-design-system/components/neu/typeahead";
import { Choice } from "@workspace/neu-design-system/components/neu/choice";
import { ToneSwatch } from "@workspace/neu-design-system/components/neu/tone-swatch";
import { Navigation } from "@workspace/neu-design-system/components/neu/navigation";
```

Import `@workspace/neu-design-system/styles.css` once from the consuming app's
CSS. The component modules load their shared control styling. The optional
`./guide` export supplies the same live foundations used in the website guide.
Portable hex tokens are exported from `.` and `./tokens`.

React web components are provided. Native components are not provided; future
native consumers should use the exported tokens and document native differences.

## Maintaining the system

- Edit tokens, then run `pnpm tokens`. Keep generated outputs committed.
- Use primary, secondary and accent as the core palette roles, in that order.
- Light mode is approved source material; dark mode is derived reference only.
- Product data, routing, quiz draft state and inference do not belong here.
- Do not copy provided primitives into consuming apps.
- Update a component's story and inventory when its API or states change.
- Keep one primary action, readable text, 44px targets and visible focus.
- Never replace typed brand entry with a fixed brand select.
- Keep uncertainty optional, with no longer mandatory question path.
- No emojis or em dashes in Neu content.

Read `docs/consuming-web.md` before web use and `docs/migrating-web.md` before
replacing a local implementation. See the source inventory before expanding
beyond this five-family pilot.

Keep this package self-contained: concrete dependency versions, standalone
TypeScript configuration and no imports from sibling artifacts. A saved system
must work as one independent directory.
