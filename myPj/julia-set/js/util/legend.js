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
 * 上下と中央に CSS 指定されたフォントサイズで数値ラベルを表示します。
 */
export function drawLegend(minZ = legendMinZ, maxZ = legendMaxZ) {
  const ctxInfo = getCanvasContext();
  if (!ctxInfo) return;
  const { legendCanvas, legendCtx } = ctxInfo;

  // (1) Canvas の表示サイズ（CSS で指定された width/height）を取得
  const cw = legendCanvas.clientWidth;
  const ch = legendCanvas.clientHeight;

  // (2) DPI (devicePixelRatio) を考慮して内部解像度を合わせる
  const dpr = window.devicePixelRatio || 1;
  legendCanvas.width  = cw * dpr;
  legendCanvas.height = ch * dpr;
  // scale しておかないと描画がぼやける
  legendCtx.scale(dpr, dpr);

  // (3) CSS で指定されているフォントサイズを取得
  //    getComputedStyle() で "16px" のような文字列が返ってくる
  const computedStyle = window.getComputedStyle(legendCanvas);
  const fontSizeCSS = computedStyle.getPropertyValue('font-size'); // 例: "10px" や "1.2vw" など
  // ここで「px 以外の単位（vw など）が返ってくる場合」はブラウザが自動でピクセルに変換した値を返す
  // → たとえば font-size:0.8vw; なら、ビューポート幅が 1000px のとき "8px" として取得できる
  //    したがって、これをそのまま ctx.font に流し込めば OK
  const fontSizePx = fontSizeCSS.trim(); // 文字列ごと "8px" の形式

  // (4) グラデーションを描画
  const margin = 10; // 上下の余白
  const usableHeight = ch - 2 * margin;
  const steps = 100;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const hue = 240 - 240 * t; // 240(青)→0(赤)
    legendCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    const y = margin + usableHeight * (1 - t);
    // "sliceHeight" をやや大きめにすると隙間ができにくい
    const sliceHeight = usableHeight / steps + 1;
    legendCtx.fillRect(0, y, cw, sliceHeight);
  }

  // (5) 枠線
  legendCtx.strokeStyle = '#fff';
  legendCtx.lineWidth = 1;
  legendCtx.strokeRect(0, 0, cw, ch);

  // (6) 数値ラベル描画
  legendCtx.fillStyle = '#fff';
  // CSS で取得したフォントサイズ文字列（"8px" など）をそのまま利用
  legendCtx.font = `${fontSizePx} monospace`;
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
  const style = window.getComputedStyle(legendCanvas);
  if (style.display === 'none') {
    showLegend();
  } else {
    hideLegend();
  }
}

// 初期状態では凡例を表示＆描画
window.addEventListener('DOMContentLoaded', () => {
  showLegend();
  drawLegend(legendMinZ, legendMaxZ);
});
