import React from 'react';

/** Search / text input, warm pill or rounded field. */
export function Input({
  value, onChange, placeholder = '', icon = null, type = 'text',
  pill = false, style = {}, ...rest
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: 'var(--surface)', border: '1px solid var(--line-strong)',
      borderRadius: pill ? 'var(--r-pill)' : 'var(--r-md)',
      padding: pill ? '11px 18px' : '12px 14px', transition: 'box-shadow .15s ease, border-color .15s ease',
      ...style,
    }}
      onFocus={e => { e.currentTarget.style.boxShadow = 'var(--ring)'; e.currentTarget.style.borderColor = 'var(--amethyst)'; }}
      onBlur={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--line-strong)'; }}
    >
      {icon && <span style={{ color: 'var(--ink-3)', display: 'flex' }}>{icon}</span>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-body)', fontSize: 'var(--t-body)', color: 'var(--ink)',
        }}
        {...rest}
      />
    </div>
  );
}
