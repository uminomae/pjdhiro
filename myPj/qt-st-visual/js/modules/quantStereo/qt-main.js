// js/modules/quantStereo/qt-main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// import { addHelpersAndLights, addGroundWithTexture } from './qt-init-scene-helpers.js';
import { initUI }              from './qt-init-ui.js';
import { setupNavbarControls } from './qt-ui-navbar.js';
import { startAnimation }      from './qt-animation.js';

import {
  CAMERA_AUTO_ROTATE_ENABLED,
  CAMERA_AUTO_ROTATE_PERIOD,
  CAMERA_POLAR_ANGLE,
  CAMERA_AZIMUTH_ANGLE,
} from './qt-config.js';
import { setEnableVertical } from './qt-animation.js';
import { initializeScene, addHelpersAndLights, addGroundWithTexture } from './qt-init-scene-helpers.js'; // 既存

/**
 * quantStereo モジュールのエントリーポイント
 * @param {Object}      context
 * @param {THREE.Scene} context.scene
 * @param {THREE.Camera}context.camera
 * @param {THREE.Renderer} context.renderer
 * @param {OrbitControls}context.controls
 */
export function startModule({ scene, camera, renderer, controls }) {
  console.log('[qt-st-main] startModule() が呼ばれました');
  initializeScene({scene, camera, controls});

  // --- 水平回転(on/off) の初期設定 ---
  // --- 手動回転は常に有効にする／自動回転はチェックボックスで制御 ---
  //    controls.enableRotate = true としておき、autoRotate は後で切り替える  controls.enableRotate = true;
  const elHoriz = document.getElementById('toggle-camera-horizontal');
  if (elHoriz instanceof HTMLInputElement) {
    // 初期状態：チェックされていれば自動回転を有効に、外されていれば無効
    controls.autoRotate = elHoriz.checked && CAMERA_AUTO_ROTATE_ENABLED;
  } else {
    // チェックボックスが存在しない場合はデフォルト true（あるいは false）にしておく
    controls.enableRotate = true;
  }
  
  // 2) OrbitControls 自動回転設定
  if (CAMERA_AUTO_ROTATE_ENABLED && controls.enableRotate) {
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 360 / CAMERA_AUTO_ROTATE_PERIOD;
  } else {
    controls.autoRotate = false;
  }

  // 3) カメラ回転範囲（Polar / Azimuth）
  controls.minPolarAngle   = CAMERA_POLAR_ANGLE.MIN;
  controls.maxPolarAngle   = CAMERA_POLAR_ANGLE.MAX;
  controls.minAzimuthAngle = CAMERA_AZIMUTH_ANGLE.MIN;
  controls.maxAzimuthAngle = CAMERA_AZIMUTH_ANGLE.MAX;

  // 5) UI 初期化、ナビバーボタン登録
  initUI({ scene, camera, renderer, controls });
  setupNavbarControls({ scene, camera, renderer, controls });


  // --- 「水平回転」チェックボックスに change イベントを登録 ---
  if (elHoriz instanceof HTMLInputElement) {
    elHoriz.addEventListener('change', () => {
      // 手動は常に true にしておく
      controls.enableRotate = true;
      // 自動回転だけをチェックボックスで切り替える
      controls.autoRotate = elHoriz.checked && CAMERA_AUTO_ROTATE_ENABLED;
    });
  }
  // --- 垂直往復(on/off) をコントロールするチェックボックスの取得 & イベント登録 ---
  const elVert = document.getElementById('toggle-camera-vertical');
  if (elVert instanceof HTMLInputElement) {
    // 初期状態を反映
    setEnableVertical(elVert.checked);
    elVert.addEventListener('change', () => {
      setEnableVertical(elVert.checked);
    });
  }

  // 6) ページ読み込み時にアニメーションを開始
  startAnimation(scene, camera, controls);
  const btnRun   = document.getElementById('btn-run');
  const btnPause = document.getElementById('btn-pause');
  if (btnRun && btnPause) {
    btnRun.classList.add('d-none');
    btnPause.classList.remove('d-none');
  }

  console.log('[qt-st-main] 初期化が完了しました');
}

