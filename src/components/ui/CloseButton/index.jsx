// @/components/ui/CloseButton/index.jsx

import styles from "./CloseButton.module.scss";

export default function CloseButton({
  onClick,
  arialabel = "閉じる",
  className = "",
}) {
  return (
    <button
      className={`${styles.button} ${className}`}
      type="button"
      onClick={onClick}
      aria-label={arialabel}
    >
      <span />
      <span />
    </button>
  );
}