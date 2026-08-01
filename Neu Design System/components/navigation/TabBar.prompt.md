iOS bottom tab bar with translucent blur; pass `items` with `icon` nodes (Lucide from the kit).

```jsx
<TabBar active="feed" onChange={setTab} items={[
  { key:'feed', label:'For You', icon:<HomeIcon/> },
  { key:'you', label:'You', icon:<UserIcon/> },
]} />
```
