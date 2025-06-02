// js/circle.js

import { Complex } from '../util/complex-number.js';

/**
 * 単位円 (|z|=1) を samples 分割して点列 (Complex[]) を返す
 * @param {number} samples ── 円周を何分割するか (例: 360)
 * @returns {Complex[]}     ── 単位円上の Complex インスタンスの配列
 */
export function generateCirclePoints(samples = 360) {
  const pts = [];
  for (let i = 0; i < samples; i++) {
    const theta = (i / samples) * 2 * Math.PI;
    pts.push(new Complex(Math.cos(theta), Math.sin(theta)));
  }
  return pts;
}
