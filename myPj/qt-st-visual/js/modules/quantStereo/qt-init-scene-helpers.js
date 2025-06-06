// js/modules/quantStereo/qt-init-helpers.js

import * as THREE from 'three';
import {
  GRID_SIZE, GRID_DIVISIONS, GRID_COLOR_CENTERLINE, GRID_COLOR,
  AXES_SIZE,
  GROUND_TEXTURE_OPACITY,
  CAMERA_INITIAL_POSITION,
  CAMERA_TARGET,
  YIN_YANG_SYMBOL
} from './qt-config.js';

let groundMesh;
let groundTexture;
/**
 * initializeScene(scene, camera, controls)
 * ---------------------------------------
 * ・カメラの初期位置と lookAt を設定
 * ・OrbitControls の自動回転・回転制限はここでは除外し、呼び出し元で制御しても OK
 * ・背景色、照明／ヘルパー、床メッシュを追加、床の表示切り替えイベントを登録
 */
export function initializeScene({ scene, camera, controls }) {
  // 1) カメラ初期位置
  camera.position.set(
    CAMERA_INITIAL_POSITION[0],
    CAMERA_INITIAL_POSITION[1],
    CAMERA_INITIAL_POSITION[2]
  );
  // 2) カメラの注視点（lookAt）
  const [tx, ty, tz] = CAMERA_TARGET;
  camera.lookAt(tx, ty, tz);
  controls.update();

  // 3) シーン背景色、照明・ヘルパーを追加
  scene.background = new THREE.Color(0x000011);
  addHelpersAndLights(scene);

  // 4) 床メッシュを追加し、トグル用イベントを登録
  groundMesh = addGroundWithTexture(
    scene,
    YIN_YANG_SYMBOL,
    { width: 10, depth: 10 }
  );
  setupGroundToggle();
}

function setupGroundToggle() {
  const checkbox = document.getElementById('toggle-ground-visibility');
  if (!checkbox) {
    console.warn('[qt-st-main] toggle-ground-visibility が見つかりません');
    return;
  }
  groundMesh.visible = checkbox.checked;
  checkbox.addEventListener('change', () => {
    if (groundMesh) {
      groundMesh.visible = checkbox.checked;
    }
  });
}


/**
 * addHelpersAndLights(scene)
 * ────────────────────────────────────────────────────────────
 * シーンに照明・軸ヘルパー・床グリッドを追加します。
 *
 * @param {THREE.Scene} scene
 */
export function addHelpersAndLights(scene) {
  // ───────────────────────────────────────────────
  // (1) Ambient Light
  // ───────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  // ───────────────────────────────────────────────
  // (2) Directional Light
  // ───────────────────────────────────────────────
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // ───────────────────────────────────────────────
  // (3) Axes Helper (X=赤, Y=緑, Z=青)
  // ───────────────────────────────────────────────
  const axesHelper = new THREE.AxesHelper(AXES_SIZE);
  axesHelper.name = 'HelperAxes'; 
  scene.add(axesHelper);

  // ───────────────────────────────────────────────
  // (4) Grid Helper (床平面用グリッド)
  // ───────────────────────────────────────────────
  const gridHelper = new THREE.GridHelper(
    GRID_SIZE,
    GRID_DIVISIONS,
    GRID_COLOR_CENTERLINE,
    GRID_COLOR
  );
  gridHelper.name = 'HelperGrid';
  scene.add(gridHelper);
}

/**
 * addGroundWithTexture(scene, textureUrl, options)
 * --------------------------------------------------
 * XZ 平面（Y=0）に指定画像を貼り付ける関数。
 *
 * @param {THREE.Scene} scene
 * @param {string} textureUrl   - 画像ファイルの URL
 * @param {Object} [options]    - オプション
 *   - width {number}         : 平面の幅（X方向）。デフォルト 10
 *   - depth {number}         : 平面の奥行き（Z方向）。デフォルト 10
 * @returns {THREE.Mesh}        - 作成した床面メッシュ
 */
export function addGroundWithTexture(
  scene,
  textureUrl,
  options = {}
) {
  const {
    width   = 10,
    depth   = 10
  } = options;

  // ──────────────────────────────────────────────────
  // (1) テクスチャを読み込む
  // ──────────────────────────────────────────────────
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    textureUrl,
    () => {
      // 読み込み成功時にテクスチャ特性を設定
      texture.wrapS = THREE.ClampToEdgeWrapping;;
      texture.wrapT = THREE.ClampToEdgeWrapping;;
      texture.repeat.set(1, 1);
      texture.anisotropy = 8; // 必要に応じてアンチエイリアス向上

      // ★重要: texture の回転中心をメッシュの中心にセット
      texture.center.set(0.5, 0.5);
      // 最初は回転 0
      texture.rotation = 0;

    },
    undefined,
    (err) => {
      console.error('[addGroundWithTexture] テクスチャの読み込みに失敗:', err);
    }
  );
  groundTexture = texture;
  // ──────────────────────────────────────────────────
  // (2) 床面用のジオメトリとマテリアルを作成
  // ──────────────────────────────────────────────────
  const geom = new THREE.PlaneGeometry(width, depth);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide, // 必要なら裏表両方に
    transparent: true,      // 透明を許可
    alphaTest: 0.01,         // 「テクスチャの alpha 値が 0.5 未満なら＝透過扱い
    opacity: GROUND_TEXTURE_OPACITY 
  });
  // ──────────────────────────────────────────────────
  // (3) メッシュを作成し、XZ 平面に配置
  // ──────────────────────────────────────────────────
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.x = -Math.PI / 2; // デフォルトの平面は XY 平面なので X 軸回転で XZ 平面に
  mesh.position.y = 0;           // Y=0 に置く（地面とする）
  mesh.receiveShadow = true;     // もしシャドウを受けたい場合
  mesh.name = 'GroundMesh';  

  // ──────────────────────────────────────────────────
  // (4) シーンに追加
  // ──────────────────────────────────────────────────
  scene.add(mesh);
  return mesh;
}


/**
 * getGroundTexture()
 * ・他から groundTexture.rotation を参照・更新したりできるよう
 */
export function getGroundTexture() {
  return groundTexture;
}

/**
 * getGroundMesh()
 * ・もしメッシュ自体を操作したければ呼び出せる
 */
export function getGroundMesh() {
  return groundMesh;
}


/**
 * resetScene(scene, camera, controls)
 *
 * ・シーン内の全オブジェクトを削除
 * ・背景色を初期色 (#000011) に戻す
 * ・照明 / ヘルパーを再追加
 * ・（必要なら）カメラ位置やコントロールもリセット可能
 *
 * @param {THREE.Scene}   scene
 * @param {THREE.Camera}  camera    ※カメラリセットが必要なら利用
 * @param {OrbitControls} controls  ※controls.update() など
 */
export function resetScene(scene, camera, controls) {
  // 1) シーン内オブジェクトをすべて削除
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  // 2) 背景色を “初期のダーク (#000011)” に戻す
  scene.background = new THREE.Color('#000011');

  // 3) 照明 + 軸ヘルパーを再追加
  addHelpersAndLights(scene);

}