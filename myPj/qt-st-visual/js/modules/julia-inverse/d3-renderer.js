// js/3d/d3-renderer.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Complex } from './util/complex-number.js';
import { generateCirclePoints } from './util/generate-circle.js';
import { pauseAwareSleep as sleep } from './util/sleep.js';

import { createColoredPoints3D } from './renderer/d3-utils.js';

import {
  step1_subtract3D,
  step2_sqrt1_3D,
  step3_sqrt2_3D
} from './renderer/d3-steps.js';

import {
  CAMERA_PARAMS,
  SCENE_PARAMS,
  DRAW_PARAMS,
  LEGEND_DEFAULT,
  FORM_DEFAULTS,
  STAGE_NAMES,
  OBJECT_NAMES,
  ERROR_MESSAGES
} from './d3-config.js';

export let scene, camera, renderer, controls;

/**
 * initThree
 * ・Three.js のシーン / カメラ / レンダラー / コントロール を初期化して描画を開始する
 */
export function initThree() {
  console.log('[initThree] Starting Three.js initialization');
  const container = document.getElementById(SCENE_PARAMS.containerId);
  if (!container) {
    console.error(`[initThree] ERROR: Container #${SCENE_PARAMS.containerId} not found`);
    return;
  }

  // ─── シーンと背景色 ───
  scene = new THREE.Scene();
  scene.background = new THREE.Color(SCENE_PARAMS.backgroundColor);

  // ─── 座標軸ヘルパー ───
  const axesHelper = new THREE.AxesHelper(SCENE_PARAMS.axesSize);
  scene.add(axesHelper);

  // ─── グリッドヘルパー ───
  const gridHelper = new THREE.GridHelper(
    SCENE_PARAMS.gridSize,
    SCENE_PARAMS.gridDivisions,
    SCENE_PARAMS.gridColorMajor,
    SCENE_PARAMS.gridColorMinor
  );
  gridHelper.rotation.x = SCENE_PARAMS.gridRotationX;
  scene.add(gridHelper);

  // ─── カメラ初期化 ───
  camera = new THREE.PerspectiveCamera(
    CAMERA_PARAMS.fov,
    container.clientWidth / container.clientHeight,
    CAMERA_PARAMS.near,
    CAMERA_PARAMS.far
  );
  camera.position.set(
    CAMERA_PARAMS.position.x,
    CAMERA_PARAMS.position.y,
    CAMERA_PARAMS.position.z
  );
  camera.up.set(
    CAMERA_PARAMS.up.x,
    CAMERA_PARAMS.up.y,
    CAMERA_PARAMS.up.z
  );
  camera.lookAt(
    CAMERA_PARAMS.lookAt.x,
    CAMERA_PARAMS.lookAt.y,
    CAMERA_PARAMS.lookAt.z
  );

  // ─── レンダラー初期化 ───
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  console.log('[initThree] WebGLRenderer attached to container');

  // ─── コントロール（OrbitControls） ───
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(
    CAMERA_PARAMS.lookAt.x,
    CAMERA_PARAMS.lookAt.y,
    CAMERA_PARAMS.lookAt.z
  );
  controls.update();

  // ─── ウィンドウリサイズ対応 ───
  window.addEventListener('resize', () => {
    const c = document.getElementById(SCENE_PARAMS.containerId);
    if (!c) {
      console.warn('[initThree|resize] Container not found on resize');
      return;
    }
    camera.aspect = c.clientWidth / c.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(c.clientWidth, c.clientHeight);
    console.log('[initThree|resize] Canvas resized');
  });

  // ─── グローバルに scene を登録 ───
  window.scene = scene;

  console.log('[initThree] Completed Three.js initialization');
}

/**
 * animateLoop
 * ・requestAnimationFrame で継続的にレンダリングを行う
 */
export function animateLoop() {
  try {
    requestAnimationFrame(animateLoop);
    controls.update();
    renderer.render(scene, camera);
  } catch (err) {
    console.error('[animateLoop] Rendering error:', err);
  }
}

/**
 * runInverseAnimation
 *
 * ・c: Complex (Julia 定数)
 * ・N: 点の数（未指定なら FORM_DEFAULTS.N）
 * ・maxIter: 最大反復回数（未指定なら FORM_DEFAULTS.maxIter）
 * ・interval: 世代間インターバル ms（未指定なら DRAW_PARAMS.interval）
 *
 * @returns {Promise<{ minZ: number, maxZ: number, totalPoints: number }>}
 */
