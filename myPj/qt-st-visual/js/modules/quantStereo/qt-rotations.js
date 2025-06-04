// js/modules/quantStereo/qt-st-rotations.js

import { create, normalize } from './qt-quat-utils.js';

/**
 * getX90Rotations()
 * ────────────────────────────────────────────────────────────
 * x 軸まわりに 0°, 90°, 180°, 270° の回転を表す単位四元数の配列を返す
 *  q(θ) = (cos(θ/2), sin(θ/2)·1, 0, 0)
 */
export function getX90Rotations() {
  const angles = [
    0,
    Math.PI / 2,       // 90°
    Math.PI,           // 180°
    (3 * Math.PI) / 2  // 270°
  ];
  return angles.map(θ => {
    const h = θ / 2;
    const q = create(Math.cos(h), Math.sin(h), 0, 0);
    return normalize(q);
  });
}
