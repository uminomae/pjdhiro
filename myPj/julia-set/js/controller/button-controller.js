// js/controller/button-controller.js

import { DRAW_PARAMS, LEGEND_DEFAULT, FORM_DEFAULTS } from '../3d/d3-config.js';

const btnRun   = document.getElementById('btn-run');
const btnPause = document.getElementById('btn-pause');
const btnStop  = document.getElementById('btn-stop');
const status   = document.getElementById('status');

if (btnRun) {
  btnRun.addEventListener('click', async () => {
    // ─── ここで「前回の描画をクリア」 ───
    if (window.scene) {
      // scene 内の Points（点群）をすべて収集して削除
      const toRemove = [];
      window.scene.traverse(obj => {
        if (obj.isPoints) toRemove.push(obj);
      });
      toRemove.forEach(p => window.scene.remove(p));
      // animateLoop が動作していれば自動で再描画される
    }
    // ──────────────────────────────

    if (!window.isRunning) {
      // フォームから値を取得
      const inputRe   = document.getElementById('input-re');
      const inputIm   = document.getElementById('input-im');
      const inputN    = document.getElementById('input-n');
      const inputIter = document.getElementById('input-iter');

      const cre     = parseFloat(inputRe.value);
      const cim     = parseFloat(inputIm.value);
      const c       = new window.Complex(cre, cim);
      const N       = parseInt(inputN.value, 10);
      const maxIter = parseInt(inputIter.value, 10);

      window.isRunning = true;
      window.isPaused  = false;
      window.isStopped = false;

      btnRun.classList.add('d-none');
      btnPause.classList.remove('d-none');
      status.textContent = '(実行中…)';

      try {
        const { minZ, maxZ, totalPoints } = await window.runInverseAnimation(
          c,
          N,
          maxIter,
          DRAW_PARAMS.interval
        );
        window.isRunning = false;

        btnPause.classList.add('d-none');
        btnPause.textContent = 'Pause';
        btnRun.textContent   = 'Run';
        btnRun.classList.remove('d-none');
        status.textContent = `(完了: N=${N}, maxIter=${maxIter}, 点数=${totalPoints})`;

        // 凡例再描画
        window.drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
      } catch (err) {
        window.isRunning = false;
        btnPause.classList.add('d-none');
        btnPause.textContent = 'Pause';
        btnRun.textContent   = 'Run';
        btnRun.classList.remove('d-none');
        status.textContent = '(Stopped)';
      }
    } else if (window.isPaused) {
      window.isPaused = false;
      btnPause.textContent = 'Pause';
      status.textContent   = '(実行中…)';
    }
  });
}

if (btnPause) {
  btnPause.addEventListener('click', () => {
    if (!window.isPaused) {
      window.isPaused = true;
      btnPause.textContent = 'Resume';
      status.textContent   = '(Paused)';
    } else {
      window.isPaused = false;
      btnPause.textContent = 'Pause';
      status.textContent   = '(実行中…)';
    }
  });
}

if (btnStop) {
  btnStop.addEventListener('click', () => {
    window.isStopped = true;
    window.isPaused  = false;
    window.isRunning = false;

    // Three.js のシーン上のポイント群をクリア
    const toRemove = [];
    window.scene.traverse(obj => {
      if (obj.isPoints) toRemove.push(obj);
    });
    toRemove.forEach(p => window.scene.remove(p));

    btnPause.classList.add('d-none');
    btnPause.textContent = 'Pause';
    btnRun.textContent   = 'Run';
    btnRun.classList.remove('d-none');
    status.textContent = '(待機中)';

    // 凡例だけ初期状態に戻す
    window.drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);

    // フォーム項目を初期値に戻す
    document.getElementById('input-re').value   = FORM_DEFAULTS.re;
    document.getElementById('input-im').value   = FORM_DEFAULTS.im;
    document.getElementById('input-n').value    = FORM_DEFAULTS.N;
    document.getElementById('input-iter').value = FORM_DEFAULTS.maxIter;
  });
}
