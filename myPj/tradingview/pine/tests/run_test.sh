#!/usr/bin/env sh
set -eu

# ===== 好みのデフォルト（必要なら編集） =====
export TV_CSV="./tests/data/sample.csv"                # 例: ../data/sample.csv
# export TV_CLOSE_COL="close"
# export TV_LEN1=20
# export TV_LEN2=130
# export TV_LEN3=200
export TV_SHOW_SECONDS=2.0
# =============================================



# このスクリプトのディレクトリ（= pine）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# venv は pine/.venv に作成
VENV_DIR="$SCRIPT_DIR/.venv"

# テストスクリプトは pine/tests/ に置く
TEST_FILE="$SCRIPT_DIR/tests/test_sma_vscode.py"

# Python 実行ファイル（環境変数 PYTHON=python3.11 などで上書き可）
PYTHON_BIN="${PYTHON:-python3}"
command -v "$PYTHON_BIN" >/dev/null 2>&1 || PYTHON_BIN=python

# 存在チェック
if [ ! -f "$TEST_FILE" ]; then
  echo "❌ テストスクリプトが見つかりません: $TEST_FILE"
  echo "   例) myPj/tradingview/pine/tests/test_sma_vscode.py に配置してください。"
  exit 1
fi

# venv 作成
if [ ! -d "$VENV_DIR" ]; then
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi

# venv 有効化（POSIX sh）
. "$VENV_DIR/bin/activate"

# 依存インストール（静かめ）
python -m pip install --upgrade pip >/dev/null
pip install -q pandas matplotlib numpy

echo "▶ Running: $TEST_FILE $*"
python "$TEST_FILE" "$@"
