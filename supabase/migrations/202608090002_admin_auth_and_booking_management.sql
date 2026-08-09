-- Awai Studio admin authorization and booking management.
-- Run after 202608090001_booking_request_security.sql.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'viewer'
    check (role in ('viewer', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from public, anon, authenticated;
grant select (user_id, email, role, created_at)
  on public.admin_users to authenticated;

drop policy if exists "admin users can read own role"
  on public.admin_users;

create policy "admin users can read own role"
  on public.admin_users
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.is_awai_admin(
  required_role text default 'viewer'
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and (
        role = 'editor'
        or (role = 'viewer' and required_role = 'viewer')
      )
  );
$function$;

revoke all on function public.is_awai_admin(text)
  from public, anon;
grant execute on function public.is_awai_admin(text)
  to authenticated;

create or replace function public.add_initial_awai_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if lower(coalesce(new.email, '')) = 'dev@awai-studio.jp' then
    insert into public.admin_users (user_id, email, role)
    values (new.id, lower(new.email), 'editor')
    on conflict (user_id) do update
      set email = excluded.email,
          role = 'editor';
  end if;

  return new;
end;
$function$;

revoke all on function public.add_initial_awai_admin()
  from public, anon, authenticated;

drop trigger if exists add_initial_awai_admin_on_auth_user
  on auth.users;

create trigger add_initial_awai_admin_on_auth_user
  after insert or update on auth.users
  for each row execute function public.add_initial_awai_admin();

insert into public.admin_users (user_id, email, role)
select id, lower(email), 'editor'
from auth.users
where lower(coalesce(email, '')) = 'dev@awai-studio.jp'
on conflict (user_id) do update
  set email = excluded.email,
      role = 'editor';

alter table public.booking_requests
  add column if not exists status_changed_at timestamptz not null default now(),
  add column if not exists status_changed_by uuid references auth.users(id);

update public.booking_requests
set status = 'new'
where status is null
   or replace(lower(trim(status)), '''', '') in ('pending', 'new');

alter table public.booking_requests
  alter column status set default 'new',
  alter column status set not null;

alter table public.booking_requests
  drop constraint if exists booking_requests_status_allowed;

alter table public.booking_requests
  add constraint booking_requests_status_allowed
  check (status in ('new', 'contacted', 'confirmed', 'cancelled'));

create or replace function public.set_booking_request_status_audit()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at = now();

  if new.status is distinct from old.status then
    new.status_changed_at = now();
    new.status_changed_by = auth.uid();
  end if;

  return new;
end;
$function$;

revoke all on function public.set_booking_request_status_audit()
  from public, anon, authenticated;

drop trigger if exists set_booking_request_status_audit
  on public.booking_requests;

create trigger set_booking_request_status_audit
  before update on public.booking_requests
  for each row execute function public.set_booking_request_status_audit();

alter table public.booking_requests enable row level security;

revoke all on table public.booking_requests from anon, authenticated;
grant select on table public.booking_requests to authenticated;
grant update (status) on table public.booking_requests to authenticated;

drop policy if exists "awai admins can read booking requests"
  on public.booking_requests;
drop policy if exists "awai editors can update booking requests"
  on public.booking_requests;

create policy "awai admins can read booking requests"
  on public.booking_requests
  for select
  to authenticated
  using ((select public.is_awai_admin('viewer')));

create policy "awai editors can update booking requests"
  on public.booking_requests
  for update
  to authenticated
  using ((select public.is_awai_admin('editor')))
  with check ((select public.is_awai_admin('editor')));

notify pgrst, 'reload schema';
