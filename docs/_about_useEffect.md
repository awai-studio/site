# Reactの`useEffect`について

## 1. `useEffect`とは

`useEffect`は、Reactが用意している関数です。

一言でいうと、

> コンポーネントがブラウザに表示された後で、追加の処理を実行するための関数。

今回の管理画面では、ページを表示した後にSupabaseへログイン状態を確認するために使っています。

```text
AdminPageコンポーネントを表示する
↓
useEffectが動く
↓
Supabaseへログイン状態を確認する
↓
ログイン中なら管理画面を表示する
↓
未ログインならログイン画面へ移動する
```

---

## 2. 今回のコード

```jsx
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
```

このコードは、管理画面を表示する前に、現在のブラウザがログイン済みか確認しています。

---

## 3. `useEffect`の基本形

```jsx
useEffect(
  実行したい処理,
  依存配列,
);
```

今回なら、次のように分けられます。

```jsx
useEffect(
  () => {
    // ログイン状態を確認する処理
  },
  [router],
);
```

### 第1引数

```jsx
() => {
  // 処理
}
```

コンポーネントが表示された後に実行する処理です。

### 第2引数

```jsx
[router]
```

依存配列です。

この`useEffect`が外側から持ち込んで使用している値を、Reactへ申告します。

---

## 4. 通常のコードとは実行されるタイミングが違う

Reactコンポーネント本体は、基本的に上から順番に実行されます。

```jsx
export default function AdminPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 後から実行する処理
  }, [router]);

  return (
    // 表示内容
  );
}
```

実行の流れは次のとおりです。

```text
1. AdminPage関数を上から順番に実行する
2. isCheckingの初期値としてtrueを用意する
3. JSXの表示内容を作る
4. 「ログイン状態を確認しています…」を画面に表示する
5. 画面が表示された後にuseEffectが動く
6. ログイン状態を確認する
```

したがって、`useEffect`の中身は、コンポーネント本体を上から実行している途中では動きません。

> まず画面を反映し、その後でReactが`useEffect`の処理を実行する。

という順番です。

---

## 5. なぜログイン確認を普通に上から書かないのか

コンポーネント本体へ直接ログイン確認を書くと、画面が再描画されるたびに実行される可能性があります。

```jsx
export default function AdminPage() {
  checkSession();

  return (
    // 表示内容
  );
}
```

ログイン確認後に次を実行すると、状態が変わります。

```jsx
setIsChecking(false);
```

状態が変わると、Reactはコンポーネントを再実行します。

そのたびに`checkSession()`を直接実行すると、ログイン確認を何度も繰り返す可能性があります。

そこで`useEffect`を使い、

```text
画面を作る処理
```

と、

```text
画面表示後に行うログイン確認
```

を分離します。

---

## 6. `checkSession()`は何をしているか

```jsx
async function checkSession() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    router.replace("/admin/login");
    return;
  }

  setIsChecking(false);
}
```

この関数は、現在のブラウザにSupabaseのログインセッションがあるか確認します。

### セッションを取得する

```jsx
const { data } = await supabase.auth.getSession();
```

Supabaseへ現在のセッション情報を問い合わせます。

結果は、おおむね次の形です。

```jsx
data = {
  session: ログイン情報,
};
```

ログインしていない場合は、次のようになります。

```jsx
data = {
  session: null,
};
```

`data.session`はメソッドではありません。

> `data`オブジェクトの中にある`session`プロパティ。

です。

---

## 7. セッションがない場合

```jsx
if (!data.session) {
  router.replace("/admin/login");
  return;
}
```

`!data.session`は、

> `data.session`が存在しない。

という条件です。

セッションがなければ、次を実行します。

```jsx
router.replace("/admin/login");
```

ログインページへ移動します。

その後、

```jsx
return;
```

で`checkSession()`関数を終了します。

したがって、セッションがない場合は、後ろにある次の処理へ進みません。

```jsx
setIsChecking(false);
```

---

## 8. セッションがある場合

セッションがあれば、次の条件は成立しません。

```jsx
if (!data.session)
```

そのため、`if`の中へ入らず、次へ進みます。

```jsx
setIsChecking(false);
```

これは、

> ログイン状態の確認が終わったので、「確認中」の状態を終了する。

という意味です。

```text
isChecking === true
└── 「ログイン状態を確認しています…」を表示する

isChecking === false
└── 管理画面本体を表示する
```

---

## 9. なぜ`checkSession()`を`useEffect`内で定義するのか

次のように`useEffect`の第1引数を直接`async`にはしません。

```jsx
useEffect(async () => {
  // 非同期処理
}, []);
```

