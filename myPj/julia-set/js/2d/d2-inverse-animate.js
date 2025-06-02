// ファイル: js/2d/d2-inverse-animate.js

import { Complex } from '../util/complex-number.js';
import { drawComplexPoints, drawIterationCount, clearBlack } from './modules/d2-render.js';
import { updateFormula } from './modules/d2-ui.js';
import { pauseCtrl } from './modules/d2-pause-controller.js';

const DOT_DIAMETER = 4;

/**
 * アニメーション本体。
 * shouldStopCallback() が true を返したら中断して即リターンする。
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} scale
 * @param {Complex} c
 * @param {Complex[]} initPts
 * @param {number} maxIter
 * @param {number} pauseMs
 * @param {number} interpSteps
 * @param {() => boolean} shouldStopCallback
 */
export async function animateInverseWithPause(
  ctx,
  cx,
  cy,
  scale,
  c,
  initPts,
  maxIter,
  pauseMs = 800,
  interpSteps = 30,
  shouldStopCallback = () => false
) {
  // === 初期描画: 世代0 ===
  clearBlack(ctx, ctx.canvas.width, ctx.canvas.height);
  let prevWhitePts = initPts.slice();
  drawComplexPoints(ctx, initPts, cx, cy, scale, '#fff', DOT_DIAMETER);
  drawIterationCount(ctx, 0, c);
  updateFormula(
`===== 世代 0 (初期) =====
単位円を白で表示しています。\n\n`
  );
  await pauseCtrl.sleep(pauseMs);

  // === 1世代ずつループ ===
  let wPoints = initPts.slice();
  for (let iter = 1; iter <= maxIter; iter++) {
    if (shouldStopCallback()) return;

    // ── 角度＋半径を求める準備 ──
    const diffPts  = wPoints.map(z => z.sub(c));
    const diffPhis = diffPts.map(z => { let φ = z.arg(); if (φ < 0) φ += 2*Math.PI; return φ; });
    const diffRs   = diffPts.map(z => z.abs());

    // 1) 引き算ステップ
    await step1_subtract(
      ctx, cx, cy, scale,
      wPoints, diffPts,
      interpSteps, pauseMs,
      prevWhitePts,
      c, iter,
      shouldStopCallback
    );
    if (shouldStopCallback()) return;

    // 2) √補間(第一解)
    const sqrtPts1 = diffPts.map((z, i) => {
      const r = diffRs[i], φ = diffPhis[i], φh = φ/2, sR = Math.sqrt(r);
      return new Complex(sR * Math.cos(φh), sR * Math.sin(φh));
    });
    await step2_sqrt1(
      ctx, cx, cy, scale,
      diffPts, sqrtPts1,
      interpSteps, pauseMs,
      diffPhis, diffRs,
      prevWhitePts,
      c, iter,
      shouldStopCallback
    );
    if (shouldStopCallback()) return;

    // 3) √補間(第二解)
    const sqrtPts2 = diffPts.map((z, i) => {
      const r = diffRs[i], φ = diffPhis[i], φh = φ/2 + Math.PI, sR = Math.sqrt(r);
      return new Complex(sR * Math.cos(φh), sR * Math.sin(φh));
    });
    await step3_sqrt2(
      ctx, cx, cy, scale,
      diffPts, sqrtPts2,
      interpSteps, pauseMs,
      diffPhis, diffRs,
      prevWhitePts,
      c, iter,
      sqrtPts1,
      shouldStopCallback
    );
    if (shouldStopCallback()) return;

    // 4) 白リカラー
    clearBlack(ctx, ctx.canvas.width, ctx.canvas.height);
    drawComplexPoints(ctx, sqrtPts1, cx, cy, scale, '#fff', DOT_DIAMETER);
    drawComplexPoints(ctx, sqrtPts2, cx, cy, scale, '#fff', DOT_DIAMETER);
    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：白リカラー =====
黄色＋ピンクを白で上書きしてリセットしました。`
    );
    await pauseCtrl.sleep(pauseMs);
    if (shouldStopCallback()) return;

    // 次世代の準備
    if (iter < maxIter) {
      clearBlack(ctx, ctx.canvas.width, ctx.canvas.height);
      prevWhitePts = sqrtPts1.concat(sqrtPts2).slice();
      wPoints = prevWhitePts.slice();
    }
  }

  // 全世代が終わったあとのメッセージ
  updateFormula("===== 完了 =====\n全世代の逆写像を終了しました。\n\n\n");
}


/**
 * ステップ１：線形補間 → w から (w - c) への引き算
 */
async function step1_subtract(
  ctx, cx, cy, scale,
  parentPts, diffPts,
  steps, pauseMs,
  prevWhitePts,
  c, iter,
  shouldStopCallback
) {
  const N = parentPts.length;
  for (let k = 1; k <= steps; k++) {
    if (shouldStopCallback()) return;
    if (pauseCtrl.isPaused()) {
      await pauseCtrl.sleep(Math.ceil(pauseMs / steps));
    }

    const t = k / steps;

    // (i) 前世代の白点だけ描画
    clearBlack(ctx, ctx.canvas.width, ctx.canvas.height);
    drawComplexPoints(ctx, prevWhitePts, cx, cy, scale, '#fff', DOT_DIAMETER);

    // (ii) 線形補間した点をオレンジで描画
    ctx.fillStyle = '#FFA500';
    const interpPts = [];
    for (let i = 0; i < N; i++) {
      const p = parentPts[i], q = diffPts[i];
      const x = p.re * (1 - t) + q.re * t;
      const y = p.im * (1 - t) + q.im * t;
      interpPts.push(new Complex(x, y));
    }
    drawComplexPoints(ctx, interpPts, cx, cy, scale, '#FFA500', DOT_DIAMETER);

    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：引き算ステップ =====
w - c を計算し、補間中…`
    );

    await pauseCtrl.sleep(Math.ceil(pauseMs / steps));
  }
  // 最終フレームではオレンジ点を残さずにクリア
  clearBlack(ctx, ctx.canvas.width, ctx.canvas.height);
}


