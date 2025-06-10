// === qt-init-ui.js ===
// js/modules/quantStereo/qt-init-ui.js

import * as THREE from 'three';
import { OffcanvasModule } from './qtOffcanvasModule.js';

let offcanvasModule = null;

/**
 * free function initUI の置き換え
 * @param {{ scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer, controls: any }} context
 */
export function initUI(context) {
  if (!offcanvasModule) {
    offcanvasModule = new OffcanvasModule(context);
  }
  offcanvasModule.init();
}

/** UI（Offcanvas 内イベント）破棄 */
export function disposeUI() {
  if (offcanvasModule) {
    offcanvasModule.dispose();
    offcanvasModule = null;
  }
}
