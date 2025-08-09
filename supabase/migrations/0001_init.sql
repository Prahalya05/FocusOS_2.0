-- FocusOS initial schema and RLS policies
-- Run this in Supabase SQL Editor, or via Supabase CLI migrations.

-- Extensions (ensure UUID generation is available)
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Users (profile) table, linked 1:1 with auth.users
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin','friend')),
  display_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- Automatically create a users row when an auth user signs up
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, role, display_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::text, 'friend'),
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

-- Friendspaces: 1 admin : N friendspaces; 1 friend_user_id per friendspace
create table if not exists public.friendspaces (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.users (id) on delete cascade,
  friend_user_id uuid not null references public.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  unique (admin_id, friend_user_id)
);

-- Tasks within a Friendspace
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  friendspace_id uuid not null references public.friendspaces (id) on delete cascade,
  created_by_user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  due_date date,
  proof_url text,
  timer_seconds integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_tasks_set_updated_at on public.tasks;
create trigger trg_tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- Learning resources (global, owned by an Admin)
create table if not exists public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  created_by_admin_id uuid not null references public.users (id) on delete cascade,
  type text not null check (type in ('youtube','article','pdf','github','notion','other')),
  url text not null,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Assignment + progress of resources per Friendspace
create table if not exists public.friendspace_resources (
  id uuid primary key default gen_random_uuid(),
  friendspace_id uuid not null references public.friendspaces (id) on delete cascade,
  resource_id uuid not null references public.learning_resources (id) on delete cascade,
  assigned_by_user_id uuid not null references public.users (id) on delete cascade,
  status text not null default 'assigned' check (status in ('assigned','in_progress','completed')),
  completion_percent integer not null default 0 check (completion_percent between 0 and 100),
  quiz_score integer,
  time_spent_seconds integer not null default 0,
  created_at timestamptz not null default now(),
  unique (friendspace_id, resource_id)
);

-- Mood logs per Friendspace (by user)
create table if not exists public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  friendspace_id uuid not null references public.friendspaces (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  log_date date not null default (current_date at time zone 'utc'),
  mood integer check (mood between 1 and 5),
  energy integer check (energy between 1 and 5),
  anxiety integer check (anxiety between 1 and 5),
  notes text,
  created_at timestamptz not null default now(),
  unique (friendspace_id, user_id, log_date)
);

