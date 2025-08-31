---
permalink: /note-pine/trendSMA200/
title: "TradingView:indicator:トレンド判定(移動平均線・期間200)"
date: 2025-08-31
categories:
  - Pine
  - TradingView
  - indicator
sidebar:
  nav: docs
  nav2: ""
  nav3: cat-design-topics
  nav4: cat-side-notes
  nav5: ""
---

## トレンド判定をチャート上部に出力するインジケータ

- 目的
  - 15分足でのエントリー時に大きな流れを判断する
- 特徴
  - 色付き文字(上昇=U,下降=D,フラット=F)をチャート上部に出力します。
    - *オプションで位置を変更可能(ex.ローソク足の上下に表示)

### 仕様

- 銘柄/時間足差は **pips/bar 換算**、もしくは **ATR 正規化**で吸収。  
- **ヒステリシス**により一度出たトレンドが簡単に反転しないよう制御。  
- **確定足のみ判定**オプションで形成中の反転ノイズを抑制。

- Source code
  - [【トレンド判定（SMA200・緩やか） — TradingView】](https://www.tradingview.com/script/mS2wILDB-%E3%83%88%E3%83%AC%E3%83%B3%E3%83%89%E5%88%A4%E5%AE%9A-SMA200-%E7%B7%A9%E3%82%84%E3%81%8B-pjdhiro/)

[![トレンド判定（SMA200・緩やか]({{ '/assets/images/pages/note/pine/trendSMA200.png' | relative_url }})]({{ '/assets/images/pages/note/pine/trendSMA200.png' | relative_url }})
