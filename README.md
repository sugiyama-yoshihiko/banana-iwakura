# 場七 / Banana — 公式サイト

愛知県岩倉市のアートスペース「場七 / Banana」の公式サイト。
ビルド不要の静的HTML（フレームワーク・依存パッケージなし）で、GitHub Pages にホスティングします。

- 本番: https://banana-iwakura.com
- Instagram: https://www.instagram.com/banana_iwakura/

## 構成

```
index.html          1枚もの。Hero / About / News / Clubs / Access / Contact
assets/style.css    スタイル
assets/main.js      ローディング演出・ナビ・NEWS絞り込み・画像差し替え
images/             写真（images/README.md に入れ方を記載）
CNAME               カスタムドメイン設定（GitHub Pages が読む）
.nojekyll           Jekyll のビルドを無効化
```

## ローカルで見る

```bash
python3 -m http.server 4173
```

http://localhost:4173 を開いてください。

---

## デザインの設計方針

hagiso.com の解析仕様書をもとに、**設計原理だけ**を転用しています（意匠・コピー・アセットは流用していません）。

### 1. 幾何ルール ＝「7」

サイト全体で1つの幾何ルールを反復させています。数値は場七に由来するものを選びました。

| 値 | 用途 |
|---|---|
| `--r-sm: 7px` | 極小 |
| `--r-md: 21px`（7×3） | カード・情報パネル・ピル・地図 |
| `--r-lg: 49px`（7×7） | ヒーロー画像・部活の写真・SP下部バー |

角丸は**対角2隅だけ**にかけます（PC = `49px 0 49px 0`、SP = `0 0 49px 0`）。
ホバーすると全周が丸くなる、というのが唯一の「呼吸」です。

> 由来：名前の「**七**」／ 2024年**7**月**7**日 始動 ／ 住所 下市場**57**-1

### 2. 色は意味に紐づける

無彩色で骨格を作り、**バナナ色 `#f0a500` は「操作できるもの」にだけ**使います。

- 使う：ボタン、タグ、リンク、現在地のハイライト、NEWSのカテゴリ、SCROLL表示
- 使わない：見出し、区切り線、強調、装飾

この規律を崩すと一気に安っぽくなるので、色を足すときは注意してください。

### 3. 書体

- 和文：Zen Kaku Gothic New
- 英字ラベル：Space Grotesk（ナビ・見出しの英字・日付・ハンドル名）
- `font-feature-settings: "palt" 1` を全体にかけています（日本語の詰め組み）

### 4. レイアウト

- **PC（≥1025px）**：左に100vh固定のサイドバー（`clamp(190px, 12.5%, 240px)`）＋ 右に本文の2カラム
- **SP（<1025px）**：上部に高さ100pxの固定ヘッダー、下部に高さ70pxの固定ナビバー、本文の横paddingは7.6%
- ホバーは全て `@media (any-hover: hover)` で囲っています（タッチ端末で hover が張り付くのを防ぐため）

### 5. ローディング

初回訪問時のみ、ロゴ「場七」を線で1画ずつ描き → 消し → カーテンが開く演出が約2.6秒です。
2回目以降は `sessionStorage` で判定して即表示します。

ロゴはヒラギノ角ゴW3の字形を fontTools でSVGパス化したものです（6サブパス）。
`getTotalLength()` で線の長さを測って `stroke-dashoffset` を動かしているため、
**ロゴを差し替える場合は必ず「パス」である必要があります**（`<text>` では動きません）。

---

## 更新のしかた

### 文章を直す
`index.html` を直接編集して commit → push すれば、1〜2分で本番に反映されます。

### 写真を入れる
`images/` に決められたファイル名で置くだけです。詳しくは [images/README.md](images/README.md)。
ファイルが無い間はプレースホルダーが表示されるので、揃ったものから順に追加できます。

### NEWS を追加する
`index.html` の `<!-- ============ NEWS ============ -->` 内にある `<article class="card">` を
コピーして、上（新しい順）に足してください。

```html
<article class="card" data-tags="美術 対話">   <!-- ← 半角スペース区切り。絞り込みに使われる -->
  <a href="（Instagram投稿などのURL）" target="_blank" rel="noopener">
    <div class="card_thumbnail"><span class="ph">2026<br>09</span></div>
    <p class="card_date">2026.09.01</p>
    <p class="card_category">（キャッチコピー。一言で）</p>
    <h3 class="card_title">（できごとの名前）</h3>
    <p class="card_excerpt">（2〜3行の説明）</p>
  </a>
</article>
```

- `data-tags` に使えるのは `美術 / 映画 / 食 / 対話 / 部活` の5つです。
  増やす場合は `.news-filter` のボタンと、トップの `#heroTags` にも同じ語を足してください。
- サムネイルに写真を入れる場合は `<div class="card_thumbnail" data-img="images/news/xxx.jpg">` としてください。

### 部活を増やす／減らす
`<article class="club">` をコピーして中身を書き換えてください。画像の左右は自動で交互になります。

### CSSを直したとき
`index.html` の `?v=5` の数字を1つ上げてください。ブラウザが古いCSSをキャッシュし続けるのを防げます。

---

## 未確定・要確認の項目

`index.html` 内に `<!-- TODO -->` コメントで残してあります。

1. **名前の由来** — 住所「下市**場**57-1」＝ばなな、という推測です。裏が取れていないので本文には出していません。確認できたら About に一節として足すと効きます。
2. **代表メールアドレス** — 現在は Instagram DM のみ。公開する場合は Contact 節の TODO を有効化。
3. **開室時間の書き方** — 「イベント開催時のみ」としています。実態と合っているか要確認。
4. **NEWS の網羅性** — Instagram で公開されている投稿と、市民ギャラリー栄の公式ページから拾えた12件を掲載しています。
   ログインしないと見られないストーリーズ／ハイライトの内容は拾えていないので、抜けがあれば追加してください。

## PEOPLE セクションについて

`index.html` 内にコメントアウトした雛形があります（CSSは実装済み）。
本人の掲載許諾が取れ次第、コメントを外して使えます。

**集める情報**：氏名 ／ ローマ字表記 ／ 肩書き ／ 顔写真（正方形） ／ リンク（任意） ／ 場七メンバーか外部の協力者か

リングの色分けは `class="people-person_thumbnail is-member"` で黄（メンバー）、
クラス無しでグレー（外部の協力者）になります。写真は `images/people/ローマ字名.jpg`。

> 市民ギャラリー栄の公式ページには出品作家として8名（玉田大和・大野高輝・森田健・林亮太・杉山仁彦・新川未悠・平岡真生・荻野斗樹）が既に実名掲載されていますが、
> 「その展覧会の出品者」であることと「場七のメンバーとして自サイトに載る」ことは別なので、掲載前に本人確認を取ってください。

---

## ドメインの更新について

姉妹スペース Project Space hazi の旧サイト `hazi.work` は、ドメインが失効して
第三者のパーキングページに置き換わっています。同じことが起きないよう、
**自動更新をオンにし、更新通知の届くメールアドレスを複数人が見られる状態**に
しておくことを強くおすすめします。

## デプロイ（未実施）

GitHub Organization `banana-iwakura` の作成待ちです。作成後：

```bash
gh repo create banana-iwakura/banana-iwakura --public --source=. --push
```

その後 Settings → Pages で `main` / `root` を指定し、Custom domain に `banana-iwakura.com` を設定、
Enforce HTTPS をオンにしてください。DNSレコードは別途共有済みのものを使います。
