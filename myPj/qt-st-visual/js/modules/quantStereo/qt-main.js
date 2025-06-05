// js/modules/quantStereo/qt-main.js

// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { initUI }              from './qt-init-ui.js';
import { setupNavbarControls } from './qt-ui-navbar.js';
import { startAnimation, initializeControls }      from './qt-animation.js';
import { initializeScene } from './qt-init-scene-helpers.js'; // 既存

export function startModule({ scene, camera, renderer, controls }) {
  console.log('[qt-main] startModule() が呼ばれました');
  initializeScene({scene, camera, controls});
  initializeControls(controls);
  initUI({ scene, camera, renderer, controls });
  console.log('[qt-main] 初期化が完了しました');
  setupNavbarControls({ scene, camera, renderer, controls });
  startAnimation(scene, camera, controls);
}

