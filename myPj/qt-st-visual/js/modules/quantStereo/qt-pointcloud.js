// js/modules/quantStereo/qt-st-pointcloud.js

import * as THREE from 'three';
import { multiply, rotatePoint } from './qt-quat-utils.js';

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
      points.push({ w: 0, x, y, z });
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
 * createEarthGridRotatedPointCloud(scene, qRot, latLines, lonLines, samplesPerLine)
 * 「地球の緯度・経度線をドットで表現」し、それを純粋な3D回転 (rotatePoint) で
 * 回転させて描画します。色はブルー系です。
 *
 * @param {THREE.Scene} scene
 * @param {{w:number,x:number,y:number,z:number}} qRot  3D回転を表す単位四元数
 * @param {number[]} latLines     緯度ライン (度単位) の配列。例: [-60, -30, 0, 30, 60]
 * @param {number[]} lonLines     経度ライン (度単位) の配列。例: [0, 30, 60, ..., 330]
 * @param {number} samplesPerLine  各ラインあたりのサンプル点数 (>=2)
 */
export function createEarthGridRotatedPointCloud(
  scene,
  qRot,
  latLines = [-60, -30, 0, 30, 60],
  lonLines = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
  samplesPerLine = 100
) {
  // 1) 既存の『earthGridPoints』を削除
  const old = scene.getObjectByName('earthGridPoints');
  if (old) {
    scene.remove(old);
    old.geometry.dispose();
    old.material.dispose();
  }

  // 2) 緯度線・経度線をサンプリングして『純虚四元数点』を作成
  //    緯度: φ = deg→ラジアン (–90°～+90°)
  //    経度: λ = deg→ラジアン (0°～360°)
  const points = [];

  // (A) 緯度線 (latitude) をサンプリング
  for (let φdeg of latLines) {
    const φ = (φdeg * Math.PI) / 180;
    const cosφ = Math.cos(φ);
    const sinφ = Math.sin(φ);
    for (let i = 0; i < samplesPerLine; i++) {
      const λ = (i / (samplesPerLine - 1)) * 2 * Math.PI;
      const x = cosφ * Math.cos(λ);
      const y = cosφ * Math.sin(λ);
      const z = sinφ;
      points.push({ w: 0, x, y, z });
    }
  }

  // (B) 経度線 (longitude) をサンプリング
  for (let λdeg of lonLines) {
    const λ = (λdeg * Math.PI) / 180;
    for (let j = 0; j < samplesPerLine; j++) {
      const φ = ((j / (samplesPerLine - 1)) - 0.5) * Math.PI; // –π/2 .. +π/2
      const cosφ = Math.cos(φ);
      const sinφ = Math.sin(φ);
      const x = cosφ * Math.cos(λ);
      const y = cosφ * Math.sin(λ);
      const z = sinφ;
      points.push({ w: 0, x, y, z });
    }
  }

  const n = points.length;
  console.log(`[qt-st-pointcloud] EarthGrid: サンプル点数 = ${n}`);

  // 3) rotatePoint で 3D 回転させ、positions を作成
  const positions = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const rp = rotatePoint(p, qRot); // rp.w=0 のまま
    positions[3 * i + 0] = rp.x;
    positions[3 * i + 1] = rp.y;
    positions[3 * i + 2] = rp.z;
  }

  // 4) BufferGeometry + Blue のマテリアルで THREE.Points を作成
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size:            0.02,
    sizeAttenuation: true,
    color:           new THREE.Color(0.2, 0.5, 1.0), // 薄い青系
    opacity:         0.9,
    transparent:     true
  });

  const pointsMesh = new THREE.Points(geom, mat);
  pointsMesh.name = 'earthGridPoints';
  scene.add(pointsMesh);

  console.log('[qt-st-pointcloud] EarthGrid Rotated PointCloud を追加');
  return pointsMesh;
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
    const p = rawImag[i];
    const rp = rotatePoint(p, qRot);
    positions[3 * i + 0] = rp.x;
    positions[3 * i + 1] = rp.y;
    positions[3 * i + 2] = rp.z;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size:            0.015,
    sizeAttenuation: true,
    color:           0xff0000 // 赤
  });

  const points = new THREE.Points(geom, mat);
  points.name = 'rawRotatedSpherePoints';
  scene.add(points);
  return points;
}

/**
 * createAndAddPointCloud(scene, qRot, resTheta, resPhi)
 * 左乗算 (qRot * p) → ステレオ投影 → グレースケール → 白～灰で表示
 */
export function createAndAddPointCloud(
  scene,
  qRot,
  resTheta = 40,
  resPhi = 40
) {
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
    const p = rawImag[i];
    const rp = multiply(qRot, p);
    const sp = stereographicProj(rp);

    positions[3 * i + 0] = sp.x;
    positions[3 * i + 1] = sp.y;
    positions[3 * i + 2] = sp.z;

    let gx = (rp.x + 1) / 2;
    gx = Math.min(Math.max(gx, 0), 1);
    colors[3 * i + 0] = gx;
    colors[3 * i + 1] = gx;
    colors[3 * i + 2] = gx;

    if (sampleIdx.includes(i)) {
      console.log(
        `    サンプル i=${i}: rp=`, rp,
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
 * overlayEarthGridAndProjection(scene, qRot, resTheta, resPhi)
 * 「地球グリッド（青い緯度経度線球） + ステレオ投影球」を重ねて表示
 */
export function overlayEarthGridAndProjection(
  scene,
  qRot,
  resTheta = 40,
  resPhi = 40
) {
  // 既存オブジェクトを削除
  const oldGrid = scene.getObjectByName('earthGridPoints');
  if (oldGrid) {
    scene.remove(oldGrid);
    oldGrid.geometry.dispose();
    oldGrid.material.dispose();
  }
  const oldProj = scene.getObjectByName('quaternionSpherePoints');
  if (oldProj) {
    scene.remove(oldProj);
    oldProj.geometry.dispose();
    oldProj.material.dispose();
  }

  // (1) 地球グリッド（青）を追加
  createEarthGridRotatedPointCloud(
    scene,
    qRot,
    [-60, -30, 0, 30, 60],                  // 緯度ライン (度)
    [0,30,60,90,120,150,180,210,240,270,300,330], // 経度ライン (度)
    100                                     // 各ラインあたりサンプル数
  );

  // (2) ステレオ投影球（白→黒）を追加
  createAndAddPointCloud(scene, qRot, resTheta, resPhi);
}
