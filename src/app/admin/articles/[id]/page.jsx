// @/app/admin/articles/[id]/page.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getArticleImagePublicUrl } from "@/lib/article/imageUrl";
import ArticleForm from "../_components/ArticleForm";
import styles from "./editPage.module.scss";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [images, setImages] = useState([]);
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
        .select(`
          id,
          title,
          slug,
          excerpt,
          body_markdown,
          status,
          seo_title,
          seo_description,
          thumbnail_image_id
        `)
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        setMessage("記事を取得できませんでした。");
        setIsLoading(false);
        return;
      }

      const {
        data: imageRecords,
        error: imageError,
      } = await supabase
        .from("article_images")
        .select("id, article_id, storage_path")
        .eq("article_id", id)
        .order("created_at", {
          ascending: true,
        });

      if (imageError) {
        setMessage("登録済み画像を取得できませんでした。");
        setIsLoading(false);
        return;
      }

      const articleImages = (imageRecords || []).map((image) => ({
        ...image, 
        public_url: getArticleImagePublicUrl(image.storage_path)
      }));

      setImages(articleImages);

      setArticle(data);
      setIsLoading(false);
    }

    loadArticle();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="system-info">記事を読み込んでいます。</div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="container">
        <div className="formErrorMessage">
          <div className="system-info">{message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={`blog ${styles.editPage}`}>
        <Link className="back-link" href="/admin/articles">
          ←&nbsp;記事一覧へ戻る
        </Link>

        <header>
          <div className={`title-eye-catch-en ${styles.newPageEyeCatchEN}`}>
            Edit article
          </div>
          <h1>{article.title}</h1>
        </header>

        <ArticleForm 
          article={article} 
          initialImages={images}
        />
      </div>
    </div>
  );
}

