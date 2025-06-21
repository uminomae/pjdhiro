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
  constructor({ scene, camera, renderer, controls, animController }) {
    this.scene         = scene;
    this.camera        = camera;
    this.renderer      = renderer;
    this.controls      = controls;
    this.animController= animController;

    // Offcanvas／Navbar 用の FormModule
    this.offcanvasModule = new FormModule({
      rootSelector: '#offcanvasForm form',
      handlers:     getFormHandlers(() => resetModule(this.scene))
    });
    this.navbarModule = new FormModule({
      rootSelector: '#navbar',
      handlers:     getRunHandlers(this.animController)
    });
    // this.canvasModule = new FormModule({
    //   rootSelector: '#canvas-container',
    //   handlers:     getCanvasHandlers(() => {
    //     this.controls.resetToTopView();
    //   })
    // });

  }
  /** 各 FormModule の init() を呼び出してバインド */
  init() {
    this.offcanvasModule.init();
    this.navbarModule.init();
    // this.canvasModule.init();
    this._initFormDefaults();

    // 各種デフォルト状態を DOM に反映
    this.sync();
    // this._hasStarted = true;
    
    console.log('[UIControlsModule] init() 完了');
  }

  sync(){
    const legendToggle = document.getElementById('chk-legend');
    const legendDefault =
      typeof Config.LEGEND_DEFAULT?.enabled === 'boolean'
        ? Config.LEGEND_DEFAULT.enabled
        : true;
    if (legendToggle instanceof HTMLInputElement) {
      legendToggle.checked = legendDefault;
    }

    const groundToggle = document.getElementById('toggle-ground-visibility');
    if (groundToggle instanceof HTMLInputElement) {
      groundToggle.checked = Config.GROUND_TEXTURE_VISIBLE;
    }

    this._resetNavbarState();
  }

  _resetNavbarState() {
    const btnRun    = document.getElementById('btn-run');
    const btnPause  = document.getElementById('btn-pause');
    const btnResume = document.getElementById('btn-resume');
    if (btnRun) btnRun.classList.remove('d-none');
    if (btnPause) {
      btnPause.classList.add('d-none');
      btnPause.textContent = 'Pause';
    }
    if (btnResume) btnResume.classList.add('d-none');
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

  /** 各 FormModule の dispose() を呼び出してアンバインド */
  dispose() {
    this.offcanvasModule.dispose();
    this.navbarModule.dispose();
    // this.canvasModule.dispose();
    console.log('[UIControlsModule] dispose() 完了');
  }
}