// @/app/en/review/page.js

import { experiences } from "../experiences/_data/experiences";
import ReviewForm from "./_components/ReviewForm";
import styles from "./review.module.scss";

export const metadata = {
  title: "Leave a Review | Awai Studio",
  description:
    "Share your thoughts about your Awai Studio experience in Kyoto, Japan.",
};

export default async function ReviewPage({ searchParams }) {
  const { experience: experienceSlug } = await searchParams;
  const experience = experiences.find((item) => {
    return item.slug === experienceSlug;
  });

  if (!experience) {
    return (
      <div className="container">
        <section className={styles.reviewPage}>
          <p className="kicker">Awai Studio</p>
          <h1>Leave a Review</h1>
          <p className="shortDescription">
            We could not identify the experience. Please access this page from
            the review OR code you received after your experience.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.reviewPage}>
        <section className={styles.reviewHero}>
          <p className="kicker">Awai Studio</p>
          <h1>Leave a Review</h1>
          <p className="shortDescription">
            Thank you for joining us. If you would like to share your thoughts,
            please leave a short review below.
          </p>
          <div className={styles.experienceName}>
            <div className={styles.experienceLabel}>
              <span>Review for</span>
            </div>
            <h2>{experience.title}</h2>
          </div>
        </section>

        <section className={styles.reviewIntro}>
          <p className={`explanation ${styles.reviewExplanation}`}>
            Your words help us share this small experience with future guests.
            Reviews are not published automatically. We will read your message
            first, and may publish it on our website using your first name and
            country.
          </p>
        </section>

        <section className={styles.reviewFormSection}>
          <ReviewForm experience={experience} />
        </section>
      </div>
    </div>
  );
}
