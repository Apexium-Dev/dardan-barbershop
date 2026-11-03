-- Run as postgres in SQL Editor. All fixture changes are rolled back.
begin;

do $$
declare
  test_id uuid := gen_random_uuid();
  test_username text := 'test_' || left(replace(test_id::text, '-', ''), 12);
  profile public.profiles;
begin
  perform set_config('test.profile_id', test_id::text, true);
  insert into auth.users (id, email, raw_user_meta_data)
  values (test_id, test_username || '@dardan-user.local',
    jsonb_build_object('username', test_username, 'first_name', 'Before', 'role', 'barber'));
  select * into strict profile from public.profiles where id = test_id;
  if profile.username <> test_username or profile.role <> 'member' then
    raise exception 'Signup must save username and ignore metadata role';
  end if;

  update auth.users set raw_user_meta_data = raw_user_meta_data ||
    '{"first_name":"After","last_name":"Test","phone":"+38970000000","role":"barber"}'::jsonb
  where id = test_id;
  select * into strict profile from public.profiles where id = test_id;
  if profile.first_name <> 'After' or profile.last_name <> 'Test'
    or profile.phone <> '+38970000000' or profile.role <> 'member' then
    raise exception 'Auth metadata updates must sync contact fields without granting staff access';
  end if;
  -- A legitimate existing staff role must survive profile synchronization.
  update public.profiles set role = 'barber' where id = test_id;
  update auth.users set raw_user_meta_data = raw_user_meta_data || '{"first_name":"Staff"}'::jsonb
  where id = test_id;
  if (select role from public.profiles where id = test_id) <> 'barber' then
    raise exception 'Profile sync must preserve existing staff role';
  end if;
  update public.profiles set role = 'member' where id = test_id;
end;
$$;

select set_config('request.jwt.claims',
  json_build_object('sub', current_setting('test.profile_id'), 'role', 'authenticated')::text, true);
set local role authenticated;
do $$
begin
  begin
    update public.profiles set role = 'barber'
    where id = current_setting('test.profile_id')::uuid;
    raise exception 'Member was able to change staff role';
  exception when insufficient_privilege then
    null;
  end;
  update public.profiles set first_name = 'Editable'
  where id = current_setting('test.profile_id')::uuid;
  if not found then raise exception 'Member must be able to edit own contact fields'; end if;
end;
$$;
reset role;

do $$
begin
  if exists (select 1 from auth.users u left join public.profiles p on p.id = u.id where p.id is null) then
    raise exception 'An Auth account still lacks its profile';
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime'
    and schemaname = 'public' and tablename = 'visits') then
    raise exception 'Visits must be published for live loyalty updates';
  end if;
end;
$$;

rollback;
