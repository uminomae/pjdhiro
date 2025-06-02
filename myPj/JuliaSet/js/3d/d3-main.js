// js/3d/d3-main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Complex } from '../util/complex-number.js';
import { generateCirclePoints } from '../util/generate-circle.js';
// ↓ ここを変更：pauseAwareSleep を sleep としてインポート
import { pauseAwareSleep as sleep } from '../util/sleep.js';

import { computeInverseGeneration } from './d3-Inverse-logic.js';
import { getZ } from './d3-height-function.js';
import { mapValueToColor } from './d3-color-map.js';

// ───────────────────────────────────────────────────
// ① Three.js 初期化部分
// ───────────────────────────────────────────────────

export let scene, camera, renderer, controls;

export function initThree() {
  const container = document.getElementById('canvas-container');

  // (1) シーン生成＆背景色
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  // (2) 座標軸ヘルパー (x=赤, y=緑, z=青)
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // (3) グリッドヘルパー (XY 平面、幅 4, 分割 20)
  const gridHelper = new THREE.GridHelper(4, 20, 0x333333, 0x222222);
  gridHelper.rotation.x = Math.PI / 2; // XY 平面に回転
  scene.add(gridHelper);

  // (4) カメラ設定
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(-3, -7, 7);  // 斜め上から俯瞰
  camera.up.set(0, 0, 1);         // z 軸を“上”にする
  camera.lookAt(0, 0, 0);

  // (5) レンダラ生成＆サイズ設定
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // (6) OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  // (7) リサイズ対応
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

// ───────────────────────────────────────────────────
// ② 共通ユーティリティ：Complex[] → THREE.Points を作成
// ───────────────────────────────────────────────────

/**
 * createColoredPoints3D
 *
 * ・points: Complex[] の配列  
 * ・stage, iter: getZ() に渡すステージ・世代情報  
 * ・size: 点のサイズ (PointsMaterial#size)  
 * ・name: 作成する THREE.Points の name（あとで remove するときに使う）
 */
function createColoredPoints3D(points, stage, iter, size = 0.02, name = '') {
  // 1) 全点の Z 値を取得
  const zValues = points.map(z => getZ(z, { stage, iter }));
  // 2) zValues の最大を求める（安全のため 1e-6 を下限）
  const maxZ = Math.max(...zValues, 1e-6);

  // 3) TypedArray を用意
  const posArray = new Float32Array(points.length * 3);
  const colArray = new Float32Array(points.length * 3);

  for (let i = 0; i < points.length; i++) {
    const zPt    = points[i];
    const X      = zPt.re;
    const Y      = zPt.im;
    const Zvalue = zValues[i];

    // (A) 座標をセット (x, y, z)
    posArray[i * 3 + 0] = X;
    posArray[i * 3 + 1] = Y;
    posArray[i * 3 + 2] = Zvalue;

    // (B) 色強度を計算 (0..1)
    const intensity = Zvalue / maxZ;

    // (C) 色相 H を 240→0（青→赤）で補間
    const hue = 240 - 240 * intensity;

    // (D) HSL 文字列を THREE.Color に
    const tmpCol = new THREE.Color(`hsl(${hue},100%,50%)`);
    colArray[i * 3 + 0] = tmpCol.r;
    colArray[i * 3 + 1] = tmpCol.g;
    colArray[i * 3 + 2] = tmpCol.b;
  }

  // 4) BufferGeometry を作って attribute セット
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colArray,    3));

  // 5) PointsMaterial（vertexColors 有効）
  const material = new THREE.PointsMaterial({
    size: size,
    vertexColors: true,
  });

  // 6) THREE.Points を作り、name をセットして返す
  const pointsObj = new THREE.Points(geometry, material);
  if (name) pointsObj.name = name;
  return pointsObj;
}

// ───────────────────────────────────────────────────
// ③ ステップ関数群：step1_subtract3D, step2_sqrt1_3D, step3_sqrt2_3D
// ───────────────────────────────────────────────────

/**
 * step1_subtract3D
 * ・currentGen: Complex[]（wPoints）  
 * ・c: Complex (Julia 定数)  
 * ・prevWhiteName: 前世代・白点の name  
 * ・iter: 今回の世代番号  
 * ・steps: 補間分割数  
 * ・interval: 世代インターバル (ms)  
 * ・pointSize: 点の大きさ
 *
 * @returns {Promise<Complex[]>} diffPts: (w - c) の Complex[] を返す
 */
