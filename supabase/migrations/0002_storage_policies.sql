-- Storage buckets and RLS policies for private uploads

-- Helper: determine if current user belongs to friendspace encoded in object path
create or replace function public.is_member_of_friendspace_from_path(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with fs as (
    select nullif(split_part(object_name, '/', 1), '')::uuid as friendspace_id
  )
  select exists (
    select 1
    from fs
    join public.friendspaces f on f.id = fs.friendspace_id
    where f.admin_id = auth.uid() or f.friend_user_id = auth.uid()
  );
$$;

-- Create buckets idempotently (fallback for projects without storage.create_bucket())
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('journals', 'journals', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', false)
on conflict (id) do nothing;

-- Enable RLS on storage.objects (already enabled by default on Supabase)
-- Policies are per-bucket name

-- Common policy templates for buckets: proofs, journals, avatars
-- Access model: object key pattern "<friendspace_id>/<rest>"

drop policy if exists proofs_select on storage.objects;
create policy proofs_select on storage.objects
  for select to authenticated
  using (bucket_id = 'proofs' and public.is_member_of_friendspace_from_path(name));

drop policy if exists journals_select on storage.objects;
create policy journals_select on storage.objects
  for select to authenticated
  using (bucket_id = 'journals' and public.is_member_of_friendspace_from_path(name));

drop policy if exists avatars_select on storage.objects;
create policy avatars_select on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars' and public.is_member_of_friendspace_from_path(name));

drop policy if exists proofs_insert on storage.objects;
create policy proofs_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'proofs' and public.is_member_of_friendspace_from_path(name));

drop policy if exists journals_insert on storage.objects;
create policy journals_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'journals' and public.is_member_of_friendspace_from_path(name));

drop policy if exists avatars_insert on storage.objects;
create policy avatars_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and public.is_member_of_friendspace_from_path(name));

drop policy if exists proofs_update on storage.objects;
create policy proofs_update on storage.objects
  for update to authenticated
  using (bucket_id = 'proofs' and public.is_member_of_friendspace_from_path(name));

drop policy if exists journals_update on storage.objects;
create policy journals_update on storage.objects
  for update to authenticated
  using (bucket_id = 'journals' and public.is_member_of_friendspace_from_path(name));

drop policy if exists avatars_update on storage.objects;
create policy avatars_update on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and public.is_member_of_friendspace_from_path(name));

drop policy if exists proofs_delete on storage.objects;
create policy proofs_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'proofs' and public.is_member_of_friendspace_from_path(name));

drop policy if exists journals_delete on storage.objects;
create policy journals_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'journals' and public.is_member_of_friendspace_from_path(name));

drop policy if exists avatars_delete on storage.objects;
create policy avatars_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and public.is_member_of_friendspace_from_path(name));


