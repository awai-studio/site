"use client";

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
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

export default function InitializedArticleEditor({ editorRef, markdown, onChange }) {
  return (
    <MDXEditor
      ref={editorRef}
      className="awai-article-editor"
      contentEditableClassName="awai-article-editor-content"
      markdown={markdown}
      onChange={onChange}
      plugins={[
        headingsPlugin({ allowedHeadingLevels: [2, 3] }),
        imagePlugin({
          disableImageResize: true,
          disableImageSettingsButton: true,
        }),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        diffSourcePlugin({ viewMode: "rich-text" }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper options={["rich-text", "source"]}>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <CreateLink />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
    />
  );
}
