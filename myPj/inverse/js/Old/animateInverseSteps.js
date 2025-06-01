// js/animateInverseSteps.js
import { Complex } from './complex.js';
import { drawUnitCircle } from './drawCircle.js';

/**
 * ２段階ずつ世代的にアニメーションする例
 *
 * - drawUnit: 単位円を描くステップ
 * - drawAngle: 角度だけ半分にした輪郭を描くステップ
 * - drawSqrt: 半径を √ した輪郭を描くステップ
 * - 次世代に進む → repeat
 *
 * options:
 *  - samples: サンプリング数
 *  - delay: ステップ間の待ち時間 (ms)
 */
export function animateInverseProcess(canvasId, cRe, cIm, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const scale = options.scale ?? 200;
  const samples = options.samples ?? 360;
  const delay   = options.delay ?? 800;

  let generation = 0;
  let stage = 0;
  const maxGen = options.maxGen ?? 5;
  const c = new Complex(cRe, cIm);

  // 現在描画すべき極点リストを保持。最初は「単位円」のため、w_i = e^{i θ_i} のみ。
  let currentWs = []; 
  for (let i = 0; i <= samples; i++) {
    const θ = (i / samples) * 2 * Math.PI;
    currentWs.push(new Complex(Math.cos(θ), Math.sin(θ)));
  }

  // 画面クリア＆背景を黒に
  function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
  }

  // 1) 単位円を薄いグレーで描く
  function drawUnit() {
    drawUnitCircle(ctx, cx, cy, scale, 'rgba(128,128,128,0.5)', samples);
  }

  // 2) 角度だけ半分にした輪郭を描く（color は世代で変えてもよい）
  function drawAngle() {
    ctx.strokeStyle = `hsla(${generation * 60}, 80%, 60%, 0.8)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    currentWs.forEach((w, i) => {
      const diff = w.sub(c);
      let φ = Math.atan2(diff.im, diff.re);
      if (φ < 0) φ += 2 * Math.PI;
      const newAngle = φ / 2;
      const r1 = diff.abs();
      const x1 = r1 * Math.cos(newAngle);
      const y1 = r1 * Math.sin(newAngle);
      const px1 = cx + x1 * scale;
      const py1 = cy - y1 * scale;
      if (i === 0) ctx.moveTo(px1, py1);
      else       ctx.lineTo(px1, py1);
    });
    ctx.stroke();
  }

  // 3) 半径を √ した輪郭を描く
  function drawSqrt() {
    ctx.strokeStyle = `hsla(${generation * 60}, 80%, 40%, 0.8)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    currentWs.forEach((w, i) => {
      const diff = w.sub(c);
      let φ = Math.atan2(diff.im, diff.re);
      if (φ < 0) φ += 2 * Math.PI;
      const newAngle = φ / 2;
      const r2 = Math.sqrt(diff.abs());
      const x2 = r2 * Math.cos(newAngle);
      const y2 = r2 * Math.sin(newAngle);
      const px2 = cx + x2 * scale;
      const py2 = cy - y2 * scale;
      if (i === 0) ctx.moveTo(px2, py2);
      else       ctx.lineTo(px2, py2);
    });
    ctx.stroke();
  }

  // 4) 次世代用の currentWs を更新：すでに「θ半分→√」を行った newWs を生成する
  function prepareNextGeneration() {
    const nextWs = [];
    currentWs.forEach(w => {
      const diff = w.sub(c);
      let φ = Math.atan2(diff.im, diff.re);
      if (φ < 0) φ += 2 * Math.PI;
      const newAngle = φ / 2;
      const r2 = Math.sqrt(diff.abs());
      // 計算後の最終点
      const newX = r2 * Math.cos(newAngle);
      const newY = r2 * Math.sin(newAngle);
      nextWs.push(new Complex(newX, newY));
    });
    currentWs = nextWs;
  }

  function step() {
    clearCanvas();
    if (stage === 0) {
      // ① 単位円だけ描く
      drawUnit();
      stage = 1;
      setTimeout(step, delay);
    }
    else if (stage === 1) {
      // ② 現在の currentWs （最初は円周）を「θ半分」だけ描く
      drawAngle();
      stage = 2;
      setTimeout(step, delay);
    }
    else if (stage === 2) {
      // ③ 同じ currentWs を「√」まで適用して描く
      drawSqrt();
      stage = 3;
      setTimeout(step, delay);
    }
    else if (stage === 3) {
      // 次世代準備
      if (generation >= maxGen) return; // 終了
      prepareNextGeneration();
      generation++;
      stage = 1; // 次世代の「θ半分」から始める
      setTimeout(step, delay);
    }
  }

  step();
}
