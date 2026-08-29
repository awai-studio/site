// @/lib/supabase/bookingRequests.js

import { supabaseServer } from "@/lib/supabase/server";

// createBookingRequest関数の引数
export async function createBookingRequest({
  submissionToken,
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
  trackingUtmSource,
  trackingUtmMedium,
  trackingUtmCampaign,
  trackingUtmContent,
  trackingUtmClickedUrl,
}) {
  // Supabaseへアクセスする。
  // Supabase上のカラム名にpropsにある値を対応させてDBへデータを差し込む。
  const { data, error } = await supabaseServer
    .from("booking_requests")
    .insert([
      {
        submission_token: submissionToken,
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
        tracking_utm_source: trackingUtmSource || null,
        tracking_utm_medium: trackingUtmMedium || null,
        tracking_utm_campaign: trackingUtmCampaign || null,
        tracking_utm_content: trackingUtmContent || null,
        tracking_utm_clicked_url: trackingUtmClickedUrl || null,
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

export function isDuplicateBookingRequestError(error) {
  if (error?.code !== "23505") return false;

  const databaseMessage = `${error?.message || ""} ${error?.details || ""}`;
  return databaseMessage.includes("submission_token");
}

export function isBookingDateUnavailableError(error) {
  if (error?.code !== "23505") return false;

  const databaseMessage = `${error?.message || ""} ${error?.details || ""}`;
  return databaseMessage.includes("booking_request_date_holds_one_per_day");
}

async function getLegacyConfirmedBookingDates(experienceSlug) {
  const { data, error } = await supabaseServer
    .from("booking_requests")
    .select("confirmed_date")
    .eq("experience_slug", experienceSlug)
    .eq("status", "confirmed")
    .not("confirmed_date", "is", null);

  if (error) throw error;
  return [...new Set(data.map((item) => item.confirmed_date))];
}

export async function getBlockedBookingDates(
  experienceSlug,
  { throwOnError = false } = {},
) {
  const now = new Date().toISOString();
  const { data, error } = await supabaseServer
    .from("booking_request_date_holds")
    .select("held_date")
    .eq("experience_slug", experienceSlug)
    .or(`expires_at.is.null,expires_at.gt.${now}`);

  if (error) {
    const isHoldsTableMissing =
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      error.message?.includes("booking_request_date_holds");

    if (isHoldsTableMissing) {
      try {
        return await getLegacyConfirmedBookingDates(experienceSlug);
      } catch (legacyError) {
        if (throwOnError) throw legacyError;
        console.error(
          "Failed to load legacy confirmed booking dates:",
          legacyError instanceof Error ? legacyError.message : "Unknown error",
        );
        return [];
      }
    }

    if (throwOnError) throw error;
    console.error("Failed to load blocked booking dates:", error.message);
    return [];
  }

  return [...new Set(data.map((item) => item.held_date))];
}
