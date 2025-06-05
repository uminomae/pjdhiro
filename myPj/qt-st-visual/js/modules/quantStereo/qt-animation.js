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

let clock = null;
let rafId = null;
let isPaused = false;
let accumulatedTime = 0;

/**
 * window 上の変数(varName)を THREE.Color として取得。
 * 未定義なら defaultHex で新規生成。
 */
function getColorOrDefault(varName, defaultHex) {
  const v = window[varName];
  if (v instanceof THREE.Color) return v;
  if (typeof v === 'string') return new THREE.Color(v);
  return new THREE.Color(defaultHex);
}

/**
 * アニメーションループ本体
 * 1) カメラ上下往復 (oscillation)
 * 2) 四元数回転を生成
 * 3) 地球グリッド＋ステレオ投影球を再描画
 * 4) 背景色・投影球色の補間
 * 5) controls.update() と次フレーム予約
 */
function animationLoop(scene, camera, controls) {
  if (isPaused) return;

  const elapsed = clock.getElapsedTime() + accumulatedTime;
  const theta   = (elapsed * ROTATION_SPEED) % FULL_CYCLE;

  // 1) カメラ上下往復 (oscillation)
  if (CAMERA_OSCILLATION_ENABLED) {
    const r   = Math.hypot(camera.position.x, camera.position.y, camera.position.z);
    const phi = Math.atan2(camera.position.z, camera.position.x);
    const RANGE = CAMERA_OSCILLATION_RANGE;
    const raw   = (elapsed * CAMERA_OSCILLATION_SPEED) % (2 * RANGE);
    const oscTheta = raw <= RANGE ? raw : (2 * RANGE - raw);

    camera.position.set(
      r * Math.sin(oscTheta) * Math.cos(phi),
      r * Math.cos(oscTheta),
      r * Math.sin(oscTheta) * Math.sin(phi)
    );
    camera.lookAt(0, 0, 0);
  }

  // 2) 四元数回転 (x軸まわり)
  const halfQ = theta / 2;
  const qRot  = normalize(create(Math.cos(halfQ), Math.sin(halfQ), 0, 0));

  // 3) 地球グリッド＋ステレオ投影球の再描画
  overlayEarthGridAndProjection(scene, qRot, RES_THETA, RES_PHI);

  // 4) 背景色（暗⇔明⇔暗）の補間
  const bgDark  = getColorOrDefault('_bgColorDark',  '#000011');
  const bgLight = getColorOrDefault('_bgColorLight', '#ffffff');
  if (theta < HALF_CYCLE) {
    const t = theta / HALF_CYCLE; // 0→1
    const tAdjusted = Math.pow(t, 2); // < 1のとき tAdjusted>t → 明くなるのを早く見せたい
    scene.background = bgDark.clone().lerp(bgLight, t);
  } else {
    const t = (theta - HALF_CYCLE) / HALF_CYCLE;
    const tAdjusted = Math.pow(t, 0.5); // < 1のとき 値が小さいほど早くピークになる
    scene.background = bgLight.clone().lerp(bgDark, t);
  }

  // 投影球の色を４段階補間で設定
  const projObj = scene.getObjectByName('quaternionSpherePoints');
  if (projObj && projObj.material) {
    const baseColor = getColorOrDefault('_sphereBaseColor', '#ffffff');
    const midColor  = getColorOrDefault('_peakColor1',    '#808080');
    const endColor  = getColorOrDefault('_peakColor2',    '#000000');
    const color     = new THREE.Color();
    const fracDeg   = ((theta % HALF_CYCLE) / HALF_CYCLE) * 360;

    if (theta < HALF_CYCLE) {
      if (fracDeg < 120) {
        color.copy(baseColor).lerp(midColor, fracDeg / 120);
      } else if (fracDeg < 240) {
        color.copy(midColor).lerp(endColor, (fracDeg - 120) / 120);
      } else {
        color.copy(endColor).lerp(midColor, (fracDeg - 240) / 120);
      }
    } else {
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

  // 5) OrbitControls 更新と次フレーム予約
  controls.update();
  const posDiv = document.getElementById('camera-position-display');
  if (posDiv) {
    posDiv.innerText = `Camera: x=${camera.position.x.toFixed(1)}, y=${camera.position.y.toFixed(1)}, z=${camera.position.z.toFixed(1)}`;
  }
  rafId = requestAnimationFrame(() => animationLoop(scene, camera, controls));
}

/**
 * アニメーション開始
 */
export function startAnimation(scene, camera, controls) {
  if (rafId !== null) return;
  clock = new THREE.Clock();
  isPaused = false;
  accumulatedTime = 0;
  animationLoop(scene, camera, controls);
}

/**
 * 一時停止
 */
export function pauseAnimation() {
  if (rafId === null || isPaused) return;
  accumulatedTime += clock.getElapsedTime();
  cancelAnimationFrame(rafId);
  rafId = null;
  isPaused = true;
}

/**
 * 再開
 */
export function resumeAnimation(scene, camera, controls) {
  if (!isPaused || rafId !== null) return;
  clock = new THREE.Clock();
  isPaused = false;
  animationLoop(scene, camera, controls);
}

/**
 * 停止＆リセット
 */
export function stopAnimation() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
  rafId = null;
  clock = null;
  accumulatedTime = 0;
  isPaused = false;
}
