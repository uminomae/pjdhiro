// modules/julia-inverse/d3JuliaFormController.js

// import { initThree, animateLoop } from './d3-renderer.js';
import { FORM_DEFAULTS, LEGEND_DEFAULT } from './d3-config.js';
import './ui/button-ui.js';
// import { initLegendToggle } from './ui/legend-ui.js';
import { FormModule } from '../../core/FormModule.js';

/**
 * フォーム関連の初期化とイベント管理を担うコントローラクラス
 */
export class JuliaFormController {
  /**
   * @param {Function} onReset リセット時に呼び出すコールバック
   */
  constructor(onReset) {
    this.onReset = onReset;
    this._module = new FormModule({
      rootSelector: '#offcanvasForm form',
      handlers: [
        {
          selector: '#offcanvasForm form',
          type: 'submit',
          handler: this._handleSubmit.bind(this)
        },
        {
          selector: '#input-re, #input-im, #input-n, #input-iter, #chk-legend',
          type: 'change',
          handler: this._handleChange.bind(this)
        }
      ]
    });
  }

  /** 初期値セットとイベントバインド */
  init() {
    // フォーム入力のデフォルト値をセット
    document.querySelector('#input-re').value   = FORM_DEFAULTS.re;
    document.querySelector('#input-im').value   = FORM_DEFAULTS.im;
    document.querySelector('#input-n').value    = FORM_DEFAULTS.N;
    document.querySelector('#input-iter').value = FORM_DEFAULTS.maxIter;
    document.querySelector('#chk-legend').checked = LEGEND_DEFAULT.enabled;
    // FormModule を初期化してイベントバインド
    this._module.init();
  }

  /** 登録した submit ハンドラ */
  _handleSubmit(event) {
    event.preventDefault();
    this.onReset();
  }

  /** 登録した change ハンドラ */
  _handleChange() {
    this.onReset();
  }

  /** イベントリスナの解除 */
  dispose() {
    this._module.dispose();
  }
}
