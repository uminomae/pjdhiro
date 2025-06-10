// js/modules/quantStereo/OffcanvasModule.js
import { FormModule } from '../../core/FormModule.js';
import * as THREE from 'three';
import { 
  UI_DOM_IDS,
  SPHERE_BASE_COLOR,
  SPHERE_MID_COLOR,
  SPHERE_END_COLOR,
  BG_COLOR_DARK,
  BG_COLOR_LIGHT
} from './qt-config.js';
import { setSpeedMultiplier, setGroundTextureSpeed } from './qt-animation-loop.js';

/**
 * OffcanvasModule: offcanvas 内の各種フォームを管理するクラス
 */
export class OffcanvasModule extends FormModule {
  /**
   * @param {{scene:THREE.Scene, camera:THREE.Camera, renderer:THREE.Renderer, controls:any }} opts
   */
  constructor({ scene, camera, renderer, controls }) {
    super({
      rootSelector: '#offcanvasForm',
      handlers: [
        { selector: `#${UI_DOM_IDS.BTN_TOP}`,              type: 'click',  handler: () => this._onTopView() },
        { selector: '#toggle-grid-sphere',                 type: 'change', handler: e => this._onGridSphereToggle(e) },
        { selector: '#toggle-ground-visibility',           type: 'change', handler: e => this._onGroundVisibilityToggle(e) },
        { selector: '#toggle-helper-grid',                 type: 'change', handler: e => this._onHelperGridToggle(e) },
        { selector: '#toggle-helper-axes',                 type: 'change', handler: e => this._onHelperAxesToggle(e) },
        { selector: '#speed-input',                        type: 'change', handler: e => this._onSpeedChange(e) },
        { selector: '.speed-preset-btn',                   type: 'click',  handler: e => this._onSpeedPresetClick(e) },
        { selector: '#texture-speed-input',                type: 'change', handler: e => this._onTextureSpeedChange(e) },
        { selector: '.texture-preset-btn',                 type: 'click',  handler: e => this._onTexturePresetClick(e) },
        { selector: '#input-bg-color',                     type: 'input',  handler: e => this._onBgColorInput(e) },
        { selector: '#input-sphere-color',                 type: 'input',  handler: e => this._onSphereBaseColor(e) },
        { selector: '#input-peak1-color',                  type: 'input',  handler: e => this._onPeak1Color(e) },
        { selector: '#input-peak2-color',                  type: 'input',  handler: e => this._onPeak2Color(e) }
      ]
    });
    // this.dom      = dom;
    this.scene    = scene;
    this.camera   = camera;
    this.renderer = renderer;
    this.controls = controls;
    // speedInput を参照として保持
    this._speedInput = this.root.querySelector('#speed-input');
  }

  /** 初期化 */
  init() {
    this._syncVariableDisplay();
    this._syncColorInputs();
    this._syncHelperToggles();            // HelperGrid/Axes の初期チェック同期
    super.init();
  }

  /** 破棄 */
  dispose() {
    super.dispose();
  }

  // ────────── ハンドラ ──────────

  _onTopView() {
    this.camera.position.set(0, 5, 0);
    this.camera.up.set(0, 0, -1);
    this.camera.lookAt(0, 0, 0);
    this.controls.update();
  }

  _onGridSphereToggle(e) {
    const mesh = this.scene.getObjectByName('earthGridPoints');
    if (mesh) mesh.visible = e.target.checked;
  }

  _onGroundVisibilityToggle(/* e */) {}

  _onHelperGridToggle(e) {
    const grid = this.scene.getObjectByName('HelperGrid');
    if (grid) grid.visible = e.target.checked;
  }

  _onHelperAxesToggle(e) {
    const axes = this.scene.getObjectByName('HelperAxes');
    if (axes) axes.visible = e.target.checked;
  }



    // ──────────────── 速度制御UI の初期化 ────────────────
    // const speedInput = document.getElementById('speed-input');
    // if (speedInput instanceof HTMLInputElement) {
    //   speedInput.addEventListener('change', (e) => {
    //     const v = parseFloat(e.target.value);
    //     if (!isNaN(v) && v > 0) {
    //       setSpeedMultiplier(v);
    //     } else {
    //       // 無効な値なら 1 にリセット（または直前の valid な値を表示）
    //       e.target.value = '1';
    //       setSpeedMultiplier(1);
    //     }
    //   });
    // }
    // const presetBtns = document.querySelectorAll('.speed-preset-btn');
    // presetBtns.forEach((btn) => {
    //   btn.addEventListener('click', (e) => {
    //     const speedVal = parseFloat(btn.getAttribute('data-speed'));
    //     if (!isNaN(speedVal) && speedInput instanceof HTMLInputElement) {
    //       speedInput.value = speedVal;
    //       setSpeedMultiplier(speedVal);
    //     }
    //   });
    // });
    // console.log('[qt-init-ui] 速度制御UI を初期化しました');
  
