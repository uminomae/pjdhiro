// js/threeJulia-dynamic.js

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
export async function animateInverseDynamic(
  scene,
  initialCircle,
  c,
  maxIter = 6,
  intervalMs = 1000
) {
  // ─── (1) 最初に「単位円(初期世代)」をプロット ───
  // 最終的にすべての世代の点をまとめて入れていく BufferGeometry を用意
  let pointsArray = initialCircle.slice(); // Complex[] のコピー
  const N0 = pointsArray.length; // 200 など
  // positions, colors を格納する Float32Array を後から拡張できるように Array で持っておく
  const positions = [];
  const colors = [];

  // 「世代 0」の点を positions/colors に push
  for (let i = 0; i < N0; i++) {
    const z = pointsArray[i];
    positions.push(z.re, z.im, z.abs()); // Z を複素絶対値に設定
    // 色相: 世代0 は例えば朱色 (hue=0)
    const col = new THREE.Color(`hsl(${0}, 100%, 60%)`);
    colors.push(col.r, col.g, col.b);
  }

  // BufferGeometry を作成し、attributes に最初の世代を設定して Points を生成
  const geometry = new THREE.BufferGeometry();
  // いまはまだ TypedArray に入れる段階ではないので、後で setAttribute するときに TypedArray に変換
  const material = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  const pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);

  // Helper: geometry を更新して描画できるようにする関数
  function updateGeometryBuffer() {
    // Float32Array に変換
    const posArray = new Float32Array(positions);
    const colArray = new Float32Array(colors);
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colArray, 3));
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  }

  // まず最初に BufferGeometry に流し込んでおく
  updateGeometryBuffer();

  // ─── (2) 世代を順次進めつつ、その都度 BufferGeometry を拡張 ───
  let currentGenPoints = initialCircle.slice();

  for (let gen = 1; gen <= maxIter; gen++) {
    // (A) 少し待つ（intervalMs ミリ秒）
    await new Promise(res => setTimeout(res, intervalMs));

    // (B) 逆写像して次世代を計算
    const nextGenPoints = computeInverseGeneration(currentGenPoints, c);

    // (C) 「次世代の z 点群」を positions/colors に順番に追加
    nextGenPoints.forEach(z => {
      positions.push(z.re, z.im, z.abs()); // Z 座標に絶対値を入れる
      // 色相を「世代 gen に応じて 360/maxIter 周期的」に振る例
      // たとえば gen=1→hue=（360/maxIter）、gen=2→hue=（2*360/maxIter）… のように
      const hue = (gen * (360 / maxIter)) % 360;
      const col = new THREE.Color(`hsl(${hue}, 100%, 60%)`);
      colors.push(col.r, col.g, col.b);
    });

    // (D) BufferGeometry を更新して新しい点も表示されるようにする
    updateGeometryBuffer();

    // (E) 次の世代用に currentGenPoints を更新
    currentGenPoints = nextGenPoints.slice();
  }

  // (F) すべての世代を追加し終えたら、一度ここで終了
  // 必要であればさらに gen を増やすか、もしくはループを継続して「どんどん膨大な点を追加し続ける」ようにできます。
}
