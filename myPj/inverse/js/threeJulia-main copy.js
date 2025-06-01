// js/threeJulia-main.js

// ─── Three.js を CDN から取得 ───
import * as THREE from 'https://unpkg.com/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// ─── 自作モジュールを相対パスで取得 ───
import { Complex } from './complex.js';
import { generateCirclePoints } from './circle.js';

// ── ここから三次元描画スクリプト ──

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, -3, 3);
camera.up.set(0, 0, 1);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const axesHelper = new THREE.AxesHelper(1.5);
scene.add(axesHelper);

const samples = 200;
function getHeight(complex) {
  return complex.abs();
}
const pts2D = generateCirclePoints(samples);

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(samples * 3);
for (let i = 0; i < samples; i++) {
  const c = pts2D[i];
  positions[i * 3 + 0] = c.re;
  positions[i * 3 + 1] = c.im;
  positions[i * 3 + 2] = getHeight(c);
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  size: 0.02,
  vertexColors: false,
  color: 0xffff00
});
const pointCloud = new THREE.Points(geometry, material);
scene.add(pointCloud);

const gridHelper = new THREE.GridHelper(2, 20, 0x333333, 0x222222);
gridHelper.rotation.x = Math.PI / 2;
scene.add(gridHelper);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
