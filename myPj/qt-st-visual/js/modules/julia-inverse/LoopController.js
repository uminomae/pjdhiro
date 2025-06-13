// modules/julia-inverse/loop/LoopController.js

/**
 * LoopController: Three.js のレンダー & コントロール更新ループを管理
 */
export class LoopController {
	/**
	 * @param {{ scene, camera, renderer, controls }} context
	 */
	constructor({ scene, camera, renderer, controls }) {
	  this.scene     = scene;
	  this.camera    = camera;
	  this.renderer  = renderer;
	  this.controls  = controls;
	  this._running  = false;
	  this._rafId    = null;
	}
  
	/** 開始 */
	start() {
	  if (this._running) return;
	  this._running = true;
	  this._loop();
	  console.log('[LoopController] start()');
	}
  
	/** 内部ループ */
	_loop() {
	  if (!this._running) return;
	  this._rafId = requestAnimationFrame(() => this._loop());
	  this.controls.update();
	  this.renderer.render(this.scene, this.camera);
	}
  
	/** 一時停止 */
	pause() {
	  if (!this._running) return;
	  this._running = false;
	  if (this._rafId) cancelAnimationFrame(this._rafId);
	  console.log('[LoopController] pause()');
	}
  
	/** 完全停止 (pause と同じ) */
	stop() {
	  this.pause();
	  console.log('[LoopController] stop()');
	}
  
	/** 動作中か */
	isRunning() {
	  return this._running;
	}
  }
  