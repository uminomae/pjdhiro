---
permalink: /20260218-vanillajs-non-engineer/
title: "日記：非エンジニアがVanillaJSでThree.jsサイトを作ってる理由"
date: 2026-02-18 01:00:00 +0900
last_modified_at: 2026-02-18
categories:
  - Log
  - Project
tags:
  - VanillaJS
  - Three.js
  - GitHub Pages
  - Claude
  - Codex
  - LLM
  - Kesson-space-devlog
header:
  og_image: https://uminomae.github.io/pjdhiro/assets/images/blog/2026-2/0218/teaser.png
  teaser: "https://uminomae.github.io/pjdhiro/assets/images/blog/2026-2/0218/teaser.png"
excerpt: "Claudeが2日で50%/週の制限に達する。のでCodexで作業せざるを得ない。が、基本的に書きたいものが無い便利な世の中。"
toc: true
toc_sticky: true
---


## 以下の記事はClaudeに記事を作ってもらいました。コピペです。

※Claudeの思い込みもあるので間違えてるところもありますが、そのまま掲載してます。

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
Claudeが2日で週の制限の半分に達する。のでCodexに切り替えざるを得ない。が、Codexに頼めることが限られてくる。グラフィックくらいしか残ってない。非エンジニアがなぜこの構成に辿り着いたのかを振り返ってみる。

---

## 書きたいものが無い

まずここから。

LLM + GitHubで2週間やってみて、ブログも管理文書もナレッジ構造化も、Claudeとの対話で大体片付くようになった。「書く」作業はほぼLLMが引き受けてくれる。制限さえなければ1日中対話していられる。

ところが制限がくる。Claudeは2日で50%/週を使い切る。  
残りの5日をどう過ごすか。

Codexに切り替えてコーディングをやろうにも、「書きたいコード」が特にない。便利な世の中になった代償。記事もドキュメントも、対話で生まれる。コードとして「作る」必要があるものが減っていく。

残ってるのは、グラフィック。  
Three.jsのシェーダーを触る。光の色を変える。カメラの位置を1px動かす。「見て、触って、判断する」領域。ここはまだ人間がやるしかない。

---

## なぜGitHub Pages

これは簡単で、ブログを書くのに動的サーバーが要らなくなったから。

WordPressだとPHP、MySQL、レンタルサーバー。維持費もかかるしセキュリティ更新もある。Noteだとカスタマイズできない。Wixだと構造が見えない。

GitHub Pagesは、Markdownファイルをgit pushするだけでWebサイトになる。無料。テキストファイルの管理。UNIX的。

LLMが直接GitHubにMCPで接続してファイルを読み書きしてくれるようになってから、この構成の意味が変わった。SaaSの管理画面ログインが不要。ファイルに触れればいい。LLMがフルスタックのApp Serverみたいに振る舞う。

静的サイトジェネレータのJekyllがMarkdownをHTMLに変換してくれる。Minimal Mistakesというテーマが目次もカテゴリもタグも勝手にやってくれる。私はMarkdownを書くだけ。

---

## なぜVanillaJS

ここが一番変な話だと思う。2026年にVanilla JavaScript。  
React使わないの？ Next.js使わないの？ と。

理由はいくつかある。

**ビルドツールが要らない。** npmもwebpackもviteも無い。`<script type="module" src="./src/main.js"></script>` と書けばブラウザが直接ESModulesを読む。壊れるところが少ない。壊れても原因がわかりやすい。

**CDNのimportmapで十分。** Three.jsもBootstrapも、CDNから直接importする。package.jsonが無い。node_modulesが無い。`npm install`を叩いたことがない。

```html
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
    }
  }
</script>
```

**LLMが全文を把握できる。** ここがミソだと思ってる。ReactやNext.jsだと、コンポーネントが何十ファイルにも分かれる。LLMにコンテキストを渡すとき、依存関係の把握にトークンを消費する。VanillaJSで、main.js + scene.js + config.js + shaders/ と10数ファイルに収まってると、LLMが全体を見渡せる。修正の指示も一発で通りやすい。

**フレームワークが邪魔になる時代。** LLMに「この動きを変えて」と言うとき、Reactの状態管理やフックの文法を経由するより、DOMを直接触るほうが速い。SaaSのUIが要らなくなったのと同じ構造。フレームワークは便利なパッケージだったけど、LLMが翻訳者になれるなら、中間層は薄いほうが伝わる。

