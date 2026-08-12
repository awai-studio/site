// @/app/admin/page.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import styles from "./Admin.module.scss";

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
      <main className={styles.page}>
        <p className={styles.description}>ログイン状態を確認しています…</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Awai Studio Admin</h1>
        <p className={styles.description}>ログインしました。</p>

        <div className="formInlineCta cta">
          <button className="btn btn--regular" type="button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </div>
    </main>
  );
}
