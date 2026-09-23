begin;
-- Anonymous visitors read only published content. The admin predicate is
-- evaluated only for authenticated sessions, preserving draft privacy.
drop policy if exists "Anyone reads published equipment" on public.equipment;
create policy "Public reads published equipment" on public.equipment for select to anon using (published = true);
create policy "Members read equipment" on public.equipment for select to authenticated using (published = true or (select private.is_admin()));
drop policy if exists "Anyone reads active chat answers" on public.chat_answers;
create policy "Public reads active chat answers" on public.chat_answers for select to anon using (active = true);
create policy "Members read chat answers" on public.chat_answers for select to authenticated using (active = true or (select private.is_admin()));
drop policy if exists "Anyone reads published posts" on public.posts;
create policy "Public reads published posts" on public.posts for select to anon using (published = true);
create policy "Members read posts" on public.posts for select to authenticated using (published = true or (select private.is_admin()));
drop policy if exists "Anyone reads active promotions" on public.promotions;
create policy "Public reads active promotions" on public.promotions for select to anon using (active = true);
create policy "Members read promotions" on public.promotions for select to authenticated using (active = true or (select private.is_admin()));
drop policy if exists "Anyone reads public settings" on public.site_settings;
create policy "Public reads public settings" on public.site_settings for select to anon using (public = true);
create policy "Members read settings" on public.site_settings for select to authenticated using (public = true or (select private.is_admin()));
drop policy if exists "Anyone reads published services" on public.services;
create policy "Public reads published services" on public.services for select to anon using (published = true);
create policy "Members read services" on public.services for select to authenticated using (published = true or (select private.is_admin()));
commit;
