// js/modules/quantStereo/qt-st-init-helpers.js

import * as THREE from 'three';

/**
 * addHelpersAndLights(scene)
 * ────────────────────────────────────────────────────────────
 * シーンに照明と軸ヘルパーを追加します。
 *
 * @param {THREE.Scene} scene
 */
export function addHelpersAndLights(scene) {
  // Ambient Light
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  // Directional Light
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // Axes Helper (X=赤, Y=緑, Z=青)
  const axesHelper = new THREE.AxesHelper(1.5);
  scene.add(axesHelper);
}
