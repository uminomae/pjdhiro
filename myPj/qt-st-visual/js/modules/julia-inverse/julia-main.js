// js/modules/julia/julia-main.js

// 既存のD3関連コードをクラス化せずに呼び出すためのインポート
// import { initThree, animateLoop } from './d3-renderer.js';
// import { FORM_DEFAULTS, LEGEND_DEFAULT } from './d3-config.js';
// import './ui/button-ui.js';                   // ボタン系のイベント登録
import { initLegendToggle } from './ui/legend-ui.js';
import { initFormValues, init3DSceneAndLoop, initLegend } from './d3-init-app.js';

/**
 * JuliaMainModule クラス
 *  - init(): 初期化フローをメソッド単位で呼び出し
 *  - reset(): シーンをクリアして init() を再実行
 *  - dispose(): シーン／ループ／凡例を破棄
 */
class JuliaMainModule {
  constructor(context) {
    this.context = context;
    this._hasInitialized = false;
  }

  /**
   * モジュール初期化のエントリーポイント
   */
  init() {
    if (this._hasInitialized) return;
    this._setupForm();
    this._setupScene();
    this._setupLegend();
    this._setupControls();
    this._hasInitialized = true;
    console.log('[julia-main] init() 完了');
  }

  /** シーンの完全リセットと再初期化 */
  reset() {
    console.log('[julia-main] reset() 開始');
    this.dispose();
    this._hasInitialized = false;
    this.init();
    console.log('[julia-main] reset() 完了');
  }

  /** シーン／ループ／凡例を破棄 */
  dispose() {
    this._clearScene();
    this._clearRenderer();
    this._hideLegend();
    console.log('[julia-main] dispose() 完了');
  }

  // --- private methods ---

  /** フォームの初期化と submit イベントのバインド */
  _setupForm() {
    initFormValues();
    const form = document.getElementById('julia-form');
    if (form instanceof HTMLFormElement) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        this.reset();
      });
    }
  }

  /** Three.js シーンの初期化とレンダーループ開始 */
  _setupScene() {
    init3DSceneAndLoop();
  }

  /** 凡例の描画 */
  _setupLegend() {
    initLegend();
  }

  /** Offcanvas 凡例トグルの初期化 */
  _setupControls() {
    initLegendToggle();
  }

  /** シーン中のオブジェクトを全削除 */
  _clearScene() {
    if (window.scene) {
      while (window.scene.children.length) {
        window.scene.remove(window.scene.children[0]);
      }
    }
  }

  /** レンダラーをクリア */
  _clearRenderer() {
    if (window.renderer) window.renderer.clear();
  }

  /** 凡例を非表示にする */
  _hideLegend() {
    import('../../3d/ui/d3-legend-sub.js')
      .then(({ hideLegend }) => hideLegend())
      .catch(err => console.warn('hideLegend エラー', err));
  }
}

let juliaMainModule = null;

/** アプリ側から呼び出す開始用 */
export function startModule(context) {
  if (!juliaMainModule) {
    juliaMainModule = new JuliaMainModule(context);
    console.log('[julia-main] new JuliaMainModule() 完了');
  }
  juliaMainModule.init();
}

/** リセット用（フォーム submit や外部呼び出し） */
export function resetModule(context) {
  if (juliaMainModule) {
    juliaMainModule.reset();
  } else {
    startModule(context);
  }
}

/** アンロードや切り替え時の破棄用 */
export function disposeModule() {
  if (juliaMainModule) {
    juliaMainModule.dispose();
    juliaMainModule = null;
  }
}
