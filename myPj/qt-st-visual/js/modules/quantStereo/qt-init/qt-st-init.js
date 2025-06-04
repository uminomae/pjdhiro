// ─────────────────────────────────────────────────────────────
// ファイルパス: js/modules/quantStereo/qt-st-init.js
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import {
  CANVAS_CONTAINER_ID,
  UI_DOM_IDS,
  RES_THETA,
  RES_PHI,
  PROJECTION_TYPE,
  QUATERNION_SEQUENCE,
  COLOR_PARAMS
} from '../qt-config.js';

import { createQuaternionStereographicPoints } from './qt-utils.js';

/** 
 * initScene()
 *  ────────────────────────────────────────────────────────────
 *  Scene, Camera, Renderer, Controls を生成し返します。
 *  
 *  @returns {{
 *    scene:    THREE.Scene,
 *    camera:   THREE.PerspectiveCamera,
 *    renderer: THREE.WebGLRenderer,
 *    controls: OrbitControls
 *  }}
 */
export function initScene() {
  console.log('[qt-st-init] initScene() を実行');

  // (1) コンテナ要素取得
  const container = document.getElementById(CANVAS_CONTAINER_ID);
  if (!container) {
    throw new Error(`[qt-st-init] initScene: "${CANVAS_CONTAINER_ID}" が見つかりません`);
  }
  const width = container.clientWidth;
  const height = container.clientHeight;
  console.log(`[qt-st-init] コンテナサイズ = ${width} x ${height}`);

  // (2) レンダラー生成
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x111111, 1);
  container.appendChild(renderer.domElement);
  console.log('[qt-st-init] WebGLRenderer を追加');

  // (3) シーン生成
  const scene = new THREE.Scene();

  // (4) カメラ生成
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  // (5) OrbitControls 生成
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.enablePan = false;
  controls.rotateSpeed = 0.5;
  console.log('[qt-st-init] Scene/Camera/Controls を初期化完了');

  return { scene, camera, renderer, controls };
}

/**
 * addHelpersAndLights(scene)
 *  ────────────────────────────────────────────────────────────
 *  環境光・方向光・AxesHelper をシーンに追加します。
 *
 *  @param {THREE.Scene} scene
 */
export function addHelpersAndLights(scene) {
  console.log('[qt-st-init] addHelpersAndLights() を実行');

  // 環境光
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  // 方向光
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // 軸ヘルパー
  const axesHelper = new THREE.AxesHelper(1.5);
  scene.add(axesHelper);

  console.log('[qt-st-init] 環境光・方向光・AxesHelper を追加完了');
}

/**
 * initPointCloud(scene)
 *  ────────────────────────────────────────────────────────────
 *  現在の index=0 の四元数に対応する点群を作成して scene に追加します。
 *
 *  @param {THREE.Scene} scene
 */
export function initPointCloud(scene) {
  console.log('[qt-st-init] initPointCloud() を実行');

  // currentQIndex = 0 を想定
  const index = 0;
  createAndAddPointCloud(scene, index);
}

/**
 * createAndAddPointCloud(scene, index)
 *  ────────────────────────────────────────────────────────────
 *  index 番目の四元数に対応する点群を作成し、scene に追加します。
 *
 *  @param {THREE.Scene} scene
 *  @param {number} index
 */
export function createAndAddPointCloud(scene, index) {
  console.log('[qt-st-init] createAndAddPointCloud() index =', index);

  // (1) 既存メッシュがあれば削除
  const existing = scene.getObjectByName('quaternionMesh');
  if (existing) {
    scene.remove(existing);
    existing.geometry.dispose();
    existing.material.dispose();
    console.log('[qt-st-init] 既存点群を削除');
  }

  // (2) ステレオ投影した rawPoints を取得
  const rawPoints = createQuaternionStereographicPoints(RES_THETA, RES_PHI, PROJECTION_TYPE);
  console.log('[qt-st-init] rawPoints の要素数 =', rawPoints.length);

  // (3) Float32Array に詰め込み
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
  console.log('[qt-st-init] positions/colors の作成完了');

  // (4) BufferGeometry + PointsMaterial を作成
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
  geom.setAttribute('color',    new THREE.Float32BufferAttribute(colArr, 3));

  const mat = new THREE.PointsMaterial({
    vertexColors:    true,
    size:            0.03,
    sizeAttenuation: true
  });

  // (5) THREE.Points オブジェクトを生成して追加
  const points = new THREE.Points(geom, mat);
  points.name = 'quaternionMesh';
  scene.add(points);
  console.log('[qt-st-init] 新しい点群をシーンに追加 (n=', n, ')');
}

