# awareness image cards

画像を解釈コメント付きカードとして公開するための入力ディレクトリ。

## 置き方

通常は `items/` に画像だけ置けばよい。`awareness-space` 側の ingest script が missing sidecar を draft として自動生成する。

完成形では次を同じ basename で持つ。

- 画像: `{slug}.{png|jpg|jpeg|webp|gif}`
- sidecar: `{slug}.json`

## 反映

`awareness-space` 側で次を実行する。

```bash
node transform/scripts/ingest-awareness-image-cards.mjs
```

これで missing sidecar の生成と `../manifests/image-cards.json` の再生成が行われる。

## 注意

- 自動生成された sidecar は draft 扱いで、そのままでは manifest に出ない
- `comment_*` は「この図が何を表現しているか」がざっくり分かる短い要約を書く
- 冒頭の事実列挙や `図として読める` のような説明は避ける
- internal slug が title に残っているなら、公開前に図の主題を示す見出しへ直す
- title の言い換えだけの文や、自動取り込みを説明する文は不可
- `comment_*` と `alt_*` を手で記述し、`review_status` を `"ready"` にしてから再実行する
