import Link from "next/link";
import { requireAdmin } from "@/lib/admin/adminAuth";
import ArticleForm from "../_components/ArticleForm";
import styles from "../articles.module.scss";

export const metadata = {
  title: "New Article | Awai Studio Admin",
  robots: { index: false, follow: false },
};

const EMPTY_ARTICLE = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  body_markdown: "",
  seo_title: "",
  seo_description: "",
};

export default async function NewArticlePage({ searchParams }) {
  const query = await searchParams;
  await requireAdmin("editor");

  return (
    <div>
      <Link className={styles.backLink} href="/admin/articles">
        ← 記事一覧へ戻る
      </Link>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>New article</p>
          <h1>記事を書く</h1>
        </div>
      </div>
      <ArticleMessage error={query?.error} />
      <ArticleForm article={EMPTY_ARTICLE} />
    </div>
  );
}

function ArticleMessage({ error }) {
  if (!error) return null;
  const message = error === "duplicate-slug"
    ? "同じURL名の記事があります。別のURL名にしてください。"
    : error === "unsafe-markdown"
      ? "本文に使用できないHTMLまたは危険なURLが含まれています。"
      : "記事を保存できませんでした。入力内容とデータベース設定を確認してください。";
  return <p className={styles.error}>{message}</p>;
}
