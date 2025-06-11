// js/modules/quantStereo/qt-animation-loop.js
import * as THREE from 'three';
import { create, normalize } from './qt-math-quat-utils.js';
import { overlayEarthGridAndProjection } from './qt-render-pointcloud.js';
import { getGroundTexture } from './qt-init-scene-helpers.js';
import * as Config            from './qt-config.js';

export class AnimationController {
  constructor(scene, camera, controls) {
    this.scene    = scene;
    this.camera   = camera;
    this.controls = controls;
    this.initState();
  }

  initState() {
    this.clock               = null;
    this.rafId               = null;
    this.isPaused            = false;
    this.accumulatedTime     = 0;
    this.speedMultiplier     = 1;
    this.textureSpeed        = Config.TEXTURE_DEFAULT_SPEED;
    this.enableVerticalAnim  = Config.CAMERA_OSCILLATION_ENABLED;
  }

  start() {
    if (this.rafId !== null) return;
    this.clock           = new THREE.Clock();
    this.isPaused        = false;
    this.accumulatedTime = 0;
    this.loop();
  }

  loop() {
    if (this.isPaused) return;
    const elapsed = this.clock.getElapsedTime() + this.accumulatedTime;
    const theta   = this._updateRotation(elapsed);
    this._updateTexture(elapsed);
    if (this.enableVerticalAnim) this._updateVertical(elapsed);
    this._renderGridAndSphere(theta);
    this._updateBackground(theta);
    this._updateSphereColor(theta);
    this.controls.update();
    this._updateCameraPositionDisplay();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  pause() {
    if (this.rafId === null || this.isPaused) return;
    this.accumulatedTime += this.clock.getElapsedTime();
    cancelAnimationFrame(this.rafId);
    this.rafId    = null;
    this.isPaused = true;
  }

  resume() {
    if (!this.isPaused || this.rafId !== null) return;
    this.clock    = new THREE.Clock();
    this.isPaused = false;
    this.loop();
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.initState();
  }

  
  /** 回転量を計算して theta を返す */
  _updateRotation(elapsed) {
    const theta = (elapsed * Config.ROTATION_SPEED * this.speedMultiplier) % Config.FULL_CYCLE;
    this.accumulatedTime = elapsed - this.clock.getElapsedTime();  // 保持しておく
    return theta;
  }

  /** 地面テクスチャの回転 */
  _updateTexture(elapsed) {
    const tex = getGroundTexture();
    // 回転させたい角度 = 経過時間 × textureSpeedMultiplier
    // ※必要に応じて speedMultiplier を掛けたい場合はここで掛け算
    if (tex) tex.rotation = elapsed * this.textureSpeed;
  }

  /** カメラの垂直オシレーション */
  _updateVertical(elapsed) {
    const r   = this.camera.position.length();
    const phi = Math.atan2(this.camera.position.z, this.camera.position.x);
    const raw = (elapsed * Config.CAMERA_OSCILLATION_SPEED) % (2 * Config.CAMERA_OSCILLATION_RANGE);
    const osc = raw <= Config.CAMERA_OSCILLATION_RANGE
      ? raw
      : (2 * Config.CAMERA_OSCILLATION_RANGE - raw);
    this.camera.position.set(
      r * Math.sin(osc) * Math.cos(phi),
      r * Math.cos(osc),
      r * Math.sin(osc) * Math.sin(phi)
    );
    this.camera.lookAt(...Config.CAMERA_TARGET);
  }

  /** 四元数回転＋グリッド／投影球の再描画 */
  _renderGridAndSphere(theta) {
    const halfQ = theta / 2;
    const qRot  = normalize(
      create(
        Math.cos(halfQ),
        Math.sin(halfQ), 
        0, 
        0
      )
    );
    overlayEarthGridAndProjection(
      this.scene, qRot, Config.RES_THETA, Config.RES_PHI
    );
  }

  /** 背景色の補間 */
  _updateBackground(theta) {
    // window にセットされた _bgColorDark/_bgColorLight を優先
    const bgDark  = this._getColorOrDefault('_bgColorDark',  Config.BG_COLOR_DARK);
    const bgLight = this._getColorOrDefault('_bgColorLight', Config.BG_COLOR_LIGHT);
    if (theta < Config.HALF_CYCLE) {
      const t = Math.pow(theta / Config.HALF_CYCLE, Config.BG_EXPONENT_RISE); // 暗→明 の調整カーブ
      this.scene.background = bgDark.clone().lerp(bgLight, t);
    } else {
      const t = Math.pow((theta - Config.HALF_CYCLE) / Config.HALF_CYCLE, Config.BG_EXPONENT_FALL);  // 暗→明 の調整カーブ
      this.scene.background = bgLight.clone().lerp(bgDark, t);
    }
  }

  /** 投影球のカラー補間 */
  _updateSphereColor(theta) {
    const obj    = this.scene.getObjectByName('quaternionSpherePoints');
    if (!obj?.material) return;
    const deg    = ((theta % Config.HALF_CYCLE) / Config.HALF_CYCLE) * 360;
     // window 上の _sphereBaseColor / _peakColor1 / _peakColor2 を優先
     const base = this._getColorOrDefault('_sphereBaseColor', Config.SPHERE_BASE_COLOR);
     const mid  = this._getColorOrDefault('_peakColor1',       Config.SPHERE_MID_COLOR);
     const end  = this._getColorOrDefault('_peakColor2',       Config.SPHERE_END_COLOR);

    const color  = new THREE.Color();

    // 4段階補間ロジック
    if (theta < Config.HALF_CYCLE) {
      if (deg < 120)      color.copy(base).lerp(mid,   deg / 120);
      else if (deg < 240) color.copy(mid ) .lerp(end,  (deg - 120) / 120);
      else                color.copy(end ) .lerp(mid,  (deg - 240) / 120);
    } else {
      if (deg < 120)      color.copy(mid ) .lerp(end,   deg / 120);
      else if (deg < 240) color.copy(end ) .lerp(mid,  (deg - 120) / 120);
      else                color.copy(mid ) .lerp(base, (deg - 240) / 120);
    }

    obj.material.color       = color;
    obj.material.transparent = true;
    obj.material.opacity     = 1.0;
  }

  /** カメラ座標表示の更新 */
  _updateCameraPositionDisplay() {
    const disp = document.getElementById('camera-position-display');
    if (disp) {
      const p = this.camera.position;
      disp.innerText = `x=${p.x.toFixed(1)}, y=${p.y.toFixed(1)}, z=${p.z.toFixed(1)}`;
    }
  }
  

  setSpeedMultiplier(v) {
    const n = parseFloat(v);
    if (!isNaN(n) && n > 0) this.speedMultiplier = n;
  }

  setTextureSpeed(v) {
    const n = parseFloat(v);
    if (!isNaN(n)) this.textureSpeed = n;
  }

  setEnableVertical(flag) {
    this.enableVerticalAnim = Boolean(flag);
  }

  /**
  * window 上の変数(varName) を THREE.Color として返す。
  * 文字列 or カラーオブジェクトがなければ defaultHex を THREE.Color にして返す。
  */
  _getColorOrDefault(varName, defaultHex) {
    const v = window[varName];
    if (v instanceof THREE.Color) return v;
    if (typeof v === 'string') return new THREE.Color(v);
    return new THREE.Color(defaultHex);
  }
}