async function step1_subtract3D(currentGen, c, prevWhiteName, iter, steps, interval, pointSize = 0.02) {
  // (1) wPoints → diffPts を計算
  const diffPts = currentGen.map(w => w.sub(c));

  // (2) 線形補間アニメーション
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;

    // (i) 前世代 白点 (currentGen) を再描画
    const existingPrev = scene.getObjectByName(prevWhiteName);
    if (existingPrev) scene.remove(existingPrev);
    const ptsWhitePrev = createColoredPoints3D(
      currentGen,
      'init',
      iter - 1,
      pointSize,
      prevWhiteName
    );
    scene.add(ptsWhitePrev);

    // (ii) currentGen → diffPts の線形補間をオレンジ (stage='subtract') で表示
    const interpPts = currentGen.map((w, i) => {
      const d = diffPts[i];
      const x = w.re * (1 - t) + d.re * t;
      const y = w.im * (1 - t) + d.im * t;
      return new Complex(x, y);
    });
    const existingInterp = scene.getObjectByName('ptsSubtract');
    if (existingInterp) scene.remove(existingInterp);
    const ptsSubtract = createColoredPoints3D(
      interpPts,
      'subtract',
      iter,
      pointSize,
      'ptsSubtract'
    );
    scene.add(ptsSubtract);

    await sleep(interval / steps);

    // (iii) オレンジ点を消して次ループへ
    scene.remove(ptsSubtract);
    scene.remove(ptsWhitePrev);
  }

  // (3) 最終的な diffPts を一度だけ白点（stage='subtract'）で描画
  const ptsDiffFinal = createColoredPoints3D(
    diffPts,
    'subtract',
    iter,
    pointSize,
    'ptsDiffFinal'
  );
  scene.add(ptsDiffFinal);
  await sleep(interval / steps);
  scene.remove(ptsDiffFinal);

  return diffPts;
}

/**
 * step2_sqrt1_3D
 * ・diffPts: Complex[]（w - c）  
 * ・prevWhiteName: 前世代 白点の name  
 * ・iter: 世代番号  
 * ・steps: 補間分割数  
 * ・interval: インターバル (ms)  
 * ・pointSize: 点サイズ
 *
 * @returns {Promise<Complex[]>} sqrtPts1 (第一解) の配列
 */
