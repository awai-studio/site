// @/app/blog/[slug]/page.jsx

import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import styles from "../blog.module.scss";

function formatArticleDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

// URL名が一致する公開記事を1件取得する。
async function getArticle(slug) {
  const supabase = createPublicServerClient();

  const { data } = await supabase
    .from("articles")
    .select(`
      slug,
      title,
      excerpt,
      body_markdown,
      seo_title,
      seo_description,
      published_at
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  return data;
}

// 記事ごとのSEO情報を設定する。
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug)

  if (!article) {
    return {};
  }
  
  return {
    title: article.seo_title || `${article.title} | Awai Notes`,
    description: article.seo_description || article.excerpt
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug)
  
  if (!article) {
    notFound();
  }

  return (
    <div className="container">
      <article className={`blog ${styles.articlePage}`}>
        <Link className="back-link" href="/blog">
          ←&nbsp;Awai&nbsp;Notes
        </Link>

        <header>
          <p className="title-eye-catch-en">Awai&nbsp;Notes</p>
          <h1>{article.title}</h1>

          <time dateTime={article.published_at}>
            {formatArticleDate(article.published_at)}
          </time>
        </header>

        <div className={styles.articleBody}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.body_markdown}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}