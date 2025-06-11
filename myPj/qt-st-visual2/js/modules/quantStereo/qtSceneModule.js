// js/core/SceneModule.js
import { DOMEventManager } from '../../core/DOMEventManager.js';
import * as THREE from 'three';
import {
  addHelpersAndLights,
  addGroundWithTexture
} from './qt-init-scene-helpers.js';
import {
  YIN_YANG_SYMBOL,
  CAMERA_INITIAL_POSITION,
  CAMERA_TARGET,
  GROUND_TEXTURE_VISIBLE,
  BG_COLOR_DARK
} from './qt-config.js';

export class SceneModule {
  /**
   * @param {{ scene: THREE.Scene, camera: THREE.Camera, controls: any }} context
   */
  constructor({ scene, camera, controls }) {
    this.scene    = scene;
    this.camera   = camera;
    this.controls = controls;
    this.dom      = new DOMEventManager();
    this.groundMesh = null;
  }

  /**
   * シーンの初期化
   */
  init() {
    // --- カメラ初期位置・向き設定 ---
    const [x, y, z] = CAMERA_INITIAL_POSITION;
    this.camera.position.set(x, y, z);
    const [tx, ty, tz] = CAMERA_TARGET;
    this.camera.lookAt(tx, ty, tz);
    this.controls.update();

    // --- 背景色・ヘルパー・ライトの追加 ---
    this.scene.background = new THREE.Color(BG_COLOR_DARK);
    addHelpersAndLights(this.scene);

    // --- 地面メッシュの追加 & イベント登録 ---
    this.groundMesh = addGroundWithTexture(
      this.scene,
      YIN_YANG_SYMBOL,
      { width: 10, depth: 10 }
    );

    const checkbox = document.getElementById('toggle-ground-visibility');
    const initialVisible = GROUND_TEXTURE_VISIBLE;
    this.groundMesh.visible = initialVisible;
    if (checkbox instanceof HTMLInputElement) {
      // 初期表示とイベントを DOMEventManager で管理
      checkbox.checked = initialVisible;
      // this.groundMesh.visible = checkbox.checked;
      this.dom.on(checkbox, 'change', () => {
        this.groundMesh.visible = checkbox.checked;
      });
    } else {
      console.warn('[SceneModule] toggle-ground-visibility が見つかりません');
    }
  }

  /**
   * 登録したイベントを解除し、シーンをクリア
   */
  dispose() {
    // イベントリスナを一括解除
    this.dom.clear();

    // シーン内オブジェクトをすべて削除
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }
}
