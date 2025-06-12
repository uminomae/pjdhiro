// modules/julia-inverse/UIControlsModule.js

import { FORM_DEFAULTS, LEGEND_DEFAULT } from './d3-config.js';
import './ui/button-ui.js';
import { toggleLegend }                 from './ui/d3-legend-sub.js';
import { FormModule }                   from '../../core/FormModule.js';
import { resetModule }                  from './julia-main.js';

/**
 * UIControlsModule
 * - Offcanvas 内の Julia フォーム (RE/IM/N/ITER/Legend)
 * - 設定完了ボタン
 * - Navbar のリセットボタン
 * をすべて FormModule で管理
 */
export class UIControlsModule {
  /**
   * @param {Object} options
   * @param {Object} options.context 描画 context (scene, camera など)
   * @param {Function} options.onReset 設定変更後に描画をリセットするコールバック
   */
  constructor({ context, onReset }) {
    this.context = context;
    this.onReset = onReset;

    // Offcanvas フォーム周り
    this.formModule = new FormModule({
      rootSelector: '#offcanvasForm form',
      handlers: [
        {
          // submit → reset
          selector: '#offcanvasForm form',
          type:     'submit',
          handler:  e => {
            e.preventDefault();
            this.onReset();
          }
        },
        {
          // 数値フォームが変更されたら reset
          selector: '#input-re, #input-im, #input-n, #input-iter',
          type:     'change',
          handler:  () => this.onReset()
        },
        {
          // 凡例チェック変更 → toggleLegend + reset
          selector: '#chk-legend',
          type:     'change',
          handler:  () => {
            toggleLegend();
            this.onReset();
          }
        },
        {
          // 「設定完了」ボタン押下 → reset
          selector: '#config-complete-btn',
          type:     'click',
          handler:  () => this.onReset()
        }
      ]
    });

    // Navbar のリセットボタン
    this.navbarModule = new FormModule({
      rootSelector: '#navbar',
      handlers: [
        {
          selector: '#btn-reset',
          type:     'click',
          handler:  () => resetModule(this.context)
        }
      ]
    });
  }

  /** イベントバインド＆フォーム初期値セット */
  init() {
    // フォーム入力のデフォルト値を設定
    const setVal = (sel, v) => {
      const el = document.querySelector(sel);
      if (el instanceof HTMLInputElement) el.value = v;
    };
    setVal('#input-re',   FORM_DEFAULTS.re);
    setVal('#input-im',   FORM_DEFAULTS.im);
    setVal('#input-n',    FORM_DEFAULTS.N);
    setVal('#input-iter', FORM_DEFAULTS.maxIter);

    const chk = document.getElementById('chk-legend');
    if (chk instanceof HTMLInputElement) {
      chk.checked = LEGEND_DEFAULT.enabled;
    }

    // FormModule の初期化（イベントバインド）
    this.formModule.init();
    this.navbarModule.init();

    console.log('[UIControlsModule] init() 完了');
  }

  /** UI 状態をモデルに同期（必要なら追加実装） */
  sync() {
    // ここに「UI→model」 or 「model→UI」の同期処理を入れられます
  }

  /** イベントリスナ解除などのクリーンアップ */
  dispose() {
    this.formModule.dispose();
    this.navbarModule.dispose();
    console.log('[UIControlsModule] dispose() 完了');
  }
}
