// js/modules/quantStereo/qt-main.js
import * as THREE from 'three';
import { initUI } from './qt-init.js';
import { addHelpersAndLights } from './qt-init-helpers.js';
import { startAnimationLoop } from './qt-loop.js';
const colorDark  = new THREE.Color(0x000011); // 夜空っぽいダークブルー

/**
 * initialize(context)
 *  1) 背景色をリセット（描画のクリア）
 *  2) 照明＋軸ヘルパーを追加
 *  3) UI を初期化
 *  4) 自動アニメーションループを開始
 */
export function startModule({ scene, camera, renderer, controls }) {
  console.log('[qt-main] initialize() START');

  // (1) 背景色をダーク
  scene.background = colorDark.clone();

  // (2) 照明と軸ヘルパー
  addHelpersAndLights(scene);

  // (3) UI 初期化 (必要なスライダーやボタンの初期化)
  initUI({ scene, camera, renderer, controls });

  // (4) 自動アニメーションループ開始
  startAnimationLoop(scene, camera, renderer, controls);

  console.log('[qt-main] initialize() COMPLETE');
}

