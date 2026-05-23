// @/lib/supabase/bookingRequests.js

import { supabaseServer } from "@/lib/supabase/server";

// createBookingRequest関数の引数
export async function createBookingRequest({
  experienceSlug,
  customerName,
  customerEmail,
  guestCount,
  preferredDate1,
  preferredTime1,
  preferredDate2,
  preferredTime2,
  preferredDate3,
  preferredTime3,
  message,
}) {
  // Supabaseへアクセスする。
  // Supabase上のカラム名にpropsにある値を対応させてDBへデータを差し込む。
  const { data, error } = await supabaseServer
    .from("booking_requests")
    .insert([
      {
        experience_slug: experienceSlug,
        customer_name: customerName,
        customer_email: customerEmail,
        guest_count: guestCount,
        preferred_date_1: preferredDate1,
        preferred_time_1: preferredTime1,
        preferred_date_2: preferredDate2 || null,
        preferred_time_2: preferredTime2 || null,
        preferred_date_3: preferredDate3 || null,
        preferred_time_3: preferredTime3 || null,
        message: message || null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  // insert結果としてSupabaseから返されたdataを返す。
  return data;
}