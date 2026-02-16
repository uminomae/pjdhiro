---
permalink: /20260206-llm-workflow-evolution/
title: "探索は再帰、収集は並列 — LLM運用を分けた6日間"
date: 2026-02-06 19:00:00 +0900
categories:
  - Project-Design
tags:
  - プロジェクト管理
  - AI協働
  - ナレッジマネジメント
  - Claude
  - Codex
header:
  og_image: "https://uminomae.github.io/pjdhiro/assets/images/blog/2026-2/0206/ss.png"
  teaser: "https://uminomae.github.io/pjdhiro/assets/images/blog/2026-2/0206/ss.png"
excerpt: "Codexデスクトップアプリを使ってみた。Claude もDTアプリ併用。ただ、Agent Teamはコンテキストの視点で不採用。再帰と並列で運用を分けた3日間。"
---

## この3日間

[前回レポート（2/3）]({{ '/20260203-project-management-report/' | relative_url }})からの差分。

- CodexとClaudeデスクトップアプリ（MCP経由でGitHub直接読み書き）を使ってみた
  - Codexはレビュー用。創造的な作業はこれから評価。
- Claude CodeのAgent team(サブエージェント間対話)は、まだ使わない。
  - 現状の使用量は週上限の33%/日、APIで5時間あたり$35くらい。
    - これ以上重い作業は予算オーバー
  - コンテキストを長く持つことに直接的には改善しなそう
  - サブエージェントの対話を眺めるのは洞察に良いだろうが、、、
    - Claude Skillsで十分読み応えがある。
  - コンテキスト無視の別なエージェントは魅力的だが、、、
    - プランが決まるならCodexのレビューは優秀。Opus4.6以上。
    - そのやり取りが手動エージェント間対話に。
- 探索は再帰、収集は並列。この区別でLLMの運用を分けた
- 信頼、美のモデルは足場として必要になりそう。まだ仮説保持。
  - これまでのSNS投稿でインフォグラフィックでUP済みのやつ。
- お金を感情やエネルギーとして読み換えると同じ構造が見える
- 管理書類が増えすぎた。Tier分類で整理した。

---

## 以下の記事はClaudeに記事を作ってもらいました。コピペです。

※Claudeの思い込みもあるので間違えてるところもありますが、そのまま掲載してます。

---

