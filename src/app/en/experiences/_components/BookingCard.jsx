// @/app/en/experiences/_components/BookingCard.jsx

import Link from "next/link";
import { getGuestText, getDurationText, getMinimumGuestText } from "@/lib/formatExperiences";
import styles from "./BookingCard.module.scss";

export default function BookingCard({ experience }) {
  const guestText = getGuestText(experience.pricing);
  const durationText = getDurationText(experience.duration);
  const minimumGuestText = getMinimumGuestText(experience.pricing);

  return (
    <aside className={styles.bookingCard}>
      <div className="wrapper">
        <p className={styles.bookingPrice}>{experience.pricing.displayPrice}</p>
        <p className={styles.bookingUnit}>{experience.pricing.unit}</p>
      </div>

      <ul className={`${styles.bookingMeta} ${styles.explanation}`}>
        <li>{guestText}</li>
        <li>{durationText}</li>
        <li>{experience.cancellation.summary}</li>
      </ul>

      {minimumGuestText && (
        <p className={styles.bookingNote}>{minimumGuestText}</p>
      )}

      <div className="cta">
        <Link
          className={`btn btn--regular ${styles.bookingCardInlineCta}`}
          href={experience.bookingHref}
          data-gtm-event="cta_click"
          data-gtm-location="experience_detail_check_availability"
          data-gtm-experience={experience.slug}
        >
          Check Availability
        </Link>
      </div>
    </aside>
  );
}