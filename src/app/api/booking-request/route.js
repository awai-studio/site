// @/app/api/booking-request/route.js

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { experiences } from "@/app/en/experiences/_data/experiences";
import {
  isLikelyBotBooking,
  validateBookingInput,
  validateBookingRequest,
} from "@/lib/booking/bookingValidation";
import {
  BOOKING_RATE_LIMIT,
  checkBookingRateLimit,
} from "@/lib/booking/bookingRateLimit";
import {
  createBookingRequest,
  isDuplicateBookingRequestError,
} from "@/lib/supabase/bookingRequests";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request) {
  try {
    const requestValidation = validateBookingRequest(request);
    if (!requestValidation.isValid) {
      return NextResponse.json(
        { message: requestValidation.message },
        { status: requestValidation.status },
      );
    }

    const body = await request.json();

    if (isLikelyBotBooking(body)) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const rateLimitResult = await checkBookingRateLimit(request);

    if (rateLimitResult.hasError) {
      return NextResponse.json(
        {
          message:
            "We cannot accept your request right now. Please try again later.",
        },
        { status: 503 },
      );
    }

    if (!rateLimitResult.isAllowed) {
      return NextResponse.json(
        {
          message:
            "Too many requests were sent in a short time. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(BOOKING_RATE_LIMIT.windowSeconds),
          },
        },
      );
    }

    const experience = experiences.find(
      (item) => item.slug === String(body?.experienceSlug || "").trim(),
    );
    const validation = validateBookingInput(body, experience);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          message: validation.firstError || "Please check your request.",
          errors: validation.errors,
        },
        { status: 400 },
      );
    }

    const values = validation.values;
    let bookingRequest;

    try {
      bookingRequest = await createBookingRequest(values);
    } catch (error) {
      if (isDuplicateBookingRequestError(error)) {
        return NextResponse.json({ ok: true }, { status: 201 });
      }

      throw error;
    }
    const fromEmail =
      process.env.BOOKING_FROM_EMAIL || "Awai Studio <hello@awai-studio.jp>";
    const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL;
    const preferredDateTimeText = [
      { label: "1", date: values.preferredDate1, time: values.preferredTime1 },
      { label: "2", date: values.preferredDate2, time: values.preferredTime2 },
      { label: "3", date: values.preferredDate3, time: values.preferredTime3 },
    ]
      .filter((item) => item.date && item.time)
      .map((item) => `${item.label})\n${item.date}\n${item.time} JST`)
      .join("\n\n");

    try {
      if (resend && notifyEmail) {
        await resend.emails.send({
          from: fromEmail,
          to: notifyEmail,
          subject: `[Awai Studio] New booking request: ${experience.title}`,
          text: `A new booking request has been submitted.\n\nExperience:\n${experience.title}\n\nPreferred dates & times:\n${preferredDateTimeText}\n\nGuests:\n${values.guestCount}\n\nCustomer:\n${values.customerName}\n\nEmail:\n${values.customerEmail}\n\nMessage:\n${values.message || "(No message)"}`,
        });
      }

      if (resend) {
        await resend.emails.send({
          from: fromEmail,
          to: values.customerEmail,
          subject: "We received your booking request | Awai Studio",
          text: `Dear ${values.customerName},\n\nThank you for your booking request.\nWe have received the following request:\n\nExperience:\n${experience.title}\n\nPreferred dates & times:\n${preferredDateTimeText}\n\nNumber of guests:\n${values.guestCount}\n\nPlease note that this request is not yet confirmed.\nWe will check availability and contact you by email.\n\nAfter we confirm availability, we will send payment details by email.\nYour booking is confirmed only after payment has been completed.\n\nAll dates, times, and deadlines are based on Japan Standard Time (JST).\n\n_/_/_/_/_/_/_/_/_/_/\n\nAwai Studio\nhello@awai-studio.jp\n\n_/_/_/_/_/_/_/_/_/_/`,
        });
      }
    } catch (error) {
      console.error(
        "Booking email delivery failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }

    return NextResponse.json(
      { ok: true, bookingRequestId: bookingRequest.id },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Booking request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return NextResponse.json(
      { message: "Failed to send booking request. Please try again later." },
      { status: 500 },
    );
  }
}
