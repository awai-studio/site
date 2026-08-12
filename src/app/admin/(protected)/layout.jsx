// @/app/admin/(protected)/layout.jsx

import { requireAdmin } from "@/lib/admin/adminAuth";

// (protected)フォルダ内のページを表示する前に、
// ログイン済みのeditorか確認する。
export default async function AdminLayout({ children }) {
  await requireAdmin();

  return children;
}