// @/app/api/review-request/route.js

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
      preferredDate1,
      preferredTime1,
      preferredDate2,
      preferredTime2,
      preferredDate3,
      preferredTime3,
      message,
    } = body;

    // 入力必須項目が入力されているかのバリデーション
    if (
      !experienceSlug ||
      !customerName ||
      !customerEmail ||
      !guestCount ||
      !preferredDate1 ||
      !preferredTime1
    ) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 },
      );
    }
  
    // 簡易的なEmailのバリデーション
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(customerEmail);
    if (!isEmailValid) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    // 日時の第二第三候補の整合チェック
    if (preferredDate2 && !preferredTime2) {
      return NextResponse.json(
        { error: "Preferred time 2 is missing." },
        { status: 400 },
      );
    }
    if (preferredDate3 && !preferredTime3) {
      return NextResponse.json(
        { error: "Preferred time 3 is missing." },
        { status: 400 },
      );
    }

    await createBookingRequest({
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
    });

    const fromEmail =
      process.env.BOOKING_FROM_EMAIL || "Awai Studio <hello@awai-studio.jp>";
    const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL;

    const preferredDateTimes = [
      {
        label: "1",
        date: preferredDate1,
        time: preferredTime1,
      },
      {
        label: "2",
        date: preferredDate2,
        time: preferredTime2,
      },
      {
        label: "3",
        date: preferredDate3,
        time: preferredTime3,
      },
    ];

    const preferredDateTimeText = preferredDateTimes
      .filter((item) => item.date && item.time)
      .map((item) => {
        return `${item.label})
${item.date}
${item.time} JST`;
      })
      .join("\n\n");

    await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `[Awai Studio] New booking request: ${experienceTitle}`,
      text: `
A new booking request has been submitted.

Experience:
${experienceTitle}

Preferred dates & times:
${preferredDateTimeText}

Guests:
${guestCount}

Customer:
${customerName}

Email:
${customerEmail}

Message:
${message || "(No message)"}
`,
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

Preferred dates & times:
${preferredDateTimeText}

Number of guests:
${guestCount}

Customer:
${customerName}

Please note that this request is not yet confirmed.
We will check availability and contact you by email.

After we confirm availability, we will send payment details by email.
Your booking is confirmed only after payment has been completed.

All dates, times, and deadlines are based on Japan Standard Time (JST).

_/_/_/_/_/_/_/_/_/_/

Awai Studio
hello@awai-studio.jp

_/_/_/_/_/_/_/_/_/_/
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