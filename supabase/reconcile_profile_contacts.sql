-- Apply after repair_profiles.sql to reconcile edits made before the sync trigger.
-- Only copy fields explicitly present in Auth metadata; preserve identity/roles.
begin;

update public.profiles p set
  first_name = case when u.raw_user_meta_data ? 'first_name'
    then coalesce(u.raw_user_meta_data ->> 'first_name', '') else p.first_name end,
  last_name = case when u.raw_user_meta_data ? 'last_name'
    then coalesce(u.raw_user_meta_data ->> 'last_name', '') else p.last_name end,
  phone = case when u.raw_user_meta_data ? 'phone'
    then coalesce(u.raw_user_meta_data ->> 'phone', '') else p.phone end
from auth.users u where p.id = u.id;

commit;
