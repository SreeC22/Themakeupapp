// Feed screen — "For You", products filtered through your tone twins.
function FeedScreen({ onOpen, onProfile }) {
  const D = window.NEU_DATA;
  const { ProductCard, Chip, Avatar } = window.NeuDesignSystem_32f7fb;
  const [filter, setFilter] = React.useState('All');
  const filters = ['All','Foundation','SPF','Blush','Concealer'];
  const [saved, setSaved] = React.useState({});
  return (
    <div style={{ padding:'6px 0 20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 20px 14px' }}>
        <div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)' }}>For you · MST-07 olive</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:500, fontSize:28, letterSpacing:'-.02em', color:'var(--ink)', margin:'2px 0 0' }}>What works on skin like yours</h1>
        </div>
        <div onClick={onProfile} style={{ cursor:'pointer' }}><Avatar name="You" tone={7} size={40}/></div>
      </div>

      <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'2px 20px 14px' }}>
        {filters.map(f => <Chip key={f} selected={filter===f} onClick={()=>setFilter(f)}>{f}</Chip>)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, padding:'0 20px' }}>
        {D.products.map(p => (
          <ProductCard key={p.id} brand={p.brand} name={p.name} price={p.price} image={p.image}
            verdicts={p.verdicts} twins={p.twins} saved={!!saved[p.id]}
            onSave={()=>setSaved(s=>({...s,[p.id]:!s[p.id]}))}
            style={{ cursor:'pointer' }} onClick={onOpen}/>
        ))}
      </div>
    </div>
  );
}
window.FeedScreen = FeedScreen;
