# trend_core.py
# Pine版 pjdhiro_trend_core_v6_001 と同ロジック（計算のみ）
from __future__ import annotations
import numpy as np
import pandas as pd
from dataclasses import dataclass

@dataclass(frozen=True)
class TrendConfig:
    len_slow: int = 200
    slope_lb: int = 5
    min_slope_pips_per_bar: float = 0.10
    currency: str = "JPY"  # "JPY" or "OTHER"

def pip_value(currency: str) -> float:
    return 0.01 if str(currency).upper() == "JPY" else 0.0001

def pips_to_price(pips: float, currency: str) -> float:
    return pips * pip_value(currency)

def price_to_pips(price_delta: pd.Series | float, currency: str) -> pd.Series | float:
    return price_delta / pip_value(currency)

def sma(series: pd.Series, length: int) -> pd.Series:
    length = max(int(length), 1)
    return series.rolling(length, min_periods=1).mean()

def slope_pips_per_bar(series: pd.Series, lookback: int, currency: str) -> pd.Series:
    lb = max(int(lookback), 1)
    delta = series - series.shift(lb)
    s = price_to_pips(delta, currency) / lb
    return s

def slope_sign(series: pd.Series, lookback: int, min_pips_per_bar: float, currency: str) -> pd.Series:
    s = slope_pips_per_bar(series, lookback, currency)
    out = np.where(s.abs() >= min_pips_per_bar, np.where(s > 0, 1, -1), 0)
    out = pd.Series(out, index=series.index, dtype="int64")
    out[s.isna()] = 0
    return out

def trend_state(close: pd.Series, sma_slow: pd.Series, slope_lb: int, min_slope_pb: float, currency: str) -> pd.Series:
    slope = slope_sign(sma_slow, slope_lb, min_slope_pb, currency)
    pos = (close - sma_slow)
    pos = np.where(pos > 0, 1, np.where(pos < 0, -1, 0))
    pos = pd.Series(pos, index=close.index, dtype="int64")
    st = np.where((slope == 1) & (pos == 1), 1, np.where((slope == -1) & (pos == -1), -1, 0))
    return pd.Series(st, index=close.index, dtype="int64")

def pulse_from_states(state_now: pd.Series, state_prev: pd.Series) -> pd.Series:
    p = np.where(state_now != state_prev, state_now, 0)
    return pd.Series(p, index=state_now.index, dtype="int64")
