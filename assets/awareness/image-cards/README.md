# awareness image cards

画像を解釈コメント付きカードとして公開するための入力ディレクトリ。

## 置き方

`items/` に次を同じ basename で置く。

- 画像: `{slug}.{png|jpg|jpeg|webp|gif}`
- sidecar: `{slug}.json`

## 反映

`awareness-space` 側で次を実行する。

```bash
node transform/scripts/build-awareness-image-cards.mjs
```

これで `../manifests/image-cards.json` が再生成される。