  _onSpeedChange(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v > 0) {
      setSpeedMultiplier(v);
    } else {
      e.target.value = '1';
      setSpeedMultiplier(1);
    }
  }

  /**
   * speed-preset-btn クリック時：元コードと同じロジック
   */
  _onSpeedPresetClick(e) {
    const btn = e.currentTarget;
    const speedVal = parseFloat(btn.getAttribute('data-speed'));
    if (!isNaN(speedVal) && this._speedInput instanceof HTMLInputElement) {
      this._speedInput.value = speedVal;
      setSpeedMultiplier(speedVal);
    }
  }

  _onTextureSpeedChange(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) {
      setGroundTextureSpeed(v);
    } else {
      e.target.value = '0';
      setGroundTextureSpeed(0);
    }
  }


    // ──────────────── 床テクスチャ回転速度コントロール ────────────────
    // const textureSpeedInput = document.getElementById('texture-speed-input');
    // if (textureSpeedInput instanceof HTMLInputElement) {
    //   textureSpeedInput.addEventListener('change', (e) => {
    //     const v = parseFloat(e.target.value);
    //     if (!isNaN(v)) {
    //       setGroundTextureSpeed(v);
    //     } else {
    //       e.target.value = '0';
    //       setGroundTextureSpeed(0);
    //     }
    //   });
    // }
  
    // const texturePresetBtns = document.querySelectorAll('.texture-preset-btn');
    // texturePresetBtns.forEach((btn) => {
    //   btn.addEventListener('click', (e) => {
    //     const v = parseFloat(btn.getAttribute('data-speed'));
    //     if (!isNaN(v) && textureSpeedInput instanceof HTMLInputElement) {
    //       textureSpeedInput.value = v;
    //       setGroundTextureSpeed(v);
    //     }
    //   });
    // });
    // console.log('[qt-init-ui] 床テクスチャ回転速度UI 初期化');

  _onTexturePresetClick(e) {
    const btn = e.currentTarget;
    const speedVal = parseFloat(btn.getAttribute('data-speed'));
    const texInput = this.root.querySelector('#texture-speed-input');
    if (!isNaN(speedVal) && texInput instanceof HTMLInputElement) {
      texInput.value = speedVal;
      setGroundTextureSpeed(speedVal);
    }
  }

  _onBgColorInput(e) {
    const col = e.target.value;
    window._bgColorDark  = col;
    window._bgColorLight = col;
    this.renderer.setClearColor(col);
  }

  _onSphereBaseColor(e) {
    window._sphereBaseColor = e.target.value;
  }

  _onPeak1Color(e) {
    window._peakColor1 = e.target.value;
  }

  _onPeak2Color(e) {
    window._peakColor2 = e.target.value;
  }

  // ────────── 同期メソッド ──────────

  _syncVariableDisplay() {
    ['VAL_ALPHA','VAL_BETA','VAL_GAMMA','VAL_DELTA'].forEach(key => {
      const el = document.getElementById(UI_DOM_IDS[key]);
      if (el) el.textContent = '0.000';
    });
  }

  _syncColorInputs() {
    const bgInput = this.root.querySelector('#input-bg-color');
    if (bgInput instanceof HTMLInputElement) {
      if (typeof window._bgColorDark === 'string') {
        bgInput.value = window._bgColorDark;
      } else {
        bgInput.value = BG_COLOR_DARK;
        window._bgColorDark  = BG_COLOR_DARK;
        window._bgColorLight = BG_COLOR_LIGHT;
        this.renderer.setClearColor(BG_COLOR_DARK);
      }
    }
    const baseInput = this.root.querySelector('#input-sphere-color');
    if (baseInput instanceof HTMLInputElement) {
      if (typeof window._sphereBaseColor === 'string') {
        baseInput.value = window._sphereBaseColor;
      } else {
        const base = (window._sphereBaseColor instanceof THREE.Color)
          ? '#' + window._sphereBaseColor.getHexString()
          : SPHERE_BASE_COLOR;
        baseInput.value = base;
        window._sphereBaseColor = base;
      }
    }
    const peak1Input = this.root.querySelector('#input-peak1-color');
    if (peak1Input instanceof HTMLInputElement) {
      if (typeof window._peakColor1 === 'string') {
        peak1Input.value = window._peakColor1;
      } else {
        const mid = (SPHERE_MID_COLOR instanceof THREE.Color)
          ? '#' + SPHERE_MID_COLOR.getHexString()
          : SPHERE_MID_COLOR;
        peak1Input.value = mid;
        window._peakColor1 = mid;
      }
    }
    const peak2Input = this.root.querySelector('#input-peak2-color');
    if (peak2Input instanceof HTMLInputElement) {
      if (typeof window._peakColor2 === 'string') {
        peak2Input.value = window._peakColor2;
      } else {
        const end = (SPHERE_END_COLOR instanceof THREE.Color)
          ? '#' + SPHERE_END_COLOR.getHexString()
          : SPHERE_END_COLOR;
        peak2Input.value = end;
        window._peakColor2 = end;
      }
    }
  }

  /** HelperGrid/Axes のチェック状態を初期同期 */
  _syncHelperToggles() {
    const grid = this.scene.getObjectByName('HelperGrid');
    const gridInput = this.root.querySelector('#toggle-helper-grid');
    if (gridInput instanceof HTMLInputElement && grid) {
      gridInput.checked = grid.visible;
    }
    const axes = this.scene.getObjectByName('HelperAxes');
    const axesInput = this.root.querySelector('#toggle-helper-axes');
    if (axesInput instanceof HTMLInputElement && axes) {
      axesInput.checked = axes.visible;
    }
  }
}
