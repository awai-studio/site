// @/lib/supabase/authProxy.js

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// このファイルでは、ブラウザからAwaiサイトへアクセスがあったときに、
// Cookieに保存されている入館証を点検・更新する関数を定義している。
//
// すでにログインした利用者がページを開いたときに、
// 次の順番で処理する。
//
// 1. ブラウザから届いたCookieを読む
// 2. 入館証が有効か確認する
// 3. 更新が必要なら、Supabase Authが新しい入館証を発行する
// 4. 新しい入館証をVercel上のAwaiアプリへ渡す
// 5. 同じ新しい入館証を利用者のブラウザへ返す
// 6. 本来要求されたページの処理へ進ませる
export async function updateAuthSession(request) {
  // requestは、利用者のブラウザから届いた要求を表すオブジェクト。
  //
  // 例えば、次の情報が入っている。
  // ・表示してほしいページ
  // ・GETなどのアクセス方法
  // ・ブラウザから送られてきたCookie
  // ・その他の通信情報

  // NextResponse.next()を実行して、
  // ブラウザが要求したページの処理へ進ませるための
  // responseオブジェクトを作る。
  //
  // 後でCookieが更新された場合にresponseを作り直すため、
  // constではなくletを使用する。
  let response = NextResponse.next({ request });

  // createServerClient()を実行する。
  //
  // この時点では、入館証の確認はまだ行わない。
  //
  // ここでは、Supabaseの接続用オブジェクトを作るために、
  // 次の情報をライブラリへ渡している。
  //
  // ・接続するSupabaseのURL
  // ・Supabaseの公開鍵
  // ・現在のCookieを読む方法
  // ・新しいCookieを保存する方法
  //
  // createServerClient()が返した接続用オブジェクトを、
  // supabaseという変数へ保存する。
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        // @supabase/ssrが現在のCookieを必要としたときに、
        // ライブラリから呼び出される関数。
        //
        // ブラウザからVercel上のAwaiアプリへ届いたCookieを、
        // requestオブジェクトから読み取って返す。
        getAll() {
          return request.cookies.getAll();
        },

        // 入館証の更新が必要になった場合だけ、
        // @supabase/ssrライブラリから呼び出される関数。
        //
        // cookiesToSetは、@supabase/ssrライブラリが渡してくる
        // 「新しく保存するCookieの一覧」。
        //
        // headersは、認証情報を含む返事が他人向けに
        // キャッシュされることを防ぐための通信設定。
        setAll(cookiesToSet, headers = {}) {
          // 新しい入館証を、Vercel上のAwaiアプリが
          // この後に行うページ処理でも使えるようにする。
          //
          // cookiesToSetに入っているCookieを一件ずつ取り出し、
          // request.cookiesへ設定する。
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // 新しいCookieを設定したrequestを使って、
          // 本来要求されたページの処理へ進ませるための
          // responseオブジェクトを作り直す。
          response = NextResponse.next({ request });

          // 新しい入館証を利用者のブラウザにも返す。
          //
          // ブラウザは受け取ったCookieを保存し、
          // 次回Awaiサイトを開くときに使用する。
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          // Supabaseライブラリから渡された、
          // 認証情報をキャッシュさせないための通信設定を
          // ブラウザへ返すresponseへ設定する。
          Object.entries(headers).forEach(([name, value]) => {
            response.headers.set(name, value);
          });
        },
      },
    },
  );

  // ここで初めて、Cookieに入っている入館証を確認する。
  //
  // getClaims()の処理中に入館証の更新が必要になった場合は、
  // @supabase/ssrが上で定義したsetAll()を呼び出す。
  //
  // awaitによって、入館証の確認と必要な更新が終わるまで待つ。
  await supabase.auth.getClaims();

  // 入館証の確認と必要な更新が終わった後、
  // 本来要求されたページの処理へ進ませるresponseを返す。
  return response;
}
