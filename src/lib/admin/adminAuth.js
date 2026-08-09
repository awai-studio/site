import "server-only";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/authServer";

const ROLE_LEVEL = {
  viewer: 1,
  editor: 2,
};

export async function requireAdmin(requiredRole = "viewer") {
  const supabase = await createAuthServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) redirect("/admin/login");

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id, email, role")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  const hasRequiredRole =
    admin && ROLE_LEVEL[admin.role] >= ROLE_LEVEL[requiredRole];

  if (adminError || !hasRequiredRole) {
    redirect("/admin/login?error=unauthorized");
  }

  return {
    supabase,
    user: userData.user,
    admin,
  };
}
