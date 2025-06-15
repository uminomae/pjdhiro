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

export class LoopController {
  constructor(scene, camera, controls) {
    this.scene    = scene;
    this.camera   = camera;
    this.controls = controls;
    this._resetState();
  }

  _resetState() {
    this.isPaused   = false;
    this._cancel    = false;
    this.isStarted  = false;
  }

  /** アニメーション実行中かどうか */
  isRunning() {
    return this.isStarted && !this._cancel;
  }

  /** 中断フラグをセット */
  cancel() {
    this._cancel = true;
    this.isPaused = false; // 強制解除して待機ループを脱出
  }

  /** 完全停止 */
  stop() {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    // キャンセルフラグセット＆停止状態へ
    this.cancel();
    this.isStarted = false;
    console.log('[LoopController] stop() 完了');
  }
  
  /** 一時停止 */
  pause() {
    if (this.isStarted) {
      this.isPaused = true;
      console.log('[LoopController] paused');
    }
  }

  /** 再開 */
  resume() {
    if (this.isStarted && this.isPaused) {
      this.isPaused = false;
      console.log('[LoopController] resumed');
    }
  }

  /**
   * 逆写像アニメーションを実行
   * @param {Complex} c - 定数 c
   * @param {number} N - 初期円の分割数
   * @param {number} maxIter - 最大世代数
   * @param {number} interval - フレーム間隔（ms）
   */
  async runInverseAnimation(
    c,
    N = FORM_DEFAULTS.N,
    maxIter = FORM_DEFAULTS.maxIter,
    interval = DRAW_PARAMS.interval
  ) {
    console.log('[runInverseAnimation] START', { c, N, maxIter, interval });

    if (!(c instanceof Complex)) {
      console.error('[runInverseAnimation] ERROR: c is not Complex', c);
      throw new Error(ERROR_MESSAGES.invalidC);
    }

    // 新規実行時に状態リセット
    this._cancel   = false;
    this.isPaused  = false;
    this.isStarted = true;

    // ① 初期円の生成・描画
    let currentGen = generateCirclePoints(N);
    const pts0 = createColoredPoints3D(
      this.scene,
      currentGen,
      STAGE_NAMES.init,
      0,
      DRAW_PARAMS.pointSize,
      'ptsWhite0'
    );
    this.scene.add(pts0);
    await sleep(interval);
    if (!this.isPaused && !this._cancel) this.scene.remove(pts0);

    let prevName = 'ptsWhite0';

    // ② 各世代ループ
    for (let iter = 1; iter <= maxIter; iter++) {
      if (this._cancel) {
        console.log('[runInverseAnimation] CANCELLED at gen', iter);
        break;
      }

      // Pause 中の待機
      while (this.isPaused && !this._cancel) {
        await sleep(100);
      }
      if (this._cancel) {
        console.log('[runInverseAnimation] CANCELLED during pause at gen', iter);
        break;
      }

      // ステップ1：引き算
      const diffPts = await step1_subtract3D(
        this.scene,
        currentGen,
        c,
        prevName,
        iter,
        DRAW_PARAMS.steps,
        interval / 2,
        DRAW_PARAMS.pointSize
      );

      // ステップ2：第一平方根
      const sqrtPts1 = await step2_sqrt1_3D(
        this.scene,
        diffPts,
        prevName,
        iter,
        DRAW_PARAMS.steps,
        interval / 2,
        DRAW_PARAMS.pointSize
      );

      // ステップ3：第二平方根
      const combinedPts = await step3_sqrt2_3D(
        this.scene,
        diffPts,
        sqrtPts1,
        prevName,
        iter,
        DRAW_PARAMS.steps,
        interval / 2,
        DRAW_PARAMS.pointSize
      );

      // 前世代の描画削除
      if (!this.isPaused && !this._cancel) {
        const prevObj = this.scene.getObjectByName(prevName);
        if (prevObj) this.scene.remove(prevObj);
      }

      // 新規世代の描画
      const newName = `ptsWhite${iter}`;
      const ptsWhite = createColoredPoints3D(
        this.scene,
        combinedPts,
        STAGE_NAMES.recolor,
        iter,
        DRAW_PARAMS.pointSize,
        newName
      );
      this.scene.add(ptsWhite);

      currentGen = combinedPts.slice();
      prevName   = newName;

      console.log(`[runInverseAnimation] Generation ${iter} done`);
      await sleep(interval);
    }

    console.log('[runInverseAnimation] FINISH');
    this.isStarted = false;
  }
}
