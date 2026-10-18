# Migrating web UI to Neu

Read `AGENTS.md` and `consuming-web.md` first.

## Theme

Import `@workspace/neu-design-system/styles.css` instead of a separate Tailwind
theme. Remove duplicate color, font, spacing and radius definitions. Existing
app-specific names may alias package variables, but must not redefine their values.
Keep product layouts and product data in the application.

## Components

The supported public families live at `components/neu/`:

- `button`: primary, secondary and text actions.
- `typeahead`: text entry with keyboard suggestions and manual input.
- `choice`: labeled pressed/unpressed choices.
- `tone-swatch`: accessible labeled color selection.
- `navigation`: Back, optional secondary action and one primary action.

Check each API before replacing a local module. These are not drop-in shadcn
modules. Do not rewrite imports to nonexistent `components/ui/` families.
Input and ScrollArea are internal preview-browser support controls.

Replace a local implementation only after its required states are represented
in the package and all callers are updated. Delete superseded copies, not
unrelated product components. Do not remove an existing data store while
changing the visual system.

## Verification

Render one packaged primitive, typecheck and run the consumer before broader
migration. Afterward, check keyboard selection, selected/disabled states,
focus, small-screen layout and the relevant product journey. Native components
are not part of this React web pilot.
