// js/qt-st-init.js の先頭を次のように変更
// import { THREE } from '../app.js';
// import { THREE, OrbitControls } from '../app.js';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


/**
 * three.js の共通初期化。
 *  - WebGLRenderer を生成し canvasContainer に埋め込む
 *  - Scene, Camera, OrbitControls を生成する
 *  - 必要に応じて ambientLight などを追加
 *
 * @param {object} opts
 * @param {string} opts.canvasContainerId  - レンダラーを配置する div の ID
 * @param {string} opts.legendCanvasId     - 凡例表示用 2D canvas の ID
 * @returns {{ scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer, controls: OrbitControls }}
 */
export function initCommon({ canvasContainerId, legendCanvasId }) {
  // 1) 描画領域の親要素を取得
  const container = document.getElementById(canvasContainerId);
  if (!container) throw new Error(`[initCommon] ${canvasContainerId} が見つかりません`);

  // 2) three.js のシーンを作成
  const scene = new THREE.Scene();

  // 3) カメラを作成
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  // 4) レンダラーを作成して DOM に追加
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // 5) OrbitControls を設定
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 6) ライトを追加（任意）
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  // 7) Window リサイズ時にリサイズ対応
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // 8) 凡例用 2D canvas（もしあれば CSS で位置調整済みとする）
  const legendCanvas = document.getElementById(legendCanvasId);
  if (legendCanvas) {
    // ここで凡例用 2D canvas の初期化処理を行う（後述）
    // 例：legendCanvas.getContext('2d') など
  }

  return { scene, camera, renderer, controls };
}
