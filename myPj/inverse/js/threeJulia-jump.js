// js/threeJulia-jump.js

import * as THREE from 'three';
import { Complex } from './complex.js';

/**
 * wPoints: Complex[] （現在の世代の点集合）
 * c: Complex （Julia 定数）
 * 戻り値: Complex[] （次世代の点集合。各 w に対して (w - c) の2つの平方根を返す）
 */
function computeInverseGeneration(wPoints, c) {
  const nextGen = [];
  for (const w of wPoints) {
    // (w - c) を計算
    const diff = w.sub(c);
    const r = diff.abs();
    let phi = Math.atan2(diff.im, diff.re);
    if (phi < 0) phi += 2 * Math.PI;

    const sqrtR = Math.sqrt(r);
    const phi0 = phi / 2;
    const phi1 = phi / 2 + Math.PI;

    const z0 = new Complex(sqrtR * Math.cos(phi0), sqrtR * Math.sin(phi0));
    const z1 = new Complex(sqrtR * Math.cos(phi1), sqrtR * Math.sin(phi1));
    nextGen.push(z0, z1);
  }
  return nextGen;
}

/**
 * メイン：動的に世代を進めながら Three.js 上に点を追加し続ける
 * 各点の Z 座標には「| |z| - |w| |」を使う
 *
 * - scene: THREE.Scene
 * - initialCircle: Complex[] （単位円上の初期点群）
 * - c: Complex （Julia 定数）
 * - maxIter: number （世代の上限。ここまで一世代ずつ進める）
 * - intervalMs: number （世代を進める間隔ミリ秒）
 */
export async function animateInverseJump(
  scene,
  initialCircle,
  c,
  maxIter = 6,
  intervalMs = 1000
) {
  // ─── (1) 最初に「単位円(初期世代)」をプロット ───
  let currentGenPoints = initialCircle.slice();
  const positions = [];
  const colors = [];

  // 世代0: 初期単位円では「w = z」であるため |z| - |w| = 0
  currentGenPoints.forEach(z => {
    positions.push(z.re, z.im, 0); // Z=0
    // 色相：世代0 は赤 (hue=0)
    const col = new THREE.Color('hsl(0, 80%, 50%)');
    colors.push(col.r, col.g, col.b);
  });

  // BufferGeometry を用意
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.9
  });
  const pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);

  // geometry を更新する関数
  function updateGeometry() {
    const posArray = new Float32Array(positions);
    const colArray = new Float32Array(colors);
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colArray, 3));
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  }
  updateGeometry();

  // ─── (2) 世代を順次進めつつ、その度に BufferGeometry を拡張 ───
  for (let gen = 1; gen <= maxIter; gen++) {
    await new Promise(res => setTimeout(res, intervalMs));

    const nextGenPoints = computeInverseGeneration(currentGenPoints, c);

    // 次世代の各 z について、親 w が currentGenPoints に格納されている順序で対応させる
    // nextGenPoints は親1つにつき [z0, z1] の順で格納されているので、
    // currentGenPoints[i] に対して nextGenPoints[2*i], nextGenPoints[2*i+1] が対応する。
    for (let i = 0; i < currentGenPoints.length; i++) {
      const w = currentGenPoints[i];
      const z0 = nextGenPoints[2 * i];
      const z1 = nextGenPoints[2 * i + 1];

      // (A) z0 と親 w との「ノルム差分」を計算
      const delta0 = Math.abs(z0.abs() - w.abs());
      positions.push(z0.re, z0.im, delta0);
      const hue0 = (gen * (360 / maxIter)) % 360;
      const col0 = new THREE.Color(`hsl(${hue0}, 80%, 50%)`);
      colors.push(col0.r, col0.g, col0.b);

      // (B) z1 と親 w との「ノルム差分」を計算
      const delta1 = Math.abs(z1.abs() - w.abs());
      positions.push(z1.re, z1.im, delta1);
      const hue1 = (gen * (360 / maxIter)) % 360;
      const col1 = new THREE.Color(`hsl(${hue1}, 80%, 50%)`);
      colors.push(col1.r, col1.g, col1.b);
    }

    updateGeometry();
    currentGenPoints = nextGenPoints.slice();
  }
}
