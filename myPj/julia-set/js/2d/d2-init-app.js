// ファイル: js/2d/d2-init-app.js

import { AppConfig }               from './d2-config.js';
import { Complex }                 from '../util/complex-number.js';
import { generateCirclePoints }    from '../util/generate-circle.js';
import { animateInverseWithPause } from './d2-inverse-animate.js';
import { pauseAnimation, resumeAnimation } from './modules/d2-pause-controller.js';
// js/3d/d3-init-app.js
import './ui/button-ui.js';
import { initLegendToggle } from './ui/legend-ui.js';

/**
 * 各種 DOM 要素と状態フラグをまとめたオブジェクト
 */
const elements = {
  // Canvas 関連
  canvas:     null,
  ctx:        null,

  // フォーム入力欄
  cReInput:     null,
  cImInput:     null,
  samplesInput: null,
  maxIterInput: null,
  pauseMsInput: null,

  // コントロールボタン
  playBtn:   null,
  pauseBtn:  null,
  resumeBtn: null,
  resetBtn:  null,
};

const state = {
  animationStarted: false,
  isPaused:         false,
  shouldStop:       false,
};

/**
 * DOM 要素を一括で取得し、elements オブジェクトに格納する
 */
function bindElements() {
  elements.canvas       = document.getElementById('inverse-canvas');
  if (!elements.canvas) return false;

  elements.ctx          = elements.canvas.getContext('2d');

  elements.cReInput     = document.getElementById('cRe');
  elements.cImInput     = document.getElementById('cIm');
  elements.samplesInput = document.getElementById('samples');
  elements.maxIterInput = document.getElementById('maxIter');
  elements.pauseMsInput = document.getElementById('pauseMs');

  elements.playBtn   = document.getElementById('play-btn');
  elements.pauseBtn  = document.getElementById('pause-btn');
  elements.resumeBtn = document.getElementById('resume-btn');
  elements.resetBtn  = document.getElementById('reset-btn');

  return true;
}

/**
 * フォーム欄にデフォルト値をセットする
 */
function setDefaultFormValues() {
  elements.cReInput.value     = AppConfig.defaultCRe;
  elements.cImInput.value     = AppConfig.defaultCIm;
  elements.samplesInput.value = AppConfig.defaultSamples;
  elements.maxIterInput.value = AppConfig.defaultMaxIter;
  elements.pauseMsInput.value = AppConfig.defaultPauseMsInput;
}

/**
 * 各ボタンの初期状態を設定する
 */
function updateButtonStates({ play, pause, resume, reset }) {
  elements.playBtn.disabled   = !play;
  elements.pauseBtn.disabled  = !pause;
  elements.resumeBtn.disabled = !resume;
  elements.resetBtn.disabled  = !reset;
}

/**
 * キャンバスとフォームを「完全に」初期状態に戻し、
 * state のフラグだけリセットする（shouldStop はリセットしない）
 */
function resetCanvasAndForm() {
  const { canvas, ctx, cReInput, cImInput, samplesInput, maxIterInput, pauseMsInput } = elements;

  // (1) キャンバスを真っさらに
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // (2) フォームをデフォルト値に戻す
  cReInput.value     = AppConfig.defaultCRe;
  cImInput.value     = AppConfig.defaultCIm;
  samplesInput.value = AppConfig.defaultSamples;
  maxIterInput.value = AppConfig.defaultMaxIter;
  pauseMsInput.value = AppConfig.defaultPauseMsInput;

  // (3) 各種フラグをリセット（shouldStop は維持する）
  state.animationStarted = false;
  state.isPaused         = false;
}

/**
 * Play ボタン押下時の処理
 */
