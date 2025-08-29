# Python 3.9+
# pip install pandas matplotlib numpy
# 保存先: myPj/tradingview/pine/tests/test_sma_vscode.py

from __future__ import annotations  # 型ヒントの前方参照を許可

import argparse                     # CLI引数（--csv, --len1 等）
import os                           # 環境変数やヘッドレス検出
from configparser import ConfigParser  # config.ini 読み取り
from pathlib import Path            # パス操作
import numpy as np                  # 数値計算（乱数, 畳み込み）
import pandas as pd                 # 時系列処理（Series/rolling）
import matplotlib.pyplot as plt     # グラフ描画

# ----------------------------
# Pine の命名に寄せた最小 OOP（計算だけ）
# ----------------------------
class PjdhiroMa:
    @staticmethod
    def sma(series: pd.Series, length: int) -> pd.Series:
        """series の単純移動平均（直近 length 本）。先頭 length-1 本は NaN。"""
        ln = max(int(length), 1)  # 0/負数を防止（Pineの math.max 相当）
        # min_periods=ln なので、十分な本数に達するまでは NaN
        return series.rolling(window=ln, min_periods=ln).mean()

# ----------------------------
# データ入出力ユーティリティ
# ----------------------------
def gen_random_walk(n=500, seed=42, start=100.0) -> pd.Series:
    """検証用のダミー価格（ランダムウォーク）を作る。"""
    rng = np.random.default_rng(seed)
    steps = rng.normal(loc=0.0, scale=1.0, size=n)
    arr = np.cumsum(steps) + start
    return pd.Series(arr, index=pd.RangeIndex(n), name="close")

def load_close_from_csv(path: Path, close_col="close") -> pd.Series:
    """CSV から終値列（close_col）を Series として読み込む。"""
    df = pd.read_csv(path)
    if close_col not in df.columns:
        raise ValueError(f"CSVに {close_col} 列がありません。列名: {list(df.columns)}")
    return pd.Series(df[close_col].values, name="close")

# ----------------------------
# 検証用の参照実装（畳み込み版 SMA）
# ----------------------------
def sma_conv(x: pd.Series, n: int) -> pd.Series:
    """畳み込みで算出するSMA（rolling mean と数学的に等価）。"""
    n = max(int(n), 1)
    w = np.ones(n) / n
    y = np.convolve(x.values, w, mode="valid")
    out = pd.Series(np.r_[np.full(n-1, np.nan), y], index=x.index, name=f"sma{n}")
    return out

def assert_series_allclose(a: pd.Series, b: pd.Series, rtol=1e-12, atol=1e-12):
    """2つの Series が“機械誤差内で”一致するか検証（NaN は比較除外）。"""
    assert a.index.equals(b.index), "indexが一致しません"
    av = a.to_numpy(); bv = b.to_numpy()
    mask = ~(np.isnan(av) | np.isnan(bv))
    if not np.allclose(av[mask], bv[mask], rtol=rtol, atol=atol):
        diff = np.max(np.abs(av[mask] - bv[mask]))
        raise AssertionError(f"Seriesが許容誤差内で一致しません（max diff={diff}）")

# ----------------------------
# 設定値（config.ini / 環境変数）読み込み
# 優先度：CLI > 環境変数 > config.ini > 内蔵デフォルト
# ----------------------------
def load_defaults_from_config() -> dict:
    # 探す候補（tests/直下推奨）
    candidates = [
        Path(__file__).with_name("config.ini"),
        Path(__file__).parent / "config.ini",
        Path.cwd() / "config.ini",
    ]
    defaults = {
        "csv": "",
        "close_col": "close",
        "len1": 20,
        "len2": 120,
        "len3": 200,
        "show_seconds": 1.0,  # 0なら手動クローズ
    }
    # config.ini
    for p in candidates:
        if p.exists():
            ini = ConfigParser()
            ini.read(p, encoding="utf-8")
            if ini.has_section("params"):
                sec = ini["params"]
                defaults.update({
                    "csv":          sec.get("csv", defaults["csv"]),
                    "close_col":    sec.get("close_col", defaults["close_col"]),
                    "len1":         sec.getint("len1", defaults["len1"]),
                    "len2":         sec.getint("len2", defaults["len2"]),
                    "len3":         sec.getint("len3", defaults["len3"]),
                    "show_seconds": sec.getfloat("show_seconds", defaults["show_seconds"]),
                })
            break
    # 環境変数（あれば上書き）
    defaults["csv"]          = os.getenv("TV_CSV", defaults["csv"])
    defaults["close_col"]    = os.getenv("TV_CLOSE_COL", defaults["close_col"])
    defaults["len1"]         = int(os.getenv("TV_LEN1", defaults["len1"]))
    defaults["len2"]         = int(os.getenv("TV_LEN2", defaults["len2"]))
    defaults["len3"]         = int(os.getenv("TV_LEN3", defaults["len3"]))
    defaults["show_seconds"] = float(os.getenv("TV_SHOW_SECONDS", defaults["show_seconds"]))
    return defaults

# ----------------------------
# エントリポイント
# ----------------------------
def main():
    # 1) まず config.ini / 環境変数の値を読み込み（後でCLIに流し込む）
    d = load_defaults_from_config()

    # 2) CLI定義。defaultは設定ファイルから注入（CLI指定があればそちらが優先）
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", type=str, default=d["csv"], help="Close列を含むCSV（無指定ならランダムウォーク）")
    ap.add_argument("--close-col", type=str, default=d["close_col"], help="CSVの終値列名")
    ap.add_argument("--len1", type=int, default=d["len1"])
    ap.add_argument("--len2", type=int, default=d["len2"])
    ap.add_argument("--len3", type=int, default=d["len3"])
    ap.add_argument("--show-seconds", "-s", type=float, default=d["show_seconds"],
                    help="表示→自動クローズまでの秒数。0なら手動で閉じる。")
    args = ap.parse_args()

    # 3) データ準備（CSV or ダミー価格）
    if args.csv:
        close = load_close_from_csv(Path(args.csv), args.close_col)
    else:
        close = gen_random_walk(n=800, seed=7, start=100.0)

    # 4) 計算（Pineの ma.sma と等価）
    sma1 = PjdhiroMa.sma(close, args.len1)
    sma2 = PjdhiroMa.sma(close, args.len2)
    sma3 = PjdhiroMa.sma(close, args.len3)

    # 5) 参照実装と突き合わせ（誤差許容）
    assert_series_allclose(sma1, sma_conv(close, args.len1))
    assert_series_allclose(sma2, sma_conv(close, args.len2))
    assert_series_allclose(sma3, sma_conv(close, args.len3))

    # 6) 描画
    plt.figure()
    plt.plot(close, label="close")
    plt.plot(sma1, label=f"SMA{args.len1}")
    plt.plot(sma2, label=f"SMA{args.len2}")
    plt.plot(sma3, label=f"SMA{args.len3}")
    plt.legend()
    plt.title("pjdhiro — SMA(3) local test")

    # 7) 表示モード
    if os.environ.get("HEADLESS"):
        plt.savefig("tests/data/res/sma_test.png", dpi=150)
    elif float(args.show_seconds) > 0:
        fig = plt.gcf()
        plt.show(block=False)
        plt.pause(float(args.show_seconds))
        plt.close(fig)
    else:
        plt.show()

# 直接実行されたときだけ main() を実行
if __name__ == "__main__":
    main()
