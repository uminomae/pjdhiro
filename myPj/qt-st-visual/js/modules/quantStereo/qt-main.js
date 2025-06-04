// js/modules/quantStereo/qt-main.js

import { initUI } from './qt-init.js';
import { addHelpersAndLights } from './qt-init-helpers.js';
import {
  overlayEarthGridAndProjection
} from './qt-pointcloud.js';

// ↓ ここで定数をインポート
import { RES_THETA, RES_PHI, FULL_CYCLE, HALF_CYCLE, ROTATION_SPEED } from './qt-config.js';

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
 *   ・経過時間から回転角 theta を得る (0 ～ 4π)
 *   ・overlayEarthGridAndProjection() で
 *       「地球グリッド(青) + ステレオ投影球(グレースケール)」を再描画
 *   ・背景色を 0 ≤ θ < 2π: 暗 → 明、2π ≤ θ < 4π: 明 → 暗
 *   ・球の全面オーバーレイカラー（白 or 黒）も
 *     0 ≤ θ < 2π: 白、2π ≤ θ < 4π: 黒 に分岐
 */
function animateLoop(scene) {
  (function loop() {
    requestAnimationFrame(loop);

    // (A) 経過時間から回転角 θ を得る
    const elapsed = clock.getElapsedTime();      // 経過秒数
    const omega   = ROTATION_SPEED;              // 毎秒 90° (π/2 rad)
    // FULL_CYCLE = 4π: 720度で一周させる
    const theta   = (elapsed * omega) % FULL_CYCLE; // θ ∈ [0, 4π)

    // (B) θ に応じた四元数 qRot（x 軸まわりの回転）を生成
    //     ※ half = θ/2 なので、1回転(360°)で qRot は２回転分になるが、
    //        あくまで「θ の進み」を 720度に引き延ばしたいだけなので問題なし
    const half = theta / 2;
    const qRot = normalize(create(Math.cos(half), Math.sin(half), 0, 0));

    // (C) 「地球グリッド(青) + ステレオ投影球(白→黒)」を再描画
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

    // (E) θ に応じた「球の全面オーバーレイカラー」を設定
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

    // カメラ操作用コントローラがあれば更新
    if (scene.controls) scene.controls.update();
  })();
}
