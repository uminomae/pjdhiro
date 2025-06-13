// modules/julia-inverse/ui/UIControlsModule.js

import { FormModule }                from '../../core/FormModule.js';
import { getFormHandlers }           from './handlers/formHandlers.js';
import { getRunHandlers }         from './handlers/getRunHandlers.js';
import { getCanvasHandlers }         from './handlers/canvasHandlers.js';
import { syncFormDefaults }          from './formSync.js';

import { syncLoopButtons }    from './loopSync.js';


/**
 * 各 UI セクションとハンドラの設定をまとめたオブジェクト
 */
const MODULE_CONFIGS = ({ rendererModule, onReset, onTopView, loopCtrl }) => [
  {
    // Offcanvas フォーム全般
    rootSelector: '#offcanvasForm form',
    handlers:     getFormHandlers(onReset)
  },
  {
    // Navbar の Run/Pause/Stop
    rootSelector: 'nav.navbar',
    handlers:     getRunHandlers(rendererModule, loopCtrl)
  },
  {
    // Canvas-container の 2D view ボタン
    rootSelector: '#canvas-container',
    handlers:     getCanvasHandlers(onTopView)
  }
];

/**
 * 全 UI を統括するモジュール
 */
export class UIControlsModule {
  /**
   * @param {Object} options
   * @param {Function} options.onReset
   * @param {Function} options.onTopView
   * @param {LoopController} options.loopCtrl
   */
  constructor({ rendererModule, onReset, onTopView, loopCtrl }) {
    this.loopCtrl = loopCtrl;
    this.rendererModule = rendererModule;

    // 設定オブジェクトに基づき FormModule をまとめて生成
    this._modules = MODULE_CONFIGS({ rendererModule, onReset, onTopView, loopCtrl })
      .map(cfg => new FormModule({
        rootSelector: cfg.rootSelector,
        handlers:     cfg.handlers
      }));
    }

  init() {
    this._modules.forEach(m => m.init());
    // sync 一発目
    syncFormDefaults();
    syncLoopButtons(this.loopCtrl);

    console.log('[UIControlsModule] init() 完了');
  }

  /** UI⇄Model 同期。ループボタン状態も更新 */
  sync() {
    syncFormDefaults();
    syncLoopButtons(this.loopCtrl);
  }

  dispose() {
    this.formModule.dispose();
    this.loopModule.dispose();
    this.canvasModule.dispose();
    console.log('[UIControlsModule] dispose() 完了');
  }
}