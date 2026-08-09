import Link from "next/link";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import { getArticleImagePublicUrl } from "@/lib/article/imageUrl";
import styles from "./blog.module.scss";

export const metadata = {
  title: "Awai Notes | Reflections on Tea, Zen, and Kyoto",
  description:
    "Personal reflections from Awai Studio on tea, Zen, and quiet cultural encounters in Kyoto.",
};

export const revalidate = 60;

function formatArticleDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

export default async function BlogPage() {
  const supabase = createPublicServerClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, slug, title, excerpt, published_at, thumbnail_image_id")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  const thumbnailIds = (articles || [])
    .map((article) => article.thumbnail_image_id)
    .filter(Boolean);
  let thumbnailMap = new Map();

  if (thumbnailIds.length > 0) {
    const { data: thumbnails } = await supabase
      .from("article_images")
      .select("id, storage_path, alt_text")
      .in("id", thumbnailIds);
    thumbnailMap = new Map((thumbnails || []).map((image) => [image.id, image]));
  }

  return (
    <div className={styles.blogPage}>
      <header className={styles.blogHeader}>
        <p className={styles.eyebrow}>Awai Studio Journal</p>
        <h1>Awai Notes</h1>
        <p>Letters and reflections from encounters with tea, Zen, and Kyoto.</p>
      </header>

      {articles?.length ? (
        <div className={styles.articleGrid}>
          {articles.map((article) => {
            const thumbnail = thumbnailMap.get(article.thumbnail_image_id);
            return (
              <article className={styles.articleCard} key={article.id}>
                <Link href={`/blog/${article.slug}`}>
                  {thumbnail ? (
                    <img
                      src={getArticleImagePublicUrl(thumbnail.storage_path)}
                      alt={thumbnail.alt_text}
                    />
                  ) : (
                    <span className={styles.imagePlaceholder} aria-hidden="true" />
                  )}
                  <div>
                    <time dateTime={article.published_at}>
                      {formatArticleDate(article.published_at)}
                    </time>
                    <h2>{article.title}</h2>
                    {article.excerpt && <p>{article.excerpt}</p>}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <p className={styles.empty}>The first note is being prepared.</p>
      )}
    </div>
  );
}
