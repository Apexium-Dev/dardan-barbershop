-- Deploy the verified-staff-session app changes BEFORE applying this migration.
begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
create or replace function private.is_barber()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'barber');
$$;
revoke all on function private.is_barber() from public, anon;
grant execute on function private.is_barber() to authenticated;

-- Replace the overlapping historical policies, including public read/write rules.
do $$
declare p record;
begin
  for p in select tablename, policyname from pg_policies
    where schemaname = 'public' and tablename in ('profiles', 'visits', 'gallery_photos')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end;
$$;
alter table public.profiles enable row level security;
alter table public.visits enable row level security;
alter table public.gallery_photos enable row level security;
revoke all on public.profiles, public.visits, public.gallery_photos from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant update (first_name, last_name, phone) on public.profiles to authenticated;
grant select, insert on public.visits to authenticated;
grant select on public.gallery_photos to anon, authenticated;
grant insert, delete on public.gallery_photos to authenticated;

create policy profiles_read on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select private.is_barber()));
create policy profiles_edit on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy visits_read on public.visits for select to authenticated
using (user_id = (select auth.uid()) or (select private.is_barber()));
alter table public.visits alter column barber_id set default auth.uid();
create policy visits_insert on public.visits for insert to authenticated
with check ((select private.is_barber()) and barber_id = (select auth.uid()));
create policy gallery_read on public.gallery_photos for select to anon, authenticated using (true);
alter table public.gallery_photos alter column uploaded_by set default auth.uid();
create policy gallery_insert on public.gallery_photos for insert to authenticated
with check ((select private.is_barber()) and uploaded_by = (select auth.uid()));
create policy gallery_delete on public.gallery_photos for delete to authenticated
using ((select private.is_barber()));

drop policy if exists "Anyone can upload gallery photos" on storage.objects;
drop policy if exists "Anyone can delete gallery photos" on storage.objects;
drop policy if exists "Barbers can upload gallery photos" on storage.objects;
drop policy if exists "Barbers can delete gallery photos" on storage.objects;
drop policy if exists "Public read access to gallery photos" on storage.objects;
create policy gallery_objects_read on storage.objects for select to anon, authenticated
using (bucket_id = 'gallery');
create policy gallery_objects_insert on storage.objects for insert to authenticated
with check (bucket_id = 'gallery' and (select private.is_barber()));
create policy gallery_objects_delete on storage.objects for delete to authenticated
using (bucket_id = 'gallery' and (select private.is_barber()));

create or replace function private.validate_visit()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  customer public.profiles;
  paid bigint;
  redeemed bigint;
begin
  -- Serialize all visits for one customer before calculating available rewards.
  select * into customer from public.profiles where id = new.user_id for update;
  if not found or customer.role <> 'member' then
    raise exception 'Customer must be an existing member' using errcode = '23514';
  end if;
  if length(new.notes) > 2000 then
    raise exception 'Visit notes are too long' using errcode = '23514';
  end if;
  new.is_redemption := coalesce(new.is_redemption, false);
  if new.is_redemption then
    select count(*) filter (where not is_redemption), count(*) filter (where is_redemption)
    into paid, redeemed from public.visits where user_id = new.user_id;
    if paid / 10 <= redeemed then
      raise exception 'No free haircut available' using errcode = '23514';
    end if;
  end if;
  new.customer_email := customer.email;
  new.customer_name := trim(coalesce(customer.first_name, '') || ' ' || coalesce(customer.last_name, ''));
  new.scanned_at := now();
  return new;
end;
$$;
revoke all on function private.validate_visit() from public, anon, authenticated;
create trigger validate_visit before insert on public.visits
for each row execute function private.validate_visit();

notify pgrst, 'reload schema';
commit;
