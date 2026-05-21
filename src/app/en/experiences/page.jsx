// @/app/en/experiences/page.js

import Link from "next/link";
import { experiences } from "./_data/experiences";
import { getGuestText } from "@/lib/formatExperiences";
import styles from "./experiences.module.scss";

export default function ExperiencesPage() {
  return (
    <div className="container">
      {/* HERO */}
      <section className={styles.experiencesHero}>
        <p className="kicker">Awai Studio</p>
        <h1>Experiences</h1>
        <p className="shortDescription">
          Cultural experiences in Kyoto for small groups, shaped through
          practice, dialogue, and reflection.
        </p>
      </section>

      {/* GRID */}
      <section className={styles.experienceIndex}>
        {/* Tea Experience */}
        {experiences.map((experience) => (
          <Link
            key={experience.slug}
            className={styles.experienceCard}
            // Next.jsは、このURLの『experience.slug』を
            // ExperienceDetailPage({ params })の『params』に渡す。
            // AppRouterが自動で判断してやっている。
            href={`/en/experiences/${experience.slug}`}
          >
            <div className={styles.experienceThumbnail}>
              <img src={experience.images.thumbnail} alt={experience.title} />
            </div>
            <div className={styles.experienceCardBody}>
              <div className="wrapper">
                <h2>{experience.cardTitle}</h2>
                <p className="explanation">{experience.cardShortDescription}</p>
              </div>
              <ul className="explanation">
                <li>{experience.duration.minutes} minutes</li>
                <li>{getGuestText(experience.pricing)}</li>
              </ul>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}