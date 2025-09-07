---
permalink: /note-pine/trendSMA200/
title: "TradingView:indicator:【Trend SMA200】トレンド判定(移動平均線・期間200)"
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

## 【Trend SMA200】

- 概要
  - トレンド判定をチャート上部に出力するインジケータ
- 目的
  - エントリー時に大きな流れを判断する
- 特徴
  - 色付きフラッグをチャート下部に出力します。
  - 色付き文字(上昇=U,下降=D,フラット=F)をチャート下部に出力します。
    - *オプションで位置を変更可能(ex.ローソク足の上下に表示)

### 仕様

- 銘柄/時間足差は **pips/bar 換算**、もしくは **ATR 正規化**で吸収。  
- **ヒステリシス**により一度出たトレンドが簡単に反転しないよう制御。  
- **確定足のみ判定**オプションで形成中の反転ノイズを抑制。

- Source code
  - [【Trend SMA200】トレンド判定（SMA200・緩やか） — TradingView](https://jp.tradingview.com/script/G7YcFzHn/)  
[![img]({{ '/assets/images/pages/note/pine/trendSMA200.png' | relative_url }})]({{ '/assets/images/pages/note/pine/trendSMA200.png' | relative_url }})
