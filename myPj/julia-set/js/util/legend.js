// ─── legend.js ───
// Three.js の凡例（legend-canvas）描画・表示制御をまとめるモジュール

// 初期の最小/最大 Z 値（後からアルゴリズムで変更可能）
let legendMinZ = 0;
let legendMaxZ = 2.0;

/**
 * getCanvasContext()
 * DOM から legend-canvas 要素を取得し、そのコンテキストを返します。
 * showLegend()／hideLegend()／drawLegend() で都度呼び出すようにします。
 */
function getCanvasContext() {
  const legendCanvas = document.getElementById('legend-canvas');
  if (!legendCanvas) return null;
  const legendCtx = legendCanvas.getContext('2d');
  return { legendCanvas, legendCtx };
}

/**
 * drawLegend(minZ, maxZ)
 * legendCanvas に「青→赤」の縦グラデーションを描き、
 * 上下と中央に数値ラベルを表示する
 */
export function drawLegend(minZ = legendMinZ, maxZ = legendMaxZ) {
  const ctxInfo = getCanvasContext();
  if (!ctxInfo) return;
  const { legendCanvas, legendCtx } = ctxInfo;

  // Canvas サイズをクライアントサイズに合わせる
  const cw = legendCanvas.clientWidth;
  const ch = legendCanvas.clientHeight;
  legendCanvas.width  = cw;
  legendCanvas.height = ch;

  const margin = 10;
  const usableHeight = ch - 2 * margin;
  const steps = 100;

  // (1) 縦方向グラデーション
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const hue = 240 - 240 * t; // 240(青)→0(赤)
    legendCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    const y = margin + usableHeight * (1 - t);
    const sliceHeight = usableHeight / steps + 1;
    legendCtx.fillRect(0, y, cw, sliceHeight);
  }

  // (2) 枠線
  legendCtx.strokeStyle = '#fff';
  legendCtx.strokeRect(0, 0, cw, ch);

  // (3) 数値ラベル
  legendCtx.fillStyle = '#fff';
  legendCtx.font = '12px monospace';
  legendCtx.textAlign = 'right';
  legendCtx.textBaseline = 'middle';

  // 上端に maxZ
  legendCtx.fillText(maxZ.toFixed(2), cw - 4, margin);
  // 中央に中間値
  const midZ = (minZ + maxZ) / 2;
  legendCtx.fillText(midZ.toFixed(2), cw - 4, ch / 2);
  // 下端に minZ
  legendCtx.fillText(minZ.toFixed(2), cw - 4, ch - margin);
}

/**
 * showLegend()
 * 凡例 Canvas の表示を「block」にします
 */
export function showLegend() {
  const ctxInfo = getCanvasContext();
  if (!ctxInfo) return;
  const { legendCanvas } = ctxInfo;
  legendCanvas.style.display = 'block';
}

/**
 * hideLegend()
 * 凡例 Canvas の表示を「none」にします
 */
export function hideLegend() {
  const ctxInfo = getCanvasContext();
  if (!ctxInfo) return;
  const { legendCanvas } = ctxInfo;
  legendCanvas.style.display = 'none';
}

/**
 * toggleLegend()
 * 現在の表示状態をトグル（表示 → 非表示、 非表示 → 表示）
 */
export function toggleLegend() {
  const ctxInfo = getCanvasContext();
  if (!ctxInfo) return;
  const { legendCanvas } = ctxInfo;
  if (legendCanvas.style.display === 'none' || getComputedStyle(legendCanvas).display === 'none') {
    showLegend();
  } else {
    hideLegend();
  }
}

// 初期状態では凡例を表示＆描画
window.addEventListener('DOMContentLoaded', () => {
  // DOM が完全に読み込まれてからキャンバス取得・描画
  showLegend();
  drawLegend(legendMinZ, legendMaxZ);
});
