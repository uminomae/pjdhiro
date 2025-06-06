// js/modules/quantStereo/qt-ui-navbar.js

import * as THREE from 'three';
import { startAnimation, pauseAnimation, resumeAnimation, stopAnimation } from './qt-animation-loop.js';
import { initializeScene } from './qt-init-scene-helpers.js';
import { initializeControls } from './qt-controls.js';
import {
  CAMERA_INITIAL_POSITION,
  CAMERA_TARGET
} from './qt-config.js';

let hasEverStarted = false;

/**
 * setupNavbarControls(context)
 *
 * ・Run / Pause / Reset ボタンの設定
 * ・さらに Offcanvas のカラー入力 (背景, 球ベース, ピーク1, ピーク2) を
 *   設定完了時に グローバル変数 (window._XXX) として格納する
 *
 * @param {Object} context
 * @param {THREE.Scene}    context.scene
 * @param {THREE.Camera}   context.camera
 * @param {THREE.Renderer} context.renderer
 * @param {OrbitControls}  context.controls
 */
export function setupNavbarControls({ scene, camera, renderer, controls }) {
  // ページロード直後の Run/Pause ボタン初期状態を設定
  const btnRun   = document.getElementById('btn-run');
  const btnPause = document.getElementById('btn-pause');
  const btnReset = document.getElementById('btn-reset');
  if (btnRun && btnPause) {
    btnRun.classList.add('d-none');
    btnPause.classList.remove('d-none');
  }

  if (!btnRun || !btnPause || !btnReset) {
    console.warn('[qt-ui-navbar] Run/Pause/Reset ボタンが見つかりません。');
    return;
  }

  // Offcanvas の各入力要素を取得
  // const inputBgColor     = document.getElementById('input-bg-color');
  // const inputSphereColor = document.getElementById('input-sphere-color');
  // const inputPeak1Color  = document.getElementById('input-peak1-color');
  // const inputPeak2Color  = document.getElementById('input-peak2-color');

  btnRun.classList.add('d-none');
  btnPause.classList.remove('d-none');

  // — Run ボタン押下時 —
  btnRun.addEventListener('click', () => {
    console.log('[qt-ui-navbar] Run clicked');
    btnRun.classList.add('d-none');
    btnPause.classList.remove('d-none');

    if (!hasEverStarted) {
      startAnimation(scene, camera, controls);
      hasEverStarted = true;
    } else {
      resumeAnimation(scene, camera, controls);
    }
  });

  // — Pause ボタン押下時 —
  btnPause.addEventListener('click', () => {
    console.log('[qt-ui-navbar] Pause clicked');
    btnPause.classList.add('d-none');
    btnRun.classList.remove('d-none');
    pauseAnimation();
  });

  // — Reset ボタン押下時 —
  btnReset.addEventListener('click', () => {
    console.log('[qt-ui-navbar] Reset clicked');
    // 〈A〉UI（チェックボックス・カラー入力）を“HTML デフォルト”に戻す
    const cbGrid   = document.getElementById('toggle-grid-sphere');
    const cbGround = document.getElementById('toggle-ground-visibility');
    const cbVert   = document.getElementById('toggle-camera-vertical');
    const cbHoriz  = document.getElementById('toggle-camera-horizontal');
    const inBg     = document.getElementById('input-bg-color');
    const inSp     = document.getElementById('input-sphere-color');
    const inPk1    = document.getElementById('input-peak1-color');
    const inPk2    = document.getElementById('input-peak2-color');

    if (cbGrid   instanceof HTMLInputElement) cbGrid.checked   = false;      // グリッド球 OFF
    if (cbGround instanceof HTMLInputElement) cbGround.checked = true;       // 床 ON
    if (cbVert   instanceof HTMLInputElement) cbVert.checked   = true;       // 垂直回転 ON
    if (cbHoriz  instanceof HTMLInputElement) cbHoriz.checked  = true;       // 水平回転 ON

    if (inBg   instanceof HTMLInputElement) { inBg.value   = '#000011'; window._bgColorDark  = '#000011'; window._bgColorLight = '#ffffff'; }
    if (inSp   instanceof HTMLInputElement) { inSp.value   = '#ffffff'; window._sphereBaseColor = '#ffffff'; }
    if (inPk1  instanceof HTMLInputElement) { inPk1.value  = '#808080'; window._peakColor1    = '#808080'; }
    if (inPk2  instanceof HTMLInputElement) { inPk2.value  = '#000000'; window._peakColor2    = '#000000'; }

    // 〈B〉アニメーション停止＆シーンクリア
    stopAnimation();
    hasEverStarted = false;

    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    // 背景色をデフォルトに戻す
    scene.background = new THREE.Color('#000011');

    // 〈C〉ライト + ヘルパーを再追加
    // addHelpersAndLights(scene);

    // 〈D〉カメラ位置・向きを起動時のデフォルトに戻し
    // ※CAMERA_INITIAL_POSITION／CAMERA_TARGET は qt-config.js で定義
    camera.position.set(
      ...CAMERA_INITIAL_POSITION
    );
    camera.lookAt(...CAMERA_TARGET);
    camera.up.set(0, 1, 0);
    controls.update();

    // 〈E〉OrbitControls の設定を“デフォルト”で再初期化
    initializeControls(controls);

    // 〈F〉シーン全体の再初期化
    initializeScene({ scene, camera, controls });

    // 〈G〉アニメーション再開と Run/Pause ボタン表示リセット
    // startAnimation(scene, camera, controls);
    btnRun.classList.remove('d-none');
    btnPause.classList.add('d-none');
  });
}
