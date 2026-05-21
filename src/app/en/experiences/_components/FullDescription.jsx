import styles from "./FullDescription.module.scss";

export default function FullDescription({ blocks }) {
  return (
    <div className={styles.fullDescription}>
      {
        blocks.map((block, idx) => (
          block.type === "paragraph"
            ? (<p key={idx}>{block.text}</p>)
            : (
                <figure className={styles.descriptionImage} key={idx}>
                  <img src={block.src} alt={block.alt} />
                </figure> 
              )
        ))
      }
    </div>
  );
}
