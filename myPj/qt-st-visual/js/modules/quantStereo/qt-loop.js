// js/modules/quantStereo/qt-loop.js

import * as THREE from 'three';
import { FULL_CYCLE, HALF_CYCLE, ROTATION_SPEED, RES_THETA, RES_PHI } from './qt-config.js';
import { create, normalize } from './qt-quat-utils.js';
import { overlayEarthGridAndProjection } from './qt-pointcloud.js';

/**
 * clock をこのファイル内で管理する
 */
const clock = new THREE.Clock();

// 背景色の「暗⇔明」を定義
const colorDark  = new THREE.Color(0x000011); // 夜空っぽいダークブルー
const colorLight = new THREE.Color(0xffffff); // ピュアホワイト

/**
 * startAnimationLoop(scene, controls)
 *
 * ・内部で THREE.Clock を用いて経過時間を管理
 * ・θ = (elapsed * ω) % (4π) として 720° 一周にする
 * ・overlayEarthGridAndProjection() を呼び出して、球の描画を更新
 * ・背景色（空）と、球のオーバーレイ色を条件分岐で切り替える
 *
 * @param {THREE.Scene}  scene
 * @param {THREE.Camera} camera   // もし camera がコントローラで必要なら渡す（今回は不要）
 * @param {THREE.Renderer} renderer // 必要に応じて渡す
 * @param {OrbitControls} controls  // カメラ操作用コントローラ (optional)
 */
export function startAnimationLoop(scene, camera, renderer, controls) {
  (function loop() {
    requestAnimationFrame(loop);

    // (A) 経過時間から回転角 θ を得る
    const elapsed = clock.getElapsedTime();      // 経過秒数
    const omega   = ROTATION_SPEED;              // 毎秒 90° (π/2 rad)
    const theta   = (elapsed * omega) % FULL_CYCLE; // θ ∈ [0, 4π)

    // (B) θ に応じた四元数 qRot（x 軸回転）を生成
    const half = theta / 2;
    const qRot = normalize(create(Math.cos(half), Math.sin(half), 0, 0));

    // (C) 地球グリッド＋ステレオ投影球を再描画
    overlayEarthGridAndProjection(scene, qRot, RES_THETA, RES_PHI);

    // (D) θ に応じた背景色の補間
    let bgColor;
    if (theta < HALF_CYCLE) {
      // 0 ≤ θ < 2π: 暗 → 明
      const t = theta / HALF_CYCLE; // 0→1
      bgColor = colorDark.clone().lerp(colorLight, t);
    } else {
      // 2π ≤ θ < 4π: 明 → 暗
      const t = (theta - HALF_CYCLE) / HALF_CYCLE; // 0→1
      bgColor = colorLight.clone().lerp(colorDark, t);
    }
    scene.background = bgColor;

    // (E) θ に応じた球のオーバーレイカラー設定
    const projObj = scene.getObjectByName('quaternionSpherePoints');
    if (projObj && projObj.material) {
      if (theta < HALF_CYCLE) {
        // 0 ≤ θ < 2π のあいだ、球は白
        projObj.material.color.set(0xffffff);
        projObj.material.opacity = 1.0;
        projObj.material.transparent = true;
      } else {
        // 2π ≤ θ < 4π のあいだ、球は黒
        projObj.material.color.set(0x000000);
        projObj.material.opacity = 1.0;
        projObj.material.transparent = true;
      }
    }

    // (F) カメラ操作用コントローラがあれば更新
    if (controls) {
      controls.update();
    }
  })();
}
