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

export function resetModule() {
  if (_instance) _instance.reset();
}

export function disposeModule() {
  if (_instance) { _instance.dispose(); _instance = null; }
}

class JuliaMainModule {
  constructor(context) {
    this.context = context;
    this.ui      = new UIControlsModule({
      onReset:   () => this.reset(),
      onTopView: () => context.controls.resetToTopView()
    });
  }

  init() {
    this.ui.init();
    initJuliaApp(() => this.reset());
    console.log('[JuliaMainModule] init() 完了');
  }

  reset() {
    // ループ停止・破棄
    context.stopLoop?.();
    disposeJuliaApp();
    this.ui.dispose();
    // 再初期化
    this.init();
  }

  dispose() {
    context.stopLoop?.();
    disposeJuliaApp();
    this.ui.dispose();
  }
}
