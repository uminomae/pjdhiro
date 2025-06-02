// js/threeInverseAnimate-main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Complex } from '../complex.js';
import { computeInverseGeneration, generateUnitCircle } from './3dInverseLogic.js';
import { getZ } from './3dHeightFunction.js';

/**
 * Three.js 版・逆写像アニメーションの本体モジュールです。
 *
 * １．initThree()    → scene/camera/renderer/controls を初期化
 * ２．animateLoop()  → レンダリングループを開始
 * ３．runInverseAnimation() →
 *       各世代ごとに（①引き算ステップ → ②√ステップ① → ③√ステップ② → ④白リカラー）
 *       を Three.js 上で線形補間付きで描画しつつ、Z 値を “赤チャネルの強度” にマッピング
 * ────────────────────────────────────────────────────────────────
 */

export let scene, camera, renderer, controls;

/**
 * initThree()
 * ── シーン・カメラ・レンダラー・OrbitControls・ヘルパーを初期化 ──
 */
export function initThree() {
  const container = document.getElementById('canvas-container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(-3, -7, 7);
  camera.up.set(0, 0, 1);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  // 軸ヘルパー (X:赤, Y:緑, Z:青)
  const axesHelper = new THREE.AxesHelper(1.5);
  scene.add(axesHelper);

  // グリッドヘルパー (XY 平面)
  const gridHelper = new THREE.GridHelper(2, 20, 0x333333, 0x222222);
  gridHelper.rotation.x = Math.PI / 2;
  scene.add(gridHelper);

  // ウィンドウリサイズ対応
  window.addEventListener('resize', () => {
    const c = document.getElementById('canvas-container');
    camera.aspect = c.clientWidth / c.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(c.clientWidth, c.clientHeight);
  });
}

/**
 * animateLoop()
 * ── レンダリングループを開始し、OrbitControls の update と renderer.render を呼ぶ ──
 */
export function animateLoop() {
  requestAnimationFrame(animateLoop);
  controls.update();
  renderer.render(scene, camera);
}

/**
 * runInverseAnimation(c, N, maxIter, interval)
 *
 * 逆写像を「①引き算 → ②√ステップ① → ③√ステップ② → ④白リカラー」の順に
 * 全世代分アニメーションで可視化します。
 * 各ステップでは、getZ(...) で得られた Z 値を「赤チャネルの強度」にマッピングします。
 *
 * @param {Complex} c       - Julia 定数
 * @param {number}  N       - 単位円のサンプル数
 * @param {number}  maxIter - 何世代まで逆写像を行うか
 * @param {number}  interval- 世代を更新する間隔（ms）
 */
export async function runInverseAnimation(c, N = 200, maxIter = 4, interval = 800) {
  // (1) 初期世代: 単位円
  let currentGen = generateUnitCircle(N); // Complex[]

  // (2) 前世代の「白点」を保持する配列（初期は単位円を白で表示するため参照）
  let prevWhitePts = currentGen.slice();

  // ─── ここから各世代ごとにサブステップを描画 ───

/**
 * createColoredPoints(points, baseColor, stage, iter)
 *
 * ・points: Complex[] の配列
 * ・stage, iter: 情報として渡します（getZ で利用）
 *
 * Z = getZ(z, {stage, iter}) をすべての点で計算し、
 *  1) Zvalue を配列に集める
 *  2) maxZ = その配列の最大値（最低でも 1e-6）を求める
 *  3) 各点について intensity = Zvalue / maxZ を計算
 *  4) hue = (1 - intensity) * 240  → HSL 形式の色相
 *  5) THREE.Color(`hsl(${hue},100%,50%)`) で RGB に変換して頂点カラーを設定
 */
function createColoredPoints(points, baseColor, stage, iter) {
  // (1) 全点の Z 値を一旦配列に集める
  const zValues = points.map(z => getZ(z, { stage, iter }));
  // (2) maxZ を求める（0SS防止で最低値を 1e-6 に）
  const maxZ = Math.max(...zValues, 1e-6);

  // 頂点バッファ用の TypedArray
  const posArray = new Float32Array(points.length * 3);
  const colArray = new Float32Array(points.length * 3);

  for (let i = 0; i < points.length; i++) {
    const zPt    = points[i];
    const X      = zPt.re;
    const Y      = zPt.im;
    const Zvalue = zValues[i];

    // 座標をセット
    posArray[i * 3 + 0] = X;
    posArray[i * 3 + 1] = Y;
    posArray[i * 3 + 2] = Zvalue;

    // (3) Z → [0,1] に正規化
    const intensity = Zvalue / maxZ; // 0 ≤ intensity ≤ 1

    // (4) 色相を 0～240° の範囲にマッピング
    //     intensity=0 → Hue=240 (青)
    //     intensity=1 → Hue=0   (赤)
    const hue = (1 - intensity) * 240;

    // (5) HSL を THREE.Color にして RGB に変換
    const tmpCol = new THREE.Color(`hsl(${hue},100%,50%)`);
    colArray[i * 3 + 0] = tmpCol.r;
    colArray[i * 3 + 1] = tmpCol.g;
    colArray[i * 3 + 2] = tmpCol.b;
  }

  // BufferGeometry＋頂点カラー属性を作成
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colArray,    3));

  const material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true
  });

  const pointsObj = new THREE.Points(geometry, material);
  return pointsObj;
}

  // (3) 世代0：単位円を「Z=ノルム→赤チャネル正規化」で描画（白い点ではなく、Z で色を割り当て）
  let pts0 = createColoredPoints(currentGen, '#ffffff', 'init', 0);
  scene.add(pts0);

  // しばらく待ってから次の世代へ
  await new Promise(res => setTimeout(res, interval));

  // (4) 各世代を順次処理
  for (let iter = 1; iter <= maxIter; iter++) {
    // —— ステップ①：引き算ステップ —— 
    // currentGen → diffPts を線形補間しながら「Z→赤強度」で描画
    const diffPts = currentGen.map(z => z.sub(c));
    const steps   = 30;

    for (let k = 1; k <= steps; k++) {
      const t = k / steps;

      // (i) 前世代の白点を消してから再描画（Z で色を付ける）
      scene.remove(pts0);
      const ptsPrevWhite = createColoredPoints(prevWhitePts, '#ffffff', 'init', iter - 1);
      scene.add(ptsPrevWhite);

      // (ii) currentGen → diffPts をオレンジ（色は無視して Z→赤強度で上書き）で補間しつつ描画
      const interpPts = currentGen.map((w, i) => {
        const d = diffPts[i];
        const x = w.re * (1 - t) + d.re * t;
        const y = w.im * (1 - t) + d.im * t;
        return new Complex(x, y);
      });
      scene.remove(ptsPrevWhite);
      const ptsOrange = createColoredPoints(interpPts, 'orange', 'subtract', iter);
      scene.add(ptsOrange);

      await new Promise(res => setTimeout(res, interval / steps));

      scene.remove(ptsOrange);
    }

    // ここで最終的な diffPts (= w - c) を一度だけ描画して次のステップへ渡す
    const ptsDiffFinal = createColoredPoints(diffPts, '#ffffff', 'subtract', iter);
    scene.add(ptsDiffFinal);
    await new Promise(res => setTimeout(res, interval / steps));
    scene.remove(ptsDiffFinal);

    // —— ステップ②：√ステップ①（第一解・黄色） —— 
    const sqrtPts1   = [];
    const diffPhis   = [];
    const diffRs     = [];

    for (let i = 0; i < diffPts.length; i++) {
      const d    = diffPts[i];
      const r    = d.abs();
      let phi    = Math.atan2(d.im, d.re);
      if (phi < 0) phi += 2 * Math.PI;
      diffPhis.push(phi);
      diffRs.push(r);

      const sqrtR = Math.sqrt(r);
      const phi0  = phi / 2;
      sqrtPts1.push(new Complex(
        sqrtR * Math.cos(phi0),
        sqrtR * Math.sin(phi0)
      ));
    }

    for (let k = 1; k <= steps; k++) {
      const t = k / steps;

      // (i) 前世代の白点を描画
      if (scene.getObjectByName('ptsPrevWhite')) {
        scene.remove(scene.getObjectByName('ptsPrevWhite'));
      }
      const ptsPrevWhite = createColoredPoints(prevWhitePts, '#ffffff', 'init', iter - 1);
      ptsPrevWhite.name = 'ptsPrevWhite';
      scene.add(ptsPrevWhite);

      // (ii) diffPts を一旦描画
      if (scene.getObjectByName('ptsDiffFinal')) {
        scene.remove(scene.getObjectByName('ptsDiffFinal'));
      }
      const ptsDiffWhite = createColoredPoints(diffPts, '#ffffff', 'subtract', iter);
      ptsDiffWhite.name = 'ptsDiffFinal';
      scene.add(ptsDiffWhite);

      // (iii) diffPts → sqrtPts1 を線形補間（極座標補間）しつつ描画
      const interpSqrt1 = diffPts.map((d, i) => {
        const r0   = diffRs[i];
        const phi0 = diffPhis[i];
        const z1   = sqrtPts1[i];
        let phi1   = Math.atan2(z1.im, z1.re);
        if (phi1 < 0) phi1 += 2 * Math.PI;
        const r1 = z1.abs();
        let dphi = phi1 - phi0;
        if (dphi > Math.PI) dphi -= 2 * Math.PI;
        else if (dphi < -Math.PI) dphi += 2 * Math.PI;
        const r_t   = r0 * (1 - t) + r1 * t;
        const phi_t = phi0 + dphi * t;
        const x = r_t * Math.cos(phi_t);
        const y = r_t * Math.sin(phi_t);
        return new Complex(x, y);
      });
      if (scene.getObjectByName('ptsYellow')) {
        scene.remove(scene.getObjectByName('ptsYellow'));
      }
      const ptsYellow = createColoredPoints(interpSqrt1, 'yellow', 'sqrt1', iter);
      ptsYellow.name = 'ptsYellow';
      scene.add(ptsYellow);

      await new Promise(res => setTimeout(res, interval / steps));

      scene.remove(ptsYellow);
      scene.remove(ptsDiffWhite);
      scene.remove(ptsPrevWhite);
    }

    // ステップ②終了後、最終的な sqrtPts1 を一度だけ描画
    const ptsYellowFinal = createColoredPoints(sqrtPts1, 'yellow', 'sqrt1', iter);
    ptsYellowFinal.name = 'ptsYellowFinal';
    scene.add(ptsYellowFinal);
    await new Promise(res => setTimeout(res, interval / steps));
    scene.remove(ptsYellowFinal);

    // —— ステップ③：√ステップ②（第二解・ピンク） —— 
    const sqrtPts2 = [];
    for (let i = 0; i < diffPts.length; i++) {
      const r   = diffRs[i];
      const phi = diffPhis[i];
      const sqrtR = Math.sqrt(r);
      const phi1  = phi / 2 + Math.PI;
      sqrtPts2.push(new Complex(
        sqrtR * Math.cos(phi1),
        sqrtR * Math.sin(phi1)
      ));
    }

    for (let k = 1; k <= steps; k++) {
      const t = k / steps;

      // (i) 黄色 (sqrtPts1) を表示
      if (scene.getObjectByName('ptsYellowKeep')) {
        scene.remove(scene.getObjectByName('ptsYellowKeep'));
      }
      const ptsYellowPersist = createColoredPoints(sqrtPts1, 'yellow', 'sqrt1', iter);
      ptsYellowPersist.name = 'ptsYellowKeep';
      scene.add(ptsYellowPersist);

      // (ii) diffPts を表示
      if (scene.getObjectByName('ptsDiffFinal2')) {
        scene.remove(scene.getObjectByName('ptsDiffFinal2'));
      }
      const ptsDiffWhite2 = createColoredPoints(diffPts, '#ffffff', 'subtract', iter);
      ptsDiffWhite2.name = 'ptsDiffFinal2';
      scene.add(ptsDiffWhite2);

      // (iii) diffPts → sqrtPts2 を極座標補間してピンクで表示
      const interpSqrt2 = diffPts.map((d, i) => {
        const r0   = diffRs[i];
        const phi0 = diffPhis[i];
        const z2   = sqrtPts2[i];
        let phi2   = Math.atan2(z2.im, z2.re);
        if (phi2 < 0) phi2 += 2 * Math.PI;
        const r2 = z2.abs();
        let dphi = phi2 - phi0;
        if (dphi > Math.PI) dphi -= 2 * Math.PI;
        else if (dphi < -Math.PI) dphi += 2 * Math.PI;
        const r_t   = r0 * (1 - t) + r2 * t;
        const phi_t = phi0 + dphi * t;
        const x = r_t * Math.cos(phi_t);
        const y = r_t * Math.sin(phi_t);
        return new Complex(x, y);
      });
      if (scene.getObjectByName('ptsPink')) {
        scene.remove(scene.getObjectByName('ptsPink'));
      }
      const ptsPink = createColoredPoints(interpSqrt2, 'pink', 'sqrt2', iter);
      ptsPink.name = 'ptsPink';
      scene.add(ptsPink);

      await new Promise(res => setTimeout(res, interval / steps));

      scene.remove(ptsPink);
      scene.remove(ptsDiffWhite2);
      scene.remove(ptsYellowPersist);
    }

    // 最終的な sqrtPts1 + sqrtPts2 をピンクと黄色を統合して一度だけ表示
    const combined = sqrtPts1.concat(sqrtPts2);
    const ptsCombined = createColoredPoints(combined, '#ffffff', 'sqrt2', iter);
    ptsCombined.name = 'ptsCombined';
    scene.add(ptsCombined);
    await new Promise(res => setTimeout(res, interval / steps));
    scene.remove(ptsCombined);

    // —— ステップ④：白リカラー —— 
    const ptsWhiteFinal = createColoredPoints(combined, '#ffffff', 'recolor', iter);
    ptsWhiteFinal.name = 'ptsWhiteFinal';
    scene.add(ptsWhiteFinal);

    await new Promise(res => setTimeout(res, interval));

    // 最終世代でなければ次世代へ
    if (iter < maxIter) {
      scene.remove(ptsWhiteFinal);
      prevWhitePts = combined.slice();
      currentGen   = combined.slice();
    }
  }
}
