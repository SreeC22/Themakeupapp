// Quiz screen — the 30-second, no-camera quiz.
function QuizScreen({ onDone }) {
  const D = window.NEU_DATA.quiz;
  const { Button, QuizOption } = window.NeuDesignSystem_32f7fb;
  const [pick, setPick] = React.useState('olive');
  const pct = Math.round((D.step / D.total) * 100);
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'8px 22px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <window.Icon name="arrow-left" size={22} color="var(--ink)"/>
        <div style={{ flex:1, height:6, background:'var(--paper-sink)', borderRadius:999, overflow:'hidden' }}>
          <div style={{ width:pct+'%', height:'100%', background:'var(--amethyst)', borderRadius:999 }}/>
        </div>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)' }}>{D.step}/{D.total}</span>
      </div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--amethyst-deep)', marginBottom:8 }}>Your undertone</div>
      <h1 style={{ fontFamily:'var(--font-display)', fontWeight:500, fontSize:32, lineHeight:1.08, letterSpacing:'-.02em', color:'var(--ink)', margin:'0 0 8px' }}>{D.q}</h1>
      <p style={{ fontFamily:'var(--font-body)', fontSize:15, lineHeight:1.5, color:'var(--ink-2)', margin:'0 0 22px' }}>{D.help}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {D.options.map(o => (
          <QuizOption key={o.key} selected={pick===o.key} swatch={o.swatch} sublabel={o.sub} onClick={()=>setPick(o.key)}>{o.label}</QuizOption>
        ))}
      </div>
      <div style={{ flex:1 }}/>
      <Button size="lg" full onClick={onDone}>Continue</Button>
    </div>
  );
}
window.QuizScreen = QuizScreen;
