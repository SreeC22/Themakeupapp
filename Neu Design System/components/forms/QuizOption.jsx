import React from 'react';

/**
 * QuizOption — a big tappable quiz answer (the 30-second quiz).
 * Radio-like; `selected` fills olive-soft with an olive ring.
 */
export function QuizOption({
  children, selected = false, sublabel = null, swatch = null, onClick, style = {},
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
      padding: '16px 18px', borderRadius: 'var(--r-md)', cursor: 'pointer',
      background: selected ? 'var(--amethyst-soft)' : 'var(--surface)',
      border: `1.5px solid ${selected ? 'var(--amethyst)' : 'var(--line-strong)'}`,
      transition: 'background .15s ease, border-color .15s ease', ...style,
    }}>
      {swatch && (
        <span style={{ width: 32, height: 32, borderRadius: 'var(--r-circle)', background: swatch, flex: 'none', boxShadow: 'inset 0 0 0 1px rgba(42,31,24,.12)' }} />
      )}
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--w-semi)', fontSize: 'var(--t-title)', color: 'var(--ink)' }}>{children}</span>
        {sublabel && <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>{sublabel}</span>}
      </span>
      <span style={{
        width: 22, height: 22, borderRadius: 'var(--r-circle)', flex: 'none',
        border: `2px solid ${selected ? 'var(--amethyst)' : 'var(--line-strong)'}`,
        background: selected ? 'var(--amethyst)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13,
      }}>{selected ? '✓' : ''}</span>
    </button>
  );
}
