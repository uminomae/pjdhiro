#!/usr/bin/env sh
set -eu

# ===== デフォルト（必要なら編集） =====
# export TV_TREND_CSV="${TV_TREND_CSV:-./tests/data/trend_sample.csv}"   # 例: ../data/sample.csv
export TV_TREND_CURRENCY="${TV_TREND_CURRENCY:-JPY}"            # JPY or OTHER
export TV_TREND_LEN_SLOW="${TV_TREND_LEN_SLOW:-200}"
export TV_TREND_SLOPE_LB="${TV_TREND_SLOPE_LB:-5}"
export TV_TREND_MIN_SLOPE=1         # pips/bar
# export TV_TREND_MIN_SLOPE="${TV_TREND_MIN_SLOPE:-0.10}"         # pips/bar
export TV_TREND_SHOW_SECONDS=5    # 0で手動クローズ
# export TV_TREND_SHOW_SECONDS="${TV_TREND_SHOW_SECONDS:-2.0}"    # 0で手動クローズ
# =====================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"
TEST_FILE="$SCRIPT_DIR/tests/test_plot_each_symbol.py"
# TEST_FILE="$SCRIPT_DIR/tests/test_trend_vscode.py"

PYTHON_BIN="${PYTHON:-python3}"
command -v "$PYTHON_BIN" >/dev/null 2>&1 || PYTHON_BIN=python

if [ ! -f "$TEST_FILE" ]; then
  echo "❌ テストスクリプトが見つかりません: $TEST_FILE"
  exit 1
fi

if [ ! -d "$VENV_DIR" ]; then
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi

. "$VENV_DIR/bin/activate"
python -m pip install --upgrade pip >/dev/null
pip install -q pandas matplotlib numpy configparser

echo "▶ Running: $TEST_FILE $*"
python "$TEST_FILE" "$@"
