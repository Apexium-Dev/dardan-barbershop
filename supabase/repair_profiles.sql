-- Incremental repair for the existing project; preserves accounts and visits.
-- Apply through a tracked Supabase migration. No table recreation required.
begin;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, username, first_name, last_name, phone, role)
  values (
    new.id, new.email,
    nullif(lower(trim(new.raw_user_meta_data ->> 'username')), ''),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    'member'
  ) on conflict (id) do update set
    email = excluded.email,
    username = coalesce(public.profiles.username, excluded.username),
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    phone = excluded.phone;
  -- Existing roles are preserved; user-editable metadata never grants staff access.
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_new_user();

-- Restore missing profiles from Auth; never infer staff roles from user metadata.
insert into public.profiles (id, email, username, first_name, last_name, phone, role)
select id, email, nullif(lower(trim(raw_user_meta_data ->> 'username')), ''),
  coalesce(raw_user_meta_data ->> 'first_name', ''),
  coalesce(raw_user_meta_data ->> 'last_name', ''),
  coalesce(raw_user_meta_data ->> 'phone', ''), 'member'
from auth.users
on conflict (id) do nothing;

update public.profiles p
set username = nullif(lower(trim(u.raw_user_meta_data ->> 'username')), '')
from auth.users u
where p.id = u.id and p.username is null
  and nullif(trim(u.raw_user_meta_data ->> 'username'), '') is not null;

-- Browser profile writes may edit contact details, never identity or staff roles.
revoke insert, update on public.profiles from public, anon, authenticated;
grant update (first_name, last_name, phone) on public.profiles to authenticated;

create index if not exists visits_user_scanned_at_idx
  on public.visits (user_id, scanned_at desc);
create index if not exists visits_barber_id_idx on public.visits (barber_id);
create index if not exists visits_scanned_at_idx on public.visits (scanned_at desc);
create index if not exists gallery_photos_uploaded_by_idx on public.gallery_photos (uploaded_by);
create index if not exists gallery_photos_created_at_idx on public.gallery_photos (created_at desc);

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'visits') then
    alter publication supabase_realtime add table public.visits;
  end if;
end;
$$;

commit;
