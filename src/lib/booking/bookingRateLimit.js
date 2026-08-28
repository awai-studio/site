// @/lib/article/booking/bookingRateLimit.js

import "server-only";
import { createHmac } from "node:crypto";
import { supabaseServer } from "@/lib/supabase/server";

export const BOOKING_RATE_LIMIT = {
  maximumAttempts: 5,
  windowSeconds: 10 * 60,
};

function getClientAddress(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown-client"
  );
}

function createClientKey(scope, clientAddress) {
  const secret =
    process.env.BOOKING_RATE_LIMIT_SECRET || process.env.SUPABASE_SECRET_KEY;

  if (!secret) return null;

  return createHmac("sha256", secret)
    .update(`${scope}:${clientAddress}`)
    .digest("hex");
}

export async function checkBookingRateLimit(request) {
  const scope = "booking-request";
  const clientAddress = getClientAddress(request);
  const clientKey = createClientKey(scope, clientAddress);

  if (!clientKey) {
    return { isAllowed: false, hasError: true };
  }

  const { data, error } = await supabaseServer.rpc(
    "check_booking_request_rate_limit",
    {
      p_client_key: clientKey,
      p_max_attempts: BOOKING_RATE_LIMIT.maximumAttempts,
      p_window_seconds: BOOKING_RATE_LIMIT.windowSeconds,
      p_scope: scope,
    },
  );

  if (error) {
    console.error("Booking rate limit check failed:", error.message);
    return { isAllowed: false, hasError: true };
  }

  return { isAllowed: data === true, hasError: false };
}
