import { DOMEventManager } from '../core/DOMEventManager.js';

/**
 * 汎用フォームモジュール
 *  - rootSelector: イベントを拾うコンテナのセレクタ
 *  - handlers: [
 *      { selector, type, handler },
 *      ...
 *    ]
 */
export class FormModule {
  /**
   * @param {{ rootSelector: string,
   *            handlers: Array<{selector:string, type:string, handler:Function}> }} options
   */
  constructor({ rootSelector, handlers }) {
    this.root = document.querySelector(rootSelector);
    if (!this.root) {
      throw new Error(`FormModule: root not found: ${rootSelector}`);
    }
    this.handlers = handlers;
    this.dom = new DOMEventManager();
  }

  /** 初期化：セレクタごとにイベント登録 */
  init() {
    // console.log(`[FormModule] start`);
    this.handlers.forEach(({ selector, type, handler }) => {
      // console.log(`[FormModule] bind ${type} on  ${selector}`);
      // イベント委譲：root にまとめて登録
      const wrapped = e => {
        if (e.target.matches(selector) || e.target.closest(selector)) {
          handler(e);
        }
      };
      this.dom.on(this.root, type, wrapped);
    });
  }

  /** 破棄：全リスナを解除 */
  dispose() {
    this.dom.clear();
  }
}