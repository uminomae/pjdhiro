---
permalink: /note-pine/sma5set/
title: "Tradingview:indicator:移動平均線 "
date: 2025-08-30
categories:
  - Pine
sidebar:
  nav: docs
  nav2: ""
  nav3: cat-design-topics
  nav4: cat-side-notes
  nav5: ""
---

## SMA(3)×5 v6

- 5 セット × 各3本（短期・中期・長期）の SMA を、**E → D → C → B → A** の優先度で常に1セットだけ表示します。  

- **目的**: マルチタイムフレームの地合い把握／上位足の整合確認
- **仕様**: overlay、plotはグローバル、`safe_sma`で0期間は `na` マスク

- Source code
  - [【pjdhiro — SMA(3)×5 v6 — Indicator by uminomae — TradingView】](https://www.tradingview.com/script/UPKOE9CU-pjdhiro-SMA-3-5-v6/)

[![SMA(3)×5 v6]({{ '/assets/images/pages/note/pine/sma5set.png' | relative_url }})]({{ '/assets/images/pages/note/pine/sma5set.png' | relative_url }})
