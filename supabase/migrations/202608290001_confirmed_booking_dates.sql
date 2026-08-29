-- Store the date/time chosen from a booking request and prevent double booking.

alter table public.booking_requests
  add column if not exists confirmed_date date,
  add column if not exists confirmed_time time;

alter table public.booking_requests
  drop constraint if exists booking_requests_confirmed_date_time_pair;

alter table public.booking_requests
  add constraint booking_requests_confirmed_date_time_pair
  check (
    (confirmed_date is null and confirmed_time is null)
    or (confirmed_date is not null and confirmed_time is not null)
  );

create unique index if not exists booking_requests_one_confirmed_booking_per_day
  on public.booking_requests (experience_slug, confirmed_date)
  where status = 'confirmed' and confirmed_date is not null;

revoke update (confirmed_date, confirmed_time)
  on table public.booking_requests from authenticated;
grant update (confirmed_date, confirmed_time)
  on table public.booking_requests to authenticated;

notify pgrst, 'reload schema';
