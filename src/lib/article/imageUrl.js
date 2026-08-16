// @/lib/article/imageUrl.js

// Supabase Storageに保存した記事画像の公開URLを作る部品

const BUCKET_NAME = "article-images";

export function getArticleImagePublicUrl(storagePath) {
  // 行末の「/」をとってるだけ。
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  
  if (!baseUrl || !storagePath) {
    return "";
  }

  // encodeURIComponent()関数は、
  // ファイル名に空白や日本語などが含まれていても、
  // URLとして安全な形式へ変換する。
  const encodePath = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  
  return `${baseUrl}/storage/v1/object/public/${BUCKET_NAME}/${encodePath}`;
}

export { BUCKET_NAME as ARTICLE_IMAGE_BUCKET };