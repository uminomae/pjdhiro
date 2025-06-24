// js/3d/renderer/d3-utils.js

import * as THREE from 'three';
import { getZ } from './d3-height-function.js';

/**
 * createColoredPoints3D
 *
 * ・scene: THREE.Scene                     — 描画先のシーン
 * ・points: Complex[]                      — 3D 描画したい複素数の配列
 * ・stage: string ('init'|'subtract'|'sqrt1'|'sqrt2'|'recolor' など)  
 * ・iter:  number                          — 世代番号（getZ に渡す情報として使う）
 * ・size:  number (default 0.02)           — THREE.PointsMaterial の size
 * ・name:  string (空文字でもよい)         — 生成する THREE.Points に付ける name 属性
 *
 * 戻り値: THREE.Points オブジェクトを返す（まだ scene.add は呼びません）
 *
 * 使用例:
 *   const pts = createColoredPoints3D(
 *     scene,
 *     complexArray,
 *     'subtract',
 *     3,
 *     0.03,
 *     'ptsSubtract'
 *   );
 *   scene.add(pts);
 */
export function createColoredPoints3D(
  scene,
  points,
  stage,
  iter,
  size = 0.02,
  name = ''
) {
  // ── 1) 各点について getZ を呼び、zValues 配列を作る ──
  // getZ() は「(Complex) → 数値」を返す関数（例: 複素数の絶対値など）
  const zValues = points.map(pt => getZ(pt, { stage, iter }));

  // ── 2) zValues の最大値を求める（最低でも 1e-6 を下限とする） ──
  // Math.max(...zValues) は配列が大きい場合に引数展開で
  // "Maximum call stack size exceeded" を起こし得るため
  // reduce で安全に最大値を計算する
  const maxZ = zValues.reduce((acc, v) => (v > acc ? v : acc), 1e-6);

  // ── 3) BufferGeometry 用の TypedArray を準備 ──
  //    ・posArray: 座標バッファ (x, y, z) が 3 * points.length
  //    ・colArray: 色のバッファ   (r, g, b) が 3 * points.length
  const posArray = new Float32Array(points.length * 3);
  const colArray = new Float32Array(points.length * 3);

  for (let i = 0; i < points.length; i++) {
    const zPt    = points[i];      // Complex オブジェクト
    const X      = zPt.re;         // 実部 → x 座標
    const Y      = zPt.im;         // 虚部 → y 座標
    const Zvalue = zValues[i];     // getZ で得た高さ

    // (A) 座標バッファにセット
    posArray[i * 3 + 0] = X;
    posArray[i * 3 + 1] = Y;
    posArray[i * 3 + 2] = Zvalue;

    // (B) 色を HSL で作る:
    //     0 ≤ intensity ≤ 1 とし、intensity = Zvalue / maxZ
    const intensity = Zvalue / maxZ;
    //     hue を 240° (青) → 0° (赤) で補間
    const hue = 240 - 240 * intensity;
    //     s=100%, l=50% で HSL 文字列を作成し、THREE.Color に変換
    const tmpCol = new THREE.Color(`hsl(${hue},100%,50%)`);

    colArray[i * 3 + 0] = tmpCol.r;
    colArray[i * 3 + 1] = tmpCol.g;
    colArray[i * 3 + 2] = tmpCol.b;
  }

  // ── 4) BufferGeometry に position / color をセット ──
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colArray,    3));

  // ── 5) PointsMaterial を作成（vertexColors: true） ──
  const material = new THREE.PointsMaterial({
    size: size,
    vertexColors: true,
  });

  // ── 6) THREE.Points オブジェクトを生成 ──
  const pointsObj = new THREE.Points(geometry, material);
  if (name) {
    pointsObj.name = name;
  }
  return pointsObj;
}
