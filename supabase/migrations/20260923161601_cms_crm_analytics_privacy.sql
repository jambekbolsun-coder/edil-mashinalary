-- CMS, CRM, consent evidence and first-party analytics for Edil Mashinalary.
-- Supabase is used as managed PostgreSQL; business data and access rules live in SQL.

alter table public.leads
  add column if not exists locale text not null default 'ru' check (locale in ('ru', 'ky', 'en', 'tr', 'zh')),
  add column if not exists landing_page text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists consent_version text not null default '2026-09-09',
  add column if not exists consented_at timestamptz,
  add column if not exists manager_notes text,
  add column if not exists next_contact_at timestamptz;

update public.leads
set consented_at = coalesce(consented_at, created_at)
where consent = true;

alter table public.leads
  add constraint leads_consent_evidence_check
  check (consent = true and consented_at is not null) not valid;

alter table public.analytics_events
  add column if not exists anonymous_id uuid,
  add column if not exists session_id uuid,
  add column if not exists locale text check (locale is null or locale in ('ru', 'ky', 'en', 'tr', 'zh')),
  add column if not exists referrer_host text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text;

alter table public.analytics_events
  add constraint analytics_event_name_check
  check (event_name in (
    'page_view', 'equipment_view', 'catalog_search', 'form_started',
    'form_submitted', 'whatsapp_clicked', 'instagram_clicked', 'phone_clicked'
  )) not valid;

create index if not exists analytics_events_created_idx
  on public.analytics_events (created_at desc);
create index if not exists analytics_events_equipment_idx
  on public.analytics_events (equipment_slug, created_at desc)
  where equipment_slug is not null;
create index if not exists analytics_events_session_idx
  on public.analytics_events (session_id, created_at desc)
  where session_id is not null;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 120),
  excerpt text not null check (char_length(excerpt) between 10 and 500),
  content jsonb not null default '[]'::jsonb check (jsonb_typeof(content) = 'array'),
  icon text not null default 'wrench',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_public_idx
  on public.services (sort_order, created_at desc) where published = true;

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create table if not exists public.lead_activities (
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  activity_type text not null check (activity_type in ('status_changed', 'note_added', 'contact_scheduled')),
  note text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists lead_activities_lead_created_idx
  on public.lead_activities (lead_id, created_at desc);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  changes jsonb not null default '{}'::jsonb check (jsonb_typeof(changes) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);

alter table public.services enable row level security;
alter table public.lead_activities enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Anyone reads published services" on public.services;
drop policy if exists "Admins insert services" on public.services;
drop policy if exists "Admins update services" on public.services;
drop policy if exists "Admins delete services" on public.services;
create policy "Anyone reads published services" on public.services
  for select to anon, authenticated
  using (published = true or (select private.is_admin()));
create policy "Admins insert services" on public.services
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update services" on public.services
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete services" on public.services
  for delete to authenticated using ((select private.is_admin()));

create policy "Admins read lead activities" on public.lead_activities
  for select to authenticated using ((select private.is_admin()));
create policy "Admins insert lead activities" on public.lead_activities
  for insert to authenticated with check ((select private.is_admin()) and author_id = (select auth.uid()));
create policy "Admins update lead activities" on public.lead_activities
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete lead activities" on public.lead_activities
  for delete to authenticated using ((select private.is_admin()));

create policy "Admins read audit logs" on public.audit_logs
  for select to authenticated using ((select private.is_admin()));
create policy "Admins insert audit logs" on public.audit_logs
  for insert to authenticated with check ((select private.is_admin()) and actor_id = (select auth.uid()));

drop policy if exists "Anyone creates leads" on public.leads;
create policy "Anyone creates consented leads" on public.leads
  for insert to anon, authenticated
  with check (
    consent = true
    and consented_at is not null
    and char_length(name) between 2 and 90
    and char_length(phone) between 9 and 20
  );

drop policy if exists "Anyone creates analytics" on public.analytics_events;
create policy "Anyone creates approved analytics" on public.analytics_events
  for insert to anon, authenticated
  with check (
    event_name in (
      'page_view', 'equipment_view', 'catalog_search', 'form_started',
      'form_submitted', 'whatsapp_clicked', 'instagram_clicked', 'phone_clicked'
    )
    and not (metadata ?| array['email', 'phone', 'name'])
  );

revoke all on table public.services, public.lead_activities, public.audit_logs from anon, authenticated;
grant select on table public.services to anon, authenticated;
grant select, insert, update, delete on table public.services to authenticated;
grant select, insert, update, delete on table public.lead_activities to authenticated;
grant select, insert on table public.audit_logs to authenticated;
grant usage, select on sequence public.lead_activities_id_seq, public.audit_logs_id_seq to authenticated;

insert into public.site_settings (key, value, public) values
  ('company_name', '"Edil Mashinalary"'::jsonb, true),
  ('company_email', '"edilmashinalary@gmail.com"'::jsonb, true),
  ('company_instagram', '"https://www.instagram.com/edilmashinalary"'::jsonb, true),
  ('company_whatsapp', '"https://wa.me/996551000303"'::jsonb, true),
  ('privacy_policy_version', '"2026-09-09"'::jsonb, true),
  ('analytics_mode', '"first-party-consent"'::jsonb, true)
on conflict (key) do update set value = excluded.value, public = excluded.public;