export async function runInverseAnimation(
  c,
  N = FORM_DEFAULTS.N,
  maxIter = FORM_DEFAULTS.maxIter,
  interval = DRAW_PARAMS.interval
) {
  console.log('[runInverseAnimation] START', { c, N, maxIter, interval });

  // 入力チェック
  if (!(c instanceof Complex)) {
    console.error('[runInverseAnimation] ERROR: c is not a Complex instance', c);
    throw new Error(ERROR_MESSAGES.invalidC);
  }
  if (typeof N !== 'number' || N <= 0) {
    console.warn('[runInverseAnimation] WARN: N is invalid, using FORM_DEFAULTS.N', FORM_DEFAULTS.N);
    N = FORM_DEFAULTS.N;
  }
  if (typeof maxIter !== 'number' || maxIter <= 0) {
    console.warn('[runInverseAnimation] WARN: maxIter is invalid, using FORM_DEFAULTS.maxIter', FORM_DEFAULTS.maxIter);
    maxIter = FORM_DEFAULTS.maxIter;
  }

  let currentGen;
  try {
    // ① 初期世代：単位円を作成
    currentGen = generateCirclePoints(N);
    console.log('[runInverseAnimation] Generated initial circle with', currentGen.length, 'points');
  } catch (err) {
    console.error('[runInverseAnimation] ERROR generating initial circle:', err);
    throw new Error(ERROR_MESSAGES.renderFail);
  }

  // ② 初期世代を「白点(init)」として一度だけ描画し、削除
  const ptsWhite0 = createColoredPoints3D(
    scene,
    currentGen,
    STAGE_NAMES.init,
    0,
    DRAW_PARAMS.pointSize,
    'ptsWhite0'
  );
  scene.add(ptsWhite0);
  await sleep(interval);
  scene.remove(ptsWhite0);
  console.log('[runInverseAnimation] Initial white circle displayed and removed');

  // 前世代の白点オブジェクト名
  let prevWhiteName = 'ptsWhite0';

  let totalPoints = currentGen.length;

  // ③ 各世代ループ
  for (let iter = 1; iter <= maxIter; iter++) {
    if (window.isStopped) {
      console.warn('[runInverseAnimation] Stopped by user at iter', iter);
      return { minZ: LEGEND_DEFAULT.minZ, maxZ: LEGEND_DEFAULT.maxZ, totalPoints };
    }

    console.log(`[runInverseAnimation] Starting generation ${iter}`);

    let diffPts, sqrtPts1, combinedPts;

    // ── ステップ1 ──
    try {
      diffPts = await step1_subtract3D(
        scene,
        currentGen,
        c,
        prevWhiteName,
        iter,
        DRAW_PARAMS.steps,
        interval / 2,
        DRAW_PARAMS.pointSize
      );
      console.log(`[runInverseAnimation] Generation ${iter} - Step1 diffPts length=`, diffPts.length);
    } catch (err) {
      // err.message が "Animation stopped" や "Stopped" を含むなら「中断」として扱う
      if (err.message && err.message.toLowerCase().includes('stop')) {
        console.warn(`[runInverseAnimation] Generation ${iter} - Stopped during Step1`);
        return { minZ: LEGEND_DEFAULT.minZ, maxZ: LEGEND_DEFAULT.maxZ, totalPoints };
      }
      console.error(`[runInverseAnimation] ERROR in step1 at iter ${iter}:`, err);
      throw err;
    }

    if (window.isStopped) {
      console.warn('[runInverseAnimation] Stopped by user after Step1 at iter', iter);
      return { minZ: LEGEND_DEFAULT.minZ, maxZ: LEGEND_DEFAULT.maxZ, totalPoints };
    }

    // ── ステップ2 ──
    try {
      sqrtPts1 = await step2_sqrt1_3D(
        scene,
        diffPts,
        prevWhiteName,
        iter,
        DRAW_PARAMS.steps,
        interval / 2,
        DRAW_PARAMS.pointSize
      );
      console.log(`[runInverseAnimation] Generation ${iter} - Step2 sqrtPts1 length=`, sqrtPts1.length);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('stop')) {
        console.warn(`[runInverseAnimation] Generation ${iter} - Stopped during Step2`);
        return { minZ: LEGEND_DEFAULT.minZ, maxZ: LEGEND_DEFAULT.maxZ, totalPoints };
      }
      console.error(`[runInverseAnimation] ERROR in step2 at iter ${iter}:`, err);
      throw err;
    }

    if (window.isStopped) {
      console.warn('[runInverseAnimation] Stopped by user after Step2 at iter', iter);
      return { minZ: LEGEND_DEFAULT.minZ, maxZ: LEGEND_DEFAULT.maxZ, totalPoints };
    }

    // ── ステップ3 ──
    try {
      combinedPts = await step3_sqrt2_3D(
        scene,
        diffPts,
        sqrtPts1,
        prevWhiteName,
        iter,
        DRAW_PARAMS.steps,
        interval / 2,
        DRAW_PARAMS.pointSize
      );
      console.log(`[runInverseAnimation] Generation ${iter} - Step3 combinedPts length=`, combinedPts.length);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('stop')) {
        console.warn(`[runInverseAnimation] Generation ${iter} - Stopped during Step3`);
        return { minZ: LEGEND_DEFAULT.minZ, maxZ: LEGEND_DEFAULT.maxZ, totalPoints };
      }
      console.error(`[runInverseAnimation] ERROR in step3 at iter ${iter}:`, err);
      throw err;
    }

    if (window.isStopped) {
      console.warn('[runInverseAnimation] Stopped by user after Step3 at iter', iter);
      return { minZ: LEGEND_DEFAULT.minZ, maxZ: LEGEND_DEFAULT.maxZ, totalPoints };
    }

    // (4) 次世代 currentGen を更新
    currentGen = combinedPts.slice();
    totalPoints = currentGen.length;

    // (5) 次世代の白点 (recolor) を描画
    const prevWhiteID = `ptsWhite${iter}`;
    const existingPrevW = scene.getObjectByName(prevWhiteID);
    if (existingPrevW) scene.remove(existingPrevW);

    const ptsWhiteNow = createColoredPoints3D(
      scene,
      currentGen,
      STAGE_NAMES.recolor,
      iter,
      DRAW_PARAMS.pointSize,
      prevWhiteID
    );
    scene.add(ptsWhiteNow);
    prevWhiteName = prevWhiteID;

    console.log(`[runInverseAnimation] Completed generation ${iter}`);
    await sleep(interval);
  }

  console.log('[runInverseAnimation] FINISH - totalPoints=', totalPoints);
  return {
    minZ: LEGEND_DEFAULT.minZ,
    maxZ: LEGEND_DEFAULT.maxZ,
    totalPoints
  };
}