/**
 * initUI(context)
 *  ────────────────────────────────────────────────────────────
 *  スライダー・ボタン・変数表示 の初期化をまとめて行います。
 *
 *  @param {{
 *    scene:    THREE.Scene,
 *    camera:   THREE.Camera,
 *    renderer: THREE.WebGLRenderer,
 *    controls: OrbitControls
 *  }} context
 */
export function initUI({ scene, camera, renderer, controls }) {
  console.log('[qt-st-init] initUI() を実行');

  // ① i‐scale スライダー
  const inputI = document.getElementById(UI_DOM_IDS.SLIDER_I);
  const labelI = document.getElementById(UI_DOM_IDS.LABEL_I);
  if (inputI && labelI) {
    labelI.textContent = parseFloat(inputI.value).toFixed(2);
    inputI.addEventListener('input', () => {
      const v = parseFloat(inputI.value);
      labelI.textContent = v.toFixed(2);
      console.log('[qt-st-init] i‐scale 変更 →', v);
      const mesh = scene.getObjectByName('quaternionMesh');
      if (mesh) mesh.scale.x = v;
    });
  } else {
    console.warn('[qt-st-init] SLIDER_I or LABEL_I が見つかりません');
  }

  // ② k‐scale スライダー
  const inputK = document.getElementById(UI_DOM_IDS.SLIDER_K);
  const labelK = document.getElementById(UI_DOM_IDS.LABEL_K);
  if (inputK && labelK) {
    labelK.textContent = parseFloat(inputK.value).toFixed(2);
    inputK.addEventListener('input', () => {
      const v = parseFloat(inputK.value);
      labelK.textContent = v.toFixed(2);
      console.log('[qt-st-init] k‐scale 変更 →', v);
      const mesh = scene.getObjectByName('quaternionMesh');
      if (mesh) mesh.scale.z = v;
    });
  } else {
    console.warn('[qt-st-init] SLIDER_K or LABEL_K が見つかりません');
  }

  // ③ Next Q ボタン
  let currentQIndex = 0;
  const btnNextQ = document.getElementById(UI_DOM_IDS.BTN_NEXT_Q);
  if (btnNextQ) {
    btnNextQ.addEventListener('click', () => {
      console.log('[qt-st-init] Next Q がクリックされました');
      currentQIndex = (currentQIndex + 1) % QUATERNION_SEQUENCE.length;
      console.log('[qt-st-init] currentQIndex →', currentQIndex);
      createAndAddPointCloud(scene, currentQIndex);
    });
  } else {
    console.warn('[qt-st-init] BTN_NEXT_Q が見つかりません');
  }

  // ④ Top View ボタン
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

  // ⑤ 変数表示 (α,β,γ,δ)
  const dispAlpha = document.getElementById(UI_DOM_IDS.VAL_ALPHA);
  const dispBeta  = document.getElementById(UI_DOM_IDS.VAL_BETA);
  const dispGamma = document.getElementById(UI_DOM_IDS.VAL_GAMMA);
  const dispDelta = document.getElementById(UI_DOM_IDS.VAL_DELTA);
  if (dispAlpha) dispAlpha.textContent = '0.000';
  if (dispBeta)  dispBeta.textContent  = '0.000';
  if (dispGamma) dispGamma.textContent = '0.000';
  if (dispDelta) dispDelta.textContent = '0.000';
  if (!dispAlpha && !dispBeta && !dispGamma && !dispDelta) {
    console.warn('[qt-st-init] 変数表示要素 (VAL_ALPHA, …) が見つかりません');
  }

  console.log('[qt-st-init] initUI() 完了');
}

/**
 * startLoop(context)
 *  ────────────────────────────────────────────────────────────
 *  アニメーションループを開始します（controls.update → render → 再帰）。 
 *
 *  @param {{
 *    scene:    THREE.Scene,
 *    camera:   THREE.Camera,
 *    renderer: THREE.WebGLRenderer,
 *    controls: OrbitControls
 *  }} context
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
