// js/modules/quantStereo/qt-animation.js

import * as THREE from 'three';
import {
  FULL_CYCLE,
  HALF_CYCLE,
  ROTATION_SPEED,
  RES_THETA,
  RES_PHI,
  CAMERA_OSCILLATION_ENABLED,
  CAMERA_OSCILLATION_SPEED,
  CAMERA_OSCILLATION_RANGE
} from './qt-config.js';
import { create, normalize } from './qt-quat-utils.js';
import { overlayEarthGridAndProjection } from './qt-pointcloud.js';

let clock = null;         // THREE.Clock インスタンス
let rafId = null;         // requestAnimationFrame の返り値
let isPaused = false;     // 一時停止フラグ
let accumulatedTime = 0;  // 一時停止前の経過時間補正値

/**
 * getColorOrDefault(varName, defaultHex)
 *  ・window[varName] が THREE.Color ならそのまま返す
 *  ・文字列 "#rrggbb" なら new THREE.Color() に変換して返す
 *  ・未定義なら defaultHex を THREE.Color に変換して返す
 */
function getColorOrDefault(varName, defaultHex) {
  const v = window[varName];
  if (v instanceof THREE.Color) return v;
  if (typeof v === 'string') return new THREE.Color(v);
  return new THREE.Color(defaultHex);
}

/**
 * animationLoop(scene, camera, controls)
 *  ・isPaused が false のときのみ動作
 *  ・経過時間 'elapsed' を元に以下を実行:
 *    1. カメラを「原点を見ながら上下往復」(oscillation) させる
 *    2. 四元数回転 (x 軸まわり) を生成
 *    3. 地球グリッド＋ステレオ投影球を再描画
 *    4. 背景色と投影球色の補間
 *    5. controls.update() と次フレーム予約
 *
 * @param {THREE.Scene}    scene
 * @param {THREE.Camera}   camera
 * @param {OrbitControls}  controls
 */
