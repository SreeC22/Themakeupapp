// Product detail — tone-twin verdicts, shade match, reviews.
function ProductScreen({ onBack }) {
  const d = window.NEU_DATA.detail;
  const { Button, Badge, Avatar } = window.NeuDesignSystem_32f7fb;
  const [saved, setSaved] = React.useState(false);
  return (
    <div style={{ paddingBottom:24 }}>
      <div style={{ position:'relative', height:260, background:d.image }}>
        <button onClick={onBack} style={{ position:'absolute', top:14, left:16, width:38, height:38, borderRadius:999, border:'none', background:'rgba(255,255,255,.9)', boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <window.Icon name="arrow-left" size={20} color="var(--ink)"/>
        </button>
        <button onClick={()=>setSaved(s=>!s)} style={{ position:'absolute', top:14, right:16, width:38, height:38, borderRadius:999, border:'none', background:'rgba(255,255,255,.9)', boxShadow:'var(--shadow-sm)', color:saved?'var(--berry)':'var(--ink-2)', fontSize:18, cursor:'pointer' }}>{saved?'♥':'♡'}</button>
      </div>

      <div style={{ padding:'18px 22px 0' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)' }}>{d.brand}</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:500, fontSize:28, lineHeight:1.1, letterSpacing:'-.02em', color:'var(--ink)', margin:'4px 0 8px' }}>{d.name}</h1>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
          <span style={{ fontFamily:'var(--font-body)', fontWeight:600, fontSize:18, color:'var(--ink)' }}>{d.price}</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--amethyst-deep)' }}>Shade {d.shade}</span>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18 }}>
          {d.verdicts.map(v => <Badge key={v} tone="good">{v}</Badge>)}
        </div>

        <div style={{ background:'var(--amethyst-soft)', borderRadius:'var(--r-md)', padding:'14px 16px', display:'flex', gap:12, marginBottom:22 }}>
          <window.Icon name="sparkles" size={20} color="var(--amethyst-deep)"/>
          <div style={{ fontFamily:'var(--font-body)', fontSize:14, lineHeight:1.45, color:'var(--amethyst-deep)' }}>{d.matchNote}</div>
        </div>

        <div style={{ fontFamily:'var(--font-display)', fontSize:20, color:'var(--ink)', margin:'0 0 12px' }}>From your tone twins</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:22 }}>
          {d.reviews.map(r => (
            <div key={r.name} style={{ display:'flex', gap:12 }}>
              <Avatar name={r.name} tone={r.tone} size={40}/>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontFamily:'var(--font-body)', fontWeight:600, fontSize:14, color:'var(--ink)' }}>{r.name}</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-3)' }}>MST-{String(r.tone).padStart(2,'0')}</span>
                </div>
                <p style={{ fontFamily:'var(--font-body)', fontSize:14, lineHeight:1.5, color:'var(--ink-2)', margin:'3px 0 0' }}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>

        <Button size="lg" full icon={<window.Icon name="shopping-bag" size={18} color="#fff"/>}>Shop this shade</Button>
      </div>
    </div>
  );
}
window.ProductScreen = ProductScreen;
