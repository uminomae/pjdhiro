// js/modules/quantStereo/qt-main.js

import { addHelpersAndLights, createAndAddPointCloud, initUI, startLoop }
  from './qt-init/qt-st-init.js';

/**
 * initialize()
 *  ────────────────────────────────────────────────────────────
 *  quantStereo モジュール全体を起動する関数。以下を順に実行する：
 *    1) 照明・軸ヘルパーを追加
 *    2) UI（スライダー・ボタン・変数表示）を初期化
 *    3) 初期の四元数点群を作成 (index=0)
 *    4) アニメーションループ開始
 *
 *  @param {{
 *    scene:    THREE.Scene,
 *    camera:   THREE.PerspectiveCamera,
 *    renderer: THREE.WebGLRenderer,
 *    controls: OrbitControls
 *  }} context
 */
export function initialize(context) {
  console.log('[qt-main] initialize() START');

  // 1) 照明と軸ヘルパーを追加
  addHelpersAndLights(context.scene);
  console.log('[qt-main] addHelpersAndLights() 完了');

  // 2) UI 初期化
  initUI(context);
  console.log('[qt-main] initUI() 完了');

  // 3) 初期点群 (index=0) を作成してシーンに追加
  createAndAddPointCloud(context.scene, 0);
  console.log('[qt-main] createAndAddPointCloud() 完了');

  // 4) アニメーションループを開始
  startLoop(context);
  console.log('[qt-main] startLoop() 完了');

  console.log('[qt-main] initialize() COMPLETE');
}
