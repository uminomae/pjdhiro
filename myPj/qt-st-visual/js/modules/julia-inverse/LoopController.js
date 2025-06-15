import * as THREE from 'three';
import { Complex } from './util/complex-number.js';
import { generateCirclePoints } from './util/generate-circle.js';
import { createColoredPoints3D } from './renderer/d3-utils.js';
import { step1_subtract3D, step2_sqrt1_3D, step3_sqrt2_3D } from './renderer/d3-steps.js';
import { DRAW_PARAMS, FORM_DEFAULTS, STAGE_NAMES, ERROR_MESSAGES } from './d3-config.js';

// グローバルフラグ
window.isPaused  = window.isPaused  ?? false;
window.isStopped = window.isStopped ?? false;

export class LoopController {
  constructor(scene, camera, controls) {
    this.scene    = scene;
    this.camera   = camera;
    this.controls = controls;
    this._resetState();
  }

  _resetState() {
    this._cancel   = false;
    this.isStarted = false;
    this.isPaused  = false;
  }

  isRunning() {
    return this.isStarted && !this._cancel;
  }

  pause() {
    if (this.isStarted && !this._cancel) {
      this.isPaused   = true;
      window.isPaused = true;
      console.log('[LoopController] paused');
    }
  }

  resume() {
    if (this.isStarted && this.isPaused) {
      this.isPaused      = false;
      window.isPaused    = false;
      window.isStopped   = false;
      console.log('[LoopController] resumed');
    }
  }

  cancel() {
    this._cancel       = true;
    this.isPaused     = false;
    window.isPaused   = false;
    window.isStopped  = true;
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

  _sleep(ms = 0) {
    return new Promise(resolve => {
      const start = performance.now();
      const tick = () => {
        // ① STOP → unconditionally finish
        if (window.isStopped) {
          resolve();
          return;
        }
        // ② PAUSE → hold here until resume, don’t resolve
        if (window.isPaused) {
          requestAnimationFrame(tick);
          return;
        }
        // ③ Normal timer
        const elapsed = performance.now() - start;
        if (elapsed >= ms) {
          resolve();
        } else {
          requestAnimationFrame(tick);
        }
      };
      tick();
    });
  }

  
  /** Main animation loop */
  async runInverseAnimation(c, N = FORM_DEFAULTS.N, maxIter = FORM_DEFAULTS.maxIter, interval = DRAW_PARAMS.interval) {
    console.log('[runInverseAnimation] START', { c, N, maxIter, interval });
    if (!(c instanceof Complex)) {
      console.error('[runInverseAnimation] ERROR: c is not Complex', c);
      throw new Error(ERROR_MESSAGES.invalidC);
    }

    // reset flags & state
    window.isPaused  = false;
    window.isStopped = false;
    this._cancel     = false;
    this.isPaused    = false;
    this.isStarted   = true;

    // 初期円描画
    let currentGen = generateCirclePoints(N);
    let prevName   = 'ptsWhite0';
    try{
    const pts0 = createColoredPoints3D(
      this.scene, currentGen, STAGE_NAMES.init, 0, DRAW_PARAMS.pointSize, prevName
    );
    this.scene.add(pts0);
    await this._sleep(interval);
    if (!window.isPaused && !this._cancel) {
      this.scene.remove(pts0);
    }

    // 各世代ループ
    for (let iter = 1; iter <= maxIter; iter++) {
      if (this._cancel) {
        console.log('[runInverseAnimation] CANCELLED at gen', iter);
        break;
      }

      // pause 中は次フレームで即抜け
      while (window.isPaused && !this._cancel) {
        await new Promise(r => requestAnimationFrame(r));
      }
      if (this._cancel) break;

      // ステップ1
      await this._sleep(0);
      const diffPts = await step1_subtract3D(
        this.scene, currentGen, c, prevName,
        iter, DRAW_PARAMS.steps, interval / 2, DRAW_PARAMS.pointSize,
        this._sleep.bind(this)  
      );

      // ステップ2
      await this._sleep(0);
      const sqrtPts1 = await step2_sqrt1_3D(
        this.scene, diffPts, prevName,
        iter, DRAW_PARAMS.steps, interval / 2, DRAW_PARAMS.pointSize,
        this._sleep.bind(this)  
      );

      // ステップ3
      await this._sleep(0);
      const combinedPts = await step3_sqrt2_3D(
        this.scene, diffPts, sqrtPts1, prevName,
        iter, DRAW_PARAMS.steps, interval / 2, DRAW_PARAMS.pointSize,
        this._sleep.bind(this)  
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
      prevName   = newName;
      console.log(`[runInverseAnimation] Generation ${iter} done`);
      await this._sleep(interval);
    }

    console.log('[runInverseAnimation] FINISH');
    this.isStarted = false;
  } finally {
    // ループを抜けたあと、残っているポイントがあれば必ず消す
    const last = this.scene.getObjectByName(prevName);
    if (last) {
      // Three.js のジオメトリ・マテリアルも破棄するならここで
      last.geometry.dispose?.();
      last.material.dispose?.();
      this.scene.remove(last);
    }
  }
}

}