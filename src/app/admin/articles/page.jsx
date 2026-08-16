// @/app/admin/articles/page.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ARTICLE_STATUSES } from "@/lib/admin/articleValidation";
import styles from "./articlesIndex.module.scss";

export default function ArticlesIndexPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadArticle() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, status, published_at, updated_at")
        .order("updated_at", { ascending: false });

      if (error) {
        setMessage("記事一覧を取得できませんでした。");
        setIsLoading(false);
        return;
      }

      setArticles(data || []);
      setIsLoading(false);
    }

    loadArticle();
  }, [router]);

  if (isLoading) {
    return (
      <div className="container">
        <div className={styles.articlesIndex}>
          <p>記事一覧を読み込んでいます。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.articlesIndex}>
        <header>
          <div>Publishing</div>
          <h1>Awai Notes</h1>

          <Link href="/admin/articles/new">新しい記事を書く</Link>
        </header>

        {message && (
          <div className="formErrorMessage">
            <p>{message}</p>
          </div>
        )}

        {!message && articles.length === 0 && (
          <section>
            <p>記事はまだありません。</p>

            <Link href="/admin/articles/new">最初に記事を作成する。</Link>
          </section>
        )}

        {articles.length > 0 && (
          <section>
            {articles.map((article) => (
              <article key={article.id}>
                <p>{ARTICLE_STATUSES[article.status] || article.status}</p>
                <h2>{article.title}</h2>
                <p>/blog/{article.slug}</p>
                <Link href={`/admin/articles/${article.id}`}>編集する</Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
