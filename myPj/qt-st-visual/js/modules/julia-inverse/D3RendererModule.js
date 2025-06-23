/*
 * This file originally implemented an alternative renderer module.
 * It is no longer referenced anywhere in the project, but is kept
 * for historical purposes.  The entire implementation is commented
 * out to avoid accidental use.
 */

/*
import * as THREE from 'three';
import { Complex } from './util/complex-number.js';
import { generateCirclePoints } from './util/generate-circle.js';
import { pauseAwareSleep as sleep } from './util/sleep.js';
import { createColoredPoints3D } from './renderer/d3-utils.js';
import {
  step1_subtract3D,
  step2_sqrt1_3D,
  step3_sqrt2_3D
} from './renderer/d3-steps.js';
import {
  DRAW_PARAMS,
  FORM_DEFAULTS,
  STAGE_NAMES,
  ERROR_MESSAGES
} from './d3-config.js';

export class D3RendererModule {
  constructor(context) {
    this.scene     = context.scene;
    this.camera    = context.camera;
    this.renderer  = context.renderer;
    this.controls  = context.controls;
    this._rafId    = null;
    this._running  = false;
    // Run/Pause 用フラグ
    this.isStarted = false;
    this.isPaused  = false;
    this._cancel = false;
  }

  /** 内部ループ */
  _loop() {
    if (!this._running || this.isPaused) return;
    this._rafId = requestAnimationFrame(() => this._loop());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

   /** 描画ループを一時停止 */
   pause() {
    if (!this.isStarted || this.isPaused) return;
    this.isPaused = true;
    console.log('[D3RendererModule] paused');
  }

  /** 描画ループを再開 */
  resume() {
    if (!this.isStarted || !this.isPaused) return;
    this.isPaused = false;
    console.log('[D3RendererModule] resumed');
    // もしループ中なら再度 _loop を呼び出す
    if (this._running) this._loop();
  }
  
  /** 描画ループ開始 */
  startLoop() {
    if (this._running) return;
    this._running = true;
    this._loop();
    console.log('[D3RendererModule] startLoop()');
  }

  /** 描画ループ停止 */
  stopLoop() {
    if (!this._running) return;
    this._running = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    console.log('[D3RendererModule] stopLoop()');
  }

  /** シーンとレンダラーをクリア */
  dispose() {
    // ① 既存 RAF を確実にキャンセル
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this.stopLoop();
    // ② 中断フラグ立て
    this._cancel = true;

    while (this.scene.children.length) {
      this.scene.remove(this.scene.children[0]);
    }
    this.renderer.clear();
    this._rafId    = null;
    this.isStarted = false;
    this.isPaused  = false;
    console.log('[D3RendererModule] dispose() 完了');
  }

  /** 一時停止中はここで待機 */
  async _awaitWhilePaused() {
    while (this.isPaused) {
      await sleep(100);
    }
  }

  /**
   * 逆写像アニメーションを実行
   * @param {Complex} c
   * @param {number} N
   * @param {number} maxIter
   * @param {number} interval
   */
  async runInverseAnimation(
    c,
    N = FORM_DEFAULTS.N,
    maxIter = FORM_DEFAULTS.maxIter,
    interval = DRAW_PARAMS.interval
  ) {
    console.log('[runInverseAnimation] START', { c, N, maxIter, interval });
    // Run ボタンクリック時に初期化
    this.isStarted = true;
    this._cancel = false;
    this.isPaused  = false;

    if (!(c instanceof Complex)) {
      console.error('[runInverseAnimation] ERROR: c is not a Complex instance', c);
      throw new Error(ERROR_MESSAGES.invalidC);
    }

    // ① 初期円を描画
    let currentGen = generateCirclePoints(N);
    console.log('[runInverseAnimation] Generated initial circle with', currentGen.length, 'points');

    const pts0 = createColoredPoints3D(
      this.scene, currentGen, STAGE_NAMES.init, 0, DRAW_PARAMS.pointSize, 'ptsWhite0'
    );
    this.scene.add(pts0);
    await sleep(interval);
    // Pause 中は削除しない
    if (!this.isPaused) this.scene.remove(pts0);

    // ② 各世代ループ
    let prevWhiteName = 'ptsWhite0';
    for (let iter = 1; iter <= maxIter; iter++) {
      console.log(`[runInverseAnimation] Generation ${iter} START`);

      // Pause 中はここで待機
      await this._awaitWhilePaused();
      if (this._cancel) {
        console.log('[runInverseAnimation] Cancelled at generation', iter);
        return;
      }

      // Step 1
      const diffPts = await step1_subtract3D(
        this.scene, currentGen, c, prevWhiteName, iter,
        DRAW_PARAMS.steps, interval / 2, DRAW_PARAMS.pointSize
      );
      console.log(`[runInverseAnimation] Generation ${iter} - Step1 ${diffPts.length}`);

      // await this._awaitWhilePaused();

      // Step 2
      const sqrtPts1 = await step2_sqrt1_3D(
        this.scene, diffPts, prevWhiteName, iter,
        DRAW_PARAMS.steps, interval / 2, DRAW_PARAMS.pointSize
      );
      console.log(`[runInverseAnimation] Generation ${iter} - Step2 ${sqrtPts1.length}`);

      // await this._awaitWhilePaused();

      // Step 3
      const combinedPts = await step3_sqrt2_3D(
        this.scene, diffPts, sqrtPts1, prevWhiteName, iter,
        DRAW_PARAMS.steps, interval / 2, DRAW_PARAMS.pointSize
      );
      console.log(`[runInverseAnimation] Generation ${iter} - Step3 ${combinedPts.length}`);

      // await this._awaitWhilePaused();

      // 前世代の白点を削除（Pause中はスキップ）
      if (!this.isPaused) {
        const prevObj = this.scene.getObjectByName(`ptsWhite${iter - 1}`);
        console.log(`[runInverseAnimation] scene.remove`);
        if (prevObj) this.scene.remove(prevObj);
      }

      const newWhiteName = `ptsWhite${iter}`;
      const ptsWhite = createColoredPoints3D(
        this.scene, combinedPts, STAGE_NAMES.recolor,
        iter, DRAW_PARAMS.pointSize, newWhiteName
      );
      this.scene.add(ptsWhite);
      prevWhiteName = newWhiteName;
      currentGen = combinedPts.slice();

      console.log(`[runInverseAnimation] Generation ${iter} COMPLETED`);
      await sleep(interval);
    }

    console.log('[runInverseAnimation] FINISH');
  }
}
*/