async function step2_sqrt1_3D(diffPts, prevWhiteName, iter, steps, interval, pointSize = 0.02) {
  const N = diffPts.length;
  const diffPhis = [];
  const diffRs   = [];
  for (let i = 0; i < N; i++) {
    const d = diffPts[i];
    const r = d.abs();
    let phi = Math.atan2(d.im, d.re);
    if (phi < 0) phi += 2 * Math.PI;
    diffPhis.push(phi);
    diffRs.push(r);
  }

  // √ステップ①（第一解）を計算
  const sqrtPts1 = [];
  for (let i = 0; i < N; i++) {
    const r0  = diffRs[i];
    const phi = diffPhis[i];
    const sqrtR = Math.sqrt(r0);
    const phi0  = phi / 2;
    sqrtPts1.push(new Complex(
      sqrtR * Math.cos(phi0),
      sqrtR * Math.sin(phi0)
    ));
  }

  // 極座標補間アニメーション
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;

    // (i) 前世代「白点」(diffPts を白) を描く
    const existingWhite = scene.getObjectByName(prevWhiteName);
    if (existingWhite) scene.remove(existingWhite);
    const ptsWhitePrev = createColoredPoints3D(
      diffPts,
      'subtract',
      iter - 1,
      pointSize,
      prevWhiteName
    );
    scene.add(ptsWhitePrev);

    // (ii) diffPts を白で表示
    const existingDiffWhite = scene.getObjectByName('ptsDiffWhite2');
    if (existingDiffWhite) scene.remove(existingDiffWhite);
    const ptsDiffWhite2 = createColoredPoints3D(
      diffPts,
      'subtract',
      iter,
      pointSize,
      'ptsDiffWhite2'
    );
    scene.add(ptsDiffWhite2);

    // (iii) diffPts → sqrtPts1 極座標補間を黄色 (stage='sqrt1') で表示
    const interpPts = [];
    for (let i = 0; i < N; i++) {
      const r0   = diffRs[i];
      const phi0 = diffPhis[i];
      const z1   = sqrtPts1[i];
      let phi1   = Math.atan2(z1.im, z1.re);
      if (phi1 < 0) phi1 += 2 * Math.PI;
      const r1 = z1.abs();

      let dphi = phi1 - phi0;
      if (dphi > Math.PI)      dphi -= 2 * Math.PI;
      else if (dphi < -Math.PI) dphi += 2 * Math.PI;

      const r_t   = r0 * (1 - t) + r1 * t;
      const phi_t = phi0 + dphi * t;
      const x = r_t * Math.cos(phi_t);
      const y = r_t * Math.sin(phi_t);
      interpPts.push(new Complex(x, y));
    }

    const existingYellow = scene.getObjectByName('ptsYellow');
    if (existingYellow) scene.remove(existingYellow);
    const ptsYellow = createColoredPoints3D(
      interpPts,
      'sqrt1',
      iter,
      pointSize,
      'ptsYellow'
    );
    scene.add(ptsYellow);

    await sleep(interval / steps);

    // (iv) 黄色を消去して次ループ
    scene.remove(ptsYellow);
    scene.remove(ptsDiffWhite2);
    scene.remove(ptsWhitePrev);
  }

  // (3) 最終的な sqrtPts1 を一度だけ黄色で描画して返す
  const ptsYellowFinal = createColoredPoints3D(
    sqrtPts1,
    'sqrt1',
    iter,
    pointSize,
    'ptsYellowFinal'
  );
  scene.add(ptsYellowFinal);
  await sleep(interval / steps);
  scene.remove(ptsYellowFinal);

  return sqrtPts1;
}

/**
 * step3_sqrt2_3D
 * ・diffPts: Complex[]  
 * ・sqrtPts1: Complex[]（第一解）  
 * ・prevWhiteName: 前世代 白点の name  
 * ・iter: 世代番号  
 * ・steps: 補間分割数  
 * ・interval: インターバル  
 * ・pointSize: 点サイズ
 *
 * @returns {Promise<Complex[]>} combinedPts (第一解＋第二解) の配列
 */
async function step3_sqrt2_3D(diffPts, sqrtPts1, prevWhiteName, iter, steps, interval, pointSize = 0.02) {
  const N = diffPts.length;
  const diffPhis = [];
  const diffRs   = [];

  // (1) diffPts の極座標を再計算
  for (let i = 0; i < N; i++) {
    const d = diffPts[i];
    const r = d.abs();
    let phi = Math.atan2(d.im, d.re);
    if (phi < 0) phi += 2 * Math.PI;
    diffPhis.push(phi);
    diffRs.push(r);
  }

  // (2) 第二解 sqrtPts2 を計算
  const sqrtPts2 = [];
  for (let i = 0; i < N; i++) {
    const r0  = diffRs[i];
    const phi = diffPhis[i];
    const sqrtR = Math.sqrt(r0);
    const phi2  = phi / 2 + Math.PI;
    sqrtPts2.push(new Complex(
      sqrtR * Math.cos(phi2),
      sqrtR * Math.sin(phi2)
    ));
  }

  // (3) 補間ループ
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;

    // (i) “黄色 (sqrtPts1)” を描く
    const existingYellowKeep = scene.getObjectByName('ptsYellowFinal');
    if (existingYellowKeep) scene.remove(existingYellowKeep);
    const ptsYellowKeep = createColoredPoints3D(
      sqrtPts1,
      'sqrt1',
      iter,
      pointSize,
      'ptsYellowFinal'
    );
    scene.add(ptsYellowKeep);

    // (ii) “diffPts” を白で描く
    const existingDiffKeep = scene.getObjectByName('ptsDiffKeep');
    if (existingDiffKeep) scene.remove(existingDiffKeep);
    const ptsDiffKeep = createColoredPoints3D(
      diffPts,
      'subtract',
      iter,
      pointSize,
      'ptsDiffKeep'
    );
    scene.add(ptsDiffKeep);

    // (iii) diffPts → sqrtPts2 の極座標補間を “ピンク (stage='sqrt2')” で表示
    const interpPts = [];
    for (let i = 0; i < N; i++) {
      const r0   = diffRs[i];
      const phi0 = diffPhis[i];
      const z2   = sqrtPts2[i];
      let phi2   = Math.atan2(z2.im, z2.re);
      if (phi2 < 0) phi2 += 2 * Math.PI;
      const r2 = z2.abs();
      let dphi = phi2 - phi0;
      if (dphi > Math.PI)      dphi -= 2 * Math.PI;
      else if (dphi < -Math.PI) dphi += 2 * Math.PI;
      const r_t   = r0 * (1 - t) + r2 * t;
      const phi_t = phi0 + dphi * t;
      const x = r_t * Math.cos(phi_t);
      const y = r_t * Math.sin(phi_t);
      interpPts.push(new Complex(x, y));
    }
    const existingPink = scene.getObjectByName('ptsPink');
    if (existingPink) scene.remove(existingPink);
    const ptsPink = createColoredPoints3D(
      interpPts,
      'sqrt2',
      iter,
      pointSize,
      'ptsPink'
    );
    scene.add(ptsPink);

    await sleep(interval / steps);

    // (iv) ピンクを消去して次へ
    scene.remove(ptsPink);
    scene.remove(ptsDiffKeep);
    scene.remove(ptsYellowKeep);
  }

  // (4) 第一解＋第二解を統合して “白リカラー” を一度だけ表示
  const combinedPts = sqrtPts1.concat(sqrtPts2);
  const ptsWhiteFinal = createColoredPoints3D(
    combinedPts,
    'recolor',
    iter,
    pointSize,
    'ptsWhiteFinal'
  );
  scene.add(ptsWhiteFinal);
  await sleep(interval);
  scene.remove(ptsWhiteFinal);

  return combinedPts;
}

