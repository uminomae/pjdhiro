// js/3d/d3-ui-controller.js（リファクタリング後）

import { Complex } from '../util/complex-number.js';
// ① 設定値をインポート
import { FORM_DEFAULTS, DRAW_PARAMS, LEGEND_DEFAULT } from './d3-config.js';

import {
  initThree,
  animateLoop,
  runInverseAnimation,
  scene
} from './d3-renderer.js';

// legend.js から必要な関数群をインポート
import { drawLegend, showLegend, hideLegend } from '../util/legend.js';

// ─── グローバルフラグ ───
window.isRunning = false;
window.isPaused  = false;
window.isStopped = false;

// ─── Three.js 初期化 ───
initThree();
animateLoop();

// ─── DOM 要素取得 ───
const inputRe   = document.getElementById('input-re');
const inputIm   = document.getElementById('input-im');
const inputN    = document.getElementById('input-n');
const inputIter = document.getElementById('input-iter');
const btnRun    = document.getElementById('btn-run');
const btnPause  = document.getElementById('btn-pause');
const btnStop   = document.getElementById('btn-stop');
const chkLegend = document.getElementById('chk-legend');
const status    = document.getElementById('status');

// ─── 初期フォームにデフォルト値をセット ───
inputRe.value   = FORM_DEFAULTS.re;
inputIm.value   = FORM_DEFAULTS.im;
inputN.value    = FORM_DEFAULTS.N;
inputIter.value = FORM_DEFAULTS.maxIter;

// ─── Runボタンイベント（凡例再描画含む） ───
btnRun.addEventListener('click', async () => {
  if (!window.isRunning) {
    window.isRunning = true;
    window.isPaused  = false;
    window.isStopped = false;

    btnRun.classList.add('d-none');
    btnPause.classList.remove('d-none');

    // フォームからの値取得
    const cre     = parseFloat(inputRe.value);
    const cim     = parseFloat(inputIm.value);
    const c       = new Complex(cre, cim);
    const N       = parseInt(inputN.value, 10);
    const maxIter = parseInt(inputIter.value, 10);

    status.textContent = '(実行中…)';
    try {
      // ② interval も設定値から参照
      const { minZ, maxZ, totalPoints } = await runInverseAnimation(
        c,
        N,
        maxIter,
        DRAW_PARAMS.interval
      );
      window.isRunning = false;

      btnPause.classList.add('d-none');
      btnPause.textContent = 'Pause';
      btnRun.textContent   = 'Run';
      btnRun.classList.remove('d-none');

      status.textContent = `(完了: N=${N}, maxIter=${maxIter}, 点数=${totalPoints})`;

      // ③ 凡例再描画：minZ/maxZ は戻り値を利用
      drawLegend(minZ, maxZ);
    } catch (err) {
      window.isRunning = false;
      btnPause.classList.add('d-none');
      btnPause.textContent = 'Pause';
      btnRun.textContent   = 'Run';
      btnRun.classList.remove('d-none');
      status.textContent = '(Stopped)';
    }
  } else if (window.isPaused) {
    window.isPaused = false;
    btnPause.textContent = 'Pause';
    status.textContent   = '(実行中…)';
  }
});

// ─── Pause/Resume ───
btnPause.addEventListener('click', () => {
  if (!window.isPaused) {
    window.isPaused = true;
    btnPause.textContent = 'Resume';
    status.textContent   = '(Paused)';
  } else {
    window.isPaused = false;
    btnPause.textContent = 'Pause';
    status.textContent   = '(実行中…)';
  }
});

// ─── Stop ───
btnStop.addEventListener('click', () => {
  window.isStopped = true;
  window.isPaused  = false;
  window.isRunning = false;

  // シーン上の Points（点群）をクリア
  const toRemove = [];
  scene.traverse(obj => {
    if (obj.isPoints) toRemove.push(obj);
  });
  toRemove.forEach(p => scene.remove(p));

  btnPause.classList.add('d-none');
  btnPause.textContent = 'Pause';
  btnRun.textContent   = 'Run';
  btnRun.classList.remove('d-none');
  status.textContent = '(待機中)';

  // ④ 凡例をデフォルトに戻す
  drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);

  // ⑤ フォーム項目を設定値のデフォルトに戻す
  inputRe.value   = FORM_DEFAULTS.re;
  inputIm.value   = FORM_DEFAULTS.im;
  inputN.value    = FORM_DEFAULTS.N;
  inputIter.value = FORM_DEFAULTS.maxIter;
});

// ─── 凡例の表示/非表示スイッチ ───
chkLegend.addEventListener('change', () => {
  if (chkLegend.checked) {
    showLegend();
  } else {
    hideLegend();
  }
});

// グローバルにエクスポート（他モジュールが利用できるように）
window.runInverseAnimation = runInverseAnimation;
window.scene               = scene;
window.Complex             = Complex;
window.drawLegend          = drawLegend;
