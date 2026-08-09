"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { parseArticleForm } from "@/lib/admin/articleValidation";

const ARTICLE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function articleErrorPath(id, error) {
  const path = id ? `/admin/articles/${id}` : "/admin/articles/new";
  return `${path}?error=${error}`;
}

export async function saveArticle(formData) {
  const articleId = String(formData.get("articleId") || "").trim();
  const { article, thumbnailImageId, error: validationError } = parseArticleForm(formData);

  if (articleId && !ARTICLE_ID_PATTERN.test(articleId)) {
    redirect(articleErrorPath("", "invalid"));
  }

  if (validationError) {
    redirect(articleErrorPath(articleId, validationError));
  }

  const { supabase, user } = await requireAdmin("editor");

  if (articleId) {
    if (thumbnailImageId) {
      const { data: thumbnail } = await supabase
        .from("article_images")
        .select("id")
        .eq("id", thumbnailImageId)
        .eq("article_id", articleId)
        .maybeSingle();

      if (!thumbnail) redirect(articleErrorPath(articleId, "invalid-thumbnail"));
    }

    const { error } = await supabase
      .from("articles")
      .update({ ...article, thumbnail_image_id: thumbnailImageId })
      .eq("id", articleId);

    if (error) {
      const reason = error.code === "23505" ? "duplicate-slug" : "save";
      redirect(articleErrorPath(articleId, reason));
    }

    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${articleId}`);
    redirect(`/admin/articles/${articleId}?saved=1`);
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({ ...article, author_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    const reason = error?.code === "23505" ? "duplicate-slug" : "save";
    redirect(articleErrorPath("", reason));
  }

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${data.id}?created=1`);
}
