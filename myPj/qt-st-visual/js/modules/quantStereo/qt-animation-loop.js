// js/modules/quantStereo/qt-animation-loop.js
import * as THREE from 'three';
import {
  FULL_CYCLE,
  HALF_CYCLE,
  ROTATION_SPEED,
  RES_THETA,
  RES_PHI,
  CAMERA_OSCILLATION_ENABLED,
  CAMERA_OSCILLATION_SPEED,
  CAMERA_OSCILLATION_RANGE,
  BG_COLOR_DARK,
  BG_COLOR_LIGHT,
  BG_EXPONENT_RISE,
  BG_EXPONENT_FALL,
  SPHERE_BASE_COLOR,
  SPHERE_MID_COLOR,
  SPHERE_END_COLOR,
  CAMERA_TARGET
} from './qt-config.js';
import { create, normalize } from './qt-math-quat-utils.js';
import { overlayEarthGridAndProjection } from './qt-render-pointcloud.js';

let clock = null;
let rafId = null;
let isPaused = false;
let accumulatedTime = 0;

// 「垂直往復」アニメーション on/off フラグ
let enableVertical = CAMERA_OSCILLATION_ENABLED;


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
 * 垂直往復アニメーションの on/off を外部から切り替える
 */
export function setEnableVertical(flag) {
  enableVertical = flag;
}

/**
 * window 上の変数(varName) を THREE.Color として返す。
 * 文字列 or カラーオブジェクトがなければ defaultHex を THREE.Color にして返す。
 */
function getColorOrDefault(varName, defaultHex) {
  const v = window[varName];
  if (v instanceof THREE.Color) return v;
  if (typeof v === 'string') return new THREE.Color(v);
  return new THREE.Color(defaultHex);
}


/**
 * アニメーションループ本体
 * 1) カメラ上下往復（enableVertical=true のとき）
 * 2) 四元数による回転計算と地球グリッド再描画
 * 3) 背景色（暗⇔明⇔暗）の補間設定
 * 4) 投影球（quaternionSpherePoints）色の段階的補間
 * 5) OrbitControls.update() & 次フレーム予約
 */
export function animationLoop(scene, camera, controls) {
  if (isPaused) return;

  // 累積経過時間（一時停止分を考慮）
  const elapsed = clock.getElapsedTime() + accumulatedTime;
  const theta   = (elapsed * ROTATION_SPEED) % FULL_CYCLE;

  // 1) カメラ上下往復（oscillation）
  if (enableVertical) {
    const r   = Math.hypot(camera.position.x, camera.position.y, camera.position.z);
    const phi = Math.atan2(camera.position.z, camera.position.x);
    const raw  = (elapsed * CAMERA_OSCILLATION_SPEED) % (2 * CAMERA_OSCILLATION_RANGE);
    const oscTheta = raw <= CAMERA_OSCILLATION_RANGE
      ? raw
      : (2 * CAMERA_OSCILLATION_RANGE - raw);

    camera.position.set(
      r * Math.sin(oscTheta) * Math.cos(phi),
      r * Math.cos(oscTheta),
      r * Math.sin(oscTheta) * Math.sin(phi)
    );
    const [tx, ty, tz] = CAMERA_TARGET;
    camera.lookAt(tx, ty, tz);
  }

  // 2) 四元数回転 (x 軸まわり回転)
  const halfQ = theta / 2;
  const qRot  = normalize(create(Math.cos(halfQ), Math.sin(halfQ), 0, 0));

  // 地球グリッド ＋ ステレオ投影球の再描画
  overlayEarthGridAndProjection(scene, qRot, RES_THETA, RES_PHI);

  // 3) 背景色の補間（暗 → 明 → 暗）
  const bgDark  = getColorOrDefault('_bgColorDark',  BG_COLOR_DARK);
  const bgLight = getColorOrDefault('_bgColorLight', BG_COLOR_LIGHT);
  if (theta < HALF_CYCLE) {
    const t = theta / HALF_CYCLE;                      // 0→1
    const tAdjusted = Math.pow(t, BG_EXPONENT_RISE);   // 暗→明 の調整カーブ
    scene.background = bgDark.clone().lerp(bgLight, tAdjusted);
  } else {
    const t = (theta - HALF_CYCLE) / HALF_CYCLE;       // 0→1
    const tAdjusted = Math.pow(t, BG_EXPONENT_FALL);   // 明→暗 の調整カーブ
    scene.background = bgLight.clone().lerp(bgDark, tAdjusted);
  }

  // 4) 投影球色の 4 段階補間
  const projObj = scene.getObjectByName('quaternionSpherePoints');
  if (projObj && projObj.material) {
    const baseColor = getColorOrDefault('_sphereBaseColor', SPHERE_BASE_COLOR);
    const midColor  = getColorOrDefault('_peakColor1',       SPHERE_MID_COLOR);
    const endColor  = getColorOrDefault('_peakColor2',       SPHERE_END_COLOR);
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

  // 5) OrbitControls 更新 & カメラ位置表示更新
  controls.update();
  const posDiv = document.getElementById('camera-position-display');
  if (posDiv) {
    posDiv.innerText = `Camera: x=${camera.position.x.toFixed(1)}, y=${camera.position.y.toFixed(1)}, z=${camera.position.z.toFixed(1)}`;
  }

  // 次フレームへ
  rafId = requestAnimationFrame(() => animationLoop(scene, camera, controls));
}

/**
 * 一時停止
 * ───────────────────────────────────────────────────
 * ・現在の elapsedTime を accumulatedTime に積み増す
 * ・requestAnimationFrame をキャンセル
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
 * ───────────────────────────────────────────────────
 * ・一時停止中か・かつまだ rafId が null なら再開
 * ・新しい Clock を作って再度ループを始める
 */
export function resumeAnimation(scene, camera, controls) {
  if (!isPaused || rafId !== null) return;
  clock = new THREE.Clock();
  isPaused = false;
  animationLoop(scene, camera, controls);
}

/**
 * 停止＆リセット
 * ───────────────────────────────────────────────────
 * ・フレームをキャンセルし、状態リセット
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
