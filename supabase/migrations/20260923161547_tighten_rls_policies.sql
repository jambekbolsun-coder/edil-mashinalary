drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();

drop policy if exists "Admins manage profiles" on public.profiles;
drop policy if exists "Admins insert profiles" on public.profiles;
drop policy if exists "Admins update profiles" on public.profiles;
drop policy if exists "Admins delete profiles" on public.profiles;
create policy "Admins insert profiles" on public.profiles for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update profiles" on public.profiles for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete profiles" on public.profiles for delete to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage equipment" on public.equipment;
drop policy if exists "Admins insert equipment" on public.equipment;
drop policy if exists "Admins update equipment" on public.equipment;
drop policy if exists "Admins delete equipment" on public.equipment;
create policy "Admins insert equipment" on public.equipment for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update equipment" on public.equipment for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete equipment" on public.equipment for delete to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage leads" on public.leads;
drop policy if exists "Admins read leads" on public.leads;
drop policy if exists "Admins update leads" on public.leads;
drop policy if exists "Admins delete leads" on public.leads;
create policy "Admins read leads" on public.leads for select to authenticated using ((select private.is_admin()));
create policy "Admins update leads" on public.leads for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete leads" on public.leads for delete to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage chat answers" on public.chat_answers;
drop policy if exists "Admins insert chat answers" on public.chat_answers;
drop policy if exists "Admins update chat answers" on public.chat_answers;
drop policy if exists "Admins delete chat answers" on public.chat_answers;
create policy "Admins insert chat answers" on public.chat_answers for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update chat answers" on public.chat_answers for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete chat answers" on public.chat_answers for delete to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage posts" on public.posts;
drop policy if exists "Admins insert posts" on public.posts;
drop policy if exists "Admins update posts" on public.posts;
drop policy if exists "Admins delete posts" on public.posts;
create policy "Admins insert posts" on public.posts for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update posts" on public.posts for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete posts" on public.posts for delete to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage promotions" on public.promotions;
drop policy if exists "Admins insert promotions" on public.promotions;
drop policy if exists "Admins update promotions" on public.promotions;
drop policy if exists "Admins delete promotions" on public.promotions;
create policy "Admins insert promotions" on public.promotions for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update promotions" on public.promotions for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete promotions" on public.promotions for delete to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage settings" on public.site_settings;
drop policy if exists "Admins insert settings" on public.site_settings;
drop policy if exists "Admins update settings" on public.site_settings;
drop policy if exists "Admins delete settings" on public.site_settings;
create policy "Admins insert settings" on public.site_settings for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update settings" on public.site_settings for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete settings" on public.site_settings for delete to authenticated using ((select private.is_admin()));
