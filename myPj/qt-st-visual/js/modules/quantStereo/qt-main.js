// js/modules/quantStereo/qt-main.js

import { initUI } from './qt-init/qt-st-init.js';
import { addHelpersAndLights } from './qt-init/qt-st-init-helpers.js';
import {
  overlayBothPointClouds
} from './qt-st-pointcloud.js';
import { getX90Rotations }  from './qt-st-rotations.js';
import { RES_THETA, RES_PHI } from './qt-config.js';
import * as THREE from 'three';

let rotList       = [];
let currentIndex  = 0;
let isAnimating   = false;
let animStartTime = 0;
let animDuration  = 1.0; // 1秒かけて90度回転
let qStart         = null;
let qEnd           = null;
const clock       = new THREE.Clock();

/**
 * initialize(context)
 * ────────────────────────────────────────────────────────────
 * 1) 照明と軸ヘルパーを追加
 * 2) UI を初期化
 * 3) 回転 quaternion リストを生成
 * 4) 初期の点群を overlayBothPointClouds で生成
 * 5) NEXT_QUATERNION イベントで開始アニメーション
 * 6) アニメーションループを開始
 */
export function initialize({ scene, camera, renderer, controls }) {
  console.log('[qt-main] initialize() START');

  // 1) 照明と軸ヘルパー
  addHelpersAndLights(scene);

  // 2) UI 初期化
  initUI({ scene, camera, renderer, controls });

  // 3) 回転 quaternion リスト生成
  rotList = getX90Rotations();
  console.log('[qt-main] rotList =', rotList);

  // 4) 初期点群を重ねて表示 (Index=0)
  overlayBothPointClouds(
    scene,
    rotList[0],
    RES_THETA,
    RES_PHI
  );

  // 5) Next Q ボタン押下時にアニメーションをスタート
  window.addEventListener('NEXT_QUATERNION', () => {
    if (isAnimating) return; // すでにアニメ中なら無視
    currentIndex = (currentIndex + 1) % rotList.length;

    qStart = rotList[(currentIndex + rotList.length - 1) % rotList.length];
    qEnd   = rotList[currentIndex];
    animStartTime = clock.getElapsedTime();
    isAnimating = true;
  });

  // 6) アニメーションループ (Three.js のレンダリングループとは別)
  (function animate() {
    requestAnimationFrame(animate);
    if (isAnimating) {
      const elapsed = clock.getElapsedTime() - animStartTime;
      let t = elapsed / animDuration;
      if (t >= 1.0) {
        t = 1.0;
        isAnimating = false;
      }
      // SLERP: slerp(qStart, qEnd, t) を自前で実装
      const qAnim = slerp(qStart, qEnd, t);
      overlayBothPointClouds(scene, qAnim, RES_THETA, RES_PHI);
    }
  })();

  console.log('[qt-main] initialize() COMPLETE');
}

/**
 * slerp(q1, q2, t)
 * ────────────────────────────────────────────────────────────
 * 単位四元数 q1 → q2 を t ∈ [0,1] のときに滑らかに補間
 */
function slerp(q1, q2, t) {
  // コサイン類似度 = q1·q2
  let dot = q1.w*q2.w + q1.x*q2.x + q1.y*q2.y + q1.z*q2.z;
  // 内積が負の場合、補間を裏返して最短経路にする
  if (dot < 0) {
    dot = -dot;
    q2 = { w: -q2.w, x: -q2.x, y: -q2.y, z: -q2.z };
  }
  if (dot > 0.9995) {
    // ほぼ並行なら線形補間
    const w = q1.w + t*(q2.w - q1.w);
    const x = q1.x + t*(q2.x - q1.x);
    const y = q1.y + t*(q2.y - q1.y);
    const z = q1.z + t*(q2.z - q1.z);
    // 正規化して返す
    const len = Math.hypot(w,x,y,z);
    return { w:w/len, x:x/len, y:y/len, z:z/len };
  }
  // θ = acos(dot)
  const θ = Math.acos(dot);
  const sinθ = Math.sin(θ);
  const a = Math.sin((1 - t)*θ) / sinθ;
  const b = Math.sin( t   *θ) / sinθ;
  return {
    w: q1.w * a + q2.w * b,
    x: q1.x * a + q2.x * b,
    y: q1.y * a + q2.y * b,
    z: q1.z * a + q2.z * b
  };
}
