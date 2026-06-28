-- Create conversions table
create table conversions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  from_lang text not null,
  to_lang text not null,
  char_count integer,
  used_explain boolean default false,
  created_at timestamptz default now()
);

-- Create subscriptions table
create table subscriptions (
  user_id uuid references auth.users primary key,
  plan text default 'free' check (plan in ('free', 'pro')),
  dodo_customer_id text,
  dodo_subscription_id text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table conversions enable row level security;
alter table subscriptions enable row level security;

-- Create RLS Policies
create policy "users_own_conversions" on conversions
  for all using (auth.uid() = user_id);

create policy "users_own_subscription" on subscriptions
  for all using (auth.uid() = user_id);

-- Create performance indexes
create index idx_conversions_user_id_created_at on conversions(user_id, created_at desc);
create index idx_conversions_created_at on conversions(created_at desc);