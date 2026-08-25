// @/app/blog/page.jsx

import Link from "next/link";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import { getArticleImagePublicUrl } from "@/lib/article/imageUrl";
import styles from "./blog.module.scss";

export const metadata = {
  title: "Awai Notes | Reflections on Tea, Zen, and Kyoto",
  description: "Personal reflection from Awai Studio on tea, Zen, and quiet cultural encounters in Kyoto."
};

// 公開記事を60秒間保存して、
// 60秒経過後のアクセス時に最新情報を取得する。
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

  // 公開済みで、公開日時を迎えている記事だけを取得する。
  const { data: articles } = await supabase
    .from("articles")
    .select(`
      id,
      slug,
      title,
      excerpt,
      published_at,
      thumbnail_image_id
    `)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  // 記事に指定されているサムネール画像のIDだけを集める。
  const thumbnailIds = (articles || [])
    .map((article) => article.thumbnail_image_id)
    .filter(Boolean);

  let thumbnailMap = new Map();

  // サムネール画像がある場合だけ、画像情報を取得する。
  if (thumbnailIds.length > 0) {
    const { data: thumbnails } = await supabase
      .from("article_images")
      .select("id, storage_path, alt_text")
      .in("id", thumbnailIds);

    thumbnailMap = new Map(
      (thumbnails || []).map((image) => [image.id, image])
    );
  }

  return (
    <div className="container">
      <div className={`blog ${styles.blogIndex}`}>
        <header>
          <div className="title-eye-catch-en">
            Awai Studio Journal
          </div>
          <h1>Awai Notes</h1>
          <p>
            Letters and reflections from encounters with tea, Zen, and Kyoto.
          </p>
        </header>

        {
          articles?.length 
            ? (
              <section className={styles.articleGrid}>
                {
                  articles.map((article) => {
                    const thumbnail = thumbnailMap.get(article.thumbnail_image_id);

                    return (
                      <article className={styles.articleCard} key={article.id}>
                        <Link href={`/blog/${article.slug}`}>
                          {
                            thumbnail 
                              ? (
                                <img 
                                  src={getArticleImagePublicUrl(thumbnail.storage_path)} 
                                  alt={thumbnail.alt_text || article.title} 
                                />
                              )
                              : (
                                <span 
                                  className={styles.imagePlaceholder}
                                  aria-hidden="true"
                                />
                              )
                          }

                          <div>
                            <time dateTime={article.published_at}>
                              {formatArticleDate(article.published_at)}
                            </time>

                            <h2>{article.title}</h2>

                            {
                              article.excerpt && <p>{article.excerpt}</p>
                            }
                          </div>
                        </Link>
                      </article>
                    );
                  })
                }
              </section>
            )
            : (
              <p>The first note is being prepared.</p>
            )
        }
      </div>
    </div>
  );
}