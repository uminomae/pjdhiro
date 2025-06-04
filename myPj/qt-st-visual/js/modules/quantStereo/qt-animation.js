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
 *   ・「一時停止状態かどうか」をチェックし、停止中なら折り返す
 *   ・clock.getElapsedTime() + accumulatedTime を使って θ を算出
 *   ・overlayEarthGridAndProjection() で地球グリッド＋投影球を再描画
 *   ・背景色および球色を θ の値に応じて補間
 *   ・次フレームを requestAnimationFrame で予約
 *
 * @param {THREE.Scene} scene
 */
function animationLoop(scene) {
  if (isPaused) return;

  // elapsed = 「現在の経過 (秒)」 + 「一時停止前に累積した時間」
  const elapsed = clock.getElapsedTime() + accumulatedTime;
  const theta   = (elapsed * ROTATION_SPEED) % FULL_CYCLE; // θ ∈ [0, 4π)

  // — (1) 四元数回転を作成 (x 軸まわりに回転) —
  const half = theta / 2;
  const qRot = normalize(create(Math.cos(half), Math.sin(half), 0, 0));

  // — (2) 地球グリッド＋ステレオ投影球を再描画 —
  overlayEarthGridAndProjection(scene, qRot, RES_THETA, RES_PHI);

  // — (3) 背景色 (暗⇔明⇔暗) の補間 —
  if (theta < HALF_CYCLE) {
    // 0 ≤ θ < 2π: 暗 → 明
    const t = theta / HALF_CYCLE; // 0 → 1
    scene.background = new THREE.Color(0x000011).clone().lerp(new THREE.Color(0xffffff), t);
  } else {
    // 2π ≤ θ < 4π: 明 → 暗
    const phi = theta - HALF_CYCLE;            // φ ∈ [0, 2π)
    const t   = phi / HALF_CYCLE;              // 0 → 1
    scene.background = new THREE.Color(0xffffff).clone().lerp(new THREE.Color(0x000011), t);
  }

  // — (4) 球のオーバーレイ色を「4段階補間」で設定 —
  const projObj = scene.getObjectByName('quaternionSpherePoints');
  if (projObj && projObj.material) {
    // θ < 2π のとき「１回転目: 白 → 灰 → 黒 → 灰」
    // θ ≥ 2π のとき「２回転目: 灰 → 黒 → 灰 → 白」
    let color = new THREE.Color();

    if (theta < HALF_CYCLE) {
      // 1st revolution (0 ≤ θ < 2π)
      const frac = (theta / HALF_CYCLE) * 360; // 0～360 (degrees within first rev)
      if (frac < 120) {
        // 0°～120°: 白 → 灰
        const t = frac / 120;
        color.copy(new THREE.Color(0xffffff)).lerp(new THREE.Color(0x808080), t);
      } else if (frac < 240) {
        // 120°～240°: 灰 → 黒
        const t = (frac - 120) / 120;
        color.copy(new THREE.Color(0x808080)).lerp(new THREE.Color(0x000000), t);
      } else {
        // 240°～360°: 黒 → 灰
        const t = (frac - 240) / 120;
        color.copy(new THREE.Color(0x000000)).lerp(new THREE.Color(0x808080), t);
      }
    } else {
      // 2nd revolution (2π ≤ θ < 4π)
      const phi = theta - HALF_CYCLE;
      const frac = (phi / HALF_CYCLE) * 360; // 0～360 (degrees within second rev)
      if (frac < 120) {
        // 0°～120°: 灰 → 黒
        const t = frac / 120;
        color.copy(new THREE.Color(0x808080)).lerp(new THREE.Color(0x000000), t);
      } else if (frac < 240) {
        // 120°～240°: 黒 → 灰
        const t = (frac - 120) / 120;
        color.copy(new THREE.Color(0x000000)).lerp(new THREE.Color(0x808080), t);
      } else {
        // 240°～360°: 灰 → 白
        const t = (frac - 240) / 120;
        color.copy(new THREE.Color(0x808080)).lerp(new THREE.Color(0xffffff), t);
      }
    }

    projObj.material.color.copy(color);
    projObj.material.opacity = 1.0;
    projObj.material.transparent = true;
  }

  // — (5) 次フレームを予約 —
  rafId = requestAnimationFrame(() => animationLoop(scene));
}

/**
 * startAnimation(scene)
 *   ・初回に呼ばれたときのみ THREE.Clock を新規生成し、ループを開始
 *   ・既に rafId が入っている (＝すでに動いている) 場合は何もしない
 *
 * @param {THREE.Scene} scene
 */
export function startAnimation(scene) {
  if (rafId !== null) {
    // すでにアニメーション中なら何もしない
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
 *   ・現在の requestAnimationFrame をキャンセルして一時停止
 *   ・clock.getElapsedTime() を accumulatedTime に足して、「途中までの経過」を保持
 */
export function pauseAnimation() {
  if (rafId === null || isPaused) {
    // すでに停止中 or 既に一時停止中なら何もしない
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
 *   ・一時停止中 (isPaused === true) かつ rafId === null のときだけ再開
 *
 * @param {THREE.Scene} scene
 */
export function resumeAnimation(scene) {
  if (!isPaused || rafId !== null) {
    // 一時停止状態でない or 既に rAF が存在するなら何もしない
    return;
  }
  console.log('[qt-animation] resumeAnimation()');
  clock = new THREE.Clock(); // elapsed はゼロから始まるが accumulatedTime で補正
  isPaused = false;
  animationLoop(scene);
}

/**
 * stopAnimation()
 *   ・現在の rAF をキャンセルし、内部ステートを完全リセット
 *   ・シーンを完全にクリアしたい場合は、呼び出し側で scene.children を全削除するなどを行う
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
