// ─────────────────────────────────────────────────────────────
// ファイルパス: /js/yinyang-main/threejs-init.js
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { THREE_INIT } from '../yinyang-config.js';  // 設定ファイルを参照

export let scene, camera, renderer, controls;

/**
 * initThreejs()
 *  - <div id="canvas-container"> のサイズを取得して WebGLRenderer, Scene, Camera, Controls を生成
 *  - 設定ファイル THREE_INIT から ID を取得する
 *  - 戻り値: { scene, camera, renderer, controls }
 */
export function initThreejs() {
  console.log('[threejs-init] initThreejs() を実行');

  // 1) 親要素を ID から取得
  const container = document.getElementById(THREE_INIT.CANVAS_CONTAINER_ID);
  if (!container) {
    throw new Error(`[threejs-init] threejs-init: ID "${THREE_INIT.CANVAS_CONTAINER_ID}" の要素が見つかりません`);
  }

  // 2) サイズを取得
  const width = container.clientWidth;
  const height = container.clientHeight;
  console.log('[threejs-init] container size =', width, 'x', height);

  // 3) レンダラー生成
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x111111, 1);
  container.appendChild(renderer.domElement);
  console.log('[threejs-init] WebGLRenderer を追加');

  // 4) シーン生成
  scene = new THREE.Scene();

  // 5) カメラ生成
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  // 6) OrbitControls 生成
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  console.log('[threejs-init] Scene/Camera/Controls を初期化完了');
  return { scene, camera, renderer, controls };
}
