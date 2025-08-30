---
permalink: /note-pine/sma5set/
title: "Tradingview:indicator:移動平均線3本×期間5セット登録"
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

## SMA3×5 移動平均線を出力するインジケータ

- 目的
  - 時間足ごとに異なる期間を指定できます
- 特徴
  - 最大3本（短期・中期・長期）の移動平均線を出力します。
  - 期間は5セット登録できます
  - 登録したセットを指定の時間足で表示します。  

- **目的**: マルチタイムフレームの地合い把握／上位足の整合確認
- **仕様**: overlay、plotはグローバル、`safe_sma`で0期間は `na` マスク

- Source code
  - [【SMA 3×5 — TradingView】](https://www.tradingview.com/script/F7PRD3kM-SMA-3-5-pjdhiro/)

[![SMA(3)×5 v6]({{ '/assets/images/pages/note/pine/sma5set.png' | relative_url }})]({{ '/assets/images/pages/note/pine/sma5set.png' | relative_url }})
