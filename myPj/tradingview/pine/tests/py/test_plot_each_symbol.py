#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, argparse
from pathlib import Path
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

BASE = Path(__file__).resolve().parents[1]   # tests/
DATA_DIR = BASE / "data"
RES_DIR = DATA_DIR / "res"

def pip_size(symbol: str) -> float:
    s = symbol.upper()
    if ("JPY" in s) or ("NIKKEI" in s):
        return 0.01
    return 0.0001

def sma(s: pd.Series, length: int) -> pd.Series:
    length = max(int(length), 1)
    return s.rolling(length, min_periods=1).mean()

def slope_pips_per_bar(s: pd.Series, lb: int, pip: float) -> pd.Series:
    lb = max(int(lb), 1)
    return (s - s.shift(lb)) / lb / pip

def slope_sign(sma_s: pd.Series, lb: int, min_slope_pips: float, pip: float) -> pd.Series:
    sppb = slope_pips_per_bar(sma_s, lb, pip)
    pos = (sppb >= min_slope_pips).astype(int)
    neg = (sppb <= -min_slope_pips).astype(int) * -1
    return pos.where(pos != 0, 0).where(neg == 0, -1)

def load_csv(csv_path: Path) -> pd.DataFrame:
    if not csv_path.exists():
        raise SystemExit(f"[ERR] CSVが見つかりません: {csv_path}")
    df = pd.read_csv(csv_path)
    need = {"date","symbol","open","high","low","close","volume"}
    miss = need - set(df.columns)
    if miss:
        raise SystemExit(f"[ERR] CSVに必要な列が不足: {miss}")
    df["timestamp"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.sort_values(["symbol","timestamp"]).reset_index(drop=True)
    return df

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", help="まとめCSVのパス（env: TV_TREND_CSV）")
    ap.add_argument("--outdir", default=str(RES_DIR), help="PNG出力先ディレクトリ")
    ap.add_argument("--symbols", nargs="*", help="絞り込み: 例 --symbols USDJPY XAUUSD")
    ap.add_argument("--verbose", action="store_true")
    args = ap.parse_args()

    # 既定CSV（env > 引数 > tests/data）
    if os.environ.get("TV_TREND_CSV"):
        csv_default = Path(os.environ["TV_TREND_CSV"])
    else:
        csv_default = DATA_DIR / "all_assets_daily_sample.csv"
    csv_path = Path(args.csv) if args.csv else csv_default

    outdir = Path(args.outdir); outdir.mkdir(parents=True, exist_ok=True)

    currency  = os.environ.get("TV_TREND_CURRENCY", "JPY").upper()
    len_slow  = int(os.environ.get("TV_TREND_LEN_SLOW", "200"))
    slope_lb  = int(os.environ.get("TV_TREND_SLOPE_LB", "13"))
    min_slope = float(os.environ.get("TV_TREND_MIN_SLOPE", "1"))

    print(f"[INFO] CSV   : {csv_path.resolve()}  (exists={csv_path.exists()})")
    print(f"[INFO] OUTDIR: {outdir.resolve()}")

    df = load_csv(csv_path)
    if args.verbose:
        print(f"[INFO] rows={len(df)} cols={list(df.columns)}")
        print(f"[INFO] symbols={sorted(df['symbol'].unique())}")

    if len(df) == 0:
        print("[WARN] CSVが空です。何も出力しません。"); return

    # 絞り込み
    if args.symbols:
        df = df[df["symbol"].isin(args.symbols)]
        if args.verbose:
            print(f"[INFO] filtered symbols={args.symbols} rows={len(df)}")

    saved = []
    for symbol, g in df.groupby("symbol"):
        g = g.copy().sort_values("timestamp")
        pip = pip_size(symbol)
        min_eff = min_slope if (currency == "JPY" or pip == 0.01) else max(min_slope * 10.0, min_slope)

        g["sma_slow"] = sma(g["close"], len_slow)
        st = slope_sign(g["sma_slow"], slope_lb, min_eff, pip)
        pulse = (st != st.shift(1).fillna(0)).astype(int)
        pulse = st.where(pulse == 1, 0)

        fig, ax = plt.subplots()
        ax.plot(g["timestamp"], g["close"], label=f"{symbol} close")
        ax.plot(g["timestamp"], g["sma_slow"], label=f"SMA{len_slow}")
        for x, v in zip(g["timestamp"], pulse):
            if v != 0:
                ax.axvline(x=x, linestyle="--", alpha=0.8)
        ax.legend()
        ax.set_title(f"{symbol} — Close & SMA{len_slow} (lb={slope_lb}, min_slope={min_eff} pips/bar)")
        fig.tight_layout()

        out_png = outdir / f"{symbol}_test_plot.png"
        fig.savefig(out_png, dpi=140, bbox_inches="tight")
        plt.close(fig)
        saved.append(str(out_png.resolve()))
        if args.verbose:
            print(f"[SAVE] {out_png.resolve()}")

    print("saved:", *saved, sep="\n")
    if not saved:
        print("[WARN] 保存ファイルが0件でした。symbols/パス/CSV内容をご確認ください。")

if __name__ == "__main__":
    main()
