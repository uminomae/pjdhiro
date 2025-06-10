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
    this.handlers.forEach(({ selector, type, handler }) => {
      // イベント委譲：root にまとめて登録
      const wrapped = e => {
        if (e.target.matches(selector) || e.target.closest(selector)) {
          handler(e);
        }
      };
      const off = this.dom.on(this.root, type, wrapped);
      // もし個別の要素に直付けしたいなら、querySelectorAll + each でもOK
      this.dom._registry.push(off);
    });
  }

  /** 破棄：全リスナを解除 */
  dispose() {
    this.dom.clear();
  }
}