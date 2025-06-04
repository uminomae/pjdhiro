// js/qt-st-main.js

/**
 * このファイル内にすべての処理をまとめ、
 * startMain() → getAlg() → initThree() → loadAlgModule() → startLoop()
 * の順でサブ関数を呼び出す構造にリファクタリングしました。
 */

 /**
  * メインエントリーポイント:
  *   1) URL クエリから alg を取得
  *   2) Three.js の共通初期化を行い、シーン周りのオブジェクトを取得
  *   3) alg に応じたモジュールを動的読み込みして初期化処理を呼び出し
  *   4) アニメーションループを開始
  */
 export async function startMain() {
  console.log('[main] startMain() が呼ばれました');

  try {
    // 1) URL クエリから alg を取得
    const alg = getAlgFromURL();
    console.log(`[main] alg="${alg}" を取得`);

    // 2) Three.js 共通初期化
    const { scene, camera, renderer, controls } = await initThree();
    console.log('[main] three.js の初期化完了');

    // 3) alg に応じたモジュールを動的読み込みして初期化
    await loadAlgModule(alg, { scene, camera, renderer, controls });
    console.log('[main] 選択モジュールの初期化完了');

    // 4) アニメーションループを開始
    startLoop({ scene, camera, renderer, controls });
    console.log('[main] アニメーションループを開始');
  } catch (err) {
    console.error('[main] startMain() 中にエラー発生:', err);
  }
}

/**
 * URL のクエリパラメータから "alg" を取得し、デフォルトを 'qt-st' にする
 */
function getAlgFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('alg') || 'qt-st';
}

/**
 * Three.js の共通初期化を行い、必要なオブジェクトをまとめて返す
 *   - qt-st-init.js を動的 import し、initCommon() を呼び出す
 *   - initCommon() 内で scene, camera, renderer, controls を構築する
 */
async function initThree() {
  try {
    const { initCommon } = await import('./qt-st-init.js');
    console.log('[main] initCommon をインポート完了');

    const commonResult = initCommon({
      canvasContainerId: 'canvas-container',
      legendCanvasId: 'legend-canvas',
    });
    return commonResult; // { scene, camera, renderer, controls }
  } catch (err) {
    throw new Error(`[main] initCommon モジュール読み込み失敗: ${err}`);
  }
}

/**
 * alg に応じてアルゴリズム別モジュールを動的に import し、
 * その initialize(context) を呼び出す
 *
 * @param {string} alg            URL で指定されたキー ('qt-st' or 'julia-inverse' など)
 * @param {object} context        { scene, camera, renderer, controls }
 */
async function loadAlgModule(alg, context) {
  // 動的に読み込むモジュールのパスを決定
  let modulePath;
  if (alg === 'qt-st') {
    modulePath = './modules/quant-stereo/qt-init.js';
  } else if (alg === 'julia-inverse') {
    modulePath = './modules/julia-inverse/julia-init.js';
  } else {
    console.warn(
      `[main] 未知の alg="${alg}" のため デフォルトのモジュール (quant-stereo) を使用します。`
    );
    modulePath = './modules/quant-stereo/qt-init.js';
  }
  console.log(`[main] 動的インポート対象: ${modulePath}`);

  try {
    const mod = await import(modulePath);
    console.log(`[main] ${modulePath} インポート完了`);

    if (typeof mod.initialize !== 'function') {
      throw new Error(`${modulePath} に initialize() が定義されていません`);
    }
    mod.initialize(context);
  } catch (err) {
    throw new Error(`[main] ${modulePath} 読み込み失敗: ${err}`);
  }
}

/**
 * requestAnimationFrame を使ってアニメーションループを開始する
 * 
 * @param {object} context  { scene, camera, renderer, controls }
 */
function startLoop({ scene, camera, renderer, controls }) {
  (function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();
}
