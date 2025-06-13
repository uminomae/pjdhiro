// modules/julia-inverse/ui/UIControlsModule.js

import { FormModule }                from '../../core/FormModule.js';
import { getFormHandlers }           from './handlers/formHandlers.js';
import { getNavbarHandlers }         from './handlers/navbarHandlers.js';
import { getCanvasHandlers }         from './handlers/canvasHandlers.js';
import { syncFormDefaults }          from './formSync.js';
// import { syncNavbarButtons }      from './syncers/navbarSync.js';   // 任意
// import { syncCanvasView }         from './syncers/canvasSync.js';   // 任意

export class UIControlsModule {
  /**
   * @param {Object} options
   * @param {Function} options.onReset
   * @param {Function} options.onTopView
   */
  constructor({ onReset, onTopView }) {
    // Offcanvas フォーム
    this.formModule = new FormModule({
      rootSelector: '#offcanvasForm form',
      handlers:     getFormHandlers(onReset)
    });

    // Navbar
    this.navbarModule = new FormModule({
      rootSelector: 'nav.navbar',
      handlers:     getNavbarHandlers()
    });

    // Canvas 上の 2D view
    this.canvasModule = new FormModule({
      rootSelector: '#canvas-container',
      handlers:     getCanvasHandlers(onTopView)
    });
  }

  /** イベント登録＋UI同期 */
  init() {
    this.formModule.init();
    this.navbarModule.init();
    this.canvasModule.init();
    // sync
    // syncFormDefaults();
    this.sync();
    // syncNavbarButtons();
    // syncCanvasView();
    console.log('[UIControlsModule] init() 完了');
  }

  /** 必要に応じた UI⇄モデル同期処理をまとめる */
  sync() {
    syncFormDefaults();
    // syncNavbarButtons();
    // syncCanvasView();
  }

  /** リスナ解除 */
  dispose() {
    this.formModule.dispose();
    this.navbarModule.dispose();
    this.canvasModule.dispose();
    console.log('[UIControlsModule] dispose() 完了');
  }
}