あと正直に言うと、私はReactを書けないから、というのが最大の理由かもしれない。書けないけど、VanillaJSならLLMと一緒にどうにかなる。非エンジニアにとって、「フレームワークの学習コスト」が消えるのはかなり大きい。

---

## なぜThree.js

欠損駆動思考を「体験」として伝えたかったから。

テキストで「闇の中に光が浮かぶ」と書いても伝わらない。3D空間に闇を作って、そこにシェーダーで光を灯して、呼吸するように明滅させて、水面で揺らす。それを見た人が「あ、こういう感じか」と体感するほうが早い。

コンセプトとコードが直結してる。config.jsの`tintR: 1.25, tintG: 2.0, tintB: 0.8`という数値が、そのまま「暖色の光」を定義している。devパネルでスライダーを動かすと、リアルタイムで空間が変わる。言葉の定義より、パラメータの定義のほうが正確。

Three.js自体は、CDNからimportするだけで動く。VanillaJSとの相性がいい。Reactのラッパーライブラリ（react-three-fiber等）を経由する必要がない。

---

## なぜBootstrap

devパネルのためだけに入れてる。

開発中にシェーダーのパラメータを調整するためのUIが要る。アコーディオンとスライダーとスイッチ。Bootstrap 5がCDNから読めて、それだけで済む。本番では`?dev`パラメータをURLにつけないと出てこない。

CSSフレームワークとして本体のデザインには使ってない。本体のスタイルは全部手書きのCSS。暗闇にBootstrapのカードは浮かない。

---

## Claude制限とCodexの使い分け

Claudeでやりたいことの核は対話。学術的な話をしたい。量子力学とスピノルと民話の対応とか、国家の連結会計と覇権の話とか。それがメインの用途。

でも2日で50%使い切る。

Codexに移ると、コンテキストの制約が違う。Codexはファイルを見てコードを書くのは得意だけど、長い対話の文脈を保持する設計ではない。「この前のスピノルの話の続きで、イザナミのアナロジーを四元数に」みたいな依頼はCodexには向かない。

結果的に、Codexには「このCSSを修正して」「このシェーダーのパラメータを調整して」みたいな、自己完結する作業を渡すことになる。Three.jsのグラフィック調整は、まさにそういう仕事。入力（現行コード + 修正指示）と出力（修正済みコード）が明確に閉じてる。

つまりこういう構造になってる。

- **Claude**：対話、探索、記事、構造化 → 制限がくる
- **Codex**：コーディング、グラフィック調整 → 制限の隙間を埋める
- **人間**：見て、触って、判断する → devパネルでスライダーを動かす

---

## VanillaJSが使われない理由と、使ってる理由

世の中でVanillaJSが敬遠される理由は理解できる。大規模アプリケーションでは状態管理が複雑になる。チーム開発では規約がないと混乱する。型がないとバグが見つけにくい。

でもそれは「チームで大規模なWebアプリを作る」前提の話。

非エンジニアがひとりで、LLMと一緒に、3D体験空間を作る。この用途では、フレームワークの価値が反転する。学習コストは邪魔。依存関係は壊れるリスク。ビルドプロセスはブラックボックス。

逆にVanillaJSの弱点（状態管理、規約の不在）は、config.jsをSingle Source of Truthにして、LLMに「config.jsを確認してから修正して」と言えばカバーできてる。LLMがフレームワークの役割を一部引き受けてるような状態。

フレームワークは「チームで大規模に」のためのもの。ひとりで小規模に、でもLLMと一緒に、なら、素のJSのほうが見通しがいいんじゃないかと。

まだ仮説だけど。

---

## 参考・関連

- [欠損駆動思考 - Kesson Space](https://uminomae.github.io/kesson-space/?open=articles&scroll=articles-readmore)
- [Claude+GitHubを2週間：ナレッジ管理](/pjdhiro/20260213-float-structure/)
- [ナレッジ管理にSaaSを使っている方へ](/pjdhiro/20260210-llm-knowledge-management/)
- [探索は再帰、収集は並列 — LLM運用を分けた6日間](/pjdhiro/20260206-llm-workflow-evolution/)

---

*Generated by Claude.ai (Opus 4.6) from conversation. 2026-02-18*