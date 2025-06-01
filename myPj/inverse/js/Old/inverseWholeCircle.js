// js/inverseWholeCircle.js
import { Complex } from './complex.js';

/**
 * 円全体をサンプリングして、2 段階で描画する。
 * 1) φ = arg(w - c) を求めて θ = φ/2 の形状を描く（r = |w-c|）
 * 2) さらに r → √r を適用して描く（θ = φ/2）
 *
 * - ctx: CanvasRenderingContext2D
 * - cx, cy, scale: 描画用パラメータ
 * - cRe, cIm: Julia定数
 * - samples: サンプリング分割数 (例: 360)
 * - color1: 1段階目の線色
 * - color2: 2段階目の線色
 */
export function drawInverseTwoSteps(ctx, cx, cy, scale, cRe, cIm, samples = 360, color1 = 'yellow', color2 = 'lime') {
  const c = new Complex(cRe, cIm);

  // (1) 角度だけ半分にした輪郭
  ctx.strokeStyle = color1;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= samples; i++) {
    const θ = (i / samples) * 2 * Math.PI;
    const w = new Complex(Math.cos(θ), Math.sin(θ));
    const diff = w.sub(c);
    let φ = Math.atan2(diff.im, diff.re);
    if (φ < 0) φ += 2 * Math.PI;
    const newAngle = φ / 2;
    const r1 = diff.abs(); // ここではまだ r はそのまま

    const x1 = r1 * Math.cos(newAngle);
    const y1 = r1 * Math.sin(newAngle);
    const px1 = cx + x1 * scale;
    const py1 = cy - y1 * scale;
    if (i === 0) ctx.moveTo(px1, py1);
    else       ctx.lineTo(px1, py1);
  }
  ctx.stroke();

  // (2) 半径を √ した輪郭
  ctx.strokeStyle = color2;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= samples; i++) {
    const θ = (i / samples) * 2 * Math.PI;
    const w = new Complex(Math.cos(θ), Math.sin(θ));
    const diff = w.sub(c);
    let φ = Math.atan2(diff.im, diff.re);
    if (φ < 0) φ += 2 * Math.PI;
    const newAngle = φ / 2;
    const r2 = Math.sqrt(diff.abs()); // √ をかける

    const x2 = r2 * Math.cos(newAngle);
    const y2 = r2 * Math.sin(newAngle);
    const px2 = cx + x2 * scale;
    const py2 = cy - y2 * scale;
    if (i === 0) ctx.moveTo(px2, py2);
    else       ctx.lineTo(px2, py2);
  }
  ctx.stroke();
}
