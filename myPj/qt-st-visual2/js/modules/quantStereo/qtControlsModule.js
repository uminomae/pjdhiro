// js/core/ControlsModule.js
import { DOMEventManager } from '../../core/DOMEventManager.js';
import { setEnableVertical } from './qt-animation-loop.js';
import {
  CAMERA_AUTO_ROTATE_ENABLED,
  CAMERA_AUTO_ROTATE_PERIOD,
  CAMERA_POLAR_ANGLE,
  CAMERA_AZIMUTH_ANGLE
} from './qt-config.js';

/**
 * OrbitControls 周りの設定・イベント管理をまとめるクラス
 */
export class ControlsModule {
  /**
   * @param {{ controls: import('three/examples/jsm/controls/OrbitControls').OrbitControls }} options
   */
  constructor({ controls }) {
    this.controls = controls;
    this.dom      = new DOMEventManager();
  }

  /** 初期化：既存 initializeControls() のロジックを丸ごと移植 */
  init() {
    // ────────────────────────────────
    // ● 水平自動回転 on/off & 速度設定
    const elHoriz = document.getElementById('toggle-camera-horizontal');
    if (elHoriz instanceof HTMLInputElement) {
      // 初期状態設定
      this.controls.enableRotate = true;
      this.controls.autoRotate = elHoriz.checked && CAMERA_AUTO_ROTATE_ENABLED;
      // 回転速度
      if (CAMERA_AUTO_ROTATE_ENABLED) {
        this.controls.autoRotateSpeed = 360 / CAMERA_AUTO_ROTATE_PERIOD;
      }
      // リスナ登録
      this.dom.on(elHoriz, 'change', () => {
        this.controls.enableRotate = true;
        this.controls.autoRotate = elHoriz.checked && CAMERA_AUTO_ROTATE_ENABLED;
      });
    }

    // ────────────────────────────────
    // ● 角度制限
    this.controls.minPolarAngle   = CAMERA_POLAR_ANGLE.MIN;
    this.controls.maxPolarAngle   = CAMERA_POLAR_ANGLE.MAX;
    this.controls.minAzimuthAngle = CAMERA_AZIMUTH_ANGLE.MIN;
    this.controls.maxAzimuthAngle = CAMERA_AZIMUTH_ANGLE.MAX;

    // ────────────────────────────────
    // ● 垂直往復トグル
    const elVert = document.getElementById('toggle-camera-vertical');
    if (elVert instanceof HTMLInputElement) {
      // 初期状態に反映
      setEnableVertical(elVert.checked);
      // リスナ登録
      this.dom.on(elVert, 'change', () => {
        setEnableVertical(elVert.checked);
      });
    }
  }

  /** dispose：登録したリスナを一括解除 */
  dispose() {
    this.dom.clear();
  }
}
