-- Trading platform core schema (wallets, binary trades, ledger, KYC, notifications)

create extension if not exists "pgcrypto";

do $$ begin
  create type trade_direction as enum ('UP', 'DOWN');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type trade_status as enum ('OPEN', 'WON', 'LOST', 'CANCELLED', 'REFUNDED');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type tx_type as enum (
    'DEPOSIT', 'WITHDRAWAL', 'TRADE_LOCK', 'TRADE_SETTLEMENT',
    'TRADE_REFUND', 'BONUS', 'REFERRAL_REWARD', 'ADJUSTMENT'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type money_status as enum ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REJECTED');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type kyc_status as enum ('NONE', 'PENDING', 'APPROVED', 'REJECTED');
exception when duplicate_object then null;
end $$;

create table if not exists trading_profiles (
  user_id text primary key,
  email text not null,
  display_name text,
  phone text,
  role text not null default 'Customer',
  two_fa_enabled boolean not null default false,
  two_fa_secret text,
  referral_code text unique,
  referred_by text,
  kyc_status kyc_status not null default 'NONE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wallets (
  id text primary key default ('wal_' || substr(gen_random_uuid()::text, 1, 12)),
  user_id text not null unique references trading_profiles(user_id) on delete cascade,
  currency text not null default 'USD',
  balance numeric(18, 2) not null default 0,
  bonus_balance numeric(18, 2) not null default 0,
  locked_balance numeric(18, 2) not null default 0,
  updated_at timestamptz not null default now(),
  constraint wallets_balances_nonneg check (
    balance >= 0 and bonus_balance >= 0 and locked_balance >= 0
  )
);

create table if not exists trading_assets (
  id text primary key default ('asset_' || substr(gen_random_uuid()::text, 1, 12)),
  symbol text not null unique,
  name text not null,
  category text not null default 'Forex',
  payout_percent numeric(5, 2) not null default 80,
  min_amount numeric(18, 2) not null default 1,
  max_amount numeric(18, 2) not null default 10000,
  expiry_options_sec integer[] not null default '{60,180,300,900,1800,3600}',
  active boolean not null default true,
  is_otc boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists trades (
  id text primary key default ('trd_' || substr(gen_random_uuid()::text, 1, 12)),
  user_id text not null references trading_profiles(user_id),
  asset_id text not null references trading_assets(id),
  symbol text not null,
  direction trade_direction not null,
  amount numeric(18, 2) not null,
  payout_percent numeric(5, 2) not null,
  entry_price numeric(18, 8) not null,
  exit_price numeric(18, 8),
  expiry_seconds integer not null,
  opened_at timestamptz not null default now(),
  expires_at timestamptz not null,
  settled_at timestamptz,
  status trade_status not null default 'OPEN',
  payout_amount numeric(18, 2) not null default 0,
  result text,
  created_at timestamptz not null default now()
);

create index if not exists trades_user_idx on trades(user_id);
create index if not exists trades_status_expires_idx on trades(status, expires_at);

create table if not exists ledger_transactions (
  id text primary key default ('txn_' || substr(gen_random_uuid()::text, 1, 12)),
  user_id text not null references trading_profiles(user_id),
  type tx_type not null,
  amount numeric(18, 2) not null,
  balance_after numeric(18, 2) not null,
  reference_id text,
  status money_status not null default 'COMPLETED',
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ledger_user_idx on ledger_transactions(user_id, created_at desc);

create table if not exists deposits (
  id text primary key default ('dep_' || substr(gen_random_uuid()::text, 1, 12)),
  user_id text not null references trading_profiles(user_id),
  amount numeric(18, 2) not null,
  method text not null default 'manual',
  provider_ref text,
  status money_status not null default 'PENDING',
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists withdrawals (
  id text primary key default ('wd_' || substr(gen_random_uuid()::text, 1, 12)),
  user_id text not null references trading_profiles(user_id),
  amount numeric(18, 2) not null,
  method text not null default 'bank',
  account_details jsonb not null default '{}'::jsonb,
  status money_status not null default 'PENDING',
  approved_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists kyc_submissions (
  id text primary key default ('kyc_' || substr(gen_random_uuid()::text, 1, 12)),
  user_id text not null references trading_profiles(user_id),
  document_type text not null,
  document_url text,
  selfie_url text,
  status kyc_status not null default 'PENDING',
  reviewed_by text,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key default ('ntf_' || substr(gen_random_uuid()::text, 1, 12)),
  user_id text not null references trading_profiles(user_id),
  type text not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on notifications(user_id, created_at desc);

create table if not exists referrals (
  id text primary key default ('ref_' || substr(gen_random_uuid()::text, 1, 12)),
  referrer_id text not null references trading_profiles(user_id),
  referred_id text not null unique references trading_profiles(user_id),
  status text not null default 'PENDING',
  reward_amount numeric(18, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists platform_settings (
  key text primary key,
  value jsonb not null,
  updated_by text,
  updated_at timestamptz not null default now()
);

-- Seed default binary assets
insert into trading_assets (symbol, name, category, payout_percent, is_otc) values
  ('EURUSD', 'Euro / US Dollar', 'Forex', 80, false),
  ('GBPUSD', 'British Pound / US Dollar', 'Forex', 80, false),
  ('USDJPY', 'US Dollar / Japanese Yen', 'Forex', 78, false),
  ('AUDUSD', 'Australian Dollar / US Dollar', 'Forex', 78, false),
  ('XAUUSD', 'Gold / US Dollar', 'Commodities', 82, false),
  ('BTCUSD', 'Bitcoin / US Dollar', 'Crypto', 75, false),
  ('ETHUSD', 'Ethereum / US Dollar', 'Crypto', 75, false),
  ('EURUSD_OTC', 'Euro / US Dollar OTC', 'Forex', 85, true),
  ('GBPUSD_OTC', 'British Pound / US Dollar OTC', 'Forex', 85, true),
  ('BTCUSD_OTC', 'Bitcoin / US Dollar OTC', 'Crypto', 80, true)
on conflict (symbol) do nothing;

insert into platform_settings (key, value) values
  ('trading', '{"enabled": true, "defaultPayoutPercent": 80, "minTradeAmount": 1, "maxTradeAmount": 10000}'::jsonb),
  ('wallet', '{"demoStartingBalance": 10000, "minDeposit": 10, "minWithdrawal": 20, "referralReward": 25}'::jsonb)
on conflict (key) do nothing;
