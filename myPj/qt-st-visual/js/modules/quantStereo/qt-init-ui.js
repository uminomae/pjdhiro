// js/modules/quantStereo/qt-init-ui.js

import { UI_DOM_IDS } from './qt-config.js';

/**
 * initUI(context)
 * ────────────────────────────────────────────────────────────
 * ・スライダー (i-scale, k-scale) と
 * ・Next Q ボタン、Top View ボタン
 * ・変数表示 (α,β,γ,δ) などを初期化
 *
 * createAndAddPointCloud は呼び出さない（qt-main.js 側で管理する）
 */
export function initUI({ scene, camera, renderer, controls }) {
  console.log('[qt-init-ui] initUI()');

  // Top View ボタン
  const btnTop = document.getElementById(UI_DOM_IDS.BTN_TOP);
  if (btnTop) {
    btnTop.addEventListener('click', () => {
      console.log('[qt-init-ui] Top View がクリックされました');
      camera.position.set(0, 5, 0);
      camera.up.set(0, 0, -1);
      camera.lookAt(0, 0, 0);
      controls.update();
    });
  }

  // 変数表示 (省略して初期化だけ)
  ['VAL_ALPHA', 'VAL_BETA', 'VAL_GAMMA', 'VAL_DELTA'].forEach((key) => {
    const el = document.getElementById(UI_DOM_IDS[key]);
    if (el) el.textContent = '0.000';
  });

  console.log('[qt-init-ui] initUI() 完了');
}


