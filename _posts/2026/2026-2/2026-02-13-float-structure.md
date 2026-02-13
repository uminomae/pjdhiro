---
permalink: /20260213-float-structure/
title: "日記：Claude+GitHubを2週間：ナレッジ管理"
date: 2026-02-13 12:00:00 +0900
categories:
  - Project-Design
tags:
  - プロジェクト管理
  - AI協働
  - ナレッジマネジメント
  - LLM
  - Claude
  - フロート構造
header:
  og_image: "https://uminomae.github.io/pjdhiro/assets/images/blog/2026-2/0213/teaser.png"
  teaser: "https://uminomae.github.io/pjdhiro/assets/images/blog/2026-2/0213/teaser.png"
excerpt: "2週間やってみて、自分の用途では構造が見えてきた。WordPress的な多機能とNote的な手軽さ、両方取れてるように見える。動的サーバーが要らなくなった理由のほうが面白い。"
---

{: .notice--info}
[2/3レポート]({{ '/20260203-project-management-report/' | relative_url }})、[2/6レポート]({{ '/20260206-llm-workflow-evolution/' | relative_url }})、[2/10レポート]({{ '/20260210-llm-knowledge-management/' | relative_url }})の続き。

{::nomarkdown}
<video 
  src="{{ '/assets/movie/pd/kesson/kesson-space.mp4' | relative_url }}" 
  autoplay
  controls 
  muted 
  playsinline 
  loop
  style="width:100%; max-width:640px; border-radius:8px; border:1px solid #2a3654;">
</video>
{:/nomarkdown}

[3Dサイトはこちら >>【欠損駆動思考 - Kesson Space】](https://uminomae.github.io/kesson-space/)

---

## GitHubは多数の人に伝えたい重要な情報を入れるとこ：それは変わらない

- Claude.ai + GitHubで2週間。一人用ナレッジ管理兼BLOGのようなものが動いている。
- 作ったというより、GitHub Pagesに”大事だけど話すと長くなることで何度も言うやつ”を入れていたのが膨れただけ、とも。
  - GitHubを選んだのは、メンテが楽だし、一番長く残りそうな保存領域だから。
    - googleよりも長く続きそうなとこ、って理由。

## いつの間にか溜まっていく

- LLMと対話してるだけで成長していくのがうれしー
  - 過去の対話の発言集を見に行ってくれる。
  - プロジェクト管理が楽。憲章と品質管理と書類管理してくれる。(テストコード的)
    - それを見て勝手に判断してくれる。（自動実行）

## コンテキストってアルゴリズムと同等じゃ、と湧いた

- コンテキスト管理もアルゴリズム実装も、会話の中で処理されて、出力がMarkdownになっている。
- GitHubという「場」にMarkdownファイルがあって、LLMがそれを読み書きする。
- テスト文みたいになっていく。

## ヘッドレスCMSっぽい

[![インフォグラフィック]({{ '/assets/images/blog/2026-2/0213/image.png' | relative_url }})]({{ '/assets/images/blog/2026-2/0213/image.png' | relative_url }})

- GitHubをデータベースにして、必要なときに必要な形に変換する。
  - 伝達対象向けに発信できるのはめっちゃ楽。全方位に伝達する方がむずい。
    - ブログ記事を出したいとき、Jekyllが静的HTMLにする。
    - PDFにしたいとき、Claudeが読者層に合わせてレイアウトを組む。
      - 例：一般向けと専門家向け
    - 3D体験空間にしたいとき、jsでパースする。

## 制約条件：でも、オーナー＋LLMで十分な時代

- 読み取り専用発信
- 運用者が1人
- でも、APIもDBも解決する人出てきてくれると他力本願の楽観。
  - 参考:【Hello Entire World · Entire】 <https://entire.io/blog/hello-entire-world/>

## 構成を並べてみた。

| 要素 | WordPress | Note | 私の構成 |
|------|-----------|------|-----------|
| DB | MySQL | 内蔵 | Git |
| API | REST / GraphQL | 内蔵 | — |
| App | PHP | 内蔵 | — |
| Web | Nginx / Apache | note.com | GitHub Pages |

