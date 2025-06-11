// core/DOMEventManager.js
export class DOMEventManager {
	constructor() {
	  /** @type {Array<{element: EventTarget, type: string, handler: Function, options?: boolean|AddEventListenerOptions}>} */
	  this._registry = [];
	}
  
	/**
	 * addEventListener を登録・記録
	 * @param {EventTarget} element
	 * @param {string} type
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean|AddEventListenerOptions} [options]
	 */
	on(element, type, handler, options) {
	  element.addEventListener(type, handler, options);
	  this._registry.push({ element, type, handler, options });
	  // 解除用関数を返す
	  return () => this.off(element, type, handler, options);
	}
  
	/**
	 * 単一のリスナ解除
	 */
	off(element, type, handler, options) {
	  element.removeEventListener(type, handler, options);
	  this._registry = this._registry.filter(
		rec => !(rec.element === element && rec.type === type && rec.handler === handler && rec.options === options)
	  );
	}
  
	/**
	 * すべてのリスナを解除
	 */
	clear() {
	  this._registry.forEach(({ element, type, handler, options }) => {
		element.removeEventListener(type, handler, options);
	  });
	  this._registry.length = 0;
	}
  
	/**
	 * デバッグ用: 登録済みリスナの一覧
	 * @returns {Array<{type: string, handlerName: string}>}
	 */
	list() {
	  return this._registry.map(({ type, handler }) => ({
		type,
		handlerName: handler.name || '<anonymous>'
	  }));
	}
  }
  