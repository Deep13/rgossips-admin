-- Admin profiles table
create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null default 'admin' check (role in ('super_admin', 'admin', 'viewer')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table admin_profiles enable row level security;

-- Admins can read all admin profiles
create policy "Admins can read all profiles"
  on admin_profiles for select
  using (auth.uid() in (select id from admin_profiles));

-- Only super_admins can insert new admins
create policy "Super admins can insert"
  on admin_profiles for insert
  with check (
    auth.uid() in (select id from admin_profiles where role = 'super_admin')
  );

-- Only super_admins can delete admins
create policy "Super admins can delete"
  on admin_profiles for delete
  using (
    auth.uid() in (select id from admin_profiles where role = 'super_admin')
  );

-- Admins can update their own profile
create policy "Admins can update own profile"
  on admin_profiles for update
  using (auth.uid() = id);
