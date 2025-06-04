// js/modules/quantStereo/qt-st-init.js

import * as THREE from 'three';
import { createQuaternionStereographicPoints } from './qt-utils.js';
import {
  RES_THETA,
  RES_PHI,
  PROJECTION_TYPE,
  UI_DOM_IDS,
  QUATERNION_SEQUENCE
} from '../qt-config.js';

let currentQIndex = 0;

/**
 * addHelpersAndLights()
 *  ────────────────────────────────────────────────────────────
 *  渡された scene に照明・軸ヘルパーを追加するだけ。
 *
 * @param {THREE.Scene} scene
 */
export function addHelpersAndLights(scene) {
  console.log('[qt-st-init] addHelpersAndLights()');

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  const axesHelper = new THREE.AxesHelper(1.5);
  scene.add(axesHelper);

  console.log('[qt-st-init] 照明と軸ヘルパーを追加完了');
}

/**
 * createAndAddPointCloud()
 *  ────────────────────────────────────────────────────────────
 *  渡された scene に四元数ステレオ投影点群を作成して追加する。
 *
 * @param {THREE.Scene} scene
 * @param {number} index   QUATERNION_SEQUENCE のインデックス
 */
export function createAndAddPointCloud(scene, index) {
  console.log('[qt-st-init] createAndAddPointCloud() index =', index);

  // 既存点群があれば削除
  const existing = scene.getObjectByName('quaternionMesh');
  if (existing) {
    scene.remove(existing);
    existing.geometry.dispose();
    existing.material.dispose();
    console.log('[qt-st-init] 既存点群を削除');
  }

  // ステレオ投影で rawPoints を取得
  const rawPoints = createQuaternionStereographicPoints(
    RES_THETA,
    RES_PHI,
    PROJECTION_TYPE,
    QUATERNION_SEQUENCE[index]
  );
  console.log('[qt-st-init] rawPoints length =', rawPoints.length);

  if (rawPoints.length === 0) {
    console.warn('[qt-st-init] rawPoints が 0 件、点群を作成できませんでした');
    return;
  }

  // Float32Array に詰め込む
  const n = rawPoints.length;
  const posArr = new Float32Array(n * 3);
  const colArr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const p = rawPoints[i].position;
    const c = rawPoints[i].color;
    posArr[3 * i + 0] = p.x;
    posArr[3 * i + 1] = p.y;
    posArr[3 * i + 2] = p.z;
    colArr[3 * i + 0] = c.r;
    colArr[3 * i + 1] = c.g;
    colArr[3 * i + 2] = c.b;
  }
  console.log('[qt-st-init] positions/colors を作成完了 (n=', n, ')');

  // BufferGeometry + PointsMaterial を作成
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
  geom.setAttribute('color',    new THREE.Float32BufferAttribute(colArr, 3));
  const mat = new THREE.PointsMaterial({
    vertexColors:    true,
    size:            0.03,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geom, mat);
  points.name = 'quaternionMesh';
  scene.add(points);
  console.log('[qt-st-init] 新しい点群をシーンに追加');
}

/**
 * initUI()
 *  ────────────────────────────────────────────────────────────
 *  渡された context (scene, camera, renderer, controls) を使って
 *  スライダー／ボタン／変数表示を初期化。scene を再生成しない。
 *
 * @param {{
 *    scene:    THREE.Scene,
 *    camera:   THREE.PerspectiveCamera,
 *    renderer: THREE.WebGLRenderer,
 *    controls: OrbitControls
 * }} context
 */
export function initUI({ scene, camera, renderer, controls }) {
  console.log('[qt-st-init] initUI()');

  // i‐scale スライダー
  const inputI = document.getElementById(UI_DOM_IDS.SLIDER_I);
  const labelI = document.getElementById(UI_DOM_IDS.LABEL_I);
  if (inputI && labelI) {
    labelI.textContent = parseFloat(inputI.value).toFixed(2);
    inputI.addEventListener('input', () => {
      const v = parseFloat(inputI.value);
      labelI.textContent = v.toFixed(2);
      const mesh = scene.getObjectByName('quaternionMesh');
      if (mesh) mesh.scale.x = v;
    });
  } else {
    console.warn('[qt-st-init] SLIDER_I or LABEL_I が見つかりません');
  }

  // k‐scale スライダー
  const inputK = document.getElementById(UI_DOM_IDS.SLIDER_K);
  const labelK = document.getElementById(UI_DOM_IDS.LABEL_K);
  if (inputK && labelK) {
    labelK.textContent = parseFloat(inputK.value).toFixed(2);
    inputK.addEventListener('input', () => {
      const v = parseFloat(inputK.value);
      labelK.textContent = v.toFixed(2);
      const mesh = scene.getObjectByName('quaternionMesh');
      if (mesh) mesh.scale.z = v;
    });
  } else {
    console.warn('[qt-st-init] SLIDER_K or LABEL_K が見つかりません');
  }

  // Next Q ボタン
  const btnNextQ = document.getElementById(UI_DOM_IDS.BTN_NEXT_Q);
  if (btnNextQ) {
    btnNextQ.addEventListener('click', () => {
      console.log('[qt-st-init] Next Q がクリックされました');
      currentQIndex = (currentQIndex + 1) % QUATERNION_SEQUENCE.length;
      createAndAddPointCloud(scene, currentQIndex);
    });
  } else {
    console.warn('[qt-st-init] BTN_NEXT_Q が見つかりません');
  }

  // Top View ボタン
  const btnTop = document.getElementById(UI_DOM_IDS.BTN_TOP);
  if (btnTop) {
    btnTop.addEventListener('click', () => {
      console.log('[qt-st-init] Top View がクリックされました');
      camera.position.set(0, 5, 0);
      camera.up.set(0, 0, -1);
      camera.lookAt(0, 0, 0);
      controls.update();
    });
  } else {
    console.warn('[qt-st-init] BTN_TOP が見つかりません');
  }

  // 変数表示 (α, β, γ, δ) 初期化（省略）
  const dispAlpha = document.getElementById(UI_DOM_IDS.VAL_ALPHA);
  const dispBeta  = document.getElementById(UI_DOM_IDS.VAL_BETA);
  const dispGamma = document.getElementById(UI_DOM_IDS.VAL_GAMMA);
  const dispDelta = document.getElementById(UI_DOM_IDS.VAL_DELTA);
  if (dispAlpha) dispAlpha.textContent = '0.000';
  if (dispBeta)  dispBeta.textContent  = '0.000';
  if (dispGamma) dispGamma.textContent = '0.000';
  if (dispDelta) dispDelta.textContent = '0.000';

  console.log('[qt-st-init] initUI() 完了');
}

/**
 * startLoop()
 *  ────────────────────────────────────────────────────────────
 *  渡された context を使ってアニメーションループを開始する。
 *
 * @param {{
 *    scene:    THREE.Scene,
 *    camera:   THREE.PerspectiveCamera,
 *    renderer: THREE.WebGLRenderer,
 *    controls: OrbitControls
 * }} context
 */
export function startLoop({ scene, camera, renderer, controls }) {
  console.log('[qt-st-init] startLoop() を実行');
  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
  console.log('[qt-st-init] アニメーションループ開始');
}
