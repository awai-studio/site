// @/lib/admin/articleValidation.js

// タイトル、URL名、概要、本文、SEO情報などが、
// 決めた文字数や形式に合っているか確認する。

export const ARTICLE_STATUSES = {
  draft: "下書き",
  published: "公開"
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const HTML_PATTERN = /<\/?[a-z][^>]*>/i;
const UNSAFE_URL_PATTERN = /(?:javascript|vbscript|data)\s*:/i;

function readText(formData, name, maxLength) {
  const value = String(formData.get(name) || "").trim();

  return value.length <= maxLength ? value : null;
}

export function parseArticleForm(formData) {
  const title = readText(formData, "title", 160);
  const slug = readText(formData, "slug", 120)?.toLowerCase();
  const excerpt = readText(formData, "excerpt", 400);
  const bodyMarkdown = readText(formData, "bodyMarkdown", 100000);
  const seoTitle = readText(formData, "seoTitle", 70);
  const seoDescription = readText(formData, "seoDescription", 180);
  const status = String(formData.get("status") || "draft");

  const thumbnailImageId = String(formData.get("thumbnailImageId") || "").trim();

  if (
    !title ||
    !slug ||
    !SLUG_PATTERN.test(slug) ||
    excerpt === null ||
    bodyMarkdown === null ||
    seoTitle === null ||
    seoDescription === null ||
    (thumbnailImageId && !UUID_PATTERN.test(thumbnailImageId)) ||
    !Object.hasOwn(ARTICLE_STATUSES, status)
  ) {
    return { error: "invalid" };
  }

  if (
    HTML_PATTERN.test(bodyMarkdown) ||
    UNSAFE_URL_PATTERN.test(bodyMarkdown)
  ) {
    return { error: "unsafe-markdown"};
  }

  return {
    article: {
      title,
      slug,
      excerpt,
      body_markdown: bodyMarkdown,
      seo_title: seoTitle,
      seo_description: seoDescription,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    },
    thumbnailImageId: thumbnailImageId || null
  };
}