// @/app/admin/articles/_components/InitializedArticleEditor.jsx
// エディター本体

"use client";

import { uploadArticleImage } from "@/lib/article/imageUpload";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  DiffSourceToggleWrapper,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  InsertImage,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

export default function InitializedArticleEditor({
  editorRef,
  markdown,
  onChange,
  articleId,
  onImageUploaded,
}) {

  // uploadArticleImage()関数
  //    Storage保存とDB登録
  // handleImageUpload()関数
  //    共通関数を実行
  //    登録した画像情報をArticleFormへ伝える
  //    MDXEditorへ画像URLを返す
  async function handleImageUpload(file) {
    const image = await uploadArticleImage(file, articleId);

    onImageUploaded?.(image);

    return image.public_url;
  }

  return (
    <MDXEditor
      ref={editorRef}
      className="awai-article-editor"
      contentEditableClassName="awai-article-editor-content"
      markdown={markdown}
      onChange={onChange}
      plugins={[
        headingsPlugin({
          allowedHeadingLevels: [2, 3],
        }),
        imagePlugin({
          imageUploadHandler: handleImageUpload,
          disableImageResize: true,
          disableImageSettingsButton: true,
        }),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        diffSourcePlugin({
          viewMode: "rich-text",
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper options={["rich-text", "source"]}>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <CreateLink />
              <InsertImage />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
    />
  );
}