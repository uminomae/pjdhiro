---
permalink: /20260203-project-management-report/
title: "Claude.ai Skillsを試した最初の2.5日間の記録"
date: 2026-02-03 13:10:00 +0900
categories:
  - Project-Design
tags:
  - プロジェクト管理
  - AI協働
  - ナレッジマネジメント
  - 欠損駆動思考
  - Claude
header:
  og_image: "https://uminomae.github.io/pjdhiro/assets/images/blog/2026-2/0203/teaser.png"
  teaser: "https://uminomae.github.io/pjdhiro/assets/images/blog/2026-2/0203/teaser.png"
excerpt: "本記事は、Claude.ai（Opus 4.5）がGitHubリポジトリの管理書類・成果物・検討ログを読み込み、生成した。筆者（人間）はプロンプトと最終確認、英語画像の配置を行った。記事そのものが、以下に記述する手法の出力の一つである。"
# classes: ai-generated-dark
---

## 開始時点の状況：この画像から開始しました

[![Initial commit]({{ '/assets/images/blog/2026-2/0203/cr.jpg' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/cr.jpg' | relative_url }})
[![Initial commit]({{ '/assets/images/blog/2026-2/0203/kd.jpg' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/kd.jpg' | relative_url }})

### 現時点の成果品：読者層ごとにclaudeに出力してもらいました

※まだコンテンツは完成してません。

- 一般向け [![一般向け]({{ '/assets/images/blog/2026-2/0203/ss-kesson-general.png' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/kesson-general.pdf' | relative_url }})
- 経営者向け [![経営者向け]({{ '/assets/images/blog/2026-2/0203/ss-kesson-executive.png' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/kesson-executive.pdf' | relative_url }})
- デザイナー向け [![デザイナー向け]({{ '/assets/images/blog/2026-2/0203/ss-kesson-designer.png' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/kesson-designer.pdf' | relative_url }})
- 学術向け [![学術向け]({{ '/assets/images/blog/2026-2/0203/ss-kesson-academic.png' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/kesson-academic.pdf' | relative_url }})

---

## 以下の記事はClaudeに記事を作ってもらいました。コピペです。

---

<style>
/* ── Dark theme: .page__content only ── */
.page__content {
  background: #0a0e1a;
  color: #94a3b8;
  padding: 2em 1.5em;
  border-radius: 8px;
  font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
  font-size: 15px;
  line-height: 1.9;
}
.page__content p { color: #94a3b8; }
.page__content strong { color: #e2e8f0; }
.page__content a { color: #f59e0b; }
.page__content a:hover { color: #fbbf24; }

/* headings */
.page__content h1,
.page__content h2,
.page__content h3,
.page__content h4 { color: #e2e8f0; font-family: 'Noto Serif JP', serif; }
.page__content h2 {
  font-size: 1.35em;
  margin-top: 2.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #2a3654;
}

/* blockquote */
.page__content blockquote {
  background: #111827;
  border-left: 3px solid #f59e0b;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 1.5em 0;
  color: #94a3b8;
  font-size: 0.9em;
  line-height: 1.7;
}
.page__content blockquote p { color: #94a3b8; }

/* notice boxes */
.page__content .notice--info {
  background: #111827;
  border-left: 3px solid #f59e0b;
  border-radius: 8px;
  color: #94a3b8;
  padding: 16px 20px;
}

/* code */
.page__content pre {
  background: #1a2235 !important;
  border: 1px solid #2a3654;
  border-radius: 8px;
  padding: 16px 20px;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.6;
}
.page__content code {
  background: #1a2235;
  color: #f59e0b;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.88em;
}
.page__content pre code {
  background: none;
  color: #94a3b8;
  padding: 0;
}
.page__content .highlight { background: #1a2235 !important; }

/* tables */
.page__content table { width: 100%; border-collapse: collapse; margin: 1.5em 0; }
.page__content th {
  background: #1a2235;
  color: #e2e8f0;
  border: 1px solid #2a3654;
  padding: 10px 14px;
  font-size: 0.9em;
  font-weight: 600;
  text-align: left;
}
.page__content td {
  background: #111827;
  color: #94a3b8;
  border: 1px solid #2a3654;
  padding: 10px 14px;
  font-size: 0.9em;
}
.page__content tr:hover td { background: #1a2235; }

/* images */
.page__content img {
  border-radius: 8px;
  border: 1px solid #2a3654;
  margin: 1em 0;
}

/* hr */
.page__content hr {
  border: none;
  border-top: 1px solid #2a3654;
  margin: 2.5em 0;
}

/* lists */
.page__content ul, .page__content ol, .page__content li { color: #94a3b8; }

/* TOC sidebar */
.toc { background: #111827; border: 1px solid #2a3654; border-radius: 8px; }
.toc .nav__title { background: #1a2235; color: #e2e8f0; }
.toc a { color: #94a3b8; }
.toc a:hover, .toc li.active a { color: #f59e0b; }
</style>



{: .notice--info}
本記事は、Claude.ai（Opus 4.5）がGitHubリポジトリの管理書類・成果物・検討ログを読み込み、生成した。筆者（人間）はプロンプトと最終確認、英語画像の配置を行った。記事そのものが、以下に記述する手法の出力の一つである。

{: .notice--info}
筆者のAI利用歴について補足する。普段はChatGPTでチャットするのがメインで、GPTsやGemなどのbotは2025年12月から作るようになった。同月からNano Banana Proでインフォグラフィックを作ることがメインになった。Claude.aiへの課金は約1年ぶりで、Skillsを試してみたいと思い2026年1月31日に再開した。本記事のプロジェクトはその初日から始まっている。

{: .notice--info}
2026年1月31日 20:44、最初のコミット。`Initial commit: プロジェクト構造を作成`。2月3日 10:52の時点で、Phase 5まで完了、管理書類6本、品質チェック6項目、3層アーキテクチャ、マルチエージェント構成が稼働している。2.5日間の記録である。

---

## 01. 記事作成の範囲：gitログ1/31 20:44から2/3 10:52

[![gitログ — 最初の5件と最新の5件]({{ '/assets/images/blog/2026-2/0203/ssGitLog.png' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/ssGitLog.png' | relative_url }})

Initial commit:

[![Initial commit]({{ '/assets/images/blog/2026-2/0203/ssGitLogCode.png' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/ssGitLogCode.png' | relative_url }})

---

## 02. やっていること

プロジェクト名は「欠損駆動思考（Kesson-Driven Thinking）」。人間の意識が予測誤差をどのように「欠損」として体験し、それが創造や価値判断にどう結びつくかを記述する理論フレームワークだ。4つのモジュールで構成されている。

[![4モジュール構造]({{ '/assets/images/blog/2026-2/0203/infographic-01-modules.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/infographic-01-modules.svg' | relative_url }})
English
[![4モジュール構造 En]({{ '/assets/images/blog/2026-2/0203/infographic-01-modules-en.svg' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/infographic-01-modules-en.svg' | relative_url }})

M1（意識OS）とM2（創造プロセス）は詳細化が完了した。現在はPhase 6（全体統合）にいる。

---

## 03. 道具の選択

Claude.aiのProject Knowledgeにリポジトリの管理書類を同期し、Skillsとしてファイル生成・コードブロック出力を利用した。マルチエージェントはプロンプトでロールを指定する形で運用した。

自律的にマルチエージェントを走らせる構成（Claude Code複数起動等）も検討した。現時点では、コストと目的に照らしてClaude.ai上でバーチャルにエージェントを呼ぶ方が合理的と判断した。人間がGUIで対話する方が、品質管理と意思決定を挟みやすい。LLMの進化でGUI上の能力が拡大すれば、この判断は変わりうる。最初の3日間で優先すべきは、エージェント基盤の開発ではなく、理論構築と管理体制の設計だった。

結果として、Claude.ai（Opus 4.5）が議論と執筆を担い、Claude Codeはgit操作に限定し、人間は品質管理と意思決定に集中する構成になった。

[![ワークフロー]({{ '/assets/images/blog/2026-2/0203/infographic-02-workflow.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/infographic-02-workflow.svg' | relative_url }})
English
[![ワークフロー En]({{ '/assets/images/blog/2026-2/0203/infographic-02-workflow-En.svg' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/infographic-02-workflow-En.svg' | relative_url }})

```
Claude.ai → inbox/ にファイル群 + _instructions.md
    ↓
人間   → ダウンロード → inbox/ に配置
    ↓
Claude Code → /sync（_instructions.md に従いgit操作）
    ↓
GitHub（正本）
```

GitHubリポジトリを唯一の正本としている。Claude.aiのProject Knowledge（PK）はその同期先であり、直接編集しない。

---

## 04. 知の管理構造

成果物を3層で管理している。

[![3層アーキテクチャ]({{ '/assets/images/blog/2026-2/0203/infographic-03-architecture.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/infographic-03-architecture.svg' | relative_url }})
English
[![3層アーキテクチャ En]({{ '/assets/images/blog/2026-2/0203/infographic-03-architecture-en.svg' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/infographic-03-architecture-en.svg' | relative_url }})

DB層に論拠42件、一文表現10本、検討ログを格納している。変換層が読者と媒体に応じて選択し、UI層が最終出力する。

一文表現の例：

> E01: 創造とは、棄却された誤差を問いとして拾い直すことである  
> E02: 「待つ」ことが、反射的処理と創造的処理を分ける  
> E05: 美とは、欠損を保持することで生じる体験である

各表現は、複数の学術領域から裏付けを取った上で採用されている。どの論拠がどの表現を支えているかは追跡可能になっている。

---

## 05. 仮想研究チーム

Claude.aiのセッション内に、プロンプトでロールを指定する形で複数のエージェントを配置した。4つが常時稼働、10の専門エージェントを必要に応じて呼び出す。

[![エージェント構成]({{ '/assets/images/blog/2026-2/0203/infographic-06-agents.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/infographic-06-agents.svg' | relative_url }})
English
[![エージェント構成 En]({{ '/assets/images/blog/2026-2/0203/infographic-06-agents-en.svg' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/infographic-06-agents-en.svg' | relative_url }})


エージェントをメタ認知の支援者として配置した。決定は人間が行う。

---

## 06. 品質管理の仕組み

新しい概念や主張が生まれるたびに、6項目を通過させる。

[![品質管理6項目]({{ '/assets/images/blog/2026-2/0203/infographic-04-quality.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/infographic-04-quality.svg' | relative_url }})
English
[![品質管理6項目 En]({{ '/assets/images/blog/2026-2/0203/infographic-04-quality-en.svg' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/infographic-04-quality-en.svg' | relative_url }})

#3のレイヤ分離は、すべての記述に[P][M][S]のいずれかを付与する仕組みだ。[P]は神経科学の実験的事実。[M]は着想を得た比喩・解釈。[S]は検証可能な仮説。

#4の群盲象チェックは、一つの主張に対して最低3つの異なる領域から同じ構造を指し示せるかを確認する。「美とは、欠損を保持することで生じる体験である」（E05）は、Meltzer（美的葛藤の保持）、世阿弥（秘すれば花）、Klein（PS位に留まる耐性）、葉隠（忍ぶ恋）から同一構造が記述できる。

---

## 07. 壊れたもの、直したもの

**セッション間の記憶消失。**
Claude.aiはセッションをまたぐと状態を失う。前回の決定事項と矛盾する提案をAIが行い、議論が巻き戻った。セッション終了時に`context/CURRENT.md`を更新し、次回の起動時に`session-bootstrap.md`から連鎖的に参照する仕組みを導入した。

**AIが自分の設計原則を忘れた。**
「PK同期不要」と設計したClaude.aiが、次のターンで「PKにアップロードしてください」と提案した。設計者が自分の設計を把握していなかった。運用整合性テスト（OPS）を導入し、新しいファイルやワークフローの提案時に5項目のチェックを義務化した。

**手動git操作の限界。**
当初、ファイルの配置とgit操作を人間が手動で行っていた。手順の抜け漏れが発生した。inbox/ + _instructions.md形式を設計し、Claude.aiが指示書を書きClaude Codeが実行するパイプラインに移行した。

---

## 08. 数字とフェーズ

| 項目 | 値 |
|------|-----|
| 期間 | 2.5日（1/31 20:44 → 2/3 10:52） |
| 累計トークン | ~64,000 |
| 参照文献 | 60件超 |
| 一文表現 | 10本（E01-E10） |
| 論拠DB | 42エントリ |
| コア定義 | 4件（D1-D4） |
| 品質チェック | 6項目 |
| エージェント | 常時4 + 専門10 |
| 管理書類 | 6ファイル |
| コミット | 30+ |

[![進捗]({{ '/assets/images/blog/2026-2/0203/infographic-05-progress.svg' | relative_url }})]({{ '/assets/images/blog/2026-2/0203/infographic-05-progress.svg' | relative_url }})
English
[![進捗 En]({{ '/assets/images/blog/2026-2/0203/infographic-05-progress-en.svg' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-2/0203/infographic-05-progress-en.svg' | relative_url }})

| Phase | 内容 | トークン |
|-------|------|---------|
| 1 | 理論構造の確立 | ~3,000 |
| 2 | スピノル5段階展開 | ~13,500 |
| 3 | 意識の作動構造（4層モデル） | ~8,500 |
| 4 | 臨床・発達心理学との統合 | ~31,000 |
| 5 | 用語体系の確定 | ~8,000 |
| 6 | 全体統合 | 進行中 |

---

## 09. 変わったこと

AIとの作業時間が増えるほど、プロジェクトの設計文書が厚くなった。README、品質管理書類、セッションプロトコル、同期手順書、アーキテクチャ文書、起動プロトコル。これらを書くことで、AIのコンテキスト理解が変わった。

この記事自体がClaude.aiによって生成された。AIがリポジトリの管理書類を読み込んで出力した記事の品質が、そのプロジェクトの管理品質を反映する。設計文書が曖昧なら、出力も曖昧になる。

人間がやることは減っていない。判断と設計に集中するようになった。

---

*Generated by Claude.ai (Opus 4.5) from repository contents*