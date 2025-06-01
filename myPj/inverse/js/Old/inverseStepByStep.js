// js/inverseStepByStep.js
import { Complex } from './complex.js';

/**
 * 円周上の 1 つの点 w を逆写像する過程を描く。
 * - w = cos(θ) + i sin(θ)
 * - c = cRe + i cIm
 * 
 * 1) w - c を求め、(r, φ) に変換 → φ/2 だけ回す点をまず描画
 * 2) r を √ して描画
 */
export function drawOneInverseStep(ctx, cx, cy, scale, θ, cRe, cIm) {
  // 元点 w
  const w = new Complex(Math.cos(θ), Math.sin(θ));
  // c
  const c = new Complex(cRe, cIm);

  // 下地として円周上の w をわかりやすく赤点で描画
  const wPx = cx + w.re * scale;
  const wPy = cy - w.im * scale;
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(wPx, wPy, 5, 0, 2 * Math.PI);
  ctx.fill();

  // 1) w - c を計算して r, φ を求める
  const diff = w.sub(c);
  const r1 = diff.abs();
  let φ = Math.atan2(diff.im, diff.re); // (-π, +π]
  if (φ < 0) φ += 2 * Math.PI;          // [0, 2π) に正規化

  // 1.5) まず angle だけ半分にした点 z_angle を描く
  const newAngle = φ / 2;
  // ここではまだ「半径は r1 のまま」
  const zx1 = r1 * Math.cos(newAngle);
  const zy1 = r1 * Math.sin(newAngle);
  const z1px = cx + zx1 * scale;
  const z1py = cy - zy1 * scale;
  ctx.fillStyle = 'yellow'; // 角度半分だけの途中結果
  ctx.beginPath();
  ctx.arc(z1px, z1py, 5, 0, 2 * Math.PI);
  ctx.fill();

  // 2) 最終的に半径を √ して点 z_final
  const r2 = Math.sqrt(r1);
  const zx2 = r2 * Math.cos(newAngle);
  const zy2 = r2 * Math.sin(newAngle);
  const z2px = cx + zx2 * scale;
  const z2py = cy - zy2 * scale;
  ctx.fillStyle = 'lime'; // 最終逆写像結果
  ctx.beginPath();
  ctx.arc(z2px, z2py, 5, 0, 2 * Math.PI);
  ctx.fill();

  // 矢印などで結ぶとわかりやすい
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(wPx, wPy);
  ctx.lineTo(z1px, z1py);
  ctx.lineTo(z2px, z2py);
  ctx.stroke();
}
