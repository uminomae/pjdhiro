// js/controller/button-ui.js

import { DRAW_PARAMS, LEGEND_DEFAULT, FORM_DEFAULTS } from '../../3d/d3-config.js';
import { Complex } from '../../util/complex-number.js';

const btnRun   = document.getElementById('btn-run');
const btnPause = document.getElementById('btn-pause');
const btnStop  = document.getElementById('btn-stop');
const status   = document.getElementById('status');

if (btnRun) {
  btnRun.addEventListener('click', async () => {
    // ─── ここで「前回の描画をクリア」 ───
    if (window.scene) {
      const toRemove = [];
      window.scene.traverse(obj => {
        if (obj.isPoints) toRemove.push(obj);
      });
      toRemove.forEach(p => window.scene.remove(p));
    }
    // ──────────────────────────────

    if (!window.isRunning) {
      // ● フォーム値を取得
      const inputRe   = document.getElementById('input-re');
      const inputIm   = document.getElementById('input-im');
      const inputN    = document.getElementById('input-n');
      const inputIter = document.getElementById('input-iter');

      const cre     = parseFloat(inputRe.value);
      const cim     = parseFloat(inputIm.value);
      // const c       = new window.Complex(cre, cim);
      const c       = new Complex(cre, cim);
      const N       = parseInt(inputN.value, 10);
      const maxIter = parseInt(inputIter.value, 10);

      window.isRunning = true;
      window.isPaused  = false;
      window.isStopped = false;

      btnRun.classList.add('d-none');
      btnPause.classList.remove('d-none');
      status.textContent = '(実行中…)';

      try {
        // runInverseAnimation の第４引数（interval）は config から取得
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

        // 完了時に凡例を再描画（minZ, maxZ は戻り値）
        window.drawLegend(minZ, maxZ);
      } catch (err) {
        // Stop されたときなど例外が飛んできた場合
        window.isRunning = false;
        btnPause.classList.add('d-none');
        btnPause.textContent = 'Pause';
        btnRun.textContent   = 'Run';
        btnRun.classList.remove('d-none');
        status.textContent = '(Stopped)';
      }
    } else if (window.isPaused) {
      // 「Run 押下 → 一時停止 → 再度 Run（Resume）」のとき
      window.isPaused = false;
      btnPause.textContent = 'Pause';
      status.textContent   = '(実行中…)';
    }
  });
}

if (btnPause) {
  btnPause.addEventListener('click', () => {
    if (!window.isPaused) {
      // 一時停止
      window.isPaused = true;
      btnPause.textContent = 'Resume';
      status.textContent   = '(Paused)';
    } else {
      // 再開
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

    // Three.js シーンのポイントを全消し
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

    // 凡例を初期状態に戻す（Config の初期値を参照）
    window.drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);

    // フォームを初期値に戻す
    document.getElementById('input-re').value   = FORM_DEFAULTS.re;
    document.getElementById('input-im').value   = FORM_DEFAULTS.im;
    document.getElementById('input-n').value    = FORM_DEFAULTS.N;
    document.getElementById('input-iter').value = FORM_DEFAULTS.maxIter;
  });
}
