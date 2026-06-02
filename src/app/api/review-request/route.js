// @/app/api/review-request/route.js

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      experienceSlug,
      experienceTitle,
      rating,
      firstName,
      country,
      reviewText,
      permissionToPublish,
    } = body;

    // 入力必須項目が入力されているかのバリデーション
    if (
      !experienceSlug ||
      !experienceTitle ||
      !rating ||
      !firstName ||
      !country ||
      !reviewText ||
      !permissionToPublish
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

    const ratingNumber = Number(rating);
    if (Number.isNaN(ratingNumber) ||
        ratingNumber < 1 ||
        ratingNumber > 5) {
      return NextResponse.json(
        { error: "Invalid rating."},
        { status: 400 }
      );
    }

    const fromEmail =
      process.env.BOOKING_FROM_EMAIL || "Awai Studio <hello@awai-studio.jp>";
    const notifyEmail = 
      process.env.REVIEW_NOTIFY_EMAIL ||
      process.env.BOOKING_NOTIFY_EMAIL;

    await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `[Awai Studio] New review submitted: ${experienceTitle}`,
      text: `
A new review has been submitted.

Experience:
${experienceTitle}

Experience slug:
${experienceSlug}

Rating:
${ratingNumber}

First name:
${firstName}

Country:
${country}

Email:
${email || "(Not provided)"}

Permssion to publish:
${permissionToPublish ? "Yes" : "No"}

Review:
${reviewText}

Suggested reviews.js format:

{
  id: ",
  experienceSlug: "${experienceSlug}",
  rating: ${ratingNumber},
  firstName: "${firstName}",
  country: "${country}",
  date: "",
  text: \`${reviewText}\`,
  isPublished: false,
}
`,
    });

    return NextResponse.json({ ok: true });
  } catch(error) {
    console.error(error);
    
    return NextResponse.json(
      { error: "Failed to send review."},
      { status: 500 }
    );
  }
}