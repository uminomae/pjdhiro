// js/modules/quantStereo/qt-main.js

// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { initUI }              from './qt-init-ui.js';
import { setupNavbarControls } from './qt-ui-navbar.js';
import { startAnimation }      from './qt-animation.js';
import { initializeControls }      from './qt-controls.js';
import { initializeScene } from './qt-init-scene-helpers.js'; 
import { setHasEverStarted } from './qt-ui-navbar.js';

export function startModule({ scene, camera, renderer, controls }) {
  console.log('[qt-main] startModule() が呼ばれました');
  initializeScene({scene, camera, controls});
  initializeControls(controls);
  initUI({ scene, camera, renderer, controls });
  setupNavbarControls({ scene, camera, renderer, controls });
  console.log('[qt-main] 初期化が完了しました');
  startAnimation(scene, camera, controls);
    // ──────────── ここを追加 ────────────
  
  setHasEverStarted(true);  // 自動再生を「一度実行済み」にする
  // ────────────────────────────────
}

