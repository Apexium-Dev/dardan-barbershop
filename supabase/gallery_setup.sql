-- Gallery feature: storage bucket + policies + metadata table.
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Requires the existing `public.profiles` table with an `id` (uuid, matches
-- auth.users.id) and `role` column, already used by the barber scanner feature.

-- 1. Storage bucket for gallery photos (public read, 10MB limit, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do nothing;

-- 2. Storage policies: anyone can view, only barbers can upload/delete
create policy "Public read access to gallery photos"
on storage.objects for select
using (bucket_id = 'gallery');

create policy "Barbers can upload gallery photos"
on storage.objects for insert
with check (
  bucket_id = 'gallery'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'barber'
  )
);

create policy "Barbers can delete gallery photos"
on storage.objects for delete
using (
  bucket_id = 'gallery'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'barber'
  )
);

-- 3. Metadata table
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  caption text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;

create policy "Public read access to gallery photo rows"
on public.gallery_photos for select
using (true);

create policy "Barbers can insert gallery photo rows"
on public.gallery_photos for insert
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'barber'
  )
);

create policy "Barbers can delete gallery photo rows"
on public.gallery_photos for delete
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'barber'
  )
);
