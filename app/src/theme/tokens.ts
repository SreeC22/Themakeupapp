// Neu design tokens, ported from "Neu Design System/tokens/*.css".
// That folder is the source of truth; edit there first, mirror here.

export const light = {
  paper: '#FFFFFF',
  paperSink: '#F6F4F9',
  surface: '#FFFFFF',
  surface2: '#FAF8FC',
  line: '#ECEAF1',
  lineStrong: '#DBD6E4',

  ink: '#2E2440',
  ink2: '#655A7C',
  ink3: '#A99CC0',
  inkInv: '#FFFFFF',

  amethyst: '#7C6A99',
  amethystDeep: '#4E4562',
  amethystSoft: '#EEE9F4',
  lilac: '#AB92BF',
  lilacSoft: '#F1EBF6',
  berry: '#C75C86',
  berryDeep: '#9E3A62',
  berrySoft: '#F7E3EC',
  gold: '#C08552',
  goldSoft: '#F3E6D9',

  action: '#7C6A99',
  actionPress: '#4E4562',
  actionText: '#FFFFFF',
};

export const dark: typeof light = {
  paper: '#000000',
  paperSink: '#0C0A10',
  surface: '#141019',
  surface2: '#1E1926',
  line: '#2A2434',
  lineStrong: '#3B3348',

  ink: '#F1EDF6',
  ink2: '#B6ACC6',
  ink3: '#726A82',
  inkInv: '#141019',

  amethyst: '#B79ED6',
  amethystDeep: '#D3C2E8',
  amethystSoft: '#251E30',
  lilac: '#C4AEDA',
  lilacSoft: '#221B2C',
  berry: '#E58AAC',
  berryDeep: '#F0AEC6',
  berrySoft: '#2E1922',
  gold: '#E0AC72',
  goldSoft: '#2C2214',

  action: '#B79ED6',
  actionPress: '#A98BCC',
  actionText: '#1B1425',
};

export type Palette = typeof light;

// Monk Skin Tone Scale: fixed across modes, never themed.
export const mst = [
  '#F6EDE4', '#F3E7DB', '#F7EAD0', '#EADABA', '#D7BD96',
  '#A07E56', '#825C43', '#604134', '#3A312A', '#292420',
] as const;

// Undertone chips: fixed across modes.
export const toneHues = {
  warm: '#E6A867',
  cool: '#D298A6',
  neutral: '#D0BEA2',
  olive: '#9B9C6E',
} as const;

// Wrist-vein cues for the quiz (classic wrist test).
export const veinHues = {
  warm: '#6F9E88',
  cool: '#A98CC6',
  neutral: '#4F9E9A',
  olive: '#8A9A6B',
} as const;

export const type = {
  display: 52,
  h1: 36,
  h2: 27,
  h3: 21,
  title: 17,
  body: 16,
  sm: 14,
  cap: 13,
  micro: 11,
} as const;

export const font = {
  // Poppins substitutes for Circular Corner until licensed (DS readme).
  display: 'Poppins_500Medium',
  body: 'Poppins_400Regular',
  semi: 'Poppins_600SemiBold',
  mono: 'SpaceMono_400Regular',
} as const;

export const space = [0, 4, 8, 12, 16, 20, 24, 32, 40, 56, 72] as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

// Low, soft, warm-tinted elevation (single-shadow RN approximations).
export const shadow = {
  sm: {
    shadowColor: '#2A1F18',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  md: {
    shadowColor: '#2A1F18',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  lg: {
    shadowColor: '#2A1F18',
    shadowOpacity: 0.12,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
} as const;
