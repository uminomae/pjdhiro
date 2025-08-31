# Norm v1.0（pjdhiro Pine v6）

*最小実装・将来拡張前提のコーディング規約（norm.md）*

---

## 0) 目的・基本方針

* **分離徹底**：計算＝ライブラリ、入力/描画＝メイン。
* **YAGNI**：そのまま貼って**即コンパイル**・最小UI。
* **コメントアウトで切替**：機能はコメントアウトのみでON/OFF。
* **C++/JSフレンドリー**：明示的な型・小関数・安定I/F。

---

## 1) ファイル分割

* **library**（計算専用）

  * `export 関数()`のみ。`input/plot/fill/label/table/alertcondition`禁止。
* **indicator (main)**（入力と可視化のみ）

  * 計算は**lib呼び出しだけ**。`plot/barcolor/fill/...`はメインの**グローバル**で呼ぶ。

---

## 2) 章立て（順序固定）

1. **header**：`//@version=6` と `library()` or `indicator()`
2. **import**（メインのみ）
3. **const**：`DEF_`接頭（コンパイル時定数）
4. **input**：期間を中心に最少化
5. **calc**：ライブラリ呼び出し
6. **draw**：`plot/barcolor/fill/...`（グローバル）
7. **debug**：必要時のみ。**全行コメントアウト**で切替

---

## 3) フォーマット（インデント/改行/演算子）

* **４スペース**インデント（タブ禁止・混在禁止、**4の倍数幅は避ける**）。
* **グローバル描画は先頭に空白を置かない**（列頭開始）。
* 三項演算子を引数に渡すときは**必ず `()` で括る**。
* 改行後の閉じ括弧 `)` は行頭に置かず、直前にスペースを置いて閉じる。
* **行末コメントは禁止**。コメントは**行頭のみ**。

---

## 4) 命名規則

* **定数**：`DEF_LEN_BB`, `DEF_COL1`（UPPER\_SNAKE）。
* **入力・ローカル**：`lenBb`, `lenTrend`, `sma1`（lowerCamel）。
* **関数（lib）**：`sma()`, `bb2()`, `is_uptrend_slope()`, `entry_flags()`（lower\_snake）。
* **bool返却**は `is_*/has_*`。
* 予約語と衝突しそうな引数は末尾に **`_`**（例：`close_`）。

---

## 5) 型・宣言・多値

* **常に型を明示**（例：`float x = na`）。
* **同時宣言禁止**（`var float a=na, b=na` は不可）。
* 多値戻りは**型付きで事前宣言 → 代入**：

```pine
float l2 = na
float u2 = na
float mid = na
[l2, u2, mid] = bb.bb2(close, len)
```

---

## 6) 描画規則（メインのみ）

* `plot()/fill()/barcolor()/plotshape()/table.*()` は**グローバル**でのみ呼ぶ（関数内・`if`内禁止）。
* 表示制御は `na` や `color.new(..., transp)` を使う。
* `plotshape()` は **第1引数= `series<float>`** を渡し、`y=` は使わない。
* `table.clear()` は**範囲指定**：`table.clear(t, 0, 0, C-1, R-1)`。

---

## 7) ライブラリI/F（安定化方針）

* **値だけ返す小関数**を原則。
* 最小単位：

  * BB：`bb2(src, length) -> [lower2, upper2, basis]`
  * トレンド：`is_uptrend_slope(src, length) -> bool`
  * 複合判定：`entry_flags(...) -> [enter, enterUp, enterDown, ...]`
* 将来拡張（HTF、倍率、閾値、正規化等）は**引数追加**で後方互換を維持。
* `request.security()` は**専用lib**で隔離（HTF対応ポイント）。

---

## 8) FXユーティリティ（標準）

* **pip**：`syminfo.currency == "JPY" ? 0.01 : 0.0001`
* `pips_to_price(pips)`・`price_to_pips(priceDelta)` を共通libに置く。

---

## 9) 可視化デフォルト

* **線種固定**（色/太さ/点線は Style タブで調整）。
* ローソク着色の基本：

```pine
barcolor(cond ? DEF_HIT_COLOR : na)
```

