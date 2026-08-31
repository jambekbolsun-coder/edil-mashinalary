create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function public.handle_new_user()
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  brand text not null,
  category text not null check (category in ('loaders', 'excavators', 'dump-trucks', 'mixers', 'attachments')),
  status text not null default 'on-order' check (status in ('in-stock', 'on-order')),
  published boolean not null default false,
  featured boolean not null default false,
  price bigint check (price is null or price >= 0),
  old_price bigint check (old_price is null or old_price >= 0),
  down_payment bigint check (down_payment is null or down_payment >= 0),
  monthly_payment bigint check (monthly_payment is null or monthly_payment >= 0),
  installment_months integer not null default 12 check (installment_months between 1 and 60),
  bucket text,
  load_capacity text,
  power integer check (power is null or power > 0),
  engine text,
  cylinders integer check (cylinders is null or cylinders > 0),
  turbo boolean,
  warranty_hours integer not null default 3000 check (warranty_hours >= 0),
  promo text,
  short_description text not null,
  description text not null,
  images jsonb not null default '[]'::jsonb check (jsonb_typeof(images) = 'array'),
  specs jsonb not null default '[]'::jsonb check (jsonb_typeof(specs) = 'array'),
  equipment jsonb not null default '[]'::jsonb check (jsonb_typeof(equipment) = 'array'),
  keywords jsonb not null default '[]'::jsonb check (jsonb_typeof(keywords) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index equipment_public_catalog_idx on public.equipment (featured desc, created_at desc) where published = true;
create index equipment_category_idx on public.equipment (category, status);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  preference text not null default 'whatsapp',
  interest text,
  comment text,
  source text not null default 'website',
  status text not null default 'new' check (status in ('new', 'in-progress', 'won', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_status_created_idx on public.leads (status, created_at desc);

create table public.chat_answers (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null,
  content jsonb not null default '[]'::jsonb,
  category text not null,
  read_time text not null default '5 минут',
  image text not null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_public_idx on public.posts (published_at desc) where published = true;

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null,
  path text,
  equipment_slug text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index analytics_events_name_created_idx on public.analytics_events (event_name, created_at desc);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  public boolean not null default false,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_equipment_updated_at before update on public.equipment for each row execute function public.set_updated_at();
create trigger set_leads_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger set_chat_answers_updated_at before update on public.chat_answers for each row execute function public.set_updated_at();
create trigger set_posts_updated_at before update on public.posts for each row execute function public.set_updated_at();
create trigger set_promotions_updated_at before update on public.promotions for each row execute function public.set_updated_at();
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.equipment enable row level security;
alter table public.leads enable row level security;
alter table public.chat_answers enable row level security;
alter table public.posts enable row level security;
alter table public.promotions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.site_settings enable row level security;

create policy "Users can read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()) or (select private.is_admin()));
create policy "Admins manage profiles" on public.profiles for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "Anyone reads published equipment" on public.equipment for select to anon, authenticated using (published = true or (select private.is_admin()));
create policy "Admins manage equipment" on public.equipment for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "Anyone creates leads" on public.leads for insert to anon, authenticated with check (true);
create policy "Admins manage leads" on public.leads for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "Anyone reads active chat answers" on public.chat_answers for select to anon, authenticated using (active = true or (select private.is_admin()));
create policy "Admins manage chat answers" on public.chat_answers for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "Anyone reads published posts" on public.posts for select to anon, authenticated using (published = true or (select private.is_admin()));
create policy "Admins manage posts" on public.posts for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "Anyone reads active promotions" on public.promotions for select to anon, authenticated using (active = true or (select private.is_admin()));
create policy "Admins manage promotions" on public.promotions for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "Anyone creates analytics" on public.analytics_events for insert to anon, authenticated with check (true);
create policy "Admins read analytics" on public.analytics_events for select to authenticated using ((select private.is_admin()));

create policy "Anyone reads public settings" on public.site_settings for select to anon, authenticated using (public = true or (select private.is_admin()));
create policy "Admins manage settings" on public.site_settings for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

grant select on public.equipment, public.chat_answers, public.posts, public.promotions, public.site_settings to anon, authenticated;
grant insert on public.leads, public.analytics_events to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.equipment, public.leads, public.chat_answers, public.posts, public.promotions, public.analytics_events, public.site_settings to authenticated;
grant usage, select on sequence public.analytics_events_id_seq to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('equipment', 'equipment', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Anyone reads equipment images" on storage.objects for select to anon, authenticated using (bucket_id = 'equipment');
create policy "Admins upload equipment images" on storage.objects for insert to authenticated with check (bucket_id = 'equipment' and (select private.is_admin()));
create policy "Admins update equipment images" on storage.objects for update to authenticated using (bucket_id = 'equipment' and (select private.is_admin())) with check (bucket_id = 'equipment' and (select private.is_admin()));
create policy "Admins delete equipment images" on storage.objects for delete to authenticated using (bucket_id = 'equipment' and (select private.is_admin()));

insert into public.chat_answers (question, answer, sort_order) values
  ('Что есть в наличии?', 'Откройте каталог и включите фильтр «В наличии». Перед поездкой менеджер подтвердит актуальную модель.', 10),
  ('Как работает рассрочка?', 'Договор заключается напрямую: паспорт, первый взнос примерно от 50% и остаток до 12 месяцев.', 20),
  ('Какая гарантия?', 'Для большинства представленных моделей указана гарантия 3000 моточасов. Точное условие фиксируется в договоре.', 30);

insert into public.site_settings (key, value, public) values
  ('company_phone', '"+996551000303"'::jsonb, true),
  ('company_address', '"Кыргызстан, Чуйская область, Новопокровка, ул. Ленина, 633"'::jsonb, true)
on conflict (key) do nothing;
