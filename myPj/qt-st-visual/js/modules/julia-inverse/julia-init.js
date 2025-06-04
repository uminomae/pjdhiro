// js/modules/julia-inverse/init.js
// import { THREE, OrbitControls } from '../app.js';
import * as THREE from 'three';
// import { generateJuliaInversePoints } from './utils.js';

export function initialize({ scene, camera, renderer, controls }) {
  // Offcanvas から Julia のパラメータを取得
  // const cre = parseFloat(document.getElementById('cReInput').value);
  // const cim = parseFloat(document.getElementById('cImInput').value);
  // const samples = parseInt(document.getElementById('samplesInput').value, 10);
  // const maxIter = parseInt(document.getElementById('maxIterInput').value, 10);


  // 点群を生成
//   const pointsData = generateJuliaInversePoints(cre, cim, samples, maxIter);
    console.log('julia-init.js fin');

  // BufferGeometry と PointsMaterial を作成し、scene.add() する
  // （四元数版とほぼ同様の流れなので省略）
  // …
}
