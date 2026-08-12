// @/lib/supabase/authBrowser.js

import { createBrowserClient } from "@supabase/ssr";

// createAuthBrowserClient()は、URLと公開鍵を使って、
// ブラウザからAwaiのSupabaseへ問い合わせるための窓口を作る関数。
// つまり、Supabaseのログイン処理を実行できる状態を準備する。
// この関数を実行した時点では、まだログインはしていない。
// URL
// └── 接続するSupabaseの住所
// 公開鍵
// └── そのSupabaseの公開窓口を利用するための情報

export function createAuthBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}