<style>
/* ── Dark theme: .page__content only ── */
.page__content{background:#0a0e1a;color:#94a3b8;padding:2em 1.5em;border-radius:8px;font-family:'Noto Sans JP','Hiragino Sans',sans-serif;font-size:15px;line-height:1.9}
.page__content p{color:#94a3b8}.page__content strong{color:#e2e8f0}
.page__content a{color:#f59e0b}.page__content a:hover{color:#fbbf24}
.page__content h1,.page__content h2,.page__content h3,.page__content h4{color:#e2e8f0;font-family:'Noto Serif JP',serif}
.page__content h2{font-size:1.35em;margin-top:2.5em;padding-bottom:.3em;border-bottom:1px solid #2a3654}
.page__content blockquote{background:#111827;border-left:3px solid #f59e0b;border-radius:8px;padding:16px 20px;margin:1.5em 0;color:#94a3b8;font-size:.9em;line-height:1.7}
.page__content blockquote p{color:#94a3b8}
.page__content .notice--info{background:#111827;border-left:3px solid #f59e0b;border-radius:8px;color:#94a3b8;padding:16px 20px}
.page__content pre{background:#1a2235!important;border:1px solid #2a3654;border-radius:8px;padding:16px 20px;color:#94a3b8;font-size:13px;line-height:1.6}
.page__content code{background:#1a2235;color:#f59e0b;padding:2px 6px;border-radius:4px;font-size:.88em}
.page__content pre code{background:none;color:#94a3b8;padding:0}
.page__content .highlight{background:#1a2235!important}
.page__content table{width:100%;border-collapse:collapse;margin:1.5em 0}
.page__content th{background:#1a2235;color:#e2e8f0;border:1px solid #2a3654;padding:10px 14px;font-size:.9em;font-weight:600;text-align:left}
.page__content td{background:#111827;color:#94a3b8;border:1px solid #2a3654;padding:10px 14px;font-size:.9em}
.page__content tr:hover td{background:#1a2235}
.page__content img{border-radius:8px;border:1px solid #2a3654;margin:1em 0}
.page__content hr{border:none;border-top:1px solid #2a3654;margin:2.5em 0}
.page__content ul,.page__content ol,.page__content li{color:#94a3b8}
.toc{background:#111827;border:1px solid #2a3654;border-radius:8px}
.toc .nav__title{background:#1a2235;color:#e2e8f0}
.toc a{color:#94a3b8}.toc a:hover,.toc li.active a{color:#f59e0b}
</style>



{: .notice--info}
Claude.ai（Opus 4.6）がリポジトリの管理書類から生成。[前回]({{ '/20260203-project-management-report/' | relative_url }})の続編。

---

## 01. 道具の変化

**Claudeデスクトップアプリ（DTアプリ）がMCP経由でGitHubに直接アクセス可能になった。** セッション冒頭でGitHub正本を直接読め、PK同期ズレの問題が軽減された。Claude Codeはスマホ時等のフォールバック。**Codex（OpenAI）** はEvidence収集の並列処理に限定して使用。

[![ワークフロー]({{ '/assets/images/blog/2026-2/0206/infographic-01-workflow.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0206/infographic-01-workflow.svg' | relative_url }})

---

## 02. 自律型エージェントを使わない理由

仮想エージェント（常時7＋専門10）はClaude.aiセッション内で積極的に使っている。同じコンテキストウィンドウを共有するから探索的議論ができる。不採用にしたのは**サブエージェント同士が直接やりとりする自律型の構成**。個々のエージェントが全体の文脈を失い、APIコストもかかる。

運用を**再帰的探索用**（Claude.ai対話）と**並列用**（Codex指示）に分けた。品質チェックTC-011がこの判断を制度化している——再帰的プロセスにPDCAを適用するとWithhold（スタック保持）が破壊される。

---

## 03. 管理書類の進化

README.mdが3日間でv1.2→v3.4。問題は**情報過多**——管理書類が増えるとコンテキストウィンドウを圧迫する。

[![管理書類の進化]({{ '/assets/images/blog/2026-2/0206/infographic-02-management-evolution.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0206/infographic-02-management-evolution.svg' | relative_url }})

**① 統合**: 分散ファイルをREADMEに一本化（PKファイル11→8）。**② 分類**: Tier 1（常に読む3点）とTier 2（PKガードが選択ロード）に分離。**③ 分岐**: DTアプリならGitHub直接、ウェブ版ならPK経由。

---

## 04. Codex並列パイプライン

[![パイプライン]({{ '/assets/images/blog/2026-2/0206/infographic-03-codex-pipeline.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0206/infographic-03-codex-pipeline.svg' | relative_url }})

ブリーフィング → Codex並列生成 → Claude.ai＋人間レビュー → 確定。EV-LS 4エントリ中**1件（25%）に領域境界違反を検出**。ブリーフィング制約が効くことと、人間レビューが不可欠であることを同時に確認。

---

## 05. 数字で見る3日間

[![比較]({{ '/assets/images/blog/2026-2/0206/infographic-04-comparison.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0206/infographic-04-comparison.svg' | relative_url }})

| 項目 | 2/3 | 2/6 |
|------|-----|-----|
| LLM | Claude.ai + Code | +DTアプリ(MCP) +Codex |
| 仮想エージェント | 常時4 | 常時7（+ガード3種） |
| 品質チェック | 6項目 | 7項目 + TC-011〜013 |
| 論拠DB | 42件 / 6ドメイン | 53+件 / 7ドメイン |
| イシュー | — | 42件（保持中） |

道具は増えたが、人間がやることは減っていない。42件のイシューを解決せずに保持している。**すぐに解決しない。**

---

*Generated by Claude.ai (Opus 4.6) from repository contents. 2026-02-06*