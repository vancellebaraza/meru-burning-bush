-- Burning Bush Ministries International: database design
--
-- Run this whole file in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- It is safe to re-run: tables and indexes use IF NOT EXISTS, functions use CREATE OR REPLACE,
-- and triggers and policies are dropped and recreated.
--
-- This file lives in db/ on purpose. supabase/migrations/ is managed by Lovable.
--
-- AFTER the first run, make yourself an admin. Sign in once so a row exists under
-- Authentication -> Users, copy your user id (uuid), then run this one line:
--
--   insert into public.admins (user_id) values ('PASTE-USER-UUID-HERE') on conflict do nothing;
--
-- (The SQL editor runs as a privileged role, so this works even though clients cannot write
-- to public.admins.)

begin;

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  description     text not null default '',
  starts_at       timestamptz not null,
  ends_at         timestamptz,
  location        text not null default '',
  cover_image_key text,
  is_published    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint events_ends_after_start check (ends_at is null or ends_at >= starts_at)
);

create table if not exists public.fundraisers (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  slug                 text not null unique,
  description          text not null default '',
  goal_amount_kes      bigint not null,
  raised_amount_kes    bigint not null default 0,
  deadline             date,
  payment_instructions text not null default '',
  cover_image_key      text,
  status               text not null default 'active',
  is_published         boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint fundraisers_goal_non_negative check (goal_amount_kes >= 0),
  constraint fundraisers_raised_non_negative check (raised_amount_kes >= 0),
  constraint fundraisers_status_valid check (status in ('active', 'completed', 'closed'))
);

create table if not exists public.photos (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid references public.events (id) on delete cascade,
  fundraiser_id uuid references public.fundraisers (id) on delete cascade,
  r2_key        text not null,
  caption       text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  -- A photo belongs to at most one parent.
  constraint photos_single_parent check (num_nonnulls(event_id, fundraiser_id) <= 1)
);

-- ---------------------------------------------------------------------------
-- 2. Indexes (every foreign key, plus the columns we filter or sort by)
-- ---------------------------------------------------------------------------

create index if not exists events_is_published_starts_at_idx on public.events (is_published, starts_at);
create index if not exists fundraisers_is_published_status_idx on public.fundraisers (is_published, status);
create index if not exists photos_event_id_idx on public.photos (event_id, sort_order);
create index if not exists photos_fundraiser_id_idx on public.photos (fundraiser_id, sort_order);
-- admins.user_id is the primary key, so it is already indexed.

-- ---------------------------------------------------------------------------
-- 3. updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists fundraisers_set_updated_at on public.fundraisers;
create trigger fundraisers_set_updated_at
  before update on public.fundraisers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Admin check
-- ---------------------------------------------------------------------------

-- SECURITY DEFINER so it can read public.admins whatever the caller's own access is.
-- search_path is pinned to '' and every object is schema-qualified.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Table privileges (RLS below is the real gate; this is defence in depth)
-- ---------------------------------------------------------------------------

revoke all on public.admins, public.events, public.fundraisers, public.photos from anon, authenticated;

grant select on public.events, public.fundraisers, public.photos to anon;
grant select, insert, update, delete on public.events, public.fundraisers, public.photos to authenticated;
-- Signed-in users may read admins (only their own row, via RLS). No client writes, ever.
grant select on public.admins to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Row level security
-- ---------------------------------------------------------------------------

alter table public.admins      enable row level security;
alter table public.events      enable row level security;
alter table public.fundraisers enable row level security;
alter table public.photos      enable row level security;

-- admins: a user can read only their own row. No insert/update/delete policies exist,
-- so every client write is denied.
drop policy if exists "admins: read own row" on public.admins;
create policy "admins: read own row" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- events
drop policy if exists "events: public reads published" on public.events;
create policy "events: public reads published" on public.events
  for select to anon, authenticated
  using (is_published or (select public.is_admin()));

drop policy if exists "events: admins insert" on public.events;
create policy "events: admins insert" on public.events
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "events: admins update" on public.events;
create policy "events: admins update" on public.events
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "events: admins delete" on public.events;
create policy "events: admins delete" on public.events
  for delete to authenticated
  using ((select public.is_admin()));

-- fundraisers
drop policy if exists "fundraisers: public reads published" on public.fundraisers;
create policy "fundraisers: public reads published" on public.fundraisers
  for select to anon, authenticated
  using (is_published or (select public.is_admin()));

drop policy if exists "fundraisers: admins insert" on public.fundraisers;
create policy "fundraisers: admins insert" on public.fundraisers
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "fundraisers: admins update" on public.fundraisers;
create policy "fundraisers: admins update" on public.fundraisers
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "fundraisers: admins delete" on public.fundraisers;
create policy "fundraisers: admins delete" on public.fundraisers
  for delete to authenticated
  using ((select public.is_admin()));

-- photos: visible when the parent event or fundraiser is published. The subqueries run under
-- the caller's own RLS, which already limits non-admins to published parents. Photos with no
-- parent are visible to admins only.
drop policy if exists "photos: public reads published parent" on public.photos;
create policy "photos: public reads published parent" on public.photos
  for select to anon, authenticated
  using (
    (select public.is_admin())
    or (event_id is not null and exists (
      select 1 from public.events e where e.id = photos.event_id and e.is_published
    ))
    or (fundraiser_id is not null and exists (
      select 1 from public.fundraisers f where f.id = photos.fundraiser_id and f.is_published
    ))
  );

drop policy if exists "photos: admins insert" on public.photos;
create policy "photos: admins insert" on public.photos
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "photos: admins update" on public.photos;
create policy "photos: admins update" on public.photos
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "photos: admins delete" on public.photos;
create policy "photos: admins delete" on public.photos
  for delete to authenticated
  using ((select public.is_admin()));

commit;
