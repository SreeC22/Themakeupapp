-- The Makeup App: Supabase schema (paste into Supabase SQL editor)
-- Waitlist now; app tables for milestone M2. Matches APP_PLAN.md.

-- ---------- waitlist (live site writes here) ----------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  tone_depth numeric,                -- 0..100 slider value
  tone_hex text,                     -- exact color, e.g. #916D4D
  depth_name text,                   -- e.g. "Tan 5"
  undertone text check (undertone in ('warm','cool','neutral','olive')),
  undertone_self_set boolean default false,
  signup_spot text,                  -- hero / quiz / footer
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- anon visitors may insert, nobody may read/update/delete via anon key
create policy "waitlist_insert_anon" on public.waitlist
  for insert to anon with check (true);

-- ---------- app tables (M2) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique,
  tone_depth int check (tone_depth between 1 and 10),
  tone_hex text,
  undertone text check (undertone in ('warm','cool','neutral','olive')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  name text not null,
  category text check (category in ('base','blush','lip','eye','spf','other')),
  shade_label text,
  created_at timestamptz not null default now(),
  unique (brand, name, shade_label)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  body text not null,
  rating int check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create table if not exists public.saves (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.saves enable row level security;

-- everyone signed in can read everything
create policy "read_all_profiles" on public.profiles for select to authenticated using (true);
create policy "read_all_products" on public.products for select to authenticated using (true);
create policy "read_all_posts"    on public.posts    for select to authenticated using (true);
create policy "read_all_likes"    on public.post_likes for select to authenticated using (true);
create policy "read_all_saves"    on public.saves    for select to authenticated using (true);

-- users write only their own rows
create policy "own_profile_upsert" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "own_profile_update" on public.profiles
  for update to authenticated using (id = auth.uid());
create policy "insert_products" on public.products
  for insert to authenticated with check (true);
create policy "own_posts_insert" on public.posts
  for insert to authenticated with check (author_id = auth.uid());
create policy "own_posts_delete" on public.posts
  for delete to authenticated using (author_id = auth.uid());
create policy "own_likes" on public.post_likes
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own_saves" on public.saves
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- tone twins helper: same undertone, depth within 1
create or replace view public.tone_twin_posts as
select p.*, pr.tone_depth as author_depth, pr.undertone as author_undertone
from public.posts p
join public.profiles pr on pr.id = p.author_id;
