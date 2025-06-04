// js/modules/quantStereo/qt-main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { addHelpersAndLights } from './qt-init-helpers.js';
import { initUI }              from './qt-init.js';
import { setupNavbarControls } from './qt-navbar.js';

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

  // (1) シーンの背景色を暗色に設定
  scene.background = new THREE.Color(0x000011);

  // (2) 照明 + 軸ヘルパー を追加
  addHelpersAndLights(scene);

  // (3) UI 初期化 (Top View ボタンや α,β,γ,δ の表示など)
  initUI({ scene, camera, renderer, controls });

  // (4) ナビバー (Run / Pause / Reset) のイベントリスナを登録
  setupNavbarControls({ scene, camera, renderer, controls });

  // (5) アニメーションは自動開始しない
  //     ユーザーが Run ボタンを押したときに初めて動き始める設計です。

  // (6) 必要に応じて、ロード時点の静的表示を「最初の地球グリッド＋投影球」にしたい場合は、
  //     Reset と同じロジックで初期描画を行ってもよいです。たとえば↓を有効化:
  //
  // import { create, normalize } from './qt-quat-utils.js';
  // import { overlayEarthGridAndProjection } from './qt-pointcloud.js';
  // import { RES_THETA, RES_PHI } from './qt-config.js';
  // const qIdentity = normalize(create(1, 0, 0, 0));
  // overlayEarthGridAndProjection(scene, qIdentity, RES_THETA, RES_PHI);

  console.log('[qt-st-main] startModule() の初期化が完了しました');
}