---

## 10) VSCode運用（推奨）

* **編集**はVSCode、**貼付**はTradingView。
* libとmainを**別ファイル**管理。`import user/name/version as alias` の**版管理**を明記。
* ローカル簡易テストはダミー系列/CSVで**関数の返却値**のみ検証（描画はしない）。

---

## 11) 例外・禁止事項

* `varip` 多用禁止（必要最小限）。
* `strategy.*` は**別モジュール**（当面はインジ専用）。
* デバッグのためでも**描画を関数内に入れない**。
* 余計な入力を増やさない（YAGNI）。

---

## 12) 最小テンプレ

### 12.1 Library（例：エントリー判定コア）

```pine
//@version=6
library("pjdhiro_entry_core_v6")

// 上昇トレンド：SMA傾き>0
export is_uptrend_slope(float src, int length) =>
  int len = math.max(length, 1)
  float ma  = ta.sma(src, len)
  float prv = ta.sma(src, len)[1]
  bool up   = ma > prv
  up

// BB±2σ（SMA基準）
export bb2(float src, int length) =>
  int len   = math.max(length, 1)
  float mid = ta.sma(src, len)
  float sd  = ta.stdev(src, len)
  float up2 = mid + 2.0 * sd
  float lo2 = mid - 2.0 * sd
  [lo2, up2, mid]

// エントリー判定（上=−2σ / 下=＋2σ）
export entry_flags(float close_, float srcTrend, int lenTrend, float srcBB, int lenBB) =>
  bool up = is_uptrend_slope(srcTrend, lenTrend)
  float l2 = na
  float u2 = na
  float mid = na
  [l2, u2, mid] = bb2(srcBB, lenBB)
  bool enterUp = up and (close_ <= l2)
  bool enterDown = (not up) and (close_ >= u2)
  bool enter = enterUp or enterDown
  [enter, enterUp, enterDown, l2, u2, mid, up]
```

### 12.2 Indicator（例：色分けのみ）

```pine
//@version=6
indicator("pjdhiro — トレンド×BB 色 v6（最小）", overlay=true, shorttitle="Entry Color v6")

import uminomae/pjdhiro_entry_core_v6/1 as core

const int   DEF_LEN_TREND = 200
const int   DEF_LEN_BB    = 20
const color DEF_HIT_COLOR = color.orange

int lenTrend = input.int(DEF_LEN_TREND, "Trend SMA length", minval=1)
int lenBB    = input.int(DEF_LEN_BB,    "BB length",       minval=1)

bool enter = false
bool enterUp = false
bool enterDown = false
float bbL2 = na
float bbU2 = na
float bbMd = na
bool isUp = false
[enter, enterUp, enterDown, bbL2, bbU2, bbMd, isUp] = core.entry_flags(close, close, lenTrend, close, lenBB)

barcolor(enter ? DEF_HIT_COLOR : na)
```

---

## 13) テスト観点（チェックリスト）

* メインは**入力と描画のみ**になっている。
* ライブラリは**値だけ返す関数**のみを持つ。
* `plot/barcolor/...` が**グローバル**で呼ばれている。
* 期間入力を変えても**エラーなく**動作する。
* 条件が `true` のバーだけ**色が変わる**（回帰OK）。


## 追記
* 関数の戻り値の型は推論で。宣言しない。
  * 理由：コンパイルエラーが出るため。
* 文法に必要なインデントは4個、視認性のための改行はそれを避ける。exスペース５個にする。
* 多値戻りは、事前宣言せずに [a, b, ...] = func(...) で “=（イコール）” を使って新規定義します。
  * := は多値代入では使えません。関数本体は4スペースで字下げ、最後の行が返り値です。
  * ただしブロック外で変数が使えなくなるので、それへの配慮が必要です。tmp_を使って再代入するなど。
* 行頭のインデントは、スペース２個だとコンパイルエラーになるので使用しない。必ず４個。
* 関数の引数は必ず型を入れること。コンパイルエラーになる。
---

## 変更履歴

* **v1.1**：インデントはスペース４個
* **v1.0**：初版。分離・最小・将来拡張の骨格を定義。
