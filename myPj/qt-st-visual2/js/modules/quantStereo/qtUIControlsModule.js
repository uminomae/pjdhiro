// js/core/UIControlsModule.js

import { setEnableVertical, setSpeedMultiplier, setGroundTextureSpeed } from './qt-animation-loop.js';
import { FormModule } from '../../core/FormModule.js';
import { getTopViewHandlers } from './handlers/qtTopViewHandlers.js';
import { getCameraHandlers }  from './handlers/qtCameraHandlers.js';
import { getDisplayHandlers } from './handlers/qtDisplayHandlers.js';
import { getSpeedHandlers }   from './handlers/qtSpeedHandlers.js';
import { getColorHandlers }   from './handlers/qtColorHandlers.js';
import { getNavbarHandlers }       from './handlers/qtNavbarHandlers.js';
import * as Config            from './qt-config.js';

export class UIControlsModule {
  /**
   * @param {{ scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer, controls: any }} context
   */
  constructor({ scene, camera, renderer, controls }) {
    // Offcanvas 用ハンドラをまとめる
    const offcanvasHandlers = [
      ...getTopViewHandlers(camera, controls),
      ...getCameraHandlers(controls),
      ...getDisplayHandlers(scene),
      ...getSpeedHandlers(),
      ...getColorHandlers(renderer)
    ];
    // Navbar 用ハンドラをまとめる
    const navbarHandlers = [
      ...getNavbarHandlers(this)
    ];

    // Offcanvas モジュール
    this.offcanvasModule = new FormModule({
      rootSelector: '#offcanvasForm',
      handlers: offcanvasHandlers
    });
    // Navbar モジュール
    this.navbarModule = new FormModule({
      rootSelector: '#navbar',
      handlers: navbarHandlers
    });

    this.controls = controls;
    this.scene    = scene;
    this.camera   = camera;
    this.renderer = renderer;
    this._hasStarted = false;
  }

  // ─────────── init/dispose ───────────
  init() {
    // ─────────────────────
    // 初期同期
    this._syncGridSphereToggle();
    this._syncConfigToControls();
    this._syncSpeedInputs();
    this._syncCameraToggles();
    this._syncDisplayToggles();
    this._syncColorInputs();
    // 登録
    this.offcanvasModule.init();
    this.navbarModule.init();
    // ナビバー初期状態
    this._resetNavbarState();
  }

  dispose() {
    this.offcanvasModule.dispose();
    this.navbarModule.dispose();
  }


  /**
   * EarthGridPoints のチェックボックスだけを
   * config → window → input に同期
   */
  _syncGridSphereToggle() {
    const cb = document.getElementById('toggle-grid-sphere');
    // (1) 最初に「動的状態変数」を config でセット
    window._earthGridVisible = Config.EARTH_GRID_VISIBLE;
    if (cb instanceof HTMLInputElement) {
      // (2) input.checked は必ず config 初期値で上書き
      cb.checked = Config.EARTH_GRID_VISIBLE;
      // (3) ユーザ操作時には動的状態変数だけ更新
      cb.addEventListener('change', () => {
        window._earthGridVisible = cb.checked;
      });
    }
  }

  /** config の “初期値” を window＋controls に反映 */
  _syncConfigToControls() {
    // カラー
    window._bgColorDark     = Config.BG_COLOR_DARK;
    window._bgColorLight    = Config.BG_COLOR_LIGHT;
    window._sphereBaseColor = Config.SPHERE_BASE_COLOR;
    window._peakColor1      = Config.SPHERE_MID_COLOR;
    window._peakColor2      = Config.SPHERE_END_COLOR;
    // カメラ
    this.controls.enableRotate    = Config.CAMERA_ENABLE_HORIZONTAL;
    this.controls.autoRotate      = Config.CAMERA_AUTO_ROTATE_ENABLED;
    this.controls.minPolarAngle   = Config.CAMERA_POLAR_ANGLE.MIN;
    this.controls.maxPolarAngle   = Config.CAMERA_POLAR_ANGLE.MAX;
    this.controls.autoRotateSpeed = 360 / Config.CAMERA_AUTO_ROTATE_PERIOD;
    // 垂直オシレーション
    setEnableVertical(Config.CAMERA_OSCILLATION_ENABLED);
  }

  // ── 追加: UI の speed 入力フォームに初期値を同期 ──
  _syncSpeedInputs() {
    // 1) config から window 変数へ
    window._speedMultiplier        = Config.ROTATION_DEFAULT_SPEED;
    window._textureSpeedMultiplier = Config.TEXTURE_DEFAULT_SPEED;
    // 2) アニメーションループ側に反映
    setSpeedMultiplier(window._speedMultiplier);
    setGroundTextureSpeed(window._textureSpeedMultiplier);

    // 3) フォーム input 要素へ初期値を書き込む
    [
      { id: 'speed-input', value: Config.ROTATION_DEFAULT_SPEED },
      { id: 'texture-speed-input',  value: Config.TEXTURE_DEFAULT_SPEED }
    ].forEach(({ id, value }) => {
      const inp = document.getElementById(id);
      if (inp instanceof HTMLInputElement) {
        inp.value = String(value);
      }
    });
  }

  // ─────────── 初期同期: カメラ ───────────
  _syncCameraToggles() {

    const horiz = document.getElementById('toggle-camera-horizontal');
    if (horiz instanceof HTMLInputElement) {
      horiz.checked = Config.CAMERA_AUTO_ROTATE_ENABLED;
      this.controls.autoRotate   = horiz.checked;
    }
    const vert  = document.getElementById('toggle-camera-vertical');
    if (vert instanceof HTMLInputElement) {
      vert.checked = Config.CAMERA_OSCILLATION_ENABLED;
      setEnableVertical(vert.checked);
    }
  }

  // ─────────── 初期同期: 表示/非表示 ───────────
  _syncDisplayToggles() {
    // — DOM のチェックボックスに config の初期値をセット —
    const groundToggle = document.getElementById('toggle-ground-visibility');
    if (groundToggle instanceof HTMLInputElement) {
      groundToggle.checked = Config.GROUND_TEXTURE_VISIBLE;
    }

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

  /** ナビバーの Run/Pause ボタン表示を初期化 */
  _resetNavbarState() {
    const btnRun   = document.getElementById('btn-run');
    const btnPause = document.getElementById('btn-pause');
    if (btnRun && btnPause) {
      btnRun.classList.add('d-none');
      btnPause.classList.remove('d-none');
    }
    this._hasStarted = false;
  }
}
