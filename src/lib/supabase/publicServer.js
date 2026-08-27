// @/lib/supabase/publicServer.js

import "server-only";
import { createClient } from "@supabase/supabase-js";

// 一般公開ページが、Supabaseの公開データを
// サーバー側で取得するための接続を作る。
export function createPublicServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      }
    }
  );  
}