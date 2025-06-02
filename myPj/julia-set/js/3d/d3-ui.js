// js/3d/d3-ui.js
import { initThree, animateLoop, runInverseAnimation } from './d3-renderer.js';
import { FORM_DEFAULTS, DRAW_PARAMS, LEGEND_DEFAULT } from './d3-config.js';
import { drawLegend, hideLegend } from '../util/legend.js';

// ※ button-ui.js, legend-ui.js を読み込むことでそれぞれのイベント登録を行う
import './ui/button-ui.js';
import './ui/legend-ui.js';

// ─── runInverseAnimation, drawLegend, hideLegend をグローバルに公開 ───
window.runInverseAnimation = runInverseAnimation;
window.drawLegend         = drawLegend;
window.hideLegend         = hideLegend;

// ─── ページ読み込み後に実行する初期化処理 ───
window.addEventListener('DOMContentLoaded', () => {
  // 1) フォームの初期値を config からセット
  const inputRe   = document.getElementById('input-re');
  const inputIm   = document.getElementById('input-im');
  const inputN    = document.getElementById('input-n');
  const inputIter = document.getElementById('input-iter');
  const chkLegend = document.getElementById('chk-legend');

  if (inputRe)   inputRe.value   = FORM_DEFAULTS.re;
  if (inputIm)   inputIm.value   = FORM_DEFAULTS.im;
  if (inputN)    inputN.value    = FORM_DEFAULTS.N;
  if (inputIter) inputIter.value = FORM_DEFAULTS.maxIter;
  if (chkLegend) chkLegend.checked = true; // デフォルトで凡例を ON

  // 2) Three.js シーンを初期化してレンダーループ開始
  initThree();
  animateLoop();

  // 3) チェックボックスのデフォルトに従って凡例を描画 or 非表示
  if (chkLegend && chkLegend.checked) {
    drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
  } else {
    hideLegend();
  }
});
