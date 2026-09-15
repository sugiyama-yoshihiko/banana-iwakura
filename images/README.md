# 画像の入れ方

このフォルダに以下のファイル名で画像を置くと、自動的にプレースホルダーと差し替わります。
（ファイルが無い間はプレースホルダーのまま表示されるので、後から順次追加できます）

| ファイル名 | 用途 | 推奨サイズ |
|---|---|---|
| `hero.jpg` | トップの全画面写真。民家の外観 or 人が集まっている内観 | 横 2400px 以上 / 横長 |
| `club-geikatsu.jpg` | 芸活 | 1600×1200 程度（4:3） |
| `club-eiga.jpg` | 場七映画倶楽部 | 4:3 |
| `club-tougei.jpg` | 場七陶芸部（配置済み） | 4:3 |
| `club-artgym.jpg` | 独断と偏見のアートジム | 4:3 |
| `ogp.jpg` | SNSシェア時のサムネイル | 1200×630 |

## 注意

- 必ず**場七で撮影した／権利を確認した写真**を使ってください。
- 人物が写る場合は本人の許諾を取ってください。
- 容量は1枚 500KB 以下を目安に（JPEG 品質80程度）。以下のコマンドで一括圧縮できます。

```bash
sips -Z 2400 -s format jpeg -s formatOptions 80 hero.jpg --out hero.jpg
```

## NEWS の写真

`images/news/` に `news-YYYY-MM-DD.jpg` の名前で置き、`index.html` の該当カードの
`<div class="card_thumbnail" data-img="images/news/news-YYYY-MM-DD.jpg">` で紐づけます。

現在入っているのは、場七自身のInstagram投稿から取得した7件です。
残り5件（2026.08.17 / 2026.03.27 / 2025.12.22 / 2025.12.10 / 2025.07.08）は
**他アカウントの投稿**のため、写真は入れていません。
掲載するには各アカウント（@yohibino、@hazi_iwakura、@catcher_of_cats、
@slowartcenternagoya、市民ギャラリー栄）の許諾が必要です。
