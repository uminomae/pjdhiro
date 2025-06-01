// js/inverse.js

import { Complex } from './complex.js';

/**
 * 逆写像を１世代分だけ計算する
 * w ∈ points の各点に対して z^2 + c = w を解き（√(w - c), -√(w - c)）を計算し、
 * ２倍した配列を返す。
 *
 * @param {Complex[]} points  … 現在の w の配列
 * @param {Complex}   c       … Julia の定数 c
 * @returns {Complex[]}       … 次世代の z の配列（元の 2 倍の長さ）
 */
export function computeInverseOneGen(points, c) {
  const nextPts = [];
  for (const w of points) {
    // w - c を計算
    const diff = w.sub(c);
    // diff.sqrt() は主値 sqrt を返す
    const root = diff.sqrt();
    // 正の平方根 (z1) と負の平方根 (z2) を両方次世代に含める
    nextPts.push(root);
    nextPts.push(new Complex(-root.re, -root.im));
  }
  return nextPts;
}
