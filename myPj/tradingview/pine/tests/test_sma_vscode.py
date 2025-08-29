# Python 3.9+
# pip install pandas matplotlib numpy
# myPj/tradingview/pine/tests/test_sma_vscode.py

from __future__ import annotations
import argparse
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

# ----------------------------
# Pineの命名に寄せた最小OOP
# ----------------------------
class PjdhiroMa:
    @staticmethod
    def sma(series: pd.Series, length: int) -> pd.Series:
        ln = max(int(length), 1)
        return series.rolling(window=ln, min_periods=ln).mean()

def gen_random_walk(n=500, seed=42, start=100.0) -> pd.Series:
    rng = np.random.default_rng(seed)
    steps = rng.normal(loc=0.0, scale=1.0, size=n)
    arr = np.cumsum(steps) + start
    idx = pd.RangeIndex(n)
    return pd.Series(arr, index=idx, name="close")

def load_close_from_csv(path: Path, close_col="close") -> pd.Series:
    df = pd.read_csv(path)
    if close_col not in df.columns:
        raise ValueError(f"CSVに {close_col} 列がありません。列名: {list(df.columns)}")
    s = pd.Series(df[close_col].values, name="close")
    return s

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", type=str, default="", help="Close列を含むCSV（無指定ならランダムウォーク）")
    ap.add_argument("--close-col", type=str, default="close", help="CSVの終値列名")
    ap.add_argument("--len1", type=int, default=20)
    ap.add_argument("--len2", type=int, default=130)
    ap.add_argument("--len3", type=int, default=200)
    args = ap.parse_args()

    if args.csv:
        close = load_close_from_csv(Path(args.csv), args.close_col)
    else:
        close = gen_random_walk(n=800, seed=7, start=100.0)

    sma1 = PjdhiroMa.sma(close, args.len1)
    sma2 = PjdhiroMa.sma(close, args.len2)
    sma3 = PjdhiroMa.sma(close, args.len3)

     # --- 検証: 異なる実装（畳み込み）と一致するかをチェック（許容誤差） ---
    def sma_conv(x: pd.Series, n: int) -> pd.Series:
        n = max(int(n), 1)
        w = np.ones(n) / n
        y = np.convolve(x.values, w, mode="valid")
        out = pd.Series(np.r_[np.full(n-1, np.nan), y], index=x.index, name=f"sma{n}")
        return out

    def assert_series_allclose(a: pd.Series, b: pd.Series, rtol=1e-12, atol=1e-12):
        # 同じ長さ・同じインデックス
        assert a.index.equals(b.index), "indexが一致しません"
        av = a.to_numpy()
        bv = b.to_numpy()
        mask = ~(np.isnan(av) | np.isnan(bv))
        if not np.allclose(av[mask], bv[mask], rtol=rtol, atol=atol):
            diff = np.max(np.abs(av[mask] - bv[mask]))
            raise AssertionError(f"Seriesが許容誤差内で一致しません（max diff={diff}）")

    assert_series_allclose(sma1, sma_conv(close, args.len1))
    assert_series_allclose(sma2, sma_conv(close, args.len2))
    assert_series_allclose(sma3, sma_conv(close, args.len3))

    # --- プロット ---
    plt.figure()
    plt.plot(close, label="close")
    plt.plot(sma1, label=f"SMA{args.len1}")
    plt.plot(sma2, label=f"SMA{args.len2}")
    plt.plot(sma3, label=f"SMA{args.len3}")
    plt.legend()
    plt.title("pjdhiro — SMA(3) local test")
    plt.show()

if __name__ == "__main__":
    main()
