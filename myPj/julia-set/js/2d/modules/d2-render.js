// ファイル：js/2d/modules/d2-render.js

import { AppConfig } from '../d2-config.js';
import { drawPoints, clearCanvas } from '../../util/canvas-draw.js';

const DOT_DIAMETER = 4;

/**
 * Complex[] → Canvas 座標に変換し、drawPoints() で点を描画する。
 * (元の drawComplexPoints を移植)
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Complex[]} complexArray
 * @param {number} cx   Canvas の中心 x 座標（ピクセル）
 * @param {number} cy   Canvas の中心 y 座標（ピクセル）
 * @param {number} scale   拡大縮小率
 * @param {string} color   描画色（例: '#fff', 'yellow'）
 * @param {number} [diameter=DOT_DIAMETER]  ドットの直径
 */
export function drawComplexPoints(ctx, complexArray, cx, cy, scale, color, diameter = AppConfig.dotDiameter) {
  const pixelArray = complexArray.map(z => ({
    x: cx + z.re * scale,
    y: cy - z.im * scale
  }));
  drawPoints(ctx, pixelArray, color, diameter);
}

/**
 * Canvas をクリアし、背景を黒で塗りつぶす。
 * （必要に応じて使い分ける）
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width   ctx.canvas.width
 * @param {number} height  ctx.canvas.height
 */
export function clearBlack(ctx, width, height) {
  clearCanvas(ctx, width, height);
  // 黒背景で再描画したい場合は以下を有効にする：
  // ctx.fillStyle = '#000';
  // ctx.fillRect(0, 0, width, height);
}

/**
 * Canvas 上に「現在の世代番号」と複素定数 c の実部・虚部を
 * 半透明の黒背景付きで右上に描画する。
 *
 * (元の drawIterationCount を移植)
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} iter    世代番号
 * @param {Complex} c      複素定数 c（this.re, this.im を想定）
 */
export function drawIterationCount(ctx, iter, c) {
  const padding = 10;
  const fontSize = 20;
  const fontFamily = 'monospace';

  const iterText = String(iter).padStart(3, '0');
  const cre = c.re.toFixed(3);
  const cim = c.im.toFixed(3);

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  const iterMetrics = ctx.measureText(iterText);
  const iterWidth  = iterMetrics.width;
  const iterHeight = fontSize;

  const cText1 = `Re: ${cre}`;
  const cText2 = `Im: ${cim}`;
  const cMetrics1 = ctx.measureText(cText1);
  const cMetrics2 = ctx.measureText(cText2);
  const cWidth  = Math.max(cMetrics1.width, cMetrics2.width);
  const cHeight = fontSize * 2 + 4;

  const totalWidth  = Math.max(iterWidth, cWidth) + 8;
  const totalHeight = iterHeight + cHeight + 12;
  const x0 = ctx.canvas.width - padding - totalWidth;
  const y0 = padding;

  // 背景の半透明黒を描画
  ctx.fillStyle = 'rgba(33, 37, 41, 0.6)'; // Bootstrap の bg-dark (#212529) を rgba にして 60% 不透明
  ctx.fillRect(x0, y0, totalWidth, totalHeight);
  
  ctx.fillStyle = '#fff';
  ctx.fillText(iterText, x0 + totalWidth - 4, y0 + 4);
  
  // Re, Im をテキスト表示
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const cxText = x0 + 4;
  const cyText = y0 + 4 + iterHeight + 4;
  ctx.fillText(cText1, cxText, cyText);
  ctx.fillText(cText2, cxText, cyText + fontSize + 2);
}
