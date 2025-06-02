/**
 * 単位円上に N 個の点を等間隔でサンプリングして Complex[] を返す
 *   → 2D・3D 両方で使えるようにする
 */
import { Complex } from './complex-number.js';

export function generateCirclePoints(N = 360) {
  const pts = [];
  for (let i = 0; i < N; i++) {
    const θ = (2 * Math.PI * i) / N;
    pts.push(new Complex(Math.cos(θ), Math.sin(θ)));
  }
  return pts;
}
