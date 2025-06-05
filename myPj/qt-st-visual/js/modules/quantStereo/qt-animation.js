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
let accumulatedTime = 0;     // 一時停止中に溜めておく経過時間の補正値

/**
 * getColorOrDefault
 *   ・window.<varName> が THREE.Color の場合はそのまま返し、
 *     文字列 ("#rrggbb") の場合は new THREE.Color(str) に変換して返す
 *   ・未定義ならデフォルト colorHex を返す
 */
function getColorOrDefault(varName, colorHex) {
  const v = window[varName];
  if (v instanceof THREE.Color) return v;
  if (typeof v === 'string') return new THREE.Color(v);
  return new THREE.Color(colorHex);
}

/**
 * animationLoop(scene)
 *   ・一時停止中なら抜ける
 *   ・clock.getElapsedTime() + accumulatedTime によって θ を計算
 *   ・overlayEarthGridAndProjection() で地球グリッド＋投影球を再描画
 *   ・背景色を Offcanvas から取得して lerp 補間
 *   ・球色を Offcanvas から取得して4段階補間
 *   ・次フレームを予約
 */
function animationLoop(scene, camera, controls) {
  if (isPaused) return;

  // elapsed = 現在の経過(sec) + 一時停止前に貯めた時間
  const elapsed = clock.getElapsedTime() + accumulatedTime;
  const theta   = (elapsed * ROTATION_SPEED) % FULL_CYCLE; // θ ∈ [0,4π)

  // — (1) 四元数回転を作成 (x 軸まわり回転) —
  const half = theta / 2;
  const qRot = normalize(create(Math.cos(half), Math.sin(half), 0, 0));

  // — (2) 地球グリッド＋ステレオ投影球を再描画 —
  overlayEarthGridAndProjection(scene, qRot, RES_THETA, RES_PHI);

  // — (3) 背景色 (暗⇔明⇔暗) の補間 —
  //    Offcanvas で指定された bgColorDark, bgColorLight を取得し、
  //    θ < 2π のとき暗→明、それ以降は明→暗となるよう lerp
  const darkDefault  = '#000011';
  const lightDefault = '#ffffff';
  const bgDark  = getColorOrDefault('_bgColorDark', darkDefault);
  const bgLight = getColorOrDefault('_bgColorLight', lightDefault);

  if (theta < HALF_CYCLE) {
    // 0 ≤ θ < 2π: 暗 → 明
    const t = theta / HALF_CYCLE; // 0 → 1
    scene.background = bgDark.clone().lerp(bgLight, t);
  } else {
    // 2π ≤ θ < 4π: 明 → 暗
    const phi = theta - HALF_CYCLE; // φ ∈ [0,2π)
    const t   = phi / HALF_CYCLE;   // 0 → 1
    scene.background = bgLight.clone().lerp(bgDark, t);
  }

  // — (4) 球のオーバーレイ色を4段階補間で設定 —
  //    Offcanvas で指定された
  //      _sphereBaseColor, _peakColor1, _peakColor2
  //    を使って補間。未指定時は従来の白/灰/黒/灰サイクルとなる。
  const projObj = scene.getObjectByName('quaternionSpherePoints');
  if (projObj && projObj.material) {
    // Offcanvas で設定された色を取得 (未定義ならデフォルト)
    const baseColor = getColorOrDefault('_sphereBaseColor', '#ffffff');
    const midColor  = getColorOrDefault('_peakColor1',    '#808080');
    const endColor  = getColorOrDefault('_peakColor2',    '#000000');

    let color = new THREE.Color();

    if (theta < HALF_CYCLE) {
      // 1st revolution: 0 ≤ θ < 2π
      const frac = (theta / HALF_CYCLE) * 360; // 0～360 (度として扱う)
      if (frac < 120) {
        // 0°～120°: base → mid
        const t = frac / 120;
        color.copy(baseColor).lerp(midColor, t);
      } else if (frac < 240) {
        // 120°～240°: mid → end
        const t = (frac - 120) / 120;
        color.copy(midColor).lerp(endColor, t);
      } else {
        // 240°～360°: end → mid
        const t = (frac - 240) / 120;
        color.copy(endColor).lerp(midColor, t);
      }
    } else {
      // 2nd revolution: 2π ≤ θ < 4π → φ = θ - 2π
      const phi  = theta - HALF_CYCLE;           
      const frac = (phi / HALF_CYCLE) * 360; // 0～360
      if (frac < 120) {
        // 0°～120°: mid → end
        const t = frac / 120;
        color.copy(midColor).lerp(endColor, t);
      } else if (frac < 240) {
        // 120°～240°: end → mid
        const t = (frac - 120) / 120;
        color.copy(endColor).lerp(midColor, t);
      } else {
        // 240°～360°: mid → base
        const t = (frac - 240) / 120;
        color.copy(midColor).lerp(baseColor, t);
      }
    }

    projObj.material.color.copy(color);
    projObj.material.opacity = 1.0;
    projObj.material.transparent = true;
  }

  // ── () カメラと OrbitControls の自動回転更新（必要なら） ──
  controls.update();

  // ── () 「カメラ位置表示用 div」を更新 ──
  const posDiv = document.getElementById('camera-position-display');
  if (posDiv) {
    // 小数点以下2桁で丸めて表示
    const x = camera.position.x.toFixed(1);
    const y = camera.position.y.toFixed(1);
    const z = camera.position.z.toFixed(1);
    posDiv.innerText = `Camera: x=${x}, y=${y}, z=${z}`;
  }

  // — (5) 次フレームを予約 —
  rafId = requestAnimationFrame(() => animationLoop(scene, camera, controls));
}

/**
 * startAnimation(scene)
 */
export function startAnimation(scene, camera, controls) {
  if (rafId !== null) return;
  console.log('[qt-animation] startAnimation()');
  clock = new THREE.Clock();
  isPaused = false;
  accumulatedTime = 0;
  animationLoop(scene, camera, controls);
}

/**
 * pauseAnimation()
 */
export function pauseAnimation() {
  if (rafId === null || isPaused) return;
  console.log('[qt-animation] pauseAnimation()');
  const elapsed = clock.getElapsedTime();
  accumulatedTime += elapsed;
  cancelAnimationFrame(rafId);
  rafId = null;
  isPaused = true;
}

/**
 * resumeAnimation(scene)
 */
export function resumeAnimation(scene, camera, controls) {
  if (!isPaused || rafId !== null) return;
  console.log('[qt-animation] resumeAnimation()');
  clock = new THREE.Clock();
  isPaused = false;
  animationLoop(scene, camera, controls);
}

/**
 * stopAnimation()
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
