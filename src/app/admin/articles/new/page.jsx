// @/app/admin/articles/new/page.jsx

import Link from "next/link";
import ArticleForm from "../_components/ArticleForm";
import styles from "./newPage.module.scss";

export const metadata = {
  title: "New Article | Awai studio Admin",
  robots: {
    index: false,
    follow: false
  }
};

const EMPTY_ARTICLE = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  body_markdown: "",
  seo_title: "",
  seo_description: "",
  thumbnail_image_id: ""
};

export default function NewArticlePage() {
  return (
    <div className="container">
      <div className={`blog ${styles.newPage}`}>
        <Link className="back-link" href="/admin/articles">
          ←&nbsp;記事一覧へ戻る
        </Link>

        <header>
          <div className={`title-eye-catch-en ${styles.newPageEyeCatchEN}`}>
            New article
          </div>
          <h1>記事を書く</h1>
        </header>

        <ArticleForm article={EMPTY_ARTICLE} />
      </div>
    </div>
  );
}