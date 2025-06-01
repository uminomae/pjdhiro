// js/main.js

import { Complex } from './complex.js';
import { generateCirclePoints } from './circle.js';
import { drawPoints } from './draw.js';
import {
  animateInverseWithPause,
  pauseAnimation,
  resumeAnimation
} from './inverseAnimate.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('inverse-canvas');
  if (!canvas) {
    console.error('Canvas 要素 (#inverse-canvas) が見つかりません。');
    return;
  }
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const cx = W / 2;
  const cy = H / 2;
  const scale = 200;

  // フォーム要素を取得
  const cReInput = document.getElementById('cRe');
  const cImInput = document.getElementById('cIm');
  const samplesInput = document.getElementById('samples');
  const maxIterInput = document.getElementById('maxIter');
  const pauseMsInput = document.getElementById('pauseMs');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resumeBtn = document.getElementById('resume-btn');

  let animationStarted = false;

  startBtn.addEventListener('click', () => {
    if (animationStarted) {
      console.warn('すでにアニメーションが開始されています。');
      return;
    }

    // 入力値を読み取る
    const cRe = parseFloat(cReInput.value);
    const cIm = parseFloat(cImInput.value);
    const samples = parseInt(samplesInput.value, 10);
    const maxIter = parseInt(maxIterInput.value, 10);
    const pauseMs = parseInt(pauseMsInput.value, 10);

    // 入力チェック
    if (isNaN(cRe) || isNaN(cIm) || isNaN(samples) || isNaN(maxIter) || isNaN(pauseMs)) {
      alert('すべてのパラメータを正しく入力してください。');
      return;
    }

    animationStarted = true;
    startBtn.disabled = true;

    // Julia の定数 c
    const c = new Complex(cRe, cIm);

    // 単位円上の点列をサンプリング
    const initPts = generateCirclePoints(samples);

    // アニメーションを開始
    animateInverseWithPause(
      ctx,
      cx,
      cy,
      scale,
      c,
      initPts,
      maxIter,
      drawPoints,
      pauseMs
    );
  });

  // 一時停止・再生ボタンのイベント設定
  pauseBtn.addEventListener('click', () => {
    pauseAnimation();
  });
  resumeBtn.addEventListener('click', () => {
    resumeAnimation();
  });
});