-- XP logs per Friendspace (by user)
create table if not exists public.xp_logs (
  id uuid primary key default gen_random_uuid(),
  friendspace_id uuid not null references public.friendspaces (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  amount integer not null check (amount >= 0),
  category text not null check (category in ('task','habit','challenge','fear','streak','learning')),
  reason text,
  created_at timestamptz not null default now()
);

-- Streaks snapshot per Friendspace (by user + kind)
create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  friendspace_id uuid not null references public.friendspaces (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  kind text not null check (kind in ('task','habit','learning','journal','focus')),
  current_count integer not null default 0,
  longest_count integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (friendspace_id, user_id, kind)
);

-- Optional: friend/admin messages in a Friendspace
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  friendspace_id uuid not null references public.friendspaces (id) on delete cascade,
  sender_user_id uuid not null references public.users (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_tasks_friendspace_status on public.tasks (friendspace_id, status);
create index if not exists idx_fs_resources_friendspace_status on public.friendspace_resources (friendspace_id, status);
create index if not exists idx_mood_logs_friendspace_date on public.mood_logs (friendspace_id, log_date);
create index if not exists idx_xp_logs_friendspace_created on public.xp_logs (friendspace_id, created_at);
create index if not exists idx_messages_friendspace_created on public.messages (friendspace_id, created_at);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.friendspaces enable row level security;
alter table public.tasks enable row level security;
alter table public.learning_resources enable row level security;
alter table public.friendspace_resources enable row level security;
alter table public.mood_logs enable row level security;
alter table public.xp_logs enable row level security;
alter table public.streaks enable row level security;
alter table public.messages enable row level security;

-- Users: a user can only see their own profile
drop policy if exists users_select_self on public.users;
create policy users_select_self on public.users
for select using (id = auth.uid());

-- Friendspaces policies
drop policy if exists friendspaces_select_admin on public.friendspaces;
drop policy if exists friendspaces_select_friend on public.friendspaces;
drop policy if exists friendspaces_insert_admin on public.friendspaces;
drop policy if exists friendspaces_update_admin on public.friendspaces;
drop policy if exists friendspaces_delete_admin on public.friendspaces;

create policy friendspaces_select_admin on public.friendspaces
for select using (admin_id = auth.uid());

create policy friendspaces_select_friend on public.friendspaces
for select using (friend_user_id = auth.uid());

create policy friendspaces_insert_admin on public.friendspaces
for insert with check (
  admin_id = auth.uid() and exists (
    select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'
  )
);

create policy friendspaces_update_admin on public.friendspaces
for update using (admin_id = auth.uid());

create policy friendspaces_delete_admin on public.friendspaces
for delete using (admin_id = auth.uid());

-- Tasks: membership of the Friendspace governs access
drop policy if exists tasks_select_members on public.tasks;
drop policy if exists tasks_insert_members on public.tasks;
drop policy if exists tasks_update_members on public.tasks;
drop policy if exists tasks_delete_members on public.tasks;

create policy tasks_select_members on public.tasks
for select using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = tasks.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy tasks_insert_members on public.tasks
for insert with check (
  created_by_user_id = auth.uid() and exists (
    select 1 from public.friendspaces fs
    where fs.id = tasks.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy tasks_update_members on public.tasks
for update using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = tasks.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy tasks_delete_members on public.tasks
for delete using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = tasks.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

-- Learning resources: only Admins create; Friends can read if assigned
drop policy if exists lr_select_access on public.learning_resources;
drop policy if exists lr_insert_admin on public.learning_resources;
drop policy if exists lr_update_admin on public.learning_resources;
drop policy if exists lr_delete_admin on public.learning_resources;

create policy lr_select_access on public.learning_resources
for select using (
  -- Admin sees their own resources
  created_by_admin_id = auth.uid()
  or
  -- Friend sees resources assigned to a Friendspace they belong to
  exists (
    select 1 from public.friendspace_resources fr
    join public.friendspaces fs on fs.id = fr.friendspace_id
    where fr.resource_id = learning_resources.id
      and (fs.friend_user_id = auth.uid() or fs.admin_id = auth.uid())
  )
);

create policy lr_insert_admin on public.learning_resources
for insert with check (
  created_by_admin_id = auth.uid()
  and exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

create policy lr_update_admin on public.learning_resources
for update using (created_by_admin_id = auth.uid());

create policy lr_delete_admin on public.learning_resources
for delete using (created_by_admin_id = auth.uid());

-- Friendspace resources: Admin assigns; Friend may self-assign to their own Friendspace
drop policy if exists fr_select_members on public.friendspace_resources;
drop policy if exists fr_insert_members on public.friendspace_resources;
drop policy if exists fr_update_members on public.friendspace_resources;
drop policy if exists fr_delete_admin on public.friendspace_resources;

create policy fr_select_members on public.friendspace_resources
for select using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = friendspace_resources.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy fr_insert_members on public.friendspace_resources
for insert with check (
  assigned_by_user_id = auth.uid()
  and exists (
    select 1 from public.friendspaces fs
    where fs.id = friendspace_resources.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy fr_update_members on public.friendspace_resources
for update using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = friendspace_resources.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy fr_delete_admin on public.friendspace_resources
for delete using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = friendspace_resources.friendspace_id
      and fs.admin_id = auth.uid()
  )
);

-- Mood logs
drop policy if exists mood_select_members on public.mood_logs;
drop policy if exists mood_insert_members on public.mood_logs;
drop policy if exists mood_update_owner_or_admin on public.mood_logs;
drop policy if exists mood_delete_admin on public.mood_logs;

create policy mood_select_members on public.mood_logs
for select using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = mood_logs.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy mood_insert_members on public.mood_logs
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.friendspaces fs
    where fs.id = mood_logs.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy mood_update_owner_or_admin on public.mood_logs
for update using (
  user_id = auth.uid() or exists (
    select 1 from public.friendspaces fs where fs.id = mood_logs.friendspace_id and fs.admin_id = auth.uid()
  )
);

create policy mood_delete_admin on public.mood_logs
for delete using (
  exists (
    select 1 from public.friendspaces fs where fs.id = mood_logs.friendspace_id and fs.admin_id = auth.uid()
  )
);

-- XP logs
drop policy if exists xp_select_members on public.xp_logs;
drop policy if exists xp_insert_members on public.xp_logs;

create policy xp_select_members on public.xp_logs
for select using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = xp_logs.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy xp_insert_members on public.xp_logs
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.friendspaces fs
    where fs.id = xp_logs.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

-- Streaks
drop policy if exists streaks_select_members on public.streaks;
drop policy if exists streaks_upsert_members on public.streaks;

create policy streaks_select_members on public.streaks
for select using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = streaks.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy streaks_upsert_members on public.streaks
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.friendspaces fs
    where fs.id = streaks.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
)
to authenticated;

grant update on public.streaks to authenticated; -- update allowed; RLS still applies

-- Messages
drop policy if exists messages_select_members on public.messages;
drop policy if exists messages_insert_members on public.messages;

create policy messages_select_members on public.messages
for select using (
  exists (
    select 1 from public.friendspaces fs
    where fs.id = messages.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

create policy messages_insert_members on public.messages
for insert with check (
  sender_user_id = auth.uid()
  and exists (
    select 1 from public.friendspaces fs
    where fs.id = messages.friendspace_id
      and (fs.admin_id = auth.uid() or fs.friend_user_id = auth.uid())
  )
);

-- Storage buckets (create manually in Dashboard or via SQL; policies to be added later)
-- select storage.create_bucket('proofs', public := false);
-- select storage.create_bucket('journals', public := false);
-- select storage.create_bucket('avatars', public := false);


