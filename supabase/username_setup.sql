-- Adds username-based signup/login (no email required from the customer)
-- and lets self-registration write its own profiles row directly, since
-- there's no reliable trigger populating `profiles` from auth.users today.
-- Run this once in Supabase Dashboard > SQL Editor > New query.

alter table public.profiles add column if not exists username text;

create unique index if not exists profiles_username_key
on public.profiles (lower(username))
where username is not null;

-- A user may create/update their own profiles row (registration now does
-- this explicitly from the client instead of relying on a DB trigger).
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Public read access is required for: resolving a username to an email at
-- login, and the barber panel's "search client by name/username" feature.
-- Harmless if a public-read policy already exists (permissive policies OR
-- together in Postgres RLS).
drop policy if exists "Public read access to profiles" on public.profiles;
create policy "Public read access to profiles"
on public.profiles for select
using (true);
