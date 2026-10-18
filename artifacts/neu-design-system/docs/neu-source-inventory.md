# Neu component pilot

## Sources

The approved Neu website, the compact mobile quiz reference supplied by the owner, and the existing interactive quiz implementation define this system. This is a source-backed system, not a new visual direction.

Light colors and fonts reproduce the approved brand. Dark colors are derived for the style-guide preview only; the website remains light.

## Pilot inventory

These five families are implemented in this first pilot:

1. Button: primary, secondary and text, including disabled and keyboard-focus states.
2. Typeahead: typed text, filtered suggestions, manual entry, keyboard selection and dismissal.
3. Choice: labeled single or multi-select presentation with a visible selected state.
4. ToneSwatch: labeled color selection, check mark, keyboard operation and 44px target.
5. Navigation: Back, optional secondary action and one primary Continue action.

The Typeahead, Choice and Navigation behavior is ported from the actual quiz source. Button and ToneSwatch extract the native-button patterns already used there. Product data, questionnaire state and matching logic do not belong in this package.

## Source references

- `artifacts/mockup-sandbox/src/components/mockups/neu-website-journey/QuizFlow.tsx`
- `artifacts/mockup-sandbox/src/components/mockups/neu-website-journey/websitejourney.css`
- `artifacts/neu-website/src/index.css`
- `docs/references/quiz-mobile-reference.png`

The scaffold's stock components support the preview browser but are not advertised as part of the Neu pilot catalog. Review the pilot before expanding its public component inventory.

## Rules

- Cream background, deep-plum actions and mauve emphasis. Berry is a minor accent.
- Use Cormorant Garamond for headlines and DM Sans for reading and controls.
- Space Mono is restricted to short utility labels.
- One primary question, concise help, no repeated questionnaires or results pages.
- At least 44px interactive targets, visible keyboard focus and text labels alongside colors.
- Typed brand entry, not a fixed brand select menu.
- Uncertainty must not produce a longer mandatory journey.
- Product examples and wearer-entered shades must never be presented as verified matches.
- No emojis or em dashes in Neu copy.
