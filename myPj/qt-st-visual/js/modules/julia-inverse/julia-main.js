// modules/julia-inverse/julia-main.js

import { UIControlsModule }      from './d3UIControlsModule.js';
import { LoopController }        from './LoopController.js';
import { D3SceneModule }      from './D3SceneModule.js';
import { D3RendererModule }      from './D3RendererModule.js';
import * as Config            from './d3-config.js';

let _instance = null;

export function startModule(context) {
  if (!_instance) {
    _instance = new JuliaMainModule(context);
  }
}

export function resetModule() {
  if (_instance) _instance._reset();
}

export function disposeModule() {
  if (_instance) {
    _instance._dispose();
    _instance = null;
  }
}

/** メインクラス：UI・シーン・ループを統括 */
class JuliaMainModule {
  constructor(context) {
    this.context      = context;
    this._init();
  }

  /** 初期描画 & ループ開始 */
  _init() {
    this.sceneModule  = new D3SceneModule(this.context);
    this.rendererModule = new D3RendererModule(this.context);
    this.loopCtrl     = new LoopController(this.context);
    this.ui           = new UIControlsModule({
      rendererModule: this.rendererModule,
      loopCtrl:  this.loopCtrl,
      onReset:   () => this._reset(),
      onTopView: () => this.context.controls.resetToTopView()
    });

    this.sceneModule.init();
    this.ui.init();
    this.loopCtrl.init();
    // this.rendererModule.init();  
    this.rendererModule.startLoop();  
    console.log('[JuliaMainModule] _init() 完了');
  }

  /** 停止→破棄→再初期化 */
  _reset() {
    console.log('[DEBUG] _reset 開始');
    this._dispose();
    this._init();
    this.ui.sync(); 
    console.log('[DEBUG] _reset 完了');
  }

  /** 全破棄 */
  _dispose() {
    [this.loopCtrl, this.rendererModule, this.sceneModule, this.ui].forEach(m => {
      if (m && typeof m.dispose === 'function') m.dispose();
    });
  }
}