// ───────────────────────────────────────────────────
// ④ runInverseAnimation 全体
// ───────────────────────────────────────────────────

/**
 * runInverseAnimation
 *
 * @param {Complex} c       — Julia 定数
 * @param {number}  N       — 初期円のサンプル数
 * @param {number}  maxIter — 最大世代数
 * @param {number}  interval— 世代間インターバル (ms)
 */
export async function runInverseAnimation(c, N = 100, maxIter = 8, interval = 800) {
  // (1) 初期世代：単位円
  let currentGen = generateCirclePoints(N);

  // (2) 初期世代を“白点”として scene に追加
  const ptsWhite0 = createColoredPoints3D(
    currentGen,
    'init',
    0,
    0.02,
    'ptsWhite0'
  );
  scene.add(ptsWhite0);
  await sleep(interval);

  // “前世代の白点” の name を管理
  let prevWhiteName = 'ptsWhite0';

  // (3) 各世代ループ
  for (let iter = 1; iter <= maxIter; iter++) {
    // もし停止リクエストが入っていれば中断
    if (window.isStopped) throw new Error('Stopped');

    // —— ステップ①：引き算ステップ —— 
    const diffPts = await step1_subtract3D(
      currentGen,
      c,
      prevWhiteName,
      iter,
      30,         // 補間分割数
      interval,
      0.02
    );

    if (window.isStopped) throw new Error('Stopped');
    // —— ステップ②：√ステップ① （第一解・黄色） —— 
    const sqrtPts1 = await step2_sqrt1_3D(
      diffPts,
      prevWhiteName,
      iter,
      30,
      interval,
      0.02
    );

    if (window.isStopped) throw new Error('Stopped');
    // —— ステップ③：√ステップ② （第二解・ピンク） —— 
    const combinedPts = await step3_sqrt2_3D(
      diffPts,
      sqrtPts1,
      prevWhiteName,
      iter,
      30,
      interval,
      0.02
    );

    if (window.isStopped) throw new Error('Stopped');
    // (4) 次世代準備：combinedPts をコピーして currentGen を更新
    currentGen = combinedPts.slice();

    // (5) 新しい「前世代 白点」を作成・描画
    const prevWhiteID = `ptsWhite${iter}`;
    const existingPrevW = scene.getObjectByName(prevWhiteID);
    if (existingPrevW) scene.remove(existingPrevW);
    const ptsWhiteNow = createColoredPoints3D(
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
