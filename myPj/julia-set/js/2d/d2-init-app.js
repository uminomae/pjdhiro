// ファイル: js/2d/d2-init-app.js

import { AppConfig }               from './d2-config.js';
import { Complex }                 from '../util/complex-number.js';
import { generateCirclePoints }    from '../util/generate-circle.js';
import { animateInverseWithPause } from './d2-inverse-animate.js';
import { pauseAnimation, resumeAnimation, pauseCtrl } from './modules/d2-pause-controller.js';

// アニメーション中断用のフラグ
let shouldStop = false;

export function initApp() {
  console.log('[initApp] start');
  const canvas = document.getElementById('inverse-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const scale = AppConfig.defaultScale;

  // フォーム要素を取得
  const cReInput     = document.getElementById('cRe');
  const cImInput     = document.getElementById('cIm');
  const samplesInput = document.getElementById('samples');
  const maxIterInput = document.getElementById('maxIter');
  const pauseMsInput = document.getElementById('pauseMs');

  // ボタン要素を取得
  const playBtn   = document.getElementById('play-btn');
  const pauseBtn  = document.getElementById('pause-btn');
  const resumeBtn = document.getElementById('resume-btn');
  const resetBtn  = document.getElementById('reset-btn');

  console.log('[initApp] resetBtn=', resetBtn);
  console.log('[initApp] typeof resetBtn.addEventListener =', typeof resetBtn.addEventListener);

  // ── フォームに AppConfig のデフォルト値をセット ──
  cReInput.value     = AppConfig.defaultCRe;
  cImInput.value     = AppConfig.defaultCIm;
  samplesInput.value = AppConfig.defaultSamples;
  maxIterInput.value = AppConfig.defaultMaxIter;
  pauseMsInput.value = AppConfig.defaultPauseMsInput;

  // ボタンの初期状態：Play/Reset 有効、Pause/Resume は無効
  playBtn.disabled   = false;
  pauseBtn.disabled  = true;
  resumeBtn.disabled = true;
  resetBtn.disabled  = false; // Reset は常に有効にしておく

  let animationStarted = false;
  let isPaused         = false;

  function clearCanvasAndReset() {
    // (1) キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // (2) フォームをデフォルト値に戻す
    cReInput.value     = AppConfig.defaultCRe;
    cImInput.value     = AppConfig.defaultCIm;
    samplesInput.value = AppConfig.defaultSamples;
    maxIterInput.value = AppConfig.defaultMaxIter;
    pauseMsInput.value = AppConfig.defaultPauseMsInput;

    // (3) 各種フラグをリセット
    animationStarted = false;
    isPaused         = false;
    // shouldStop のリセットは削除しました
  }

  async function onPlayClick() {
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
    shouldStop       = false;

    playBtn.disabled   = true;
    pauseBtn.disabled  = false;
    resumeBtn.disabled = true;
    // resetBtn.disabled  = true;  // 削除：Reset は常に有効

    const c           = new Complex(cRe, cIm);
    const initPts     = generateCirclePoints(samples);
    const interpSteps = AppConfig.defaultInterpSteps;

    await animateInverseWithPause(
      ctx, cx, cy, scale,
      c, initPts,
      maxIter, pauseMs, interpSteps,
      () => {
        console.log('[animateInverseWithPause] shouldStopCallback called, shouldStop =', shouldStop);
        return shouldStop;
      }
    );

    // アニメーションが完了または Reset によって中断されたあと
    animationStarted = false;
    playBtn.disabled   = false;
    pauseBtn.disabled  = true;
    resumeBtn.disabled = true;
    resetBtn.disabled  = false; // Reset は常に有効
  }

  function onPauseClick() {
    if (!animationStarted || isPaused) return;
    isPaused = true;
    pauseAnimation();
    pauseBtn.disabled  = true;
    resumeBtn.disabled = false;
  }

  function onResumeClick() {
    if (!animationStarted || !isPaused) return;
    isPaused = false;
    resumeAnimation();
    pauseBtn.disabled  = false;
    resumeBtn.disabled = true;
  }

  function onResetClick() {
    console.log('[onResetClick] Reset ボタンが押されました。animationStarted =', animationStarted, ', isPaused =', isPaused);

    // ── いつでも中断フラグを立てる ──
    shouldStop = true;
    console.log('[onResetClick] shouldStop を true にセットしました');

    // 一時停止中であれば再開して sleep を止める
    if (isPaused) {
      console.log('[onResetClick] isPaused = true なので resumeAnimation() を呼びます');
      resumeAnimation();
      isPaused = false;
    }

    // ── キャンバス／フォームをリセット ──
    clearCanvasAndReset();
    console.log('[onResetClick] clearCanvasAndReset() 後: animationStarted =', animationStarted, ', shouldStop =', shouldStop);

    // ── ボタン状態を初期化 ──
    playBtn.disabled   = false;
    pauseBtn.disabled  = true;
    resumeBtn.disabled = true;
    resetBtn.disabled  = false; // Reset は常に有効
  }

  playBtn.addEventListener('click', onPlayClick);
  pauseBtn.addEventListener('click', onPauseClick);
  resumeBtn.addEventListener('click', onResumeClick);
  resetBtn.addEventListener('click', onResetClick);
}
