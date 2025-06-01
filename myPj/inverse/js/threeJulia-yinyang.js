// js/threeJulia-yinyang.js

import * as THREE from 'three';
import { Complex } from './complex.js';

/**
 * computeInverseGeneration
 * wPoints: Complex[] （現在の世代の点集合）
 * c:       Complex   （Julia定数）
 * 戻り値:  Complex[] （次世代の点集合。各 w に対して (w - c) の2つの平方根を返す）
 */
function computeInverseGeneration(wPoints, c) {
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
 * calcPhaseDiff
 * z: Complex    （逆写像で得られた子点）
 * c: Complex    （Julia定数）
 * 戻り値: number （0～1 に正規化された |arg(f_c(z)) - arg(z)| / π）
 */
function calcPhaseDiff(z, c) {
  // f_c(z) = z^2 + c を 1 ステップだけ計算
  const z2 = new Complex(
    z.re * z.re - z.im * z.im + c.re,
    2 * z.re * z.im + c.im
  );

  // 位相（-π～π）
  let argZ  = z.arg();
  let argZ2 = z2.arg();
  let diff  = Math.abs(argZ2 - argZ);
  if (diff > Math.PI) {
    // 環状位相の最短差を取る
    diff = 2 * Math.PI - diff;
  }
  return diff / Math.PI;  // [0,1] の範囲
}

/**
 * animateInverseYinYang
 * scene:         THREE.Scene
 * initialCircle: Complex[]   （単位円上の点群）
 * c:             Complex     （Julia定数）
 * maxIter:       number      （逆写像の世代数）
 * intervalMs:    number      （世代を更新する間隔(ms)）
 *
 * 各逆写像点 z に対して
 *   Z = α*(Re(z) * realScale) + β*(calcPhaseDiff(z,c) * phaseScale)
 * を計算し、Three.js 上に Points として順次追加していきます。
 */
export async function animateInverseYinYang(
  scene,
  initialCircle,
  c,
  maxIter = 20,
  intervalMs = 800
) {
  // --- (1) 初期世代：円を Z=0 でプロット ---
  let currentGen = initialCircle.slice();
  const positions = [];
  const colors    = [];

  currentGen.forEach(z => {
    positions.push(z.re, z.im, 0);  // Z=0
    // 初期世代は赤（Hue=0）
    const col = new THREE.Color('hsl(0,80%,50%)');
    colors.push(col.r, col.g, col.b);
  });

  // Geometry / Material を準備
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
    geometry.attributes.color.needsUpdate    = true;
  }
  updateGeometry();

  // --- (2) 逆写像を進めながら Z を計算して追加 ---
  // 重みとスケールの初期値
  const alpha      = 0.0;   // 実部優先度（0～1）
  const beta       = 1.0;   // 位相優先度（1−alpha）
  const realScale  = 1.0;   // 実部リボンのスケール（1.0～2.0 くらい）
  const phaseScale = 1.0;   // 位相リボンのスケール

  for (let gen = 1; gen <= maxIter; gen++) {
    await new Promise(res => setTimeout(res, intervalMs));

    const nextGen = computeInverseGeneration(currentGen, c);

    for (let i = 0; i < currentGen.length; i++) {
      const z0 = nextGen[2 * i];
      const z1 = nextGen[2 * i + 1];

      // --- (A) 実部と位相差をミックスして Z を決める ---
      const rawRe0     = z0.re;
      const normPhase0 = calcPhaseDiff(z0, c);
      const zHeight0   = alpha * (rawRe0 * realScale)
                       + beta  * (normPhase0 * phaseScale);

      const rawRe1     = z1.re;
      const normPhase1 = calcPhaseDiff(z1, c);
      const zHeight1   = alpha * (rawRe1 * realScale)
                       + beta  * (normPhase1 * phaseScale);

      positions.push(z0.re, z0.im, zHeight0);
      positions.push(z1.re, z1.im, zHeight1);

      // カラー：世代 gen を Hue に変換 (0～360)
      const hue = (gen * (360 / maxIter)) % 360;
      const col = new THREE.Color(`hsl(${hue},80%,50%)`);
      colors.push(col.r, col.g, col.b);
      colors.push(col.r, col.g, col.b);
    }

    updateGeometry();
    currentGen = nextGen.slice();
  }
}
