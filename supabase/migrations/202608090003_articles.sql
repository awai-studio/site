-- Awai Notes article storage and author permissions.
-- Run after 202608090002_admin_auth_and_booking_management.sql.

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body_markdown text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  seo_title text not null default '',
  seo_description text not null default '',
  author_id uuid not null references auth.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint articles_title_length check (char_length(title) between 1 and 160),
  constraint articles_excerpt_length check (char_length(excerpt) <= 400),
  constraint articles_body_length check (char_length(body_markdown) <= 100000),
  constraint articles_seo_title_length check (char_length(seo_title) <= 70),
  constraint articles_seo_description_length
    check (char_length(seo_description) <= 180),
  constraint articles_publish_date
    check (
      (status = 'draft' and published_at is null)
      or (status = 'published' and published_at is not null)
    )
);

create index if not exists articles_publication_idx
  on public.articles (status, published_at desc);

create or replace function public.set_article_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

revoke all on function public.set_article_updated_at()
  from public, anon, authenticated;

drop trigger if exists set_article_updated_at on public.articles;

create trigger set_article_updated_at
  before update on public.articles
  for each row execute function public.set_article_updated_at();

alter table public.articles enable row level security;

revoke all on table public.articles from public, anon, authenticated;
grant select on table public.articles to anon, authenticated;
grant insert (
  slug,
  title,
  excerpt,
  body_markdown,
  status,
  seo_title,
  seo_description,
  author_id,
  published_at
) on public.articles to authenticated;
grant update (
  slug,
  title,
  excerpt,
  body_markdown,
  status,
  seo_title,
  seo_description,
  published_at
) on public.articles to authenticated;

drop policy if exists "published articles are public" on public.articles;
drop policy if exists "awai admins can read articles" on public.articles;
drop policy if exists "awai editors can create articles" on public.articles;
drop policy if exists "awai editors can update articles" on public.articles;

create policy "published articles are public"
  on public.articles
  for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

create policy "awai admins can read articles"
  on public.articles
  for select
  to authenticated
  using ((select public.is_awai_admin('viewer')));

create policy "awai editors can create articles"
  on public.articles
  for insert
  to authenticated
  with check (
    (select public.is_awai_admin('editor'))
    and author_id = (select auth.uid())
  );

create policy "awai editors can update articles"
  on public.articles
  for update
  to authenticated
  using ((select public.is_awai_admin('editor')))
  with check ((select public.is_awai_admin('editor')));

notify pgrst, 'reload schema';
