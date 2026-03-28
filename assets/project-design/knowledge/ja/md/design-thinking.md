# デザイン思考とは — 調査ノート

本稿は「デザイン思考」の定義・系譜・形骸化をめぐる学術文献を LLM（Claude / GPT）で横断調査し、pjdhiro が構成・検証した調査ノートです。pjdhiro 独自の理論ではなく、一般に参照できる文献群の整理です。

---

## 要約

デザイン思考は単一の方法論ではなく、少なくとも3つの層が混在している（Johansson-Sköldberg et al. 2013）。核心は abduction・framing・問題設定の往還にあり、5段階プロセスは導入用の recipe であって本質ではない。論理的思考の対立物ではなく、deduction・induction を補う仮説形成と問題再定義の実践として理解するのが最も正確である。

## デザイン思考の3層

Johansson-Sköldberg et al. 2013 の区分に基づく。

| 層 | 内容 | 代表的論者 | 時期 |
|---|---|---|---|
| Designerly thinking | 設計者の認知・実践・探究様式の研究。独自の知の領域としての設計 | Cross, Schön, Lawson, Rowe | 1970s-1990s |
| Stanford-IDEO method | Visual thinking, needfinding, prototyping を教育可能な方法として体系化 | McKim, Faste, Kelley, Brown | 1960s-2000s |
| Business design thinking | 組織導入用のイノベーション手法パッケージ | Brown (HBR), Martin, d.school Bootleg | 2000s- |

## 系譜

| 年代 | 人物/出来事 | 貢献 |
|---|---|---|
| 1969 | Simon, *The Sciences of the Artificial* | 設計を人工物の合理的探究として一般化 |
| 1972 | McKim, visual thinking (Stanford) | 視覚化・スケッチ・試作を認知技法として教育に導入 |
| 1973 | Rittel & Webber | wicked problems 概念の提示 |
| 1979 | Lawson | 設計者の solution-focused strategy を実験で示す |
| 1982 | Cross, "Designerly Ways of Knowing" | design を「第三の教育領域」として措定 |
| 1983 | Schön, *The Reflective Practitioner* | reflection-in-action と状況との対話 |
| 1987 | Rowe, *Design Thinking* | 設計過程を inquiry structure として体系化 |
| 1992 | Buchanan | wicked problems を design thinking に接続 |
| 1984-2003 | Faste (Stanford) | ambidextrous thinking、d.school への橋渡し |
| 1991/2005 | Kelley / IDEO / d.school | human-centered design を teachable method として再編 |
| 2006 | Dunne & Martin, Rotman | abductive reasoning を経営教育に翻訳 |
| 2008 | Brown, HBR "Design Thinking" | 経営層向けに「thinking like a designer」として提示 |
| 2011 | Dorst | design thinking の核心を framing / frame creation に求める |
| 2011 | Kimbell | generalized DT への批判。situated practices への転換を提唱 |
| 2013 | Johansson-Sköldberg et al. | designerly thinking と management DT を分節 |
| 2020s | d.school の自己批判 | process から abilities への転換 |

## 用語の区別

| 用語 | 定義 | 注意点 |
|---|---|---|
| Design thinking | 文脈により意味がずれる。狭義は設計者の思考様式の研究、広義は人間中心のイノベーション手法 | 3層を区別しないと混線する |
| Designerly ways of knowing | design を独自の知の様式として捉える概念（Cross 1982） | 実務パッケージではなく設計の認識論 |
| Human-centered design | 人への深い共感から始まり、ニーズに合わせて解をつくる創造的アプローチ | design thinking の一部であり全体ではない |
| Abduction | 説明仮説を形成する推論操作（Peirce） | design における abduction は科学の仮説生成と完全には同一でない |
| Framing | 枠組み自体をつくり直す操作（Dorst 2011） | design 実践に特有の再定義操作 |
| Reflection-in-action | 状況の最中での省察と実験（Schön 1983） | 直感の礼賛ではなく反省的実践の記述 |

## 論理的思考との関係

| 推論形式 | 方向 | デザイン思考との関係 |
|---|---|---|
| Deduction（演繹） | 既知ルール → 個別結論 | 技術要件定義・整合性検証に使用 |
| Induction（帰納） | 個別事例 → 一般化 | ユーザーテスト・観察データによる仮説更新 |
| Abduction | 驚き・違和感 → 説明仮説 | design thinking の中核 |
| Design framing | 状況 → 枠組みの再構成 | abduction を拡張した設計固有の実践 |

