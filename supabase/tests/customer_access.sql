-- Live-safe authorization/loyalty regression checks; all fixtures roll back.
begin;
do $$
declare
  staff uuid := gen_random_uuid();
  member uuid := gen_random_uuid();
  other_member uuid := gen_random_uuid();
begin
  perform set_config('test.staff', staff::text, true);
  perform set_config('test.member', member::text, true);
  perform set_config('test.other_member', other_member::text, true);
  insert into auth.users (id, email, raw_user_meta_data)
  select id, id::text || '@dardan-user.local', '{"first_name":"QA transaction fixture"}'::jsonb
  from unnest(array[staff, member, other_member]) as id;
  update public.profiles set role = 'barber' where id = staff;
end;
$$;

set local role anon;
do $$
begin
  begin
    perform 1 from public.profiles limit 1;
    raise exception 'Anonymous profile read was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.visits limit 1;
    raise exception 'Anonymous visit read was allowed';
  exception when insufficient_privilege then null;
  end;
  perform 1 from public.gallery_photos limit 1;
end;
$$;
reset role;

select set_config('request.jwt.claims', json_build_object(
  'sub', current_setting('test.member'), 'role', 'authenticated')::text, true);
set local role authenticated;
do $$
begin
  if (select count(*) from public.profiles) <> 1 then
    raise exception 'Member must see only their own profile';
  end if;
  begin
    update public.profiles set role = 'barber' where id = auth.uid();
    raise exception 'Member self-promotion was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.visits (user_id) values (auth.uid());
    raise exception 'Member visit forgery was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.gallery_photos (storage_path) values ('qa-denied.png');
    raise exception 'Member gallery insert was allowed';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;

select set_config('request.jwt.claims', json_build_object(
  'sub', current_setting('test.staff'), 'role', 'authenticated')::text, true);
set local role authenticated;
do $$
declare member_id uuid := current_setting('test.member')::uuid;
begin
  if not exists (select 1 from public.profiles where id = member_id) then
    raise exception 'Staff cannot find a customer';
  end if;
  begin
    insert into public.visits (user_id, is_redemption) values (member_id, true);
    raise exception 'Unearned redemption was allowed';
  exception when check_violation then null;
  end;
  insert into public.visits (user_id, customer_name)
  select member_id, 'Forged name' from generate_series(1, 10);
  if exists (select 1 from public.visits where user_id = member_id
    and (barber_id <> auth.uid() or customer_name = 'Forged name')) then
    raise exception 'Visit identity fields were not validated';
  end if;
  insert into public.visits (user_id, is_redemption) values (member_id, true);
  begin
    insert into public.visits (user_id, is_redemption) values (member_id, true);
    raise exception 'Duplicate redemption was allowed';
  exception when check_violation then null;
  end;
  begin
    delete from public.visits where user_id = member_id;
    raise exception 'Visit ledger deletion was allowed';
  exception when insufficient_privilege then null;
  end;
  insert into public.gallery_photos (storage_path) values ('qa-transaction-photo.png');
  delete from public.gallery_photos where storage_path = 'qa-transaction-photo.png';
end;
$$;
reset role;

select set_config('request.jwt.claims', json_build_object(
  'sub', current_setting('test.other_member'), 'role', 'authenticated')::text, true);
set local role authenticated;
do $$
begin
  if exists (select 1 from public.visits) then
    raise exception 'Member can read another customer visits';
  end if;
end;
$$;
reset role;
select 'Customer isolation, staff permissions, and reward accounting passed' as result;
rollback;
