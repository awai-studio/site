// @/lib/admin/adminAuth.js

import "server-only";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/authServer";

// ログインしている利用者が、
// Awaiのeditorとして登録されているか確認する。
export async function requireAdmin() {
  const supabase = await createAuthServerClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/admin/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id, email, role")
    .eq("user_id", userData.user.id)
    .eq("role", "editor")
    .maybeSingle();

  if (adminError || !admin) {
    redirect("/admin/login?error=unauthorized");
  }

  return {
    supabase,
    user: userData.user,
    admin,
  };
}