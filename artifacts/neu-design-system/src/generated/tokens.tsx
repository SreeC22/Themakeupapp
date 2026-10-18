/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#FBF7F2",
      "foreground": "#322B34",
      "border": "#D9CBD0",
      "card": "#FFFAF6",
      "cardForeground": "#322B34",
      "popover": "#FFFAF6",
      "popoverForeground": "#322B34",
      "primary": "#514659",
      "primaryForeground": "#FFFAF6",
      "secondary": "#F3ECEB",
      "secondaryForeground": "#514659",
      "muted": "#EEE8ED",
      "mutedForeground": "#62575F",
      "accent": "#786B88",
      "accentForeground": "#FFFFFF",
      "destructive": "#854B46",
      "destructiveForeground": "#FFFFFF",
      "input": "#D9CBD0",
      "ring": "#786B88",
      "chart1": "#B85F78",
      "chart2": "#786B88",
      "chart3": "#514659",
      "chart4": "#A17B72",
      "chart5": "#807E64",
      "sidebar": "#F3ECEB",
      "sidebarForeground": "#322B34",
      "sidebarBorder": "#D9CBD0",
      "sidebarPrimary": "#514659",
      "sidebarPrimaryForeground": "#FFFAF6",
      "sidebarAccent": "#EEE8ED",
      "sidebarAccentForeground": "#514659",
      "sidebarRing": "#786B88"
    },
    "dark": {
      "background": "#252028",
      "foreground": "#FBF7F2",
      "border": "#665A6B",
      "card": "#322B34",
      "cardForeground": "#FBF7F2",
      "popover": "#322B34",
      "popoverForeground": "#FBF7F2",
      "primary": "#DFCDDD",
      "primaryForeground": "#322B34",
      "secondary": "#403744",
      "secondaryForeground": "#FBF7F2",
      "muted": "#403744",
      "mutedForeground": "#D3C5CE",
      "accent": "#BDABCD",
      "accentForeground": "#252028",
      "destructive": "#E8ADA8",
      "destructiveForeground": "#322B34",
      "input": "#796C80",
      "ring": "#BDABCD",
      "chart1": "#E3A3B6",
      "chart2": "#BDABCD",
      "chart3": "#DFCDDD",
      "chart4": "#D2A79C",
      "chart5": "#B9B997",
      "sidebar": "#322B34",
      "sidebarForeground": "#FBF7F2",
      "sidebarBorder": "#665A6B",
      "sidebarPrimary": "#DFCDDD",
      "sidebarPrimaryForeground": "#322B34",
      "sidebarAccent": "#403744",
      "sidebarAccentForeground": "#FBF7F2",
      "sidebarRing": "#BDABCD"
    }
  },
  "fontFamily": {
    "sans": [
      "DM Sans",
      "sans-serif"
    ],
    "serif": [
      "Cormorant Garamond",
      "Georgia",
      "serif"
    ],
    "mono": [
      "Space Mono",
      "monospace"
    ]
  },
  "radius": "0.5rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
