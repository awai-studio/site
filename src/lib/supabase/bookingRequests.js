// @/lib/supabase/bookingRequests.js

import { supabase } from "@/lib/supabase/client";

// createBookingRequest関数の引数
export async function createBookingRequest({
  experienceSlug,
  customerName,
  customerEmail,
  guestCount,
  preferredDate,
  preferredTime,
  message,
}) {
  // Supabaseへアクセスする。
  // Supabase上のカラム名にpropsにある値を対応させてDBへデータを差し込む。
  const { data, error } = await supabase
    .from("booking_requests")
    .insert([
      {
        experience_slug: experienceSlug,
        customer_name: customerName,
        customer_email: customerEmail,
        guest_count: guestCount,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        message: message || null,
        status: "pending",
      },
    ]);

  if (error) {
    throw error;
  }

  // insert結果としてSupabaseから返されたdataを返す。
  return data;
}