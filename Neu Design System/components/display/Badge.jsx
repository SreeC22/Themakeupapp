import React from 'react';

/**
 * Badge — small status/label pill. `tone`:
 *  good (olive) · warm (gold) · berry · neutral · olive (outlined flag)
 */
export function Badge({ children, tone = 'neutral', style = {} }) {
  const tones = {
    good:    { background: 'var(--good-soft)', color: 'var(--amethyst-deep)', border: 'transparent' },
    warm:    { background: 'var(--gold-soft)', color: '#8A6A22', border: 'transparent' },
    berry:   { background: 'var(--berry-soft)', color: 'var(--berry-deep)', border: 'transparent' },
    neutral: { background: 'var(--paper-sink)', color: 'var(--ink-2)', border: 'transparent' },
    olive:   { background: 'transparent', color: 'var(--amethyst-deep)', border: 'var(--amethyst)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: 'var(--font-body)', fontWeight: 'var(--w-semi)', fontSize: 'var(--t-cap)',
      lineHeight: 1, padding: '5px 10px', borderRadius: 'var(--r-pill)',
      background: t.background, color: t.color, border: `1px solid ${t.border}`, ...style,
    }}>
      {children}
    </span>
  );
}
