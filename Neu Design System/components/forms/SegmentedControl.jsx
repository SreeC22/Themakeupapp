import React from 'react';

/** iOS-style segmented control. `options` is an array of string labels. */
export function SegmentedControl({ options = [], value, onChange, style = {} }) {
  return (
    <div style={{
      display: 'inline-flex', background: 'var(--paper-sink)', border: '1px solid var(--line)',
      borderRadius: 'var(--r-pill)', padding: '3px', gap: '2px', ...style,
    }}>
      {options.map(opt => {
        const active = opt === value;
        return (
          <button key={opt} onClick={() => onChange && onChange(opt)}
            style={{
              padding: '8px 16px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: active ? 'var(--w-semi)' : 'var(--w-med)',
              fontSize: 'var(--t-sm)', transition: 'all .18s ease',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--ink)' : 'var(--ink-2)',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
            }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}
