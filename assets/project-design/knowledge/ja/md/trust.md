# 信頼とは — 調査ノート

本稿は「信頼」の定義・多層構造・日英翻訳ズレをめぐる学術文献を LLM（Claude / GPT）で横断調査し、pjdhiro が構成・検証した調査ノートです。pjdhiro 独自の理論ではなく、一般に参照できる文献群の整理です。

---

## 要約

「信頼」は単一概念ではなく複合概念である。分野ごとに感情、態度、期待、関係の性質、制度的資本、行動戦略、認識論的条件、経験構造として扱われる。共通核は「脆弱性」「期待」「依存」「予測不能性」「監視の限界」「修復可能性」にある。日英間では trust / confidence / reliance / faith の区別が日本語の「信頼」「信用」「安心」に一対一対応しないズレがある。

## 「信頼」の多層定義

| 層 | 信頼を何として扱うか | 代表分野 | 英語対応 |
|---|---|---|---|
| 感情 | 安心・好意・身体的弛緩を伴う情動的結合 | 臨床心理学、愛着理論 | affective trust |
| 期待 | 相手が善意・能力をもって行動するという見込み | 社会心理学、組織論 | expectation, belief |
| 関係の性質 | 相互行為に埋め込まれた安定性・安全感 | 社会学、人類学 | relational trust |
| 制度的資本 | 社会秩序・複雑性縮減を支える装置 | 社会学、政治学 | institutional trust |
| 行動戦略 | 不確実性下で相手に資源を委ねる選択 | 経済学、神経経済学 | trust behavior |
| 認識論的条件 | 他者の証言・情報を受容可能にする前提 | 哲学、臨床 | epistemic trust |
| 技術較正 | 自動化・AI への依存度を調整する心理状態 | HCI、AI研究 | calibrated trust |
| 経験構造 | 「警戒がほどける」「身を預けられる」lived experience | 神経現象学 | lived trust |

## 日英翻訳ズレ

| 英語 | 主な日本語対応 | ズレのポイント |
|---|---|---|
| trust | 信頼 | 最も広義。態度・期待・関係を含む |
| confidence | 信頼、確信 | Luhmann: confidence = 代替なき依存、trust = リスクを意識した委託 |
| reliance | 依拠、依存 | 哲学: trust は reliance + 裏切り可能性への認識 |
| faith | 信仰、信念 | 証拠を超えた確信 |
| trustworthiness | 信頼に値すること | trustee 側の性質。trust(trustor側)と混同されやすい |
| distrust | 不信 | trust の単なる欠如ではなく、積極的な否定的期待 |
| 信用 (JP) | credit, reliability | 実績・能力に基づく評価 |
| 安心 (JP) | assurance, security | 山岸: 制度的保証による不確実性の除去。trust とは別概念 |

山岸(1998)の核心的区別: **安心** は制度や監視により裏切りが不可能な状態。**信頼** は裏切りの可能性がある中で相手の善意を期待すること。

## 分野別定義

| 分野 | 信頼を何として | 代表理論 |
|---|---|---|
| 社会心理学 | 態度・期待 | Rotter の一般化期待、認知/情動的信頼の区別 |
| 発達心理学 | 発達課題・学習 | Erikson の basic trust、選択的信頼研究 |
| 臨床心理学 | 安全感・修復可能性 | 裏切りトラウマ、epistemic trust |
| 神経科学 | 行動選択・神経計算 | trust game パラダイム、報酬学習モデル |
| 愛着理論 | 関係的安全感 | Bowlby の内的作業モデル |
| 社会学 | 関係資源・制度条件 | Luhmann、Simmel、社会資本論 |
| 経済学 | 行動戦略・選択 | Berg et al. trust game |
| 哲学 | 規範的態度・脆弱性受容 | Baier の vulnerability account |
| 組織論 | 態度・関係資本 | Mayer et al. ABI モデル |
| HCI・AI | 較正された依存 | Lee & See、Hoff & Bashir の三層モデル |
| 神経現象学 | 経験構造・身体過程 | Varela、Petitmengin の micro-phenomenology |

## 近接概念の区別

| 概念ペア | 区別の要点 |
|---|---|
| trust vs confidence | confidence は代替なき依存、trust はリスクを意識した能動的委託（Luhmann） |
| trust vs reliance | reliance は機能的依存。trust は善意への期待と裏切り可能性を含む |
| trust vs trustworthiness | trust は trustor 側の態度。trustworthiness は trustee 側の性質 |
| trust vs distrust | distrust は積極的な否定的期待。同一関係内で併存しうる |

## 主要論争

1. **感情か、信念か、期待か、関係か** — 信頼の存在論的カテゴリーは分野により異なる。「どの水準の現象を問うか」を先に確定すべき
2. **信頼とリスク** — 多くの分野で不確実性・vulnerability を前提とするが、その意味は分野で異なる
3. **信頼と脆弱性** — Baier(1986)以降、信頼を vulnerability から切り離せないとする議論は強い
4. **信頼と裏切り・修復** — 裏切りは trust 特有の損傷であり、mere reliance の失敗とは質的に異なる
5. **trust と distrust の関係** — distrust は trust のゼロ点ではない。low trust = 病理とは限らない
6. **trust と trustworthiness の非対称性** — 多くの測定上の混乱はこの混同から生じる
7. **人間への信頼と AI への信頼** — 完全同一でも完全別物でもなく、部分重複モデルが妥当

## 領域横断の整理軸

| 整理軸 | 内容 |
|---|---|
| 信頼を何として扱うか | 感情、態度、期待、関係、社会規範、制度的資本、合理的賭け、認識論的開放性、経験構造は互いに置換不可 |
| 水準 | 個人内 / 対人 / 一般化 / 制度的 / 政治的 / 認識論的 / 技術的 / 自己信頼 |
| 時間性 | 瞬間的状態 / 安定した特性 / 関係史による厚み / 反復相互作用による更新 |
| 負の概念との関係 | distrust、mistrust、cynicism は trust の単純な反転ではない |

---

## 出典一覧

本稿は二次文献中心の調査に基づく。一次資料への遡及は今後の課題。

- Mayer, R. C., Davis, J. H., & Schoorman, F. D. (1995). "An Integrative Model of Organizational Trust." *AMR*, 20(3).
- Berg, J., Dickhaut, J., & McCabe, K. (1995). "Trust, Reciprocity, and Social History." *Games and Economic Behavior*, 10(1).
- Rousseau, D. M. et al. (1998). "Not So Different After All." *AMR*, 23(3).
- Lee, J. D., & See, K. A. (2004). "Trust in automation." *Human Factors*, 46(1).
- Baier, A. (1986). "Trust and Antitrust." *Ethics*, 96(2).
- Luhmann, N. (1979). *Trust and Power*. Wiley.
- 山岸俊男 (1998).『信頼の構造』東京大学出版会.
- Stanford Encyclopedia of Philosophy, "Trust."
- Hardin, R. (2002). *Trust and Trustworthiness*. Russell Sage Foundation.
- Schilke, O., Reimann, M., & Cook, K. S. (2021). "Trust in Social Relations." *Annual Review of Sociology*, 47.
- Lewicki, R. J. et al. (1998). "Trust and Distrust." *AMR*, 23(3).
- Glikson, E., & Woolley, A. W. (2020). "Human Trust in Artificial Intelligence." *Academy of Management Annals*, 14(2).

---

*調査・構成: pjdhiro + Claude / GPT（2026-03）*
