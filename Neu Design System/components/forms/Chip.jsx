import React from 'react';

/**
 * Chip — filter / undertone / tone pill. Selectable.
 * A leading `swatch` color renders a dot (undertone or Monk tone).
 */
export function Chip({
  children, selected = false, swatch = null, size = 'md',
  onClick, style = {}, ...rest
}) {
  const pad = size === 'sm' ? '5px 11px' : '8px 14px';
  const font = size === 'sm' ? 'var(--t-cap)' : 'var(--t-sm)';
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        fontFamily: 'var(--font-body)', fontWeight: 'var(--w-med)', fontSize: font,
        lineHeight: 1, padding: pad, borderRadius: 'var(--r-pill)', cursor: 'pointer',
        transition: 'background .15s ease, color .15s ease, border-color .15s ease',
        background: selected ? 'var(--ink)' : 'var(--surface)',
        color: selected ? 'var(--ink-inv)' : 'var(--ink-2)',
        border: `1px solid ${selected ? 'var(--ink)' : 'var(--line-strong)'}`,
        ...style,
      }}
      {...rest}
    >
      {swatch && (
        <span style={{
          width: '12px', height: '12px', borderRadius: 'var(--r-circle)',
          background: swatch, boxShadow: 'inset 0 0 0 1px rgba(42,31,24,.12)', flex: 'none',
        }} />
      )}
      {children}
    </button>
  );
}
