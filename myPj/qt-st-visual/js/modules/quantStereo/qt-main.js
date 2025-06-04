// js/modules/quantStereo/qt-main.js

import { initUI } from './qt-init.js';
import { addHelpersAndLights } from './qt-init-helpers.js';
import {
  overlayEarthGridAndProjection
} from './qt-pointcloud.js';
import { RES_THETA, RES_PHI } from './qt-config.js';
import { create, normalize } from './qt-quat-utils.js';
import * as THREE from 'three';

let clock = new THREE.Clock();

// 背景色の「暗⇔明」を定義
const colorDark  = new THREE.Color(0x000011); // 夜空っぽいダークブルー
const colorLight = new THREE.Color(0xffffff); // ピュアホワイト

/**
 * initialize(context)
 *  1) 背景色をダークに設定
 *  2) 照明＋軸ヘルパーを追加
 *  3) UI を初期化
 *  4) 自動アニメーションループを開始
 */
export function initialize({ scene, camera, renderer, controls }) {
  console.log('[qt-main] initialize() START');

  // (1) 背景色をダーク
  scene.background = colorDark.clone();

  // (2) 照明と軸ヘルパー
  addHelpersAndLights(scene);

  // (3) UI 初期化 (必要なスライダーやボタンの初期化)
  initUI({ scene, camera, renderer, controls });

  // (4) 自動アニメーションループ開始
  animateLoop(scene);

  console.log('[qt-main] initialize() COMPLETE');
}

/**
 * animateLoop(scene)
 *   ・経過時間に応じた四元数 qRot を計算
 *   ・overlayEarthGridAndProjection() で
 *       「地球グリッド(青) + ステレオ投影球(白→黒)」を再描画
 *   ・背景色を θ に応じて暗<→>明 に補間
 *   ・球のオーバーレイカラー(白 or 黒) を θ で切り替え
 */
function animateLoop(scene) {
  (function loop() {
    requestAnimationFrame(loop);

    // (A) 経過時間から回転角 θ を得る
    const elapsed = clock.getElapsedTime();    // 経過秒数
    const omega = Math.PI / 2;                 // 毎秒 90° (π/2 rad)
    const theta = (elapsed * omega) % (2 * Math.PI); // θ ∈ [0, 2π)

    // (B) θ に応じた四元数 qRot（x 軸まわりの回転）を生成
    const half = theta / 2;
    const qRot = normalize(create(Math.cos(half), Math.sin(half), 0, 0));

    // (C) 「地球グリッド(青) + ステレオ投影球(白→黒)」を再描画
    overlayEarthGridAndProjection(scene, qRot, RES_THETA, RES_PHI);

    // (D) θ に応じた背景色の補間
    let bgColor;
    if (theta < Math.PI) {
      // 0 ≤ θ < π: 暗 → 明
      const t = theta / Math.PI; // 0→1
      bgColor = colorDark.clone().lerp(colorLight, t);
    } else {
      // π ≤ θ < 2π: 明 → 暗
      const t = (theta - Math.PI) / Math.PI; // 0→1
      bgColor = colorLight.clone().lerp(colorDark, t);
    }
    scene.background = bgColor;

    // (E) θ に応じた「球の全面オーバーレイカラー」を設定
    const projObj = scene.getObjectByName('quaternionSpherePoints');
    if (projObj && projObj.material) {
      if (theta < Math.PI) {
        projObj.material.color.set(0xffffff);
        projObj.material.opacity = 1.0;
        projObj.material.transparent = true;
      } else {
        projObj.material.color.set(0x000000);
        projObj.material.opacity = 1.0;
        projObj.material.transparent = true;
      }
    }

    // カメラ操作用コントローラがあれば更新
    if (scene.controls) scene.controls.update();
  })();
}
