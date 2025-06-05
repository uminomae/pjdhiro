// js/modules/quantStereo/qt-ui-navbar.js

import * as THREE from 'three';
import { startAnimation, pauseAnimation, resumeAnimation, stopAnimation } from './qt-animation-loop.js';
import { addHelpersAndLights } from './qt-init-scene-helpers.js';
import { initUI }              from './qt-init-ui.js';

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
  const inputBgColor     = document.getElementById('input-bg-color');
  const inputSphereColor = document.getElementById('input-sphere-color');
  const inputPeak1Color  = document.getElementById('input-peak1-color');
  const inputPeak2Color  = document.getElementById('input-peak2-color');
  const btnConfigComplete = document.getElementById('config-complete-btn');

  if (!inputBgColor || !inputSphereColor || !inputPeak1Color || !inputPeak2Color || !btnConfigComplete) {
    console.warn('[qt-ui-navbar] Offcanvas のカラー入力要素が見つかりません。ID を確認してください。');
  } else {
    // 「設定完了」ボタン押下時に各カラーをグローバルに保存
    btnConfigComplete.addEventListener('click', () => {
      // 1) 背景色ダーク／ライトを分割して保持
      //    ここでは Offcanvas に「背景色」一つだけの入力なので、
      //    暗→明 の補間時には「暗色をそのまま暗で使い、明色は白固定」としています。
      //    より正確に「暗色／明色」両方設定したい場合は Offcanvas 側で2つ用意してください。
      const bgHex = inputBgColor.value || '#000011';
      window._bgColorDark  = bgHex;
      window._bgColorLight = '#ffffff'; // もし「明」も Offcanvas で選びたい場合は別 input を用意し、ここで取得

      // 2) 球ベース色
      window._sphereBaseColor = inputSphereColor.value || '#ffffff';

      // 3) ピーク色①・ピーク色②
      window._peakColor1 = inputPeak1Color.value || '#808080';
      window._peakColor2 = inputPeak2Color.value || '#000000';

      console.log(
        '[qt-ui-navbar] カラー設定更新: ',
        '_bgColorDark=', window._bgColorDark,
        ' _bgColorLight=', window._bgColorLight,
        ' _sphereBaseColor=', window._sphereBaseColor,
        ' _peakColor1=', window._peakColor1,
        ' _peakColor2=', window._peakColor2
      );
    });
  }

  // 初期状態：Run を表示、Pause は隠す
  btnRun.classList.remove('d-none');
  btnPause.classList.add('d-none');

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
    btnPause.classList.add('d-none');
    btnRun.classList.remove('d-none');

    // 1) アニメーションを停止
    stopAnimation();
    hasEverStarted = false;

    // 2) シーン内オブジェクトをすべて削除
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // 3) 背景色を「初期のダーク (#000011)」に戻す
    scene.background = new THREE.Color('#000011');

    // 4) 照明 + 軸ヘルパー を再追加
    addHelpersAndLights(scene);

    // 5) UI (Top View ボタン・αβγδ 表示) を再初期化
    initUI({ scene, camera, renderer, controls });

    // 7) 必要ならカメラ位置をリセット
    //    camera.position.set(0, 0, 5);
    //    camera.up.set(0, 1, 0);
    //    camera.lookAt(0, 0, 0);
    //    controls.update();
  });
}
