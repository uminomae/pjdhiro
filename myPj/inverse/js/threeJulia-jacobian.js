// js/threeJulia-jacobian.js

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
 * - scene: THREE.Scene
 * - initialCircle: Complex[] （単位円上の初期点群）
 * - c: Complex （Julia 定数）
 * - maxIter: number （世代の上限。ここまで一世代ずつ進める）
 * - intervalMs: number （世代を進める間隔ミリ秒）
 */
export async function animateInverseInverseJacobian(
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

  // 世代 0: 単位円をプロット
  currentGenPoints.forEach(z => {
    // Jacobian に対応する値: 1 / (2|z|)
    const jac = 1 / (2 * z.abs());
    positions.push(z.re, z.im, jac);
    // 色相：世代0 は赤 (hue=0)
    const col = new THREE.Color(`hsl(0, 80%, 50%)`);
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

    nextGenPoints.forEach(z => {
      const jac = 1 / (2 * z.abs());
      positions.push(z.re, z.im, jac);
      const hue = (gen * (360 / maxIter)) % 360;
      const col = new THREE.Color(`hsl(${hue}, 80%, 50%)`);
      colors.push(col.r, col.g, col.b);
    });

    updateGeometry();
    currentGenPoints = nextGenPoints.slice();
  }
}
