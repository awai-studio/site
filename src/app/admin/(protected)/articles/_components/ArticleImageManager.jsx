"use client";

import { useRef, useState } from "react";
import styles from "../articles.module.scss";

export default function ArticleImageManager({
  articleId,
  images,
  onImageAdded,
  onInsert,
  selectedThumbnailId,
  onSelectThumbnail,
}) {
  const fileRef = useRef(null);
  const [altText, setAltText] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage() {
    const file = fileRef.current?.files?.[0];
    if (!file || !altText.trim()) {
      setMessage("写真と写真の説明を入力してください。");
      return;
    }

    setIsUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.set("articleId", articleId);
    formData.set("altText", altText.trim());
    formData.set("image", file);

    try {
      const response = await fetch("/api/admin/article-images", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "写真を登録できませんでした。");
        return;
      }

      onImageAdded(result.image);
      setAltText("");
      fileRef.current.value = "";
      setMessage("写真を登録しました。本文への挿入またはサムネール指定ができます。");
    } catch {
      setMessage("写真を登録できませんでした。");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className={styles.imageManager}>
      <div className={styles.sectionHeading}>
        <span>写真</span>
        <small>JPEG・PNG・WebP。写真の説明は画像が見えない場合にも使われます。</small>
      </div>

      <div className={styles.imageUploadRow}>
        <label>
          <span>写真を選択</span>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" />
        </label>
        <label>
          <span>写真の説明</span>
          <input
            maxLength="180"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Tea utensils arranged in the tea room"
          />
        </label>
        <button type="button" onClick={uploadImage} disabled={isUploading}>
          {isUploading ? "登録中…" : "写真を登録"}
        </button>
      </div>

      {message && <p className={styles.imageMessage}>{message}</p>}

      {images.length > 0 && (
        <div className={styles.imageLibrary}>
          {images.map((image) => (
            <article key={image.id} className={styles.imageCard}>
              <img src={image.public_url} alt={image.alt_text} />
              <p>{image.alt_text}</p>
              <button type="button" onClick={() => onInsert(image)}>
                本文に挿入
              </button>
              <label className={styles.thumbnailChoice}>
                <input
                  type="radio"
                  name="thumbnail-choice"
                  checked={selectedThumbnailId === image.id}
                  onChange={() => onSelectThumbnail(image.id)}
                />
                <span>サムネール画像に指定</span>
              </label>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
