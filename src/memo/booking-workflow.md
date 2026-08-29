# Awai Studio booking workflow

This document describes the active booking-request workflow. It is intended to
make future maintenance and code reading easier.

## Core rule

Each experience can run at most once per day. A held or confirmed date blocks
the entire day, regardless of whether the selected time is in the morning or
afternoon.

## Statuses

| Status | Meaning | Dates blocked |
| --- | --- | --- |
| `new` / `contacted` | Waiting for the host to choose one proposed date | All proposed dates |
| `payment_pending` | One date chosen and payment instructions sent | The chosen date only |
| `confirmed` | Payment completed | The confirmed date |
| `cancelled` | Request or booking cancelled | None |
| `expired` | Payment deadline passed | None |

## Operational sequence

1. The guest submits up to three proposed dates.
2. The database creates one date hold for every proposal in the same transaction.
3. The operator checks the proposals with the host.
4. After sending payment instructions, the operator selects the agreed date in
   `/admin/bookings`.
5. The unused proposal holds are released immediately. The selected date is
   held for 48 hours from this action.
6. If payment arrives before the deadline, the operator confirms the booking.
7. If payment does not arrive, the date becomes available automatically after
   the deadline. The operator can then mark the request as expired.

## Main implementation files

- `src/app/en/booking/_components/BookingForm.jsx`: public booking form
- `src/app/en/booking/page.js`: supplies blocked dates to the calendar
- `src/app/api/booking-request/route.js`: validates and creates requests
- `src/lib/supabase/bookingRequests.js`: database access for requests and holds
- `src/app/admin/bookings/page.jsx`: operator workflow
- `supabase/migrations/202608290002_booking_holds_and_workflow.sql`: database
  constraints, hold trigger, and management function

## Safety properties

- A unique database constraint prevents two active holds for the same
  experience and date.
- Candidate holds are created by a database trigger, so the request and its
  holds either all succeed or all fail.
- Expired payment holds are ignored by the public calendar and removed before
  a new request claims the date.
- A booking cannot be confirmed after its payment deadline through the normal
  management function.
- Only an authenticated Awai Studio editor can change booking workflow state.

## Future automation

The current active application records payment completion manually in the
admin screen. A future Stripe webhook can call the same confirmation transition
after verifying `checkout.session.completed` and `payment_status === "paid"`.
