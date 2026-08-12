// @/proxy.js

import { updateAuthSession } from "@/lib/supabase/authProxy";

// ブラウザからAwaiサイトへページ表示の要求が届いたときに、
// ページを表示する前に実行される関数。
//
// authProxy.jsのupdateAuthSession()を呼び出して、
// Cookieに保存されたログイン用の入館証を点検・更新する。
export async function proxy(request) {
  return await updateAuthSession(request);
}

// 次のファイルへのアクセスでは、proxy()を実行しない。
//
// ・Next.jsが内部で使用するファイル
// ・画像
// ・favicon
//
// 通常のページへのアクセスではproxy()を実行する。
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
