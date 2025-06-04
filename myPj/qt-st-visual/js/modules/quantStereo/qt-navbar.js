// js/modules/quantStereo/qt-navbar.js

import * as THREE from 'three';                             // ★追加
import { startAnimation, pauseAnimation, resumeAnimation, stopAnimation } from './qt-animation.js';
import { addHelpersAndLights } from './qt-init-helpers.js'; // ★追加
import { initUI }              from './qt-init.js';         // ★追加
import { create, normalize }   from './qt-quat-utils.js';   // ★追加
import { overlayEarthGridAndProjection } from './qt-pointcloud.js'; // ★追加
import { RES_THETA, RES_PHI } from './qt-config.js';         // ★追加

let hasEverStarted = false;

/**
 * setupNavbarControls(context)
 *   ・HTML 上の Run / Pause / Reset ボタンにイベントリスナを登録
 *   ・context には { scene, camera, renderer, controls } を渡す想定
 *   ・初回は startAnimation(scene)、二回目以降は resumeAnimation(scene)
 *   ・Reset を押したら stopAnimation() → シーンをクリアして初期状態を再構築 → hasEverStarted を false に戻す
 *
 * 必要な HTML ボタン (例):
 *   <button id="btn-run">Run</button>
 *   <button id="btn-pause" class="d-none">Pause</button>
 *   <button id="btn-reset">Reset</button>
 *
 * @param {Object} context
 * @param {THREE.Scene}    context.scene
 * @param {THREE.Camera}   context.camera
 * @param {THREE.Renderer} context.renderer
 * @param {OrbitControls}  context.controls
 */
export function setupNavbarControls({ scene, camera, renderer, controls }) {
  const btnRun   = document.getElementById('btn-run');
  const btnPause = document.getElementById('btn-pause');
  const btnReset = document.getElementById('btn-reset');

  if (!btnRun || !btnPause || !btnReset) {
    console.warn('[qt-navbar] Run/Pause/Reset ボタンが見つかりません。');
    return;
  }

  // 初期状態：Run を表示、Pause は隠す
  btnRun.classList.remove('d-none');
  btnPause.classList.add('d-none');

  // — Run ボタン押下時 —
  btnRun.addEventListener('click', () => {
    console.log('[qt-navbar] Run clicked');
    btnRun.classList.add('d-none');
    btnPause.classList.remove('d-none');

    if (!hasEverStarted) {
      startAnimation(scene);
      hasEverStarted = true;
    } else {
      resumeAnimation(scene);
    }
  });

  // — Pause ボタン押下時 —
  btnPause.addEventListener('click', () => {
    console.log('[qt-navbar] Pause clicked');
    btnPause.classList.add('d-none');
    btnRun.classList.remove('d-none');
    pauseAnimation();
  });

  // — Reset ボタン押下時 —
  btnReset.addEventListener('click', () => {
    console.log('[qt-navbar] Reset clicked');
    btnPause.classList.add('d-none');
    btnRun.classList.remove('d-none');

    // 1) アニメーションを完全停止
    stopAnimation();
    hasEverStarted = false;

    // 2) シーン内の全オブジェクトをクリア
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // 3) 背景色を「初期のダーク」に戻す
    scene.background = new THREE.Color(0x000011);

    // 4) 照明 + 軸ヘルパー を再追加
    addHelpersAndLights(scene);

    // 5) UI(Top View ボタン・α,β,γ,δ 表示) を再初期化
    initUI({ scene, camera, renderer, controls });

    // 6) θ=0 の状態で「地球グリッド＋ステレオ投影球」を再描画
    //    （最初は quaternion = (w=1, x=0, y=0, z=0) の単位四元数で回転ゼロ）
    // const qIdentity = normalize(create(1, 0, 0, 0));
    // overlayEarthGridAndProjection(scene, qIdentity, RES_THETA, RES_PHI);

    // 7) もしカメラを初期位置に戻したい場合は、たとえば以下を追加してください：
    //    camera.position.set(0, 0, 5);
    //    camera.up.set(0, 1, 0);
    //    camera.lookAt(0, 0, 0);
    //    controls.update();
  });
}
