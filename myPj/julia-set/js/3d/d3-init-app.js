// js/3d/d3-init-app.js

import { initThree, animateLoop } from './d3-renderer.js';
import { FORM_DEFAULTS, LEGEND_DEFAULT } from './d3-config.js';

// UI イベント登録用に button-ui.js と legend-ui.js をインポート
import './ui/button-ui.js';
import './ui/legend-ui.js';

// ページ読み込み後に実行する初期化処理
window.addEventListener('DOMContentLoaded', () => {
  // ── 1) フォームの初期値を config からセット ──
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

  // ── 2) Three.js シーンを初期化してレンダーループ開始 ──
  initThree();
  animateLoop();

  // ── 3) チェックボックスのデフォルトに従って凡例を描画 or 非表示 ──
  if (chkLegend && chkLegend.checked) {
    import('../util/legend.js').then(({ drawLegend }) => {
      drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
    });
  } else {
    import('../util/legend.js').then(({ hideLegend }) => {
      hideLegend();
    });
  }
});
