// js/inverseLogic.js

import { Complex } from './complex.js';

/**
 * 逆写像 (f(z) = z^2 + c) の関数
 *  与えられた w, c (Complex) に対して ±√(w - c) を返す
 */
export function preimagesOfQuadratic(w, c) {
  const diff = w.sub(c);
  const root = diff.sqrt();          // 主値の √(w - c)
  const rootNeg = new Complex(-root.re, -root.im);
  return [root, rootNeg];
}

/**
 * 半径 R の円を N 点サンプリングして Complex[] として返す
 */
export function sampleCircle(R, N) {
  const pts = [];
  for (let k = 0; k < N; k++) {
    const theta = (2 * Math.PI * k) / N;
    pts.push(new Complex(R * Math.cos(theta), R * Math.sin(theta)));
  }
  return pts;
}
