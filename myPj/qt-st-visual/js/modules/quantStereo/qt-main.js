// js/modules/quantStereo/qt-main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { addHelpersAndLights } from './qt-init-helpers.js';
import { initUI }              from './qt-init.js';
import { setupNavbarControls } from './qt-navbar.js';
// CAMERA_* 定数をインポート
import {
  CAMERA_INITIAL_POSITION,
  CAMERA_AUTO_ROTATE_ENABLED,
  CAMERA_AUTO_ROTATE_PERIOD
} from './qt-config.js';

// 自動起動を使う場合に必要
// ★ もしページ読み込み時にアニメを自動で開始したい場合は、以下をアンコメントしてください。
import { startAnimation } from './qt-animation.js';

/**
 * startModule({ scene, camera, renderer, controls })
 *   ・このモジュール（quantStereo）の唯一のエントリーポイントです。
 *   ・シーン初期化 (背景色・照明＋ヘルパー)／UI 初期化／
 *     ナビバーボタン (Run/Pause/Reset) のセットアップを行うだけ。
 *   ・アニメーションの開始・一時停止・再開・リセット（初期化）は、
 *     qt-animation.js / qt-navbar.js に委譲します。
 *
 * @param {Object}       context
 * @param {THREE.Scene}    context.scene
 * @param {THREE.Camera}   context.camera
 * @param {THREE.Renderer} context.renderer
 * @param {OrbitControls}  context.controls
 */
export function startModule({ scene, camera, renderer, controls }) {
  console.log('[qt-st-main] startModule() が呼ばれました');

  // (1) カメラの初期位置を config から設定
  // ---------------------------------------------------
  camera.position.set(
    CAMERA_INITIAL_POSITION[0],
    CAMERA_INITIAL_POSITION[1],
    CAMERA_INITIAL_POSITION[2]
  );
  camera.lookAt(0, 0, 0);
  // OrbitControls も必ず更新しておく
  controls.update();

  // (2) OrbitControls の自動回転設定
  // ---------------------------------------------------
  //  autoRotateEnabled が true の場合、controls.autoRotate = true。
  //  autoRotateSpeed は「360°/CAMERA_AUTO_ROTATE_PERIOD (秒)」→ OrbitControls の単位は「deg/sec」。
  //  NOTE: OrbitControls.autoRotateSpeed のデフォルトは 2.0 (deg/sec)。
  if (CAMERA_AUTO_ROTATE_ENABLED) {
    controls.autoRotate = true;
    // 360度 / T 秒 = deg/sec　なので
    controls.autoRotateSpeed = 360 / CAMERA_AUTO_ROTATE_PERIOD;
  } else {
    controls.autoRotate = false;
  }

  // (1) シーンの背景色を暗色に設定
  scene.background = new THREE.Color(0x000011);

  // (2) 照明 + 軸ヘルパー を追加
  addHelpersAndLights(scene);

  // (3) UI 初期化 (Top View ボタンや α,β,γ,δ の表示など)
  initUI({ scene, camera, renderer, controls });

  // (4) ナビバー (Run / Pause / Reset) のイベントリスナを登録
  setupNavbarControls({ scene, camera, renderer, controls });

  // (5) アニメーションは自動開始しない設計です。
  //     ユーザーが Run ボタンを押したときに初めて動き始めます。

  // ────────────────────────────────────────────────────
  // ★ ページロード時に自動でアニメーションを開始したい場合はこちらをアンコメントして有効化：
  // ────────────────────────────────────────────────────
  //
  //  以下の行の先頭の "//" を削除して有効化：
      startAnimation(scene, camera, controls);
      // startAnimation(scene);
  //  Run ボタンを「押された」状態に見せる：Run を隠し、Pause を表示
      const btnRun   = document.getElementById('btn-run');
      const btnPause = document.getElementById('btn-pause');
      if (btnRun && btnPause) {
        btnRun.classList.add('d-none');
        btnPause.classList.remove('d-none');
      }
  //
  // これにより、ロード直後に θ=0 の状態から自動でアニメーションが開始されます。
  // ────────────────────────────────────────────────────

  // (6) 必要に応じて、ロード時点の静的表示を「最初の地球グリッド＋投影球」にしたい場合は、
  //     Reset と同じロジックで初期描画を行ってもよいです。たとえば↓を有効化:
  //
  // // import { create, normalize } from './qt-quat-utils.js';
  // // import { overlayEarthGridAndProjection } from './qt-pointcloud.js';
  // // import { RES_THETA, RES_PHI } from './qt-config.js';
  // // const qIdentity = normalize(create(1, 0, 0, 0));
  // // overlayEarthGridAndProjection(scene, qIdentity, RES_THETA, RES_PHI);

  console.log('[qt-st-main] startModule() の初期化が完了しました');
}
