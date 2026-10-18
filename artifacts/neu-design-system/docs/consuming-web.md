# Consuming Neu Design System in web apps

Read `artifacts/neu-design-system/docs/AGENTS.md` first. This guide covers
React/Vite and other shadcn/Tailwind web consumers. If the app already contains
a local theme or component library, also read
`artifacts/neu-design-system/docs/migrating-web.md` before writing UI.

## Theme

Import this package's theme once from the app's main CSS:

```css
@import "@workspace/neu-design-system/styles.css";
```

`styles.css` already imports Tailwind, its plugins, and this package's token
theme. It also registers this package's component sources. Do not add a separate
Tailwind import or a `node_modules` source path in a Tailwind v4 consumer.
Tailwind v3 consumers keep their existing `@tailwind` directives and add
`node_modules/@workspace/neu-design-system/src/components` to `content`.

## Components and helpers

Import every provided primitive, `cn`, and toast API directly from this package:

```tsx
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { cn } from "@workspace/neu-design-system/lib/utils";
```

Use the package component whenever it provides the required family. Keep
product-specific compositions in the app, but compose them from package
primitives rather than recreating those primitives locally.

There is no packaged toast or native component family in the Neu pilot.

## Verify

After wiring the workspace dependency, import and render
`@workspace/neu-design-system/components/neu/button`. Run the app's typecheck
and dev server. The import must resolve and the Button must use this package's
theme before broader UI work begins.

## Ongoing rules

- Keep one source of theme variables.
- Import the Neu pilot primitives from `components/neu/`: button, typeahead, choice, tone-swatch and navigation. The `components/ui/` scaffold supports the documentation browser and is not the Neu public component catalog.
- Import package-provided primitives and helpers from the package path.
- Add reusable product-agnostic components to this package first.
- For a non-shadcn app, use the tokens as the source of truth and adapt existing
  components to the token CSS variables without copying token values.
