// @/app/admin/actions.js

"use server";

import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/authServer";

// Supabaseからログアウトして、
// ログイン画面へ移動する。
export async function logoutAdmin() {
  const supabase = await createAuthServerClient();

  await supabase.auth.signOut();

  redirect("/admin/login");
}
