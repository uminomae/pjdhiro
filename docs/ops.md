# Operations

## API 自動更新ルール（kesson-articles）

結論: 自動更新されます。

確認内容は以下です。

- `api/kesson-articles.json` は front matter を持つ Liquid テンプレートなので、Jekyll がビルド時にレンダリングします。
- `_config.yml` で `api/` は `exclude` に入っておらず、`permalink: /api/kesson-articles.json` も設定済みです。

つまり `public-pjdhiro` ブランチを GitHub Pages がビルドするたびに、posts/pages の tags/categories に基づいて JSON が再生成されます。

注意点:

- GitHub Pages のビルドが走ったときに更新されます。ローカルのファイル自体が自動書き換えされるわけではありません。
