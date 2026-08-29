// @/app/admin/page.jsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import styles from "./AdminPage.module.scss";

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
    router.push("/admin/login");
  }

  if (isChecking) {
    return (
      <div className="container">
        <div className={styles.adminPage}>
          <p className={styles.description}>ログイン状態を確認しています…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.adminPage}>
        <div className={styles.card}>
          <h1 className={styles.title}>Awai Studio Admin</h1>
          <p className={styles.description}>ログインしました。</p>

          <nav className={styles.adminNavigation}>
            <Link href="/admin/bookings">予約リクエストを管理</Link>
            <Link href="/admin/articles">Awai Notesを管理</Link>
          </nav>

          <div className="formInlineCta cta">
            <button
              className="btn btn--regular"
              type="button"
              onClick={handleLogout}
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
