// js/modules/quantStereo/qt-main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { addHelpersAndLights, addGroundWithTexture } from './qt-init-helpers.js';
import { initUI }              from './qt-init.js';
import { setupNavbarControls } from './qt-navbar.js';
import { startAnimation }      from './qt-animation.js';

import {
  CAMERA_INITIAL_POSITION,
  CAMERA_AUTO_ROTATE_ENABLED,
  CAMERA_AUTO_ROTATE_PERIOD,
  CAMERA_POLAR_ANGLE,
  CAMERA_AZIMUTH_ANGLE
} from './qt-config.js';

let groundMesh;

/**
 * startModule({ scene, camera, renderer, controls })
 *  ・quantStereo モジュールのエントリーポイント
 *  ・シーン背景色の設定、照明・ヘルパー追加、UI 初期化、
 *    ナビバーボタンのセットアップを行う
 *  ・アニメーション (Run / Pause / Reset の処理) は qt-animation.js / qt-navbar.js に委譲
 *
 * @param {Object}       context
 * @param {THREE.Scene}  context.scene
 * @param {THREE.Camera} context.camera
 * @param {THREE.Renderer}context.renderer
 * @param {OrbitControls}context.controls
 */
export function startModule({ scene, camera, renderer, controls }) {
  console.log('[qt-st-main] startModule() が呼ばれました');

  // ——————————————————————————————
  // (1) カメラ初期位置の設定
  // ——————————————————————————————
  camera.position.set(
    CAMERA_INITIAL_POSITION[0],
    CAMERA_INITIAL_POSITION[1],
    CAMERA_INITIAL_POSITION[2]
  );
  camera.lookAt(0, 0, 0);
  controls.update();

  // ——————————————————————————————
  // (2) OrbitControls 自動回転の設定
  // ——————————————————————————————
  if (CAMERA_AUTO_ROTATE_ENABLED) {
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 360 / CAMERA_AUTO_ROTATE_PERIOD; // deg/sec
  } else {
    controls.autoRotate = false;
  }

  // ——————————————————————————————
  // (3) カメラの上下・左右回転角度範囲を設定
  // ——————————————————————————————
  controls.minPolarAngle   = CAMERA_POLAR_ANGLE.MIN;   // 真上(0) ～ 真下(π)
  controls.maxPolarAngle   = CAMERA_POLAR_ANGLE.MAX;
  controls.minAzimuthAngle = CAMERA_AZIMUTH_ANGLE.MIN; // 水平回転は制限なし
  controls.maxAzimuthAngle = CAMERA_AZIMUTH_ANGLE.MAX;

  // ——————————————————————————————
  // (4) シーン初期化
  //   ・背景色、照明 + 軸ヘルパー、地面 (最初は非表示) を設定
  // ——————————————————————————————
  scene.background = new THREE.Color(0x000011);
  addHelpersAndLights(scene);

  groundMesh = addGroundWithTexture(
    scene,
    '/myPj/qt-st-visual/assets/onmyo.png',
    { width: 10, depth: 10, repeatX: 1, repeatZ: 1 }
  );
  groundMesh.visible = false;
  setupGroundToggle();

  // ——————————————————————————————
  // (5) UI 初期化・ナビバーボタン登録
  // ——————————————————————————————
  initUI({ scene, camera, renderer, controls });
  setupNavbarControls({ scene, camera, renderer, controls });

  // ——————————————————————————————
  // (6) ページ読み込み時に自動でアニメーション開始したい場合
  //     → 以下のコメントを外すと即時開始
  // ——————————————————————————————
  startAnimation(scene, camera, controls);
  const btnRun   = document.getElementById('btn-run');
  const btnPause = document.getElementById('btn-pause');
  if (btnRun && btnPause) {
    btnRun.classList.add('d-none');
    btnPause.classList.remove('d-none');
  }
  // ← これにより Load 時点で θ=0 から即スタートする設定にできます

  console.log('[qt-st-main] startModule() の初期化が完了しました');
}

/**
 * setupGroundToggle()
 *  ・Offcanvas の「床表示」チェックボックスを監視し、
 *    groundMesh.visible を切り替える
 */
function setupGroundToggle() {
  const checkbox = document.getElementById('toggle-ground-visibility');
  if (!checkbox) {
    console.warn('[qt-st-main] チェックボックスが見つかりません: toggle-ground-visibility');
    return;
  }
  groundMesh.visible = checkbox.checked;
  checkbox.addEventListener('change', () => {
    if (groundMesh) {
      groundMesh.visible = checkbox.checked;
    }
  });
}
