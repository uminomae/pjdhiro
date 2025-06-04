// js/modules/quantStereo/qt-st-pointcloud.js

import * as THREE from 'three';
import { rotatePoint } from './qt-quat-utils.js';

/**
 * generateImagSpherePoints(resTheta, resPhi)
 * ────────────────────────────────────────────────────────────
 * 「w=0, x²+y²+z²=1」の純虚四元数点群を生成して返す
 */
export function generateImagSpherePoints(resTheta = 40, resPhi = 40) {
  const points = [];
  for (let i = 0; i <= resTheta; i++) {
    const θ = (i / resTheta) * Math.PI;
    for (let j = 0; j <= resPhi; j++) {
      const φ = (j / resPhi) * Math.PI * 2;
      const x = Math.sin(θ) * Math.cos(φ);
      const y = Math.sin(θ) * Math.sin(φ);
      const z = Math.cos(θ);
      points.push({ w: 0, x, y, z });
    }
  }
  return points;
}

/**
 * stereographicProj(qp)
 * ────────────────────────────────────────────────────────────
 * 四元数 qp={w,x,y,z} をステレオ投影して {x,y,z} を返す
 *   X = x / (1 - w), Y = y / (1 - w), Z = z / (1 - w)
 */
export function stereographicProj(qp) {
  let denom = 1 - qp.w;
  if (Math.abs(denom) < 1e-6) denom = denom >= 0 ? 1e-6 : -1e-6;
  return {
    x: qp.x / denom,
    y: qp.y / denom,
    z: qp.z / denom
  };
}

/**
 * createAndAddPointCloud(scene, index, qRot, resTheta, resPhi)
 * ────────────────────────────────────────────────────────────
 *   1) 既存の点群 (name='quaternionSpherePoints') を削除
 *   2) 純虚四元数球を generateImagSpherePoints で取得
 *   3) 各点 p を rotatePoint(p, qRot) で回転
 *   4) 回転結果 qp を stereographicProj(qp) で投影
 *   5) 投影後座標を positions に、回転後の x 成分でグレースケールを colors に格納
 *   6) THREE.BufferGeometry + vertexColors マテリアルで THREE.Points を作って scene.add
 *
 * @param {THREE.Scene} scene
 * @param {number} index                           ログ用のインデックス
 * @param {{w:number, x:number, y:number, z:number}} qRot  回転用単位四元数
 * @param {number} resTheta
 * @param {number} resPhi
 * @returns {THREE.Points}
 */
export function createAndAddPointCloud(
  scene,
  index,
  qRot,
  resTheta = 40,
  resPhi = 40
) {
  console.log('--- createAndAddPointCloud() index =', index);
  console.log('    使用する回転四元数 qRot =', qRot);

  // 1) 既存の点群を削除
  const existing = scene.getObjectByName('quaternionSpherePoints');
  if (existing) {
    scene.remove(existing);
    existing.geometry.dispose();
    existing.material.dispose();
    console.log('    既存点群を削除');
  }

  // 2) 純虚四元数球を生成
  const rawImag = generateImagSpherePoints(resTheta, resPhi);
  const n = rawImag.length;
  console.log('    rawImag length =', n);

  // デバッグ用：サンプルインデックス配列
  const sampleIdx = [0, Math.floor(n / 2), n - 1];

  // 3) 回転→投影→色計算
  const positions = new Float32Array(n * 3);
  const colors    = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const p  = rawImag[i];                   // 純虚四元数 {w:0,x,y,z}
    const rp = rotatePoint(p, qRot);         // 回転後の四元数
    const sp = stereographicProj(rp);        // 投影後の {x,y,z}

    // (a) 位置を格納
    positions[3 * i + 0] = sp.x;
    positions[3 * i + 1] = sp.y;
    positions[3 * i + 2] = sp.z;

    // (b) i 成分 (rp.x) でグレースケール計算: (x+1)/2 ∈ [0,1]
    let gx = (rp.x + 1) / 2;
    gx = Math.min(Math.max(gx, 0), 1);
    colors[3 * i + 0] = gx;
    colors[3 * i + 1] = gx;
    colors[3 * i + 2] = gx;

    // (c) サンプルログ（index が 0, 中央, 最後の時のみ出力）
    if (sampleIdx.includes(i)) {
      console.log(
        `    サンプル i=${i}: p=`, p,
        `→ rp=`, rp,
        `→ sp=`, sp,
        `→ gray=${gx.toFixed(3)}`
      );
    }
  }
  console.log('    positions/colors を作成完了');

  // 4) BufferGeometry + 頂点色を使うマテリアルで THREE.Points を生成
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const mat = new THREE.PointsMaterial({
    size:            0.02,
    sizeAttenuation: true,
    vertexColors:    true
  });

  const points = new THREE.Points(geom, mat);
  points.name = 'quaternionSpherePoints';
  scene.add(points);

  console.log('    新しい点群を scene に追加 (n=', n, ')');
  console.log('-----------------------------------------');
  return points;
}
