---
permalink: /20260302-everything-is-context/
title: "AI協働：「すべてはファイル」をコンテキストに持ち込んだ論文——棄却と保持の間"
date: 2026-03-02 11:00:00 +0900
categories:
  - LLM
  - 欠損駆動思考
  - AI協働
tags:
  - コンテキストエンジニアリング
header:
  og_image: "https://uminomae.github.io/pjdhiro/assets/images/blog/2026-3/0302/0302.png"
  teaser: "https://uminomae.github.io/pjdhiro/assets/images/blog/2026-3/0302/0302.png"
excerpt: "arXiv論文「Everything is Context」を読んだ。Unixの「すべてはファイル」をLLMのコンテキスト管理に持ち込んだ提案。ほぼ同意。ただし一点、論文のパイプラインにない操作がある。"
toc: true
toc_sticky: true
---

[![image]({{ '/assets/images/blog/2026-03/0302/0302.png' | relative_url }})]({{ '/assets/images/blog/2026-03/0302/0302.png' | relative_url }})
English
[![image]({{ '/assets/images/blog/2026-03/0302/0302-en.png' | relative_url }}){: .img-card .img-40 }]({{ '/assets/images/blog/2026-03/0302/0302-en.png' | relative_url }})


私の1ヶ月はこんな感じでした。という論文を見つけたので共有します。
して、12月のLLMの進化に対し、急ぎ「欠損駆動思考」を伝えようと整備している理由でもあります。



## 以下の記事はClaudeに記事を作ってもらいました。コピペです。

Claude.ai（Opus 4.6）がリポジトリの内容と論文をもとに生成した記事である。事実関係はpjdhiroが確認済み。

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
コンテキストエンジニアリングの論文を読んで、自分のClaude＋GitHub運用との対応を観察した記事である。

1月末からClaude＋GitHubでナレッジ管理をやっていて、「これ、ファイルシステムだな」と思っていた。  
そこにコンテキストエンジニアリングの論文が出てきて、まさにその感覚に構造を与えてくれた。

* [参考:【Everything is Context: Agentic File System Abstraction for Context Engineering（arXiv:2512.05470）】](https://arxiv.org/abs/2512.05470)

## 01. 論文が言ってること

LLMは本質的にステートレス。セッションが切れたら全部忘れる。  
だから外部に永続的なコンテキストリポジトリが要る。  
で、そのリポジトリを**ファイルシステムの抽象化**で統一的に扱おう、という提案。

永続層は3つ:

- **履歴（History）**: 不変の記録。全インタラクションの生ログ
- **メモリ（Memory）**: 構造化されたビュー。事実、エピソード、手続き
- **スクラッチパッド（Scratchpad）**: 一時的な作業空間。推論中の仮置き場

この3つに対してパイプラインを回す:

- **Context Constructor**: 何を選ぶか、何を捨てるか。トークン予算に合わせて圧縮
- **Context Updater**: トークンウィンドウに何を流し込むか、いつ差し替えるか
- **Context Evaluator**: 出力を検証してメモリに書き戻す。幻覚や矛盾を検出

制約があるから、選択・圧縮・検証の設計が要る。  
全部入るなら全部入れて終わり。入らないから設計が要る。

## 02. あれ、やってたことじゃん

読みながら対応表を作ってみて、笑ってしまった。

| 論文の概念 | 自分の実践 |
|-----------|-----------|
| 履歴（History） | Gitのコミット履歴 |
| メモリ（Memory） | GitHub Issues |
| スクラッチパッド | `session/state.md`、作業中の一時ファイル |
| Context Constructor | セッション開始時のIssue読み込み＋README参照 |
| Context Updater | 対話中のコンテキスト管理 |
| Context Evaluator | 品質チェックリスト |

全部対応してる。  
別に論文を読んでからやったわけじゃない。「セッション切れて困った」「Issueに書いておかないと忘れる」「state.mdに退避しないと消える」。困りごとを一つずつ潰していったら、結果的にこの形になっていた。

外部との接続もそう。論文がAFS（Agentic File System）として統一的な名前空間を提案しているけど、自分の運用ではローカルファイルの読み書き、GitHub API、OpenAI、Geminiと4つの接続を個別に積み上げて、結果的に同じことをしている。名前空間が統一されていないだけ。

理想的な状態ではない。  
個人でやっていて、資源に制約があって、過渡期で、毎日改善している。  
論文が提案するアーキテクチャに時間をかけて近づいていくだろう。夢中でやっている。

## 03. 一点、論文にないもの

ほぼ同意した上で、一つだけ引っかかった。

論文のContext Constructorは**「選ぶか、捨てるか」**で設計されている。  
トークン予算に合わせて、必要な情報を選択し、不要な情報を棄却する。二択。

自分の運用には、**第三の操作**がある。

「今は処理できない。トークンウィンドウにも入れない。でも捨てない。問いとして保持する。」

具体的には、GitHub IssuesにHOLDラベルをつけて残している。  
今のセッションには持ち込まない。でも棄却もしない。  
いつか意味がわかるかもしれない。いま無理に構造化すると壊れる。  
だから置いておく。

この「保持」の居場所が、論文の永続層にない。  
Historyは過去の不変記録で、問いを置く場所じゃない。Memoryは構造化済みの知識で、まだ構造化できないものは入れない。Scratchpadはセッション終了で消える。  
「まだ分からないが、捨ててもいない問い」の置き場が、設計されていない。

## 04. 操作が一つ足りない

論文のパイプラインは、情報に対する操作が3つ。選択、棄却、保存。  
この3つで閉じていて、入れ物の設計としては整合している。

自分の運用で起きていることは4つ:

1. **選択**: 今のセッションに持ち込む
2. **棄却**: 不要と判断して消す
3. **保存**: IssueやMemoryに構造化して格納する
4. **保持**: 構造化せず、問いのまま置いておく

4番目の「保持」は、**未解決のまま外部に預ける操作**。  
トークンウィンドウの中にも外にも、すっきりとは収まらない。  
でも消すわけにはいかない。

## 05. 入れ物と中身

論文のパイプラインは入れ物の設計。  
History、Memory、Scratchpad。永続層とパイプライン。ファイルシステムの抽象化。同意する。

ただ、中身の選び方——特に「これは今は分からないが、捨てるべきではない」という判断——は、入れ物だけでは解けない。  
その判断をする主体が、パイプラインの中にいるのか外にいるのか。  
自分の運用では、自分（＋Claude）がその判断をしている。

論文のパイプラインは入れ物を設計した。  
中身の選び方のうち、「保持」という操作が要るんじゃないか。

では、何を棄却して何を保持するのか。その判断をどうやっているのか。  
棄却される誤差を、問いとして拾う。そのときの基準や態度を、自分は「欠損駆動思考」としてまとめている。

* [欠損駆動思考——kesson-space](https://uminomae.github.io/kesson-space/)

まだ仮説。

## 参考・関連

- [Everything is Context（arXiv:2512.05470）](https://arxiv.org/abs/2512.05470)
- [Effective context engineering for AI agents（Anthropic）](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Context engineering for agents（LangChain）](https://blog.langchain.com/context-engineering-for-agents/)
- [日記：Claude+GitHubを2週間：ナレッジ管理]({{ '/20260213-float-structure/' | relative_url }})

*Generated by Claude.ai (Opus 4.6) from repository contents. 2026-03-02*