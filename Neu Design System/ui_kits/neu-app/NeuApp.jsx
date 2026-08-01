// Neu app shell: iOS status bar, screen router, TabBar, Lucide icon helper.
const { useState, useEffect } = React;

// Lucide icon helper — renders SVG via the UMD build, re-scans after paint.
function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 2, style = {} }) {
  useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return <i data-lucide={name} style={{ width: size, height: size, color, display: 'inline-flex', ...style }} data-stroke={strokeWidth}></i>;
}

function StatusBar({ dark = false }) {
  const c = dark ? 'var(--ink-inv)' : 'var(--ink)';
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 22px 4px', fontFamily:'var(--font-body)', fontWeight:600, fontSize:14, color:c }}>
      <span>9:41</span>
      <span style={{ display:'inline-flex', gap:6, alignItems:'center' }}>
        <Icon name="signal" size={15} color={c}/><Icon name="wifi" size={15} color={c}/><Icon name="battery-full" size={17} color={c}/>
      </span>
    </div>
  );
}

function NeuApp() {
  const [screen, setScreen] = useState('quiz'); // quiz → result → feed → product → profile
  const [tab, setTab] = useState('feed');
  const D = window.NEU_DATA;
  const { TabBar } = window.NeuDesignSystem_32f7fb;

  const go = s => { setScreen(s); if (['feed','profile'].includes(s)) setTab(s === 'profile' ? 'you' : 'feed'); };

  const showTabs = ['feed','profile','product'].includes(screen);
  const darkStatus = false;

  const screens = {
    quiz:    <window.QuizScreen onDone={() => go('result')} />,
    result:  <window.ResultScreen onDone={() => go('feed')} />,
    feed:    <window.FeedScreen onOpen={() => go('product')} onProfile={() => go('profile')} />,
    product: <window.ProductScreen onBack={() => go('feed')} />,
    profile: <window.ProfileScreen onRetake={() => go('quiz')} />,
  };

  return (
    <div style={{ position:'relative', width:390, height:844, background:'var(--paper)', borderRadius:44, overflow:'hidden', boxShadow:'var(--shadow-lg)', border:'1px solid var(--line)', display:'flex', flexDirection:'column' }}>
      <StatusBar dark={darkStatus}/>
      <div style={{ flex:1, overflowY:'auto', position:'relative' }}>
        {screens[screen]}
      </div>
      {showTabs && (
        <TabBar active={tab} onChange={(k)=>{ setTab(k); if(k==='you') go('profile'); else go('feed'); }} items={[
          { key:'feed', label:'For You', icon:<Icon name="sparkles" size={22}/> },
          { key:'search', label:'Discover', icon:<Icon name="search" size={22}/> },
          { key:'saved', label:'Saved', icon:<Icon name="heart" size={22}/> },
          { key:'you', label:'You', icon:<Icon name="user" size={22}/> },
        ]}/>
      )}
      <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', width:134, height:5, borderRadius:3, background:'rgba(42,31,24,.28)' }}/>
    </div>
  );
}
Object.assign(window, { NeuApp, Icon, StatusBar });
