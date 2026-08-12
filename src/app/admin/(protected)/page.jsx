// @/app/admin/(protected)/page.jsx

import { logoutAdmin } from "@/app/admin/actions";

export default function AdminPage() {
  return (
    <main className="adminPage">
      <div className="adminCard">
        <h1>Awai Studio Admin</h1>

        <p className="adminDescription">ログインしました。</p>

        <form action={logoutAdmin}>
          <button className="adminButton" type="submit">
            ログアウト
          </button>
        </form>
      </div>
    </main>
  );
}
