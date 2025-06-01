// js/threeJulia-inverse.js

import * as THREE from 'three';
import { Complex } from './complex.js';

/**
 * 逆写像で生まれる２つの解を返す。
 * - wPoints：現在の複素点集合 (Complex[])
 * - c: Julia 定数 (Complex)
 * 
 * 戻り値: { nextGen: Complex[] }
 *   nextGen は「wPoints の配列」それぞれに対して (w - c) を計算し、√ を取った２解をすべて含む新しい点群 (長さ 2 * wPoints.length)
 */
function computeInverseGeneration(wPoints, c) {
  const nextGen = [];
  for (const w of wPoints) {
    // (1) w - c を計算
    const diff = w.sub(c);

    // (2) diff の極形式（r, φ）を計算
    const r = diff.abs();
    let phi = Math.atan2(diff.im, diff.re);
    if (phi < 0) phi += 2 * Math.PI;

    // (3) √ の２解：φ/2 と φ/2 + π
    const sqrtR = Math.sqrt(r);
    const phi0 = phi / 2;
    const phi1 = phi / 2 + Math.PI;

    // (4) ２つの Complex 解を生成
    const z0 = new Complex(sqrtR * Math.cos(phi0), sqrtR * Math.sin(phi0));
    const z1 = new Complex(sqrtR * Math.cos(phi1), sqrtR * Math.sin(phi1));

    nextGen.push(z0, z1);
  }
  return nextGen;
}

/**
 * Three.js 上に「ある世代の点集合」を描画する helper
 * - scene: THREE.Scene
 * - points: Complex[] (描画したい複素点群)
 * - genIndex: number (世代番号、色や高さを決めるために使う)
 * 
 * 戻り値: 作成した THREE.Points オブジェクト
 */
export function createPointCloudForGeneration(scene, points, genIndex) {
  const N = points.length;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);

  // 色を「世代に応じたグラデーション」でつける例
  // ここでは HSL の「H = genIndex * 30°」(°=0〜360) を RGB に変換して使う
  const hue = (genIndex * 30) % 360; // 30°ずつ回す
  const color3 = new THREE.Color(`hsl(${hue}, 100%, 60%)`);

  for (let i = 0; i < N; i++) {
    const z = points[i];
    // x, y は complex の実部・虚部
    positions[i * 3 + 0] = z.re;
    positions[i * 3 + 1] = z.im;
    // z 座標には「世代番号」を使って持ち上げてみる
    positions[i * 3 + 2] = genIndex * 0.05;

    // 頂点色をすべて同じにする場合、以下３行で color3 の R,G,B を設定
    colors[i * 3 + 0] = color3.r;
    colors[i * 3 + 1] = color3.g;
    colors[i * 3 + 2] = color3.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  const pointCloud = new THREE.Points(geometry, material);

  scene.add(pointCloud);
  return pointCloud;
}

/**
 * メインルーチン：Three.js で逆写像を順次計算し、各世代を描画する
 * - scene: THREE.Scene
 * - initialCircle: Complex[] (初期点集合＝単位円上の点群)
 * - c: Complex (Julia 定数)
 * - maxIter: number (最大世代数)
 * - delayMs: number (各世代の描画間隔ミリ秒)
 * 
 * 戻り値: Promise<void> （すべての世代を描画し終えたら解決）
 */
export async function animateInverseJulia3D(scene, initialCircle, c, maxIter = 5, delayMs = 800) {
  // まず世代 0 として「単位円（白）」を描画
  let currentGenPoints = initialCircle.slice();
  createPointCloudForGeneration(scene, currentGenPoints, 0);

  // 世代 1 以降を順次計算・描画
  for (let gen = 1; gen <= maxIter; gen++) {
    // 逆写像を計算
    const nextGenPoints = computeInverseGeneration(currentGenPoints, c);

    // Three.js に点群として追加
    createPointCloudForGeneration(scene, nextGenPoints, gen);

    // 少し待つ
    await new Promise(resolve => setTimeout(resolve, delayMs));

    // 次世代のために更新
    currentGenPoints = nextGenPoints;
  }
}
