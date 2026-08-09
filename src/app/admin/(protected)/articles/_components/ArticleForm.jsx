"use client";

import { useRef, useState } from "react";
import { saveArticle } from "../actions";
import ArticleEditor from "./ArticleEditor";
import ArticleImageManager from "./ArticleImageManager";
import styles from "../articles.module.scss";

export default function ArticleForm({ article, initialImages = [] }) {
  const editorRef = useRef(null);
  const [markdown, setMarkdown] = useState(article.body_markdown || "");
  const [images, setImages] = useState(initialImages);
  const [thumbnailImageId, setThumbnailImageId] = useState(
    article.thumbnail_image_id || "",
  );

  function insertImage(image) {
    editorRef.current?.insertMarkdown(
      `\n\n![${image.alt_text.replaceAll("]", "\\]")}](${image.public_url})\n\n`,
    );
    editorRef.current?.focus();
  }

  return (
    <form className={styles.articleForm} action={saveArticle}>
      {article.id && <input type="hidden" name="articleId" value={article.id} />}
      <textarea hidden readOnly name="bodyMarkdown" value={markdown} />
      <input type="hidden" name="thumbnailImageId" value={thumbnailImageId} />

      <div className={styles.formGrid}>
        <label className={styles.fullField}>
          <span>記事タイトル</span>
          <input
            required
            maxLength="160"
            name="title"
            defaultValue={article.title}
            placeholder="The Sound of Wind in the Tea Room"
          />
        </label>

        <label>
          <span>URL名（半角英小文字・数字・ハイフン）</span>
          <input
            required
            maxLength="120"
            name="slug"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={article.slug}
            placeholder="the-sound-of-wind"
          />
        </label>

        <label>
          <span>概要（400字以内）</span>
          <textarea
            maxLength="400"
            name="excerpt"
            rows="3"
            defaultValue={article.excerpt}
          />
        </label>
      </div>

      <div className={styles.editorField}>
        <div>
          <span>本文</span>
          <small>Word風表示とMarkdown原文を上のボタンで切り替えられます。</small>
        </div>
        <ArticleEditor editorRef={editorRef} markdown={markdown} onChange={setMarkdown} />
      </div>

      {article.id ? (
        <ArticleImageManager
          articleId={article.id}
          images={images}
          onImageAdded={(image) => setImages((current) => [...current, image])}
          onInsert={insertImage}
          selectedThumbnailId={thumbnailImageId}
          onSelectThumbnail={setThumbnailImageId}
        />
      ) : (
        <p className={styles.imageMessage}>
          写真は記事を一度下書き保存した後に登録できます。
        </p>
      )}

      <details className={styles.seoFields}>
        <summary>検索・SNS表示の設定</summary>
        <div className={styles.formGrid}>
          <label>
            <span>SEOタイトル（70字以内）</span>
            <input
              maxLength="70"
              name="seoTitle"
              defaultValue={article.seo_title}
            />
          </label>
          <label>
            <span>SEO説明文（180字以内）</span>
            <textarea
              maxLength="180"
              name="seoDescription"
              rows="3"
              defaultValue={article.seo_description}
            />
          </label>
        </div>
      </details>

      <div className={styles.formActions}>
        <button type="submit" name="status" value="draft">
          下書き保存
        </button>
        <button className={styles.publishButton} type="submit" name="status" value="published">
          公開する
        </button>
      </div>
    </form>
  );
}
