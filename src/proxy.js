import { NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Awai Studio"',
    },
  });
}

export function proxy(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return unauthorized();
  }

  const [authType, encodedCredentials] = authHeader.split(" ");

  if (authType !== "Basic" || !encodedCredentials) {
    return unauthorized();
  }

  try {
    const credential = atob(encodedCredentials);
    // 『：』があるインデックス番号を返す。
    const separatorIndex = credential.indexOf(":");

    if (separatorIndex === -1) {
      return unauthorized();
    }

    const user = credential.slice(0, separatorIndex);
    const password = credential.slice(separatorIndex + 1);

    const validUser = process.env.BASIC_AUTH_USER;
    const validPassword = process.env.BASIC_AUTH_PASSWORD;

    if (
      !validUser ||
      !validPassword ||
      user !== validUser ||
      password !== validPassword
    ) {
      return unauthorized();
    }
  
    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}


// 理解1
// import { NextResponse } from "next/server";

// export function proxy(request) {
//   // requestの中でAuthorizationヘッダーを取り出してねという意味。
//   const authHeader = request.headers.get("authorization");

//   // realm とは、認証エリアの表示名のこと。
//   // Authorizationヘッダーが無ければとは、またログインしてない人ということ。
//   // 次のレスポンスを用意する。
//   // 用意されたものを見てとブラウザは
//   // 「401だ。しかも WWW-Authenticate: Basic が付いてる。」
//   // 「じゃあBasic認証ダイアログを出そう。」

//   // とブラウザ自身が判断してダイアログを表示する。
//   // ここがすごく面白いところ。
//   // 私たちはダイアログを作っていない。
//   // ブラウザがHTTPの仕様に従って勝手に出してくれる。
//   if (!authHeader) {
//     return new NextResponse("Authentication required", {
//       status: 401,
//       headers: {
//         "WWW-Authenticate": 'Basic realm="Awai Studio"',
//       },
//     });
//   }

//   // ブラウザで入力
//   // User: awai;
//   // Pass: secret123;

//   // ブラウザは、
//   //    awai:secret123
//   // という文字列にする。そして、Base64という方法で文字列を変換する。
//   //    YXdhaTpzZWNyZXQxMjM=

//   // HTTPヘッダーには、
//   // Authorization: Basic YXdhaTpzZWNyZXQxMjM=
//   // が送られる。

//   // で、split関数で配列にして、2番目『YXdhaTpzZWNyZXQxMjM=』を取る。
//   const encodedCredentials = authHeader.split(" ")[1];
//   // そして、デコードする。
//   const credential = atob(encodedCredentials);

//   console.log(credential);

//   return NextResponse.next();
// }

