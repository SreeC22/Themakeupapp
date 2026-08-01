import React from 'react';

/** Card — the base warm surface. `pad` toggles inner padding, `flat` drops shadow. */
export function Card({ children, pad = true, flat = false, style = {}, ...rest }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)', boxShadow: flat ? 'none' : 'var(--shadow-md)',
      padding: pad ? 'var(--sp-5)' : 0, overflow: 'hidden', ...style,
    }} {...rest}>
      {children}
    </div>
  );
}
