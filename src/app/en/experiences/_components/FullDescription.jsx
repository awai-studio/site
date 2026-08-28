// @/app/en/experiences/_components/FullDescription.jsx

"use client";

import { useState } from "react";
import styles from "./FullDescription.module.scss";

export default function FullDescription({ blocks }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  }

  const firstBlocks = blocks.slice(0, 4);
  const restBlocks = blocks.slice(4);

  function renderBlock(block, idx) {
    return block.type === "image" 
      ? (
        <figure className={styles.descriptionImage} key={idx}>
          <img src={block.src} alt={block.alt} />
        </figure>
        ) 
      : block.type === "heading" 
        ? (
          <h3 className={styles.fullDescriptionH3} key={idx}>
            {block.text}
          </h3>
          )
        : (
          <p key={idx}>
            {(
              typeof block.text === "string"
                ? block.text.split("\n")
                : [block.text]
              ).map((line, index, lines) => (
                <span key={index}>
                  {line}
                  {index !== lines.length - 1 && <br />}
                </span>
              )
            )}
            {/* {(block.text ?? "").split("\n").map((line, index, lines) => (
              <span key={index}>
                {line}
                {index !== lines.length - 1 && <br />}
              </span>
            ))} */}
          </p>
      );
  }

  return (
    <div className={styles.fullDescription}>
      {firstBlocks.map((block, idx) => renderBlock(block, idx))}
      <div className={`${styles.fullDescriptionMore} ${isOpen ? styles.isOpen : ""}`}>
        {restBlocks.map((block, idx) => renderBlock(block, idx + firstBlocks.length))}
      </div>
      {restBlocks.length > 0 && (
      <div className={`cta ${styles.readMoreCta}`}>
        <button 
          className={`btn btn--regular ${styles.readMoreButton}`}
          onClick={handleIsOpen}
          type="button"
        >
          {isOpen ? "Show less" : "Read more"}
        </button>
      </div>
      )}
    </div>
  );
}
