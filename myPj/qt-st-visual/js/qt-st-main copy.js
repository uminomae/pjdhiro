// js/qt-st-main.js

/**
 * ここでは「initialize three.js & 動的モジュール呼び出し」→
 * 「アニメーションループ開始」までを一気に行う関数をエクスポートします。
 */
export function startMain() {
  console.log('[main] startMain() が呼ばれました');

  // 1) URLクエリから alg を取得
  const params = new URLSearchParams(window.location.search);
  const alg    = params.get('alg') || 'qt-st';
  console.log(`[main] alg="${alg}" を取得`);

  // 2) 共通初期化モジュールを import
  import('./qt-st-init.js')
    .then(({ initCommon }) => {
      console.log('[main] initCommon をインポート完了');
      const { scene, camera, renderer, controls } = initCommon({
        canvasContainerId: 'canvas-container',
        legendCanvasId: 'legend-canvas'
      });
      console.log('[main] three.js の初期化完了');

      // 3) alg に応じたモジュールパスを決定
      let modulePath;
      if (alg === 'qt-st') {
        modulePath = './modules/quant-stereo/qt-init.js';
      } else if (alg === 'julia-inverse') {
        modulePath = './modules/julia-inverse/julia-init.js';
      } else {
        console.warn(`[main] 未知 alg="${alg}" のため/modules/quant-stereo/qt-init.js をデフォルトで使用`);
        modulePath = './modules/quant-stereo/qt-init.js';
      }
      console.log(`[main] 動的インポート対象: ${modulePath}`);

      // 4) 選ばれたモジュールを動的 import し、initialize() を呼び出す
      return import(modulePath)
        .then((mod) => {
          if (typeof mod.initialize !== 'function') {
            throw new Error(`${modulePath} に initialize() が定義されていません`);
          }
          console.log(`[main] ${modulePath} インポート完了`);
          mod.initialize({ scene, camera, renderer, controls });
          console.log('[main] initialize() を実行完了');
        })
        .catch((err) => {
          console.error(`[main] モジュール (${modulePath}) 読み込み失敗:`, err);
        })
        .finally(() => {
          // 5) アニメーションループを開始
          console.log('[main] アニメーションループを開始');
          (function animate() {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
          })();
        });
    })
    .catch((err) => {
      console.error('[main] initCommon モジュール読み込み失敗:', err);
    });
}
