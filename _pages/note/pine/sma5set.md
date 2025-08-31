---
permalink: /note-pine/sma5set/
title: "TradingView:indicator:移動平均線 3本5セット - SMA(3)×5set v6"
date: 2025-08-30
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

## 移動平均線3本×期間5セット登録を出力するインジケータ

- 目的
  - 時間足ごとに異なる期間を指定できます
  - 一つのインジケータで3本の移動平均線を描画
- 特徴
  - 最大3本（短期・中期・長期）の移動平均線を出力します。
  - 期間は5セット登録できます
  - 登録したセットを指定の時間足で表示します。  

- **仕様**: overlay、plotはグローバル、`safe_sma`で0期間は `na` マスク

- Source code
  - [【移動平均線 3本5セット - SMA(3)×5set v6 — TradingView】](https://www.tradingview.com/script/F7PRD3kM-SMA-3-5-pjdhiro/)

[![移動平均線 3本5セット - SMA(3)×5set v6]({{ '/assets/images/pages/note/pine/sma5set.png' | relative_url }})]({{ '/assets/images/pages/note/pine/sma5set.png' | relative_url }})
