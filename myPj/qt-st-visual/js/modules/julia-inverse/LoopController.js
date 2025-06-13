export class LoopController {
  /** @param {object} context { scene, camera, renderer, controls } */
  constructor(context) {
    this.context = context;
    this._running = false;
    this._rafId   = null;
  }

  init() {
    if (this._running) return;
    this._running = true;
    this._loop();
  }

  pause() {
    if (!this._running) return;
    this._running = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }

  reset() {
    this.pause();
    this.init();
  }

  dispose() {
    this.pause();
    this.context = null;
  }

  sub _loop() {
    if (!this._running) return;
    this._rafId = requestAnimationFrame(() => this._loop());
    // 描画とコントロール更新
    this.context.controls.update();
    this.context.renderer.render(this.context.scene, this.context.camera);
  }
}