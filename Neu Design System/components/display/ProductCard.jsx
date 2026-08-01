import React from 'react';
import { Badge } from './Badge.jsx';
import { Avatar } from './Avatar.jsx';

/**
 * ProductCard — a product surfaced through tone twins. The heart of the feed.
 * `image` is a color/gradient placeholder swatch (no photo needed).
 * `verdicts` is an array of short strings ("Didn't oxidize", "No white cast").
 * `twins` = { count, tone } summarizes who vouches for it.
 */
export function ProductCard({
  brand, name, price, image = 'var(--amethyst-soft)', verdicts = [],
  twins = null, saved = false, onSave, onClick, style = {},
}) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', ...style,
    }}>
      <div style={{ position: 'relative', height: 132, background: image }}>
        <button onClick={(e)=>{e.stopPropagation(); onSave && onSave();}} aria-label="Save" style={{
          position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 'var(--r-circle)',
          border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(4px)',
          color: saved ? 'var(--berry)' : 'var(--ink-2)', fontSize: 16, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)',
        }}>{saved ? '♥' : '♡'}</button>
        {twins && (
          <div style={{
            position: 'absolute', left: 10, bottom: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(4px)', padding: '4px 10px 4px 6px',
            borderRadius: 'var(--r-pill)', boxShadow: 'var(--shadow-sm)',
          }}>
            <Avatar name="Tone Twin" tone={twins.tone} size={20} />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--w-semi)', fontSize: 'var(--t-cap)', color: 'var(--ink)' }}>
              {twins.count} tone twins
            </span>
          </div>
        )}
      </div>
      <div style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{brand}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--w-med)', fontSize: 'var(--t-h3)', lineHeight: 1.1, color: 'var(--ink)' }}>{name}</div>
        {verdicts.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
            {verdicts.map(v => <Badge key={v} tone="good">{v}</Badge>)}
          </div>
        )}
        {price && <div style={{ marginTop: 4, fontFamily: 'var(--font-body)', fontWeight: 'var(--w-semi)', fontSize: 'var(--t-body)', color: 'var(--ink)' }}>{price}</div>}
      </div>
    </div>
  );
}
