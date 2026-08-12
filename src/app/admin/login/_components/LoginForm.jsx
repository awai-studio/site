// @/app/admin/login/_components/LoginForm.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthBrowserClient } from "@/lib/supabase/authBrowser";

export default function LoginForm({ unauthorized = false }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState(
    unauthorized ? "この利用者には管理画面の権限がありません。" : "",
  );

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const supabase = createAuthBrowserClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setMessage("メールアドレスまたはパスワードを確認してください。");
      setIsSubmitting(false);
      return;
    }

    const { data: admin } = await supabase
      .from("admin_users")
      .select("role")
      .eq("role", "editor")
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();

      setMessage("この利用者には管理画面の権限がありません。");
      setIsSubmitting(false);

      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="adminForm" onSubmit={handleSubmit}>
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
  );
}