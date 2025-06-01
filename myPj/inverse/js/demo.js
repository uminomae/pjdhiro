// js/demo.js

import { Complex } from './complex.js';

// ── 設定 ──
const canvas = document.getElementById('demo-canvas');
const ctx    = canvas.getContext('2d');
const cx     = canvas.width / 2;
const cy     = canvas.height / 2;
const scale  = 150;       // 1単位→150px
const DOT_DIAMETER = 6;   // ドット直径(px)

// 再生・一時停止用
let isPaused = false;
const resumeResolvers = [];

async function sleepWithPause(ms) {
  const interval = 50;
  let elapsed = 0;
  while (elapsed < ms) {
    if (isPaused) {
      await new Promise(res => resumeResolvers.push(res));
    }
    const wait = Math.min(interval, ms - elapsed);
    await new Promise(res => setTimeout(res, wait));
    elapsed += wait;
  }
}

function pauseAnimation() {
  isPaused = true;
}
function resumeAnimation() {
  if (!isPaused) return;
  isPaused = false;
  while (resumeResolvers.length) {
    const res = resumeResolvers.shift();
    res();
  }
}

function drawInfo(ctx, angles, rs) {
  ctx.font = `16px monospace`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';

  if (angles.length > 0 && rs.length > 0) {
    const theta = angles[0];
    const r     = rs[0];
    const deg   = (theta * 180 / Math.PI).toFixed(1);
    ctx.fillText(`θ₀=${deg}°`, canvas.width - 10, 10);
    ctx.fillText(`r₀=${r.toFixed(2)}`, canvas.width - 10, 28);
  }
}

function drawCInfo(ctx, c, iter) {
  const fontSize = 16;
  const fontFamily = 'monospace';
  const cre = c.re.toFixed(3);
  const cim = c.im.toFixed(3);
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#0f0';
  ctx.fillText(`cRe=${cre}`, canvas.width - 10, 48);
  ctx.fillText(`cIm=${cim}`, canvas.width - 10, 64);
  ctx.fillStyle = '#fff';
  ctx.fillText(`iter=${String(iter).padStart(3, '0')}`, canvas.width - 10, 80);
}

/**
 * ステップ１：直交座標で線形補間 (w → w - c)
 * 補間中は毎フレームクリアして描画し、最終的なオレンジドットは消します。
 */
