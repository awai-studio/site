// @/app/api/booking-request/page.js

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createBookingRequest } from "@/lib/supabase/bookingRequests";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      experienceSlug,
      experienceTitle,
      customerName,
      customerEmail,
      guestCount,
      preferredDate,
      preferredTime,
      message,
    } = body;

    if (
      !experienceSlug ||
      !customerName ||
      !customerEmail ||
      !guestCount ||
      !preferredDate ||
      !preferredTime ||
      !message
    ) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 },
      );
    }

    await createBookingRequest({
      experienceSlug,
      customerName,
      customerEmail,
      guestCount,
      preferredDate,
      preferredTime,
      message
    });

    // const fromEmail = process.env.BOOKING_FROM_EMAIL || "Awai Studio <dev@awai-studio.jp>";
    // const notifyEmail = process.env.BOOKING_FROM_EMAIL;

    const fromEmail = process.env.BOOKING_FROM_EMAIL || "Awai Studio <hello@awai-studio.jp>";
    const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL;

    await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `[Awai Studio] New booking request: ${experienceTitle}`,
      text: `
A new booking request has been submitted.

Experience:
${experienceTitle}

Date:
${preferredDate}

Time:
${preferredTime} JST

Guests:
${guestCount}

Customer:
${customerName}

Email:
${customerEmail}

Message:
${message || "(No message)"}
`
    });

    await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: "We received your booking request | Awai Studio",
      text: `
Dear ${customerName},

Thank you for your booking request.
We have received the following request:

Experience:
${experienceTitle}

Preferred date:
${preferredDate}

Preferred time:
${preferredTime} JST

Number of Guests:
${guestCount}

Customer:
${customerName}

Please note that this request is not yet confirmed.
We will check availability and contact you by email.

All dates and times are based on Kyoto local time (JST).

Awai Studio
`,
    });
    return NextResponse.json({ ok: true });

  } catch(error) {
    console.error(error);
    
    return NextResponse.json(
      { error: "Failed to send booking request."},
      { status: 500 }
    );
  }
}

