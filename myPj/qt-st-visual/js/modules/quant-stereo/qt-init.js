// js/modules/quant-stereo/init.js

// import { THREE, OrbitControls } from '../app.js';
import * as THREE from 'three';
import { createQuaternionStereographicPoints } from './qt-utils.js';

/**
 * 四元数ステレオ投影モジュールの初期化関数。
 * 「main.js」から次のように呼ばれることを想定：
 *   import { initialize } from './modules/quant-stereo/init.js';
 *   initialize({ scene, camera, renderer, controls });
 *
 * @param {object} opts
 * @param {THREE.Scene} opts.scene
 * @param {THREE.Camera} opts.camera
 * @param {THREE.Renderer} opts.renderer
 * @param {OrbitControls} opts.controls
 */
export function initialize({ scene, camera, renderer, controls }) {
  // 1) Offcanvas フォームからパラメータを読む（初期描画用デフォルト）
  //    例: document.getElementById('input-res-theta').value など
  const resTheta = parseInt(document.getElementById('input-res-theta')?.value || 50, 10);
  const resPhi   = parseInt(document.getElementById('input-res-phi')?.value || 50, 10);
  const projType = document.querySelector('input[name="proj-type"]:checked')?.value || 'north';

  // 2) 点群データを生成
  const pointsData = createQuaternionStereographicPoints(resTheta, resPhi, projType);

  // 3) Three.js の BufferGeometry + PointsMaterial で点群を作る
  const geometry = new THREE.BufferGeometry();
  const n = pointsData.length;
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);

  pointsData.forEach((pt, i) => {
    positions[3 * i + 0] = pt.position.x;
    positions[3 * i + 1] = pt.position.y;
    positions[3 * i + 2] = pt.position.z;
    colors[3 * i + 0] = pt.color.r;
    colors[3 * i + 1] = pt.color.g;
    colors[3 * i + 2] = pt.color.b;
  });

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.03,
    sizeAttenuation: true
  });

  const pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);

  // 4) 「設定完了」ボタンが押されたら再描画するリスナーを貼る
  const configBtn = document.getElementById('config-complete-btn');
  if (configBtn) {
    configBtn.addEventListener('click', () => {
      // 既存の点群を削除して再生成
      scene.remove(pointCloud);
      geometry.dispose();
      material.dispose();

      // Offcanvas から読み直して再生成
      const newResTheta = parseInt(document.getElementById('input-res-theta').value, 10);
      const newResPhi   = parseInt(document.getElementById('input-res-phi').value, 10);
      const newProjType = document.querySelector('input[name="proj-type"]:checked').value;

      const newPointsData = createQuaternionStereographicPoints(newResTheta, newResPhi, newProjType);

      // 同様に BufferGeometry + PointsMaterial を用意してシーンに追加
      const newGeo = new THREE.BufferGeometry();
      const m = newPointsData.length;
      const newPos = new Float32Array(m * 3);
      const newCol = new Float32Array(m * 3);

      newPointsData.forEach((pt, i) => {
        newPos[3 * i + 0] = pt.position.x;
        newPos[3 * i + 1] = pt.position.y;
        newPos[3 * i + 2] = pt.position.z;
        newCol[3 * i + 0] = pt.color.r;
        newCol[3 * i + 1] = pt.color.g;
        newCol[3 * i + 2] = pt.color.b;
      });
      newGeo.setAttribute('position', new THREE.BufferAttribute(newPos, 3));
      newGeo.setAttribute('color', new THREE.BufferAttribute(newCol, 3));

      const newMat = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.03,
        sizeAttenuation: true,
      });

      const newPointCloud = new THREE.Points(newGeo, newMat);
      scene.add(newPointCloud);
    });
  }
}
