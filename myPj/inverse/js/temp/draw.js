// js/draw.js

/**
 * Canvas に点をプロットする関数
 *
 * @param {CanvasRenderingContext2D} ctx     ── 描画先の 2D コンテキスト
 * @param {Complex[]}               points  ── プロットしたい Complex の配列
 * @param {number}                  cx      ── Canvas 中心の x 座標 (ピクセル)
 * @param {number}                  cy      ── Canvas 中心の y 座標 (ピクセル)
 * @param {number}                  scale   ── 複素平面上の長さ1を何ピクセルに対応させるか
 * @param {string}                  color   ── 点の色 (例: '#fff', 'yellow' など)
 * @param {number}                  diameter ── 点の直径 (ピクセル)
 */
export function drawPoints(ctx, points, cx, cy, scale, color = '#fff', diameter = 2) {
  ctx.fillStyle = color;
  for (const z of points) {
    const px = cx + z.re * scale;
    const py = cy - z.im * scale; // Canvas の Y 軸は下方向が + なので反転
    ctx.beginPath();
    ctx.arc(px, py, diameter / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}
