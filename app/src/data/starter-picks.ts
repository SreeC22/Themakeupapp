// Curated starter picks: the M1 seed corpus, bundled and offline.
// House rule 4: no fake social proof. Every entry is a real product,
// labeled curated, with no invented users, counts, or ratings.
// Seeding is deliberately uneven (APP_PLAN M2 note): olive at every
// depth and Deep 7 to Rich 10 get the deepest coverage first.

import type { Undertone } from '../lib/tone';

export type Category = 'base' | 'spf' | 'blush' | 'lip';

export interface StarterPick {
  id: string;
  brand: string;
  name: string;
  category: Category;
  // Inclusive depth range on the 1 to 10 Monk scale.
  depthMin: number;
  depthMax: number;
  undertones: Undertone[];
  // Concrete verdicts in the site's failure-mode vocabulary.
  verdicts: string[];
  note: string;
  // Two-stop placeholder tint (DS rule: no stock photos).
  tint: [string, string];
}

export const STARTER_PICKS: StarterPick[] = [
  {
    id: 'fenty-profiltr',
    brand: 'Fenty Beauty',
    name: "Pro Filt'r Soft Matte Foundation",
    category: 'base',
    depthMin: 1,
    depthMax: 10,
    undertones: ['warm', 'cool', 'neutral', 'olive'],
    verdicts: ["didn't oxidize", 'range reaches Rich 10'],
    note: 'The shade range that made 40-shade the floor. Deep shades read true, not orange.',
    tint: ['#E9C9A6', '#C99B6E'],
  },
  {
    id: 'mac-studiofix',
    brand: 'MAC',
    name: 'Studio Fix Fluid SPF 15',
    category: 'base',
    depthMin: 2,
    depthMax: 9,
    undertones: ['olive', 'warm'],
    verdicts: ['true olive shades', 'no orange shift'],
    note: 'The NC line runs genuinely olive. A long-standing pick when everything else pulls pink.',
    tint: ['#D9B48C', '#A87B52'],
  },
  {
    id: 'juvias-iammagic',
    brand: "Juvia's Place",
    name: 'I Am Magic Foundation',
    category: 'base',
    depthMin: 6,
    depthMax: 10,
    undertones: ['warm', 'neutral', 'olive'],
    verdicts: ['built for Deep 7 to Rich 10', 'no grey cast'],
    note: 'Deep-first brand: the darkest shades are the core of the line, not the afterthought.',
    tint: ['#8A5A3B', '#4A3223'],
  },
  {
    id: 'rare-liquidtouch',
    brand: 'Rare Beauty',
    name: 'Liquid Touch Weightless Foundation',
    category: 'base',
    depthMin: 1,
    depthMax: 9,
    undertones: ['neutral', 'olive'],
    verdicts: ['no pink pull', 'sheer, buildable'],
    note: 'Light coverage that stays neutral instead of drifting pink by afternoon.',
    tint: ['#E5C3A8', '#B98F6C'],
  },
  {
    id: 'nars-lightreflecting',
    brand: 'NARS',
    name: 'Light Reflecting Foundation',
    category: 'base',
    depthMin: 1,
    depthMax: 9,
    undertones: ['olive', 'neutral'],
    verdicts: ['olive-friendly neutrals', "didn't go ashy"],
    note: 'Several mid shades lean quietly green. A common answer to "everything looks pink on me."',
    tint: ['#E2C0A0', '#AD8058'],
  },
  {
    id: 'maybelline-fitme',
    brand: 'Maybelline',
    name: 'Fit Me Matte + Poreless',
    category: 'base',
    depthMin: 1,
    depthMax: 9,
    undertones: ['neutral', 'warm'],
    verdicts: ['matte without ash', 'drugstore price'],
    note: 'The budget benchmark. The deeper end holds its ground without greying out.',
    tint: ['#E7CBAD', '#B08760'],
  },
  {
    id: 'supergoop-unseen',
    brand: 'Supergoop',
    name: 'Unseen Sunscreen SPF 40',
    category: 'spf',
    depthMin: 1,
    depthMax: 10,
    undertones: ['warm', 'cool', 'neutral', 'olive'],
    verdicts: ['no white cast', 'invisible finish'],
    note: 'Clear gel, zero flashback. The default answer to SPF white cast.',
    tint: ['#EFE6D3', '#D9C9A8'],
  },
  {
    id: 'bgs-spf30',
    brand: 'Black Girl Sunscreen',
    name: 'BGS SPF 30',
    category: 'spf',
    depthMin: 5,
    depthMax: 10,
    undertones: ['warm', 'neutral', 'olive'],
    verdicts: ['made for deep skin', 'zero cast'],
    note: 'Formulated for melanin-rich skin from the start. Moisturizing, no film.',
    tint: ['#C9A57E', '#7A5638'],
  },
  {
    id: 'boj-reliefsun',
    brand: 'Beauty of Joseon',
    name: 'Relief Sun: Rice + Probiotics SPF 50',
    category: 'spf',
    depthMin: 1,
    depthMax: 8,
    undertones: ['warm', 'cool', 'neutral', 'olive'],
    verdicts: ['minimal cast', 'no ashy film'],
    note: 'Korean chemical filter, creamy without the ghost layer. Mid and tan tones report clean wear.',
    tint: ['#F1E8D8', '#CBB694'],
  },
  {
    id: 'fenty-cheeksout',
    brand: 'Fenty Beauty',
    name: 'Cheeks Out Freestyle Cream Blush',
    category: 'blush',
    depthMin: 4,
    depthMax: 10,
    undertones: ['warm', 'olive'],
    verdicts: ['reads true on deep skin', 'not muddy'],
    note: 'Pigment tuned so deep skin gets color, not a grey smear.',
    tint: ['#E3908E', '#B04A54'],
  },
  {
    id: 'rare-softpinch',
    brand: 'Rare Beauty',
    name: 'Soft Pinch Liquid Blush',
    category: 'blush',
    depthMin: 1,
    depthMax: 10,
    undertones: ['warm', 'cool', 'neutral', 'olive'],
    verdicts: ['a drop goes far', 'no grey shift'],
    note: 'Concentrated enough to survive deep skin, sheer enough for fair. Blend fast.',
    tint: ['#F2D6DC', '#D89AAE'],
  },
  {
    id: 'clinique-blackhoney',
    brand: 'Clinique',
    name: 'Almost Lipstick in Black Honey',
    category: 'lip',
    depthMin: 3,
    depthMax: 10,
    undertones: ['neutral', 'olive', 'cool'],
    verdicts: ['sheer berry, deep-skin true', 'one-swipe wear'],
    note: 'The sheer berry that adapts to your own lip color instead of sitting on top of it.',
    tint: ['#8E4A55', '#5A2E38'],
  },
  {
    id: 'fenty-glossbomb',
    brand: 'Fenty Beauty',
    name: 'Gloss Bomb Lip Luminizer',
    category: 'lip',
    depthMin: 1,
    depthMax: 10,
    undertones: ['warm', 'olive'],
    verdicts: ['warm gold, no chalk', 'non-sticky'],
    note: 'Warm shimmer that flatters gold-leaning and olive lips without frosting out.',
    tint: ['#E8B48A', '#C07E4E'],
  },
  {
    id: 'ud-247liner',
    brand: 'Urban Decay',
    name: '24/7 Glide-On Liner, Whiskey',
    category: 'lip',
    depthMin: 5,
    depthMax: 10,
    undertones: ['warm', 'neutral'],
    verdicts: ['warm brown, not black-adjacent', 'no transfer'],
    note: 'A brown liner deep enough to show up and warm enough not to go grey.',
    tint: ['#7A5238', '#3E2A1D'],
  },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  base: 'Base',
  spf: 'SPF',
  blush: 'Blush',
  lip: 'Lip',
};

// Depth index 1 to 10 from the continuous 0 to 100 value.
export function pickMatches(
  pick: StarterPick,
  depthIndex: number,
  undertone: Undertone,
): boolean {
  return (
    depthIndex >= pick.depthMin &&
    depthIndex <= pick.depthMax &&
    pick.undertones.includes(undertone)
  );
}

export function rankPicks(
  depthIndex: number,
  undertone: Undertone,
  category?: Category,
): { matches: StarterPick[]; near: StarterPick[] } {
  const pool = category
    ? STARTER_PICKS.filter((p) => p.category === category)
    : STARTER_PICKS;
  const matches = pool.filter((p) => pickMatches(p, depthIndex, undertone));
  const near = pool.filter(
    (p) =>
      !pickMatches(p, depthIndex, undertone) &&
      depthIndex >= pick0(p.depthMin) &&
      depthIndex <= pick1(p.depthMax),
  );
  return { matches, near };
}
const pick0 = (n: number) => Math.max(1, n - 1);
const pick1 = (n: number) => Math.min(10, n + 1);
