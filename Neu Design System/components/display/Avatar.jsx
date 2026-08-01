import React from 'react';

/**
 * Avatar — a tone twin. Shows initials on a warm tint, with an optional
 * small ToneSwatch-style tone dot in the corner (`tone` = Monk 1–10).
 */
export function Avatar({ name = '', src = null, tone = null, size = 44, style = {} }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none', ...style }}>
      <div style={{
        width: size, height: size, borderRadius: 'var(--r-circle)', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--amethyst-soft)', color: 'var(--amethyst-deep)',
        fontFamily: 'var(--font-body)', fontWeight: 'var(--w-semi)', fontSize: size * 0.36,
        boxShadow: 'inset 0 0 0 1px rgba(42,31,24,.08)',
      }}>
        {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
      </div>
      {tone && (
        <span style={{
          position: 'absolute', right: -2, bottom: -2, width: size * 0.34, height: size * 0.34,
          borderRadius: 'var(--r-circle)', background: `var(--mst-${tone})`,
          boxShadow: '0 0 0 2px var(--surface)',
        }} />
      )}
    </div>
  );
}
