// modules/julia-inverse/julia-main.js

import { UIControlsModule }      from './d3UIControlsModule.js';
import { LoopController }        from './LoopController.js';
import { initJuliaApp, disposeJuliaApp } from './d3Init.js';
import { D3SceneModule }      from './D3SceneModule.js';
import { D3RendererModule }      from './D3RendererModule.js';

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
  if (_instance) {
    _instance.dispose();
    _instance = null;
  }
}

/** メインクラス：UI・シーン・ループを統括 */
class JuliaMainModule {
  constructor(context) {
    this.context      = context;
    this.sceneModule  = new D3SceneModule(context);
    this.loopCtrl     = new LoopController(context);
    this.rendererModule = new D3RendererModule(context);
    this.ui           = new UIControlsModule({
      rendererModule: this.rendererModule,
      loopCtrl:  this.loopCtrl,
      onReset:   () => this.reset(),
      onTopView: () => context.controls.resetToTopView()
    });
  }

  /** 初期描画 & ループ開始 */
  init() {
    this.sceneModule.init();
    this.ui.init();
    this.loopCtrl.start();
    console.log('[JuliaMainModule] init() 完了');
  }

  /** 停止→破棄→再初期化 */
  reset() {
    // ループ停止 & シーン破棄
    this.loopCtrl?.stop();
    this.sceneModule.dispose();
    this.ui.dispose();
    this.init();
  }

  /** 全破棄 */
  dispose() {
    this.loopCtrl?.stop();
    this.sceneModule.dispose();
    this.ui.dispose();
    console.log('[JuliaMainModule] dispose() 完了');
  }
}