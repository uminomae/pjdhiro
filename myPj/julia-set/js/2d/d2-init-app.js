// ファイル: js/2d/d2-init-app.js

import { AppConfig } from './d2-config.js';
import { Complex } from '../util/complex-number.js';
import { generateCirclePoints } from '../util/generate-circle.js';
import { animateInverseWithPause } from './d2-Inverse-animate.js';
import { pauseAnimation, resumeAnimation } from './modules/d2-pause-controller.js';

export function initApp() {
  const canvas = document.getElementById('inverse-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  // ── 設定ファイルから scale を取得 ──
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const scale = AppConfig.defaultScale;

  // フォーム要素取得
  const cReInput     = document.getElementById('cRe');
  const cImInput     = document.getElementById('cIm');
  const samplesInput = document.getElementById('samples');
  const maxIterInput = document.getElementById('maxIter');
  const pauseMsInput = document.getElementById('pauseMs');
  // ボタン取得
  const startBtn  = document.getElementById('start-btn');
  const pauseBtn  = document.getElementById('pause-btn');
  const resumeBtn = document.getElementById('resume-btn');

  // ── ここから追加 ──
  // AppConfig の値をフォームにセット
  cReInput.value     = AppConfig.defaultCRe;
  cImInput.value     = AppConfig.defaultCIm;
  samplesInput.value = AppConfig.defaultSamples;
  maxIterInput.value = AppConfig.defaultMaxIter;
  pauseMsInput.value = AppConfig.defaultPauseMsInput;
  // ── ここまで追加 ──

  let animationStarted = false;

  async function onStartClick() {
    if (animationStarted) return;

    const cRe     = parseFloat(cReInput.value);
    const cIm     = parseFloat(cImInput.value);
    const samples = parseInt(samplesInput.value, 10);
    const maxIter = parseInt(maxIterInput.value, 10);
    const pauseMs = parseInt(pauseMsInput.value, 10);

    if ([cRe, cIm, samples, maxIter, pauseMs].some(v => isNaN(v))) {
      alert('パラメータを正しく入力してください。');
      return;
    }

    animationStarted = true;
    startBtn.disabled = true;

    const c = new Complex(cRe, cIm);
    const initPts = generateCirclePoints(samples);
    const interpSteps = AppConfig.defaultInterpSteps; // 10

    await animateInverseWithPause(
      ctx,
      cx,
      cy,
      scale,
      c,
      initPts,
      maxIter,
      pauseMs,
      interpSteps
    );
  }

  function onPauseClick() {
    pauseAnimation();
  }
  function onResumeClick() {
    resumeAnimation();
  }

  startBtn.addEventListener('click', onStartClick);
  pauseBtn.addEventListener('click', onPauseClick);
  resumeBtn.addEventListener('click', onResumeClick);
}
