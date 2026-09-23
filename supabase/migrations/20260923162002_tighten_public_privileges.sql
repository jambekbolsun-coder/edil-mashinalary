begin;

-- New Supabase projects grant broad Data API privileges by default. Keep the
-- REST surface limited to the operations the marketing site actually uses;
-- RLS remains the second layer of protection.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant select on table
  public.equipment,
  public.chat_answers,
  public.posts,
  public.promotions,
  public.services,
  public.site_settings
to anon, authenticated;

grant insert on table public.leads, public.analytics_events to anon, authenticated;
grant usage, select on sequence public.analytics_events_id_seq to anon, authenticated;

grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table
  public.equipment,
  public.chat_answers,
  public.posts,
  public.promotions,
  public.services,
  public.site_settings
to authenticated;
grant select on table public.leads, public.analytics_events to authenticated;
grant select, insert on table public.audit_logs to authenticated;
grant select, insert, update, delete on table public.lead_activities to authenticated;
grant usage, select on sequence public.audit_logs_id_seq, public.lead_activities_id_seq to authenticated;

-- This platform helper is an event-trigger implementation detail, not a REST RPC.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Require explicit grants for future public-schema objects as well.
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke execute on functions from public, anon, authenticated;
commit;
