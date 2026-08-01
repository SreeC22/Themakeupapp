// Result screen — your Monk Scale placement + undertone (including olive).
function ResultScreen({ onDone }) {
  const { you } = window.NEU_DATA;
  const { Button, ToneSwatch, Badge } = window.NeuDesignSystem_32f7fb;
  const tones = [1,2,3,4,5,6,7,8,9,10];
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100%', padding:'12px 22px 24px', background:'var(--paper)' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--amethyst-deep)', marginBottom:10 }}>Your result</div>
      <h1 style={{ fontFamily:'var(--font-display)', fontWeight:500, fontSize:34, lineHeight:1.06, letterSpacing:'-.02em', color:'var(--ink)', margin:'0 0 6px' }}>
        You’re <span style={{ fontStyle:'italic', color:'var(--amethyst-deep)' }}>MST-07, olive</span>.
      </h1>
      <p style={{ fontFamily:'var(--font-body)', fontSize:15, lineHeight:1.5, color:'var(--ink-2)', margin:'0 0 22px' }}>
        A warm mid-deep tone with an olive undertone — the one most tools pretend doesn’t exist. From here, everything is filtered through people who share it.
      </p>

      <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'var(--r-lg)', boxShadow:'var(--shadow-md)', padding:20, marginBottom:16 }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:14 }}>Monk Skin Tone Scale</div>
        <div style={{ display:'flex', gap:5, alignItems:'flex-end', height:64 }}>
          {tones.map(t => (
            <div key={t} style={{ flex:1, height: t===you.tone?64:44, borderRadius:6, background:`var(--mst-${t})`, boxShadow: t===you.tone?'0 0 0 3px var(--paper),0 0 0 6px var(--amethyst)':'inset 0 0 0 1px rgba(42,31,24,.1)', position:'relative' }}>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap' }}>
          <Badge tone="olive">Olive undertone</Badge>
          <Badge tone="good">Warm-leaning</Badge>
        </div>
      </div>

      <div style={{ background:'var(--amethyst-soft)', borderRadius:'var(--r-lg)', padding:'16px 18px', marginBottom:'auto', display:'flex', gap:12, alignItems:'center' }}>
        <window.Icon name="users" size={22} color="var(--amethyst-deep)"/>
        <div style={{ fontFamily:'var(--font-body)', fontSize:14, lineHeight:1.4, color:'var(--amethyst-deep)' }}>
          <b>1,240 tone twins</b> share MST-07 olive. You’ll see what worked on them first.
        </div>
      </div>

      <div style={{ height:20 }}/>
      <Button size="lg" full onClick={onDone}>Meet my tone twins</Button>
    </div>
  );
}
window.ResultScreen = ResultScreen;
