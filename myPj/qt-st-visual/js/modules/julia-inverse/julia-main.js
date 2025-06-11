// js/modules/julia/julia-main.js

// 既存のD3関連コードをクラス化せずに呼び出すためのインポート
// import { initThree, animateLoop } from './d3-renderer.js';
// import { FORM_DEFAULTS, LEGEND_DEFAULT } from './d3-config.js';
// import './ui/button-ui.js';                   // ボタン系のイベント登録
// import { initLegendToggle } from './ui/legend-ui.js';
// import { initThree as init3DScene, animateLoop as start3DLoop } from './d3-init-app.js';

/**
 * JuliaMainModule クラス
 *  - init(): 初期描画・ループ開始・凡例初期化
 *  - reset(): シーンをクリアして再初期化
 *  - dispose(): シーンの全オブジェクトをクリア
 */
class JuliaMainModule {
  init() {
    // フォーム初期値のセット（d3-init-app.js からの流用）
    // initFormValues();
    // Three.js シーンとループ起動
    // init3DScene();
    // start3DLoop();
    // 初期凡例描画・切り替えバインド
    // initLegend();
    // initLegendToggle();
  }

  reset() {
    // ポイント群だけを削除して再init
    if (window.scene) {
      window.scene.traverse(obj => {
        if (obj.isPoints) window.scene.remove(obj);
      });
    }
    if (window.renderer) window.renderer.clear();
    this.init();
  }

  dispose() {
    // シーン中の全オブジェクトを破棄
    if (window.scene) {
      while (window.scene.children.length) {
        window.scene.remove(window.scene.children[0]);
      }
    }
  }
}

let juliaMainModule = null;

/**
 * エントリーポイント
 */
export function startModule(context) {
  if (!juliaMainModule) {
    juliaMainModule = new JuliaMainModule();
    console.log('[julia-main] new JuliaMainModule() 完了');
    juliaMainModule.init();
  }
}

/**
 * リセット用エクスポート
 */
export function resetModule(context) {
  if (juliaMainModule) {
    juliaMainModule.reset();
  } else {
    startModule(context);
  }
}

/**
 * 破棄用エクスポート
 */
export function disposeModule() {
  if (juliaMainModule) {
    juliaMainModule.dispose();
    juliaMainModule = null;
  }
}
