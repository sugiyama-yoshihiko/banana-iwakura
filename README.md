# 場七 / Banana — 公式サイト

愛知県岩倉市のアートスペース「場七 / Banana」の公式サイト。
静的HTML（ビルド不要）で、GitHub Pages にホスティングしています。

- 本番: https://banana-iwakura.com
- Instagram: https://www.instagram.com/banana_iwakura/

## 構成

```
index.html          1枚もの。About / 部活 / Access / Contact
assets/style.css    スタイル
assets/main.js      ヘッダー切替・モバイルメニュー・スクロール表示・画像差替
images/             写真（README.md に入れ方を記載）
CNAME               カスタムドメイン設定（GitHub Pages が読む）
.nojekyll           Jekyll のビルドを無効化
```

## ローカルで見る

```bash
python3 -m http.server 4173
```

http://localhost:4173 を開いてください。

## 更新のしかた

### 文章を直す
`index.html` を直接編集して commit → push すれば、1〜2分で本番に反映されます。

### 写真を入れる
`images/` に決められたファイル名で置くだけです。詳しくは [images/README.md](images/README.md)。
ファイルが無い間はプレースホルダーが表示されるので、揃ったものから順に追加できます。

### 部活を増やす／減らす
`index.html` の `<!-- ============ CLUBS ============ -->` 内の `<article class="club">` を
コピーして中身を書き換えてください。画像の左右は自動で交互になります。

## 未確定・要確認の項目

`index.html` 内に `<!-- TODO -->` コメントで残してあります。

1. **名前の由来** — 住所「下市**場**」＋「5**7**-1」＝ばなな、という推測。ご本人に確認のうえ本文化してください。
2. **代表メールアドレス** — 現在は Instagram DM のみ。メールを公開する場合は Contact 節の TODO を有効化。
3. **開室時間の書き方** — 「イベント開催時のみ」としています。実態と合っているか要確認。

## 掲載していないもの（次フェーズ候補）

- 月次カレンダー（現在は Instagram のみ）
- イベントアーカイブ（「斑点を結ぶ」「スローイング」等）
- メンバー一覧 — 個人情報にあたるため、本人の許諾を取ってから

## ドメインの更新について

姉妹スペース Project Space hazi の旧サイト `hazi.work` は、ドメインが失効して
第三者のパーキングページに置き換わっています。同じことが起きないよう、
**自動更新をオンにし、更新通知の届くメールアドレスを複数人が見られる状態**に
しておくことを強くおすすめします。
