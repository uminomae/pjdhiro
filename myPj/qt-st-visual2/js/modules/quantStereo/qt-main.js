// js/modules/quantStereo/qt-main.js

// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { initUI }              from './qt-init-ui.js';
import { setupNavbarControls } from './qt-ui-navbar.js';
import { startAnimation }      from './qt-animation.js';
import { initializeControls }      from './qt-controls.js';
import { SceneModule } from '../../core/SceneModule.js';
import { setHasEverStarted } from './qt-ui-navbar.js';

/** @type {SceneModule|null} */
let sceneModule = null;

export function startModule(context) {
  const { scene, camera, renderer, controls } = context;
  console.log('[qt-main] startModule() が呼ばれました');

  // 初回呼び出し時にだけインスタンス生成
  if (!sceneModule) {
    sceneModule = new SceneModule({ scene, camera, controls });
  }
  // SceneModule の init() で毎回シーン構築＆イベント登録
  sceneModule.init();


  initializeControls(controls);
  initUI({ scene, camera, renderer, controls });
  setupNavbarControls({ scene, camera, renderer, controls });
  console.log('[qt-main] 初期化が完了しました');
  startAnimation(scene, camera, controls);
    // ──────────── ここを追加 ────────────
  
  setHasEverStarted(true);  // 自動再生を「一度実行済み」にする
  // ────────────────────────────────
}

