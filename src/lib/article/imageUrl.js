const BUCKET_NAME = "article-images";

export function getArticleImagePublicUrl(storagePath) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!baseUrl || !storagePath) return "";

  const encodedPath = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${baseUrl}/storage/v1/object/public/${BUCKET_NAME}/${encodedPath}`;
}

export { BUCKET_NAME as ARTICLE_IMAGE_BUCKET };
