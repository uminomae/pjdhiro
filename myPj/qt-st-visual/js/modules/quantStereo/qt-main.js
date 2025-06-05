// js/modules/quantStereo/qt-main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { addHelpersAndLights, addGroundWithTexture } from './qt-init-scene-helpers.js';
import { initUI }              from './qt-init.js';
import { setupNavbarControls } from './qt-navbar.js';
import { startAnimation }      from './qt-animation.js';

import {
  CAMERA_INITIAL_POSITION,
  CAMERA_AUTO_ROTATE_ENABLED,
  CAMERA_AUTO_ROTATE_PERIOD,
  CAMERA_ENABLE_HORIZONTAL,
  CAMERA_POLAR_ANGLE,
  CAMERA_AZIMUTH_ANGLE,
  YIN_YANG_SYMBOL,
  CAMERA_TARGET
} from './qt-config.js';
import { setEnableVertical } from './qt-animation.js';

let groundMesh;

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

  // 1) カメラ初期位置
  camera.position.set(
    CAMERA_INITIAL_POSITION[0],
    CAMERA_INITIAL_POSITION[1],
    CAMERA_INITIAL_POSITION[2]
  );

  // 2) 水平方向（OrbitControls.rotate）を有効/無効
  //    ・enableRotate = false にするとマウスドラッグで水平回転ができなくなる

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
  // controls.enableRotate = CAMERA_ENABLE_HORIZONTAL;

  const [tx, ty, tz] = CAMERA_TARGET;
  camera.lookAt(tx, ty, tz);
  controls.update();

  
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

  // 4) シーン背景色、照明・ヘルパー、床メッシュ（非表示）
  scene.background = new THREE.Color(0x000011);
  addHelpersAndLights(scene);

  groundMesh = addGroundWithTexture(
    scene,
    YIN_YANG_SYMBOL,
    { width: 10, depth: 10, repeatX: 1, repeatZ: 1 }
  );
  setupGroundToggle();

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

function setupGroundToggle() {
  const checkbox = document.getElementById('toggle-ground-visibility');
  if (!checkbox) {
    console.warn('[qt-st-main] toggle-ground-visibility が見つかりません');
    return;
  }
  groundMesh.visible = checkbox.checked;
  checkbox.addEventListener('change', () => {
    if (groundMesh) {
      groundMesh.visible = checkbox.checked;
    }
  });
}
