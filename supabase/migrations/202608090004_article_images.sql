-- Awai Notes image storage, metadata, and public thumbnail selection.
-- Run after 202608090003_articles.sql.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'article-images',
  'article-images',
  true,
  4194304,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.article_images (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null,
  alt_text text not null,
  mime_type text not null
    check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  size_bytes integer not null check (size_bytes between 1 and 4194304),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  constraint article_images_filename_length
    check (char_length(original_filename) between 1 and 255),
  constraint article_images_alt_length
    check (char_length(alt_text) between 1 and 180)
);

create index if not exists article_images_article_idx
  on public.article_images (article_id, created_at);

alter table public.articles
  add column if not exists thumbnail_image_id uuid
    references public.article_images(id) on delete set null;

alter table public.article_images enable row level security;

revoke all on table public.article_images from public, anon, authenticated;
grant select on table public.article_images to anon, authenticated;
grant insert (
  id,
  article_id,
  storage_path,
  original_filename,
  alt_text,
  mime_type,
  size_bytes,
  created_by
) on public.article_images to authenticated;

grant update (thumbnail_image_id) on public.articles to authenticated;

drop policy if exists "published article images are public"
  on public.article_images;
drop policy if exists "awai admins can read article images"
  on public.article_images;
drop policy if exists "awai editors can create article images"
  on public.article_images;

create policy "published article images are public"
  on public.article_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.articles
      where articles.id = article_images.article_id
        and articles.status = 'published'
        and articles.published_at <= now()
    )
  );

create policy "awai admins can read article images"
  on public.article_images
  for select
  to authenticated
  using ((select public.is_awai_admin('viewer')));

create policy "awai editors can create article images"
  on public.article_images
  for insert
  to authenticated
  with check (
    (select public.is_awai_admin('editor'))
    and created_by = (select auth.uid())
    and exists (
      select 1
      from public.articles
      where articles.id = article_images.article_id
    )
  );

drop policy if exists "awai editors can upload article images"
  on storage.objects;
drop policy if exists "awai editors can update article images"
  on storage.objects;
drop policy if exists "awai editors can delete article images"
  on storage.objects;

create policy "awai editors can upload article images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'article-images'
    and (select public.is_awai_admin('editor'))
  );

create policy "awai editors can update article images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'article-images'
    and (select public.is_awai_admin('editor'))
  )
  with check (
    bucket_id = 'article-images'
    and (select public.is_awai_admin('editor'))
  );

create policy "awai editors can delete article images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'article-images'
    and (select public.is_awai_admin('editor'))
  );

notify pgrst, 'reload schema';
