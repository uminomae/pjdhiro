// js/3d/d3-init-app.js

import { initThree, animateLoop } from './d3-renderer.js';
import { FORM_DEFAULTS, LEGEND_DEFAULT } from './d3-config.js';

// UI イベント登録用：button-ui.js（ボタン全般）と legend-ui.js（凡例トグル）
import './ui/button-ui.js';
import { initLegendToggle } from './ui/legend-ui.js';

/**
 * フォームの初期値 (Re, Im, N, maxIter, チェックボックス) をセットする
 */
export function initFormValues() {
  const inputRe   = document.getElementById('input-re');
  const inputIm   = document.getElementById('input-im');
  const inputN    = document.getElementById('input-n');
  const inputIter = document.getElementById('input-iter');
  const chkLegend = document.getElementById('chk-legend');

  if (inputRe)   inputRe.value   = FORM_DEFAULTS.re;
  if (inputIm)   inputIm.value   = FORM_DEFAULTS.im;
  if (inputN)    inputN.value    = FORM_DEFAULTS.N;
  if (inputIter) inputIter.value = FORM_DEFAULTS.maxIter;
  if (chkLegend) chkLegend.checked = true;  // デフォルトで凡例 ON
}

/**
 * Three.js シーンを初期化し、レンダーループを開始する
 */
export function init3DSceneAndLoop() {
  initThree();
  animateLoop();
}

/**
 * 初期表示時の凡例の描画／非描画を行う
 */
export function initLegend() {
  const chkLegend = document.getElementById('chk-legend');
  if (chkLegend && chkLegend.checked) {
    // drawLegend は legend.js から import していないので、動的 import で呼び出す
    import('./ui/d3-legend-sub.js').then(({ drawLegend, showLegend }) => {
      showLegend();  // まず表示させる
      drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
    });
  } else {
    import('./ui/d3-legend-sub.js').then(({ hideLegend }) => {
      hideLegend();
    });
  }
}

// ─── モジュールが読み込まれたら即実行 ───
(function() {
  // 1) フォームの初期値をセット
  initFormValues();

  // 2) Three.js シーンの初期化とレンダーループ起動
  init3DSceneAndLoop();

  // 3) 初期凡例の描画／非描画
  initLegend();

  // 4) Offcanvas 内のチェックボックスにイベントをバインド
  initLegendToggle();
})();
