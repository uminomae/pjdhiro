// js/modules/quantStereo/qt-quat-utils.js

/**
 * multiply(q1, q2)
 * ────────────────────────────────────────────────────────────
 * 四元数 q1 * q2 を返す (スカラー＋ベクトル成分の標準乗算)
 */
export function multiply(q1, q2) {
  return {
    w: q1.w*q2.w - q1.x*q2.x - q1.y*q2.y - q1.z*q2.z,
    x: q1.w*q2.x + q1.x*q2.w + q1.y*q2.z - q1.z*q2.y,
    y: q1.w*q2.y - q1.x*q2.z + q1.y*q2.w + q1.z*q2.x,
    z: q1.w*q2.z + q1.x*q2.y - q1.y*q2.x + q1.z*q2.w
  };
}

/**
 * conjugate(q)
 * ────────────────────────────────────────────────────────────
 * 共役四元数 (w, -x, -y, -z) を返す
 */
export function conjugate(q) {
  return { w: q.w, x: -q.x, y: -q.y, z: -q.z };
}

/**
 * normalize(q)
 * ────────────────────────────────────────────────────────────
 * ノルムを 1 にした単位四元数を返す
 */
export function normalize(q) {
  const n = Math.hypot(q.w, q.x, q.y, q.z);
  if (n < 1e-8) return { w: 1, x: 0, y: 0, z: 0 };
  return { w: q.w / n, x: q.x / n, y: q.y / n, z: q.z / n };
}

/**
 * create(w, x, y, z)
 * ────────────────────────────────────────────────────────────
 * 単純に {w,x,y,z} オブジェクトを生成
 */
export function create(w, x, y, z) {
  return { w, x, y, z };
}

/**
 * rotatePoint(pureP, q)
 * ────────────────────────────────────────────────────────────
 * 「純虚四元数 pureP = {w:0, x,y,z}」を
 *  単位四元数 q で回転した結果 (q * pureP * conj(q)) を返す
 */
export function rotatePoint(pureP, q) {
  // (1) q * pureP
  const qp = multiply(q, pureP);
  // (2) (q * pureP) * conj(q)
  return multiply(qp, conjugate(q));
}
