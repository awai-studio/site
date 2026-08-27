// @/app/admin/login/page.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import styles from "../AdminPage.module.scss";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("メールアドレスまたはパスワードを確認してください。");
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <div className="container">
      <div className={styles.adminLoginPage}>
        <div className={styles.card}>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.description}>Awai Studioの管理者専用画面です。</p>

          <form className="formBasic" onSubmit={handleLogin}>
            <label className="formLabel">
              <span className="formItemName">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="formLabel">
              <span className="formItemName">Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
              />
            </label>

            <div className="formInlineCta cta">
              <button
                className="btn btn--regular"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "ログイン中…" : "ログイン"}
              </button>
            </div>

            {message && (
              <div className="formErrorMessage">
                <p>{message}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
