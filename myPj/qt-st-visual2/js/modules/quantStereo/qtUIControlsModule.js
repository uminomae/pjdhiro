// js/core/UIControlsModule.js

import { setEnableVertical, setSpeedMultiplier, setGroundTextureSpeed } from './qt-animation-loop.js';
import { FormModule } from '../../core/FormModule.js';

import { getTopViewHandlers } from './handlers/qtTopViewHandlers.js';
import { getCameraHandlers }  from './handlers/qtCameraHandlers.js';
import { getDisplayHandlers } from './handlers/qtDisplayHandlers.js';
import { getSpeedHandlers }   from './handlers/qtSpeedHandlers.js';
import { getColorHandlers }   from './handlers/qtColorHandlers.js';

export class UIControlsModule extends FormModule {
  /**
   * @param {{ scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer, controls: any }} context
   */
  constructor({ scene, camera, renderer, controls }) {
    // 事前に handlers をローカルで組み立てることで super 呼び出し前に this を使わない
    
    const handlers = [
      // ...UIControlsModule._getTopViewHandlers(camera, controls),
      ...getTopViewHandlers(camera, controls),
      ...getCameraHandlers(controls),
      ...getDisplayHandlers(scene),
      ...getSpeedHandlers(),
      ...getColorHandlers(renderer)
    ];

    super({ rootSelector: '#offcanvasForm', handlers });
    // ここではじめて this をセット
    this.scene    = scene;
    this.camera   = camera;
    this.renderer = renderer;
    this.controls = controls;
  }

  init() {
    this._syncCameraToggles();
    this._syncDisplayToggles();
    this._syncColorInputs();
    super.init();
  }

  dispose() {
    super.dispose();
  }

  // ─────────── 初期同期: カメラ ───────────
  _syncCameraToggles() {
    const horiz = document.getElementById('toggle-camera-horizontal');
    if (horiz instanceof HTMLInputElement) {
      this.controls.enableRotate = true;
      this.controls.autoRotate   = horiz.checked;
    }
    const vert = document.getElementById('toggle-camera-vertical');
    if (vert instanceof HTMLInputElement) {
      setEnableVertical(vert.checked);
    }
  }

  // ─────────── 初期同期: 表示/非表示 ───────────
  _syncDisplayToggles() {
    const cb = document.getElementById('toggle-grid-sphere');
    const m  = this.scene.getObjectByName('earthGridPoints');
    if (cb instanceof HTMLInputElement && m) {
      cb.checked = m.visible;
    }
    const hg = document.getElementById('toggle-helper-grid');
    const ha = document.getElementById('toggle-helper-axes');
    const og = this.scene.getObjectByName('HelperGrid');
    const oa = this.scene.getObjectByName('HelperAxes');
    if (hg instanceof HTMLInputElement && og) hg.checked = og.visible;
    if (ha instanceof HTMLInputElement && oa) ha.checked = oa.visible;
  }

  // ─────────── 初期同期: カラー ───────────
  _syncColorInputs() {
    const map = [
      { id: 'input-bg-color',     key: '_bgColorDark' },
      { id: 'input-sphere-color', key: '_sphereBaseColor' },
      { id: 'input-peak1-color',  key: '_peakColor1' },
      { id: 'input-peak2-color',  key: '_peakColor2' }
    ];
    map.forEach(({ id, key }) => {
      const inp = document.getElementById(id);
      if (inp instanceof HTMLInputElement && typeof window[key] === 'string') {
        inp.value = window[key];
      }
    });
  }
}
