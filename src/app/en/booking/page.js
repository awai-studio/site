// @/app/en/booking/page.js

import { experiences } from "../experiences/_data/experiences";
import { getGuestText, getDurationText } from "@/lib/formatExperiences";
import BookingForm from "./_components/BookingForm";
import styles from "./booking.module.scss";

export const metadata = {
  title: "Request Booking | Awai Studio",
  description:
    "Share your thoughts about your Awai Studio experience in Kyoto, Japan.",
};

export default async function BookingPage({ searchParams }) {
  const { experience: experienceSlug } = await searchParams;

  const experience = experiences.find((item) => {
    return item.slug === experienceSlug;
  });

  if (!experience) {
    return (
      <div className="container">
        <h1>Request Booking</h1>
        <p>Please select an experience first.</p>
      </div>
    );
  }

  const guestText = getGuestText(experience.pricing);
  const durationText = getDurationText(experience.duration);

  return (
    <div className="container">
      <div className={styles.bookingPage}>
        <section>
          <p className="kicker">Awai Studio</p>
          <h1>Request Booking</h1>
          <p className="shortDescription">
            Please share your preferred date and details. We will confirm
            availability manually before requesting payment.
          </p>
        </section>

        <section className={styles.experienceSummary}>
          {experience.images?.booking && (
            <div className={styles.bookingImage}>
              <img src={experience.images.booking} alt={experience.title} />
            </div>
          )}
          <div className="wrapper">
            <h2>{experience.title}</h2>
            <p className="explanation">{experience.shortDescription}</p>
          </div>
          <ul className="explanation">
            <li>
              {experience.pricing.displayPrice} {experience.pricing.unit}
            </li>
            <li>{guestText}</li>
            <li>{durationText}</li>
            <li>{experience.cancellation.summary}</li>
            <li>{experience.cancellation.bookingNotice}</li>
            <li>{experience.cancellation.paymentNotice}</li>
          </ul>
        </section>

        <section className={styles.requestForm}>
          <BookingForm experience={experience} />
        </section>
      </div>
    </div>
  );
}
