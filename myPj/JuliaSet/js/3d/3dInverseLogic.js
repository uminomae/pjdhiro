// js/inverseLogic.js
import { Complex } from '../util/complex-number.js';

/**
 * computeInverseGeneration
 * ── 現在の世代 wPoints (Complex[]) の各点 w について (w - c) の
 *    2 通りの平方根を計算し、次世代の Complex[] を返します。
 */
export function computeInverseGeneration(wPoints, c) {
  const nextGen = [];
  for (const w of wPoints) {
    const diff = w.sub(c);
    const r    = diff.abs();
    let phi    = Math.atan2(diff.im, diff.re);
    if (phi < 0) phi += 2 * Math.PI;

    const sqrtR = Math.sqrt(r);
    const phi0  = phi / 2;
    const phi1  = phi / 2 + Math.PI;

    const z0 = new Complex(
      sqrtR * Math.cos(phi0),
      sqrtR * Math.sin(phi0)
    );
    const z1 = new Complex(
      sqrtR * Math.cos(phi1),
      sqrtR * Math.sin(phi1)
    );
    nextGen.push(z0, z1);
  }
  return nextGen;
}

/**
 * generateUnitCircle
 * ── 単位円上に N 点を等間隔にサンプリングした Complex[] を返します。
 */
export function generateUnitCircle(N) {
  const pts = [];
  for (let i = 0; i < N; i++) {
    const theta = (2 * Math.PI * i) / N;
    pts.push(new Complex(Math.cos(theta), Math.sin(theta)));
  }
  return pts;
}
