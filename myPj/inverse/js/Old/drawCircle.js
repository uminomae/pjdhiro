// js/drawCircle.js
import { Complex } from './complex.js';

export function drawUnitCircle(ctx, cx, cy, scale, color = '#fff', steps = 360) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const θ = (i / steps) * 2 * Math.PI;
    const x = Math.cos(θ);
    const y = Math.sin(θ);
    // キャンバス座標に変換
    const px = cx + x * scale;
    const py = cy - y * scale; // ※Y軸は上下逆なので注意
    if (i === 0) ctx.moveTo(px, py);
    else       ctx.lineTo(px, py);
  }
  ctx.stroke();
}
