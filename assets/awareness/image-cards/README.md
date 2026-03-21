# awareness image cards

画像を解釈コメント付きカードとして公開するための入力ディレクトリ。

## 置き方

通常は `items/` に画像だけ置けばよい。`awareness-space` 側の ingest script が missing sidecar を自動生成する。

完成形では次を同じ basename で持つ。

- 画像: `{slug}.{png|jpg|jpeg|webp|gif}`
- sidecar: `{slug}.json`

## 反映

`awareness-space` 側で次を実行する。

```bash
node transform/scripts/ingest-awareness-image-cards.mjs
```

これで missing sidecar の生成と `../manifests/image-cards.json` の再生成が行われる。
