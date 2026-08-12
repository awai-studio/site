// @/app/admin/page.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/admin/login");
        return;
      }

      setIsChecking(false);
    }

    checkSession();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (isChecking) {
    return (
      <main className="adminPage">
        <p className="adminDescription">ログイン状態を確認しています…</p>
      </main>
    );
  }

  return (
    <main className="adminPage">
      <div className="adminCard">
        <h1>Awai Studio Admin</h1>
        <p className="adminDescription">ログインしました。</p>

        <button className="adminButton" type="button" onClick={handleLogout}>
          ログアウト
        </button>
      </div>
    </main>
  );
}
