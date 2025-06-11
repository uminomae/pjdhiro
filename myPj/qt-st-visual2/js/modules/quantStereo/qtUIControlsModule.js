// js/core/UIControlsModule.js
// import { DOMEventManager } from '../../core/DOMEventManager.js';
import { setEnableVertical, setSpeedMultiplier, setGroundTextureSpeed } from './qt-animation-loop.js';
import { UI_DOM_IDS }     from './qt-config.js';
import { FormModule } from '../../core/FormModule.js';


export class UIControlsModule extends FormModule {
  /**
   * @param {{ scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer, controls: any }} opts
   */
  constructor({ scene, camera, renderer, controls }) {
    // Offcanvas のルート要素に対してイベント委譲で登録
    super({
      rootSelector: '#offcanvasForm',
      handlers: [
        { selector: `#${UI_DOM_IDS.BTN_TOP}`,              type: 'click',  handler: e => this._onTopView(e) },
        { selector: '#toggle-camera-horizontal',           type: 'change', handler: e => this._onCameraHorizontalToggle(e) },
        { selector: '#toggle-camera-vertical',             type: 'change', handler: e => this._onCameraVerticalToggle(e) },
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

    this.scene    = scene;
    this.camera   = camera;
    this.renderer = renderer;
    this.controls = controls;

    // 値の同期・操作に使う要素をキャッシュ
    this._speedInput = this.root.querySelector('#speed-input');
    this._texInput   = this.root.querySelector('#texture-speed-input');
  }

  /** 初期化：状態同期 → イベント登録 */
  init() {
    this._syncCameraToggles();
    this._syncGridSphere();
    this._syncHelperToggles();
    this._syncVariableDisplay();
    this._syncColorInputs();
    super.init();  // FormModule.init() で一括イベント登録
  }

  /** 破棄 */
  dispose() {
    super.dispose();
  }

  // ────────── 同期メソッド ──────────

  _syncCameraToggles() {
    const h = this.root.querySelector('#toggle-camera-horizontal');
    if (h instanceof HTMLInputElement) {
      this.controls.enableRotate = true;
      this.controls.autoRotate   = h.checked;
    }
    const v = this.root.querySelector('#toggle-camera-vertical');
    if (v instanceof HTMLInputElement) {
      setEnableVertical(v.checked);
    }
  }

  _syncGridSphere() {
    const cb = this.root.querySelector('#toggle-grid-sphere');
    const mesh = this.scene.getObjectByName('earthGridPoints');
    if (cb instanceof HTMLInputElement && mesh) {
      cb.checked = mesh.visible;
    }
  }

  _syncHelperToggles() {
    ['grid','axes'].forEach(name => {
      const id = `toggle-helper-${name}`;
      const cb = this.root.querySelector(`#${id}`);
      const objName = name === 'grid' ? 'HelperGrid' : 'HelperAxes';
      const obj = this.scene.getObjectByName(objName);
      if (cb instanceof HTMLInputElement && obj) {
        cb.checked = obj.visible;
      }
    });
  }

  _syncVariableDisplay() {
    ['VAL_ALPHA','VAL_BETA','VAL_GAMMA','VAL_DELTA'].forEach(key => {
      const el = this.root.querySelector(`#${UI_DOM_IDS[key]}`);
      if (el) el.textContent = '0.000';
    });
  }

  _syncColorInputs() {
    const sync = (id, value) => {
      const inp = this.root.querySelector(id);
      if (inp instanceof HTMLInputElement && typeof value === 'string') {
        inp.value = value;
      }
    };
    sync('#input-bg-color',      window._bgColorDark);
    sync('#input-sphere-color',  window._sphereBaseColor);
    sync('#input-peak1-color',   window._peakColor1);
    sync('#input-peak2-color',   window._peakColor2);
  }

  // ────────── ハンドラ ──────────

  _onTopView() {
    this.camera.position.set(0, 5, 0);
    this.camera.up.set(0, 0, -1);
    this.camera.lookAt(0, 0, 0);
    this.controls.update();
  }

  _onCameraHorizontalToggle(e) {
    this.controls.enableRotate = true;
    this.controls.autoRotate   = e.target.checked;
  }

  _onCameraVerticalToggle(e) {
    setEnableVertical(e.target.checked);
  }

  _onGridSphereToggle(e) {
    const mesh = this.scene.getObjectByName('earthGridPoints');
    if (mesh) mesh.visible = e.target.checked;
  }

  _onGroundVisibilityToggle(/* e */) {
    // GroundMesh は SceneModule 側で制御済み
  }

  _onHelperGridToggle(e) {
    const obj = this.scene.getObjectByName('HelperGrid');
    if (obj) obj.visible = e.target.checked;
  }

  _onHelperAxesToggle(e) {
    const obj = this.scene.getObjectByName('HelperAxes');
    if (obj) obj.visible = e.target.checked;
  }

  _onSpeedChange(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v > 0) setSpeedMultiplier(v);
    else { e.target.value = '1'; setSpeedMultiplier(1); }
  }

  _onSpeedPresetClick(e) {
   // クリックされた要素またはその親で .speed-preset-btn を探す
    const btn = /** @type {HTMLElement|null} */(
      e.target instanceof Element
        ? e.target.closest('.speed-preset-btn')
        : null
    );
    if (!btn) return;
    const speedVal = parseFloat(btn.dataset.speed);
    if (!isNaN(speedVal) && this._speedInput instanceof HTMLInputElement) {
      this._speedInput.value = String(speedVal);
      setSpeedMultiplier(speedVal);
    }
  }

  _onTextureSpeedChange(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setGroundTextureSpeed(v);
    else { e.target.value = '0'; setGroundTextureSpeed(0); }
  }

  _onTexturePresetClick(e) {
    const btn = /** @type {HTMLElement|null} */(
      e.target instanceof Element
        ? e.target.closest('.texture-preset-btn')
        : null
    );
    if (!btn) return;
    const v = parseFloat(btn.dataset.speed);
    if (!isNaN(v) && this._texInput instanceof HTMLInputElement) {
      this._texInput.value = String(v);
      setGroundTextureSpeed(v);
    }
  }

  _onBgColorInput(e) {
    const c = e.target.value;
    window._bgColorDark  = c;
    window._bgColorLight = c;
    this.renderer.setClearColor(c);
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
}
