import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { getArticleImagePublicUrl } from "@/lib/article/imageUrl";
import ArticleForm from "../_components/ArticleForm";
import styles from "../articles.module.scss";

export const metadata = {
  title: "Edit Article | Awai Studio Admin",
  robots: { index: false, follow: false },
};

export default async function EditArticlePage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase, admin } = await requireAdmin();
  const { data: article, error } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, body_markdown, status, seo_title, seo_description, thumbnail_image_id")
    .eq("id", id)
    .maybeSingle();

  if (error || !article) notFound();

  const { data: imageRecords } = await supabase
    .from("article_images")
    .select("id, storage_path, alt_text")
    .eq("article_id", article.id)
    .order("created_at", { ascending: true });

  const images = (imageRecords || []).map((image) => ({
    ...image,
    public_url: getArticleImagePublicUrl(image.storage_path),
  }));

  return (
    <div>
      <Link className={styles.backLink} href="/admin/articles">
        ← 記事一覧へ戻る
      </Link>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Edit article</p>
          <h1>{article.title}</h1>
        </div>
      </div>
      {query?.saved === "1" && <p className={styles.success}>記事を保存しました。</p>}
      {query?.created === "1" && <p className={styles.success}>記事を作成しました。</p>}
      <ArticleMessage error={query?.error} />
      {admin.role === "editor" ? (
        <ArticleForm article={article} initialImages={images} />
      ) : (
        <p className={styles.error}>閲覧権限のため記事を編集できません。</p>
      )}
    </div>
  );
}

function ArticleMessage({ error }) {
  if (!error) return null;
  const message = error === "duplicate-slug"
    ? "同じURL名の記事があります。別のURL名にしてください。"
    : error === "unsafe-markdown"
      ? "本文に使用できないHTMLまたは危険なURLが含まれています。"
      : error === "invalid-thumbnail"
        ? "この記事に登録された写真からサムネール画像を選択してください。"
      : "記事を保存できませんでした。入力内容とデータベース設定を確認してください。";
  return <p className={styles.error}>{message}</p>;
}
