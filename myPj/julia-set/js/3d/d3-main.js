// js/3d/d3-main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Complex } from '../util/complex-number.js';
import { generateCirclePoints } from '../util/generate-circle.js';
import { pauseAwareSleep as sleep } from '../util/sleep.js';

// ユーティリティ関数をインポート
import { createColoredPoints3D } from './d3-utils.js';

// ステップ関数をインポート
import {
  step1_subtract3D,
  step2_sqrt1_3D,
  step3_sqrt2_3D
} from './d3-steps.js';

export let scene, camera, renderer, controls;

export function initThree() {
  const container = document.getElementById('canvas-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(4, 20, 0x333333, 0x222222);
  gridHelper.rotation.x = Math.PI / 2;
  scene.add(gridHelper);

  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(-3, -7, 7);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  window.addEventListener('resize', () => {
    const c = document.getElementById('canvas-container');
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

export async function runInverseAnimation(c, N = 100, maxIter = 8, interval = 800) {
  // ① 初期世代：単位円を作成
  let currentGen = generateCirclePoints(N);

  // ② 初期世代を「白点 (stage='init')」としてシーンに描画
  {
    const ptsWhite0 = createColoredPoints3D(
      scene,
      currentGen,
      'init',
      0,       // iter=0
      0.02,    // 点サイズ
      'ptsWhite0'
    );
    scene.add(ptsWhite0);
    await sleep(interval);
  }

  // 「前世代の白点」のオブジェクト名
  let prevWhiteName = 'ptsWhite0';

  // ③ 各世代ループ
  for (let iter = 1; iter <= maxIter; iter++) {
    if (window.isStopped) throw new Error('Stopped');

    // ── ステップ①：引き算ステップ ──
    const diffPts = await step1_subtract3D(
      scene,
      currentGen,
      c,
      prevWhiteName,
      iter,
      30,      // 補間分割数
      interval,
      0.02     // 点サイズ
    );

    if (window.isStopped) throw new Error('Stopped');

    // ── ステップ②：√ステップ①（第一解・黄色） ──
    const sqrtPts1 = await step2_sqrt1_3D(
      scene,
      diffPts,
      prevWhiteName,
      iter,
      30,
      interval,
      0.02
    );

    if (window.isStopped) throw new Error('Stopped');

    // ── ステップ③：√ステップ②（第二解・ピンク） ──
    const combinedPts = await step3_sqrt2_3D(
      scene,
      diffPts,
      sqrtPts1,
      prevWhiteName,
      iter,
      30,
      interval,
      0.02
    );

    if (window.isStopped) throw new Error('Stopped');

    // (4) 次世代 currentGen を更新
    currentGen = combinedPts.slice();

    // (5) 新しい「前世代の白点 (recolor)」を描画
    const prevWhiteID = `ptsWhite${iter}`;
    const existingPrevW = scene.getObjectByName(prevWhiteID);
    if (existingPrevW) scene.remove(existingPrevW);

    const ptsWhiteNow = createColoredPoints3D(
      scene,
      currentGen,
      'recolor',
      iter,
      0.02,
      prevWhiteID
    );
    scene.add(ptsWhiteNow);
    prevWhiteName = prevWhiteID;

    console.log(`世代 ${iter} 完了: 点数 = ${currentGen.length}`);
    await sleep(interval);
  }
}
