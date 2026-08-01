import React from 'react';

/**
 * ToneSwatch — the Monk Skin Tone dot, the brand's signature primitive.
 * Pass `tone` (1–10) to pull the official --mst-N color, or a raw `color`.
 * `selected` draws the olive placement ring.
 */
export function ToneSwatch({
  tone = null, color = null, size = 40, selected = false, label = false, style = {},
}) {
  const bg = color || (tone ? `var(--mst-${tone})` : 'var(--mst-5)');
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '6px', ...style }}>
      <span style={{
        width: size, height: size, borderRadius: 'var(--r-circle)', background: bg,
        boxShadow: selected
          ? '0 0 0 3px var(--paper), 0 0 0 6px var(--amethyst), var(--shadow-sm)'
          : 'inset 0 0 0 1px rgba(42,31,24,.12)',
        transition: 'box-shadow .18s ease',
      }} />
      {label && tone && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)',
          color: selected ? 'var(--amethyst-deep)' : 'var(--ink-3)', letterSpacing: '.04em',
        }}>
          MST-{String(tone).padStart(2, '0')}
        </span>
      )}
    </div>
  );
}
