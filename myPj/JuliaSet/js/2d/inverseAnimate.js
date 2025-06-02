// js/inverseAnimate.js

import { Complex } from './complex.js';
const DOT_DIAMETER = 4;

/** 一時停止フラグ */
let isPaused = false;
/** 一時停止時の Promise 解決用 */
const resumeResolvers = [];

/** アニメーションを一時停止 */
export function pauseAnimation() {
  isPaused = true;
}
/** アニメーションを再開 */
export function resumeAnimation() {
  if (!isPaused) return;
  isPaused = false;
  while (resumeResolvers.length) {
    const resolve = resumeResolvers.shift();
    resolve();
  }
}

/**
 * 指定ミリ秒だけ待機するが、一時停止フラグをチェックする sleep
 */
async function sleepWithPause(ms) {
  const interval = 50;
  let elapsed = 0;
  while (elapsed < ms) {
    if (isPaused) {
      await new Promise(resolve => resumeResolvers.push(resolve));
    }
    const wait = Math.min(interval, ms - elapsed);
    await new Promise(resolve => setTimeout(resolve, wait));
    elapsed += wait;
  }
}

/**
 * 右上に「現在の世代番号」と Julia 定数 c の実部・虚部を描画する関数
 */
function drawIterationCount(ctx, iter, c) {
  const padding = 10;
  const fontSize = 20;
  const fontFamily = 'monospace';

  const iterText = String(iter).padStart(3, '0');
  const cre = c.re.toFixed(3);
  const cim = c.im.toFixed(3);

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  const iterMetrics = ctx.measureText(iterText);
  const iterWidth  = iterMetrics.width;
  const iterHeight = fontSize;

  const cText1 = `Re: ${cre}`;
  const cText2 = `Im: ${cim}`;
  const cMetrics1 = ctx.measureText(cText1);
  const cMetrics2 = ctx.measureText(cText2);
  const cWidth  = Math.max(cMetrics1.width, cMetrics2.width);
  const cHeight = fontSize * 2 + 4;

  const totalWidth  = Math.max(iterWidth, cWidth) + 8;
  const totalHeight = iterHeight + cHeight + 12;
  const x0 = ctx.canvas.width - padding - totalWidth;
  const y0 = padding;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(x0, y0, totalWidth, totalHeight);

  ctx.fillStyle = '#fff';
  ctx.fillText(iterText, x0 + totalWidth - 4, y0 + 4);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const cxText = x0 + 4;
  const cyText = y0 + 4 + iterHeight + 4;
  ctx.fillText(cText1, cxText, cyText);
  ctx.fillText(cText2, cxText, cyText + fontSize + 2);
}

/**
 * 「計算式・処理内容」を下部の <div id="formula"> に表示する
 */
function updateFormula(text) {
  const elem = document.getElementById('formula');
  if (elem) {
    elem.textContent = text;
  }
}

/**
 * Canvas 上にドットを描画するユーティリティ
 */
