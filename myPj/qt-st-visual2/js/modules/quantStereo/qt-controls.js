// js/modules/quantStereo/qt-controls.js
import { ControlsModule } from './qtControlsModule.js';

let controlsModule = null;

/**
 * free function initializeControls の置き換え
 * @param {import('three/examples/jsm/controls/OrbitControls').OrbitControls} controls
 */
export function initializeControls(controls) {
  if (!controlsModule) {
    controlsModule = new ControlsModule({ controls });
  }
  controlsModule.init();
}

/** OrbitControls 周りのリスナ破棄 */
export function disposeControls() {
  if (controlsModule) {
    controlsModule.dispose();
    controlsModule = null;
  }
}
