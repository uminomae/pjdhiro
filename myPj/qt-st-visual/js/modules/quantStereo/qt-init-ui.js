// js/modules/quantStereo/qt-init-ui.js

import { UI_DOM_IDS } from './qt-config.js';
import { setSpeedMultiplier } from './qt-animation-loop.js';

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

  // ── ここから「速度制御UI」の初期化 ──

  // 数値入力欄を取得
  const speedInput = document.getElementById('speed-input');
  if (speedInput instanceof HTMLInputElement) {
    // 数値が変更されたときに setSpeedMultiplier を呼び出す
    speedInput.addEventListener('change', (e) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v) && v > 0) {
        setSpeedMultiplier(v);
      } else {
        // 無効な値だった場合はリセットしておく (例：1 に戻す)
        e.target.value = speedMultiplier;  // speedMultiplier は module 内で保持している最新値
      }
    });
  }

  // プリセットボタンをまとめて取得
  const presetBtns = document.querySelectorAll('.speed-preset-btn');
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const speedVal = parseFloat(target.getAttribute('data-speed'));
      if (!isNaN(speedVal) && speedInput instanceof HTMLInputElement) {
        // ① 入力欄の表示も切り替える
        speedInput.value = speedVal;
        // ② 実際の倍率もセットする
        setSpeedMultiplier(speedVal);
      }
    });
  });

  console.log('[qt-init-ui] 速度制御UI を初期化しました');

  // ── ここまで「速度制御UI」の設定 ──

  console.log('[qt-init-ui] initUI() 完了');
}


