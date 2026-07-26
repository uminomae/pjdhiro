# CLAUDE.md — pjdhiro

Jekyll ブログ（GitHub Pages）。kesson-driven-thinking の成果物を公開する。

## ブランチ

- **develop**: 統合・プレビュー用ブランチ（localhost:3005 が develop ワークツリーを配信）。feature を develop に merge して確認する
- **main**: 公開ブランチ（GitHub Pages デプロイ先）。develop から流す

### garage の編集は develop で直接行う

`garage/` 配下の編集は、feature ブランチを切らず **develop ワークツリーで直接行う**（2026-07-18 指示）。3005 でそのままプレビューでき、余計な merge を挟まない。

## 配置ルール

- 記事: `_posts/YYYY-MM-DD-slug.md`
- アセット: `assets/` 配下
- domains.json: `assets/creation/manifests/domains.json`（generate-domains-json.mjs で生成。直接編集禁止）

## 作業規約

- commit には `Co-Authored-By: Claude <noreply@anthropic.com>` を含める
- push 前に `bundle exec jekyll build` でビルド確認
- **公開ページに生活圏が特定できる固有名詞を書かない**（近所のキャンプ場名・施設名・サーキット名・道路番号など）。「キャンプ場の駐車場」「近くのサーキット」のような一般名詞に置き換える（2026-07-27 指示。例: キャンプ場→キャンプ場）

## 関連リポジトリ

- kesson-driven-thinking: 理論・管理の本体
- creation-space: 変換パイプライン・evidence
