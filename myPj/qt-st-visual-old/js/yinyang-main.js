// js/yinyang-main.js

import { getAlgFromURL, loadAlgModule } from './yinyang-main/load-module.js';
import { startLoop }     from './yinyang-main/animate-loop.js';
import { THREE_INIT } from './yinyang-config.js';
import { initThreejs } from './yinyang-main/threejs-init.js';
/**
 * アプリケーションのスタートアップを担う
 *   1) URL クエリから alg を取得
 *   2) Three.js 環境を初期化
 *   3) albLoader を呼んで該当アルゴリズムを初期化
 *   4) アニメーションループをスタート
 */
export async function startMain() {
  console.log('[qt-st-main] startMain() が呼ばれました');

  try {
    // 1) URL クエリから alg
    const alg = getAlgFromURL();
    console.log(`[qt-st-main] alg = "${alg}" を取得`);

    // 2) Three.js の共通初期化
    const context = initThreejs({
      canvasContainerId: THREE_INIT.CANVAS_CONTAINER_ID,
      legendCanvasId: THREE_INIT.LEGEND_CANVAS_ID,
    });
    console.log('[qt-st-main] Three.js 共通初期化 完了');

    // 3) alg に応じたモジュールを動的読み込みして initialize() を呼ぶ
    await loadAlgModule(alg, context);
    console.log('[qt-st-main] 選択モジュール の初期化完了');

    // 4) アニメーションループ開始
    startLoop(context);
    console.log('[qt-st-main] アニメーションループ を開始');

  } catch (err) {
    console.error('[qt-st-main] startMain() 中にエラー発生:', err);
  }
}