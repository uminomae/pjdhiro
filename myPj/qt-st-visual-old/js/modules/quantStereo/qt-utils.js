// js/modules/quant-stereo/utils.js
import * as THREE from 'three';

/**
 * 四元数 S^3 上を分割サンプリングし、ステレオ投影を行うユーティリティ。
 * (w,x,y,z) を ℝ³ の (X,Y,Z) に投影し、THREE.Vector3 + THREE.Color の配列で返す。
 *
 * @param {number} resTheta   - α の分解能（0..π/2 の範囲を分割する数）
 * @param {number} resPhi     - θ の分解能（0..π の範囲を分割する数）
 * @param {string} projectionType - 'north' or 'south'
 * @returns {Array<{ position: THREE.Vector3, color: THREE.Color }>}
 */
export function createQuaternionStereographicPoints(resTheta, resPhi, projectionType = 'north') {
  const points = [];

  for (let i = 0; i <= resTheta; i++) {
    const alpha = (Math.PI / 2) * (i / resTheta);
    const sinA = Math.sin(alpha);
    const cosA = Math.cos(alpha);

    for (let j = 0; j <= resPhi; j++) {
      const theta = Math.PI * (j / resPhi);
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);
      const phi = 2 * Math.PI * (j / resPhi);
      const sinP = Math.sin(phi);
      const cosP = Math.cos(phi);

      const w = cosA;
      const x = sinA * sinT * cosP;
      const y = sinA * sinT * sinP;
      const z = sinA * cosT;

      let denom = projectionType === 'north' ? 1 + w : 1 - w;
      if (Math.abs(denom) < 1e-6) continue;

      const X = x / denom;
      const Y = y / denom;
      const Z = z / denom;

      const t = sinA; // 色合いの係数 (0..1)
      const color = new THREE.Color().setHSL(t * 0.7, 1.0, 0.5);

      points.push({ position: new THREE.Vector3(X, Y, Z), color });
    }
  }

  return points;
}
