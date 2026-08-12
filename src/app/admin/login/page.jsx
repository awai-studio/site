// @/app/admin/login/page.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

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
    <main className="adminPage">
      <div className="adminCard">
        <h1>Admin Login</h1>
        <p className="adminDescription">Awai Studioの管理者専用画面です。</p>

        <form className="adminForm" onSubmit={handleLogin}>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              disabled={isSubmitting}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              disabled={isSubmitting}
            />
          </label>

          <button className="adminButton" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "ログイン中…" : "ログイン"}
          </button>

          {message && <p className="adminMessage">{message}</p>}
        </form>
      </div>
    </main>
  );
}
