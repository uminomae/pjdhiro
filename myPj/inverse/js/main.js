// js/main.js

import { Complex }                 from './complex.js';
import { generateCirclePoints }    from './circle.js';
import { drawPoints }              from './draw.js';
import { animateInverseWithPause } from './inverseAnimate.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('inverse-canvas');
  if (!canvas) {
    console.error('Canvas 要素 (#inverse-canvas) が見つかりません。');
    return;
  }
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Canvas の中心座標
  const cx = W / 2;
  const cy = H / 2;

  // 複素平面上の「長さ 1」を 200px として扱う
  const scale = 200;

  // Julia の定数 c
  const c = new Complex(-0.33, 0.77);

  // 単位円を何分割してサンプリングするか (例：360)
  const samples = 360;

  // 逆写像を何世代繰り返すか (例：10)
  const maxIter = 10;

  // 各ステップ (扇形／内側収縮) ごとの停止時間 (ミリ秒)
  const pauseMs = 3000;

  // 1) 単位円上の点列を生成
  const initPts = generateCirclePoints(samples);

  // 2) アニメーションを開始
  //    「扇形ができたら 0.1 秒停止 → 内側に収縮(緑)を描いて 0.1 秒停止 → 次世代…」を maxIter 回繰り返す
  animateInverseWithPause(ctx, cx, cy, scale, c, initPts, maxIter, drawPoints, pauseMs);
});
