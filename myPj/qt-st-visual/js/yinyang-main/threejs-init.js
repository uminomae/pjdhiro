// js/qt-main/threejs-init.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { THREE_INIT } from '../yinyang-config.js';

export let scene, camera, renderer, controls;

/**
 * initThreejs()
 *  ────────────────────────────────────────────────────────────
 *  <div id="canvas-container"> からサイズを取得して、WebGLRenderer, Scene, Camera, Controls を生成。
 *  呼び出すのはアプリ起動時に一度だけ。
 *
 *  @returns {{
 *    scene:    THREE.Scene,
 *    camera:   THREE.PerspectiveCamera,
 *    renderer: THREE.WebGLRenderer,
 *    controls: OrbitControls
 *  }}
 */
export function initThreejs() {
  console.log('[threejs-init] initThreejs() を実行');

  const container = document.getElementById(THREE_INIT.CANVAS_CONTAINER_ID);
  if (!container) {
    throw new Error(`[threejs-init] ID="${THREE_INIT.CANVAS_CONTAINER_ID}" が見つかりません`);
  }

  const width  = container.clientWidth;
  const height = container.clientHeight;
  console.log('[threejs-init] container size =', width, '×', height);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x111111, 1);
  container.appendChild(renderer.domElement);
  console.log('[threejs-init] WebGLRenderer を追加');

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping   = true;
  controls.dampingFactor   = 0.1;
  controls.enablePan       = false;
  controls.rotateSpeed     = 0.5;
  console.log('[threejs-init] Scene/Camera/Controls を初期化完了');

  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    console.log('[threejs-init] リサイズ処理:', w, '×', h);
  });

  return { scene, camera, renderer, controls };
}
