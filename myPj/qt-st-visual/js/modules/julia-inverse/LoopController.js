import * as THREE from 'three';
import { Complex } from './util/complex-number.js';
import { generateCirclePoints } from './util/generate-circle.js';
import { pauseAwareSleep as sleep } from './util/sleep.js';
import { createColoredPoints3D } from './renderer/d3-utils.js';
import { step1_subtract3D, step2_sqrt1_3D, step3_sqrt2_3D } from './renderer/d3-steps.js';
import { DRAW_PARAMS, FORM_DEFAULTS, STAGE_NAMES, ERROR_MESSAGES } from './d3-config.js';

// グローバルフラグ
window.isPaused = window.isPaused ?? false;
window.isStopped = window.isStopped ?? false;

export class LoopController {
  constructor(scene, camera, controls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this._resetState();
  }

  _resetState() {
    this._cancel = false;
  }

  isRunning() {
    return !this._cancel;
  }

  pause() {
    if (!this._cancel) {
      window.isPaused = true;
      console.log('[LoopController] paused');
    }
  }

  resume() {
    window.isPaused = false;
    window.isStopped = false;
    console.log('[LoopController] resumed');
  }

  cancel() {
    this._cancel = true;
    window.isPaused = false;
    window.isStopped = true;
    console.log('[LoopController] canceled');
  }

  stop() {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.cancel();
    console.log('[LoopController] stop() completed');
  }

  /** Main animation loop */
  async runInverseAnimation(c, N = FORM_DEFAULTS.N, maxIter = FORM_DEFAULTS.maxIter, interval = DRAW_PARAMS.interval) {
    if (!(c instanceof Complex)) {
      throw new Error(ERROR_MESSAGES.invalidC);
    }

    // reset flags
    window.isPaused = false;
    window.isStopped = false;
    this._cancel = false;

    // 初期円描画
    let currentGen = generateCirclePoints(N);
    let prevName = 'ptsWhite0';
    const pts0 = createColoredPoints3D(this.scene, currentGen, STAGE_NAMES.init, 0, DRAW_PARAMS.pointSize, prevName);
    this.scene.add(pts0);
    await sleep(interval);
    if (!window.isPaused && !this._cancel) this.scene.remove(pts0);

    for (let iter = 1; iter <= maxIter; iter++) {
      if (this._cancel) break;

      // Step 1
      const diffPts = await step1_subtract3D(
        this.scene, currentGen, c, prevName,
        iter, DRAW_PARAMS.steps, interval / 2, DRAW_PARAMS.pointSize
      );

      // Step 2
      const sqrtPts1 = await step2_sqrt1_3D(
        this.scene, diffPts, prevName,
        iter, DRAW_PARAMS.steps, interval / 2, DRAW_PARAMS.pointSize
      );

      // Step 3
      const combinedPts = await step3_sqrt2_3D(
        this.scene, diffPts, sqrtPts1, prevName,
        iter, DRAW_PARAMS.steps, interval / 2, DRAW_PARAMS.pointSize
      );

      // 新規世代描画
      const newName = `ptsWhite${iter}`;
      const ptsWhite = createColoredPoints3D(
        this.scene, combinedPts, STAGE_NAMES.recolor,
        iter, DRAW_PARAMS.pointSize, newName
      );
      this.scene.add(ptsWhite);

      // 前世代削除
      if (!window.isPaused && !this._cancel) {
        const prevObj = this.scene.getObjectByName(prevName);
        if (prevObj) this.scene.remove(prevObj);
      }

      currentGen = combinedPts.slice();
      prevName = newName;

      console.log(`[runInverseAnimation] Generation ${iter} done`);
      await sleep(interval);
    }

    console.log('[runInverseAnimation] FINISH');
  }
}
