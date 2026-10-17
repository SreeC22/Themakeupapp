-- Neu web community MVP.
-- Run SCHEMA.sql first, then this file in the Supabase SQL editor.
-- Public visitors can browse recommendations. Signed-in members can post
-- and manage their own profile and saves. Emails stay in Supabase Auth.

alter table public.profiles
  add column if not exists tone_value numeric;

alter table public.products
  add column if not exists buy_url text,
  add column if not exists created_by uuid references auth.users(id) on delete set null;

alter table public.posts
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('spam', 'inaccurate', 'other')),
  details text check (char_length(details) <= 300),
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

create index if not exists posts_created_at_idx
  on public.posts (created_at desc);
create index if not exists posts_author_id_idx
  on public.posts (author_id);
create index if not exists products_created_by_idx
  on public.products (created_by);
create index if not exists post_reports_created_at_idx
  on public.post_reports (created_at desc);

do $web_constraints$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_tone_value_range'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_tone_value_range
      check (tone_value is null or tone_value between 0 and 100);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_buy_url_https'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_buy_url_https
      check (buy_url is null or buy_url ~* '^https://');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'posts_body_length'
      and conrelid = 'public.posts'::regclass
  ) then
    alter table public.posts
      add constraint posts_body_length
      check (char_length(body) between 1 and 500);
  end if;
end;
$web_constraints$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;
alter table public.saves enable row level security;
alter table public.post_reports enable row level security;

-- Replace the M2 policies with the web MVP's explicit public-read rules.
drop policy if exists "read_all_profiles" on public.profiles;
drop policy if exists "own_profile_upsert" on public.profiles;
drop policy if exists "own_profile_update" on public.profiles;
drop policy if exists "public_profiles_read" on public.profiles;
drop policy if exists "members_insert_own_profile" on public.profiles;
drop policy if exists "members_update_own_profile" on public.profiles;
drop policy if exists "members_delete_own_profile" on public.profiles;

create policy "public_profiles_read"
  on public.profiles for select to anon, authenticated
  using (true);
create policy "members_insert_own_profile"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "members_update_own_profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "members_delete_own_profile"
  on public.profiles for delete to authenticated
  using (id = auth.uid());

drop policy if exists "read_all_products" on public.products;
drop policy if exists "insert_products" on public.products;
drop policy if exists "public_products_read" on public.products;
drop policy if exists "members_insert_products" on public.products;
drop policy if exists "members_update_own_products" on public.products;
drop policy if exists "members_delete_own_products" on public.products;

create policy "public_products_read"
  on public.products for select to anon, authenticated
  using (true);
create policy "members_insert_products"
  on public.products for insert to authenticated
  with check (created_by = auth.uid());
create policy "members_update_own_products"
  on public.products for update to authenticated
  using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "members_delete_own_products"
  on public.products for delete to authenticated
  using (created_by = auth.uid());

drop policy if exists "read_all_posts" on public.posts;
drop policy if exists "own_posts_insert" on public.posts;
drop policy if exists "own_posts_delete" on public.posts;
drop policy if exists "public_posts_read" on public.posts;
drop policy if exists "members_insert_own_posts" on public.posts;
drop policy if exists "members_update_own_posts" on public.posts;
drop policy if exists "members_delete_own_posts" on public.posts;

create policy "public_posts_read"
  on public.posts for select to anon, authenticated
  using (true);
create policy "members_insert_own_posts"
  on public.posts for insert to authenticated
  with check (author_id = auth.uid());
create policy "members_update_own_posts"
  on public.posts for update to authenticated
  using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "members_delete_own_posts"
  on public.posts for delete to authenticated
  using (author_id = auth.uid());

-- Saves are private to each signed-in member.
drop policy if exists "read_all_saves" on public.saves;
drop policy if exists "own_saves" on public.saves;
drop policy if exists "members_manage_own_saves" on public.saves;

create policy "members_manage_own_saves"
  on public.saves for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table public.post_reports enable row level security;
drop policy if exists "members_insert_own_reports" on public.post_reports;
drop policy if exists "members_read_own_reports" on public.post_reports;

create policy "members_insert_own_reports"
  on public.post_reports for insert to authenticated
  with check (reporter_id = auth.uid());
create policy "members_read_own_reports"
  on public.post_reports for select to authenticated
  using (reporter_id = auth.uid());

grant select on public.profiles, public.products, public.posts
  to anon, authenticated;
grant insert, update, delete on public.profiles, public.products, public.posts
  to authenticated;
grant select, insert, delete on public.saves to authenticated;
grant select, insert on public.post_reports to authenticated;
