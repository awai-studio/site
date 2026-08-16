// @/lib/article/imageUpload.js

import { supabase } from "@/lib/supabase/client";
import {
  ARTICLE_IMAGE_BUCKET,
  getArticleImagePublicUrl
} from "@/lib/article/imageUrl";
import { validateArticleImage } from "@/lib/article/imageValidation";

// 画像本体をStorageへ保存し、
// 画像情報をarticle_imagesへ登録する。
export async function uploadArticleImage(file, articleId = null) {
  const validation = await validateArticleImage(file);

  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("ログインが必要です。");
  }

  const imageId = crypto.randomUUID();

  const storagePath = `articles/${user.id}/${imageId}.${validation.extension}`;

  const { error: uploadError } = await supabase.storage
    .from(ARTICLE_IMAGE_BUCKET)
    .upload(storagePath, file, {
      contentType: validation.mimeType,
      cacheControl: "31536000",
      upsert: false
    });

  if (uploadError) {
    throw new Error("写真をStorageへ保存できませんでした。");
  }

  const { data: image, error: insertError } = await supabase
    .from("article_images")
    .insert({
      id: imageId,
      article_id: articleId || null,
      storage_path: storagePath,
      original_filename: file.name,
      alt_text: null,
      mime_type: validation.mimeType,
      size_bytes: file.size,
      created_by: user.id
    })
    .select("id, article_id, storage_path")
    .single();

  if (insertError || !image) {
    await supabase.storage
      .from(ARTICLE_IMAGE_BUCKET)
      .remove([storagePath]);

    throw new Error("写真の管理情報を保存できませんでした。");
  }

  return {
    ...image, 
    public_url: getArticleImagePublicUrl(image.storage_path)
  };
}
