create index if not exists audit_logs_actor_id_idx on public.audit_logs (actor_id);
create index if not exists lead_activities_author_id_idx on public.lead_activities (author_id);
