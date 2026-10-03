create extension if not exists "pgcrypto";

create type public.alumni_status as enum ('pending','approved','rejected');

create table if not exists public.alumni (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  bilsem_name text,
  graduation_year int,
  university text,
  department text,
  city text,
  country text default 'Türkiye',
  latitude double precision,
  longitude double precision,
  location_visibility text not null default 'city',
  bio text,
  story text,
  interests text[] default '{}',
  mentoring_areas text[] default '{}',
  photo_url text,
  status public.alumni_status not null default 'pending',
  is_featured boolean not null default false,
  is_in_book boolean not null default true,
  approved_at timestamptz,
  approved_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists alumni_status_idx on public.alumni(status);
create index if not exists alumni_location_idx on public.alumni(latitude,longitude);
create index if not exists alumni_city_idx on public.alumni(city);

alter table public.alumni enable row level security;

drop policy if exists "public read approved alumni" on public.alumni;
create policy "public read approved alumni"
on public.alumni for select to anon, authenticated
using (status='approved');

drop policy if exists "users insert own pending profile" on public.alumni;
create policy "users insert own pending profile"
on public.alumni for insert to authenticated
with check (auth.uid()=id and status='pending');

drop policy if exists "users update own profile" on public.alumni;
create policy "users update own profile"
on public.alumni for update to authenticated
using (auth.uid()=id)
with check (auth.uid()=id and status <> 'approved');

-- Server-side admin actions use SUPABASE_SERVICE_ROLE_KEY.
-- Never expose that key in browser code.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  city text,
  country text,
  starts_at timestamptz,
  url text,
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "public read events" on public.events for select to anon, authenticated using (true);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at=now(); return new; end; $$;

drop trigger if exists alumni_updated_at on public.alumni;
create trigger alumni_updated_at before update on public.alumni
for each row execute function public.set_updated_at();
