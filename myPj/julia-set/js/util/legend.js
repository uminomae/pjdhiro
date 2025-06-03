// ─── js/util/legend.js ───
// Three.js の凡例（legend-canvas）描画・制御をまとめたモジュール

let legendMinZ = 0;
let legendMaxZ = 2.0;

/**
 * legendCanvas と 2D コンテキストを返すヘルパー
 * Canvas または 2D コンテキストが取得できない場合は null を返す
 */
function getCanvasContext() {
  const canvas = document.getElementById('legend-canvas');
  if (!canvas) {
    console.warn('getCanvasContext: legend-canvas が見つかりません');
    return null;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('getCanvasContext: 2D コンテキストが取得できません');
    return null;
  }
  return {
    legendCanvas: canvas,
    legendCtx:    ctx
  };
}

/**
 * drawLegend(minZ, maxZ)
 *   - Canvas の「表示上の幅・高さ」（clientWidth/clientHeight）を取得
 *   - 内部バッファを「表示幅 × devicePixelRatio」に合わせてリサイズ
 *   - フォントサイズを「Canvas 幅の 20%」で設定し、グラデーション・枠線・数値ラベルを描画する
 */
export function drawLegend(minZ = legendMinZ, maxZ = legendMaxZ) {
  const info = getCanvasContext();
  if (!info) return;
  const { legendCanvas, legendCtx } = info;

  // (1) 表示上の幅・高さを取得
  const cssW = legendCanvas.clientWidth;
  const cssH = legendCanvas.clientHeight;
  if (cssW === 0 || cssH === 0) {
    // クライアント幅・高さが 0 の場合は描画を行わない
    return;
  }

  // (2) 内部バッファを「表示幅 × devicePixelRatio」に設定
  const dpr = window.devicePixelRatio || 1;
  legendCanvas.width  = Math.floor(cssW * dpr);
  legendCanvas.height = Math.floor(cssH * dpr);
  legendCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale(dpr, dpr)

  // (2.1) 既存バッファをクリア
  legendCtx.clearRect(0, 0, cssW, cssH);

  // (3) フォントサイズを「Canvas幅の 20%」で決定
  const fontSize = cssW * 0.20;
  legendCtx.font = `${fontSize}px monospace`;
  legendCtx.fillStyle = '#fff';
  legendCtx.textAlign = 'right';
  legendCtx.textBaseline = 'middle';

  // (4) 背景グラデーションを描く
  const margin = fontSize;                      // フォントサイズ分だけ上下に余白を取る
  const usableHeight = cssH - margin * 2;
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const t   = i / steps;
    const hue = 240 - 240 * t;                  // 240(青)→0(赤) の HSL
    legendCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    const y = margin + usableHeight * (1 - t);
    const sliceH = usableHeight / steps + 1;
    legendCtx.fillRect(0, y, cssW, sliceH);
  }

  // (5) 枠線を描画
  legendCtx.strokeStyle = '#fff';
  legendCtx.lineWidth = 1;
  legendCtx.strokeRect(0, 0, cssW, cssH);

  // (6) 数値ラベルを描画
  legendCtx.fillStyle = '#fff';
  // 上端に maxZ
  legendCtx.fillText(maxZ.toFixed(2), cssW - 4, margin);
  // 中央に中間値
  const midZ = (minZ + maxZ) / 2;
  legendCtx.fillText(midZ.toFixed(2), cssW - 4, cssH / 2);
  // 下端に minZ
  legendCtx.fillText(minZ.toFixed(2), cssW - 4, cssH - margin);
}

/**
 * showLegend()
 *   - Canvas を表示状態（display: block）に戻す
 */
export function showLegend() {
  const info = getCanvasContext();
  if (!info) return;
  info.legendCanvas.style.display = 'block';
}

/**
 * hideLegend()
 *   - Canvas を非表示（display: none）にする
 */
export function hideLegend() {
  const info = getCanvasContext();
  if (!info) return;
  info.legendCanvas.style.display = 'none';
}

/**
 * toggleLegend()
 *   - 表示状態と非表示状態を切り替える（display を toggle）
 */
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
