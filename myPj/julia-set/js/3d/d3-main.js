// js/3d/d3-main.js（リファクタリング後）

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Complex } from '../util/complex-number.js';
import { generateCirclePoints } from '../util/generate-circle.js';
import { pauseAwareSleep as sleep } from '../util/sleep.js';

// ユーティリティ関数
import { createColoredPoints3D } from './d3-utils.js';

// ステップ関数
import {
  step1_subtract3D,
  step2_sqrt1_3D,
  step3_sqrt2_3D
} from './d3-steps.js';

// ─── 設定値をインポート ───
import { CAMERA_PARAMS, SCENE_PARAMS, DRAW_PARAMS, LEGEND_DEFAULT } from './d3-config.js';

export let scene, camera, renderer, controls;

export function initThree() {
  // ① コンテナ要素は定数から取得
  const container = document.getElementById(SCENE_PARAMS.containerId);

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
  // ─── 回転角度も定数から参照 ───
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
    camera.aspect = c.clientWidth / c.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(c.clientWidth, c.clientHeight);
  });
}

export function animateLoop() {
  requestAnimationFrame(animateLoop);
  controls.update();
  renderer.render(scene, camera);
}

/**
 * runInverseAnimation
 * @param {Complex} c        Julia 定数
 * @param {number}  N        点の数（デフォルトは FORM_DEFAULTS で渡す想定）
 * @param {number}  maxIter  最大反復回数（デフォルトは FORM_DEFAULTS で渡す想定）
 * @param {number}  interval インターバル時間(ms)（デフォルトは DRAW_PARAMS.interval）
 */
export async function runInverseAnimation(
  c,
  N = DRAW_PARAMS.steps * 3,           // 実質的に使わないので一旦 DRAW_PARAMS 由来に（直接呼び出し元で必ず上書きしてもよい）
  maxIter = DRAW_PARAMS.steps - 22,   // こちらも実際には上書きが常だが、リテラルを排除
  interval = DRAW_PARAMS.interval
) {
  // ① 初期世代：単位円を作成
  let currentGen = generateCirclePoints(N);

  // ② 初期世代を「白点 (ステージ名は設定値)」としてシーンに描画
  {
    const ptsWhite0 = createColoredPoints3D(
      scene,
      currentGen,
      SCENE_PARAMS.defaultStageInit,  // 'init' を定数化
      0,                              // iter = 0
      DRAW_PARAMS.pointSize,          // 点サイズ
      'ptsWhite0'
    );
    scene.add(ptsWhite0);
    await sleep(interval);
  }

  // 前世代の「白点」オブジェクト名
  let prevWhiteName = 'ptsWhite0';

  // ③ 各世代ループ
  for (let iter = 1; iter <= maxIter; iter++) {
    if (window.isStopped) throw new Error(SCENE_PARAMS.errorStopped);

    // ── ステップ①：引き算ステップ ──
    const diffPts = await step1_subtract3D(
      scene,
      currentGen,
      c,
      prevWhiteName,
      iter,
      DRAW_PARAMS.steps,          // 補間分割数
      interval,                   // インターバル
      DRAW_PARAMS.pointSize       // 点サイズ
    );

    if (window.isStopped) throw new Error(SCENE_PARAMS.errorStopped);

    // ── ステップ②：√ステップ①（第一解・黄色） ──
    const sqrtPts1 = await step2_sqrt1_3D(
      scene,
      diffPts,
      prevWhiteName,
      iter,
      DRAW_PARAMS.steps,          // 補間分割数
      interval,                   // インターバル
      DRAW_PARAMS.pointSize       // 点サイズ
    );

    if (window.isStopped) throw new Error(SCENE_PARAMS.errorStopped);

    // ── ステップ③：√ステップ②（第二解・ピンク） ──
    const combinedPts = await step3_sqrt2_3D(
      scene,
      diffPts,
      sqrtPts1,
      prevWhiteName,
      iter,
      DRAW_PARAMS.steps,          // 補間分割数
      interval,                   // インターバル
      DRAW_PARAMS.pointSize       // 点サイズ
    );

    if (window.isStopped) throw new Error(SCENE_PARAMS.errorStopped);

    // (4) 次世代 currentGen を更新
    currentGen = combinedPts.slice();

    // (5) 新しい「前世代の白点 (ステージ名は設定値)」を描画
    const prevWhiteID = `ptsWhite${iter}`;
    const existingPrevW = scene.getObjectByName(prevWhiteID);
    if (existingPrevW) scene.remove(existingPrevW);

    const ptsWhiteNow = createColoredPoints3D(
      scene,
      currentGen,
      SCENE_PARAMS.defaultStageRecolor, // 'recolor' を定数化
      iter,
      DRAW_PARAMS.pointSize,            // 点サイズ
      prevWhiteID
    );
    scene.add(ptsWhiteNow);
    prevWhiteName = prevWhiteID;

    console.log(`世代 ${iter} 完了: 点数 = ${currentGen.length}`);
    await sleep(interval);
  }
}
