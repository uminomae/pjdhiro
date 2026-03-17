# CLAUDE.md — pjdhiro

Jekyll ブログ（GitHub Pages）。kesson-driven-thinking の成果物を公開する。

## ブランチ

- **main**: 公開ブランチ（GitHub Pages デプロイ先）

## 配置ルール

- 記事: `_posts/YYYY-MM-DD-slug.md`
- アセット: `assets/` 配下
- domains.json: `assets/creation/manifests/domains.json`（generate-domains-json.mjs で生成。直接編集禁止）

## 作業規約

- commit には `Co-Authored-By: Claude <noreply@anthropic.com>` を含める
- push 前に `bundle exec jekyll build` でビルド確認

## 関連リポジトリ

- kesson-driven-thinking: 理論・管理の本体
- creation-space: 変換パイプライン・evidence
