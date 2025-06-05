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

  // ──────────────── グリッド単位球の表示切り替え ────────────────
  const checkboxGrid = document.getElementById('toggle-grid-sphere');
  if (checkboxGrid instanceof HTMLInputElement) {

    // チェック状態が変わったときに可視性を切り替える
    checkboxGrid.addEventListener('change', (e) => {
      const target = e.target;
      const visible = target.checked; // true: 表示, false: 非表示
      const grid = scene.getObjectByName('earthGridPoints');
      if (grid) {
        grid.visible = visible;
      }
    });
  } else {
    console.warn('[qt-init-ui] toggle-grid-sphere チェックボックスが見つかりません');
  }

  console.log('[qt-init-ui] initUI() 完了');
}


