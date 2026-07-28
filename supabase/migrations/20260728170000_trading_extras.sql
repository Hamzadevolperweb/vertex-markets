-- Pending payments, tournaments, IP blacklist, trade admin tools support

create table if not exists tournaments (
  id text primary key default ('tnm_' || substr(gen_random_uuid()::text, 1, 12)),
  name text not null,
  description text,
  entry_fee numeric(18, 2) not null default 0,
  prize_pool numeric(18, 2) not null default 0,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'UPCOMING',
  created_at timestamptz not null default now()
);

create table if not exists tournament_entries (
  id text primary key default ('tne_' || substr(gen_random_uuid()::text, 1, 12)),
  tournament_id text not null references tournaments(id) on delete cascade,
  user_id text not null references trading_profiles(user_id),
  score numeric(18, 2) not null default 0,
  rank integer,
  joined_at timestamptz not null default now(),
  unique (tournament_id, user_id)
);

create table if not exists ip_blacklist (
  id text primary key default ('ipb_' || substr(gen_random_uuid()::text, 1, 12)),
  ip inet not null unique,
  reason text,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists payment_events (
  id text primary key default ('pay_' || substr(gen_random_uuid()::text, 1, 12)),
  provider text not null,
  event_type text not null,
  external_id text,
  payload jsonb not null default '{}'::jsonb,
  processed boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists payment_events_external_idx
  on payment_events(provider, external_id)
  where external_id is not null;

insert into tournaments (name, description, entry_fee, prize_pool, starts_at, ends_at, status)
select * from (values
  (
    'Weekly Forex Sprint',
    'Trade major FX pairs. Highest net profit wins.',
    25::numeric,
    2500::numeric,
    now() + interval '1 day',
    now() + interval '8 days',
    'UPCOMING'
  ),
  (
    'Crypto Blitz',
    'BTC/ETH binary desk tournament.',
    10::numeric,
    1000::numeric,
    now() - interval '1 hour',
    now() + interval '2 days',
    'LIVE'
  )
) as v(name, description, entry_fee, prize_pool, starts_at, ends_at, status)
where not exists (select 1 from tournaments limit 1);
