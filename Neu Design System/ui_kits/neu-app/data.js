// Neu UI kit — shared fake data (no photos; color placeholders only)
window.NEU_DATA = {
  you: { name: 'You', tone: 7, undertone: 'Olive', code: 'MST-07' },
  quiz: {
    step: 3, total: 6,
    q: 'Which undertone sounds most like you?',
    help: 'No camera, no photos — just you. 30 seconds, promise.',
    options: [
      { key: 'warm', label: 'Warm', sub: 'Gold jewelry wins; I tan easily', swatch: 'var(--tone-warm)' },
      { key: 'cool', label: 'Cool', sub: 'Silver suits me; I burn then pink', swatch: 'var(--tone-cool)' },
      { key: 'neutral', label: 'Neutral', sub: 'Honestly, both look fine', swatch: 'var(--tone-neutral)' },
      { key: 'olive', label: 'Olive', sub: 'A green-grey cast most tools miss', swatch: 'var(--tone-olive)' },
    ],
  },
  twins: [
    { name: 'Ama K.', tone: 7 }, { name: 'Priya S.', tone: 7 }, { name: 'Lena O.', tone: 8 },
    { name: 'Rae M.', tone: 6 }, { name: 'Dee W.', tone: 7 },
  ],
  products: [
    { id:1, brand:'Rare Beauty', name:'Liquid Touch Foundation', price:'$32',
      image:'linear-gradient(135deg,#E9C9A6,#C99B6E)', verdicts:['Didn\u2019t oxidize','True to olive'], twins:{count:214,tone:7} },
    { id:2, brand:'Supergoop', name:'Unseen Sunscreen SPF 40', price:'$38',
      image:'linear-gradient(135deg,#EFE6D3,#D9C9A8)', verdicts:['No white cast'], twins:{count:389,tone:7} },
    { id:3, brand:'Rare Beauty', name:'Soft Pinch Blush', price:'$23',
      image:'linear-gradient(135deg,#F2D6DC,#D89AAE)', verdicts:['Didn\u2019t go muddy','Buildable'], twins:{count:156,tone:7} },
    { id:4, brand:'Kosas', name:'Revealer Concealer', price:'$28',
      image:'linear-gradient(135deg,#E6C6A0,#BE9163)', verdicts:['No grey cast','Olive-friendly'], twins:{count:98,tone:8} },
  ],
  detail: {
    brand:'Rare Beauty', name:'Liquid Touch Foundation', price:'$32', shade:'320N (olive)',
    image:'linear-gradient(135deg,#E9C9A6,#C99B6E)',
    verdicts:['Didn\u2019t oxidize','True to olive','Medium buildable'],
    matchNote:'87% of your tone twins wear 310\u2013330. Reach for the N (olive) shades, not W.',
    reviews:[
      { name:'Ama K.', tone:7, text:'Finally a foundation that doesn\u2019t turn orange on me by 2pm. The olive undertone is real.' },
      { name:'Priya S.', tone:7, text:'Went a half-shade darker than the app suggested and it\u2019s perfect. No oxidizing at all.' },
    ],
  },
};
