// js/modules/quantStereo/qt-render-pointcloud.js

import * as THREE from 'three';
import { multiply, rotatePoint } from './qt-math-quat-utils.js';
import {
  EARTH_GRID_LAT_LINES,
  EARTH_GRID_LON_LINES,
  EARTH_GRID_SAMPLES_PER_LINE,
  EARTH_GRID_COLOR,
  EARTH_GRID_POINT_SIZE,
  PROJ_SPHERE_POINT_SIZE
} from './qt-config.js';

/**
 * generateImagSpherePoints(resTheta, resPhi)
 * 「w=0, x²+y²+z²=1」の純虚四元数点群を生成して返す
 * （既存まま）
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
 * （既存まま）
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
 * createEarthGridRotatedPointCloud(scene, qRot)
 * ────────────────────────────────────────────────────────────
 * 「地球の緯度・経度線をドットで表現」し、
 * それを純粋な3D回転 (rotatePoint) で回転させて描画します。
 * 点数・色・サイズは config から取得します。
 *
 * @param {THREE.Scene} scene
 * @param {{w:number,x:number,y:number,z:number}} qRot  3D回転を表す単位四元数
 */
export function createEarthGridRotatedPointCloud(scene, qRot) {
  // ────────────────────────────────────────────────────────
  // (1) 既存の『earthGridPoints』を削除
  // ────────────────────────────────────────────────────────
  const old = scene.getObjectByName('earthGridPoints');
  if (old) {
    scene.remove(old);
    old.geometry.dispose();
    old.material.dispose();
  }

  // ────────────────────────────────────────────────────────
  // (2) 緯度ライン・経度ラインをサンプリングして
  //     『純虚四元数点』を作成
  // ────────────────────────────────────────────────────────
  const points = [];

  // (A) 緯度線 (latitude) をサンプリング
  for (let φdeg of EARTH_GRID_LAT_LINES) {
    const φ = (φdeg * Math.PI) / 180;  // 緯度角をラジアンに変換
    const cosφ = Math.cos(φ);
    const sinφ = Math.sin(φ);
    for (let i = 0; i < EARTH_GRID_SAMPLES_PER_LINE; i++) {
      const λ = (i / (EARTH_GRID_SAMPLES_PER_LINE - 1)) * 2 * Math.PI; // 経度0～2π
      const x = cosφ * Math.cos(λ);
      const y = cosφ * Math.sin(λ);
      const z = sinφ;
      points.push({ w: 0, x, y, z });
    }
  }

  // (B) 経度線 (longitude) をサンプリング
  for (let λdeg of EARTH_GRID_LON_LINES) {
    const λ = (λdeg * Math.PI) / 180;  // 経度角をラジアンに変換
    for (let j = 0; j < EARTH_GRID_SAMPLES_PER_LINE; j++) {
      const φ = ((j / (EARTH_GRID_SAMPLES_PER_LINE - 1)) - 0.5) * Math.PI; // –π/2 .. +π/2
      const cosφ = Math.cos(φ);
      const sinφ = Math.sin(φ);
      const x = cosφ * Math.cos(λ);
      const y = cosφ * Math.sin(λ);
      const z = sinφ;
      points.push({ w: 0, x, y, z });
    }
  }

  const n = points.length;
  // console.log(`[qt-render-pointcloud] EarthGrid: サンプル点数 = ${n}`);

  // ────────────────────────────────────────────────────────
  // (3) rotatePoint で 3D 回転を適用し、positions を作成
  // ────────────────────────────────────────────────────────
  const positions = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const rp = rotatePoint(p, qRot); // 回転後の点 (w=0 のまま)
    positions[3 * i + 0] = rp.x;
    positions[3 * i + 1] = rp.y;
    positions[3 * i + 2] = rp.z;
  }

  // ────────────────────────────────────────────────────────
  // (4) BufferGeometry + PointsMaterial を作成 (色・サイズは config から取得)
  // ────────────────────────────────────────────────────────
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // PointsMaterial の color → EARTH_GRID_COLOR ／ size → EARTH_GRID_POINT_SIZE
  const mat = new THREE.PointsMaterial({
    size:            EARTH_GRID_POINT_SIZE,
    sizeAttenuation: true,
    color:           new THREE.Color(EARTH_GRID_COLOR),
    opacity:         0.9,
    transparent:     true
  });

  // ────────────────────────────────────────────────────────
  // (5) Points オブジェクトを作成してシーンに追加
  // ────────────────────────────────────────────────────────
  const pointsMesh = new THREE.Points(geom, mat);
  pointsMesh.name = 'earthGridPoints';
  scene.add(pointsMesh);

  // console.log('[qt-render-pointcloud] EarthGrid Rotated PointCloud を追加');
  return pointsMesh;
}


/**
 * createAndAddPointCloud(scene, qRot, resTheta, resPhi)
 *  既存の「ステレオ投影球」をそのまま描画する関数です。
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
      // console.log(
      //   `    サンプル i=${i}: rp=`, rp,
      //   `→ sp=`, sp,
      //   `→ gray=${gx.toFixed(3)}`
      // );
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const mat = new THREE.PointsMaterial({
    size:            PROJ_SPHERE_POINT_SIZE,
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
 * 地球グリッド（青い緯度経度線球） + ステレオ投影球 を重ねて表示
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

  // (1) 地球グリッド（青系）を追加
  const gridSphere = createEarthGridRotatedPointCloud(scene, qRot);
  const checkboxGrid = document.getElementById('toggle-grid-sphere');
  if (checkboxGrid instanceof HTMLInputElement) {
    gridSphere.visible = window._earthGridVisible;
    // gridSphere.visible = checkboxGrid.checked;
  }

  // (2) ステレオ投影球（白→灰→黒→…）を追加
  createAndAddPointCloud(scene, qRot, resTheta, resPhi);
}
