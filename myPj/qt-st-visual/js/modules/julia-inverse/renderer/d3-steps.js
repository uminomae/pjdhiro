// js/3d/d3-steps.js

import { Complex } from '../util/complex-number.js';
import { createColoredPoints3D } from './d3-utils.js';
import { pauseAwareSleep as sleep } from '../util/sleep.js';

import {
  DRAW_PARAMS,
  STAGE_NAMES,
  OBJECT_NAMES,
  ERROR_MESSAGES
} from '../d3-config.js';

/**
 * step1_subtract3D
 * ・currentGen: Complex[]
 * ・c: Complex
 * ・prevWhiteName: 前世代 白点の name
 * ・iter: 世代番号
 * ・steps: 補間ステップ数
 * ・interval: ms
 * ・pointSize: 点サイズ（default は config から参照）
 *
 * @returns {Promise<Complex[]>} diffPts
 */
export async function step1_subtract3D(
  scene,
  currentGen,
  c,
  prevWhiteName,
  iter,
  steps,
  interval,
  pointSize = DRAW_PARAMS.pointSize
) {
  // (1) wPoints → diffPts を計算
  const diffPts = currentGen.map(w => w.sub(c));

  // (2) 線形補間アニメーション
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;

    // (i) 前世代 白点 を再描画
    const existingPrev = scene.getObjectByName(prevWhiteName);
    if (existingPrev) scene.remove(existingPrev);
    const ptsWhitePrev = createColoredPoints3D(
      scene,
      currentGen,
      STAGE_NAMES.init,
      iter - 1,
      pointSize,
      prevWhiteName
    );
    scene.add(ptsWhitePrev);

    // (ii) currentGen → diffPts の線形補間を表示 (stage='subtract')
    const interpPts = currentGen.map((w, i) => {
      const d = diffPts[i];
      const x = w.re * (1 - t) + d.re * t;
      const y = w.im * (1 - t) + d.im * t;
      return new Complex(x, y);
    });
    const existingInterp = scene.getObjectByName(OBJECT_NAMES.subtractInterp);
    if (existingInterp) scene.remove(existingInterp);
    const ptsSubtract = createColoredPoints3D(
      scene,
      interpPts,
      STAGE_NAMES.subtract,
      iter,
      pointSize,
      OBJECT_NAMES.subtractInterp
    );
    scene.add(ptsSubtract);

    await sleep(interval / steps);

    // (iii) オレンジ点を消して次へ
    scene.remove(ptsSubtract);
    scene.remove(ptsWhitePrev);
  }

  // (3) 最終 diffPts を一度だけ白点（stage='subtract'）で描画
  const ptsDiffFinal = createColoredPoints3D(
    scene,
    diffPts,
    STAGE_NAMES.subtract,
    iter,
    pointSize,
    OBJECT_NAMES.diffFinal
  );
  scene.add(ptsDiffFinal);
  await sleep(interval / steps);
  scene.remove(ptsDiffFinal);

  return diffPts;
}

/**
 * step2_sqrt1_3D
 * ・diffPts: Complex[]
 * ・prevWhiteName: 前世代 白点の name
 * ・iter: 世代番号
 * ・steps: 補間ステップ数
 * ・interval: ms
 * ・pointSize: 点サイズ（default は config から参照）
 *
 * @returns {Promise<Complex[]>} sqrtPts1
 */
