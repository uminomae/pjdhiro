// js/modules/julia/julia-main.js

import { initLegendToggle } from './ui/legend-ui.js';
import { initJuliaApp, resetJuliaApp, disposeJuliaApp } from './d3Init.js';
import { UIControlsModule } from './d3UIControlsModule.js';

let _instance = null;

export function startModule(context) {
  if (!_instance) {
    _instance = new JuliaMainModule(context);
  }
  _instance.init();
}

export function resetModule(context) {
  if (_instance) {
    _instance.reset();
  }
}

export function disposeModule() {
  if (_instance) {
    _instance.dispose();
    _instance = null;
  }
}

// メインクラス: UI と描画ライフサイクルを統括
export class JuliaMainModule {
  /**
   * @param {{ scene, camera, renderer, controls }} context
   */
  constructor(context) {
    this.context = context;

    // UI 操作を一括管理
    this.uiModule = new UIControlsModule({
      context: this.context,
      onReset: this.reset.bind(this)
    });

  }

  init() {
    this.uiModule.init();
    initJuliaApp(this.reset.bind(this));  // 描画モジュール初期化
  }

  reset() {
    disposeJuliaApp();    // render/dispose
    this.uiModule.dispose();
    this.init();
  }

  dispose() {
    disposeJuliaApp();
    this.uiModule.dispose();
  }
}

