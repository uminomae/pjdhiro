// js/modules/quantStereo/qt-init-helpers.js

import * as THREE from 'three';
import {
  GRID_SIZE,
  GRID_DIVISIONS,
  GRID_COLOR_CENTERLINE,
  GRID_COLOR,
  AXES_SIZE
} from './qt-config.js';
import { GROUND_TEXTURE_OPACITY } from './qt-config.js';

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
 *   - repeatX {number}       : テクスチャを X 方向に何回タイルさせるか。デフォルト 1
 *   - repeatZ {number}       : テクスチャを Z 方向に何回タイルさせるか。デフォルト 1
 * @returns {THREE.Mesh}        - 作成した床面メッシュ
 */
export function addGroundWithTexture(
  scene,
  textureUrl,
  options = {}
) {
  const {
    width   = 10,
    depth   = 10,
    repeatX = 1,
    repeatZ = 1
  } = options;

  // ──────────────────────────────────────────────────
  // (1) テクスチャを読み込む
  // ──────────────────────────────────────────────────
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    textureUrl,
    () => {
      // 読み込み成功時にテクスチャ特性を設定
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatX, repeatZ);
      texture.anisotropy = 8; // 必要に応じてアンチエイリアス向上
    },
    undefined,
    (err) => {
      console.error('[addGroundWithTexture] テクスチャの読み込みに失敗:', err);
    }
  );

  // ──────────────────────────────────────────────────
  // (2) 床面用のジオメトリとマテリアルを作成
  // ──────────────────────────────────────────────────
  const geom = new THREE.PlaneGeometry(width, depth);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide, // 必要なら裏表両方に
  //   transparent: false
  // });

  // MeshBasicMaterial に透明設定を入れ、alphaTest で「ある値以下（黒）のピクセルを描かない」ようにする
    transparent: true,      // 透明を許可
    alphaTest: 0.01,         // 「テクスチャの alpha 値が 0.5 未満なら描画しない＝透過扱いにする」
    opacity: GROUND_TEXTURE_OPACITY 
    // ※黒背景PNGにアルファが無い場合、「黒色を透過させたい」が目的なら、
    // 例えば r,g,b のいずれかが 0 の場合は透明扱い、という仕組みを別途シェーダで
    // 実装する必要があります。ただし多くの場合、PNG自体が黒バックではなく
    // アルファ付きPNGになっていればこれだけで黒い背景が透過されます。
  });
  // ──────────────────────────────────────────────────
  // (3) メッシュを作成し、XZ 平面に配置
  // ──────────────────────────────────────────────────
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.x = -Math.PI / 2; // デフォルトの平面は XY 平面なので X 軸回転で XZ 平面に
  mesh.position.y = 0;           // Y=0 に置く（地面とする）
  mesh.receiveShadow = true;     // もしシャドウを受けたい場合

  // ──────────────────────────────────────────────────
  // (4) シーンに追加
  // ──────────────────────────────────────────────────
  scene.add(mesh);
  return mesh;
}