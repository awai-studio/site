-- Awai Studio booking request protection.
-- Adds idempotency and server-only rate limiting without changing existing rows.

alter table public.booking_requests
  add column if not exists submission_token uuid;

create unique index if not exists
  booking_requests_submission_token_unique
on public.booking_requests (submission_token)
where submission_token is not null;

create table if not exists public.booking_request_rate_limits (
  scope text not null,
  client_key text not null,
  window_started_at timestamptz not null default now(),
  attempts integer not null default 1 check (attempts > 0),
  updated_at timestamptz not null default now(),
  primary key (scope, client_key)
);

alter table public.booking_request_rate_limits enable row level security;

revoke all on table public.booking_request_rate_limits
  from public, anon, authenticated;

create index if not exists booking_request_rate_limits_updated_at_index
on public.booking_request_rate_limits (updated_at);

create or replace function public.check_booking_request_rate_limit(
  p_client_key text,
  p_max_attempts integer default 5,
  p_window_seconds integer default 600,
  p_scope text default 'booking-request'
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_attempts integer;
begin
  if length(trim(coalesce(p_client_key, ''))) < 16 then
    raise exception 'Invalid client key';
  end if;

  if p_max_attempts < 1 or p_max_attempts > 100 then
    raise exception 'Invalid maximum attempts';
  end if;

  if p_window_seconds < 10 or p_window_seconds > 86400 then
    raise exception 'Invalid window duration';
  end if;

  insert into public.booking_request_rate_limits (
    scope,
    client_key,
    window_started_at,
    attempts,
    updated_at
  )
  values (p_scope, p_client_key, v_now, 1, v_now)
  on conflict (scope, client_key)
  do update set
    attempts = case
      when public.booking_request_rate_limits.window_started_at
        <= v_now - make_interval(secs => p_window_seconds)
      then 1
      else public.booking_request_rate_limits.attempts + 1
    end,
    window_started_at = case
      when public.booking_request_rate_limits.window_started_at
        <= v_now - make_interval(secs => p_window_seconds)
      then v_now
      else public.booking_request_rate_limits.window_started_at
    end,
    updated_at = v_now
  returning attempts into v_attempts;

  return v_attempts <= p_max_attempts;
end;
$$;

revoke all on function public.check_booking_request_rate_limit(
  text,
  integer,
  integer,
  text
) from public, anon, authenticated;

grant execute on function public.check_booking_request_rate_limit(
  text,
  integer,
  integer,
  text
) to service_role;

notify pgrst, 'reload schema';
