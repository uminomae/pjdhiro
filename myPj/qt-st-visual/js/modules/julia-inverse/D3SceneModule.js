// modules/julia-inverse/D3SceneModule.js

import * as THREE               from 'three';
import { DOMEventManager }      from '../../core/DOMEventManager.js';
import { addHelpersAndLights, addGroundWithTexture } from './d3-helpers.js';
import {
  CAMERA_INITIAL_POSITION,
  CAMERA_TARGET,
  BG_COLOR_DARK,
  GROUND_TEXTURE_VISIBLE,
  YIN_YANG_SYMBOL
} from './d3-config.js';

export class D3SceneModule {
  constructor({ scene, camera, controls }) {
    this.scene      = scene;
    this.camera     = camera;
    this.controls   = controls;
    this.dom        = new DOMEventManager();
    this.groundMesh = null;
    this.groundVisible = GROUND_TEXTURE_VISIBLE;
  }

  /** カメラを真上から原点へ向ける */
  toTopView(zoom = 1) {
    // ① “上方向” を Z 軸正方向に
    // this.camera.up.set(0, 0, 1);

    // ② カメラを −Y 軸上に置く（Y軸プラス側ではなくマイナス側から見下ろす）
    const [, baseY] = CAMERA_INITIAL_POSITION;
    this.camera.position.set(0, baseY * zoom, 0);

    // ③ 原点（または CAMERA_TARGET）を注視
    const [tx, ty, tz] = CAMERA_TARGET;
    this.camera.lookAt(tx, ty, tz);

    // ④ ロール（Z 回転）をクリア
    this.camera.rotation.z = 0;

    // ⑤ OrbitControls の注視点をリセット
    this.controls.target.set(tx, ty, tz);

    // ⑥ スクリーンスペースパンはオフに（必要ならお好みで）
    this.controls.screenSpacePanning = true;
    this.controls.enableRotate         = true;

    // ⑦ 最後に必ず update()
    this.controls.update();
  }

  
  init() {
    const cb = document.getElementById('toggle-ground-visibility');
    if (!(cb instanceof HTMLInputElement)) return;

    // ← ② チェックボックスに保存値をセット
    cb.checked = this.groundVisible;

    // ← ③ change ハンドラで状態を更新
    this.dom.on(cb, 'change', () => {
      this.groundVisible = cb.checked;
      if (this.groundMesh) {
        this.groundMesh.visible = this.groundVisible;
      }
    });

    this.sync();
    console.log('[D3SceneModule] init() 完了');
  }


  // init() {
  //   // トグル用チェックボックス登録
  //   const cb = document.getElementById('toggle-ground-visibility');
  //   cb.checked = this.groundVisible;
  //   if (cb instanceof HTMLInputElement) {
  //     this.dom.on(cb, 'change', () => {
  //       if (this.groundMesh) {
  //         this.groundMesh.visible = cb.checked;
  //       }
  //     });
  //   }
  //   this.sync();
  //   console.log('[D3SceneModule] init() 完了');
  // }

  sync() {
    // カメラ位置
    this.camera.up.set(0, 1, 0);
    const [x,y,z] = CAMERA_INITIAL_POSITION;
    this.camera.position.set(x,y,z);
    const [tx,ty,tz] = CAMERA_TARGET;
    this.camera.lookAt(tx,ty,tz);

    this.camera.rotation.z = 0;
    this.controls.target.set(tx, ty, tz);
    this.controls.update();

    // 背景色＋ヘルパー
    this.scene.background = new THREE.Color(BG_COLOR_DARK);
    addHelpersAndLights(this.scene);

    // 地面生成＋表示同期
    if (!this.groundMesh) {
      this.groundMesh = addGroundWithTexture(
        this.scene,
        YIN_YANG_SYMBOL
      );
    }
    // this.groundMesh.visible = GROUND_TEXTURE_VISIBLE;
    this.groundMesh.visible = this.groundVisible;

    // HTML 側チェック状態も合わせる
    const checkbox = document.getElementById('toggle-ground-visibility');
    if (checkbox instanceof HTMLInputElement) {
      checkbox.checked = this.groundMesh.visible;
      // checkbox.checked = GROUND_TEXTURE_VISIBLE;
    }
  }

  dispose() {
    this.dom.clear();
    while (this.scene.children.length) {
      this.scene.remove(this.scene.children[0]);
    }
    this.groundMesh = null;
    console.log('[D3SceneModule] dispose() 完了');
  }
}
