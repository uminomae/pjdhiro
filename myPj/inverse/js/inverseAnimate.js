// js/inverseAnimate.js

import { Complex } from './complex.js';
const DOT_DIAMETER = 4;

/**
 * 一時停止フラグ
 */
let isPaused = false;

/**
 * 一時停止時の Promise 解決用に保持する関数群
 */
const resumeResolvers = [];

/**
 * アニメーションを一時停止する（外部から呼び出し）
 */
export function pauseAnimation() {
  isPaused = true;
}

/**
 * アニメーションを再開する（外部から呼び出し）
 */
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
 * @param {number} ms ── 待機時間 (ミリ秒)
 */
async function sleepWithPause(ms) {
  const interval = 50; // 50ms ごとに一時停止判定
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
 * @param {CanvasRenderingContext2D} ctx
 * @param {number}                  iter ── 現在の世代 (0～)
 * @param {Complex}                 c    ── Julia 定数 c（実部・虚部を表示）
 */
function drawIterationCount(ctx, iter, c) {
  const padding = 10;
  const fontSize = 20;            // フォントサイズ（px）
  const fontFamily = 'monospace'; // モノスペースで桁幅一定に

  const iterText = String(iter).padStart(3, '0');
  // c の実部・虚部は小数点第3位くらいまで表示例
  const cre = c.re.toFixed(3);
  const cim = c.im.toFixed(3);

  // ---- 世代番号のテキスト幅を測る ----
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  const iterMetrics = ctx.measureText(iterText);
  const iterWidth  = iterMetrics.width;
  const iterHeight = fontSize; // モノスペースならフォントサイズが高さの目安

  // ---- c の実部・虚部のテキストを準備 ----
  const cText1 = `Re: ${cre}`;
  const cText2 = `Im: ${cim}`;
  // こちらは “123.456” みたいな固定幅なので、第二行以降はだいたい同じ幅
  // 余裕を持たせるなら少し長めに想定しておく
  const cMetrics1 = ctx.measureText(cText1);
  const cMetrics2 = ctx.measureText(cText2);
  const cWidth  = Math.max(cMetrics1.width, cMetrics2.width);
  const cHeight = fontSize * 2 + 4; // 実部と虚部２行分＋行間ごく少し

  // ---- 全体を背景付きで描画するエリアを決定 ----
  // 世代番号と c テキストをまとめて四角で囲んで作る例
  const totalWidth  = Math.max(iterWidth, cWidth) + 8; // 左右マージン
  const totalHeight = iterHeight + cHeight + 12;       // 上下マージン

  const x0 = ctx.canvas.width - padding - totalWidth;
  const y0 = padding;

  // 背景透過黒で四角を塗りつぶし
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(x0, y0, totalWidth, totalHeight);

  // ---- 世代番号を描く ----
  ctx.fillStyle = '#fff';
  ctx.fillText(iterText, x0 + totalWidth - 4, y0 + 4);

  // ---- c の実部・虚部を２行で描く ----
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const cxText = x0 + 4;
  const cyText = y0 + 4 + iterHeight + 4; // 世代番号から少し下へ
  ctx.fillText(cText1, cxText, cyText);
  ctx.fillText(cText2, cxText, cyText + fontSize + 2);
}


/**
 * 「計算式・処理内容」を下部の <div id="formula"> に表示する
 * @param {string} text ── 表示したい文字列 (改行可)
 */
function updateFormula(text) {
  const elem = document.getElementById('formula');
  if (elem) {
    elem.textContent = text;
  }
}

/**
 * 逆写像をステップごとに描画し、各ステップで pause すると同時に
 * 「一世代前(白) → 半角度１本目(黄) → 半角度２本目(黄) → √(ピンク) → ピンク→白リカラー」
 * の順に表示し、次世代では真っ黒にクリアして始めるアニメーション。
 *
 * @param {CanvasRenderingContext2D} ctx      ── 描画先 2D コンテキスト
 * @param {number}                  cx       ── Canvas 中心の x 座標 (ピクセル)
 * @param {number}                  cy       ── Canvas 中心の y 座標 (ピクセル)
 * @param {number}                  scale    ── 複素平面上の長さ1を何ピクセルに対応させるか
 * @param {Complex}                 c        ── Julia 定数 c
 * @param {Complex[]}               initPts  ── 初期点列 (単位円)
 * @param {number}                  maxIter  ── 何世代まで逆写像を行うか
 * @param {function}                drawPts  ── 描画用関数 (drawPoints)
 * @param {number}                  pauseMs  ── 各ステップごとに待機する時間 (ミリ秒)
 */
export async function animateInverseWithPause(ctx, cx, cy, scale, c, initPts, maxIter, drawPts, pauseMs = 100) {
  // ────────────── 0) 初期描画: 背景黒 + 単位円(白) ──────────────
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let prevSqrtPts = initPts.slice();

  drawPts(ctx, initPts, cx, cy, scale, '#fff', DOT_DIAMETER);
  drawIterationCount(ctx, 0, c);
  updateFormula(
`===== 世代 0 (初期) =====
単位円を白で表示しています。
\n\n`
  );
  await sleepWithPause(pauseMs);

  let wPoints = initPts.slice();

  for (let iter = 1; iter <= maxIter; iter++) {
    // 各 wPoints について diff = w - c, φ, r を計算し、θ1, θ2 を得る
    const halfPts1 = []; // 角度半分：第1ブランチ
    const halfPts2 = []; // 角度半分：第2（反転コピー）ブランチ

    for (const w of wPoints) {
      const diff = w.sub(c);
      let phi = Math.atan2(diff.im, diff.re);
      if (phi < 0) phi += 2 * Math.PI;
      const r = diff.abs();
      const theta1 = phi / 2;
      const theta2 = theta1 + Math.PI;

      halfPts1.push(new Complex(r * Math.cos(theta1), r * Math.sin(theta1)));
      halfPts2.push(new Complex(r * Math.cos(theta2), r * Math.sin(theta2)));
    }

    // ──── 1) 半角度ステップ：第1ブランチだけを描く ────
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawPts(ctx, prevSqrtPts, cx, cy, scale, '#fff', DOT_DIAMETER);
    drawPts(ctx, halfPts1,    cx, cy, scale, 'yellow', DOT_DIAMETER);
    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：半角度ステップ（1本目） =====
1) w - c を計算  
2) φ = arg(w - c) → θ₁ = φ/2  
3) 半径 r = |w - c| → 黄色：(r, θ₁) を表示`
    );
    await sleepWithPause(pauseMs);

    // ──── 2) 半角度ステップ：第2ブランチ（反転コピー）を描く ────
    drawPts(ctx, halfPts2, cx, cy, scale, 'yellow', DOT_DIAMETER);
    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：半角度ステップ（反転コピー） =====
4) 反転コピー角度 θ₂ = θ₁ + π  
5) 黄色：(r, θ₂) を追加描画
\n`
    );
    await sleepWithPause(pauseMs);

    // ──── 3) 内側収縮ステップ：sqrtPts を計算・描画 ────
    const sqrtPts = halfPts1.concat(halfPts2).map(z => {
      const r_half = z.abs();
      const sqrtR = Math.sqrt(r_half);
      const theta = Math.atan2(z.im, z.re);
      return new Complex(sqrtR * Math.cos(theta), sqrtR * Math.sin(theta));
    });

    // 画面をクリアせずに「白 + 黄 + ピンク」を重ね描き
    drawPts(ctx, prevSqrtPts,         cx, cy, scale, '#fff', DOT_DIAMETER);
    drawPts(ctx, halfPts1.concat(halfPts2), cx, cy, scale, 'yellow', DOT_DIAMETER);
    drawPts(ctx, sqrtPts,              cx, cy, scale, '#FF69B4', DOT_DIAMETER);
    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：内側収縮ステップ =====
