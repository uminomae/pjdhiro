#!/usr/bin/env sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"
TEST_FILE="$SCRIPT_DIR/py/test_plot_each_symbol.py"

PYTHON_BIN="${PYTHON:-python3}"
command -v "$PYTHON_BIN" >/dev/null 2>&1 || PYTHON_BIN=python
[ -d "$VENV_DIR" ] || "$PYTHON_BIN" -m venv "$VENV_DIR"
. "$VENV_DIR/bin/activate"
python -m pip install --upgrade pip >/dev/null
[ -f "$SCRIPT_DIR/requirements.txt" ] && pip install -q -r "$SCRIPT_DIR/requirements.txt" || pip install -q pandas matplotlib numpy

# CSV 既定
if [ -z "${TV_TREND_CSV:-}" ]; then
  if [ -f "$SCRIPT_DIR/data/all_assets_daily_sample.csv" ]; then
    export TV_TREND_CSV="$SCRIPT_DIR/data/all_assets_daily_sample.csv"
  elif [ -f "/mnt/data/all_assets_daily_sample.csv" ]; then
    export TV_TREND_CSV="/mnt/data/all_assets_daily_sample.csv"
  else
    export TV_TREND_CSV=""
  fi
fi

export TV_TREND_CURRENCY="${TV_TREND_CURRENCY:-JPY}"
export TV_TREND_LEN_SLOW="${TV_TREND_LEN_SLOW:-200}"
export TV_TREND_SLOPE_LB="${TV_TREND_SLOPE_LB:-13}"
export TV_TREND_MIN_SLOPE="${TV_TREND_MIN_SLOPE:-1}"
export TV_TREND_SHOW_SECONDS="${TV_TREND_SHOW_SECONDS:-0}"

OUTDIR="$SCRIPT_DIR/data/res"
mkdir -p "$OUTDIR"

echo "▶ Using CSV: ${TV_TREND_CSV}"
echo "▶ OutDir   : ${OUTDIR}"
echo "▶ Running  : $TEST_FILE --outdir $OUTDIR $*"
python "$TEST_FILE" --outdir "$OUTDIR" --verbose "$@"

echo "▶ ls -1 ${OUTDIR}"
ls -1 "${OUTDIR}" || true
echo "✅ Done."
