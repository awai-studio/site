"use client";

import { useState } from "react";
import styles from "./ReviewForm.module.scss";

export default function ReviewForm({ experience }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formError, setFormError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setFormError("");

      const formData = new FormData(formElement);
      const rating = formData.get("rating");
      const firstName = formData.get("firstName");
      const country = formData.get("country");
      const reviewText = formData.get("reviewText");
      const email = formData.get("email");
      const permissionToPublish = formData.get("permissionToPublish");  

      if (!rating) {
        setFormError("Please select a rating.");
        setIsSubmitting(false);
        return;
      }
      if (!firstName) {
        setFormError("Please select your first name.");
        setIsSubmitting(false);
        return;
      }
      if (!country) {
        setFormError("Please select your country.");
        setIsSubmitting(false);
        return;
      }
      if (!reviewText) {
        setFormError("Please select your review.");
        setIsSubmitting(false);
        return;
      }
      if (!permissionToPublish) {
        setFormError("Please confirm that we may publish your review.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/review-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experienceSlug: experience.slug,
          experienceTitle: experience.title,
          rating: Number(rating),
          firstName,
          country,
          reviewText,
          email,
          permissionToPublish: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send review.")
      }

      setSubmitStatus("success");
      setFormError("");
      formElement.reset();
    } catch(error) {
      console.error(error);
      setFormError("");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={`formBasic ${styles.reviewForm}`} onSubmit={handleSubmit}>
      <input type="hidden" name="experienceSlug" value={experience.slug} />
      <input type="hidden" name="experienceTitle" value={experience.title} />

      <label htmlFor="firstName" className="formLabel">
        <span className="formItemName">First name</span>
        <input id="firstName" type="text" name="firstName" />
      </label>
      <label htmlFor="country" className="formLabel">
        <span className="formItemName">Country</span>
        <input id="country" type="text" name="country" />
      </label>
      <label htmlFor="email" className="formLabel">
        <span className="formItemName">Email</span>
        <input id="email" type="email" name="email" />
      </label>
      <fieldset className={styles.ratingField}>
        <div className={styles.ratingOptions}>
          <span>Check rating :</span>
          {[...Array(5).keys()].map((idx) => {
            const ratingValue = idx + 1;
            return (
              <label
                htmlFor={ratingValue}
                key={ratingValue}
                className={styles.ratingOption}
              >
                <input type="radio" name="rating" value={ratingValue} />
                <span>{ratingValue}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <label htmlFor="reviewText" className="formLabel">
        <span className="formItemName">Review text</span>
        <textarea id="reviewText" name="reviewText" rows="7" />
      </label>
      <label className={styles.permissionLabel}>
        <input type="checkbox" name="permissionToPublish" value="yes" />
        <span className="formItemName">
          I agree that Awai Studio may publish my review using my first name
          and country.
        </span>
      </label>

      {formError && (
        <div className="formErrorMessage">
          <p>{formError}</p>
        </div>
      )}

      <div className="cta">
        <button
          className={`btn btn--regular formInlineCta ${styles.reviewCta}`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Review"}
        </button>
      </div>

      {submitStatus === "success" && (
        <div className="formSuccessMessage">
          <p>Thank you for sharing your review.</p>
          <p>We will read it before publishing it on our website</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="formErrorMessage">
          <p>Failed to send your review.</p>
          <p>Please try again later.</p>
        </div>
      )}
    </form>
  );
}