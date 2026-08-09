import { NextResponse } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/authServer";
import {
  ARTICLE_IMAGE_BUCKET,
  getArticleImagePublicUrl,
} from "@/lib/article/imageUrl";
import {
  ARTICLE_IMAGE_LIMITS,
  validateArticleImage,
} from "@/lib/article/imageValidation";

const ARTICLE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonError(message, status) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request) {
  const supabase = await createAuthServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return jsonError("ログインが必要です。", 401);
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (admin?.role !== "editor") {
    return jsonError("写真を登録する権限がありません。", 403);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("送信内容を確認してください。", 400);
  }

  const articleId = String(formData.get("articleId") || "").trim();
  const altText = String(formData.get("altText") || "").trim();
  const file = formData.get("image");

  if (!ARTICLE_ID_PATTERN.test(articleId)) {
    return jsonError("記事を一度下書き保存してから写真を登録してください。", 400);
  }

  if (!altText || altText.length > ARTICLE_IMAGE_LIMITS.altText) {
    return jsonError("写真の説明を180字以内で入力してください。", 400);
  }

  const { data: article } = await supabase
    .from("articles")
    .select("id")
    .eq("id", articleId)
    .maybeSingle();

  if (!article) {
    return jsonError("記事を確認できませんでした。", 404);
  }

  const validation = await validateArticleImage(file);
  if (!validation.isValid) {
    return jsonError(validation.error, 400);
  }

  const imageId = crypto.randomUUID();
  const storagePath = `articles/${articleId}/${imageId}.${validation.extension}`;
  const { error: uploadError } = await supabase.storage
    .from(ARTICLE_IMAGE_BUCKET)
    .upload(storagePath, file, {
      contentType: validation.mimeType,
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    return jsonError("写真を保存できませんでした。", 500);
  }

  const { data: image, error: insertError } = await supabase
    .from("article_images")
    .insert({
      id: imageId,
      article_id: articleId,
      storage_path: storagePath,
      original_filename: file.name,
      alt_text: altText,
      mime_type: validation.mimeType,
      size_bytes: file.size,
      created_by: userData.user.id,
    })
    .select("id, storage_path, alt_text")
    .single();

  if (insertError || !image) {
    await supabase.storage.from(ARTICLE_IMAGE_BUCKET).remove([storagePath]);
    return jsonError("写真の記録を保存できませんでした。", 500);
  }

  return NextResponse.json(
    {
      image: {
        ...image,
        public_url: getArticleImagePublicUrl(image.storage_path),
      },
    },
    { status: 201 },
  );
}
