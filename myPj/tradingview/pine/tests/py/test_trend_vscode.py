import argparse, os, sys, configparser
import numpy as np, pandas as pd, matplotlib.pyplot as plt
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))
from trend_core import sma, slope_sign, TrendConfig

def read_config(cfg_path: Path) -> dict:
    # 既定値（ファイルが無くてもこれで動く）
    d = {
        "csv": "",
        "close_col": "close",
        "currency": "JPY",
        "len_slow": 200,
        "slope_lb": 13,
        "min_slope": 1,   # JPY基準。OTHERは桁を上げる
        "show_seconds": 10.0,
    }
    cfg = configparser.ConfigParser()
    if cfg_path.exists():
        cfg.read(cfg_path)

        # [trend] があれば上書き
        if cfg.has_section("trend"):
            s = cfg["trend"]
            d["csv"]         = s.get("csv", d["csv"]).strip()
            d["close_col"]   = s.get("close_col", d["close_col"]).strip()
            d["currency"]    = s.get("currency", d["currency"]).strip()
            if s.get("len_slow", "").strip():
                d["len_slow"] = s.getint("len_slow")
            if s.get("slope_lb", "").strip():
                d["slope_lb"] = s.getint("slope_lb")
            if s.get("min_slope", "").strip():
                d["min_slope"] = s.getfloat("min_slope")
            if s.get("show_seconds", "").strip():
                d["show_seconds"] = s.getfloat("show_seconds")

        # 互換用 [params] があれば必要な分だけ上書き
        if cfg.has_section("params"):
            s = cfg["params"]
            d["csv"]       = s.get("csv", d["csv"]).strip() or d["csv"]
            d["close_col"] = s.get("close_col", d["close_col"]).strip() or d["close_col"]
            if s.get("show_seconds", "").strip():
                d["show_seconds"] = s.getfloat("show_seconds")

    return d


def make_demo(n=800, seed=42):
    rng = np.random.default_rng(seed); t=np.arange(n)
    close = 100 + 3*np.sin(t/50.0) + rng.normal(0,0.25,size=n)
    ts = pd.date_range("2024-01-01", periods=n, freq="H")
    return pd.DataFrame({"close": close}, index=ts)

def load_csv(path: Path, close_col: str):
    df = pd.read_csv(path)
    if "timestamp" not in {c.lower(): c for c in df.columns}: raise SystemExit("CSVに timestamp 列が必要です")
    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True, errors="coerce")
    df = df.set_index("timestamp").sort_index()
    if close_col not in df.columns: raise SystemExit(f"CSVに {close_col} 列が必要です")
    return df

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="config_trend.ini")
    ap.add_argument("--csv"); ap.add_argument("--demo", action="store_true")
    ap.add_argument("--currency", choices=["JPY","OTHER"])
    ap.add_argument("--len-slow", type=int); ap.add_argument("--slope-lb", type=int)
    ap.add_argument("--min-slope", type=float); ap.add_argument("--close-col")
    ap.add_argument("--show-seconds", type=float)
    args = ap.parse_args()

    base = Path(__file__).resolve().parents[1]; d = read_config(base/args.config)
    csv_path = args.csv or os.environ.get("TV_TREND_CSV","").strip() or d["csv"]
    currency = args.currency or os.environ.get("TV_TREND_CURRENCY","").strip() or d["currency"]
    len_slow = args.len_slow or int(os.environ.get("TV_TREND_LEN_SLOW", d["len_slow"]))
    slope_lb = args.slope_lb or int(os.environ.get("TV_TREND_SLOPE_LB", d["slope_lb"]))
    min_slope= args.min_slope or float(os.environ.get("TV_TREND_MIN_SLOPE", d["min_slope"]))
    close_col= args.close_col or d["close_col"]
    show_sec = args.show_seconds or float(os.environ.get("TV_TREND_SHOW_SECONDS", d["show_seconds"]))

    df = make_demo() if args.demo or not csv_path else load_csv(Path(csv_path), close_col)
    df["sma_slow"] = sma(df[close_col], len_slow)
    state_now = slope_sign(df["sma_slow"], slope_lb, min_slope, currency)        # +1/0/-1
    state_prev= state_now.shift(1).fillna(0).astype("int64")
    pulse = pd.Series(np.where(state_now != state_prev, state_now, 0), index=state_now.index, dtype="int64")

    print(pd.DataFrame({"close": df[close_col].round(5), "sma_slow": df["sma_slow"].round(5),
                        "state": state_now, "pulse": pulse}).tail(20).to_string())
    print(f"\n--- Stats ---\nbars={len(df)} flips={(pulse!=0).sum()} last_state={int(state_now.iloc[-1])}")

    fig, ax = plt.subplots()
    ax.plot(df.index, df[close_col], label="close")
    ax.plot(df.index, df["sma_slow"], label=f"SMA{len_slow}")
    for x in df.index[pulse != 0]:
        ax.axvline(x=x, linestyle="--", alpha=0.8)
    ax.legend()
    if show_sec and show_sec>0: plt.show(block=False); plt.pause(show_sec); plt.close()
    else: plt.show()

if __name__ == "__main__": main()
