import styles from "./FullDescription.module.scss";

export default function FullDescription({ blocks }) {
  return (
    <div className={styles.fullDescription}>
      {
        blocks.map((block, idx) => (
          block.type === "image"
            ? (
                <figure className={styles.descriptionImage} key={idx}>
                  <img src={block.src} alt={block.alt} />
                </figure> 
              )
            : (
              block.type === "heading"
                ? (
                    <h3 className={styles.fullDescriptionH3} key={idx}>
                      {block.text}
                    </h3>
                  )
                : (
                    <p key={idx}>
                      {(block.text ?? "").split("\n").map((line, index, lines) => (
                        <span key={index}>
                          {line}
                          {index !== lines.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  )
              )
        ))
      }
    </div>
  );
}