function animationLoop(scene, camera, controls) {
  if (isPaused) return;

  const elapsed = clock.getElapsedTime() + accumulatedTime;
  const theta   = (elapsed * ROTATION_SPEED) % FULL_CYCLE; // θ ∈ [0,4π)

  // ────────────────────────────────────────────────────────────
  // (1) カメラを原点を見ながら「上下に往復」させる
  // ────────────────────────────────────────────────────────────
  if (CAMERA_OSCILLATION_ENABLED) {
    // (A) カメラの半径 (r) と方位角 (φ) を算出
    const r   = Math.hypot(camera.position.x, camera.position.y, camera.position.z);
    const phi = Math.atan2(camera.position.z, camera.position.x);

    const RANGE    = CAMERA_OSCILLATION_RANGE;
    const raw      = (elapsed * CAMERA_OSCILLATION_SPEED) % (2 * RANGE);
    const oscTheta = raw <= RANGE ? raw : (2 * RANGE - raw);
    // (B) elapsed を元に極角 θ_osc を 0～π の範囲で往復させる
    //     Math.sin(elapsed * speed) が −1～+1 を往復するので、
    //     (sin + 1)/2 → 0～1 → × π で 0～π を往復
    // const oscTheta = (Math.sin(elapsed * CAMERA_OSCILLATION_SPEED) + 1) / 2 * Math.PI;

    // (C) 極座標 → デカルト変換して camera.position を更新
    camera.position.set(
      r * Math.sin(oscTheta) * Math.cos(phi),
      r * Math.cos(oscTheta),
      r * Math.sin(oscTheta) * Math.sin(phi)
    );
    camera.lookAt(0, 0, 0);
  }

  // ────────────────────────────────────────────────────────────
  // (2) 四元数回転を生成 (x 軸まわりに回転)
  // ────────────────────────────────────────────────────────────
  const half = theta / 2;
  const qRot = normalize(
    create(Math.cos(half), Math.sin(half), 0, 0)
  );

  // ────────────────────────────────────────────────────────────
  // (3) 地球グリッド＋ステレオ投影球を再描画
  // ────────────────────────────────────────────────────────────
  overlayEarthGridAndProjection(scene, qRot, RES_THETA, RES_PHI);

  // ────────────────────────────────────────────────────────────
  // (4) 背景色 (暗⇔明⇔暗) の補間
  // ────────────────────────────────────────────────────────────
  const bgDark  = getColorOrDefault('_bgColorDark',  '#000011');
  const bgLight = getColorOrDefault('_bgColorLight', '#ffffff');

  if (theta < HALF_CYCLE) {
    // 0 ≤ θ < 2π: 暗 → 明
    const t = theta / HALF_CYCLE; // 0 → 1
    scene.background = bgDark.clone().lerp(bgLight, t);
  } else {
    // 2π ≤ θ < 4π: 明 → 暗
    const t = (theta - HALF_CYCLE) / HALF_CYCLE; // 0 → 1
    scene.background = bgLight.clone().lerp(bgDark, t);
  }

  // ────────────────────────────────────────────────────────────
  // (5) 投影球の色を４段階補間で設定
  // ────────────────────────────────────────────────────────────
  const projObj = scene.getObjectByName('quaternionSpherePoints');
  if (projObj && projObj.material) {
    const baseColor = getColorOrDefault('_sphereBaseColor', '#ffffff');
    const midColor  = getColorOrDefault('_peakColor1',    '#808080');
    const endColor  = getColorOrDefault('_peakColor2',    '#000000');
    const color     = new THREE.Color();
    const fracDeg   = ((theta % HALF_CYCLE) / HALF_CYCLE) * 360; // 0～360

    if (theta < HALF_CYCLE) {
      // 1st 回転: 0°～360°を「base→mid→end→mid」で補間
      if (fracDeg < 120) {
        color.copy(baseColor).lerp(midColor, fracDeg / 120);
      } else if (fracDeg < 240) {
        color.copy(midColor).lerp(endColor, (fracDeg - 120) / 120);
      } else {
        color.copy(endColor).lerp(midColor, (fracDeg - 240) / 120);
      }
    } else {
      // 2nd 回転: 0°～360°を「mid→end→mid→base」で補間
      if (fracDeg < 120) {
        color.copy(midColor).lerp(endColor, fracDeg / 120);
      } else if (fracDeg < 240) {
        color.copy(endColor).lerp(midColor, (fracDeg - 120) / 120);
      } else {
        color.copy(midColor).lerp(baseColor, (fracDeg - 240) / 120);
      }
    }

    projObj.material.color.copy(color);
    projObj.material.opacity     = 1.0;
    projObj.material.transparent = true;
  }

  // ────────────────────────────────────────────────────────────
  // (6) OrbitControls の update とカメラ位置表示更新
  // ────────────────────────────────────────────────────────────
  controls.update();

  const posDiv = document.getElementById('camera-position-display');
  if (posDiv) {
    posDiv.innerText = `Camera: x=${camera.position.x.toFixed(1)}, y=${camera.position.y.toFixed(1)}, z=${camera.position.z.toFixed(1)}`;
  }

  // ────────────────────────────────────────────────────────────
  // (7) 次フレームを予約
  // ────────────────────────────────────────────────────────────
  rafId = requestAnimationFrame(() => animationLoop(scene, camera, controls));
}

/**
 * startAnimation(scene, camera, controls)
 *  ・既に動作中でなければコールバックを開始
 */
export function startAnimation(scene, camera, controls) {
  if (rafId !== null) return;
  console.log('[qt-animation] startAnimation()');
  clock           = new THREE.Clock();
  isPaused        = false;
  accumulatedTime = 0;
  animationLoop(scene, camera, controls);
}

/**
 * pauseAnimation()
 *  ・一時停止し、elapsedTime を accumulatedTime に蓄積
 */
export function pauseAnimation() {
  if (rafId === null || isPaused) return;
  console.log('[qt-animation] pauseAnimation()');
  accumulatedTime += clock.getElapsedTime();
  cancelAnimationFrame(rafId);
  rafId    = null;
  isPaused = true;
}

/**
 * resumeAnimation(scene, camera, controls)
 *  ・一時停止中であれば再開
 */
export function resumeAnimation(scene, camera, controls) {
  if (!isPaused || rafId !== null) return;
  console.log('[qt-animation] resumeAnimation()');
  clock    = new THREE.Clock();
  isPaused = false;
  animationLoop(scene, camera, controls);
}

/**
 * stopAnimation()
 *  ・アニメーションを停止し、内部ステートをクリア
 */
export function stopAnimation() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
  console.log('[qt-animation] stopAnimation()');
  rafId           = null;
  clock           = null;
  accumulatedTime = 0;
  isPaused        = false;
}
