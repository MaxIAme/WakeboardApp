-- WakeBoard initial schema (Supabase / Postgres + PostGIS)
create extension if not exists postgis;

-- Riders -------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  stance text check (stance in ('regular', 'goofy')),
  home_spot_id uuid,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Trick library ------------------------------------------------------------
create table public.tricks (
  id text primary key,                      -- slug, e.g. 'backroll'
  name text not null,
  aliases text[] not null default '{}',
  discipline text not null check (discipline in ('air', 'surface', 'rail', 'kicker', 'box')),
  difficulty smallint not null check (difficulty between 1 and 5),
  approach_edge text not null check (approach_edge in ('heelside', 'toeside')),
  summary text not null,
  prerequisites text[] not null default '{}',
  steps jsonb not null,                     -- TrickStep[]: handle / legs / body / detail
  common_mistakes text[] not null default '{}',
  poses jsonb not null,                     -- Pose[] keyframes for the 3D manikin
  video_url text,
  updated_at timestamptz not null default now()
);

create table public.trick_goals (
  user_id uuid not null references public.profiles on delete cascade,
  trick_id text not null references public.tricks on delete cascade,
  status text not null check (status in ('wishlist', 'learning', 'landed', 'mastered')),
  attempts integer not null default 0,
  how_i_landed_it text,
  landed_at timestamptz,
  proof_video_path text,                    -- storage bucket 'rider-videos'
  updated_at timestamptz not null default now(),
  primary key (user_id, trick_id)
);

-- Spots & park modules -----------------------------------------------------
create table public.spots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  location geography(point, 4326) not null,
  kind text not null check (kind in ('full-cable', 'two-tower', 'boat')),
  website text,
  verified boolean not null default false,
  created_by uuid references public.profiles,
  created_at timestamptz not null default now()
);
create index spots_location_idx on public.spots using gist (location);

alter table public.profiles
  add constraint profiles_home_spot_fk foreign key (home_spot_id) references public.spots on delete set null;

create table public.park_modules (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.spots on delete cascade,
  name text not null,
  type text not null check (type in ('kicker', 'slider', 'box', 'funbox', 'rail', 'pipe', 'air-trick')),
  level text not null check (level in ('beginner', 'intermediate', 'pro')),
  position real not null check (position between 0 and 1),  -- along the cable loop
  active boolean not null default true
);

-- Spots within `radius_km` of a point, nearest first.
create or replace function public.spots_near(lat double precision, lng double precision, radius_km double precision default 200)
returns setof public.spots language sql stable as $$
  select * from public.spots
  where st_dwithin(location, st_makepoint(lng, lat)::geography, radius_km * 1000)
  order by location <-> st_makepoint(lng, lat)::geography;
$$;

-- Challenges & contests ----------------------------------------------------
create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid not null references public.profiles,
  challenged_id uuid not null references public.profiles,
  trick_id text not null references public.tricks,
  challenger_video_path text not null,
  challenged_video_path text,
  status text not null default 'open' check (status in ('open', 'answered', 'expired', 'declined')),
  expires_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now()
);

create table public.contests (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles,
  title text not null,
  mode text not null check (mode in ('virtual', 'live')),
  spot_id uuid references public.spots,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  trick_ids text[] not null default '{}',
  rules text,
  check (mode = 'virtual' or spot_id is not null),
  check (ends_at > starts_at)
);

create table public.contest_entries (
  contest_id uuid not null references public.contests on delete cascade,
  rider_id uuid not null references public.profiles,
  video_path text,                          -- virtual contests
  score numeric(5, 2),                      -- set by judges
  primary key (contest_id, rider_id)
);

-- Marketplace & ads --------------------------------------------------------
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles,
  title text not null,
  description text,
  category text not null check (category in ('board', 'bindings', 'vest', 'wetsuit', 'helmet', 'other')),
  price_cents integer not null check (price_cents >= 0),
  currency char(3) not null default 'EUR',
  condition text not null check (condition in ('new', 'like-new', 'used', 'worn')),
  photo_paths text[] not null default '{}',
  location geography(point, 4326),
  status text not null default 'active' check (status in ('active', 'reserved', 'sold')),
  created_at timestamptz not null default now()
);

create table public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  advertiser text not null,                 -- wakeboard brand / shop
  title text not null,
  image_path text not null,
  target_url text not null,
  placement text not null check (placement in ('market', 'trick', 'spots')),
  starts_at timestamptz not null,
  ends_at timestamptz not null
);

-- Row Level Security -------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.tricks enable row level security;
alter table public.trick_goals enable row level security;
alter table public.spots enable row level security;
alter table public.park_modules enable row level security;
alter table public.challenges enable row level security;
alter table public.contests enable row level security;
alter table public.contest_entries enable row level security;
alter table public.listings enable row level security;
alter table public.ad_campaigns enable row level security;

create policy "public read" on public.profiles for select using (true);
create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "public read" on public.tricks for select using (true);

create policy "own goals" on public.trick_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "public read" on public.spots for select using (true);
create policy "riders add spots" on public.spots for insert with check (auth.uid() = created_by);
create policy "public read" on public.park_modules for select using (true);

create policy "participants" on public.challenges for select using (auth.uid() in (challenger_id, challenged_id));
create policy "send challenge" on public.challenges for insert with check (auth.uid() = challenger_id);
create policy "answer challenge" on public.challenges for update using (auth.uid() = challenged_id);

create policy "public read" on public.contests for select using (true);
create policy "organizer" on public.contests for all using (auth.uid() = organizer_id) with check (auth.uid() = organizer_id);
create policy "public read" on public.contest_entries for select using (true);
create policy "enter contest" on public.contest_entries for insert with check (auth.uid() = rider_id);

create policy "public read" on public.listings for select using (status <> 'sold' or auth.uid() = seller_id);
create policy "seller" on public.listings for all using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

create policy "active ads" on public.ad_campaigns for select using (now() between starts_at and ends_at);
