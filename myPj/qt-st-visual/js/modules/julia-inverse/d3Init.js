import { JuliaFormController } from './d3JuliaFormController.js';
import { initThree, animateLoop } from './d3-renderer.js';
import { initLegendToggle } from './ui/legend-ui.js';


/**
 * D3 アプリケーション初期化管理クラス
 */
class D3InitApp {
	constructor(onReset) {
	  this.onReset = onReset;
	  this._initialized = false;
	  this._formController = new JuliaFormController(onReset);
	}
  
	/** 初期化フロー */
	init() {
	  if (this._initialized) return;
	  this._formController.init();
	  initThree();
	  animateLoop();
	  this._initLegend();
	  initLegendToggle();
	  this._initialized = true;
	  console.log('[d3-init-app] init() 完了');
	}
  
	/** リセットフロー */
	reset() {
	  console.log('[d3-init-app] reset() 開始');
	  this.dispose();
	  this._initialized = false;
	  this.init();
	  console.log('[d3-init-app] reset() 完了');
	}
  
	/** 破棄フロー */
	dispose() {
	  this._clearScene();
	  this._clearRenderer();
	  this._hideLegend();
	  this._formController.dispose();
	  console.log('[d3-init-app] dispose() 完了');
	}
  
	/** 凡例の初期描画 */
	_initLegend() {
	  const checked = document.querySelector('#chk-legend')?.checked;
	  const mod = './ui/d3-legend-sub.js';
	  if (checked) {
		import(mod).then(({ drawLegend, showLegend }) => {
		  showLegend();
		  drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
		});
	  } else {
		import(mod).then(({ hideLegend }) => hideLegend());
	  }
	}
  
	_clearScene() {
	  if (window.scene) {
		while (window.scene.children.length) {
		  window.scene.remove(window.scene.children[0]);
		}
	  }
	}
  
	_clearRenderer() {
	  if (window.renderer) window.renderer.clear();
	}
  
	_hideLegend() {
	  import('./ui/d3-legend-sub.js')
		.then(({ hideLegend }) => hideLegend())
		.catch(err => console.warn('[d3-init-app] hideLegend error', err));
	}
  }
  
  let _instance = null;
  
  /**
   * エントリーポイント: 初期化 or 再初期化
   * @param {Function} onReset リセット時コールバック
   */
  export function initJuliaApp(onReset) {
	if (!_instance) {
	  _instance = new D3InitApp(onReset);
	}
	_instance.init();
  }
  
  /** リセット */
  export function resetJuliaApp() {
	if (_instance) _instance.reset();
  }
  
  /** 破棄 */
  export function disposeJuliaApp() {
	if (_instance) {
	  _instance.dispose();
	  _instance = null;
	}
  }
  