デザイン思考は論理的思考の対立物ではなく補完物である。対抗していたのは「分析だけで足りる」という狭い合理主義であって、論理そのものではない。

## 形骸化の6パターン

| # | パターン | 何が失われるか |
|---|---|---|
| 1 | 5段階プロセスへの矮小化 | framing の往復、問題の組み替え |
| 2 | 共感ワークショップ化 | 深い needfinding、長期観察 |
| 3 | ポストイット・ブレスト化 | 判断、統合、framing の質 |
| 4 | 実装との断絶 | 運用・評価・組織変革 |
| 5 | Innovation theater | 権限配分、KPI、意思決定構造の変更 |
| 6 | 評価不能な万能語化 | 概念の境界、成功/失敗条件 |

## 有効核と失われた本質

| 有効核（残る） | 失われた本質（形骸化で消える） |
|---|---|
| 問題再定義: 何を問題とみなすかを組み替える | 素材との対話: スケッチ・模型・状況の back-talk から学ぶ |
| 仮説形成: まだ存在しないが望ましいものの生成的仮説 | 知覚訓練: visual thinking、身体的外化 |
| 試作による学習: プロトタイプを知識生成の実験装置として使う | 長期的判断力: 文脈依存の situated judgment |

## 主要論争

1. **方法か、能力か、態度か** — d.school は process から abilities への転換を提唱。Kimbell は3つの語られ方を整理（2011）
2. **Abduction と framing は同一か** — Dorst は framing を abduction の設計的拡張として位置づけるが、framing は価値判断・外化を含むため Peirce 的 abduction より広い
3. **形骸化は本質的欠陥か、普及過程の歪みか** — designerly thinking と management DT の分断（Johansson-Sköldberg et al.）。パッケージ化は教育・普及に不可避な側面もある
4. **HCD は全体か一部か** — IDEO は HCD を design thinking の一部と整理するが、流通版では HCD = DT として消費されやすい
5. **Wicked problems の射程** — 元来は社会計画論（Rittel & Webber）。あらゆる設計問題が wicked であるわけではない

---

## 出典一覧

本稿は二次文献中心の調査に基づく。原著本文の全文確認は限定的であり、抄録・公式紹介文・準一次資料に依拠している箇所がある。

### 一次資料・準一次資料

- Simon, Herbert A. *The Sciences of the Artificial*. MIT Press, 1969/1996.
- Lawson, Bryan. "Cognitive Strategies in Architectural Design." *Ergonomics*, 1979.
- Cross, Nigel. "Designerly Ways of Knowing." *Design Studies*, 1982.
- Schön, Donald A. *The Reflective Practitioner*. Basic Books, 1983.
- Rowe, Peter G. *Design Thinking*. MIT Press, 1987.
- Rittel, Horst W. J. and Melvin M. Webber. "Dilemmas in a General Theory of Planning." *Policy Sciences*, 1973.
- Buchanan, Richard. "Wicked Problems in Design Thinking." *Design Issues*, 1992.
- Brown, Tim. "Design Thinking." *Harvard Business Review*, 2008.
- Dunne, David and Roger Martin. "Design Thinking and How It Will Change Management Education." *Academy of Management Learning & Education*, 2006.
- Dorst, Kees. "The Core of 'Design Thinking' and its Application." *Design Studies*, 2011.

### 学術レビュー・批判的整理

- Kimbell, Lucy. "Rethinking Design Thinking: Part I." *Design and Culture*, 2011.
- Johansson-Sköldberg, Ulla, Jill Woodilla, and Mehves Cetinkaya. "Design Thinking: Past, Present and Possible Futures." *Creativity and Innovation Management*, 2013.
- Elsbach, Kimberly D. and Ileana Stigliani. "Design Thinking and Organizational Culture." *Journal of Management*, 2018.
- Blank, Steve. "Why Companies Do 'Innovation Theater' Instead of Actual Innovation." *Harvard Business Review*, 2019.

### その他

- "Peirce on Abduction." *Stanford Encyclopedia of Philosophy*.
- Stanford d.school. "Founding Principles."
- IDEO. "Did IDEO invent design thinking?"

---

*調査・構成: pjdhiro + Claude / GPT（2026-03）*