async function step1_subtract(
  parentPts, diffPts,
  steps, pauseMs,
  origPhis, origRs,
  c, iter
) {
  const N = parentPts.length;
  for (let k = 1; k <= steps; k++) {
    if (isPaused) {
      await new Promise(res => resumeResolvers.push(res));
    }
    const t = k / steps;

    // (1) クリア
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // (2) 親点を白で描く
    ctx.fillStyle = '#fff';
    for (let i = 0; i < N; i++) {
      const p = parentPts[i];
      const px = cx + p.re * scale;
      const py = cy - p.im * scale;
      ctx.beginPath();
      ctx.arc(px, py, DOT_DIAMETER / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // (3) 差分点をオレンジで補間表示
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

    // (4) 右上情報表示
    drawInfo(ctx, origPhis, origRs);
    drawCInfo(ctx, c, iter);

    await sleepWithPause(pauseMs / steps);
  }

  // 補間完了後、オレンジドットは消して先に進む
}

/**
 * ステップ２：極座標補間 (diffPts → sqrtPts1) を黄色で実行し、
 *       最終的な黄色ドットだけを残す。
 */
async function step2_sqrt1(
  diffPts, sqrtPts1,
  steps, pauseMs,
  origPhis, origRs,
  c, iter
) {
  const N = diffPts.length;

  // 補間中は毎フレームクリアし、黄色の現在補間中ドットだけを描画
  for (let k = 1; k <= steps; k++) {
    if (isPaused) {
      await new Promise(res => resumeResolvers.push(res));
    }
    const t = k / steps;

    // (1) クリア
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // (2) 親点 (diffPts) を白で描く
    ctx.fillStyle = '#fff';
    for (let i = 0; i < N; i++) {
      const z = diffPts[i];
      const px = cx + z.re * scale;
      const py = cy - z.im * scale;
      ctx.beginPath();
      ctx.arc(px, py, DOT_DIAMETER / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // (3) 黄色で極座標補間 (diffPts → sqrtPts1)
    ctx.fillStyle = 'yellow';
    for (let i = 0; i < N; i++) {
      // diffPts[i] の極座標 (r0, φ0)
      let z0 = diffPts[i];
      let φ0 = Math.atan2(z0.im, z0.re);
      if (φ0 < 0) φ0 += 2 * Math.PI;
      let r0 = z0.abs();
      // sqrtPts1[i] の極座標 (r1, φ1)
      let z1 = sqrtPts1[i];
      let φ1 = Math.atan2(z1.im, z1.re);
      if (φ1 < 0) φ1 += 2 * Math.PI;
      let r1 = z1.abs();
      // φ の差分を最短に調整
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

    // (4) 右上情報
    drawInfo(ctx, origPhis, origRs);
    drawCInfo(ctx, c, iter);

    await sleepWithPause(pauseMs / steps);
  }

  // 補間完了後、黄色の最終ドット(sqrtPts1)を白背景に残すために描画
  // → 次ステップでピンクを重ねるので、ここでは黄色いまま“残す”
  //  つまりキャンバスをクリアせずに、sqrtPts1 をそのまま描き続ける
  ctx.fillStyle = 'yellow';
  for (let i = 0; i < N; i++) {
    const z = sqrtPts1[i];
    const px = cx + z.re * scale;
    const py = cy - z.im * scale;
    ctx.beginPath();
    ctx.arc(px, py, DOT_DIAMETER / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * ステップ３：極座標補間 (diffPts → sqrtPts2) をピンクで実行し、
 *       最終的なピンクドットだけを黄色を保持しつつ残す。
 */
async function step3_sqrt2(
  diffPts, sqrtPts2,
  steps, pauseMs,
  origPhis, origRs,
  c, iter,
  sqrtPts1  // 先に残している黄色ドットを保持するために受け取る
) {
  const N = diffPts.length;

  for (let k = 1; k <= steps; k++) {
    if (isPaused) {
      await new Promise(res => resumeResolvers.push(res));
    }
    const t = k / steps;

    // (1) クリア
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // (2) 先に残す「黄色ドット (sqrtPts1)」を描画
    ctx.fillStyle = 'yellow';
    for (let i = 0; i < N; i++) {
      const z = sqrtPts1[i];
      const px = cx + z.re * scale;
      const py = cy - z.im * scale;
      ctx.beginPath();
      ctx.arc(px, py, DOT_DIAMETER / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // (3) ピンクで極座標補間 (diffPts → sqrtPts2)
    ctx.fillStyle = '#FF69B4';
    for (let i = 0; i < N; i++) {
      let z0 = diffPts[i];
      let φ0 = Math.atan2(z0.im, z0.re);
      if (φ0 < 0) φ0 += 2 * Math.PI;
      let r0 = z0.abs();
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

    // (4) 右上情報
    drawInfo(ctx, origPhis, origRs);
    drawCInfo(ctx, c, iter);

    await sleepWithPause(pauseMs / steps);
  }

  // 補間完了後、黄色(①解)＋ピンク(②解)をそのまま残す
  // → この時点で「黄色ドット(sqrtPts1)」は既に描画されているので、
  //    ここではピンクだけを描けばよい
  ctx.fillStyle = '#FF69B4';
  for (let i = 0; i < N; i++) {
    const z = sqrtPts2[i];
    const px = cx + z.re * scale;
    const py = cy - z.im * scale;
    ctx.beginPath();
    ctx.arc(px, py, DOT_DIAMETER / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * 全体の流れ
 */
async function startInverseSteps() {
  // (A) 単位円上に N 点を生成
  const N = 120;
  const parentPts = [];
  const phis = [];
  const rs = [];
  for (let i = 0; i < N; i++) {
    const theta = (2 * Math.PI / N) * i;
    const r = 1.0;
    parentPts.push(new Complex(r * Math.cos(theta), r * Math.sin(theta)));
    phis.push(theta);
    rs.push(r);
  }

  // Julia 定数 c と世代番号
  const c = new Complex(-0.8, 0.156);
  const iter = 1;

  // (B) 1) 引き算ステップ: parentPts → diffPts
  const diffPts = parentPts.map(z => z.sub(c));
  const diffPhis = diffPts.map(z => {
    let φ = Math.atan2(z.im, z.re);
    if (φ < 0) φ += 2 * Math.PI;
    return φ;
  });
  const diffRs = diffPts.map(z => z.abs());

  const STEPS = 40;
  const PAUSE = 1000;

  // 1) オレンジで補間し、最終的なオレンジは消す
  await step1_subtract(
    parentPts,
    diffPts,
    STEPS,
    PAUSE,
    phis,
    rs,
    c,
    iter
  );

  // (C) 2) 第①解: diffPts → sqrtPts1 を黄色で補間し、最終的な黄色だけを残す
  const sqrtPts1 = [];
  for (let i = 0; i < N; i++) {
    const φ = diffPhis[i];
    const r = diffRs[i];
    const φ_half = φ / 2;
    const sqrtR = Math.sqrt(r);
    sqrtPts1.push(new Complex(
      sqrtR * Math.cos(φ_half),
      sqrtR * Math.sin(φ_half)
    ));
  }
  await step2_sqrt1(
    diffPts,
    sqrtPts1,
    STEPS,
    PAUSE,
    diffPhis,
    diffRs,
    c,
    iter
  );
  // この時点で「黄色ドット（sqrtPts1）」がキャンバスに残っている

  // (D) 3) 第②解: diffPts → sqrtPts2 をピンクで補間し、
  //    黄色ドットを保持しつつ、最終的なピンクだけを残す
  const sqrtPts2 = [];
  for (let i = 0; i < N; i++) {
    const φ = diffPhis[i];
    const r = diffRs[i];
    const φ_half = φ / 2 + Math.PI;
    const sqrtR  = Math.sqrt(r);
    sqrtPts2.push(new Complex(
      sqrtR * Math.cos(φ_half),
      sqrtR * Math.sin(φ_half)
    ));
  }
  await step3_sqrt2(
    diffPts,
    sqrtPts2,
    STEPS,
    PAUSE,
    diffPhis,
    diffRs,
    c,
    iter,
    sqrtPts1  // すでに残している黄色ドットを渡す
  );
  // この時点で「黄色ドット(sqrtPts1) + ピンクドット(sqrtPts2)」がキャンバスに残っている

  // (E) 4) 白リカラー：黄色＋ピンクを消して白で最終形を描く
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  for (let i = 0; i < N; i++) {
    // 第①解 (sqrtPts1)
    const z1 = sqrtPts1[i];
    const px1 = cx + z1.re * scale;
    const py1 = cy - z1.im * scale;
    ctx.beginPath();
    ctx.arc(px1, py1, DOT_DIAMETER / 2, 0, 2 * Math.PI);
    ctx.fill();
    // 第②解 (sqrtPts2)
    const z2 = sqrtPts2[i];
    const px2 = cx + z2.re * scale;
    const py2 = cy - z2.im * scale;
    ctx.beginPath();
    ctx.arc(px2, py2, DOT_DIAMETER / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  drawInfo(ctx, diffPhis, diffRs);
  drawCInfo(ctx, c, iter);
}

// ボタンに紐付け
document.getElementById('start-btn').addEventListener('click', async () => {
  isPaused = false;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await startInverseSteps();
});
document.getElementById('pause-btn').addEventListener('click', () => {
  pauseAnimation();
});
document.getElementById('resume-btn').addEventListener('click', () => {
  resumeAnimation();
});
