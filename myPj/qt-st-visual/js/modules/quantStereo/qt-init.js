// js/modules/quantStereo/qt-st-init.js

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
  console.log('[qt-st-init] initUI()');

  // i-scale スライダー
  const inputI = document.getElementById(UI_DOM_IDS.SLIDER_I);
  const labelI = document.getElementById(UI_DOM_IDS.LABEL_I);
  if (inputI && labelI) {
    labelI.textContent = parseFloat(inputI.value).toFixed(2);
    inputI.addEventListener('input', () => {
      const v = parseFloat(inputI.value);
      labelI.textContent = v.toFixed(2);
      const mesh = scene.getObjectByName('quaternionSpherePoints');
      if (mesh) mesh.scale.x = v;
    });
  }

  // k-scale スライダー
  const inputK = document.getElementById(UI_DOM_IDS.SLIDER_K);
  const labelK = document.getElementById(UI_DOM_IDS.LABEL_K);
  if (inputK && labelK) {
    labelK.textContent = parseFloat(inputK.value).toFixed(2);
    inputK.addEventListener('input', () => {
      const v = parseFloat(inputK.value);
      labelK.textContent = v.toFixed(2);
      const mesh = scene.getObjectByName('quaternionSpherePoints');
      if (mesh) mesh.scale.z = v;
    });
  }

  // Next Q ボタン
  const btnNextQ = document.getElementById(UI_DOM_IDS.BTN_NEXT_Q);
  if (btnNextQ) {
    btnNextQ.addEventListener('click', () => {
      console.log('[qt-st-init] Next Q がクリックされました');
      // ここでは scene の中身だけ消して、qt-main.js 側で再生成してもらう
      // actual call は qt-main.js に委ねる
      const event = new CustomEvent('NEXT_QUATERNION');
      window.dispatchEvent(event);
    });
  }

  // Top View ボタン
  const btnTop = document.getElementById(UI_DOM_IDS.BTN_TOP);
  if (btnTop) {
    btnTop.addEventListener('click', () => {
      console.log('[qt-st-init] Top View がクリックされました');
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

  console.log('[qt-st-init] initUI() 完了');
}
