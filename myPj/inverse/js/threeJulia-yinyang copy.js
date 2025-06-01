// js/threeJulia-yinyang.js

import * as THREE from 'three';
import { Complex } from './complex.js';

/**
 * computeInverseGeneration
 * wPoints: Complex[] （現在の世代の点集合）
 * c:       Complex   （Julia定数）
 * 戻り値:  Complex[] （次世代の点集合。各 w に対して (w - c) の 2 つの平方根を返す）
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
 * animateInverseYinYang
 * scene:         THREE.Scene
 * initialCircle: Complex[]   （単位円上の点群）
 * c:             Complex     （Julia定数）
 * maxIter:       number      （逆写像の世代数）
 * intervalMs:    number      （世代を更新する間隔ミリ秒）
 *
 * 各逆写像点 z に対して「Z = Re(z)（実部）」をそのまま高さに割り当ててプロットする。
 */
export async function animateInverseYinYang(
  scene,
  initialCircle,
  c,
  maxIter = 4,
  intervalMs = 800
) {
  // ─── (1) 初期世代：単位円を Z=0 としてプロット ───
  let currentGen = initialCircle.slice();
  const positions = [];
  const colors = [];

  currentGen.forEach(z => {
    positions.push(z.re, z.im, 0); // Z=0
    // 初期世代は色相 Hue=0（赤）
    const col = new THREE.Color('hsl(0,80%,50%)');
    colors.push(col.r, col.g, col.b);
  });

  // BufferGeometry+PointsMaterial を準備
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.9
  });
  const pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);

  function updateGeometry() {
    const posArray = new Float32Array(positions);
    const colArray = new Float32Array(colors);
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colArray,    3));
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  }
  updateGeometry();

  // ─── (2) 逆写像を進めながら「Z = Re(z)」を計算して追加 ───
  for (let gen = 1; gen <= maxIter; gen++) {
    await new Promise(res => setTimeout(res, intervalMs));

    const nextGen = computeInverseGeneration(currentGen, c);

    // 親 w = currentGen[i] に対応する子 z0, z1 は nextGen[2*i], nextGen[2*i+1]
    for (let i = 0; i < currentGen.length; i++) {
      const z0 = nextGen[2 * i];
      const z1 = nextGen[2 * i + 1];

      // (A) Z 座標を「実部 Re(z)」として直接使う
      positions.push(z0.re, z0.im, z0.re);
      positions.push(z1.re, z1.im, z1.re);

      // 色相は世代 gen を Hue にして識別
      const hue = (gen * (360 / maxIter)) % 360;
      const col  = new THREE.Color(`hsl(${hue},80%,50%)`);
      colors.push(col.r, col.g, col.b);
      colors.push(col.r, col.g, col.b);
    }

    updateGeometry();
    currentGen = nextGen.slice();
  }
}
