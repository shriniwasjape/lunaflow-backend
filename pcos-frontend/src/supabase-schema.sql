-- LunaFlow Database Schema for Supabase

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User Profiles Table
create table public.user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null,
  last_period date,
  pcos_type text check (pcos_type in ('insulin', 'inflammatory', 'adrenal', 'post-pill')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Cycle History Table
create table public.cycle_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  start_date date not null,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Symptoms Log Table
create table public.symptoms_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  log_date date not null,
  symptoms jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AI Chat History Table (optional - for storing conversation history)
create table public.chat_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  message_type text check (message_type in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index user_profiles_user_id_idx on public.user_profiles(user_id);
create index cycle_history_user_id_idx on public.cycle_history(user_id);
create index cycle_history_start_date_idx on public.cycle_history(start_date desc);
create index symptoms_log_user_id_idx on public.symptoms_log(user_id);
create index symptoms_log_date_idx on public.symptoms_log(log_date desc);
create index chat_history_user_id_idx on public.chat_history(user_id);
create index chat_history_created_at_idx on public.chat_history(created_at desc);

-- Row Level Security (RLS) Policies
alter table public.user_profiles enable row level security;
alter table public.cycle_history enable row level security;
alter table public.symptoms_log enable row level security;
alter table public.chat_history enable row level security;

-- User Profiles Policies
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);

-- Cycle History Policies
create policy "Users can view their own cycle history"
  on public.cycle_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cycle data"
  on public.cycle_history for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cycle data"
  on public.cycle_history for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cycle data"
  on public.cycle_history for delete
  using (auth.uid() = user_id);

-- Symptoms Log Policies
create policy "Users can view their own symptoms"
  on public.symptoms_log for select
  using (auth.uid() = user_id);

create policy "Users can insert their own symptoms"
  on public.symptoms_log for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own symptoms"
  on public.symptoms_log for update
  using (auth.uid() = user_id);

create policy "Users can delete their own symptoms"
  on public.symptoms_log for delete
  using (auth.uid() = user_id);

-- Chat History Policies
create policy "Users can view their own chat history"
  on public.chat_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own chat messages"
  on public.chat_history for insert
  with check (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_updated_at
  before update on public.user_profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.cycle_history
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.symptoms_log
  for each row
  execute function public.handle_updated_at();
