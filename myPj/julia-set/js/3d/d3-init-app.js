// js/3d/d3-init-app.js

import { initThree, animateLoop } from './d3-renderer.js';
import { FORM_DEFAULTS, LEGEND_DEFAULT } from './d3-config.js';

// UI イベント登録用に：button-ui.js と legend-ui.js をインポート
import './ui/button-ui.js';
import './ui/legend-ui.js';

/**
 * フォームの初期値 (Re, Im, N, maxIter, チェックボックス) をセットする
 */
function initFormValues() {
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
}

/**
 * Three.js シーンを初期化し、レンダーループを開始する
 */
function init3DSceneAndLoop() {
  initThree();
  animateLoop();
}

/**
 * 初期表示時の凡例の ON/OFF を行う
 */
function initLegend() {
  const chkLegend = document.getElementById('chk-legend');
  if (chkLegend && chkLegend.checked) {
    // drawLegend は legend-ui.js 内でインポート済み
    import('../util/legend.js').then(({ drawLegend }) => {
      drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
    });
  } else {
    import('../util/legend.js').then(({ hideLegend }) => {
      hideLegend();
    });
  }
}

// ─── ページ読み込み後に一度だけ実行 ───
// window.addEventListener('DOMContentLoaded', () => {
//   initFormValues();
//   init3DSceneAndLoop();
//   initLegend();
// });
// ─── モジュールが読み込まれたら即実行 ───
(function() {
  // 1) フォーム初期値をセット
  initFormValues();
  // 2) Three.js シーンの初期化とループを開始
  init3DSceneAndLoop();
  // 3) 初期凡例の描画/非描画
  initLegend();
})();