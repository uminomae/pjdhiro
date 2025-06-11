// === qt-init-ui.js ===
// js/modules/quantStereo/qt-init-ui.js

import * as THREE from 'three';

import { UI_DOM_IDS } from './qt-config.js';
import { setSpeedMultiplier, setGroundTextureSpeed } from './qt-animation-loop.js';
import {
  SPHERE_BASE_COLOR,
  SPHERE_MID_COLOR,
  SPHERE_END_COLOR,
  BG_COLOR_DARK, BG_COLOR_LIGHT 
} from './qt-config.js';

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

  // ──────────────── カラー設定を即時反映させるリスナー群 ────────────────
  
  // ===== 背景色を 即時反映 =====
  const inputBgColor = document.getElementById('input-bg-color');
  if (inputBgColor instanceof HTMLInputElement) {
    inputBgColor.addEventListener('input', (e) => {
      const col = e.target.value;        // 例: "#000011"
      // ここで、animationLoop が参照するグローバル変数を更新
      window._bgColorDark  = col;
      window._bgColorLight = col;
      // さらに renderer のクリア色を同じにしておくと安心
      renderer.setClearColor(col);
    });
    // オフキャンバスを開いたとき、現在の background 色を同期しておく
    // 初期状態の同期：現在の scene.background ではなく、window._bgColorDark / _bgColorLight を使う
    if (typeof window._bgColorDark === 'string') {
      inputBgColor.value = window._bgColorDark;
    } else {
      const defaultDark  = BG_COLOR_DARK;
      const defaultLight = BG_COLOR_LIGHT;  // たとえばリセット後と同じ“明”のデフォルト
      inputBgColor.value = defaultDark;
      window._bgColorDark  = defaultDark;
      window._bgColorLight = defaultLight;
      // レンダラーのクリア色にも反映しておく
      renderer.setClearColor(defaultDark);
    }
  }

  // ===== 投影球（quaternionSpherePoints）の色を即時反映 =====

  // (1) ベース色 (_sphereBaseColor)
  const inputSphereBase = document.getElementById('input-sphere-color');
  if (inputSphereBase instanceof HTMLInputElement) {
    inputSphereBase.addEventListener('input', (e) => {
      const col = e.target.value;           // 例: "#ffffff"
      // window._sphereBaseColor にセットしておく
      window._sphereBaseColor = col;
    });
    // 初期値を同期：もし window._sphereBaseColor があればそれを、なければ qt-config.js の SPHERE_BASE_COLOR
    if (typeof window._sphereBaseColor === 'string') {
      inputSphereBase.value = window._sphereBaseColor;
    } else {
      // qt-config.js に定義されている SPHERE_BASE_COLOR は文字列か THREE.Color の可能性があるので
      const base = (window._sphereBaseColor instanceof THREE.Color)
        ? '#' + window._sphereBaseColor.getHexString()
        : SPHERE_BASE_COLOR;
      inputSphereBase.value = base;
      // ついでにグローバルにセットしておくと初期フレームから反映される
      window._sphereBaseColor = base;
    }
  }

  // (2) 中間色 (_peakColor1)
  const inputPeak1 = document.getElementById('input-peak1-color');
  if (inputPeak1 instanceof HTMLInputElement) {
    inputPeak1.addEventListener('input', (e) => {
      const col = e.target.value;
      window._peakColor1 = col;
    });
    // 初期値を同期
    if (typeof window._peakColor1 === 'string') {
      inputPeak1.value = window._peakColor1;
    } else {
      const mid = (SPHERE_MID_COLOR instanceof THREE.Color)
        ? '#' + SPHERE_MID_COLOR.getHexString()
        : SPHERE_MID_COLOR;
      inputPeak1.value = mid;
      window._peakColor1 = mid;
    }
  }

  // (3) 終端色 (_peakColor2)
  const inputPeak2 = document.getElementById('input-peak2-color');
  if (inputPeak2 instanceof HTMLInputElement) {
    inputPeak2.addEventListener('input', (e) => {
      const col = e.target.value;
      window._peakColor2 = col;
    });
    // 初期値を同期
    if (typeof window._peakColor2 === 'string') {
      inputPeak2.value = window._peakColor2;
    } else {
      const end = (SPHERE_END_COLOR instanceof THREE.Color)
        ? '#' + SPHERE_END_COLOR.getHexString()
        : SPHERE_END_COLOR;
      inputPeak2.value = end;
      window._peakColor2 = end;
    }
  }
  console.log('[qt-init-ui] カラー設定の即時更新リスナーを登録');

  console.log('[qt-init-ui] initUI() 完了');
}