async function onPlayClick() {
  if (state.animationStarted) return;

  const cReVal     = parseFloat(elements.cReInput.value);
  const cImVal     = parseFloat(elements.cImInput.value);
  const samplesVal = parseInt(elements.samplesInput.value, 10);
  const maxIterVal = parseInt(elements.maxIterInput.value, 10);
  const pauseMsVal = parseInt(elements.pauseMsInput.value, 10);

  // 入力チェック
  if ([cReVal, cImVal, samplesVal, maxIterVal, pauseMsVal].some(v => isNaN(v))) {
    alert('パラメータを正しく入力してください。');
    return;
  }

  // フラグを更新し、ボタン UI を切り替え
  state.animationStarted = true;
  state.shouldStop       = false;
  updateButtonStates({ play: false, pause: true, resume: false, reset: true });

  // Julia 定数および初期点群を作成
  const c       = new Complex(cReVal, cImVal);
  const initPts = generateCirclePoints(samplesVal);
  const interpSteps = AppConfig.defaultInterpSteps;

  // アニメーション本体を呼び出す
  await animateInverseWithPause(
    elements.ctx,
    elements.canvas.width / 2,
    elements.canvas.height / 2,
    AppConfig.defaultScale,
    c,
    initPts,
    maxIterVal,
    pauseMsVal,
    interpSteps,
    () => state.shouldStop
  );

  // アニメーションが完了または途中で中断された
  state.animationStarted = false;
  updateButtonStates({ play: true, pause: false, resume: false, reset: true });
}

/**
 * Pause ボタン押下時の処理
 */
function onPauseClick() {
  if (!state.animationStarted || state.isPaused) return;
  state.isPaused = true;
  pauseAnimation();
  updateButtonStates({ play: false, pause: false, resume: true, reset: true });
}

/**
 * Resume ボタン押下時の処理
 */
function onResumeClick() {
  if (!state.animationStarted || !state.isPaused) return;
  state.isPaused = false;
  resumeAnimation();
  updateButtonStates({ play: false, pause: true, resume: false, reset: true });
}

/**
 * Reset ボタン押下時の処理
 */
function onResetClick() {
  // どんな状態でも shouldStop フラグを立てる
  state.shouldStop = true;
  if (state.isPaused) {
    resumeAnimation();  // pause 中だったら resume して内部の sleep を解除
    state.isPaused = false;
  }

  // キャンバス／フォームだけ初期化
  resetCanvasAndForm();
  updateButtonStates({ play: true, pause: false, resume: false, reset: true });
}

/**
 * アプリ初期化。DOMContentLoaded 後に呼び出されるべき。
 */
export function initApp() {
  if (!bindElements()) {
    console.error('[initApp] Canvas 要素が見つかりません。');
    return;
  }

  // フォーム初期値とボタン状態を設定
  setDefaultFormValues();
  updateButtonStates({ play: true, pause: false, resume: false, reset: true });

  // 各種イベント登録
  elements.playBtn.addEventListener('click', onPlayClick);
  elements.pauseBtn.addEventListener('click', onPauseClick);
  elements.resumeBtn.addEventListener('click', onResumeClick);
  elements.resetBtn.addEventListener('click', onResetClick);
}

  // ────────────── ここから追加 ──────────────

// 「設定完了」ボタンをクリックしたときの処理
const configCompleteBtn = document.getElementById('config-complete-btn');
if (configCompleteBtn) {
  configCompleteBtn.addEventListener('click', () => {
    // 1) 進行中のアニメーションを止める（state.shouldStop を true にするなど）
    state.shouldStop = true;
    state.animationStarted = false;
    // もし pause 状態だったら解除しておく
    state.isPaused = false;

   // 2) キャンバスだけクリア（描画をリセット）
   const canvas = elements.canvas;
   const ctx    = elements.ctx;
   ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 3) フォームの現在値を読み込んで、内部パラメータを更新する
    // （次に Play が押されたときにこの値が使われるようにする）
    AppConfig.currentCRe     = parseFloat(elements.cReInput.value);
    AppConfig.currentCIm     = parseFloat(elements.cImInput.value);
    AppConfig.currentSamples = parseInt(elements.samplesInput.value,  10);
    AppConfig.currentMaxIter = parseInt(elements.maxIterInput.value, 10);
    AppConfig.currentPauseMs = parseInt(elements.pauseMsInput.value,  10);

    // 3) Play ボタンを有効化し、ほかのボタンを無効化または適切に設定
    updateButtonStates({ play: true, pause: false, resume: false, reset: true });

    // Offcanvas は data-bs-dismiss="offcanvas" で自動的に閉じる
  });
}
  // ────────────── ここまで追加 ──────────────

