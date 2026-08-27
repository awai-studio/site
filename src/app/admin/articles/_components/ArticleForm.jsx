// @/app/admin/articles/_components/ArticleForm.jsx
// 記事作成・編集の共通フォーム

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { parseArticleForm } from "@/lib/admin/articleValidation";
import { uploadArticleImage } from "@/lib/article/imageUpload";
import ArticleEditor from "./ArticleEditor";

export default function ArticleForm({ 
  article,
  initialImages = [],
}) {
  const router = useRouter();
  // editorRefはMDXEditorを外側から操作するためのリモコン。
  const editorRef = useRef(null);
  // articleはオブジェクト。
  // body_markdownプロパティを当てて状態を作っている。値がなければ空文字列を入れる。
  const [markdown, setMarkdown] = useState(article.body_markdown || "");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [images, setImages] = useState(initialImages);

  const [thumbnailImageId, setThumbnailImageId] = useState(
    article.thumbnail_image_id || ""
  );

  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  // スプレッド構文「...」を使って、元の配列の要素を追加、オブジェクトの属性を追加・上書きする書き方
  // この場合は、現在の画像群に画像を追加する。
  function handleImageUploaded(image) {
    setImages((currentImages) => [
      ...currentImages, image
    ]);
  }

  async function handleThumbnailUpload(event) {
    const input = event.currentTarget
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingThumbnail(true);
    setMessage("");

    try {
      const image = await uploadArticleImage(file, article.id || null);

      handleImageUploaded(image);
      setThumbnailImageId(image.id);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "サムネール画像を登録できませんでした。"
      );
    } finally {
      input.value = "";
      setIsUploadingThumbnail(false);
    }
    
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    // eventオブジェクト
    // └── Reactが渡すフォーム送信イベント
    // nativeEventプロパティ
    // └── ブラウザ本来の送信イベント
    // submitterプロパティ
    // └── 送信を発生させたボタン
    // これらを充てていくと、オブジェクトが出来上がる。
    // submitButton = { type: "submit", value: "draft", その他のボタン情報 };
    const submitButton = event.nativeEvent.submitter;
    // submitButton?.valueに値があればその値を、無ければ「draft」を格納する。
    const status = submitButton?.value || "draft";
    // ブラウザ内にある formDataオブジェクトへ値を追加する。
    formData.set("status", status);
    // 「下書き保存」または「公開する」を押したときに、
    // 現在エディターにある本文をFormDataへ追加する。
    // この時点では、まだDBへ送信していない。
    formData.set("bodyMarkdown", markdown);

    // 正常なら、DB保存用の形が返る。「parsed.article」
    // 異常なら、「parsed.error」
    const parsed = parseArticleForm(formData);

    if (parsed.error) {
      const errorMessage =
        parsed.error === "unsafe-markdown"
          ? "本文に使用できないHTMLまたはURLが含まれています。"
          : "入力内容を確認してください。";

      setMessage(errorMessage);
      setIsSaving(false);
      return;
    }

    // 現在のログイン利用者をDBに確認する。
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    // 既存記事にはIDがあるので、記事IDがあれば更新する
    const articleData = {
      ...parsed.article,
      thumbnail_image_id: parsed.thumbnailImageId,
    };

    const saveQuery = article.id
      ? supabase
          .from("articles")
          .update(articleData)
          .eq("id", article.id)
          .select("id")
          .single()
      : supabase
          .from("articles")
          .insert({
            ...articleData,
            author_id: user.id,
          })
          .select("id")
          .single();

    // 変数saveQueryが、Supabaseライブラリによって
    // 「awaitできる問い合わせオブジェクト」として作られている。
    // await saveQueryをきっかけにDBへ通信が行われ、DBでの処理が完了すると、
    // 値は、オブジェクトに格納。
    // 次にif (saveError || !saveArticle){...}へ進んでいく。
    const { data: saveArticle, error: saveError } = await saveQuery;

    if (saveError || !saveArticle) {
      console.error("記事保存エラー:", saveError);

      setMessage(
        saveError?.code === "23505"
          ? "同じURL名の記事があります。"
          : "記事を保存できませんでした。",
      );

      setIsSaving(false);
      return;
    }

    const pendingImageIds = images
      .filter((image) => !image.article_id)
      .map((image) => image.id);

    if (pendingImageIds.length > 0) {
      const { error: imageUpdateError } = await supabase
        .from("article_images")
        .update({
          article_id: saveArticle.id,
        })
        .in("id", pendingImageIds)
        .is("article_id", null);

      if (imageUpdateError) {
        setMessage(
          "記事は保存されましたが、画像を記事へ関連づけられませんでした。",
        );

        setIsSaving(false);
        return;
      }
    }

    if (article.id) {
      setMessage("記事を保存しました。");
      setIsSaving(false);
      return;
    }

    router.push(`/admin/articles/${saveArticle.id}`);
  }

  return (
    <form className="formBasic" onSubmit={handleSubmit}>
      {article.id && (
        <input type="hidden" name="articleId" value={article.id} />
      )}

      <input type="hidden" name="thumbnailImageId" value={thumbnailImageId} />

      <label className="formLabel">
        <span className="formItemName">記事タイトル</span>

        <input
          type="text"
          name="title"
          defaultValue={article.title}
          maxLength="160"
          placeholder="Title"
          required
        />
      </label>

      <label className="formLabel">
        <span className="formItemName">URL</span>

        <input
          type="text"
          name="slug"
          defaultValue={article.slug}
          maxLength="120"
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          placeholder="URL"
          required
        />
      </label>

      <label className="formLabel">
        <span className="formItemName">概要（400字以内）</span>

        <textarea
          name="excerpt"
          defaultValue={article.excerpt}
          maxLength="400"
          rows="3"
        />
      </label>

      <div className="wrapper">
        <div className="formItemName">
          <span>本文</span>
          <p> Word風表示とMarkdown原文を切り替え可能</p>
        </div>

        <ArticleEditor
          editorRef={editorRef}
          markdown={markdown}
          onChange={setMarkdown}
          articleId={article.id || null}
          onImageUploaded={handleImageUploaded}
        />

        <section className="article-image-library">
          <div className="article-image-library__heading">
            <h2>サムネール画像</h2>

            <p>登録済み画像から、記事一覧に表示する画像を選択します。</p>
          </div>

          <label className="article-image-library__upload">
            <span>専用サムネール画像を追加</span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploadingThumbnail}
              onChange={handleThumbnailUpload}
            />
          </label>

          {isUploadingThumbnail && <p>サムネール画像を登録しています。</p>}

          {images.length === 0 && <p>登録済み画像はありません。</p>}

          {images.length > 0 && (
            <div className="article-image-library__items">
              {images.map((image) => (
                <label className="article-image-library__item" key={image.id}>
                  <img src={image.public_url} alt="" />

                  <input
                    type="radio"
                    name="thumbnailChoice"
                    value={image.id}
                    checked={thumbnailImageId === image.id}
                    onChange={() => {
                      setThumbnailImageId(image.id);
                    }}
                  />

                  <span>サムネールに指定</span>
                </label>
              ))}
            </div>
          )}

          {thumbnailImageId && (
            <button
              type="button"
              onClick={() => {
                setThumbnailImageId("");
              }}
            >
              サムネール指定を解除
            </button>
          )}
        </section>

        <details>
          <summary>検索・SNS表示の設定</summary>

          <div className="formBasic">
            <label className="formLabel">
              <span className="formItemName">SEOタイトル（70字以内）</span>

              <input
                type="text"
                name="seoTitle"
                defaultValue={article.seo_title}
                maxLength="70"
              />
            </label>

            <label className="formLabel">
              <span className="formItemName">SEO説明文（180字以内）</span>

              <textarea
                name="seoDescription"
                rows="3"
                defaultValue={article.seo_description}
                maxLength="180"
              />
            </label>
          </div>
        </details>

        {message && (
          <div className="formErrorMessage">
            <p>{message}</p>
          </div>
        )}

        <div className="formInlineCta cta">
          <button
            className="btn btn--regular"
            type="submit"
            value="draft"
            disabled={isSaving}
          >
            {isSaving ? "保存中..." : "下書き保存"}
          </button>

          <button
            className="btn btn--regular"
            type="submit"
            value="published"
            disabled={isSaving}
          >
            公開する
          </button>
        </div>
      </div>
    </form>
  );
}