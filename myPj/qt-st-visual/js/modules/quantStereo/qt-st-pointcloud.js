// js/modules/quantStereo/qt-st-pointcloud.js

import * as THREE from 'three';
import {
  multiply,
  rotatePoint   // 3D 回転を行うユーティリティ
} from './qt-quat-utils.js';

/**
 * generateImagSpherePoints(resTheta, resPhi)
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
      points.push({ w: 0, x, y, z });  // 純虚四元数
    }
  }
  return points;
}

/**
 * stereographicProj(qp)
 * 四元数 qp={w,x,y,z} をステレオ投影して {x,y,z} を返す
 *   X = x/(1 - w), Y = y/(1 - w), Z = z/(1 - w)
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
 * createRawRotatedPointCloud(scene, qRot, resTheta, resPhi)
 * 「純粋に3D回転だけ（rotatePoint）」で得られる (rp.x, rp.y, rp.z) を赤色で表示
 */
export function createRawRotatedPointCloud(
  scene,
  qRot,
  resTheta = 40,
  resPhi = 40
) {
  // 既存の赤い球を削除
  const oldRaw = scene.getObjectByName('rawRotatedSpherePoints');
  if (oldRaw) {
    scene.remove(oldRaw);
    oldRaw.geometry.dispose();
    oldRaw.material.dispose();
  }

  const rawImag = generateImagSpherePoints(resTheta, resPhi);
  const n = rawImag.length;
  const positions = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const p  = rawImag[i];               // {w:0,x,y,z}
    const rp = rotatePoint(p, qRot);     // 純粋に3D回転 (rp.w = 0)
    positions[3 * i + 0] = rp.x;
    positions[3 * i + 1] = rp.y;
    positions[3 * i + 2] = rp.z;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size:            0.015,
    sizeAttenuation: true,
    color:           0xff0000  // 赤
  });

  const points = new THREE.Points(geom, mat);
  points.name = 'rawRotatedSpherePoints';
  scene.add(points);
  return points;
}

/**
 * createAndAddPointCloud(scene, qRot, resTheta, resPhi)
 *  左乗算 (qRot * p) → ステレオ投影 → グレースケール → 白～灰で表示
 */
export function createAndAddPointCloud(
  scene,
  qRot,
  resTheta = 40,
  resPhi = 40
) {
  // 既存の投影済み球を削除
  const oldProj = scene.getObjectByName('quaternionSpherePoints');
  if (oldProj) {
    scene.remove(oldProj);
    oldProj.geometry.dispose();
    oldProj.material.dispose();
  }

  const rawImag = generateImagSpherePoints(resTheta, resPhi);
  const n = rawImag.length;
  const positions = new Float32Array(n * 3);
  const colors    = new Float32Array(n * 3);
  const sampleIdx = [0, Math.floor(n / 2), n - 1];

  for (let i = 0; i < n; i++) {
    const p  = rawImag[i];       
    const rp = multiply(qRot, p);       // 左乗算
    const sp = stereographicProj(rp);   // 投影後 (X,Y,Z)

    positions[3 * i + 0] = sp.x;
    positions[3 * i + 1] = sp.y;
    positions[3 * i + 2] = sp.z;

    let gx = (rp.x + 1) / 2;  // グレースケール
    gx = Math.min(Math.max(gx, 0), 1);
    colors[3 * i + 0] = gx;
    colors[3 * i + 1] = gx;
    colors[3 * i + 2] = gx;

    if (sampleIdx.includes(i)) {
      console.log(
        `★ sp/rp sample i=${i}: rp=`, rp,
        `→ sp=`, sp,
        `→ gray=${gx.toFixed(3)}`
      );
    }
  }

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
  return points;
}

/**
 * overlayBothPointClouds(scene, qRot, resTheta, resPhi)
 * 「赤い回転のみ球 ＋ 白～灰の投影済み球」を重ねて表示
 */
export function overlayBothPointClouds(
  scene,
  qRot,
  resTheta = 40,
  resPhi = 40
) {
  // (1) 既存の赤い球と投影済み球を削除
  const oldRaw  = scene.getObjectByName('rawRotatedSpherePoints');
  if (oldRaw) {
    scene.remove(oldRaw);
    oldRaw.geometry.dispose();
    oldRaw.material.dispose();
  }
  const oldProj = scene.getObjectByName('quaternionSpherePoints');
  if (oldProj) {
    scene.remove(oldProj);
    oldProj.geometry.dispose();
    oldProj.material.dispose();
  }

  // (2) 赤い回転のみ球を追加
  createRawRotatedPointCloud(scene, qRot, resTheta, resPhi);

  // (3) 白～灰のステレオ投影球を追加
  createAndAddPointCloud(scene, qRot, resTheta, resPhi);
}
