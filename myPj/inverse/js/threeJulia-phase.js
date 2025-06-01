// js/threeJulia-phase.js

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
 * nextStepPhase
 * z:      Complex    （逆写像で得られた子点）
 * c:      Complex    （Julia定数）
 *
 * 戻り値: number     （|arg(f_c(z)) - arg(z)| の絶対値を返す）
 *
 * 具体的には、まず f_c(z) = z^2 + c を計算して得た新しい複素数 w' について、
 * arg(w') - arg(z) の差分を絶対値で返します。（範囲は [0, π]）
 */
function nextStepPhase(z, c) {
  // 正写像を１ステップだけ走らせる
  const z2 = new Complex(
    z.re * z.re - z.im * z.im + c.re,
    2 * z.re * z.im + c.im
  );

  // 位相（角度）を取得
  let argZ  = z.arg();   // (-π, π]
  let argZ2 = z2.arg();  // (-π, π]

  // 差分を取る → 絶対値化しつつ 2π や 0～π の範囲に直す
  let diff = Math.abs(argZ2 - argZ);
  if (diff > Math.PI) {
    diff = 2 * Math.PI - diff;  // 位相は環状なので、最短の差分をとる
  }
  return diff;  // in [0, π]
}

/**
 * animateInversePhase
 * scene:         THREE.Scene
 * initialCircle: Complex[]   （単位円上の点群）
 * c:             Complex     （Julia定数）
 * maxIter:       number      （逆写像の世代数）
 * intervalMs:    number      （世代を更新する間隔ミリ秒）
 *
 * 各世代の点 z に対して「|arg(f_c(z)) - arg(z)|」を計算し、それを Z（高さ）として Three.js 上に追加する。
 */
export async function animateInversePhase(
  scene,
  initialCircle,
  c,
  maxIter = 6,
  intervalMs = 1000
) {
  // ─── (1) 初期世代：単位円を Z=0 としてプロット ───
  let currentGen = initialCircle.slice();
  const positions = [];
  const colors = [];

  currentGen.forEach(z => {
    // 単位円はまだ正写像を通していないので、位相差は 0 とみなす
    positions.push(z.re, z.im, 0); 
    const col = new THREE.Color('hsl(0,80%,50%)');
    colors.push(col.r, col.g, col.b);
  });

  // BufferGeometry + PointsMaterial を作成
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 1.0
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

  // ─── (2) 逆写像を進めながら「位相差」を計算して追加 ───
  for (let gen = 1; gen <= maxIter; gen++) {
    await new Promise(res => setTimeout(res, intervalMs));

    const nextGen = computeInverseGeneration(currentGen, c);

    // 親 w = currentGen[i] に対応する子 z0, z1 は nextGen[2*i], nextGen[2*i+1]
    for (let i = 0; i < currentGen.length; i++) {
      const z0 = nextGen[2 * i];
      const z1 = nextGen[2 * i + 1];

      // (A) 各 z の「位相差」を計算
      const phaseDiff0 = nextStepPhase(z0, c);
      const phaseDiff1 = nextStepPhase(z1, c);

      // Z 座標に phaseDiff (0 ～ π) をそのまま割り当て
      positions.push(z0.re, z0.im, phaseDiff0);
      positions.push(z1.re, z1.im, phaseDiff1);

      // 色相は世代 gen を HUE にして識別
      const hue = (gen * (360 / maxIter)) % 360;
      const col  = new THREE.Color(`hsl(${hue},80%,50%)`);
      colors.push(col.r, col.g, col.b);
      colors.push(col.r, col.g, col.b);
    }

    updateGeometry();
    currentGen = nextGen.slice();
  }
}