6) 半角度で得られた点 (r, θ) を r' = √r, θ のままに変換  
7) ピンク：(√r, θ) をすべて重ね描き
\n`
    );
    await sleepWithPause(pauseMs);

    // ──── 4) ピンクを白にリカラー ────
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawPts(ctx, sqrtPts, cx, cy, scale, '#fff', DOT_DIAMETER);
    drawIterationCount(ctx, iter, c);
    updateFormula(
`===== 世代 ${String(iter).padStart(3, '0')}：ピンク→白リカラー =====
8) ピンクで描いた (√r, θ) をすべて白に置き換える  
9) 次世代へ向けてリセット
\n`
    );
    await sleepWithPause(pauseMs);

    // ──── 5) 次世代に向けて真っ黒にクリアし、更新 ────
    // ── ここを「最終世代(maxIter) ならクリアせずにスキップ」するよう変更 ──
    if (iter < maxIter) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      prevSqrtPts = sqrtPts.slice();
      wPoints = sqrtPts.slice();
    }
    // ── もし iter === maxIter のときは、ここでクリアせずにループを抜けるので、
    //     最後に描画された白点のままキャンバスが残ります。
  }

  // 全世代終了後
  updateFormula("===== 完了 =====\n全世代の逆写像を終了しました。\n\n\n");
}
