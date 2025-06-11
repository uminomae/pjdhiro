// js/modules/julia/julia-main.js

// 既存のD3関連コードをクラス化せずに呼び出すためのインポート
// import { initThree, animateLoop } from './d3-renderer.js';
// import { FORM_DEFAULTS, LEGEND_DEFAULT } from './d3-config.js';
// import './ui/button-ui.js';                   // ボタン系のイベント登録
import { initLegendToggle } from './ui/legend-ui.js';
// import { initFormValues, init3DSceneAndLoop, initLegend } from './d3-init-app.js';
// import { FormModule } from '../../core/FormModule.js';

import { initJuliaApp, resetJuliaApp, disposeJuliaApp } from './d3Init.js';

/**
 * JuliaMainModule: アプリのライフサイクルを管理するメインクラス
 */
export class JuliaMainModule {
  /**
   * @param {Object} context - アプリケーションコンテキスト
   */
  constructor(context) {
    this.context    = context;
    // D3InitApp をラップ
    this.appController = {
      init:    () => initJuliaApp(this._onReset.bind(this)),
      reset:   () => resetJuliaApp(),
      dispose: () => disposeJuliaApp()
    };
  }

  /** 初期化: フォーム・シーン・ループ・凡例バインド */
  init() {
    this.appController.init();
    console.log('[julia-main] init() 完了');
  }

  /** 同期処理: 必要に応じて実装 */
  sync() {
    // D3 には特別な sync 処理なし
  }

  /** 破棄: イベント・シーン・凡例をクリア */
  dispose() {
    this.appController.dispose();
    console.log('[julia-main] dispose() 完了');
  }

  /** リセット: dispose → init */
  reset() {
    console.log('[julia-main] reset() 開始');
    this.dispose();
    this.init();
    console.log('[julia-main] reset() 完了');
  }

  /** フォームや入力変更時のコールバック */
  _onReset() {
    console.log('[julia-main] onReset callback');
    this.reset();
  }
}

let _instance = null;

/** モジュール開始エントリーポイント */
export function startModule(context) {
  if (!_instance) {
    _instance = new JuliaMainModule(context);
    console.log('[julia-main] new JuliaMainModule() 完了');
  }
  _instance.init();
}

/** リセット用エクスポート */
export function resetModule(context) {
  if (_instance) {
    _instance.reset();
  }
}

/** 破棄用エクスポート */
export function disposeModule() {
  if (_instance) {
    _instance.dispose();
    _instance = null;
  }
}
