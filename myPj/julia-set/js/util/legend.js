// ─── legend.js ───
// Three.js の凡例（legend-canvas）描画・表示制御をまとめるモジュール

let legendMinZ = 0;
let legendMaxZ = 2.0;

function getCanvasContext() {
  const canvas = document.getElementById('legend-canvas');
  if (!canvas) return null;
  return {
    legendCanvas: canvas,
    legendCtx:    canvas.getContext('2d')
  };
}

/**
 * drawLegend(minZ, maxZ)
 * 1) Canvas の「見かけサイズ」（CSS で指定された幅・高さ）を取得
 * 2) 内部バッファを devicePixelRatio に合わせて設定
 * 3) フォントサイズを「Canvas幅の10%」などで計算し、ctx.font にセット
 * 4) グラデーション → 枠線 → 数値ラベルを描画
 */
export function drawLegend(minZ = legendMinZ, maxZ = legendMaxZ) {
  const info = getCanvasContext();
  if (!info) return;
  const { legendCanvas, legendCtx } = info;

  // ─── (1) CSSで指定された見かけ幅・高さを取得 ───
  const cssW = legendCanvas.clientWidth;
  const cssH = legendCanvas.clientHeight;

  // ─── (2) 内部バッファを「見かけサイズ × devicePixelRatio」で設定 ───
  const dpr = window.devicePixelRatio || 1;
  legendCanvas.width  = Math.floor(cssW * dpr);
  legendCanvas.height = Math.floor(cssH * dpr);
  legendCtx.scale(dpr, dpr);

  // ─── (3) フォントサイズを「Canvas幅の10%」で決定 ───
  //      例: Canvas 幅が 100px → 文字サイズ = 10px
  const fontSize = cssW * 0.20;
  legendCtx.font = `${fontSize}px monospace`;
  legendCtx.fillStyle = '#fff';
  legendCtx.textAlign = 'right';
  legendCtx.textBaseline = 'middle';

  // ─── (4) 背景グラデーションを描く ───
  const margin = fontSize;                // 文字サイズ分だけ上下に余白を取る
  const usableHeight = cssH - margin * 2;
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const t   = i / steps;
    const hue = 240 - 240 * t;            // 240(青)→0(赤)
    legendCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    const y = margin + usableHeight * (1 - t);
    const sliceH = usableHeight / steps + 1;
    legendCtx.fillRect(0, y, cssW, sliceH);
  }

  // ─── (5) 枠線 ───
  legendCtx.strokeStyle = '#fff';
  legendCtx.lineWidth = 1;
  legendCtx.strokeRect(0, 0, cssW, cssH);

  // ─── (6) 数値ラベルを描画 ───
  legendCtx.fillStyle = '#fff';
  // 上端に maxZ
  legendCtx.fillText(maxZ.toFixed(2), cssW - 4, margin);
  // 中央に中間値
  const midZ = (minZ + maxZ) / 2;
  legendCtx.fillText(midZ.toFixed(2), cssW - 4, cssH / 2);
  // 下端に minZ
  legendCtx.fillText(minZ.toFixed(2), cssW - 4, cssH - margin);
}

export function showLegend() {
  const info = getCanvasContext();
  if (!info) return;
  info.legendCanvas.style.display = 'block';
}

export function hideLegend() {
  const info = getCanvasContext();
  if (!info) return;
  info.legendCanvas.style.display = 'none';
}

export function toggleLegend() {
  const info = getCanvasContext();
  if (!info) return;
  const canvas = info.legendCanvas;
  if (getComputedStyle(canvas).display === 'none') {
    canvas.style.display = 'block';
  } else {
    canvas.style.display = 'none';
  }
}

// ページ読み込み時に初期描画
window.addEventListener('DOMContentLoaded', () => {
  showLegend();
  drawLegend(legendMinZ, legendMaxZ);
});

// ウィンドウリサイズ時にも文字サイズを再計算して描画し直す
window.addEventListener('resize', () => {
  drawLegend(legendMinZ, legendMaxZ);
});
