-- Removes the "must be logged in as a barber" requirement from writes made
-- by the /barber panel. That panel is now gated only by its in-app PIN pad,
-- not a Supabase login, so the database must allow these writes from the
-- public "anon" role directly.
-- Run this once in Supabase Dashboard > SQL Editor > New query.
--
-- Security note: after this runs, anyone who calls the Supabase REST API
-- directly with the site's public anon key (visible in any browser) can
-- upload gallery photos or log visits, bypassing the PIN entirely. The PIN
-- only gates the page UI, not the database. This is an accepted tradeoff,
-- not an oversight — see the "remove auth entirely" option this replaces.

-- ── Storage: gallery bucket ──
drop policy if exists "Barbers can upload gallery photos" on storage.objects;
drop policy if exists "Anyone can upload gallery photos" on storage.objects;
create policy "Anyone can upload gallery photos"
on storage.objects for insert
with check (bucket_id = 'gallery');

drop policy if exists "Barbers can delete gallery photos" on storage.objects;
drop policy if exists "Anyone can delete gallery photos" on storage.objects;
create policy "Anyone can delete gallery photos"
on storage.objects for delete
using (bucket_id = 'gallery');

-- ── gallery_photos table ──
drop policy if exists "Barbers can insert gallery photo rows" on public.gallery_photos;
drop policy if exists "Anyone can insert gallery photo rows" on public.gallery_photos;
create policy "Anyone can insert gallery photo rows"
on public.gallery_photos for insert
with check (true);

drop policy if exists "Barbers can delete gallery photo rows" on public.gallery_photos;
drop policy if exists "Anyone can delete gallery photo rows" on public.gallery_photos;
create policy "Anyone can delete gallery photo rows"
on public.gallery_photos for delete
using (true);

-- ── visits table ──
-- Original policy names for this table aren't tracked in this repo (set up
-- manually when the scanner feature was first built), so rather than guess
-- names to drop, this adds fresh permissive policies. Postgres OR's multiple
-- permissive policies together, so these alone are enough to allow the
-- read/insert through even if an old barber-only policy is still present.
alter table if exists public.visits enable row level security;

drop policy if exists "Anyone can read visits" on public.visits;
create policy "Anyone can read visits"
on public.visits for select
using (true);

drop policy if exists "Anyone can insert visits" on public.visits;
create policy "Anyone can insert visits"
on public.visits for insert
with check (true);
