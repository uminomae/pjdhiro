// js/modules/quantStereo/qt-init-helpers.js

import * as THREE from 'three';
import {
  GRID_SIZE,
  GRID_DIVISIONS,
  GRID_COLOR_CENTERLINE,
  GRID_COLOR,
  AXES_SIZE
} from './qt-config.js';

/**
 * addHelpersAndLights(scene)
 * ────────────────────────────────────────────────────────────
 * シーンに照明・軸ヘルパー・床グリッドを追加します。
 *
 * @param {THREE.Scene} scene
 */
export function addHelpersAndLights(scene) {
  // ───────────────────────────────────────────────
  // (1) Ambient Light
  // ───────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  // ───────────────────────────────────────────────
  // (2) Directional Light
  // ───────────────────────────────────────────────
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // ───────────────────────────────────────────────
  // (3) Axes Helper (X=赤, Y=緑, Z=青)
  // ───────────────────────────────────────────────
  const axesHelper = new THREE.AxesHelper(AXES_SIZE);
  scene.add(axesHelper);

  // ───────────────────────────────────────────────
  // (4) Grid Helper (床平面用グリッド)
  // ───────────────────────────────────────────────
  const gridHelper = new THREE.GridHelper(
    GRID_SIZE,
    GRID_DIVISIONS,
    GRID_COLOR_CENTERLINE,
    GRID_COLOR
  );
  scene.add(gridHelper);
}
