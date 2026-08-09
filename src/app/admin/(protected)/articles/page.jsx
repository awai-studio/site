import Link from "next/link";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { ARTICLE_STATUSES } from "@/lib/admin/articleValidation";
import { formatAdminDateTime } from "@/lib/admin/bookingStatus";
import styles from "./articles.module.scss";

export const metadata = {
  title: "Awai Notes | Awai Studio Admin",
  robots: { index: false, follow: false },
};

export default async function ArticlesPage() {
  const { supabase, admin } = await requireAdmin();
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, slug, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Publishing</p>
          <h1>Awai Notes</h1>
        </div>
        {admin.role === "editor" && (
          <Link className={styles.newButton} href="/admin/articles/new">
            新しい記事
          </Link>
        )}
      </div>

      {error ? (
        <p className={styles.error}>
          記事一覧を取得できませんでした。記事用データベースの設定を確認してください。
        </p>
      ) : articles?.length ? (
        <div className={styles.articleList}>
          {articles.map((article) => (
            <article className={styles.articleCard} key={article.id}>
              <div>
                <span className={styles.status} data-status={article.status}>
                  {ARTICLE_STATUSES[article.status] || article.status}
                </span>
                <time>更新 {formatAdminDateTime(article.updated_at)}</time>
              </div>
              <h2>{article.title}</h2>
              <p>/blog/{article.slug}</p>
              <Link href={`/admin/articles/${article.id}`}>編集する</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>記事はまだありません。</p>
          {admin.role === "editor" && (
            <Link href="/admin/articles/new">最初の記事を作成する</Link>
          )}
        </div>
      )}
    </div>
  );
}
