// @/app/admin/(protected)/page.jsx

import { logoutAdmin } from "@/app/admin/actions";

export default function AdminPage() {
  return (
    <main>
      <h1>Awai Studio Admin</h1>
      <p>ログインしました。</p>

      <form action={logoutAdmin}>
        <button type="submit">ログアウト</button>
      </form>
    </main>
  );
}
