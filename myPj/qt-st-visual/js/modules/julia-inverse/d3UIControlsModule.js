// modules/julia-inverse/d3UIControlsModule.js
import { FormModule }      from '../../core/FormModule.js';
import * as Config         from './d3-config.js';
import { resetModule }     from './julia-main.js';
import { getFormHandlers } from './handlers/formHandlers.js';
import { getCanvasHandlers } from './handlers/canvasHandlers.js';
import { getRunHandlers }  from './handlers/getRunHandlers.js';

/**
 * UI 初期化・イベント登録モジュール
 */
export class UIControlsModule {
  /**
   * @param {object} options
   * @param {RendererModule} options.rendererModule
   * @param {LoopController} options.loopCtrl
   * @param {Function}       options.onReset
   * @param {Function}       options.onTopView
   */
  constructor({ scene, camera, renderer, controls, animController, onTopView, context, sceneModule, loopCtrl }) {
    this.scene         = scene;
    this.camera        = camera;
    this.renderer      = renderer;
    this.controls      = controls;
    this.animController= animController;
    this.onTopView     = onTopView;
    this.context      = context;
    this.sceneModule  = sceneModule;
    this.loopCtrl   = loopCtrl;

    // Offcanvas／Navbar 用の FormModule
    this.offcanvasModule = new FormModule({
      rootSelector: '#offcanvasForm form',
      handlers:     getFormHandlers(() => 
        {
          this.loopCtrl.cancel();
          // stop() で RAF をキャンセルし内部状態を初期化
          this.loopCtrl.stop();
          this.sceneModule.dispose();
          this.sceneModule.init();
        })
    });
    this.navbarModule = new FormModule({
      rootSelector: '#navbar',
      // handlers:     getRunHandlers(this.animController)
      handlers:     getRunHandlers(this.animController, () => resetModule(this.context))
    });
    this.canvasModule = new FormModule({
      rootSelector: '#canvas-container',
      handlers:     getCanvasHandlers(() => {
        if (typeof this.onTopView === 'function') {
          this.onTopView();
        }
      })
    });

  }
  /** 各 FormModule の init() を呼び出してバインド */
  init() {
    this.offcanvasModule.init();
    this.navbarModule.init();
    this.canvasModule.init();
    this._initFormDefaults();

    this.sync();

    // this._hasStarted = true;

    console.log('[UIControlsModule] init() 完了');
  }

  sync(){
    // this._parseFormDefaults();
  }

  _initFormDefaults() {
    const mapping = [
      { id: 'input-re',   value: Config.FORM_DEFAULTS.re },
      { id: 'input-im',   value: Config.FORM_DEFAULTS.im },
      { id: 'input-n',    value: Config.FORM_DEFAULTS.N },
      { id: 'input-iter', value: Config.FORM_DEFAULTS.maxIter },
    ];
    mapping.forEach(({ id, value }) => {
      const el = document.getElementById(id);
      if (el instanceof HTMLInputElement) el.value = String(value);
    });
  }

  _parseFormDefaults() {
    const getNumber = (id, parse) => {
      const el = document.getElementById(id);
      if (!(el instanceof HTMLInputElement)) return null;
      const v = parse(el.value);
      return isNaN(v) ? null : v;
    };
    const re   = getNumber('input-re',   parseFloat);
    const im   = getNumber('input-im',   parseFloat);
    const n    = getNumber('input-n',    v => parseInt(v, 10));
    const iter = getNumber('input-iter', v => parseInt(v, 10));

    if (re   !== null) Config.FORM_DEFAULTS.re      = re;
    if (im   !== null) Config.FORM_DEFAULTS.im      = im;
    if (n    !== null) Config.FORM_DEFAULTS.N       = n;
    if (iter !== null) Config.FORM_DEFAULTS.maxIter = iter;
  }

  /** 各 FormModule の dispose() を呼び出してアンバインド */
  dispose() {
    this.offcanvasModule.dispose();
    this.navbarModule.dispose();
    this.canvasModule.dispose();
    console.log('[UIControlsModule] dispose() 完了');
  }
}