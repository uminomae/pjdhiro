// js/modules/quantStereo/qt-animation.js

import * as THREE from 'three';
import { FULL_CYCLE, HALF_CYCLE, ROTATION_SPEED, RES_THETA, RES_PHI } from './qt-config.js';
import { create, normalize } from './qt-quat-utils.js';
import { overlayEarthGridAndProjection } from './qt-pointcloud.js';

/**
 * 内部ステート
 */
let clock = null;            // THREE.Clock インスタンス
let rafId = null;            // requestAnimationFrame の返り値
let isPaused = false;        // 一時停止中フラグ
let accumulatedTime = 0;     // 一時停止中に「溜めておく経過時間」の補正値

/**
 * animationLoop(scene)
 *   ・「一時停止状態かどうか」をチェックし、停止中なら抜ける
 *   ・clock.getElapsedTime() + accumulatedTime を使って θ を計算
 *   ・overlayEarthGridAndProjection() で地球グリッド＋投影球の再描画
 *   ・背景色と球色（白/黒）を θ に合わせて切り替え
 *   ・次フレームを予約
 *
 * @param {THREE.Scene} scene
 */
function animationLoop(scene) {
  if (isPaused) return;

  // elapsed = 「今の経過時間(秒)」＋「一時停止前までに溜めた時間」
  const elapsed = clock.getElapsedTime() + accumulatedTime;
  const theta   = (elapsed * ROTATION_SPEED) % FULL_CYCLE; // θ ∈ [0, 4π)

  // — (1) 四元数回転を作成 (x 軸まわりに回転) —
  const half = theta / 2;
  const qRot = normalize(create(Math.cos(half), Math.sin(half), 0, 0));

  // — (2) 地球グリッド＋ステレオ投影球を再描画 —
  overlayEarthGridAndProjection(scene, qRot, RES_THETA, RES_PHI);

  // — (3) 背景色 (暗⇔明) の補間 —
  let bgColor;
  if (theta < HALF_CYCLE) {
    // 0 ≤ θ < 2π: 暗 → 明
    const t = theta / HALF_CYCLE; // 0→1
    bgColor = new THREE.Color(0x000011).clone().lerp(new THREE.Color(0xffffff), t);
  } else {
    // 2π ≤ θ < 4π: 明 → 暗
    const t = (theta - HALF_CYCLE) / HALF_CYCLE; // 0→1
    bgColor = new THREE.Color(0xffffff).clone().lerp(new THREE.Color(0x000011), t);
  }
  scene.background = bgColor;

  // — (4) 球の色 (オーバーレイ) を白／黒に切り替え —
  const projObj = scene.getObjectByName('quaternionSpherePoints');
  if (projObj && projObj.material) {
    if (theta < HALF_CYCLE) {
      projObj.material.color.set(0xffffff);
    } else {
      projObj.material.color.set(0x000000);
    }
    projObj.material.opacity = 1.0;
    projObj.material.transparent = true;
  }

  // — (5) 次フレームを予約 —
  rafId = requestAnimationFrame(() => animationLoop(scene));
}

/**
 * startAnimation(scene)
 *   ・初回に呼ばれたときのみ THREE.Clock を新規生成し、ループを開始
 *   ・既に rafId がある場合 (＝すでに開始済み) は何もしない
 *
 * @param {THREE.Scene} scene
 */
export function startAnimation(scene) {
  if (rafId !== null) {
    // すでに開始済みなら多重起動させない
    return;
  }
  console.log('[qt-animation] startAnimation()');
  clock = new THREE.Clock();
  isPaused = false;
  accumulatedTime = 0;
  animationLoop(scene);
}

/**
 * pauseAnimation()
 *   ・現在の rAF を cancel して一時停止
 *   ・clock.getElapsedTime() を accumulatedTime に足しておき、「途中までの経過」を保持
 */
export function pauseAnimation() {
  if (rafId === null || isPaused) {
    // すでに停止中／一時停止中の場合は無視
    return;
  }
  console.log('[qt-animation] pauseAnimation()');
  const elapsed = clock.getElapsedTime();
  accumulatedTime += elapsed;
  cancelAnimationFrame(rafId);
  rafId = null;
  isPaused = true;
}

/**
 * resumeAnimation(scene)
 *   ・一時停止中 (isPaused === true) かつ rafId が null のときだけ再開
 *
 * @param {THREE.Scene} scene
 */
export function resumeAnimation(scene) {
  if (!isPaused || rafId !== null) {
    // 一時停止状態でない or すでに何らかの rAF が動いているなら無視
    return;
  }
  console.log('[qt-animation] resumeAnimation()');
  clock = new THREE.Clock(); // elapsed はゼロから始まるが、accumulatedTime で補正するので問題なし
  isPaused = false;
  animationLoop(scene);
}

/**
 * stopAnimation()
 *   ・現在の rAF をキャンセルし、内部ステートを完全リセット
 *   ・シーン自体をクリアする場合は、この後 呼び出し側で scene.remove() などを行う
 */
export function stopAnimation() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
  console.log('[qt-animation] stopAnimation()');
  rafId = null;
  clock = null;
  accumulatedTime = 0;
  isPaused = false;
}
