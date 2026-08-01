import React from 'react';

/**
 * TabBar — iOS bottom navigation. `items` = [{ key, label, icon }].
 * `icon` is any node (pass Lucide icons from the kit). Active tab is clay.
 */
export function TabBar({ items = [], active, onChange, style = {} }) {
  return (
    <nav style={{
      display: 'flex', background: 'rgba(251,246,239,.86)', backdropFilter: 'blur(18px)',
      borderTop: '1px solid var(--line)', padding: '8px 8px calc(8px + env(safe-area-inset-bottom))',
      ...style,
    }}>
      {items.map(it => {
        const on = it.key === active;
        return (
          <button key={it.key} onClick={() => onChange && onChange(it.key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
              color: on ? 'var(--amethyst-deep)' : 'var(--ink-3)', transition: 'color .15s ease',
            }}>
            <span style={{ display: 'flex', height: 24, alignItems: 'center' }}>{it.icon}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: on ? 'var(--w-semi)' : 'var(--w-med)' }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