/**
 * ステップ２：極座標補間 (第一解)
 */
async function step2_sqrt1(
  ctx, cx, cy, scale,
  diffPts, sqrtPts1,
  steps, pauseMs,
  diffPhis, diffRs,
  prevWhitePts,
  c, iter,
  shouldStopCallback
) {
  const N = diffPts.length;
  for (let k = 1; k <= steps; k++) {
    if (shouldStopCallback()) return;
    if (pauseCtrl.isPaused()) {
      await pauseCtrl.sleep(Math.ceil(pauseMs / steps));
    }

    const t = k / steps;

    // (i) 白点のみ描画
    clearBlack(ctx, ctx.canvas.width, ctx.canvas.height);
    drawComplexPoints(ctx, prevWhitePts, cx, cy, scale, '#fff', DOT_DIAMETER);
    drawComplexPoints(ctx, diffPts,    cx, cy, scale, '#fff', DOT_DIAMETER);

    // (ii) √補間：差分→第一解 を黄色で描画
    ctx.fillStyle = 'yellow';
    const interpPts = [];
    for (let i = 0; i < N; i++) {
      const φ0 = diffPhis[i], r0 = diffRs[i];
      const z1 = sqrtPts1[i];
      let φ1 = Math.atan2(z1.im, z1.re);
      if (φ1 < 0) φ1 += 2*Math.PI;
      const r1 = z1.abs();

      let dφ = φ1 - φ0;
      if (dφ > Math.PI)      dφ -= 2*Math.PI;
      else if (dφ < -Math.PI) dφ += 2*Math.PI;

      const r_t = r0 * (1 - t) + r1 * t;
      const φ_t = φ0 + dφ * t;
      const x = r_t * Math.cos(φ_t);
      const y = r_t * Math.sin(φ_t);
      interpPts.push(new Complex(x, y));
    }
    drawComplexPoints(ctx, interpPts, cx, cy, scale, 'yellow', DOT_DIAMETER);

    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：√ステップ（①解） =====
半角度 φ/2 & √r → 黄色で補間中…`
    );

    await pauseCtrl.sleep(Math.ceil(pauseMs / steps));
  }

  // 補間終了後、黄色点をそのまま残す
  clearBlack(ctx, ctx.canvas.width, ctx.canvas.height);
  drawComplexPoints(ctx, sqrtPts1, cx, cy, scale, 'yellow', DOT_DIAMETER);
}


/**
 * ステップ３：極座標補間 (第二解)
 */
async function step3_sqrt2(
  ctx, cx, cy, scale,
  diffPts, sqrtPts2,
  steps, pauseMs,
  diffPhis, diffRs,
  prevWhitePts,
  c, iter,
  sqrtPts1,
  shouldStopCallback
) {
  const N = diffPts.length;
  for (let k = 1; k <= steps; k++) {
    if (shouldStopCallback()) return;
    if (pauseCtrl.isPaused()) {
      await pauseCtrl.sleep(Math.ceil(pauseMs / steps));
    }

    const t = k / steps;

    // (i) 黄色点（第一解）だけ描画
    clearBlack(ctx, ctx.canvas.width, ctx.canvas.height);
    drawComplexPoints(ctx, sqrtPts1, cx, cy, scale, 'yellow', DOT_DIAMETER);

    // (ii) 白点（差分）を描画
    drawComplexPoints(ctx, diffPts, cx, cy, scale, '#fff', DOT_DIAMETER);

    // (iii) √補間：差分→第二解 をピンクで描画
    ctx.fillStyle = '#FF69B4';
    const interpPts = [];
    for (let i = 0; i < N; i++) {
      const φ0 = diffPhis[i], r0 = diffRs[i];
      const z2 = sqrtPts2[i];
      let φ1 = Math.atan2(z2.im, z2.re);
      if (φ1 < 0) φ1 += 2*Math.PI;
      const r1 = z2.abs();

      let dφ = φ1 - φ0;
      if (dφ > Math.PI)      dφ -= 2*Math.PI;
      else if (dφ < -Math.PI) dφ += 2*Math.PI;

      const r_t = r0 * (1 - t) + r1 * t;
      const φ_t = φ0 + dφ * t;
      const x = r_t * Math.cos(φ_t);
      const y = r_t * Math.sin(φ_t);
      interpPts.push(new Complex(x, y));
    }
    drawComplexPoints(ctx, interpPts, cx, cy, scale, '#FF69B4', DOT_DIAMETER);

    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：√ステップ（②解） =====
φ/2+π & √r → ピンクで補間中…`
    );

    await pauseCtrl.sleep(Math.ceil(pauseMs / steps));
  }

  // 補間終了後、黄色＋ピンクをそのまま残す
  clearBlack(ctx, ctx.canvas.width, ctx.canvas.height);
  drawComplexPoints(ctx, sqrtPts1, cx, cy, scale, 'yellow', DOT_DIAMETER);
  drawComplexPoints(ctx, sqrtPts2, cx, cy, scale, '#FF69B4', DOT_DIAMETER);
}