代わりに、`useEffect`の中で非同期関数を定義します。

```jsx
useEffect(() => {
  async function checkSession() {
    // awaitを使う処理
  }

  checkSession();
}, [router]);
```

流れは次のとおりです。

```text
useEffectが実行される
↓
checkSession()関数を定義する
↓
checkSession()を実行する
↓
Supabaseの返事をawaitで待つ
```

---

## 10. `await`と処理の順番

```jsx
const { data } = await supabase.auth.getSession();
```

`await`は、Supabaseから結果が返るまで、`checkSession()`の続きを待たせます。

```text
getSession()を開始する
↓
checkSession()の続きは一時停止する
↓
その間もブラウザは画面を表示できる
↓
Supabaseから結果が返る
↓
checkSession()の続きを実行する
```

すべてが同時に実行されるわけではありません。

> コードは上から順番に進む。`await`では、その関数の続きだけが結果を待つ。その間もブラウザ全体は停止しない。

という動きです。

---

## 11. 依存配列とは

```jsx
}, [router]);
```

`[router]`は依存配列です。

`useEffect`の中で使用していて、`useEffect`の外側から持ち込んだ値を記載します。

今回、`router`は`useEffect`の外側で取得しています。

```jsx
const router = useRouter();
```

そして、`useEffect`の中で使用しています。

```jsx
router.replace("/admin/login");
```

そのため、依存配列へ記載します。

```jsx
[router]
```

---

## 12. 依存配列は常時監視ではない

依存配列を「監視対象」と考えても構いません。

ただし、Reactが常時見張っているわけではありません。

> コンポーネントが再実行されたとき、Reactが前回の値と今回の値を比較する。

という仕組みです。

```text
前回のrouter
今回のrouter
↓
Reactが比較する
↓
同じならuseEffectを再実行しない
↓
別物ならuseEffectを再実行する
```

---

## 13. `[router]`は「routerが実行されたら動く」ではない

次の理解は違います。

```text
router.replace()が実行された
↓
useEffectが動く
```

正しい順番は逆です。

```text
useEffectが初回なので動く
↓
checkSession()を実行する
↓
ログインしていないと分かる
↓
useEffectの処理中でrouter.replace()を使う
```

> `router`を使ったため`useEffect`が動くのではない。`useEffect`が先に動き、その処理の中で`router`を使用する。

ということです。

---

## 14. `router`には何が入っているか

```jsx
const router = useRouter();
```

`router`には、Next.jsが用意したページ移動用の関数をまとめたオブジェクトが入っています。

イメージは次のとおりです。

```jsx
router = {
  push: ページへ移動する関数,
  replace: 履歴を置き換えて移動する関数,
  back: 前のページへ戻る関数,
  forward: 次のページへ進む関数,
  refresh: 現在のページを更新する関数,
};
```

今回使っているのは次です。

```jsx
router.replace("/admin/login");
```

`router`には現在のURLが入っているわけではありません。

> Next.jsのアプリ内でページを移動する機能が入っているオブジェクト。

です。

---

## 15. なぜ変わらない`router`を依存配列へ入れるのか

`router`オブジェクトは、通常ほとんど変わりません。

今回、`router`が変わったら積極的にログイン状態を再確認したいから記載しているわけではありません。

理由は、

> `useEffect`の中で、外側から取得した`router`を使っているので、この処理は`router`に依存しているとReactへ申告するため。

です。

```jsx
const router = useRouter();

useEffect(() => {
  router.replace("/admin/login");
}, [router]);
```

今回の実際の動きは、ほぼ次のとおりです。

```text
/adminページが最初に表示される
↓
useEffectが一度動く
↓
ログイン状態を確認する
```

---

## 16. 空の依存配列ではいけないのか

```jsx
useEffect(() => {
  // 処理
}, []);
```

空の依存配列は、

> コンポーネントが最初に表示された後、一度だけ実行する。

という意味です。

今回に限れば、次でもほぼ同じように動く可能性があります。

```jsx
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
}, []);
```

しかし、`useEffect`内で外側の`router`を使用しています。

Reactの依存関係の原則に従い、次のように記載しています。

```jsx
}, [router]);
```

これは、

```text
routerが変化することを期待している
```

という意味ではなく、

```text
このuseEffectは外側のrouterを使っている
```

という申告です。

---

## 17. 依存配列へ記載する候補

依存配列へ記載する候補は、状態だけではありません。

`useEffect`の外側で取得・定義し、中で使用する次のような値が候補になります。

```text
・state
・props
・外側で定義した関数
・外側から取得したオブジェクト
```

