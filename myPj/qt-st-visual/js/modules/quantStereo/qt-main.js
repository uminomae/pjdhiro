// js/modules/quantStereo/qt-main.js

import { initUI } from './qt-init/qt-st-init.js';
import { createAndAddPointCloud }        from './qt-st-pointcloud.js';
import { getX90Rotations }               from './qt-st-rotations.js';
import { RES_THETA, RES_PHI }            from './qt-config.js';
import { addHelpersAndLights } from './/qt-init/qt-st-init-helpers.js'; // 照明・ヘルパーのみ

let rotList = [];
let currentIndex = 0;
let pointCloudObj = null;

/**
 * initialize(context)
 * ────────────────────────────────────────────────────────────
 * 1) 照明と軸ヘルパーを追加
 * 2) UI を初期化 (initUI)
 * 3) 回転 quaternion リストを生成
 * 4) 初期の点群を作成
 * 5) Next Q イベントを window で待ち、押されるたびに点群を更新
 */
export function initialize({ scene, camera, renderer, controls }) {
  console.log('[qt-main] initialize() START');

  // 1) 照明と軸ヘルパー
  addHelpersAndLights(scene);
  console.log('[qt-main] addHelpersAndLights() 完了');

  // 2) UI 初期化
  initUI({ scene, camera, renderer, controls });
  console.log('[qt-main] initUI() 完了');

  // 3) 回転 quaternion リスト生成
  rotList = getX90Rotations();
  console.log('[qt-main] rotList =', rotList);

  // 4) 初期の点群を生成して scene に追加
  createInitialPointCloud(scene);
  console.log('[qt-main] 初期点群を追加');

  // 5) Next Q ボタンが押されたときのリスナー
  window.addEventListener('NEXT_QUATERNION', () => {
    currentIndex = (currentIndex + 1) % rotList.length;
    updatePointCloud(scene);
  });

  console.log('[qt-main] initialize() COMPLETE');
}


/**
 * createInitialPointCloud(scene)
 * ────────────────────────────────────────────────────────────
 * 最初の Index=0 の点群を作って scene に追加
 */
function createInitialPointCloud(scene) {
  console.log('[qt-main] createInitialPointCloud() index =', currentIndex);
  pointCloudObj = createAndAddPointCloud(
    scene,
    currentIndex,
    rotList[currentIndex],
    RES_THETA,
    RES_PHI
  );
}


/**
 * updatePointCloud(scene)
 * ────────────────────────────────────────────────────────────
 * 既存の pointCloudObj を scene から削除して、新たに再生成
 */
function updatePointCloud(scene) {
  console.log('[qt-main] updatePointCloud() index =', currentIndex);

  // 既存オブジェクトを削除
  if (pointCloudObj) {
    scene.remove(pointCloudObj);
    if (pointCloudObj.geometry) pointCloudObj.geometry.dispose();
    if (pointCloudObj.material) pointCloudObj.material.dispose();
    pointCloudObj = null;
    console.log('[qt-main] 既存 pointCloudObj を削除');
  }

  // 再生成して追加
  pointCloudObj = createAndAddPointCloud(
    scene,
    currentIndex,
    rotList[currentIndex],
    RES_THETA,
    RES_PHI
  );
  console.log('[qt-main] 新しい点群を追加');
}
