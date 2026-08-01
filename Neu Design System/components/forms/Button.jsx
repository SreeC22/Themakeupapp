import React from 'react';

/**
 * Neu Button — pill-shaped, warm. Variants map to brand roles:
 *  - primary  : clay fill (the inviting CTA)
 *  - quiet    : ink fill (confident/secondary dark)
 *  - soft     : clay-tint fill, clay text
 *  - ghost    : text-only with hover tint
 */
export function Button({
  children, variant = 'primary', size = 'md', full = false,
  icon = null, disabled = false, style = {}, ...rest
}) {
  const sizes = {
    sm: { padding: '8px 16px', font: 'var(--t-sm)', gap: '6px' },
    md: { padding: '12px 22px', font: 'var(--t-body)', gap: '8px' },
    lg: { padding: '16px 28px', font: 'var(--t-title)', gap: '10px' },
  };
  const variants = {
    primary: { background: 'var(--action)', color: 'var(--action-text)', border: '1px solid transparent' },
    quiet:   { background: 'var(--action-quiet)', color: 'var(--ink-inv)', border: '1px solid transparent' },
    soft:    { background: 'var(--amethyst-soft)', color: 'var(--amethyst-deep)', border: '1px solid transparent' },
    ghost:   { background: 'transparent', color: 'var(--amethyst-deep)', border: '1px solid var(--line-strong)' },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  return (
    <button
      disabled={disabled}
      style={{
        display: full ? 'flex' : 'inline-flex', width: full ? '100%' : 'auto',
        alignItems: 'center', justifyContent: 'center', gap: s.gap,
        fontFamily: 'var(--font-body)', fontWeight: 'var(--w-semi)', fontSize: s.font,
        lineHeight: 1, letterSpacing: '0.01em', padding: s.padding,
        borderRadius: 'var(--r-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1, transition: 'transform .12s ease, filter .15s ease',
        ...v, ...style,
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...rest}
    >
      {icon}{children}
    </button>
  );
}
