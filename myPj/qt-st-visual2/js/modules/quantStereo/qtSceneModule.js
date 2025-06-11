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
  constructor({ scene, camera, controls }) {
    this.scene    = scene;
    this.camera   = camera;
    this.controls = controls;
    this.dom      = new DOMEventManager();
    this.groundMesh = null;
  }

  init() {
    // 地面表示トグルのイベント登録
    const checkbox = document.getElementById('toggle-ground-visibility');
    this.dom.on(checkbox, 'change', () => {
      if (this.groundMesh) {
        this.groundMesh.visible = checkbox.checked;
      }
    });
    // 初期状態を反映
    this.sync();
  }

  sync() {
    // カメラ初期位置・向き
    const [x, y, z] = CAMERA_INITIAL_POSITION;
    this.camera.position.set(x, y, z);
    const [tx, ty, tz] = CAMERA_TARGET;
    this.camera.lookAt(tx, ty, tz);
    this.controls.update();

    // 背景色・ヘルパー・ライト
    this.scene.background = new THREE.Color(BG_COLOR_DARK);
    addHelpersAndLights(this.scene);

    // 地面メッシュの生成・表示同期
    if (!this.groundMesh) {
      this.groundMesh = addGroundWithTexture(
        this.scene,
        YIN_YANG_SYMBOL,
        { width: 10, depth: 10 }
      );
    }
    this.groundMesh.visible = GROUND_TEXTURE_VISIBLE;
    const cb = document.getElementById('toggle-ground-visibility');
    if (cb instanceof HTMLInputElement) {
      cb.checked = GROUND_TEXTURE_VISIBLE;
      this.dom.on(cb, 'change', () => {
        this.groundMesh.visible = cb.checked;
      });
    }
  }

  dispose() {
    this.dom.clear();
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.groundMesh = null;
  }
}
