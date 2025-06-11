// js/core/UIControlsModule.js
import { FormModule }                     from '../../core/FormModule.js';
import * as Config                        from './qt-config.js';
import { resetModule }                    from './qt-main.js';
import { getTopViewHandlers }    from './handlers/qtTopViewHandlers.js';
import { getCameraHandlers }     from './handlers/qtCameraHandlers.js';
import { getDisplayHandlers }    from './handlers/qtDisplayHandlers.js';
import { getSpeedHandlers }      from './handlers/qtSpeedHandlers.js';
import { getColorHandlers }      from './handlers/qtColorHandlers.js';
import { getNavbarHandlers }     from './handlers/qtNavbarHandlers.js';

export class UIControlsModule {
  constructor(
    { scene, camera, renderer, controls,
      animController
    }
  ){
    this.context  = { scene, camera, renderer, controls };
    this.controls = controls;
    this.scene    = scene;
    this.camera   = camera;
    this.renderer = renderer;
    this.animController = animController;
    this._hasStarted = false;

    // Offcanvas／Navbar 用の FormModule
    this.offcanvasModule = new FormModule({
      rootSelector: '#offcanvasForm',
      handlers: [
                 ...getTopViewHandlers(camera, controls), 
                 ...getCameraHandlers({ controls, animController }),
                 ...getDisplayHandlers(scene),
                 ...getSpeedHandlers(animController),
                 ...getColorHandlers(renderer)
                ]
    });
    this.navbarModule = new FormModule({
      rootSelector: '#navbar',
      handlers: [...getNavbarHandlers(this)]
    });
  }

  init() {
    // リセットボタンのバインドをこちらでのみ行う
    const btnReset = document.getElementById('btn-reset');
    if (btnReset instanceof HTMLButtonElement) {
      btnReset.addEventListener('click', () => resetModule(this.context));
    }
    // Offcanvas／Navbar のイベント登録
    this.offcanvasModule.init();
    this.navbarModule.init();

    this.sync();
    this._hasStarted = true;
  }
  
  sync() {
    // 設定が変わったときに再度呼び出せる
    this._syncGridSphereToggle();
    this._syncConfigToControls();
    this._syncSpeedInputs();
    this._syncCameraToggles();
    this._syncDisplayToggles();
    this._syncColorInputs();
    // Run/Pause ボタン初期状態
    this._resetNavbarState();
  }

  dispose() {
    // FormModule の後始末のみ
    this.offcanvasModule.dispose();
    this.navbarModule.dispose();
    // btn-reset のリスナは調整が必要ならここで外す
  }


  _syncGridSphereToggle() {
    const cb = document.getElementById('toggle-grid-sphere');
    window._earthGridVisible = Config.EARTH_GRID_VISIBLE;
    if (cb instanceof HTMLInputElement) {
      cb.checked = Config.EARTH_GRID_VISIBLE;
      cb.addEventListener('change', () => {
        window._earthGridVisible = cb.checked;
      });
    }
  }

  _syncConfigToControls() {
    window._bgColorDark     = Config.BG_COLOR_DARK;
    window._bgColorLight    = Config.BG_COLOR_LIGHT;
    window._sphereBaseColor = Config.SPHERE_BASE_COLOR;
    window._peakColor1      = Config.SPHERE_MID_COLOR;
    window._peakColor2      = Config.SPHERE_END_COLOR;
    this.controls.enableRotate    = Config.CAMERA_ENABLE_HORIZONTAL;
    this.controls.autoRotate      = Config.CAMERA_AUTO_ROTATE_ENABLED;
    this.controls.minPolarAngle   = Config.CAMERA_POLAR_ANGLE.MIN;
    this.controls.maxPolarAngle   = Config.CAMERA_POLAR_ANGLE.MAX;
    this.controls.autoRotateSpeed = 360 / Config.CAMERA_AUTO_ROTATE_PERIOD;
    this.animController.setEnableVertical(Config.CAMERA_OSCILLATION_ENABLED);
  }

  _syncSpeedInputs() {
    window._speedMultiplier        = Config.ROTATION_DEFAULT_SPEED;
    window._textureSpeedMultiplier = Config.TEXTURE_DEFAULT_SPEED;
    this.animController.setSpeedMultiplier(window._speedMultiplier);
    this.animController.setTextureSpeed(window._textureSpeedMultiplier);
    [
      { id: 'speed-input', value: Config.ROTATION_DEFAULT_SPEED },
      { id: 'texture-speed-input',  value: Config.TEXTURE_DEFAULT_SPEED }
    ].forEach(({ id, value }) => {
      const inp = document.getElementById(id);
      if (inp instanceof HTMLInputElement) inp.value = String(value);
    });
  }

  _syncCameraToggles() {
    const horiz = document.getElementById('toggle-camera-horizontal');
    if (horiz instanceof HTMLInputElement) {
      horiz.checked = Config.CAMERA_AUTO_ROTATE_ENABLED;
      this.controls.autoRotate = horiz.checked;
    }
    const vert = document.getElementById('toggle-camera-vertical');
    if (vert instanceof HTMLInputElement) {
      vert.checked = Config.CAMERA_OSCILLATION_ENABLED;
      this.animController.setEnableVertical(vert.checked);
    }
  }

  _syncDisplayToggles() {
    const groundToggle = document.getElementById('toggle-ground-visibility');
    if (groundToggle instanceof HTMLInputElement) {
      groundToggle.checked = Config.GROUND_TEXTURE_VISIBLE;
    }
    const hg = document.getElementById('toggle-helper-grid');
    const ha = document.getElementById('toggle-helper-axes');
    const og = this.scene.getObjectByName('HelperGrid');
    const oa = this.scene.getObjectByName('HelperAxes');
    if (hg instanceof HTMLInputElement && og) hg.checked = og.visible;
    if (ha instanceof HTMLInputElement && oa) ha.checked = oa.visible;
  }

  _syncColorInputs() {
    [
      { id: 'input-bg-color',     key: '_bgColorDark' },
      { id: 'input-sphere-color', key: '_sphereBaseColor' },
      { id: 'input-peak1-color',  key: '_peakColor1' },
      { id: 'input-peak2-color',  key: '_peakColor2' }
    ].forEach(({ id, key }) => {
      const inp = document.getElementById(id);
      if (inp instanceof HTMLInputElement && typeof window[key] === 'string') {
        inp.value = window[key];
      }
    });
  }

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
