// @/lib/supabase/authServer.js

// ページの処理中に、そのを使ってSupabaseへ問い合わせる接続を用意する。
// AwaiアプリのNext.jsサーバー側が、
// ブラウザから届いたCookie「入館証」を使ってSupabaseへ問い合わせるための、
// 接続を準備する関数を定義する。

// このファイルを誤ってブラウザ用コンポーネントから
// 読み込んだ場合、Next.jsがエラーにして混入を防ぎます。
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// まず、流れ
// 1. 人がメールアドレスとパスワードを入力する（サインイン時）
// 2. ブラウザがSupabase Authへ送る
// 3. Supabase Authが正しい組み合わせか確認する
// 4. 正しければ、ログイン用の入館証を発行する
// 5. 入館証をブラウザへ返す
// 6. ブラウザが入館証をCookieへ保存する
// 7. 以後、ブラウザはページを開くたびにCookieを送る
// 8. Next.jsアプリはCookieを使って、
//    ログイン済みかSupabaseへ確認する

// ここで定義している関数は、
// ログインを実行する際に、
//    ブラウザ
//    「/adminというページを開きたい」
//    「以前ログインしたときのCookieも送ります」
//            ↓
// Vercel上のNext.jsアプリ
// 「ブラウザからCookieを受け取った」
// 「このCookieをSupabaseへ渡して、
//   この利用者がログイン済みか確認できるように準備しよう」
// 「DBに確認をやりに行く」
//            ↓
//    Supabase
//    「有効なログイン情報です」
//            ↓
//    Next.jsアプリ
//    「この利用者はadmin_usersにも登録されている」
//    「では、管理画面のデータと表示内容を作ろう」
//            ↓
//    ブラウザ
//    「受け取った管理画面を表示する」
//
//  以上の流れの中で、この部分を扱っている。
//    ブラウザ
//    「ブラウザからCookieを受け取った」
//    「このCookieをSupabaseへ渡して、
//      この利用者がログイン済みか確認できるように準備しよう」

export async function createAuthServerClient() {
  // メールアドレスとパスワードを毎回送る代わりに、
  // Cookieをログイン済みの証明として使う。
  //   ・cookies()：ブラウザから届いたCookieを取得するNext.jsの関数
  //   ・await：Cookieを取得できるまで待つ
  //   ・cookieStore：取得したCookieを扱うために付けた変数名
  const cookieStore = await cookies();

  // ページへのアクセス時に、Next.jsアプリがログインCookieを読み、
  // Supabase Authへログイン状態を確認できるように準備する。
  //
  // Supabase Authが新しい入館証を発行した場合に、
  // その入館証をCookieへ保存できるようにも準備する。
  //
  // この関数を実行しただけでは、実際の確認はまだ始まらない。
  // 実際の確認は、後でgetUser()やgetClaims()を呼び出したときに行われる。

  // getAll()
  // └── ブラウザから届いた現在の入館証を読む
  // setAll()
  // └── Supabaseが発行した新しい入館証を保存する
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server ComponentではCookieを書き換えられない場合がある。
            // Cookieの更新はProxyも担当する。
          }
        },
      },
    },
  );
}
