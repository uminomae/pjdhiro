// === qt-init-ui.js ===
// js/modules/quantStereo/qt-init-ui.js

import { UI_DOM_IDS } from './qt-config.js';
import { setSpeedMultiplier, setGroundTextureSpeed } from './qt-animation-loop.js';
/**
 * initUI(context)
 * ・スライダー (i-scale, k-scale) と
 * ・Next Q ボタン、Top View ボタン
 * ・変数表示 (α,β,γ,δ) などを初期化
 * ※今回は「オブジェクト表示設定アコーディオン」に対応するチェックボックスも登録
 */
export function initUI({ scene, camera, renderer, controls }) {
  console.log('[qt-init-ui] initUI()');

  // ──────────────── Top View ボタン ────────────────
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

  // ──────────────── 変数表示 (α,β,γ,δ) 初期化 ────────────────
  ['VAL_ALPHA', 'VAL_BETA', 'VAL_GAMMA', 'VAL_DELTA'].forEach((key) => {
    const el = document.getElementById(UI_DOM_IDS[key]);
    if (el) el.textContent = '0.000';
  });

  // ──────────────── グリッド単位球の表示切り替え ────────────────
  const checkboxGridSphere = document.getElementById('toggle-grid-sphere');
  if (checkboxGridSphere instanceof HTMLInputElement) {
    checkboxGridSphere.addEventListener('change', (e) => {
      const visible = e.target.checked;
      const gridSphere = scene.getObjectByName('earthGridPoints');
      if (gridSphere) {
        gridSphere.visible = visible;
      }
    });
  } else {
    console.warn('[qt-init-ui] toggle-grid-sphere チェックボックスが見つかりません');
  }

  // ──────────────── 床画像（GroundMesh）の表示切り替え ────────────────
  // 既存の setupGroundToggle() でも制御しているため、二重にならないよう
  // 同期的に状態を合わせるだけにとどめます
  const checkboxGround = document.getElementById('toggle-ground-visibility');
  if (checkboxGround instanceof HTMLInputElement) {
    checkboxGround.addEventListener('change', (e) => {
      // GroundMesh は qt-init-scene-helpers.js 内で取得＆制御されているため
      // ここでは特に何もしなくて OK です。もし別で直接制御したい場合は以下のように：
      // const ground = scene.getObjectByName('GroundMesh');
      // if (ground) ground.visible = e.target.checked;
    });
  } else {
    console.warn('[qt-init-ui] toggle-ground-visibility チェックボックスが見つかりません');
  }

  // ──────────────── 床面グリッド（HelperGrid）の表示切り替え ────────────────
  const checkboxHelperGrid = document.getElementById('toggle-helper-grid');
  if (checkboxHelperGrid instanceof HTMLInputElement) {
    checkboxHelperGrid.addEventListener('change', (e) => {
      const visible = e.target.checked;
      const helperGrid = scene.getObjectByName('HelperGrid');
      if (helperGrid) {
        helperGrid.visible = visible;
      }
    });
    // ページ初期表示に合わせてチェック状態を同期
    const helperGrid = scene.getObjectByName('HelperGrid');
    if (helperGrid) {
      checkboxHelperGrid.checked = helperGrid.visible;
    }
  } else {
    console.warn('[qt-init-ui] toggle-helper-grid チェックボックスが見つかりません');
  }

  // ──────────────── 座標軸（HelperAxes）の表示切り替え ────────────────
  const checkboxHelperAxes = document.getElementById('toggle-helper-axes');
  if (checkboxHelperAxes instanceof HTMLInputElement) {
    checkboxHelperAxes.addEventListener('change', (e) => {
      const visible = e.target.checked;
      const helperAxes = scene.getObjectByName('HelperAxes');
      if (helperAxes) {
        helperAxes.visible = visible;
      }
    });
    // ページ初期表示に合わせてチェック状態を同期
    const helperAxes = scene.getObjectByName('HelperAxes');
    if (helperAxes) {
      checkboxHelperAxes.checked = helperAxes.visible;
    }
  } else {
    console.warn('[qt-init-ui] toggle-helper-axes チェックボックスが見つかりません');
  }

  // ──────────────── 垂直往復 (Vertical Oscillation) のスイッチ ────────────────
  const checkboxCamV = document.getElementById('toggle-camera-vertical');
  if (checkboxCamV instanceof HTMLInputElement) {
    checkboxCamV.addEventListener('change', (e) => {
      // 既存のカメラ垂直自動回転処理に合わせたコードをここに
      // 例: controls.autoRotate = e.target.checked; etc.
    });
  }

  // ──────────────── 水平回転 (OrbitControls.rotate) のスイッチ ────────────────
  const checkboxCamH = document.getElementById('toggle-camera-horizontal');
  if (checkboxCamH instanceof HTMLInputElement) {
    checkboxCamH.addEventListener('change', (e) => {
      // 既存のカメラ水平自動回転処理に合わせたコードをここに
      // 例: controls.autoRotate = e.target.checked; etc.
    });
  }

  // ──────────────── 速度制御UI の初期化 ────────────────
  const speedInput = document.getElementById('speed-input');
  if (speedInput instanceof HTMLInputElement) {
    speedInput.addEventListener('change', (e) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v) && v > 0) {
        setSpeedMultiplier(v);
      } else {
        // 無効な値なら 1 にリセット（または直前の valid な値を表示）
        e.target.value = '1';
        setSpeedMultiplier(1);
      }
    });
  }
  const presetBtns = document.querySelectorAll('.speed-preset-btn');
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const speedVal = parseFloat(btn.getAttribute('data-speed'));
      if (!isNaN(speedVal) && speedInput instanceof HTMLInputElement) {
        speedInput.value = speedVal;
        setSpeedMultiplier(speedVal);
      }
    });
  });
  console.log('[qt-init-ui] 速度制御UI を初期化しました');


  // ──────────────── 床テクスチャ回転速度コントロール ────────────────
  const textureSpeedInput = document.getElementById('texture-speed-input');
  if (textureSpeedInput instanceof HTMLInputElement) {
    textureSpeedInput.addEventListener('change', (e) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v)) {
        setGroundTextureSpeed(v);
      } else {
        e.target.value = '0';
        setGroundTextureSpeed(0);
      }
    });
  }

  const texturePresetBtns = document.querySelectorAll('.texture-preset-btn');
  texturePresetBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const v = parseFloat(btn.getAttribute('data-speed'));
      if (!isNaN(v) && textureSpeedInput instanceof HTMLInputElement) {
        textureSpeedInput.value = v;
        setGroundTextureSpeed(v);
      }
    });
  });
  console.log('[qt-init-ui] 床テクスチャ回転速度UI 初期化');

  console.log('[qt-init-ui] initUI() 完了');
}
