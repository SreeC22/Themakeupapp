// Profile / You — your tone, twins, and what you've posted.
function ProfileScreen({ onRetake }) {
  const { you, twins, products } = window.NEU_DATA;
  const { Button, Badge, Avatar, ToneSwatch } = window.NeuDesignSystem_32f7fb;
  return (
    <div style={{ paddingBottom:24 }}>
      <div style={{ padding:'12px 22px 20px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <ToneSwatch tone={you.tone} selected size={72}/>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:500, fontSize:26, letterSpacing:'-.02em', color:'var(--ink)', margin:'12px 0 2px' }}>{you.name}</h1>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--ink-2)', marginBottom:10 }}>{you.code} · {you.undertone}</div>
        <div style={{ display:'flex', gap:8 }}>
          <Badge tone="olive">Olive undertone</Badge>
          <Badge tone="good">Warm-leaning</Badge>
        </div>
      </div>

      <div style={{ padding:'0 22px', marginBottom:22 }}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'var(--r-lg)', boxShadow:'var(--shadow-sm)', padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:20, color:'var(--ink)' }}>1,240 tone twins</div>
            <div style={{ fontFamily:'var(--font-body)', fontSize:13, color:'var(--ink-2)', marginTop:2 }}>share your MST-07 olive tone</div>
          </div>
          <div style={{ display:'flex' }}>
            {twins.slice(0,4).map((t,i)=>(<div key={i} style={{ marginLeft:i?-10:0 }}><Avatar name={t.name} tone={t.tone} size={34} style={{ boxShadow:'0 0 0 2px var(--surface)' }}/></div>))}
          </div>
        </div>
      </div>

      <div style={{ padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:20, color:'var(--ink)' }}>What works on me</div>
        <span style={{ fontFamily:'var(--font-body)', fontSize:13, fontWeight:600, color:'var(--amethyst-deep)' }}>Post</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, padding:'0 22px', marginBottom:22 }}>
        {products.concat(products.slice(0,2)).map((p,i)=>(
          <div key={i} style={{ aspectRatio:'1', borderRadius:'var(--r-sm)', background:p.image, position:'relative', boxShadow:'inset 0 0 0 1px rgba(42,31,24,.06)' }}>
            <span style={{ position:'absolute', bottom:6, left:6, background:'var(--good-soft)', color:'var(--amethyst-deep)', fontFamily:'var(--font-body)', fontWeight:600, fontSize:10, padding:'2px 6px', borderRadius:999 }}>{p.verdicts[0]}</span>
          </div>
        ))}
      </div>

      <div style={{ padding:'0 22px' }}>
        <Button variant="ghost" full onClick={onRetake} icon={<window.Icon name="rotate-ccw" size={16} color="var(--amethyst-deep)"/>}>Retake the quiz</Button>
      </div>
    </div>
  );
}
window.ProfileScreen = ProfileScreen;
