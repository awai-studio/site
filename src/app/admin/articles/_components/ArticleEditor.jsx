// @/app/admin/articles/_components/ArticleEditor.jsx

"use client";

import dynamic from "next/dynamic";

const InitializedArticleEditor = dynamic(
  () => import("./InitializedArticleEditor"),
  {
    ssr: false,
    loading: () => (
      <p className="article-editor-loading">
        編集画面を準備しています。
      </p>
    )
  }
);

export default function ArticleEditor({
  editorRef,
  markdown,
  onChange,
  articleId,
  onImageUploaded,
}) {
  return (
    <InitializedArticleEditor 
      editorRef={editorRef}
      markdown={markdown}
      onChange={onChange}
      articleId={articleId}
      onImageUploaded={onImageUploaded}
    />
  );
}
