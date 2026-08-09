"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { isBookingStatus } from "@/lib/admin/bookingStatus";

const BOOKING_ID_PATTERN = /^[1-9]\d*$/;

export async function updateBookingStatus(formData) {
  const bookingId = String(formData.get("bookingId") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!BOOKING_ID_PATTERN.test(bookingId) || !isBookingStatus(status)) {
    redirect("/admin?error=invalid-request");
  }

  const { supabase } = await requireAdmin("editor");
  const { error } = await supabase
    .from("booking_requests")
    .update({ status })
    .eq("id", bookingId);

  if (error) redirect(`/admin/bookings/${bookingId}?error=save`);

  revalidatePath("/admin");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirect(`/admin/bookings/${bookingId}?saved=1`);
}
