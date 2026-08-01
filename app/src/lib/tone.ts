// Tone quiz logic, ported line for line from index.html (the live site).
// House rule 6: identical results to the site for identical inputs.
// scripts/parity.mjs proves it against the site source on every run.

export const ANCHORS = [
  '#F6EDE4', '#F3E7DB', '#F7EAD0', '#EADABA', '#D7BD96',
  '#A07E56', '#825C43', '#604134', '#3A312A', '#292420',
] as const;

export const DEPTH_NAMES = [
  'Porcelain 1', 'Fair 2', 'Light 3', 'Medium 4', 'Tan 5',
  'Bronze 6', 'Deep 7', 'Deep 8', 'Rich 9', 'Rich 10',
] as const;

// Track position of each anchor. Non-linear so brown midtones get track
// room; must match the site's CSS gradient stops (house rule 5).
export const STOPS = [0, 7, 14, 22, 32, 47, 62, 78, 90, 100] as const;

export const SHADE_COUNT = 40;
export const shadeValues: number[] = Array.from(
  { length: SHADE_COUNT },
  (_, i) => (i / (SHADE_COUNT - 1)) * 100,
);

export function hexLerp(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const c = (x: number, y: number) =>
    Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

function depthSegment(v: number): { i: number; t: number } {
  let i = 0;
  while (i < STOPS.length - 2 && v > STOPS[i + 1]) i++;
  return { i, t: (v - STOPS[i]) / (STOPS[i + 1] - STOPS[i]) };
}

export function depthColor(v: number): string {
  const { i, t } = depthSegment(v);
  return hexLerp(ANCHORS[i], ANCHORS[i + 1], Math.min(1, Math.max(0, t)));
}

export function depthName(v: number): string {
  const { i, t } = depthSegment(v);
  return DEPTH_NAMES[t < 0.5 ? i : i + 1];
}

export type Undertone = 'warm' | 'cool' | 'neutral' | 'olive';
export type VeinAnswer = 'warm' | 'cool' | 'neutral' | 'olive';
export type SunAnswer = 'warm' | 'cool' | 'neutral';
export type JewelAnswer = 'warm' | 'cool' | 'neutral';

export interface Signals {
  vein?: VeinAnswer;
  sun?: SunAnswer;
  jewel?: JewelAnswer;
}

export const UT: Record<Undertone, string> = {
  warm: 'Warm',
  cool: 'Cool',
  neutral: 'Neutral',
  olive: 'Olive',
};

export const SIGNAL_WORDS = {
  vein: {
    warm: 'green veins',
    cool: 'blue-purple veins',
    neutral: 'mixed veins',
    olive: 'a gray-green cast',
  },
  sun: { warm: 'you tan easily', cool: 'you burn first', neutral: 'you burn then tan' },
  jewel: { warm: 'gold suits you', cool: 'silver suits you', neutral: 'both metals work' },
} as const;

// Exact port of the site's deriveUndertone (index.html:488).
export function deriveUndertone(signals: Signals): Undertone {
  if (signals.vein === 'olive') return 'olive';
  const vals = Object.values(signals);
  const warm = vals.filter((v) => v === 'warm').length;
  const cool = vals.filter((v) => v === 'cool').length;
  return warm > cool ? 'warm' : cool > warm ? 'cool' : 'neutral';
}

// Neutral-confirm, app-side hardening locked in APP_PLAN.md: when the
// signals derive neutral without the olive vein answer, one more check.
// Yes = olive; no or unsure = neutral with the override elevated.
// The site ships this separately with owner approval; the base
// deriveUndertone above stays byte-identical to the site until then.
export type NeutralConfirm = 'yes' | 'no' | 'unsure';

export function needsNeutralConfirm(signals: Signals): boolean {
  return deriveUndertone(signals) === 'neutral';
}

export function finalUndertone(
  signals: Signals,
  confirm?: NeutralConfirm,
): Undertone {
  const derived = deriveUndertone(signals);
  if (derived === 'neutral' && confirm === 'yes') return 'olive';
  return derived;
}

// Waitlist/inbox format: "Depth Name (#hex) · Undertone" plus "(self-set)"
// when overridden. The owner's Gmail filters on it; keep it stable.
export function profileString(
  depth: number,
  undertone: Undertone,
  overridden: boolean,
): string {
  return `${depthName(depth)} (${depthColor(depth)}) · ${UT[undertone]}${
    overridden ? ' (self-set)' : ''
  }`;
}

export function whyString(signals: Signals): string {
  return (['vein', 'sun', 'jewel'] as const)
    .map((s) => {
      const a = signals[s];
      return a ? (SIGNAL_WORDS[s] as Record<string, string>)[a] : undefined;
    })
    .filter(Boolean)
    .join(', ');
}

// App-side conveniences (not part of the site port).
export function depthIndex(v: number): number {
  return DEPTH_NAMES.indexOf(depthName(v) as (typeof DEPTH_NAMES)[number]) + 1;
}

export function mstCode(v: number): string {
  return `MST-${String(depthIndex(v)).padStart(2, '0')}`;
}

export interface ToneProfile {
  depth: number; // 0 to 100 on the MST continuum
  color: string; // depthColor(depth), stored like the site stores it
  undertone: Undertone;
  overridden: boolean;
  signals: Signals;
  neutralConfirm?: NeutralConfirm;
  createdAt: string;
}