export async function step2_sqrt1_3D(
  scene,
  diffPts,
  prevWhiteName,
  iter,
  steps,
  interval,
  pointSize = DRAW_PARAMS.pointSize
) {
  const N = diffPts.length;
  const diffPhis = [];
  const diffRs   = [];
  for (let i = 0; i < N; i++) {
    const d = diffPts[i];
    const r = d.abs();
    let phi = Math.atan2(d.im, d.re);
    if (phi < 0) phi += 2 * Math.PI;
    diffPhis.push(phi);
    diffRs.push(r);
  }

  // √ステップ①（第一解）を計算
  const sqrtPts1 = [];
  for (let i = 0; i < N; i++) {
    const r0  = diffRs[i];
    const phi = diffPhis[i];
    const sqrtR = Math.sqrt(r0);
    const phi0  = phi / 2;
    sqrtPts1.push(new Complex(
      sqrtR * Math.cos(phi0),
      sqrtR * Math.sin(phi0)
    ));
  }

  // 極座標補間アニメーション
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;

    // (i) 前世代「白点」（diffPts を白）を描く
    const existingWhite = scene.getObjectByName(prevWhiteName);
    if (existingWhite) scene.remove(existingWhite);
    const ptsWhitePrev = createColoredPoints3D(
      scene,
      diffPts,
      STAGE_NAMES.subtract,
      iter - 1,
      pointSize,
      prevWhiteName
    );
    scene.add(ptsWhitePrev);

    // (ii) diffPts を白で表示
    const existingDiffWhite = scene.getObjectByName(OBJECT_NAMES.diffWhite2);
    if (existingDiffWhite) scene.remove(existingDiffWhite);
    const ptsDiffWhite2 = createColoredPoints3D(
      scene,
      diffPts,
      STAGE_NAMES.subtract,
      iter,
      pointSize,
      OBJECT_NAMES.diffWhite2
    );
    scene.add(ptsDiffWhite2);

    // (iii) diffPts → sqrtPts1 補間を黄色で表示
    const interpPts = [];
    for (let i = 0; i < N; i++) {
      const r0   = diffRs[i];
      const phi0 = diffPhis[i];
      const z1   = sqrtPts1[i];
      let phi1   = Math.atan2(z1.im, z1.re);
      if (phi1 < 0) phi1 += 2 * Math.PI;
      const r1 = z1.abs();

      let dphi = phi1 - phi0;
      if (dphi > Math.PI)      dphi -= 2 * Math.PI;
      else if (dphi < -Math.PI) dphi += 2 * Math.PI;

      const r_t   = r0 * (1 - t) + r1 * t;
      const phi_t = phi0 + dphi * t;
      const x = r_t * Math.cos(phi_t);
      const y = r_t * Math.sin(phi_t);
      interpPts.push(new Complex(x, y));
    }

    const existingYellow = scene.getObjectByName(OBJECT_NAMES.yellow);
    if (existingYellow) scene.remove(existingYellow);
    const ptsYellow = createColoredPoints3D(
      scene,
      interpPts,
      STAGE_NAMES.sqrt1,
      iter,
      pointSize,
      OBJECT_NAMES.yellow
    );
    scene.add(ptsYellow);

    await sleep(interval / steps);

    // (iv) 黄色を消して次ループへ
    scene.remove(ptsYellow);
    scene.remove(ptsDiffWhite2);
    scene.remove(ptsWhitePrev);
  }

  // (3) 最終 sqrtPts1 を一度だけ黄色で描画して返す
  const ptsYellowFinal = createColoredPoints3D(
    scene,
    sqrtPts1,
    STAGE_NAMES.sqrt1,
    iter,
    pointSize,
    OBJECT_NAMES.yellowFinal
  );
  scene.add(ptsYellowFinal);
  await sleep(interval / steps);
  scene.remove(ptsYellowFinal);

  return sqrtPts1;
}

/**
 * step3_sqrt2_3D
 * ・diffPts: Complex[]
 * ・sqrtPts1: Complex[]
 * ・prevWhiteName: 前世代 白点の name
 * ・iter: 世代番号
 * ・steps: 補間ステップ数
 * ・interval: ms
 * ・pointSize: 点サイズ（default は config から参照）
 *
 * @returns {Promise<Complex[]>} combinedPts
 */