今回の`router`は、

```text
useEffectの外側で取得した
↓
useEffectの中で使用した
↓
依存配列へrouterを記載する
```

という関係です。

---

## 18. 依存配列へ記載しないもの

### `useEffect`内で作った値

```jsx
const { data } = await supabase.auth.getSession();
```

`data`は`useEffect`の処理中に作られた値なので、依存配列へ記載しません。

### `useEffect`内で作った関数

```jsx
async function checkSession() {
}
```

`checkSession`は`useEffect`の中で定義した関数なので、依存配列へ記載しません。

### Reactが変わらないと保証する更新関数

```jsx
setIsChecking(false);
```

`setIsChecking`は、Reactが同じコンポーネントの存在中は変わらないと保証する関数です。そのため、通常は依存配列へ記載しません。

---

## 19. `isChecking`と`setIsChecking`の違い

```jsx
const [isChecking, setIsChecking] = useState(true);
```

ここには、役割の違う2つのものがあります。

```text
isChecking
└── 現在の状態値
└── trueからfalseへ変化する

setIsChecking
└── isCheckingを変更するための関数
└── 関数そのものは変化しない
```

今回`useEffect`内で使っているのは、状態値`isChecking`ではありません。

```jsx
setIsChecking(false);
```

変更用の関数を呼んでいるだけです。

したがって、`setIsChecking`を依存配列へ書く必要はありません。

現在の状態値を読む場合は、依存配列へ記載します。

```jsx
useEffect(() => {
  console.log(isChecking);
}, [isChecking]);
```

---

## 20. 簡単な`count`の例

```jsx
import { useEffect, useState } from "react";

export default function Sample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("countが変わりました:", count);
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

初回表示時：

```text
countは0
↓
初回なのでuseEffectを実行する
↓
「countが変わりました: 0」と表示する
```

ボタンを押したとき：

```text
setCount()でcountを0から1へ変更する
↓
コンポーネントを再実行する
↓
Reactが前回のcountと今回のcountを比較する
↓
値が違う
↓
useEffectを再実行する
```

`useEffect`の中で`count`を使った瞬間に動くのではありません。

```text
値が変わる
↓
コンポーネントが再実行される
↓
依存配列の前回値と今回値を比較する
↓
違えばuseEffectを実行する
```

という順番です。

---

## 21. 今回の管理画面での役割

このコードが、管理画面へ入れるかどうかを最初に確認しています。

```jsx
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
```

全体の役割は次のとおりです。

```text
/adminを開く
↓
Supabaseへ現在のセッションを問い合わせる
↓
セッションがない
└── /admin/loginへ移動する

セッションがある
└── isCheckingをfalseにする
└── 管理画面を表示する
```

この下へ、記事一覧や管理機能を追加していきます。

```jsx
return (
  <div>
    <ArticleList />
    <NewArticleButton />
    <LogoutButton />
  </div>
);
```

---

## 22. Supabaseへ任せていること

Supabase Authが、次の面倒な処理を担当します。

```text
・メールアドレスとパスワードの確認
・ログインセッションの作成
・セッションの保存
・現在のセッション情報の取得
・ログアウト
```

Awai側で行うことは、かなり簡潔です。

```text
セッションを取得する
↓
セッションがなければログイン画面へ移動する
↓
セッションがあれば管理画面を表示する
```

これが、上田方式が簡単で分かりやすい理由です。

---

## 23. `useEffect`とRLSの役割は別

この`useEffect`は、管理画面を表示するかどうかを判断する入口です。

データそのものを守る最終防御は、Supabase側のRLSです。

```text
useEffectによるセッション確認
└── 管理画面の入口を制御する

SupabaseのRLS
└── 記事や予約データの取得・変更を最終的に制御する
```

両方がそろって、上田方式の管理機能が成立します。

---

## まとめ

```text
useEffect
└── コンポーネントが画面へ反映された後に、
    追加処理を実行するReactの関数

第1引数
└── 実行する処理

第2引数
└── 依存配列

[router]
└── このuseEffectが外側のrouterを使用することをReactへ申告する
└── routerのメソッドが実行されたら動く、という意味ではない

checkSession()
└── Supabaseへ現在のログインセッションを確認する関数

await
└── セッション情報が返るまでcheckSession()の続きを待たせる

data.session
└── 現在のログインセッション情報
└── メソッドではなくプロパティ

setIsChecking(false)
└── ログイン確認中の表示を終了し、管理画面を表示する

router.replace("/admin/login")
└── 未ログインの場合にログイン画面へ移動する
```