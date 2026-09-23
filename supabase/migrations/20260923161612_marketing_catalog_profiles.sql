begin;

alter table public.equipment drop constraint if exists equipment_category_check;
alter table public.equipment add constraint equipment_category_check check (category in (
  'loaders', 'excavators', 'dump-trucks', 'mixers', 'attachments',
  'pile-drivers', 'backhoe-loaders', 'skid-steers', 'forklifts', 'telehandlers',
  'bulldozers', 'graders', 'rollers', 'mobile-cranes', 'concrete-pumps'
));

alter table public.profiles
  add column if not exists about text not null default '' check (length(about) <= 2000),
  add column if not exists skills text[] not null default '{}' check (cardinality(skills) <= 15),
  add column if not exists avatar_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Admin reads own avatar" on storage.objects for select to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text and (select private.is_admin()));
create policy "Admin uploads own avatar" on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text and (select private.is_admin()));
create policy "Admin deletes own avatar" on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text and (select private.is_admin()));

commit;
