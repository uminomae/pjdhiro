// js/threeJulia-lyapunov.js

import * as THREE from 'three';
import { Complex } from './complex.js';

/**
 * computeInverseGeneration
 * wPoints: Complex[] （現在の世代の点集合）
 * c:      Complex   （Julia 定数）
 * 戻り値: Complex[] （次世代の点集合。各 w に対して (w - c) の 2 つの平方根を返す）
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
 * approximateLyapunov
 * z0: Complex    （「逆写像で得られた点」を起点に）
 * c:  Complex    （Julia 定数）
 * maxIter: int   （リャプノフ指数近似の反復回数）
 *
 * 戻り値: number （Lyapunov指数近似。正であればカオス的に発散しやすい、負なら収束しやすい）
 */
function approximateLyapunov(z0, c, maxIter = 30) {
  let z = z0.clone();
  let sumLog = 0;
  for (let i = 0; i < maxIter; i++) {
    // 正写像を一歩だけ前進
    z = new Complex(
      z.re * z.re - z.im * z.im + c.re,
      2 * z.re * z.im + c.im
    );
    const deriv = 2 * z.abs();            // f'(z) = 2z → 絶対値は 2|z|
    if (deriv === 0) {
      sumLog += Math.log(1e-16);           // 極端に小さいときは log 部分をクリッピング
    } else {
      sumLog += Math.log(deriv);
    }
    // 発散し始めたら途中で打ち切る（数値オーバーフロー防止）
    if (z.abs() > 1e6) {
      break;
    }
  }
  // 1/n ∑ log|f'(z)| が Lyapunov 近似値
  return sumLog / maxIter;
}

/**
 * animateInverseLyapunov
 * scene:        THREE.Scene
 * initialCircle: Complex[] （単位円上の初期点群）
 * c:            Complex   （Julia 定数）
 * maxIter:      number    （逆写像をたどる世代数）
 * intervalMs:   number    （世代を更新する間隔ミリ秒）
 *
 * 各逆写像点 z に対して approximateLyapunov(z, c) を計算し、
 * その値を Z（高さ）として Three.js 上に逐次点を追加していく。
 */
export async function animateInverseLyapunov(
  scene,
  initialCircle,
  c,
  maxIter = 6,
  intervalMs = 1000
) {
  // (1) 初期世代—単位円をプロット。Lyapunov は「まだ正写像をたどっていない」ため 0 にしておく
  let currentGen = initialCircle.slice();
  const positions = [];
  const colors = [];

  currentGen.forEach(z => {
    positions.push(z.re, z.im, 0);       // Z=0
    const col = new THREE.Color('hsl(0,80%,50%)');
    colors.push(col.r, col.g, col.b);
  });

  // BufferGeometry+PointsMaterial を準備
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

  // (2) 逆写像の世代を順次展開しながら、Lyapunov を計算して高さ Z を決める
  for (let gen = 1; gen <= maxIter; gen++) {
    await new Promise(res => setTimeout(res, intervalMs));

    const nextGen = computeInverseGeneration(currentGen, c);

    // 親 w = currentGen[i] に対して 2 つの子 z0,z1 が nextGen[2*i],nextGen[2*i+1]
    for (let i = 0; i < currentGen.length; i++) {
      const w  = currentGen[i];
      const z0 = nextGen[2 * i];
      const z1 = nextGen[2 * i + 1];

      // (A) 各 z の Lyapunov を計算
      const ly0 = approximateLyapunov(z0, c, 30);
      const ly1 = approximateLyapunov(z1, c, 30);

      // Z 座標には Lyapunov をそのまま割り当て（必要に応じてスケール可）
      positions.push(z0.re, z0.im, ly0);
      positions.push(z1.re, z1.im, ly1);

      // カラーは「世代(gen) を色相 Hue にして」識別
      const hue = (gen * (360 / maxIter)) % 360;
      const col0 = new THREE.Color(`hsl(${hue},80%,50%)`);
      const col1 = col0.clone();
      colors.push(col0.r, col0.g, col0.b);
      colors.push(col1.r, col1.g, col1.b);
    }

    updateGeometry();
    currentGen = nextGen.slice();
  }
}