function drawPts(ctx, points, cx, cy, scale, color, diameter) {
  ctx.fillStyle = color;
  for (const z of points) {
    const px = cx + z.re * scale;
    const py = cy - z.im * scale;
    ctx.beginPath();
    ctx.arc(px, py, diameter / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * -----------------------
 * ステップ１：直交座標で線形補間
 *  wPoints → diffPts をオレンジで補間し、
 *  補間後はオレンジを残さず消す
 * -----------------------
 */
async function step1_subtract(
  ctx, cx, cy, scale,
  parentPts, diffPts,
  steps, pauseMs,
  prevWhitePts,  // 前世代の白点を保持する配列
  c, iter
) {
  const N = parentPts.length;
  for (let k = 1; k <= steps; k++) {
    if (isPaused) {
      await new Promise(res => resumeResolvers.push(res));
    }
    const t = k / steps;

    // クリア
    // ────────────── 初期描画：「透明にクリア」 + 単位円(白) ──────────────
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // (i) 前世代の白点を描画
    drawPts(ctx, prevWhitePts, cx, cy, scale, '#fff', DOT_DIAMETER);

    // (ii) w → diff を線形補間してオレンジで描画
    ctx.fillStyle = '#FFA500';
    for (let i = 0; i < N; i++) {
      const p = parentPts[i];
      const q = diffPts[i];
      const x = p.re * (1 - t) + q.re * t;
      const y = p.im * (1 - t) + q.im * t;
      const px = cx + x * scale;
      const py = cy - y * scale;
      ctx.beginPath();
      ctx.arc(px, py, DOT_DIAMETER / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：引き算ステップ =====
w - c を計算し、補間中…`
    );

    await sleepWithPause(pauseMs / steps);
  }
  // 補間後はオレンジを残さず消すので、特に描画処理は行わずに次へ
}

/**
 * -----------------------
 * ステップ２：極座標補間 (①解)
 *  diffPts → sqrtPts1 を黄色で補間し、
 *  補間後は黄色だけを残す
 * -----------------------
 */
async function step2_sqrt1(
  ctx, cx, cy, scale,
  diffPts, sqrtPts1,
  steps, pauseMs,
  diffPhis, diffRs,
  prevWhitePts,  // 前世代の白点を描くために渡す
  c, iter
) {
  const N = diffPts.length;

  for (let k = 1; k <= steps; k++) {
    if (isPaused) {
      await new Promise(res => resumeResolvers.push(res));
    }
    const t = k / steps;

    // クリア
    // ────────────── 初期描画：「透明にクリア」 + 単位円(白) ──────────────
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // (i) 前世代の白点を描画
    drawPts(ctx, prevWhitePts, cx, cy, scale, '#fff', DOT_DIAMETER);

    // (ii) diffPts を白で描く
    drawPts(ctx, diffPts, cx, cy, scale, '#fff', DOT_DIAMETER);

    // (iii) 極座標補間 diffPts → sqrtPts1 を黄色で描画
    ctx.fillStyle = 'yellow';
    for (let i = 0; i < N; i++) {
      // diffPts の極座標 (r0, φ0)
      let r0 = diffRs[i];
      let φ0 = diffPhis[i];
      // sqrtPts1 の極座標 (r1, φ1)
      let z1 = sqrtPts1[i];
      let φ1 = Math.atan2(z1.im, z1.re);
      if (φ1 < 0) φ1 += 2 * Math.PI;
      let r1 = z1.abs();
      // φ の最短回転
      let dφ = φ1 - φ0;
      if (dφ > Math.PI)      dφ -= 2 * Math.PI;
      else if (dφ < -Math.PI) dφ += 2 * Math.PI;
      // 線形補間
      const r_t = r0 * (1 - t) + r1 * t;
      const φ_t = φ0 + dφ * t;
      const x = r_t * Math.cos(φ_t);
      const y = r_t * Math.sin(φ_t);
      const px = cx + x * scale;
      const py = cy - y * scale;
      ctx.beginPath();
      ctx.arc(px, py, DOT_DIAMETER / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：√ステップ（①解） =====
半角度 φ/2 & √r → 黄色で補間中…`
    );

    await sleepWithPause(pauseMs / steps);
  }

  // 補間完了後、黄色の最終ドットだけを残す
  ctx.fillStyle = 'yellow';
  drawPts(ctx, sqrtPts1, cx, cy, scale, 'yellow', DOT_DIAMETER);
}

/**
 * -----------------------
 * ステップ３：極座標補間 (②解)
 *  diffPts → sqrtPts2 をピンクで補間し、
 *  黄色を保持しつつ最終的なピンクだけを残す
 * -----------------------
 */
async function step3_sqrt2(
  ctx, cx, cy, scale,
  diffPts, sqrtPts2,
  steps, pauseMs,
  diffPhis, diffRs,
  prevWhitePts,  // 前世代の白点 (今回は使用しないが引数として渡す形を維持)
  c, iter,
  sqrtPts1       // すでに残っている黄色ドット
) {
  const N = diffPts.length;

  for (let k = 1; k <= steps; k++) {
    if (isPaused) {
      await new Promise(res => resumeResolvers.push(res));
    }
    const t = k / steps;

    // クリア
    // ────────────── 初期描画：「透明にクリア」 + 単位円(白) ──────────────
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // (i) 黄色ドット (sqrtPts1) を描画
    drawPts(ctx, sqrtPts1, cx, cy, scale, 'yellow', DOT_DIAMETER);

    // (ii) diffPts を白で描画
    drawPts(ctx, diffPts, cx, cy, scale, '#fff', DOT_DIAMETER);

    // (iii) 極座標補間 diffPts → sqrtPts2 をピンクで描画
    ctx.fillStyle = '#FF69B4';
    for (let i = 0; i < N; i++) {
      let r0 = diffRs[i];
      let φ0 = diffPhis[i];
      let z1 = sqrtPts2[i];
      let φ1 = Math.atan2(z1.im, z1.re);
      if (φ1 < 0) φ1 += 2 * Math.PI;
      let r1 = z1.abs();
      let dφ = φ1 - φ0;
      if (dφ > Math.PI)      dφ -= 2 * Math.PI;
      else if (dφ < -Math.PI) dφ += 2 * Math.PI;
      const r_t = r0 * (1 - t) + r1 * t;
      const φ_t = φ0 + dφ * t;
      const x = r_t * Math.cos(φ_t);
      const y = r_t * Math.sin(φ_t);
      const px = cx + x * scale;
      const py = cy - y * scale;
      ctx.beginPath();
      ctx.arc(px, py, DOT_DIAMETER / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：√ステップ（②解） =====
φ/2+π & √r → ピンクで補間中…`
    );

    await sleepWithPause(pauseMs / steps);
  }

  // 補間完了後、黄色＋ピンクをそのまま残す
  drawPts(ctx, sqrtPts1, cx, cy, scale, 'yellow', DOT_DIAMETER);
  ctx.fillStyle = '#FF69B4';
  drawPts(ctx, sqrtPts2, cx, cy, scale, '#FF69B4', DOT_DIAMETER);
}

/**
 * -----------------------
 * メイン：世代ごとの逆写像アニメーション
 * -----------------------
 */
export async function animateInverseWithPause(
  ctx, cx, cy, scale,
  c, initPts, maxIter,
  pauseMs = 800, interpSteps = 30
) {
  // 初期描画：背景黒 + 単位円(白)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // prevSqrtPts は「前回の世代の白点」を表す
  let prevSqrtPts = initPts.slice();

  // ── 世代0 ──
  drawPts(ctx, initPts, cx, cy, scale, '#fff', DOT_DIAMETER);
  drawIterationCount(ctx, 0, c);
  updateFormula(
`===== 世代 0 (初期) =====
単位円を白で表示しています。
\n\n`
  );
  await sleepWithPause(pauseMs);

  // wPoints が「現在逆写像対象の点群」
  let wPoints = initPts.slice();

  for (let iter = 1; iter <= maxIter; iter++) {
    // ── (A) diffPts を計算 ──
    const diffPts = wPoints.map(z => z.sub(c));
    const diffPhis = diffPts.map(z => {
      let φ = Math.atan2(z.im, z.re);
      if (φ < 0) φ += 2 * Math.PI;
      return φ;
    });
    const diffRs = diffPts.map(z => z.abs());

    // ── 1) 引き算ステップ ──
    await step1_subtract(
      ctx, cx, cy, scale,
      wPoints, diffPts,
      interpSteps, pauseMs,
      prevSqrtPts,
      c, iter
    );

    // ── 2) 半角度＋√ (①解)：diffPts → sqrtPts1 ──
    const sqrtPts1 = [];
    for (let i = 0; i < diffPts.length; i++) {
      const r  = diffRs[i];
      const φ  = diffPhis[i];
      const φh = φ / 2;
      const sR = Math.sqrt(r);
      sqrtPts1.push(new Complex(
        sR * Math.cos(φh),
        sR * Math.sin(φh)
      ));
    }
    await step2_sqrt1(
      ctx, cx, cy, scale,
      diffPts, sqrtPts1,
      interpSteps, pauseMs,
      diffPhis, diffRs,
      prevSqrtPts,
      c, iter
    );
    // この時点で黄色ドット (sqrtPts1) が残っている

    // ── 3) 半角度＋√ (②解)：diffPts → sqrtPts2 ──
    const sqrtPts2 = [];
    for (let i = 0; i < diffPts.length; i++) {
      const r  = diffRs[i];
      const φ  = diffPhis[i];
      const φh = φ / 2 + Math.PI;
      const sR = Math.sqrt(r);
      sqrtPts2.push(new Complex(
        sR * Math.cos(φh),
        sR * Math.sin(φh)
      ));
    }
    await step3_sqrt2(
      ctx, cx, cy, scale,
      diffPts, sqrtPts2,
      interpSteps, pauseMs,
      diffPhis, diffRs,
      prevSqrtPts,
      c, iter,
      sqrtPts1
    );
    // この時点で黄色ドット＋ピンクドットが残っている

    // ── 4) 白リカラー ──
    // ────────────── 初期描画：「透明にクリア」 + 単位円(白) ──────────────
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // 白で最終形を描き直し
    ctx.fillStyle = '#fff';
    drawPts(ctx, sqrtPts1, cx, cy, scale, '#fff', DOT_DIAMETER);
    drawPts(ctx, sqrtPts2, cx, cy, scale, '#fff', DOT_DIAMETER);
    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：白リカラー =====
黄色＋ピンクを白で上書きしてリセットしました。`
    );
    await sleepWithPause(pauseMs);

    // ── 5) 次世代へのリセット or 終了 ──
    if (iter < maxIter) {
      // 画面黒クリア
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // 次世代の「前世代白点」は sqrtPts1 + sqrtPts2
      prevSqrtPts = sqrtPts1.concat(sqrtPts2).slice();
      // 次世代の wPoints も同様
      wPoints = prevSqrtPts.slice();
    }
    // 最終世代ではここでループを抜け、白点がそのまま残る
  }

  updateFormula("===== 完了 =====\n全世代の逆写像を終了しました。\n\n\n");
}