export async function step3_sqrt2_3D(
  scene,
  diffPts,
  sqrtPts1,
  prevWhiteName,
  iter,
  steps,
  interval,
  pointSize = DRAW_PARAMS.pointSize
) {
  const N = diffPts.length;
  const diffPhis = [];
  const diffRs   = [];

  // (1) diffPts の極座標を再計算
  for (let i = 0; i < N; i++) {
    const d = diffPts[i];
    const r = d.abs();
    let phi = Math.atan2(d.im, d.re);
    if (phi < 0) phi += 2 * Math.PI;
    diffPhis.push(phi);
    diffRs.push(r);
  }

  // (2) 第二解 sqrtPts2 を計算
  const sqrtPts2 = [];
  for (let i = 0; i < N; i++) {
    const r0  = diffRs[i];
    const phi = diffPhis[i];
    const sqrtR = Math.sqrt(r0);
    const phi2  = phi / 2 + Math.PI;
    sqrtPts2.push(new Complex(
      sqrtR * Math.cos(phi2),
      sqrtR * Math.sin(phi2)
    ));
  }

  // (3) 補間ループ
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;

    // (i) “黄色 (sqrtPts1)” を描く
    const existingYellowKeep = scene.getObjectByName(OBJECT_NAMES.yellowKeep);
    if (existingYellowKeep) scene.remove(existingYellowKeep);
    const ptsYellowKeep = createColoredPoints3D(
      scene,
      sqrtPts1,
      STAGE_NAMES.sqrt1,
      iter,
      pointSize,
      OBJECT_NAMES.yellowKeep
    );
    scene.add(ptsYellowKeep);

    // (ii) “diffPts” を白で描く
    const existingDiffKeep = scene.getObjectByName(OBJECT_NAMES.diffKeep);
    if (existingDiffKeep) scene.remove(existingDiffKeep);
    const ptsDiffKeep = createColoredPoints3D(
      scene,
      diffPts,
      STAGE_NAMES.subtract,
      iter,
      pointSize,
      OBJECT_NAMES.diffKeep
    );
    scene.add(ptsDiffKeep);

    // (iii) diffPts → sqrtPts2 補間を “ピンク” で表示
    const interpPts = [];
    for (let i = 0; i < N; i++) {
      const r0   = diffRs[i];
      const phi0 = diffPhis[i];
      const z2   = sqrtPts2[i];
      let phi2   = Math.atan2(z2.im, z2.re);
      if (phi2 < 0) phi2 += 2 * Math.PI;
      const r2 = z2.abs();
      let dphi = phi2 - phi0;
      if (dphi > Math.PI)      dphi -= 2 * Math.PI;
      else if (dphi < -Math.PI) dphi += 2 * Math.PI;
      const r_t   = r0 * (1 - t) + r2 * t;
      const phi_t = phi0 + dphi * t;
      const x = r_t * Math.cos(phi_t);
      const y = r_t * Math.sin(phi_t);
      interpPts.push(new Complex(x, y));
    }
    const existingPink = scene.getObjectByName(OBJECT_NAMES.pink);
    if (existingPink) scene.remove(existingPink);
    const ptsPink = createColoredPoints3D(
      scene,
      interpPts,
      STAGE_NAMES.sqrt2,
      iter,
      pointSize,
      OBJECT_NAMES.pink
    );
    scene.add(ptsPink);

    await sleep(interval / steps);

    // (iv) ピンクを消去して次へ
    scene.remove(ptsPink);
    scene.remove(ptsDiffKeep);
    scene.remove(ptsYellowKeep);
  }

  // (4) 第一解＋第二解を統合して “白リカラー” を一度だけ表示
  const combinedPts = sqrtPts1.concat(sqrtPts2);
  const ptsWhiteFinal = createColoredPoints3D(
    scene,
    combinedPts,
    STAGE_NAMES.recolor,
    iter,
    pointSize,
    OBJECT_NAMES.whiteFinal
  );
  scene.add(ptsWhiteFinal);
  await sleep(interval);
  scene.remove(ptsWhiteFinal);

  return combinedPts;
}
