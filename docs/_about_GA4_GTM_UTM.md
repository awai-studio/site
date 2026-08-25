# Awai Studio GA4・GTM・広告効果測定

## 1. 目的

Instagram、X、その他の紹介元からAwai Studioへ来た利用者が、どの体験に関心を持ち、予約リクエストまで進んだかを確認できるようにする。

氏名やメールアドレスなどの個人情報は、GA4やGTMへ送信しない。

## 2. 今回測定する流れ

```text
Instagram・Xなどの投稿
↓
UTM付きURLをクリック
↓
Awai Studioへ訪問
↓
ブログ・体験ページを閲覧
↓
予約ボタンをクリック
↓
予約フォームを入力
↓
予約リクエスト送信成功
```

最終的に、次のことを確認できるようにする。

- InstagramとXのどちらから来たか
- 通常投稿、告知投稿など、どの投稿から来たか
- どの広報企画から来たか
- どの体験ページを見たか
- どの予約ボタンを押したか
- 予約リクエストまで到達したか
- どの体験に予約リクエストが入ったか

## 3. 使用する仕組み

### Google Tag Manager

サイトへ計測機能を設置し、クリックや予約成功などの出来事をGA4へ渡す。

### Google Analytics 4

訪問数、流入元、閲覧ページ、予約リクエスト成功などを集計する。

### UTMパラメータ

InstagramやXに掲載するURLへ、流入元を識別する情報を付ける。

### Supabase

予約リクエストと一緒にUTM情報を保存する。GA4の集計だけでなく、実際の予約リクエストがどの投稿から来たかを管理画面やDBで確認できるようにする。

## 4. UTM付きURL

例：

```text
https://awai-studio.jp/en/experiences/tea-experience-with-soko?utm_source=instagram&utm_medium=social&utm_campaign=tea_launch&utm_content=post_01
```

各項目の意味：

| 項目           | 意味         | 例               |
| -------------- | ------------ | ---------------- |
| `utm_source`   | 流入元       | `instagram`、`x` |
| `utm_medium`   | 投稿の種類   | `social`         |
| `utm_campaign` | 広報企画名   | `tea_launch`     |
| `utm_content`  | 投稿の識別名 | `post_01`        |

当面は有料広告を行わないため、通常投稿は`utm_medium=social`とする。有料広告を開始した場合は`paid_social`など、別の値を使用する。

## 5. UTM情報の保持

上田は1ページ内で応募まで完結するため、応募時のURLからUTM情報を取得できた。

Awai Studioは次のように複数ページを移動する。

```text
Instagram
↓
ブログ
↓
体験ページ
↓
予約ページ
```

そのため、最初にAwai Studioへ入った時点でUTM情報を一時保存し、予約ページまで引き継ぐ。

保存する情報：

- `tracking_utm_source`
- `tracking_utm_medium`
- `tracking_utm_campaign`
- `tracking_utm_content`
- `tracking_utm_clicked_url`

## 6. 計測するイベント

| イベント                   | 発生するタイミング                                |
| -------------------------- | ------------------------------------------------- |
| `cta_click`                | 予約につながるボタンを押したとき                  |
| `blog_to_experience_click` | ブログから体験ページへ移動したとき                |
| `booking_form_start`       | 予約フォームへの入力を始めたとき                  |
| `booking_request_success`  | 予約リクエストの送信が成功したとき                |
| `generate_lead`            | GA4上で予約リクエスト成功を成果として記録するとき |

主要な成果は、送信ボタンを押した時点ではなく、APIが正常終了した後の`booking_request_success`とする。

## 7. CTAの識別

予約ボタンには、ボタンの場所を識別する情報を付ける。

例：

```text
global_header_booking
mobile_menu_booking
experience_hero_booking
experience_detail_booking
blog_experience_link
```

これにより、どの場所のボタンが予約につながったかを確認する。

## 8. Supabaseへ保存する情報

`booking_requests`へ、予約内容と一緒に次を保存する。

- UTM流入元
- UTM媒体
- UTMキャンペーン
- UTM投稿識別名
- 最初にクリックされたAwai StudioのURL

氏名やメールアドレスは予約管理のためSupabaseへ保存するが、GA4やGTMへは送信しない。

## 9. プライバシー対応

プライバシーポリシーへ、次の利用目的を記載する。

- サイト利用状況の把握
- サイト改善
- SNSなどからの流入確認
- 広告効果の測定
- Cookieおよび類似技術の利用
- Google Analyticsの利用

対象国に応じた同意取得の要否については、本番公開前に別途確認する。

## 10. 施工順

1. `@next/third-parties`を導入
2. Awai専用GTMコンテナを作成
3. Awai専用GA4プロパティとWebデータストリームを作成
4. GTMをAwai Studioへ設置
5. GTMからGA4を読み込む
6. Headerとスマホメニューへ計測属性を追加
7. 各予約CTAへ計測属性を追加
8. UTM情報を最初の訪問時に保持
9. 予約フォームからUTM情報をAPIへ送信
10. `booking_requests`へUTM情報を保存
11. 予約成功イベントをGTMへ送信
12. GA4で予約成功をキーイベントに設定
13. プライバシーポリシーを更新
14. GTMプレビューモードで確認
15. GA4リアルタイム・DebugViewで確認
16. SupabaseでUTM情報の保存を確認
17. 本番環境で最終確認

## 11. 今回は実装しないもの

当面は有料広告を行わないため、次は今回の対象外とする。

- Meta Pixel
- X Pixel
- Google広告コンバージョンタグ
- 広告媒体への顧客情報送信
- 購入完了イベント

有料広告を開始する段階で、必要性を判断して追加する。

## 12. 施工後に記録する項目

- GTMコンテナID：
- GA4測定ID：
- 使用したイベント名：
- UTM命名規則：
- Supabaseへ追加したカラム：
- GTMプレビュー確認日：
- GA4リアルタイム確認日：
- Supabase保存確認日：
- 本番確認日：
- 未解決事項：