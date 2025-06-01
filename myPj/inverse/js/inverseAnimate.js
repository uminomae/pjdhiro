// js/inverseAnimate.js

import { Complex } from './complex.js';

/**
 * 指定ミリ秒だけ待機する Promise を返す
 * @param {number} ms ── 待機時間 (ミリ秒)
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 右上に「現在の世代番号」を描画する関数
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number}                  iter ── 現在の世代 (1 から始まる)
 */
function drawIterationCount(ctx, iter) {
  const padding = 10;
  const fontSize = 24;               // フォントサイズ (px)
  const fontFamily = 'monospace';    // モノスペースで桁幅一定に

  // 3桁表示を想定してゼロ埋めまたはスペースでパディング
  const text = String(iter).padStart(3, '0');

  // テキストのスタイルを指定
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';

  // テキストの幅を取得
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize; // だいたい fontSize と同じ高さ

  // 右上に「背景となる黒半透明の四角」を描いて前の文字を隠す
  const x = ctx.canvas.width - padding;
  const y = padding;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(x - textWidth - 4, y - 2, textWidth + 8, textHeight + 4);

  // 文字色を白にして描画
  ctx.fillStyle = '#fff';
  ctx.fillText(text, x - 4, y);
}

/**
 * 逆写像をステップごとに描画し、各ステップで pause すると同時に
 * 「一世代前(白)＋半角度(黄)＋√(緑)」を表示し、
 * さらに「緑を白に変換して一時停止」した後は真っ黒にして次世代に移行するアニメーション。
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

  // 初期世代(0)として「√後点列」を持っておく (便宜上、単位円自体を prevSqrtPts とする)
  let prevSqrtPts = initPts.slice();

  // 単位円 (白点) を描画
  drawPts(ctx, initPts, cx, cy, scale, '#fff', 2);

  // 右上に「000」として世代 0 を表示（必要なければコメントアウト可）
  drawIterationCount(ctx, 0);

  // 初期描画後、少し待機
  await sleep(pauseMs);

  // 前世代 wPoints は initPts を使う
  let wPoints = initPts.slice();

  // ────────────────── 1世代目～maxIter世代目 を順に繰り返す ──────────────────
  for (let iter = 1; iter <= maxIter; iter++) {
    // ──── 1a) halfPts を作成: φ = arg(w - c), r = |diff| から θ₁=φ/2, θ₂=φ/2+π の２つを生成 ────
    const halfPts = [];
    for (const w of wPoints) {
      const diff = w.sub(c);
      let phi = Math.atan2(diff.im, diff.re);
      if (phi < 0) phi += 2 * Math.PI; // [0, 2π) に正規化
      const r = diff.abs();
      const theta1 = phi / 2;
      const theta2 = theta1 + Math.PI;

      // (r, theta1) → Complex
      halfPts.push(new Complex(r * Math.cos(theta1), r * Math.sin(theta1)));
      // (r, theta2) → Complex
      halfPts.push(new Complex(r * Math.cos(theta2), r * Math.sin(theta2)));
    }

    // ──── 1b) 【半角度ステップ】描画 ────
    // まずキャンバスを黒でクリアし、prevSqrtPts（前世代の最終点）を白で描画
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawPts(ctx, prevSqrtPts, cx, cy, scale, '#fff', 1);

    // その上に現在の halfPts（黄色）を重ね描き
    drawPts(ctx, halfPts, cx, cy, scale, 'yellow', 1);

    // 右上に「現在の世代番号 = iter」を表示
    drawIterationCount(ctx, iter);

    // 停止
    await sleep(pauseMs);

    // ──── 2a) sqrtPts を作成: halfPts 各点 (r, θ) から (√r, θ) を計算 ────
    const sqrtPts = halfPts.map(z => {
      // |z| = r として、√r を計算
      const r_half = z.abs();
      const sqrtR = Math.sqrt(r_half);
      const theta = Math.atan2(z.im, z.re); // z の偏角 (θ₁ または θ₂)
      return new Complex(sqrtR * Math.cos(theta), sqrtR * Math.sin(theta));
    });

    // ──── 2b) 【内側収縮ステップ】描画 ────
    // キャンバスはクリアせず、前世代（白）＋黄色（半角度結果）を保持し、その上に緑を重ねる
    drawPts(ctx, prevSqrtPts, cx, cy, scale, '#fff', 1);
    drawPts(ctx, halfPts, cx, cy, scale, 'yellow', 1);
    drawPts(ctx, sqrtPts, cx, cy, scale, 'green', 1);

    // 右上に「現在の世代番号 = iter」を再表示
    drawIterationCount(ctx, iter);

    // 停止
    await sleep(pauseMs);

    // ──── 3) 【緑を白にリカラー】描画 ────
    // 真っ黒にクリアし、sqrtPts のみを白で描画
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawPts(ctx, sqrtPts, cx, cy, scale, '#fff', 1);

    // 右上に「現在の世代番号 = iter」を表示
    drawIterationCount(ctx, iter);

    // 停止
    await sleep(pauseMs);

    // ──── 次世代へ移る前に改めて真っ黒にクリア ────
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 次世代として sqrtPts を採用
    prevSqrtPts = sqrtPts.slice(); // 今回の sqrtPts が次回の「前世代」になる
    wPoints = sqrtPts.slice();
  }
}
